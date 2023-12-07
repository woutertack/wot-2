import MQTTSingleton from "../lib/mqttSingleton.js"

export const puzzleCompleteProp3Camera1 = (req, res) => {
  try {
    // Subscribe to the puzzleComplete topic and respond to the client once
    MQTTSingleton.getClient().subscribeOnce('prop3/puzzleCompleteCamera1').then((message) => {
      if (message === 'completed') {
        res.status(200).json({ completed: true });
        // MQTTSingleton.getClient().publish('stop');
        // MQTTSingleton.getClient().publish('camera1/dead')
       
      } else {
        res.status(200).json({ completed: false });
      }
    });

    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// export const puzzleCompleteProp3Camera2 = (req, res) => {
//   try {
//     // Subscribe to the puzzleComplete topic and respond to the client once
//     MQTTSingleton.getClient().subscribeOnce('prop3/puzzleCompleteCamera2').then((message) => {
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

// export const puzzleCompleteProp3Camera3 = (req, res) => {
//   try {
//     // Subscribe to the puzzleComplete topic and respond to the client once
//     MQTTSingleton.getClient().subscribeOnce('prop3/puzzleCompleteCamera3').then((message) => {
//       if (message === 'completed') {
//         res.status(200).json({ completed: true });
//         MQTTSingleton.getClient().publish('camera3/dead')
//       } else {
//         res.status(200).json({ completed: false });
//       }
//     });

    
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// export const puzzleCompleteProp3Camera4 = (req, res) => {
//   try {
//     // Subscribe to the puzzleComplete topic and respond to the client once
//     MQTTSingleton.getClient().subscribeOnce('prop3/puzzleCompleteCamera4').then((message) => {
//       if (message === 'completed') {
//         res.status(200).json({ completed: true });
//         MQTTSingleton.getClient().publish('camera4/dead')
//       } else {
//         res.status(200).json({ completed: false });
//       }
//     });

    
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

export const puzzleCompleteProp3All = (req, res) => {
  try {
    const cameras = [ 'Camera4'];

    // Create an array to store unique subscriptions for each camera
    const subscriptions = cameras.map(camera => MQTTSingleton.getClient().subscribeOnce(`prop3/puzzleComplete${camera}`));

    // Use Promise.all to wait for all promises to resolve
    Promise.all(subscriptions.map((subscription, index) => 
      subscription.then((message) => {
        // Check if the message for each camera is 'completed'
        MQTTSingleton.getClient().publish('prop4/startChallenge4');
        // MQTTSingleton.getClient().publish(`prop3/puzzleComplete${cameras[index]}/dead`);
        return message === 'completed';
      })
    )).then(results => {
      // If all cameras have completed, respond with completed: true
      if (results.every(result => result)) {
        res.status(200).json({ completed: true });
      } else {
        res.status(200).json({ completed: false });
      }
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
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


/**
 * Ask for the LED state
 * @param {*} req
 * @param {*} res
 */
// export const startChallenge3 = (req, res) => {
//   try {
//     MQTTSingleton.getClient().publish('prop3/index', "starting challenge 3");
//     res.status(200).send('flask stopped');
//   } catch(e) {
//     console.error(e)
//   }
// }


export const startChallenge3 = (req, res) => {
  try {
    MQTTSingleton.getClient().publish('prop3/startChallenge3');
    res.status(200).send('Challenge 3 started!');
  } catch(e) {
    console.error(e)
  }
}
