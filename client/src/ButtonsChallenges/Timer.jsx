import React, { useState, useEffect } from "react";

const Timer = ({ onStart, onRestart }) => {
  const [time, setTime] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    let countdownInterval;

    if (cooldown) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);

        if (countdown === 0) {
          clearInterval(countdownInterval);
          setCooldown(false);
          setCountdown(5);
        }
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [cooldown, countdown]);

  const handleStart = () => {
    if (!timerStarted) {
      onStart && onStart();
      setTimerStarted(true);
    }
  };

  const handleRestart = () => {
    onRestart && onRestart();
    if (!cooldown) {
      setCooldown(true);
      setTime(0);
      setTimerStarted(false); // Reset timerStarted when restarting

      // Trigger onRestart after 5 seconds
      setTimeout(() => {
        setCooldown(false); // Reset the cooldown after 5 seconds
        setCountdown(5); // Reset the countdown
      }, 5000);
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={cooldown || timerStarted}>
        Start
      </button>
      <button onClick={handleRestart} disabled={cooldown}>
        {cooldown ? `Restarting in ${countdown}s` : "Restart device(s)"}
      </button>
    </div>
  );
};

export default Timer;
