// ButtonChallengeOne.js
import React, { useState, useEffect } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';


const ButtonChallengeThree = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [camera1Destroyed, setCamera1Destroyed] = useState(false);
  const [camera2Destroyed, setCamera2Destroyed] = useState(false);
  const [camera3Destroyed, setCamera3Destroyed] = useState(false);
  const [camera4Destroyed, setCamera4Destroyed] = useState(false);

  const handleStart = () => {
    socket.emit("startButtonChallenge3Clicked");
    
    console.log("Handling start challenge 1...");
  };


  // const handleRestart = () => {
  //   setCurrentTime(0);
  //   console.log("Handling restart...");
  // };

  socket.on('challengeComplete3Camera1', () => {
    setCamera1Destroyed(true);
    console.log("Camera 1 destroyed");
  });

  socket.on('challengeComplete3Camera2', () => {
    setCamera2Destroyed(true);
    console.log("Camera 2 destroyed");
  });

  socket.on('challengeComplete3Camera3', () => {
    setCamera3Destroyed(true);
    console.log("Camera 3 destroyed");
  });

  socket.on('challengeComplete3Camera4', () => {
    setCamera4Destroyed(true);
    console.log("Camera 4 destroyed");
  });

  useEffect(() => {
    // Check if all cameras are destroyed
    if (camera1Destroyed && camera2Destroyed && camera3Destroyed && camera4Destroyed) {
      setPuzzleCompleted(true);
      socket.emit("challengeComplete3");
    }
  }, [camera1Destroyed, camera2Destroyed, camera3Destroyed, camera4Destroyed]);


  
  const restartCam1 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera1");
    console.log("Restarting camera 1");
    setCamera1Destroyed(false);
  }
  const restartCam2 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera2");
    console.log("Restarting camera 2");
    setCamera2Destroyed(false);
  }
  const restartCam3 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera3");
    console.log("Restarting camera 3");
    setCamera3Destroyed(false);
  }
  const restartCam4 = () => {
    socket.emit("restartButtonChallenge3ClickedCamera4");
    console.log("Restarting camera 4");
    setCamera4Destroyed(false);
  }

  return (
    <div className="challenge">
      <h3>Challenge Three</h3>
      {/* Other challenge-specific content */}
      {/* <Timer
     
        onRestart={handleRestart}
      /> */}
      <button onClick={handleStart}>Start</button>
      <button onClick={restartCam1}>restart camera 1</button>
      <button onClick={restartCam2}>restart camera 2</button>
      <button onClick={restartCam3}>restart camera 3</button>
      <button onClick={restartCam4}>restart camera 4</button>
      {camera1Destroyed && <p>Camera 1 Destroyed!</p>}
      {camera2Destroyed && <p>Camera 2 Destroyed!</p>}
      {camera3Destroyed && <p>Camera 3 Destroyed!</p>}
      {camera4Destroyed && <p>Camera 4 Destroyed!</p>}
      {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeThree;
