import React, { useState, useEffect } from "react";
import Timer from "../Timer";
import { socket } from "../../socket";

const ButtonChallengeThree = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [camera1Destroyed, setCamera1Destroyed] = useState(false);
  const [camera2Destroyed, setCamera2Destroyed] = useState(false);
  const [camera3Destroyed, setCamera3Destroyed] = useState(false);
  const [camera4Destroyed, setCamera4Destroyed] = useState(false);

  // Add cooldown state for each camera
  const [camera1Cooldown, setCamera1Cooldown] = useState(false);
  const [camera2Cooldown, setCamera2Cooldown] = useState(false);
  const [camera3Cooldown, setCamera3Cooldown] = useState(false);
  const [camera4Cooldown, setCamera4Cooldown] = useState(false);

  const handleStart = () => {
    socket.emit("startButtonChallenge3Clicked");

    console.log("Handling start challenge 3...");
  };

  socket.on("challengeComplete3Camera1", () => {
    setCamera1Destroyed(true);
    console.log("Camera 1 destroyed");
  });

  socket.on("challengeComplete3Camera2", () => {
    setCamera2Destroyed(true);
    console.log("Camera 2 destroyed");
  });

  socket.on("challengeComplete3Camera3", () => {
    setCamera3Destroyed(true);
    console.log("Camera 3 destroyed");
  });

  socket.on("challengeComplete3Camera4", () => {
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


  const handleRestart = () => {
    socket.emit(`restartButtonChallenge3ClickedCamera1`);
    socket.emit(`restartButtonChallenge3ClickedCamera2`);
    socket.emit(`restartButtonChallenge3ClickedCamera3`);
    socket.emit(`restartButtonChallenge3ClickedCamera4`);
    console.log("Handling restart challenge 3...");
    setPuzzleCompleted(false);
  };

  const restartCamera = (cameraNumber, setCameraDestroyed, setCameraCooldown) => {
    socket.emit(`restartButtonChallenge3ClickedCamera${cameraNumber}`);
    console.log(`Restarting camera ${cameraNumber}`);

    // Set camera cooldown to true
    setCameraCooldown(true);

    // Disable the button for 5 seconds (5000 milliseconds)
    setTimeout(() => {
      // Enable the button after 5 seconds
      setCameraCooldown(false);
      console.log(`Cooldown lifted for camera ${cameraNumber}`);
    }, 5000);

    // Reset camera destroyed status
    setCameraDestroyed(false);
  };

  const restartCam1 = () => {
    if (!camera1Cooldown) {
      restartCamera(1, setCamera1Destroyed, setCamera1Cooldown);
    }
  };

  const restartCam2 = () => {
    if (!camera2Cooldown) {
      restartCamera(2, setCamera2Destroyed, setCamera2Cooldown);
    }
  };

  const restartCam3 = () => {
    if (!camera3Cooldown) {
      restartCamera(3, setCamera3Destroyed, setCamera3Cooldown);
    }
  };

  const restartCam4 = () => {
    if (!camera4Cooldown) {
      restartCamera(4, setCamera4Destroyed, setCamera4Cooldown);
    }
  };

  return (
    <div className="challenge">
      <h3>Challenge Three</h3>
      <Timer
        onStart={handleStart}
        onRestart={handleRestart}
      />
      
      <button onClick={restartCam1} disabled={camera1Cooldown}>
        Restart camera 1
      </button>
      <button onClick={restartCam2} disabled={camera2Cooldown}>
        Restart camera 2
      </button>
      <button onClick={restartCam3} disabled={camera3Cooldown}>
        Restart camera 3
      </button>
      <button onClick={restartCam4} disabled={camera4Cooldown}>
        Restart camera 4
      </button>
      {camera1Destroyed && <p>Camera 1 Destroyed!</p>}
      {camera2Destroyed && <p>Camera 2 Destroyed!</p>}
      {camera3Destroyed && <p>Camera 3 Destroyed!</p>}
      {camera4Destroyed && <p>Camera 4 Destroyed!</p>}
      {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeThree;
