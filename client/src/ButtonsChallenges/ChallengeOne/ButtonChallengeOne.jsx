// ButtonChallengeOne.js
import React, { useState } from "react";

import Timer from "../Timer";

const ButtonChallengeOne = () => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
    console.log("Handling time update...");
  };

  const handleRestart = () => {
    setCurrentTime(0);
    console.log("Handling restart...");
  };

  return (
    <div className="challenge">
      <h3>Challenge One</h3>
      {/* Other challenge-specific content */}
      <Timer
        onTimeUpdate={handleTimeUpdate}
        onRestart={handleRestart}
      />
    
     
    </div>
  );
};

export default ButtonChallengeOne;
