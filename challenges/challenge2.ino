#include <WiFi.h>
#include <PubSubClient.h>
#include <string.h>

// WiFi
const char *ssid = "WOT"; // Enter your WiFi name
const char *password = "enterthegame";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.50.128";
const int mqtt_port = 1883;

// Prop name
const String propName = "prop2";
const char *mqttPuzzleCompleteTopic = "prop2/puzzleComplete";
const char *mqttPuzzleCompleteMessage = "completed";

const char *mqttRestartArduinoTopic = "prop2/restartArduino";
const char *mqttRestartArduinoMessage = "restarted";

// Challenge
const int DETECT = 5;
const int LASER = 2;
const int LASER2 = 4;
const int LASER3 = 3;
const int resetPin = 7;

bool completed = false;

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// WiFi setup
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

// Reset function
void (* resetFunc) (void) = 0; // Declare reset function @ address 0

// MQTT callback -> restart Arduino
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  if (strcmp(topic, mqttRestartArduinoTopic) == 0)
  {
    Serial.println("Restarting Arduino...");
    resetFunc(); // Reset the Arduino board
    delay(500); // Wait for the Arduino to restart
    Serial.println("Arduino restarted");
  }
}

// MQTT setup
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
      delay(2000);
    }
  }

  mqttClient.subscribe(mqttPuzzleCompleteTopic);
  mqttClient.subscribe(mqttRestartArduinoTopic);
}


void setup()
{
  Serial.begin(9600);
  Serial.println("Laser module test");
  delay(2000);
	pinMode(DETECT, INPUT);
  pinMode(LASER, OUTPUT);
  pinMode(LASER2, OUTPUT);
  pinMode(LASER3, OUTPUT);

  // Set the reset function pointer
  resetFunc = (void (*)())0x00000000;

  setupWifi();
  setupMQTT();
}

void loop()
{
  mqttClient.loop();
  delay(1000);
  // turn the lasers on
  digitalWrite(LASER, HIGH);
  digitalWrite(LASER2, HIGH);
  digitalWrite(LASER3, HIGH);
  // read the sensor
	int detected = digitalRead(DETECT);
	delay(1000);
	if(detected == LOW && completed == false)
	{
    completed = true;
		Serial.println("Detected!");
    mqttClient.publish(mqttPuzzleCompleteTopic, mqttPuzzleCompleteMessage);
	} else {
		Serial.println("No Laser");
	}
}