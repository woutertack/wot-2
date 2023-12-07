// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeThree = () => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
    console.log("Handling time update...");
  };

  const handleRestart = () => {
    setCurrentTime(0);
    console.log("Handling restart...");
  };
  
  const restartCam1 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera1");
    console.log("Restarting camera 1");
  }
  const restartCam2 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera2");
    console.log("Restarting camera 2");
  }
  const restartCam3 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera3");
    console.log("Restarting camera 3");
  }
  const restartCam4 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera4");
    console.log("Restarting camera 4");
  }

  return (
    <div className="challenge">
      <h3>Challenge Three</h3>
      {/* Other challenge-specific content */}
      <Timer
        onTimeUpdate={handleTimeUpdate}
        onRestart={handleRestart}
      />

      <button onClick={restartCam1}>restart camera 1</button>
      <button onClick={restartCam2}>restart camera 2</button>
      <button onClick={restartCam3}>restart camera 3</button>
      <button onClick={restartCam4}>restart camera 4</button>

     
    </div>
  );
};

export default ButtonChallengeThree;
