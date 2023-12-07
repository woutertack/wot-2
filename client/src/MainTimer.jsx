import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
import { API_URL } from './consts';
import { socket } from './socket';

const MainTimer = () => {
  const [currentTime, setCurrentTime]  = useState("00:00");

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  socket.on('timerTick', (data) => {
    setCurrentTime(formatTime(data));
  });
  
  const startTimer = () => socket.emit('startTimer');
  const pauzeTimer = () => socket.emit('pauzeTimer');
  const stopTimer = () => socket.emit('stopTimer');


  return (
    <div>
      <p>{currentTime}</p>
      <button onClick={startTimer}>start</button>
      <button onClick={pauzeTimer}>pauze</button>
      <button onClick={stopTimer}>reset Ttmer</button>
    </div>
  );
};

export default MainTimer;