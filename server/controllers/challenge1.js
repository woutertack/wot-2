import MQTTSingleton from "../lib/mqttSingleton.js"
import { io } from "../index.js"

export const puzzleCompleteProp1 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('alarm');
        io.emit('challengeComplete1', true);
  }
  catch(e){
    console.error(e)
  }
        

     
}




export const restartArduinoProp1 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop1/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}

export const startChallenge1 = (req, res) => {
  MQTTSingleton.getClient().subscribe('prop1/puzzleComplete');
  try {
    MQTTSingleton.getClient().publish('prop1/startChallenge1');
    // res.status(200).send('Challenge 1 started!');
    
    MQTTSingleton.getClient().publish('prop1/startChallenge1', 'Challenge 1 started!');
    console.log('MQTT message published to Arduino');
    // You can include additional data or customize the MQTT message as needed

    // Send a response to the client
    io.emit('challengeStarted', { message: 'Challenge 1 started!' });
  } catch(e) {
    console.error(e)
  }
}
// io.on('startButtonChallenge1Clicked', startChallenge1);
  
