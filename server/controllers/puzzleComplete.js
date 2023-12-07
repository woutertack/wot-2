import MQTTSingleton from "../lib/mqttSingleton.js"
import { io } from "../index.js"

// things done when challenge one is solved
export const puzzleCompleteProp1 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('alarm');
    // MQTTSingleton.getClient().publish('prop2/startChallenge2');
        io.emit('challengeComplete1', true);
        console.log('Challenge 1 completed, published next challenge');
  }
  catch(e){
    console.error(e)
  }    
}

export const puzzleCompleteProp2 = (req, res) => {
  try {
        MQTTSingleton.getClient().publish('prop3/startChallenge3');
        MQTTSingleton.getClient().publish('sound');
        MQTTSingleton.getClient().publish('prop3/index');
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const puzzleCompleteProp3 = (req, res) => {
  try {
        MQTTSingleton.getClient().publish('prop3/startChallenge3');
        MQTTSingleton.getClient().publish('sound');
        MQTTSingleton.getClient().publish('prop3/index');
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
