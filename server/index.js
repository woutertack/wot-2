import express from 'express';
import http from 'http';

import dotenv from 'dotenv';
import cors from 'cors';
import MQTTSingleton from './lib/mqttSingleton.js';
import timerSingleton from './lib/timerSingleton.js';
import { Server } from 'socket.io';
import { puzzleCompleteProp1, startChallenge1 } from './controllers/challenge1.js';
import { restartArduinoProp1 } from './controllers/challenge1.js';


dotenv.config();

// Create Express app
const app = express();

// Define the HTTP server
const httpServer = http.createServer(app);

// Enable CORS
app.use(cors());

// Socket IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const mqttClient = MQTTSingleton.getClient();
// For testing purposes
io.on('connection', (socket) => {
  console.log('New user connected!');
  socket.on('disconnect', function () {
    console.log('User disconnected...');
  });

  socket.on('startButtonClicked', () => {
    mqttClient.subscribe('prop1/puzzleComplete');
    console.log('Start button clicked with custom data:', 'connected');
    try {
      // Publish a message to your Arduino using MQTT
      mqttClient.publish('prop1/startChallenge1', 'Challenge 1 started!');
      console.log('MQTT message published to Arduino');
      // You can include additional data or customize the MQTT message as needed

      // Send a response to the client
      socket.emit('challengeStarted', { message: 'Challenge 1 started!' });
    } catch (e) {
      console.error(e);
    }
  });
})

// Whenever we have a tick
timerSingleton.getInstance().onTick = (elapsedTime) => io.emit('timerTick', elapsedTime);

// Define routes
app.get('/', (req, res) => { res.send('The LED API is working!'); });
app.get('/challenge1Completed', (req, res) => {
  puzzleCompleteProp1(req, res, io)
});
app.get('/restartArduinoProp1', (req, res) => {
  restartArduinoProp1(req, res)
}
);
app.get('/startChallenge1', (req, res) => {
  startChallenge1(req, res, io)
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export app for testing purposes
export default app;