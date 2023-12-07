import MQTTSingleton from "../lib/mqttSingleton.js"
import { io } from "../index.js"


export const startChallenge1 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop1/startChallenge1');
   
    // res.status(200).send('Challenge 1 started!');
    
    // MQTTSingleton.getClient().publish('prop1/startChallenge1', 'Challenge 1 started!');
    console.log('MQTT message published to Arduino');
    // You can include additional data or customize the MQTT message as needed

    // Send a response to the client
    io.emit('challengeStarted', { message: 'Challenge 1 started!' });
  } catch(e) {
    console.error(e)
  }
}

  
export const startChallenge3 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3');
    MQTTSingleton.getClient().publish('prop3/index');
    // res.status(200).send('Challenge 1 started!');
    
    // MQTTSingleton.getClient().publish('prop1/startChallenge1', 'Challenge 1 started!');
    console.log('MQTT message published to Arduino');
    // You can include additional data or customize the MQTT message as needed

    // Send a response to the client
    io.emit('challengeStarted', { message: 'Challenge 1 started!' });
  } catch(e) {
    console.error(e)
  }
}