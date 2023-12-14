///////////////////////////////////////////////////////////////////////////

// CAMERA 1

/////////////////////////////////////////////////////////////////////////////

#include <WiFi.h>
#include <PubSubClient.h>
#include <IRremote.h>

// Define your WiFi credentials
const char *ssid = "WOT"; // Enter your WiFi name
const char *password = "enterthegame";  // Enter WiFi password

// Define MQTT broker information
const char *mqtt_server = "192.168.50.107";
const int mqtt_port = 1883;

// Prop name
const String propName = "prop3";
const char *mqttPuzzleCompleteTopic = "prop3/puzzleCompleteCamera1";
const char *mqttPuzzleCompleteMessage = "completed";

const char *mqttRestartArduinoTopic = "prop3/restartArduinoCamera1";
const char *mqttRestartArduinoMessage = "restarted";

const char *mqttStartChallengeTopic = "prop3/startChallenge3Camera1";
const char *mqttStartChallengeMessage = "true";

// Define variables for board
const int RECV_PIN = 7;
const int led = 8;
IRrecv irrecv(RECV_PIN);
decode_results results;

unsigned long lastSignalTime = 0;
const unsigned long signalTimeout1 = 3000;
const unsigned long signalTimeout2 = 3000;

bool ledStatus = LOW;
bool camera_broke = false;

bool challengeStarted = false;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);

  irrecv.enableIRIn();
  irrecv.blink13(true);
  pinMode(led, OUTPUT);

  while (!Serial);

  connectWiFi();



}

void callback(char *topic, byte *payload, unsigned int length) {
  // Handle messages received on subscribed topics
  if (strcmp(topic, mqttRestartArduinoTopic) == 0) { 
      Serial.println("Restarting Arduino...");
      digitalWrite(led, LOW);
      delay(1000);
      asm volatile("  jmp 0");
      
  }
   if (strcmp(topic, mqttStartChallengeTopic) == 0)
  {
    // Start the challenge
    Serial.println("Challenge started!");
    challengeStarted = true;
    
  }
}

void reconnectMQTT() {
  client.setServer(mqtt_server, mqtt_port);

   while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("CameraClient1")) {
      Serial.println("Connected to MQTT");
      client.subscribe(mqttPuzzleCompleteTopic);
      client.subscribe(mqttRestartArduinoTopic);
      client.subscribe(mqttStartChallengeTopic);
      client.setCallback(callback); // Set the callback function for handling MQTT messages
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }

  client.loop();
 if (challengeStarted) {
    recieveIR();
    digitalWrite(led, ledStatus);
 }
  

}

void recieveIR() {
  unsigned long currentTime = millis();
  bool secondSignalReceived = false;
  bool thirdSignalReceived = false;

  while (millis() - currentTime < 500) {
  if (irrecv.decode(&results) && !camera_broke) {
    // IR-signaal ontvangen
    Serial.println("IR-signaal ontvangen!");
    // Stop de IR-bibliotheek opnieuw
    irrecv.disableIRIn();
    digitalWrite(led, HIGH);
    ledStatus = HIGH;
    // digitalWrite(buzzer, HIGH);
    delay(500);
    ledStatus = LOW;
    // digitalWrite(buzzer, LOW);
    digitalWrite(led, LOW);
    delay(1000);
    irrecv.resume();  // Ontvang het volgende IR-signaal
    lastSignalTime = currentTime;
    // Schakel de IR-bibliotheek weer in voor toekomstige signalen
    irrecv.enableIRIn();

    // Wacht tot het tweede signaal binnen de tijdslimiet wordt ontvangen
    while ((currentTime - lastSignalTime <= signalTimeout1) && (currentTime >= 1000)) {
      if (irrecv.decode(&results)) {
        // Tweede signaal ontvangen binnen de tijdslimiet
        Serial.println("Tweede signaal ontvangen!");
        // Stop de IR-bibliotheek opnieuw
        irrecv.disableIRIn();
        secondSignalReceived = true;
        digitalWrite(led, HIGH);
        ledStatus = HIGH;
        // digitalWrite(buzzer, HIGH);
        delay(500);
        // digitalWrite(buzzer, LOW);
        ledStatus = LOW;
        digitalWrite(led, LOW);
        delay(1000);
        irrecv.resume();  // Ontvang het volgende IR-signaal
        lastSignalTime = currentTime;
        // Schakel de IR-bibliotheek weer in voor toekomstige signalen
        irrecv.enableIRIn();

        // Wacht tot het derde signaal binnen de tijdslimiet wordt ontvangen
        while ((currentTime - lastSignalTime <= signalTimeout1) && (currentTime >= 1000)) {
          if (irrecv.decode(&results)) {
            // Derde signaal ontvangen binnen de tijdslimiet
            Serial.println("Derde signaal ontvangen!");
            thirdSignalReceived = true;
            break;
          }
          currentTime = millis();
        }
        break;
      }
      currentTime = millis();
    }

    // Schakel de IR-bibliotheek weer in voor toekomstige signalen
    irrecv.enableIRIn();

    if (secondSignalReceived && thirdSignalReceived) {
      // Tweede en derde signaal correct ontvangen
      // digitalWrite(buzzer, HIGH);
      delay(500);
      
      // digitalWrite(buzzer, LOW);
      Serial.println("Camera uitgeschakeld!");
      digitalWrite(led, HIGH);
      camera_broke = true;
      ledStatus = HIGH; // Zet de LED aan
      client.publish(mqttPuzzleCompleteTopic, mqttPuzzleCompleteMessage);
      // while (true) {
      //   // Hier blijft het programma wachten en zal het niet verder gaan
      // }
      
      // sendCameraStatusToMQTT(camera_broke);
    } else {
      // Tweede of derde signaal niet op tijd ontvangen
      Serial.println("Tweede of derde signaal niet ontvangen binnen de tijdslimiet!");
      // Doe hier wat je moet doen wanneer het tweede of derde signaal niet op tijd is ontvangen
    }
  }
  }
}

void connectWiFi() {
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.println("Connected to WiFi");
}

