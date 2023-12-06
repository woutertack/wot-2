import MQTTSingleton from "../lib/mqttSingleton.js"

/**
 * Toggle the led on our board
 * @param {*} req
 * @param {*} res
 */
export const alarmSound = (req, res) => {
  try {
    MQTTSingleton.getClient().subscribeOnce('alarm').then((message) => {
      res.status(200).json("play alarm");
    });
    MQTTSingleton.getClient().publish('alarm', "play alarm");
  } catch(e) {
    console.error(e)
  }
}

export const morseSound = (req, res) => {
  try {
    MQTTSingleton.getClient().subscribeOnce('sound').then((message) => {
      res.status(200).json("play morse");
    });
    MQTTSingleton.getClient().publish('sound', "play morse");
  } catch(e) {
    console.error(e)
  }
}

export const stopSound = (req, res) => {
  try {
    MQTTSingleton.getClient().subscribeOnce('stop').then((message) => {
      res.status(200).json("stop sound");
    });
    MQTTSingleton.getClient().publish('stop', "stop sound");
  } catch(e) {
    console.error(e)
  }
}