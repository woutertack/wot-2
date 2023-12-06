import subprocess
import sys
import paho.mqtt.client as mqtt
import time
import pygame
import threading

# WiFi
ssid = "WOT"
password = "enterthegame"

# MQTT Broker
mqtt_broker = "192.168.50.128"
mqtt_port = 1883

prop_name = "prop3"
mqtt_c2_morse = "sound"
mqtt_c2_morse_stop = "stop"
mqtt_c2_alarm = "alarm"

# List to keep track of all currently playing sounds
playing_sounds = []

def play_sound(title):
    try:
        pygame.mixer.music.load(title)
        pygame.mixer.music.play()

        # Add the sound to the playing_sounds list
        playing_sounds.append(title)

        # Wait for the sound to finish playing
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        # Remove the sound from the playing_sounds list after finishing
        playing_sounds.remove(title)

    except pygame.error as e:
        print(f"Error: {e}")

def stop_all_sounds():
    pygame.mixer.music.stop()
    playing_sounds.clear()

def on_message(client, userdata, msg):
    if msg.topic == mqtt_c2_morse:
        print("1")
        sound_thread = threading.Thread(target=play_sound, args=("morse.mp3",))
        sound_thread.start()
    elif msg.topic == mqtt_c2_alarm:
        print("2")
        sound_thread = threading.Thread(target=play_sound, args=("alarm.mp3",))
        sound_thread.start()
    elif msg.topic == mqtt_c2_morse_stop:
        print("Stopping all sounds")
        stop_all_sounds()

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(mqtt_c2_morse)
    client.subscribe(mqtt_c2_morse_stop)
    client.subscribe(mqtt_c2_alarm)

# Initialize Pygame and mixer in the main thread
pygame.init()
pygame.mixer.init()

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
    client.disconnect()
    print("Program terminated.")
    pygame.quit()
