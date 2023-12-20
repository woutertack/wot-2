import express from 'express';
import http from 'http';

import dotenv from 'dotenv';
import cors from 'cors';
import mqttSingleton from './lib/mqttSingleton.js';
import timerSingleton from './lib/timerSingleton.js';
import { Server } from 'socket.io';


import { pauzeMainTimer, startMainTimer, stopMainTimer } from './controllers/timer.js';



import { puzzleCompleteProp1, puzzleCompleteProp2, puzzleCompleteProp3, puzzleCompleteProp4, puzzleCompleteProp5 } from './controllers/puzzleComplete.js';
import { restartArduinoProp1, restartArduinoProp2, restartArduinoProp3Camera1, restartArduinoProp3Camera2, restartArduinoProp3Camera3, restartArduinoProp3Camera4, restartArduinoProp4, restartRaspberryPi } from './controllers/restartChallenges.js';
import { arduinCablesConnected, startChallenge1, startChallenge3Camera1, startChallenge3Camera2, startChallenge3Camera3, startChallenge3Camera4, startChallenge4, startChallenge5 } from './controllers/startChallenges.js';
import { addScoreToLeaderBoard, deleteEntry, getLeaderBoard, updateGroupName, updateTime } from './controllers/leaderboard.js';
import { raspberryPiBlack, raspberryPiChallenge3Dashboard, raspberryPiChallenge3Index, raspberryPiChallenge5Index } from './controllers/raspberryPi.js';
import { alarmSound, morseSound, stopSound } from './controllers/sound.js';


dotenv.config();

// Create Express app
const app = express();

// Define the HTTP server
const httpServer = http.createServer(app);

// Enable CORS
app.use(cors());

//Leaderboard middleware
app.use(express.json());

// Socket IO
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New user connected!');

  
  // socket.on('playerAskForAHint', ()=> {
  //   console.log('received hint')
  // })

  socket.on('startButtonChallenge1Clicked', startChallenge1);
  socket.on('startButtonChallenge3ClickedCamera1', startChallenge3Camera1);
  socket.on('startButtonChallenge3ClickedCamera2', startChallenge3Camera2);
  socket.on('startButtonChallenge3ClickedCamera3', startChallenge3Camera3);
  socket.on('startButtonChallenge3ClickedCamera4', startChallenge3Camera4);
  socket.on('startButtonChallenge4Clicked', startChallenge4);
  socket.on('startButtonChallenge5Clicked', startChallenge5);

  // raspberryPi
  socket.on('RaspberryPiChallenge3IndexClicked', raspberryPiChallenge3Index)
  socket.on('RaspberryPiChallenge3DashboardClicked', raspberryPiChallenge3Dashboard)
  socket.on('RaspberryPiChallenge5IndexClicked', raspberryPiChallenge5Index)
  socket.on('RaspberryPiBlackClicked', raspberryPiBlack)

  // restart arduinos
  socket.on('restartButtonChallenge1Clicked', restartArduinoProp1);
  socket.on('restartButtonChallenge2Clicked', restartArduinoProp2);
  socket.on('restartButtonChallenge3ClickedCamera1', restartArduinoProp3Camera1);
  socket.on('restartButtonChallenge3ClickedCamera2', restartArduinoProp3Camera2);
  socket.on('restartButtonChallenge3ClickedCamera3', restartArduinoProp3Camera3);
  socket.on('restartButtonChallenge3ClickedCamera4', restartArduinoProp3Camera4);
  socket.on('restartButtonChallenge4Clicked', restartArduinoProp4);
  socket.on('restartButtonChallenge5Clicked', restartRaspberryPi);

  // restart all arduinos
  socket.on('restartAllArduinos', () => {
    restartArduinoProp1();
    restartArduinoProp2();
    restartArduinoProp3Camera1();
    restartArduinoProp3Camera2();
    restartArduinoProp3Camera3();
    restartArduinoProp3Camera4();
    restartArduinoProp4();
    restartRaspberryPi();
  });

  // puzzle complete
  socket.on('challengeComplete3', puzzleCompleteProp3);

  // sound
  socket.on('alarm', alarmSound);
  socket.on('morse', morseSound);
  socket.on('stopSound', stopSound);

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

app.get("/leaderboard", getLeaderBoard);
app.post("/leaderboard", addScoreToLeaderBoard);
app.put("/leaderboard/:groupId", updateGroupName);
app.patch("/leaderboard/:groupId", updateTime);
app.delete("/leaderboard/:groupId", deleteEntry);

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
  'arduino/cables',
  'arduino/cables1',
];

