#define DEBUG

// INCLUDES
#include "Adafruit_seesaw.h"
#include <seesaw_neopixel.h>
#include <WiFiNINA.h>
#include <PubSubClient.h>

// CONTSTANTS
// ______JACK SOCKETS_________

//Check if cables are complete to enable next part
bool cablesCompleted = false;

// Total number of sockets
const byte numSockets = 12;

// The array of pins to which each socket is connected
const byte signalPins[numSockets] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13 };

// Needed connections (half of numSockets)
const byte numConnections = 6;

// Connection pairs (based on place in pins array)
const byte connections[numConnections][2] = { {0,1}, {2, 3}, {4, 5}, {6,7}, {8, 9}, {10, 11} };

// ______BUTTONS_________
#define DEFAULT_I2C_ADDR 0x3A

#define SWITCH1 18  // PA01
#define SWITCH2 19  // PA02
#define SWITCH3 20  // PA03
#define SWITCH4 2   // PA06
#define PWM1 12     // PC00
#define PWM2 13     // PC01
#define PWM3 0      // PA04
#define PWM4 1      // PA05

#define DEFAULT_I2C_ADDR2 0x3B

#define SWITCH5 18  // PA01
#define SWITCH6 19  // PA02
#define SWITCH7 20  // PA03
#define SWITCH8 2   // PA06
#define PWM5 12     // PC00
#define PWM6 13     // PC01
#define PWM7 0      // PA04
#define PWM8 1      // PA05

uint8_t incr = 0;


Adafruit_seesaw ss;
Adafruit_seesaw ss2;


// ______WIFI_________
const char* ssid = "WOT";
const char* password = "enterthegame";
WiFiClient wifiClient;

// ______MQTT_________
const char* mqttServer = "192.168.50.107";
const int mqttPort = 1883;
const char* clientIdPub = "arduino_publisher";
const char* clientIdSub = "arduino_subscriber";
const char *clientId = "arduino_publisher";
const char* topic = "arduino/data";
const char *topic2 = "arduino/buttons";
const char *topic3 = "arduino/cables";

const int resetPin = 7;



// Prop name
const String propName = "prop4";
// const char *mqttPuzzleCompleteTopic = "prop4/puzzleComplete";
// const char *mqttPuzzleCompleteMessage = "completed";

const char *mqttRestartArduinoTopic = "prop4/restartArduino";
const char *mqttRestartArduinoMessage = "restarted";


const char *mqttStartChallengeTopic = "prop4/startChallenge4";
const char *mqttStartChallengeMessage = "true";

PubSubClient mqttClient(wifiClient);  // Declare PubSubClient object


// GLOABAL VARIABLES
// Track state of which output pins are correctly connected
bool lastState[numConnections] = { false, false, false, false, false, false };

// Track state of overall puzzle
enum PuzzleState {Initialising, Running, Solved};
PuzzleState puzzleState = Initialising;

bool challengeStarted = false;

// ______WIFI CODE_________

void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  while (WiFi.begin(ssid, password) != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void (* resetFunc) (void) = 0;

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  
if (strcmp(topic, mqttRestartArduinoTopic) == 0)
  {
    // Restart the Arduino
    Serial.println("Restarting Arduino...");
    resetFunc(); // Reset the Arduino board
    delay(500); // Wait for the Arduino to restart
    Serial.println("Arduino restarted");
  }
  if (strcmp(topic, mqttStartChallengeTopic) == 0)
  {
    // Start the challenge
    Serial.println("Challenge started!");
    challengeStarted = true;
    
  }
}

// ______MQTT CODE_________
void connectToMQTT() {
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(mqttCallback);

  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (mqttClient.connect(clientIdPub)) {
      Serial.println("Connected to MQTT broker");
      // mqttClient.subscribe(mqttPuzzleCompleteTopic);
      mqttClient.subscribe(mqttRestartArduinoTopic);
      mqttClient.subscribe(mqttStartChallengeTopic);
// mqttClient.setCallback(callback);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds");
      delay(5000);
    }
  }
}

void publishData() {
  static int data = 0;
  char payload[10];
  snprintf(payload, sizeof(payload), "%d", data++);
  mqttClient.publish(topic, payload);
  delay(2000);
  Serial.print("Send");
}

// ______BUTTON CODE_________

void publishButtonValue(int buttonNumber)
{
  char payload[2];
  snprintf(payload, sizeof(payload), "%d", buttonNumber);
  mqttClient.publish(topic2, payload);
}

