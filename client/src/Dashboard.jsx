// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';



import { API_URL, STATE_URL } from './consts.js';

import io from "socket.io-client";

import Modal from 'react-modal';
import ButtonChallengeOne from './ButtonsChallenges/ChallengeOne/ButtonChallengeOne.jsx';
import ButtonChallengeTwo from './ButtonsChallenges/ChallengeTwo/ButtonChallengeTwo.jsx';
import ButtonChallengeThree from './ButtonsChallenges/ChallengeThree/ButtonChallengeThree.jsx';
import ButtonChallengeFour from './ButtonsChallenges/ChallengeFour/ButtonChallengeFour.jsx';
import ButtonChallengeFive from './ButtonsChallenges/ChallengeFive/ButtonChallengeFive.jsx';




const Dashboard = () => {
  


  return (
  <div className="dashboard">
    <h1>Escape Room Dashboard</h1>
  
     <div className="challenges-grid">


      <ButtonChallengeOne/> 
      <ButtonChallengeTwo/>
      <ButtonChallengeThree/>
      <ButtonChallengeFour/>
      <ButtonChallengeFive/>
      
    </div>
    
   </div>
 );
};

export default Dashboard;