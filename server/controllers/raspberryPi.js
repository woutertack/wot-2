import MQTTSingleton from "../lib/mqttSingleton.js"
import { io } from "../index.js"

export const raspberryPiChallenge3Index = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/index');
  }
  catch(e){
    console.error(e)
  }
}
export const raspberryPiChallenge3Dashboard = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop3/dashboard');
  }
  catch(e){
    console.error(e)
  }
}
export const raspberryPiChallenge5Index = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop5/index');
  }
  catch(e){
    console.error(e)
  }
}

export const raspberryPiBlack = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('black');
  }
  catch(e){
    console.error(e)
  }
}