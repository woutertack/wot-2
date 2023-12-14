import MQTTSingleton from "../lib/mqttSingleton.js"

/**
 * Toggle the led on our board
 * @param {*} req
 * @param {*} res
 */
export const alarmSound = (req, res) => {
  try {
    
    MQTTSingleton.getClient().publish('alarm');
  } catch(e) {
    console.error(e)
  }
}

export const morseSound = (req, res) => {
  try {
   
    MQTTSingleton.getClient().publish('sound');
  } catch(e) {
    console.error(e)
  }
}

export const stopSound = (req, res) => {
  try {
   
    MQTTSingleton.getClient().publish('stop');
  } catch(e) {
    console.error(e)
  }
}