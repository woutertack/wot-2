import MQTTSingleton from "../lib/mqttSingleton.js"



export const puzzleCompleteProp4 = (req, res) => {
  try {
    // Subscribe to the puzzleComplete topic and respond to the client once
    MQTTSingleton.getClient().subscribeOnce('prop4/puzzleComplete').then((message) => {
      if (message === 'completed') {
        res.status(200).json({ completed: true });
        MQTTSingleton.getClient().publish('prop5/index');
      } else {
        res.status(200).json({ completed: false });
      }
    });

    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const restartArduinoProp4 = (req, res) => {
  try{
    MQTTSingleton.getClient().subscribeOnce('prop4/restartArduino').then((message) => {
      res.status(200).json({ restartArduino: message });
    });
    MQTTSingleton.getClient().publish('prop4/restartArduino');
  }
  catch(e){
    console.error(e)
  }
}

// export const restartArduino2Prop4 = (req, res) => {
//   try{
//     MQTTSingleton.getClient().subscribeOnce('prop4/restartArduino2').then((message) => {
//       res.status(200).json({ restartArduino: message });
//     });
//     MQTTSingleton.getClient().publish('prop4/restartArduino2');
//   }
//   catch(e){
//     console.error(e)
//   }
// }


export const startChallenge4 = (req, res) => {
  try{
    MQTTSingleton.getClient().subscribeOnce('prop4/startChallenge4').then((message) => {
      res.status(200).json({ challengeMessage: message });
    });
    MQTTSingleton.getClient().publish('prop4/startChallenge4');
  }
  catch(e){
    console.error(e)
  }
}