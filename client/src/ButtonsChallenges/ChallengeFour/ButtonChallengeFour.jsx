// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';


const ButtonChallengeFour = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  const handleStart = () => {
    socket.emit("startButtonChallenge4Clicked");

    console.log("Handling start challenge 4...");
  };

  const handleRestart = () => {
    socket.emit("restartButtonChallenge4Clicked")

    console.log("Handling restart challenge 4...");
    setPuzzleCompleted(false);
  };

  socket.on('challengeComplete4', () => {
    
    setPuzzleCompleted(true);
    console.log("Challenge 4 completed");
  });


  return (
    <div className="challenge">
      <h3>Challenge Four</h3>
      {/* Other challenge-specific content */}
      <Timer
        onStart={handleStart}
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFour;
