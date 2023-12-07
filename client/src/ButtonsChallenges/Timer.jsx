// Timer.js
import React, { useState, useEffect } from "react";

const Timer = ({ onRestart }) => {
  const [time, setTime] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  const handleRestart = () => {
    onRestart && onRestart();
    if (!cooldown) {
      setCooldown(true);
      setTime(0);

      // Trigger onRestart after 5 seconds
      setTimeout(() => {
        
        setCooldown(false); // Reset the cooldown after 5 seconds
        setCountdown(5); // Reset the countdown
      }, 5000);
    }
  };

  return (
    <div>
      <button onClick={handleRestart} disabled={cooldown}>
        {cooldown ? `Restarting in ${countdown}s` : "Restart"}
      </button>
    </div>
  );
};

export default Timer;