void buttonSetup()
{
  while (!Serial)
    delay(10); // wait until serial port is opened

  Serial.println(F("Adafruit PID 5296 I2C QT 4x LED Arcade Buttons with MQTT test!"));

  if (!ss.begin(DEFAULT_I2C_ADDR))
  {
    Serial.println(F("seesaw not found!"));
    while (1)
      delay(10);
  }

  if (!ss2.begin(DEFAULT_I2C_ADDR2))
  {
    Serial.println(F("seesaw 2 not found!"));
    while (1)
      delay(10);
  }

  uint16_t pid;
  uint8_t year, mon, day;

  ss.getProdDatecode(&pid, &year, &mon, &day);
  Serial.print("seesaw found PID: ");
  Serial.print(pid);
  Serial.print(" datecode: ");
  Serial.print(2000 + year);
  Serial.print("/");
  Serial.print(mon);
  Serial.print("/");
  Serial.println(day);

  if (pid != 5296)
  {
    Serial.println(F("Wrong seesaw PID"));
    while (1)
      delay(10);
  }

  Serial.println(F("seesaw started OK!"));
  ss.pinMode(SWITCH1, INPUT_PULLUP);
  ss.pinMode(SWITCH2, INPUT_PULLUP);
  ss.pinMode(SWITCH3, INPUT_PULLUP);
  ss.pinMode(SWITCH4, INPUT_PULLUP);

  ss.analogWrite(PWM1, 127);
  ss.analogWrite(PWM2, 127);
  ss.analogWrite(PWM3, 127);
  ss.analogWrite(PWM4, 127);

  ss2.getProdDatecode(&pid, &year, &mon, &day);
  Serial.print("seesaw found PID: ");
  Serial.print(pid);
  Serial.print(" datecode: ");
  Serial.print(2000+year); Serial.print("/"); 
  Serial.print(mon); Serial.print("/"); 
  Serial.println(day);

  if (pid != 5296) {
    Serial.println(F("Wrong seesaw PID"));
    while (1) delay(10);
  }

  Serial.println(F("seesaw 2 started OK!"));
  ss2.pinMode(SWITCH5, INPUT_PULLUP);
  ss2.pinMode(SWITCH6, INPUT_PULLUP);
  ss2.pinMode(SWITCH7, INPUT_PULLUP);
  ss2.pinMode(SWITCH8, INPUT_PULLUP);
  ss2.analogWrite(PWM5, 127);
  ss2.analogWrite(PWM6, 127);
  ss2.analogWrite(PWM7, 127);
  ss2.analogWrite(PWM8, 127);
  
}

void buttonLoop()
{
  if (cablesCompleted) {

    if (!ss.digitalRead(SWITCH1))
    {
    
      Serial.println("Switch 1 pressed");
      publishButtonValue(1);
      ss.analogWrite(PWM1, incr);
      incr += 5;
      delay(500);
    } else {
      ss.analogWrite(PWM1, 0);
    }
    

    if (!ss.digitalRead(SWITCH2))
    {
  
      Serial.println("Switch 2 pressed");
      publishButtonValue(2);
      ss.analogWrite(PWM2, incr);
      incr += 5;
      delay(500);
    } else {
      ss.analogWrite(PWM2, 0);
    }
    

    if (!ss.digitalRead(SWITCH3))
    {
      Serial.println("Switch 3 pressed");
      publishButtonValue(3);
      ss.analogWrite(PWM3, incr);
      incr += 5;
      delay(500);
    } else {
      ss.analogWrite(PWM3, 0);
    }


    if (!ss.digitalRead(SWITCH4))
    {
      Serial.println("Switch 4 pressed");
      publishButtonValue(4);
      ss.analogWrite(PWM4, incr);
      incr += 5;
      delay(500);
    } else {
      ss.analogWrite(PWM4, 0);
    }

    if (!ss2.digitalRead(SWITCH5))
    {
      Serial.println("Switch 5 pressed");
      publishButtonValue(5);
      ss2.analogWrite(PWM5, incr);
      incr += 5;
      delay(500);
    } else {
      ss2.analogWrite(PWM5, 0);
    }

    if (!ss2.digitalRead(SWITCH6))
    {
      Serial.println("Switch 6 pressed");
      publishButtonValue(6);
      ss2.analogWrite(PWM6, incr);
      incr += 5;
      delay(500);
    } else {
      ss2.analogWrite(PWM6, 0);
    }

    if (!ss2.digitalRead(SWITCH7))
    {
      Serial.println("Switch 7 pressed");
      publishButtonValue(7);
      ss2.analogWrite(PWM7, incr);
      incr += 5;
      delay(500);
    } else {
      ss2.analogWrite(PWM7, 0);
    }

    if (!ss2.digitalRead(SWITCH8))
    {
      Serial.println("Switch 8 pressed");
      publishButtonValue(8);
      ss2.analogWrite(PWM8, incr);
      incr += 5;
      delay(500);
    } else {
      ss2.analogWrite(PWM8, 0);
    }
  }
}

