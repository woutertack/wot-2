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


Adafruit_seesaw ss;


// ______WIFI_________
const char* ssid = "WOT";
const char* password = "enterthegame";
WiFiClient wifiClient;

// ______MQTT_________
const char* mqttServer = "192.168.50.107";
const int mqttPort = 1883;

const char* topic = "arduino/data";
const char *topic2 = "arduino/buttons";
const char *topic3 = "arduino/cables";
const char *topic4 = "arduino/connected";


const int resetPin = 7;



// Prop name
const String propName = "prop4";
const char *mqttPuzzleCompleteTopic = "prop4/puzzleComplete";
const char *mqttPuzzleCompleteMessage = "succes";

const char *mqttRestartArduinoTopic = "prop4/restartArduino";
const char *mqttRestartArduinoMessage = "restarted";

const char *mqttStartChallengeTopic = "prop4/startChallenge4";
const char *mqttStartChallengeMessage = "true";

bool challengeStarted = false;

PubSubClient mqttClient(wifiClient);  // Declare PubSubClient object


// GLOABAL VARIABLES
// Track state of which output pins are correctly connected
bool lastState[numConnections] = { false, false, false, false, false, false };

// Track state of overall puzzle
enum PuzzleState {Initialising, Running, Solved};
PuzzleState puzzleState = Initialising;


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

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  if (strcmp(topic, mqttRestartArduinoTopic) == 0) {
    // Restart the Arduino
    Serial.println("Restarting Arduino...");
    resetFunc(); // Reset the Arduino board
    delay(500); // Wait for the Arduino to restart
    Serial.println("Arduino restarted");
  } else if (strcmp(topic, mqttStartChallengeTopic) == 0) {
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
    if (mqttClient.connect("arduino1")) {
      Serial.println("Connected to MQTT broker");
      // mqttClient.subscribe(mqttPuzzleCompleteTopic);
     

// mqttClient.setCallback(callback);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds");
      delay(5000);
    }
  }
   mqttClient.subscribe(mqttRestartArduinoTopic);
      mqttClient.subscribe(mqttStartChallengeTopic);
      mqttClient.subscribe(topic3);
}

void publishData() {
  static int data = 0;
  char payload[10];
  snprintf(payload, sizeof(payload), "%d", data++);
  // mqttClient.publish(topic, payload);
  delay(200);
  Serial.print("Send");
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
        mqttClient.publish(topic4, "connection");

      }
    }

    // If the state of the puzzle has changed
    if (AllWiresCorrect && puzzleState == Running) {
      onSolve();
    }
  }
}

void onSolve() {
  mqttClient.publish(topic3, mqttPuzzleCompleteMessage);
  #ifdef DEBUG
    Serial.print(F("The puzzle is solved"));
  #endif
  puzzleState = Solved;
  cablesCompleted = true;
  
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

}

void loop() {
  mqttClient.loop();
  if(challengeStarted){
  cablesLoop();
  }
  // publishData();
  delay(100);
}