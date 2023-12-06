import MQTTSingleton from "../lib/mqttSingleton.js"




export const puzzleCompleteProp1 = (req, res, io) => {
  try {
    // Subscribe to the puzzleComplete topic and respond to the client once
    MQTTSingleton.getClient().subscribeOnce('prop1/puzzleComplete').then((message) => {
      if (message === 'completed') {
        res.status(200).json({ completed: true });
        // DELETE THIS LATER
        // MQTTSingleton.getClient().publish('prop4/startChallenge4');
        MQTTSingleton.getClient().publish('prop5/index');

        MQTTSingleton.getClient().publish('alarm');

        io.emit('challengeComplete1', true);

      } else {
        res.status(200).json({ completed: false });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




export const restartArduinoProp1 = (req, res) => {
  try{
    MQTTSingleton.getClient().subscribeOnce('prop1/restartArduino').then((message) => {
      res.status(200).json({ restartArduino: message });
    });
    MQTTSingleton.getClient().publish('prop1/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}


// export const startChallenge1 = (req, res) => {
//   try{
//     MQTTSingleton.getClient().subscribeOnce('prop1/startChallenge1').then((message) => {
//       res.status(200).json({ challengeMessage: message });
//     });
//     MQTTSingleton.getClient().publish('prop1/startChallenge1');
//   }
//   catch(e){
//     console.error(e)
//   }
// }

export const startChallenge1 = (req, res, io) => {
  try {
    MQTTSingleton.getClient().publish('prop1/startChallenge1');
    res.status(200).send('Challenge 1 started!');
  
  } catch(e) {
    console.error(e)
  }
}
