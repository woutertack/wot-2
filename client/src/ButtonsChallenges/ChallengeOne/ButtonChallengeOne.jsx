// ButtonChallengeOne.js
import React, { useEffect, useState } from "react";
import { API_URL } from "../../consts";
import Timer from "../Timer";
import io from "socket.io-client";

const ButtonChallengeOne = () => {

  const [currentTime, setCurrentTime] = useState(0);
  const socket = io(API_URL);

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
    console.log("Handling time update...");
  };

  const handleRestart = () => {
    setCurrentTime(0);
    console.log("Handling restart...");
  };
  
  const handleStart = () => {
    socket.emit("startButtonClicked");
    console.log("Handling start challenge 1...");
  };


  useEffect(() => {
    fetch(`${API_URL}/challenge1Completed`);
  }
  , []);

  return (
    <div className="challenge">
      <h3>Challenge One</h3>
      {/* Other challenge-specific content */}
      <Timer
        onTimeUpdate={handleTimeUpdate}
        onRestart={handleRestart}
        onStart={handleStart}
      />
    
     
    </div>
  );
};

export default ButtonChallengeOne;
