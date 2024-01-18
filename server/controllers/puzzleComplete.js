import MQTTSingleton from "../lib/mqttSingleton.js"
import { io } from "../index.js"



// things done when challenge one is solved
export const puzzleCompleteProp1 = (req, res) => {
  try{
        MQTTSingleton.getClient().publish('alarm');
       
        io.emit('challengeComplete1', true);
        console.log('Challenge 1 completed, published next challenge');
  }
  catch(e){
    console.error(e)
  }    
}

export const puzzleCompleteProp2 = (req, res) => {
  try {
        // MQTTSingleton.getClient().publish('prop3/startChallenge3Camera1');
        MQTTSingleton.getClient().publish('sound');
        MQTTSingleton.getClient().publish('prop3/index');
        io.emit('challengeComplete2', true);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const pincodeCompleteProp3 = (req, res) => {
  try {
        MQTTSingleton.getClient().publish('prop3/startChallenge3Camera1');
       
        
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const puzzleCompleteProp3 = (req, res) => {
  try {
        MQTTSingleton.getClient().publish('prop4/startChallenge4');
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




export const puzzleCompleteProp4 = (req, res) => {
  try {
    console.log("challenge 4 completed");
        io.emit('challengeComplete4', true);
        MQTTSingleton.getClient().publish('prop5/index');
        
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



export const puzzleCompleteProp5 = (req, res) => {
  try {
        io.emit('challengeComplete5', true);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}