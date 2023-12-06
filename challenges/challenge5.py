import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import time
from wifi import Cell
from flask import Flask, render_template
import threading

# WiFi
ssid = "..."  # Voer je WiFi-naam in
password = "..."  # Voer het WiFi-wachtwoord in

# MQTT Broker
mqtt_broker = "..."
mqtt_port = 1883


# Flask
app = Flask(__name__)
flask_thread = None
flask_running = False 

@app.route("/")
def hello_world():
	return render_template('index.html')

# Prop name
prop_name = "prop1"
mqtt_start_flask_topic = "prop1/startFlask"
mqtt_stop_flask_topic = "prop1/stopFlask"

# Setup WiFi
def connect_to_wifi():
    cells = Cell.all('wlan0')
    cell = cells[0]
    scheme = cell.scheme
    scheme.activate()

def start_flask():
    global flask_thread
    if flask_thread is None or not flask_thread.is_alive():
        flask_thread = threading.Thread(target=app.run, kwargs={'debug': True, 'host': '0.0.0.0', 'port': 8000, 'use_reloader': False})
        flask_thread.start()
        flask_running = True

def stop_flask():
    global flask_thread, flask_running
    if flask_thread is not None and flask_running:
        flask_running = False
        flask_thread.join()  # Wait for the Flask thread to finish
        flask_thread = None
        print("Flask server stopped.")
        
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(mqtt_start_flask_topic)
    client.subscribe(mqtt_stop_flask_topic)

def on_message(client, userdata, msg):
    if msg.topic == mqtt_start_flask_topic:
        start_flask()
    elif msg.topic == mqtt_stop_flask_topic:
        stop_flask()




# Setup MQTT
client = mqtt.Client(prop_name)
client.on_connect = on_connect
client.on_message = on_message

# Connect to MQTT Broker
client.connect(mqtt_broker, mqtt_port, 60)

# Main loop
client.loop_start()
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    stop_flask()
    GPIO.cleanup()
    client.disconnect()
    print("Program terminated.")