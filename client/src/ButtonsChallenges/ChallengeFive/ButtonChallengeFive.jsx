// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeFive = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

 

  const handleRestart = () => {
    socket.emit("restartButtonChallenge5Clicked");
    setCurrentTime(0);
    console.log("Handling restart...");
  };

  return (
    <div className="challenge">
      <h3>Challenge Five</h3>
      {/* Other challenge-specific content */}
      <Timer
     
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFive;
