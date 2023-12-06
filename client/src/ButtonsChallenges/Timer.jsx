// Timer.js
import React, { useState, useEffect } from "react";

const Timer = ({ onTimeUpdate, onStart, onStop, onRestart }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerId;

    if (isRunning) {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        onTimeUpdate(time + 1);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [isRunning, time, onTimeUpdate]);

  const handleStart = () => {
    setIsRunning(true);
    onStart && onStart();
  };

  const handleStop = () => {
    setIsRunning(false);
    onStop && onStop();
  };

  const handleRestart = () => {
    setTime(0);
    setIsRunning(false);
    onRestart && onRestart();
  };

  return (
    <div>
      <div>{`Time: ${time}s`}</div>
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
};

export default Timer;