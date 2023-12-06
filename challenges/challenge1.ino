#include <WiFi.h>
#include <PubSubClient.h>
#include <string.h>

// Define your WiFi credentials
const char *ssid = "WOT"; // Enter your WiFi name
const char *password = "enterthegame";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.50.107";
const int mqtt_port = 1883;


// Prop name
const String propName = "prop1";
const char *mqttPuzzleCompleteTopic = "prop1/puzzleComplete";
const char *mqttPuzzleCompleteMessage = "completed";

const char *mqttRestartArduinoTopic = "prop1/restartArduino";
const char *mqttRestartArduinoMessage = "restarted";

const char *mqttStartChallengeTopic = "prop1/startChallenge1";
const char *mqttStartChallengeMessage = "true";
// Challenge
#define SPEAKER 7

const int RELAY_PIN = A4;

const int TouchPinUp = 2;
const int TouchPinDown = 3;
const int TouchPinLeft = 4;
const int TouchPinRight = 6;

int BassTab[] = {1530};

int previousStateUp = LOW;
int previousStateDown = LOW;
int previousStateLeft = LOW;
int previousStateRight = LOW;

const char expectedSequence[] = {'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'};
char latestInput[8];
int latestIndex = 0;
int inputCounter = 0;
bool completed = false;
bool challengeStarted = false;


const int resetPin = 7; // Choose a digital pin for the reset

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setupWifi()
{
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the Wi-Fi network");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
}

void (* resetFunc) (void) = 0; // Declare reset function @ address 0





void setupMQTT()
{
  mqttClient.setServer(mqtt_broker, mqtt_port);
  mqttClient.setCallback(mqttCallback);

  while (!mqttClient.connected())
  {
    Serial.print("Connecting to MQTT broker...");
    if (mqttClient.connect(propName.c_str()))
    {
      Serial.println("Connected!");
    }
    else
    {
      Serial.print("Failed with state ");
      Serial.println(mqttClient.state());
      // delay(2000);
    }
  }

  mqttClient.subscribe(mqttPuzzleCompleteTopic);
  mqttClient.subscribe(mqttRestartArduinoTopic);
  mqttClient.subscribe(mqttStartChallengeTopic);
}

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  if (strcmp(topic, mqttRestartArduinoTopic) == 0)
  {
    // Restart the Arduino
    Serial.println("Restarting Arduino...");
    resetFunc(); // Reset the Arduino board
    // delay(500); // Wait for the Arduino to restart
    Serial.println("Arduino restarted");
  }
  if (strcmp(topic, mqttStartChallengeTopic) == 0)
  {
    // Start the challenge
    Serial.println("Challenge started!");
    challengeStarted = true;
    
  }
}

void setup()
{
  Serial.begin(9600);


  pinMode(resetPin, OUTPUT); // Set the reset pin as output
  digitalWrite(resetPin, HIGH); // Set the reset pin to HIGH to keep the Arduino running

  // Set the reset function pointer
  resetFunc = (void (*)())0x00000000; 
  
  pinMode(RELAY_PIN, OUTPUT);

    // Set the relay pin to HIGH at the start (open):
  digitalWrite(RELAY_PIN, LOW);

  pinMode(SPEAKER, OUTPUT);
  digitalWrite(SPEAKER, 0);

  setupWifi();
  setupMQTT();
}


void loop()
{
  mqttClient.loop();
  
  if (challengeStarted) {
    // Challenge has not started, skip processing
     int currentStateUp = digitalRead(TouchPinUp);
  int currentStateDown = digitalRead(TouchPinDown);
  int currentStateLeft = digitalRead(TouchPinLeft);
  int currentStateRight = digitalRead(TouchPinRight);

  checkAndPrint(currentStateUp, previousStateUp, "U");
  checkAndPrint(currentStateDown, previousStateDown, "D");
  checkAndPrint(currentStateLeft, previousStateLeft, "L");
  checkAndPrint(currentStateRight, previousStateRight, "R");

  previousStateUp = currentStateUp;
  previousStateDown = currentStateDown;
  previousStateLeft = currentStateLeft;
  previousStateRight = currentStateRight;

  if (inputCounter >= 8 && checkCombination())
  {
    Serial.println("Puzzle complete!");
    sound(0, 400);
    // delay(700);
    digitalWrite(RELAY_PIN, HIGH);
    completed = true;
    inputCounter = 0;

    // Publish MQTT message here
    mqttClient.publish(mqttPuzzleCompleteTopic, mqttPuzzleCompleteMessage);
  }
   }

  // Rest of your existing loop code...

 
 

  // delay(100);
}

void checkAndPrint(int currentState, int &previousState, const char *direction)
{
  if (currentState == HIGH && previousState == LOW)
  {
    Serial.println(direction);
    sound(0, 100);
    latestInput[inputCounter % 8] = direction[0];
    inputCounter++;
  }
}

bool checkCombination()
{
  String inputString = "";

  for (int i = 0; i < 8; i++)
  {
    int inputIndex = (inputCounter - 8 + i + 8) % 8;
    inputString += toupper(latestInput[inputIndex]);
  }

  String expectedString = "";
  for (int i = 0; i < 8; i++)
  {
    expectedString += toupper(expectedSequence[i]);
  }

  if (inputString == expectedString)
  {
    completed = true;
    return true;
  }

  return false;
}

void sound(uint8_t note_index, int duration)
{
  for (int i = 0; i < duration; i++)
  {
    digitalWrite(SPEAKER, 32);
    delayMicroseconds(BassTab[note_index]);
    digitalWrite(SPEAKER, 0);
    delayMicroseconds(BassTab[note_index]);
  }
}