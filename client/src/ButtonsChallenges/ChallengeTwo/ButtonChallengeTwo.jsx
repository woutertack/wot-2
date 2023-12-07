// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeTwo = () => {
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // let socket = io(API_URL);


  const handleRestart = () => {
    setCurrentTime(0);
    console.log("Handling restart...");
  };
  
  socket.on('challengeComplete2', () => {
    
    setPuzzleCompleted(true);
    console.log("Challenge 1 completed");
  });



  return (
    <div className="challenge">
      <h3>Challenge One</h3>
      {/* Other challenge-specific content */}
      
      <Timer
        
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeTwo;
