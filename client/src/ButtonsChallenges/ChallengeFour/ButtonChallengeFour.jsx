// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';
import {API_URL} from '../../consts';


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

  const handleButtons = () => {
    // socket.emit("buttonChallenge4Clicked");
    fetch(`${API_URL}/arduino/cables1`)
          .then(res => res.text())
          .then(data => {
            console.log("restarted");
            // setPuzzleCompleted(false);
            // setToggleState(false);

            // // Clear puzzle completion status from local storage when restarted
            // savePuzzleCompletionToLocalStorage(false);
          });
  }


  return (
    <div className="challenge">
      <h3>Challenge Four</h3>
      {/* Other challenge-specific content */}
      <Timer
        onStart={handleStart}
        onRestart={handleRestart}
      />
      <button onClick={handleButtons}>start button</button>
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFour;
