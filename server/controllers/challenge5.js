import MQTTSingleton from "../lib/mqttSingleton.js"

// /**
//  * Toggle the led on our board
//  * @param {*} req
//  * @param {*} res
//  */
export const startChallenge5 = (req, res) => {
  try{
    MQTTSingleton.getClient().subscribeOnce('prop5/index').then(() => {
      res.status(200).json( "startChallenge5" );
    });
    MQTTSingleton.getClient().publish('prop5/index');
  }
  catch(e){
    console.error(e)
  }
}


// export const puzzleCompleteProp5 = (req, res) => {
//   try {
//     // Subscribe to the puzzleComplete topic and respond to the client once
//     MQTTSingleton.getClient().subscribeOnce('prop5/puzzleComplete').then((message) => {
//       if (message === 'completed') {
//         res.status(200).json({ completed: true });
        
//       } else {
//         res.status(200).json({ completed: false });
//       }
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

export const resetRaspberryC5 = (req, res) => {
  try{
    MQTTSingleton.getClient().publish('prop5/restartPi');
  }
  catch(e){
    console.error(e)
  }
}