// ______JACK SOCKETS CODE_________

void cablesSetup() {
  for (int i=0; i<numSockets; i++) {
    pinMode(signalPins[i], INPUT_PULLUP);
  }

  #ifdef DEBUG
    Serial.begin(9600);
    Serial.println(F("Serial communication started"));
  #endif

  puzzleState = Running;
}

void cablesLoop() {
  if (!cablesCompleted) {
    // Assume all wires are correct
    bool AllWiresCorrect = true;

    // Check if new connection
    bool newConnectionMade = false;

    // Assume that the puzzle state has not changed since the last reading
    bool stateChanged = false;

    // Check each connection in turn
    for (int i = 0; i < numConnections; i++) {
      // Get the connection pair
      byte pin1 = signalPins[connections[i][0]];
      byte pin2 = signalPins[connections[i][1]];

      // Test if the connection pair is connected
      bool currentState = isConnected(pin1, pin2);

      // Has the connection state changed since the last reading?
      if (currentState != lastState[i]) {
        stateChanged = true;
        lastState[i] = currentState;
      }

      // If not all connections are correct, the puzzle is not solved
      if (currentState == false) {
        AllWiresCorrect = false;
      }

      // If a connection has been made/broken since last time we checked (for debug purposes)
      if (stateChanged) {
        #ifdef DEBUG
        // Dump to serial the current state of all connections
        for (uint8_t i = 0; i < numConnections; i++) {
          Serial.print(F("Pin#"));
          Serial.print(signalPins[connections[i][0]]);
          Serial.print(F(" - Pin#"));
          Serial.print(signalPins[connections[i][1]]);
          Serial.print(F(":"));
          Serial.println(lastState[i] ? "Connected" : "Not connected");
        }

        Serial.println(F(" ------- "));
        #endif

        newConnectionMade = true;
      }
    }

    // If a new connection has been made, flash the buttons
    if (newConnectionMade) {
      flashButtons();
    }

    // If the state of the puzzle has changed
    if (AllWiresCorrect && puzzleState == Running) {
      onSolve();
    }
  }
}

void flashButtons() {
  // Flash the buttons to indicate success
    ss.analogWrite(PWM1, 255);
    ss.analogWrite(PWM2, 255);
    ss.analogWrite(PWM3, 255);
    ss.analogWrite(PWM4, 255);
    delay(200);
    ss.analogWrite(PWM1, 0);
    ss.analogWrite(PWM2, 0);
    ss.analogWrite(PWM3, 0);
    ss.analogWrite(PWM4, 0);
    delay(200);
}

void flashButtonsLong() {
  // Flash the buttons to indicate success
    ss.analogWrite(PWM1, 255);
    ss.analogWrite(PWM2, 255);
    ss.analogWrite(PWM3, 255);
    ss.analogWrite(PWM4, 255);
    delay(1000);
    ss.analogWrite(PWM1, 0);
    ss.analogWrite(PWM2, 0);
    ss.analogWrite(PWM3, 0);
    ss.analogWrite(PWM4, 0);
    delay(200);
}

void onSolve() {
  #ifdef DEBUG
    Serial.print(F("The puzzle is solved"));
  #endif
  puzzleState = Solved;
  cablesCompleted = true;
  mqttClient.publish(topic3, "succes");
  flashButtonsLong();
  // mqttClient.publish(mqttPuzzleCompleteTopic, mqttPuzzleCompleteMessage);
}

// Function that tests wheter an output pin is connected to a given INPUT_PULLUP pin
bool isConnected(byte OutputPin, byte InputPin) {
  // To test wheter the pins are connected, set the first as output and the second as input
  pinMode(OutputPin, OUTPUT);
  pinMode(InputPin, INPUT_PULLUP);

  // Set the output pin LOW
  digitalWrite(OutputPin, LOW);

  // If connected, the LOW signal should be detected on the input pin
  bool isConnected = !digitalRead(InputPin);

  // Set the output pin back to its default state
  pinMode(OutputPin, INPUT_PULLUP);

  return isConnected;



}

void setup() {
  Serial.begin(9600);
  connectToWiFi();
  // mqttClient.setServer(mqttServer, mqttPort);
  connectToMQTT();
  cablesSetup();
  buttonSetup();

}

void loop() {
  mqttClient.loop();
  if(challengeStarted){
  cablesLoop();
  buttonLoop();
  }
  // publishData();
  delay(100); // Adjust the delay according to your needs
}