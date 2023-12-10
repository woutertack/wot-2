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

  const handleRaspberryPiChallenge3Index = () => { 
    socket.emit("RaspberryPiChallenge3IndexClicked");
  }
  const handleRaspberryPiChallenge3Dashboard = () => { 
    socket.emit("RaspberryPiChallenge3DashboardClicked");
  }
  const handleRaspberryPiChallenge5Index = () => { 
    socket.emit("RaspberryPiChallenge5IndexClicked");
  }
  const handleRaspberryPiBlack = () => { 
    socket.emit("RaspberryPiBlackClicked");
  }

  socket.on('challengeComplete5', () => {
    setPuzzleCompleted(true);
    console.log("Challenge 5 completed");
  });

  return (
    <div className="challenge">
      <h3>Challenge Five</h3>
      {/* Other challenge-specific content */}
      <Timer
        onStart={handleStart}
        onRestart={handleRestart}
      />
      <button onClick={handleRaspberryPiChallenge5Index}>prop 5 index page</button>
      <button onClick={handleRaspberryPiChallenge3Index}>prop 3 index page</button>
      <button onClick={handleRaspberryPiChallenge3Dashboard}>prop 3 dashboard page</button>
      <button onClick={handleRaspberryPiBlack}>black page</button>
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFive;
