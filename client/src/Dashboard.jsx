// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

import ButtonChallengeOne from './ButtonsChallenges/ButtonChallengeOne.jsx';
import ButtonChallengeTwo from './ButtonsChallenges/ButtonChallengeTwo.jsx';
import ButtonChallengeThree from './ButtonsChallenges/ButtonChallengeThree.jsx';
import ButtonChallengeFour from './ButtonsChallenges/ButtonChallengeFour.jsx';
import ButtonChallengeFive from './ButtonsChallenges/ButtonChallengeFive.jsx';
import { API_URL, STATE_URL } from './consts.js';

import io from "socket.io-client";

import Modal from 'react-modal';

// For hints
const socket = io('http://localhost:7000/', { transports: ['websocket'], upgrade: false });



const Dashboard = () => {
  const initialChallenge1Counter = parseInt(localStorage.getItem("challenge1Timer"), 10) || 0;
  const initialChallenge2Counter = parseInt(localStorage.getItem("challenge2Timer"), 10) || 0;
  const initialChallenge3Counter = parseInt(localStorage.getItem("challenge3Timer"), 10) || 0;
  const initialChallenge4Counter = parseInt(localStorage.getItem("challenge4Timer"), 10) || 0;
  const initialChallenge5Counter = parseInt(localStorage.getItem("challenge5Timer"), 10) || 0;


  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Challenge 1', running: false, counter: initialChallenge1Counter },
    { id: 2, name: 'Challenge 2', running: false, counter: initialChallenge2Counter },
    { id: 3, name: 'Challenge 3', running: false, counter: initialChallenge3Counter },
    { id: 4, name: 'Challenge 4', running: false, counter: initialChallenge4Counter },
    { id: 5, name: 'Challenge 5', running: false, counter: initialChallenge5Counter },
  ]);

  const clearTimers = () => {
    localStorage.removeItem("challenge1Timer");
    localStorage.removeItem("challenge2Timer");
    localStorage.removeItem("challenge3Timer");
    localStorage.removeItem("challenge4Timer");
    localStorage.removeItem("challenge5Timer");
    location.reload()
   };
  

 const [totalCounter, setTotalCounter] = useState(0);
 const [isModalOpen, setIsModalOpen] = useState(false);

 const saveTeamInfo = (teamName, time) => {
  const savedTeamNames = JSON.parse(localStorage.getItem('teamNames')) || [];
  savedTeamNames.push({ teamName, time });
  localStorage.setItem('teamNames', JSON.stringify(savedTeamNames));
 };
 const [teamName, setTeamName] = useState('');


 const [hint, setHint] = useState('');
 const [hintInput, setHintInput] = useState('');
 const [hintOptions, setHintOptions] = useState(["Hint 1", "Hint 2", "Hint 3"]);

const sendHint = (selectedHint) => {
    const hintToSend = selectedHint || hintInput.trim();
    if (hintToSend !== '') {
        setHint(hintToSend);
        socket.emit('display_hint', hintToSend);
    }
};

// Show modal with completed message when challenge 5 is completed
const handleSocketEvents = (handleChallengeCompleted) => {

  // socket event that checks if challenge 5 is completed
  socket.on('challenge5/completed', () => {
    // alert('Challenge 5 completed!');
    handleChallengeCompleted(5); // stop timer of challenge 5
    // setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);

  });

  // socket event that checks if the player asked for a hint
  socket.on('playerAskForAHint', () => {
    alert('Player asked for a hint!');
  });
}


 const toggleChallenge = (id) => {
   setChallenges((prevChallenges) =>
     prevChallenges.map((challenge) =>
       challenge.id === id ? { ...challenge, running: !challenge.running } : challenge
     )
   );
 };

 const restartTimer = (id) => {
  setChallenges((prevChallenges) =>
    prevChallenges.map((challenge) =>
      challenge.id === id ? { ...challenge, counter: 0 } : challenge
    )
  );
};



 useEffect(() => {
   let total = 0;

   for (const challenge of challenges) {
     total += challenge.counter;
   }

   setTotalCounter(total);
 }, [challenges]);

 useEffect(() => {
  Modal.setAppElement('#root');
 }, []);