const topicFunctionMap = {
  'prop1/puzzleComplete': puzzleCompleteProp1,
  'prop2/puzzleComplete': puzzleCompleteProp2,
  'prop3/puzzleCompleteCamera1': () => {
    io.emit('challengeComplete3Camera1', true);
    startChallenge3Camera2();
  },
  'prop3/puzzleCompleteCamera2': () => {
    io.emit('challengeComplete3Camera2', true);
    startChallenge3Camera3();
  },
  'prop3/puzzleCompleteCamera3': () => {
    io.emit('challengeComplete3Camera3', true);
    startChallenge3Camera4();
  },
  'prop3/puzzleCompleteCamera4': () => {
    io.emit('challengeComplete3Camera4', true);
  },
  'prop4/puzzleComplete': puzzleCompleteProp4,
  'prop5/puzzleComplete': () => {
    puzzleCompleteProp5();
    pauzeMainTimer();
  },
  'arduino/cables': arduinCablesConnected()
};

// Subscribe to topics
MQTT_TOPICS_SUBSCRIPTIONS.forEach((topic) => {
  mqttSingleton.getClient().subscribe(topic);
});

// Set up message callback after subscriptions are done
mqttSingleton.getClient().on('message', (receivedTopic, message) => {
  console.log(`Received message on topic ${receivedTopic}: ${message.toString()}`);

  const topicFunction = topicFunctionMap[receivedTopic];
  if (topicFunction && message.toString() === 'completed') {
    topicFunction();
  }
});




// Export app for testing purposes
export default app;


// const topicFunctionMap = {
//   'prop1/puzzleComplete': puzzleCompleteProp1,
//   'prop2/puzzleComplete': puzzleCompleteProp2,
//   'prop3/puzzleCompleteCamera1': () => {
//     io.emit('challengeComplete3Camera1', true);
//     startChallenge3Camera2();
//   },
//   'prop3/puzzleCompleteCamera2': () => {
//     io.emit('challengeComplete3Camera2', true);
//     startChallenge3Camera3();
//   },
//   'prop3/puzzleCompleteCamera3': () => {
//     io.emit('challengeComplete3Camera3', true);
//     startChallenge3Camera4();
//   },
//   'prop3/puzzleCompleteCamera4': () => {
//     io.emit('challengeComplete3Camera4', true);
//   },
//   'prop4/puzzleComplete': puzzleCompleteProp4,
//   'prop5/puzzleComplete': () => {
//     puzzleCompleteProp5();
//     pauzeMainTimer();
//   },
// };



// MQTT_TOPICS_SUBSCRIPTIONS.forEach((topic) => {
//   mqttSingleton.getClient().subscribeOnce(topic).then((message) => {
//     console.log({topic, message});
//     if(topic === 'prop1/puzzleComplete' && message === 'completed'){
//       puzzleCompleteProp1();
//     }if(topic === "arduino/cables"){
//       console.log('arduino cables received')
//       arduinCablesConnected();}

//     if(topic === 'prop2/puzzleComplete' && message === 'completed'){
//       puzzleCompleteProp2();
//     }if (topic === "prop3/puzzleCompleteCamera1" && message === "completed") {
//       io.emit("challengeComplete3Camera1", true);
//       // start the next camera
//       startChallenge3Camera2();
//     }if (topic === "prop3/puzzleCompleteCamera2" && message === "completed") {
//       io.emit("challengeComplete3Camera2", true);
//       // start the next camera
//       startChallenge3Camera3();
//     }if (topic === "prop3/puzzleCompleteCamera3" && message === "completed") {
//       io.emit("challengeComplete3Camera3", true);
//       // start the next camera
//       startChallenge3Camera4();
//     }if (topic === "prop3/puzzleCompleteCamera4" && message === "completed") {
//       io.emit("challengeComplete3Camera4", true);
//     }
//     if(topic === "prop4/puzzleComplete" && message === "completed"){
//       puzzleCompleteProp4();
//     }if(topic === "prop5/puzzleComplete" && message === "completed"){
//       puzzleCompleteProp5();
//       pauzeMainTimer();
//     }
//   }
//   ).catch((err) => {
//     console.error(`Error subscribing to topic ${topic}: ${err}`);
//   }
// );
// });