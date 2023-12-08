import MQTTSingleton from "../lib/mqttSingleton.js"

export const restartArduinoProp1 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop1/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}


export const restartArduinoProp2 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop2/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}


export const restartArduinoProp3Camera1 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/restartArduinoCamera1');
  }
  catch(e){
    console.error(e)
  }
}

export const restartArduinoProp3Camera2 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/restartArduinoCamera2');
  }
  catch(e){
    console.error(e)
  }
}

export const restartArduinoProp3Camera3 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/restartArduinoCamera3');
  }
  catch(e){
    console.error(e)
  }
}


export const restartArduinoProp3Camera4 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/restartArduinoCamera4');
  }
  catch(e){
    console.error(e)
  }
}



export const restartArduinoProp4 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop4/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}


export const resetRaspberryC5 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop5/restartPi');
  }
  catch(e){
    console.error(e)
  }
}
