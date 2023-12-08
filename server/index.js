import express from 'express';
import http from 'http';

import dotenv from 'dotenv';
import cors from 'cors';
import mqttSingleton from './lib/mqttSingleton.js';
import timerSingleton from './lib/timerSingleton.js';
import { Server } from 'socket.io';


import { pauzeMainTimer, startMainTimer, stopMainTimer } from './controllers/timer.js';



import { puzzleCompleteProp1, puzzleCompleteProp2, puzzleCompleteProp3, puzzleCompleteProp4 } from './controllers/puzzleComplete.js';
import { restartArduinoProp1, restartArduinoProp2, restartArduinoProp3Camera1, restartArduinoProp3Camera2, restartArduinoProp3Camera3, restartArduinoProp3Camera4, restartArduinoProp4, resetRaspberryC5 } from './controllers/restartChallenges.js';
import { startChallenge1, startChallenge3, startChallenge4, startChallenge5 } from './controllers/startChallenges.js';


dotenv.config();

// Create Express app
const app = express();

// Define the HTTP server
const httpServer = http.createServer(app);

// Enable CORS
app.use(cors());

// Socket IO
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// For testing purposes
io.on('connection', (socket) => {
  console.log('New user connected!');

  socket.on('startButtonChallenge1Clicked', startChallenge1);
  socket.on('startButtonChallenge3Clicked', startChallenge3);
  socket.on('startButtonChallenge4Clicked', startChallenge4);
  socket.on('startButtonChallenge5Clicked', startChallenge5);

  // restart arduinos
  socket.on('restartButtonChallenge1Clicked', restartArduinoProp1);
  socket.on('restartButtonChallenge2Clicked', restartArduinoProp2);
  socket.on('restartButtonChallenge3ClickedCamera1', restartArduinoProp3Camera1);
  socket.on('restartButtonChallenge3ClickedCamera2', restartArduinoProp3Camera2);
  socket.on('restartButtonChallenge3ClickedCamera3', restartArduinoProp3Camera3);
  socket.on('restartButtonChallenge3ClickedCamera4', restartArduinoProp3Camera4);
  socket.on('restartButtonChallenge4Clicked', restartArduinoProp4);
  socket.on('restartButtonChallenge5Clicked', resetRaspberryC5);

  // restart all arduinos
  socket.on('restartAllArduinos', () => {
    restartArduinoProp1();
    restartArduinoProp2();
    restartArduinoProp3Camera1();
    restartArduinoProp3Camera2();
    restartArduinoProp3Camera3();
    restartArduinoProp3Camera4();
    restartArduinoProp4();
    resetRaspberryC5();
  });

  // puzzle complete
  socket.on('challengeComplete3', puzzleCompleteProp3);

  // timer sockets
  socket.on('startTimer', startMainTimer);
  socket.on('pauzeTimer', pauzeMainTimer);
  socket.on('stopTimer', stopMainTimer);

  socket.on('disconnect', function () {
    console.log('User disconnected...');
  });

});

// Whenever we have a tick
timerSingleton.getInstance("mainTimer").onTick = (elapsedTime) => io.emit('timerTick', elapsedTime);

// Define routes
app.get('/', (req, res) => { res.send('The LED API is working!'); });


// Start server
// mqttSingleton.getInstance().subscribe('prop1/puzzleComplete');
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const MQTT_TOPICS_SUBSCRIPTIONS = [
  'prop1/puzzleComplete',
  'prop2/puzzleComplete',
  "prop3/puzzleCompleteCamera1",
  "prop3/puzzleCompleteCamera2",
  "prop3/puzzleCompleteCamera3",
  "prop3/puzzleCompleteCamera4",
  'prop4/puzzleComplete',
  'prop5/puzzleComplete',
  
];

MQTT_TOPICS_SUBSCRIPTIONS.forEach((topic) => {
  mqttSingleton.getClient().subscribeOnce(topic).then((message) => {
    console.log({topic, message});
    if(topic === 'prop1/puzzleComplete' && message === 'completed'){
      puzzleCompleteProp1();
    }
    if(topic === 'prop2/puzzleComplete' && message === 'completed'){
      puzzleCompleteProp2();
    }if (topic === "prop3/puzzleCompleteCamera1" && message === "completed") {
      io.emit("challengeComplete3Camera1", true);
      // start the next camera
      MQTTSingleton.getClient().publish('prop3/startChallenge3Camera2');
    }if (topic === "prop3/puzzleCompleteCamera2" && message === "completed") {
      io.emit("challengeComplete3Camera2", true);
      // start the next camera
      MQTTSingleton.getClient().publish('prop3/startChallenge3Camera3');
    }if (topic === "prop3/puzzleCompleteCamera3" && message === "completed") {
      io.emit("challengeComplete3Camera3", true);
      // start the next camera
      MQTTSingleton.getClient().publish('prop3/startChallenge3Camera4');
    }if (topic === "prop3/puzzleCompleteCamera4" && message === "completed") {
      io.emit("challengeComplete3Camera4", true);
    }if(topic === 'prop4/puzzleComplete' && message === 'completed'){
      puzzleCompleteProp4();
    }
  }
  ).catch((err) => {
    console.error(`Error subscribing to topic ${topic}: ${err}`);
  }
);
});


// Export app for testing purposes
export default app;