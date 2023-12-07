import express from 'express';
import http from 'http';

import dotenv from 'dotenv';
import cors from 'cors';
import MQTTSingleton from './lib/mqttSingleton.js';
import timerSingleton from './lib/timerSingleton.js';
import { Server } from 'socket.io';
import { puzzleCompleteProp1, startChallenge1 } from './controllers/challenge1.js';
import { restartArduinoProp1 } from './controllers/challenge1.js';
import { pauzeMainTimer, startMainTimer, stopMainTimer } from './controllers/timer.js';
import mqttSingleton from './lib/mqttSingleton.js';


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

  // timer sockets
  socket.on('startTimer', startMainTimer);
  socket.on('pauzeTimer', pauzeMainTimer);
  socket.on('stopTimer', stopMainTimer);

  socket.on('disconnect', function () {
    console.log('User disconnected...');
  });
  // socket.on('startButtonClicked', () => {
  //   mqttClient.subscribe('prop1/puzzleComplete');
  //   console.log('Start button clicked with custom data:', 'connected');
  //   try {
  //     // Publish a message to your Arduino using MQTT
  //     mqttClient.publish('prop1/startChallenge1', 'Challenge 1 started!');
  //     console.log('MQTT message published to Arduino');
  //     // You can include additional data or customize the MQTT message as needed

  //     // Send a response to the client
  //     socket.emit('challengeStarted', { message: 'Challenge 1 started!' });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });
})


// Whenever we have a tick
timerSingleton.getInstance("mainTimer").onTick = (elapsedTime) => io.emit('timerTick', elapsedTime);

// Define routes
app.get('/', (req, res) => { res.send('The LED API is working!'); });
app.get('/challenge1Completed', puzzleCompleteProp1);
app.get('/restartArduinoProp1', restartArduinoProp1);
// app.get('/startChallenge1', startChallenge1);


// Start server
// mqttSingleton.getInstance().subscribe('prop1/puzzleComplete');
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const MQTT_TOPICS_SUBSCRIPTIONS = [
  'prop1/puzzleComplete',
  'prop2/puzzleComplete',
  'prop3/puzzleComplete',
  'prop4/puzzleComplete',
  'prop5/puzzleComplete',
];

MQTT_TOPICS_SUBSCRIPTIONS.forEach((topic) => {
  mqttSingleton.getClient().subscribeOnce(topic).then((message) => {
    console.log({topic, message});
    if(topic === 'prop1/puzzleComplete' && message === 'completed'){
      puzzleCompleteProp1();
    } 
  }
  ).catch((err) => {
    console.error(`Error subscribing to topic ${topic}: ${err}`);
  }
);
});


// Export app for testing purposes
export default app;