// ButtonChallengeOne.js
import React, { useEffect, useState } from "react";
import { API_URL } from "../../consts";
import Timer from "../Timer";
import {socket} from '../../socket';

const ButtonChallengeOne = () => {
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // let socket = io(API_URL);


  const handleRestart = () => {
    socket.emit("restartButtonChallenge1Clicked");
    console.log("Handling restart...");
    setPuzzleCompleted(false);

    // also start challenge again, if you want to full restart (without starting) press restart all arduinos
    socket.emit("startButtonChallenge1Clicked");
  };
  
  // const handleStart = () => {
  //   socket.emit("startButtonChallenge1Clicked");
    
  //   console.log("Handling start challenge 1...");
  // };


 
  
  socket.on('challengeComplete1', () => {
    setPuzzleCompleted(true);
    console.log("Challenge 1 completed");
  });



  return (
    <div className="challenge">
      <h3>Challenge One</h3>
      {/* Other challenge-specific content */}
      {/* <button onClick={handleStart}>Start</button> */}
      <Timer
        
        onRestart={handleRestart}
      />
    
    {puzzleCompleted && <p>Puzzle Completed!</p>}
    </div>
  );
};

export default ButtonChallengeOne;
