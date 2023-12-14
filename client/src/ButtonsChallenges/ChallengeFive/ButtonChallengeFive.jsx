// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeFive = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [challenge3Index, setChallenge3Index] = useState(false);
  const [challenge3Dashboard, setChallenge3Dashboard] = useState(false);
  const [challenge5Index, setChallenge5Index] = useState(false);
  const [black, setBlack] = useState(false);

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
    setChallenge3Index(true);
  }
  const handleRaspberryPiChallenge3Dashboard = () => { 
    socket.emit("RaspberryPiChallenge3DashboardClicked");
    setChallenge3Dashboard(true);
  }
  const handleRaspberryPiChallenge5Index = () => { 
    socket.emit("RaspberryPiChallenge5IndexClicked");
    setChallenge5Index(true);
  }
  const handleRaspberryPiBlack = () => { 
    socket.emit("RaspberryPiBlackClicked");
    setBlack(true);
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
      <button onClick={handleRaspberryPiChallenge5Index} disabled={challenge3Index}>prop 5 index page</button>
      <button onClick={handleRaspberryPiChallenge3Index} disabled={challenge3Dashboard}>prop 3 index page</button>
      <button onClick={handleRaspberryPiChallenge3Dashboard} disabled={challenge5Index}>prop 3 dashboard page</button>
      <button onClick={handleRaspberryPiBlack} disabled={black}>black page</button>
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeFive;
