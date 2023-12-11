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
import MainTimer from './MainTimer.jsx';
import { socket } from "./socket";

const socketPi = io('http://localhost:8000/', { transports: ['websocket'], upgrade: false });
// const socketPi = io('http://192.168.50.252:8000/', { transports: ['websocket'], upgrade: false });


const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCounter, setTotalCounter] = useState("00:00");
  const [teamName, setTeamName] = useState('');
  const [hint, setHint] = useState('');
  const [hintInput, setHintInput] = useState('');
  const [hintOptions, setHintOptions] = useState(["Je kan maar 1 hint krijgen om de 5min", "Hint 1", "Hint 2", "Hint 3"]);
 
  // let didPlayerAskedForAHint = document.querySelector('.didPlayerAskedForAHint');
  const [receivedHint, setReceivedHint] = useState('');

  // const [hintMessage, setHintMessage] = useState('');
  const [hintMessages, setHintMessages] = useState([]);



 
  // get timer from MainTimer
   const handleTimerTick = (currentTime) => {
    setTotalCounter(currentTime);
  };

  // add entry to leaderboard
  const handleAddEntry = () => {
    
    fetch(`${API_URL}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupname: teamName,
        time: totalCounter,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }

      })
      .catch(error => console.error('Fout bij het toevoegen van een nieuwe entry', error));
  };
  
  const sendHint = (selectedHint) => {
      const hintToSend = selectedHint || hintInput.trim();
      if (hintToSend !== '') {
          setHint(hintToSend);
          console.log('Sending hint: ' + hintToSend);
          socketPi.emit('display_hint', hintToSend);
          console.log('Sent hint: ' + hintToSend);
      }
  };

  const handleSocketEvents = (handleChallengeCompleted) => {

    // socket event that checks if challenge 5 is completed
    // socket.on('challengeComplete5', () => {
    //   // alert('Challenge 5 completed!');
    //   handleChallengeCompleted(5); // stop timer of challenge 5
    //   // setIsModalOpen(true);
    //   setTimeout(() => {
    //     setIsModalOpen(true);
    //   }, 0);
  
    // });
  
    // socket event that checks if the player asked for a hint

  }

  socketPi.on('playerAskForAHint', () => {
    // alert('Player asked for a hint!');
    // setHintMessage('Player asked for a hint!');
    // setHintMessages(prevMessages => [...prevMessages, 'Player asked for a hint!']);
    playHintSound();
    const now = new Date();

    // Format the date and time as a string
    const dateTimeString = now.toLocaleString();
   
    // Append the date and time to the hint message
    const hintMessage = 'Player asked for a hint! ' + dateTimeString;

    console.log(hintMessage);
   
    // Add the hint message to the array
    setHintMessages(hintMessage);


  });

  const playHintSound = () => {
    console.log('Playing hint sound');
    const audio = new Audio('./src/audio/hint_message.mp3');
    audio.play();
  }


  // socket event that checks if the player asked for a hint
  // socketPi.on('playerAskForAHint', () => {
  //   // alert('Player asked for a hint!');
  //   setReceivedHint('Player asked for a hint!');
  // });

  socket.on('challengeComplete5', () => {
    setIsModalOpen(true)
    console.log("Challenge 5 completed");
  });
  
  
  useEffect(() => {
    Modal.setAppElement('#root');
   }, []);

  // useEffect(() => {
  //   handleSocketEvents(handleChallengeCompleted);
  // }, [handleChallengeCompleted]);

  const handleRestart = () => {
    socket.emit("restartAllArduinos");
    console.log("Restarting all arduinos");
  };


  

  return (
  <div className="dashboard">
    <h1 className='titleEscapeRoom'>Escape Room Dashboard</h1>
    <div className="timerContainer">
      <MainTimer onTimerTick={handleTimerTick}/>
    </div>
      <button className='restartAll' onClick={handleRestart}>Restart all arduinos</button>
     <div className="challenges-grid">


      <ButtonChallengeOne/> 
      <ButtonChallengeTwo/>
      <ButtonChallengeThree/>
      <ButtonChallengeFour/>
      <ButtonChallengeFive/>
      
      <Modal
      className="modal"
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Escape Room Completed Modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      >
      <div className='completionTitle'>
        <p className='titleModal'>Congratulations!</p>
        <button className='closeButton' onClick={() => setIsModalOpen(false)}>X</button>
      </div>
      
      <p>The escape room was completed in {totalCounter} seconds!</p>

      <input className='teamNameInput' type="text" value={teamName} placeholder="Team name"onChange={(e) => setTeamName(e.target.value)} />
      <a className='submitButton' onClick={() => {
       
        handleAddEntry();
        setIsModalOpen(false);
       
      }}>Add to leaderboard</a>
      </Modal>
       {/* {/* Use other ButtonChallenge components for other challenges */}
     </div>
     <div>
        <h2>Hint Options</h2>
        <ul>
            {hintOptions.map((option, index) => (
                <button key={index} onClick={() => sendHint(option)}>
                    {option}
                </button>
            ))}
        </ul>
    </div>
    <div>
        <h2>Custom Hint</h2>
        <input
            type="text"
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
            placeholder="Type custom hint"
        />
        <button onClick={() => sendHint()}>Send Hint</button>
    </div>
    <div className="hintMessage">
      <h2>Hint messages</h2>
      {/* {hintMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))} */}
      {hintMessages}
    </div>

   </div>
    );
  };

export default Dashboard;