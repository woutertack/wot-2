import Timer from '../lib/timer.js';
import timerSingleton from '../lib/timerSingleton.js';
import MQTTSingleton from "../lib/mqttSingleton.js"

// main Timer -----------------------------------------------------
export const startMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").start();
    console.log("timer started");
    // res.status(200).send('Timer started');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").pauseToggle();
    // res.status(200).send('Timer pauzed');
  } catch(e) {
    console.error(e)
  }
}
export const stopMainTimer = (req, res) => {
  try {
    timerSingleton.getInstance("mainTimer").stop();
    // res.status(200).send('Timer stopped!');
  }
  catch(e) {
    console.error(e)
  }
}

export const startTimerRaspberryPi = (req, res) => {
  try {
    MQTTSingleton.getClient().publish('startTimer', 'startTimer');
  } catch(e) {
    console.error(e)
  }
}
export const pauzeTimerRaspberryPi = (req, res) => {
  try {
    MQTTSingleton.getClient().publish('pauzeTimer', 'pauzeTimer');
  } catch(e) {
    console.error(e)
  }
}