// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeTwo = () => {
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  


  const handleRestart = () => {
    socket.emit("restartButtonChallenge2Clicked");
    console.log("Handling restart challenge 2...");
    setPuzzleCompleted(false);

    
  };

  // buttons for sound playing/stopping
  const alarm = () => {
    console.log("Playing sound...");
    socket.emit("alarm");
  };
  
  const morse = () => {
    console.log("Playing sound...");
    socket.emit("morse");
  };

  const stopSound = () => {
    console.log("Stopping sound...");
    socket.emit("stopSound");
  };

  socket.on('challengeComplete2', () => {
    
    setPuzzleCompleted(true);
    console.log("Challenge 2 completed");
  });



  return (
    <div className="challenge">
      <h3>Challenge Two</h3>
      {/* Other challenge-specific content */}
      
      <Timer
        
        onRestart={handleRestart}
      />
      <button onClick={alarm}>Play Alarm</button>
      <button onClick={morse}>Play Morse Code</button>
      <button onClick={stopSound}>Stop Sound</button>

    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeTwo;
