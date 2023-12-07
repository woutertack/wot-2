// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';


const ButtonChallengeFour = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  const handleRestart = () => {
    socket.emit("restartButtonChallenge4Clicked")

    console.log("Handling restart...");
    setPuzzleCompleted(false);

    // also start challenge again, if you want to full restart (without starting) press restart all arduinos
    socket.emit("startButtonChallenge4Clicked");
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
        
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFour;
