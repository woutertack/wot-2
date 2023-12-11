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
    io.emit('challengeStarted1', { message: 'Challenge 1 started!' });
  } catch(e) {
    console.error(e)
  }
}

  
export const startChallenge3Camera1 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3Camera1');
    MQTTSingleton.getClient().publish('sound');
    MQTTSingleton.getClient().publish('prop3/index');
    // MQTTSingleton.getClient().publish('prop1/startChallenge1', 'Challenge 1 started!');
    console.log('MQTT message published to Arduino');
    // You can include additional data or customize the MQTT message as needed

    // Send a response to the client
    io.emit('challengeStarted3', { message: 'Challenge 3 started!' });
  } catch(e) {
    console.error(e)
  }
}

export const startChallenge3Camera2 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3Camera2');
  
  } catch(e) {
    console.error(e)
  }
}

export const startChallenge3Camera3 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3Camera3');
  
  } catch(e) {
    console.error(e)
  }
}

export const startChallenge3Camera4 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3Camera4');
  
  } catch(e) {
    console.error(e)
  }
}

export const startChallenge4 = (req, res) => {
  
  try {
    MQTTSingleton.getClient().publish('prop4/startChallenge4');
   
    
    // MQTTSingleton.getClient().publish('prop1/startChallenge1', 'Challenge 1 started!');
    console.log('MQTT message published to Arduino');
    // You can include additional data or customize the MQTT message as needed

    // Send a response to the client
    io.emit('challengeStarted4', { message: 'Challenge 4 started!' });
  } catch(e) {
    console.error(e)
  }
}

export const startChallenge5 = (req, res) => {
  try{
    // MQTTSingleton.getClient().subscribeOnce('prop5/index').then(() => {
    //   res.status(200).json( "startChallenge5" );
    // });
    MQTTSingleton.getClient().publish('prop5/index');
  }
  catch(e){
    console.error(e)
  }
}