//  useEffect(() => {
//   const savedTeamName = localStorage.getItem('teamName');
//   const savedTime = localStorage.getItem('time');
//   if (savedTeamName && savedTime) {
//     setTeamInfo({ teamName: savedTeamName, time: savedTime });
//   }
//  }, []);

 useEffect(() => {
   let timers = [];

   for (const challenge of challenges) {
     if (challenge.running) {
       const timer = setInterval(() => {
         setChallenges((prevChallenges) =>
           prevChallenges.map((c) =>
             c.id === challenge.id ? { ...c, counter: c.counter + 1 } : c
           )
         );
       }, 1000);

       timers.push(timer);
     }
   }

   return () => {
     timers.forEach((timer) => clearInterval(timer)); // Clean up the timers on component unmount
   };
 }, [challenges]);

 const handleChallengeCompleted = useCallback((completedChallengeId) => {
  // console.log("Challenge " + completedChallengeId + " completed");
  setChallenges((prevChallenges) =>
    prevChallenges.map((challenge) => {
      if (challenge.id === completedChallengeId) {
        // Stop the timer for the completed challenge
        return { ...challenge, running: false, completed: true };
      } else if (challenge.id === completedChallengeId + 1) {
        // Start the timer for the next challenge
        return { ...challenge, running: true };
      } else {
        return challenge;
      }
    })
  );
 
  if (completedChallengeId === 5) {
    // setIsModalOpen(true);

  }
 }, []);

  // useEffect to handle the socket events
  useEffect(() => {
    handleSocketEvents(handleChallengeCompleted);
  }, [handleChallengeCompleted]);

  // add score to leaderboard
  const handleAddEntry = () => {
    // const totalTime = parseInt(totalCounter) * 60 + parseInt(totalCounter);
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
       console.log('succes')
      })
      .catch(error => console.error('Fout bij het toevoegen van een nieuwe entry', error));
  };
  



  return (
  <div className="dashboard">
    <h1>Escape Room Dashboard</h1>
    {/* <p>Total Timer: {currentTime}s</p> */}
      <p>Total Timer: {totalCounter}s</p>
      <button className='submitButton' onClick={clearTimers}>Clear timers from localstorage and reload the page</button>

     {/* <button onClick={startTimer}>start</button> */}
      {/* <button onClick={pauzeTimer}>pauze</button>
      <button onClick={stopTimer}>stop</button> */}
     <div className="challenges-grid">

       {/* Use the specific ButtonChallenge components for each challenge */}
       <ButtonChallengeOne
         toggleChallenge={toggleChallenge}
        //  clicked={startTimer}
         restartTimer={(id, newCounter) => restartTimer(id, newCounter)}
         running={challenges[0].running}
         counter={challenges[0].counter}
         onChallengeCompleted={() => handleChallengeCompleted(1)}
       /> 
       <ButtonChallengeTwo
         toggleChallenge={toggleChallenge}
         restartTimer={restartTimer}
         running={challenges[1].running}
         counter={challenges[1].counter}
         onChallengeCompleted={() => handleChallengeCompleted(2)}
         challengeOneCompleted={challenges[0].completed}
       /> 
        <ButtonChallengeThree
         toggleChallenge={toggleChallenge}
         restartTimer={restartTimer}
         running={challenges[2].running}
         counter={challenges[2].counter}
         onChallengeCompleted={() => handleChallengeCompleted(3)}
         challengeTwoCompleted={challenges[1].completed}
       />
       <ButtonChallengeFour
         toggleChallenge={toggleChallenge}
         restartTimer={restartTimer}
         running={challenges[3].running}
         counter={challenges[3].counter}
         onChallengeCompleted={() => handleChallengeCompleted(4)}
         challengeThreeCompleted={challenges[2].completed}
       /> 
       <ButtonChallengeFive
       
         toggleChallenge={toggleChallenge}
         restartTimer={restartTimer}
         running={challenges[4].running}
         counter={challenges[4].counter}
         onChallengeCompleted={() => handleChallengeCompleted(5)}
       />
      <Modal
      className="modal"
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Escape Room Completed Modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      >
      <div className="title">
        <h2 className='completionTitle'>Congratulations!</h2>
        <button className='close' onClick={() => setIsModalOpen(false)}>X</button>
      </div>
      <p>The escape room was completed in {totalCounter} seconds!</p>
      <label htmlFor="">Team name</label>
      <input className='teamNameInput' type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
      <a className='submitButton'  onClick={() => {
        setIsModalOpen(false);
        handleAddEntry();
      }}>Submit</a>
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
   </div>
 );
};

export default Dashboard;