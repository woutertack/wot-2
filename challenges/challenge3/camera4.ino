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
const char *mqttPuzzleCompleteTopic = "prop3/puzzleCompleteCamera4";
const char *mqttPuzzleCompleteMessage = "completed";

const char *mqttRestartArduinoTopic = "prop3/restartArduinoCamera4";
const char *mqttRestartArduinoMessage = "restarted";

const char *mqttStartChallengeTopic = "prop3/startChallenge3";
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
    if (client.connect("CameraClient4")) {
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
  bool fourthSignalReceived = false;
  bool fifthSignalReceived = false;

  while (millis() - currentTime < 500) {
    if (irrecv.decode(&results) && !camera_broke) {
      // IR-signaal ontvangen
      Serial.println("IR-signaal ontvangen!");
      irrecv.disableIRIn();
      digitalWrite(led, HIGH);
      ledStatus = HIGH;
      delay(500);
      ledStatus = LOW;
      digitalWrite(led, LOW);
      delay(1000);
      irrecv.resume();
      lastSignalTime = millis();
      irrecv.enableIRIn();

      // Wacht tot het tweede signaal binnen de tijdslimiet wordt ontvangen
      while ((millis() - lastSignalTime <= signalTimeout1) && (millis() >= 1000)) {
        if (irrecv.decode(&results)) {
          Serial.println("Tweede signaal ontvangen!");
          irrecv.disableIRIn();
          secondSignalReceived = true;
          digitalWrite(led, HIGH);
          ledStatus = HIGH;
          delay(500);
          ledStatus = LOW;
          digitalWrite(led, LOW);
          delay(1000);
          irrecv.resume();
          lastSignalTime = millis();
          irrecv.enableIRIn();

          // Wacht tot het derde signaal binnen de tijdslimiet wordt ontvangen
          while ((millis() - lastSignalTime <= signalTimeout1) && (millis() >= 1000)) {
            if (irrecv.decode(&results)) {
              Serial.println("Derde signaal ontvangen!");
              irrecv.disableIRIn();
              thirdSignalReceived = true;
              digitalWrite(led, HIGH);
              ledStatus = HIGH;
              delay(500);
              ledStatus = LOW;
              digitalWrite(led, LOW);
              delay(1000);
              irrecv.resume();
              lastSignalTime = millis();
              irrecv.enableIRIn();

              // Wacht tot het vierde signaal binnen de tijdslimiet wordt ontvangen
              while ((millis() - lastSignalTime <= signalTimeout1) && (millis() >= 1000)) {
                if (irrecv.decode(&results)) {
                  Serial.println("Vierde signaal ontvangen!");
                  irrecv.disableIRIn();
                  fourthSignalReceived = true;
                  digitalWrite(led, HIGH);
                  ledStatus = HIGH;
                  delay(500);
                  ledStatus = LOW;
                  digitalWrite(led, LOW);
                  delay(1000);
                  irrecv.resume();
                  lastSignalTime = millis();
                  irrecv.enableIRIn();
                  
                  // Wacht tot het vijfde signaal binnen de tijdslimiet wordt ontvangen
                  while ((millis() - lastSignalTime <= signalTimeout1) && (millis() >= 1000)) {
                    if (irrecv.decode(&results)) {
                      Serial.println("Vijfde signaal ontvangen!");
                      fifthSignalReceived = true;
                      break;
                    }
                  }
                  break;
                }
              }
              break; // Voeg deze break toe om de derde while-lus te verlaten na ontvangst van het derde signaal
            }
          }
          break; // Voeg deze break toe om de tweede while-lus te verlaten na ontvangst van het tweede signaal
        }
      }

      // Schakel de IR-bibliotheek weer in voor toekomstige signalen
      irrecv.enableIRIn();

      if (secondSignalReceived && thirdSignalReceived && fourthSignalReceived && fifthSignalReceived) {
        Serial.println("Alle signalen correct ontvangen!");
        digitalWrite(led, HIGH);
        camera_broke = true;
        ledStatus = HIGH;
        client.publish(mqttPuzzleCompleteTopic, mqttPuzzleCompleteMessage);
        break;  // Voeg een break toe om de buitenste while-lus te verlaten na succesvolle ontvangst van signalen
      } else {
        Serial.println("Niet alle signalen correct ontvangen!");
        // Doe hier wat je moet doen wanneer niet alle signalen correct zijn ontvangen
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

