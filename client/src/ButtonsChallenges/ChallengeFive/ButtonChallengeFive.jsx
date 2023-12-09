// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeFive = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  const handleStart = () => {
    socket.emit("startButtonChallenge5Clicked");

    console.log("Handling start challenge 5...");
  }

  const handleRestart = () => {
    socket.emit("restartButtonChallenge5Clicked");
    setCurrentTime(0);
    console.log("Handling restart challenge 5...");

    setPuzzleCompleted(false);
  };

  return (
    <div className="challenge">
      <h3>Challenge Five</h3>
      {/* Other challenge-specific content */}
      <Timer
        onStart={handleStart}
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFive;
