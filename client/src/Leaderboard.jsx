// Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import { API_URL } from "./consts.js";
import './Leaderboard.css'; // Verander dit pad naar het werkelijke pad naar je leaderboard.css-bestand

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMinutes, setNewMinutes] = useState(0);
  const [newSeconds, setNewSeconds] = useState(0);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = () => {
    fetch(`${API_URL}/leaderboard`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data from server:', data);
        setLeaderboardData(Array.isArray(data.leaderboard) ? data.leaderboard : []);
      })
      .catch(error => console.error('Fout bij het ophalen van leaderboardgegevens', error));
  };
  
  
  
  const handleAddEntry = () => {
    const totalSeconds = parseInt(newMinutes) * 60 + parseInt(newSeconds);
    fetch(`${API_URL}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupname: newGroupName,
        time: totalSeconds,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }
        fetchLeaderboardData();
      })
      .catch(error => console.error('Fout bij het toevoegen van een nieuwe entry', error));
  };
  

  const handleNameChange = (groupId, updatedName) => {
    fetch(`${API_URL}/leaderboard/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupname: updatedName,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }
        fetchLeaderboardData();
      })
      .catch(error => console.error('Fout bij het aanpassen van de naam', error));
  };

  const handleTimeChange = (groupId, updatedMinutes, updatedSeconds) => {
    const totalSeconds = parseInt(updatedMinutes) * 60 + parseInt(updatedSeconds);
    fetch(`${API_URL}/leaderboard/${groupId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: totalSeconds,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
        if (data.success) {
          fetchLeaderboardData();
        } else {
          console.error('Failed to update time on the server');
        }
      })
      .catch(error => {
        console.error('Error updating time:', error);
        console.log('Data sent to server:', JSON.stringify({
          time: totalSeconds,
        }));
      });
  };
  
  

  const handleDeleteEntry = (groupId) => {
    fetch(`${API_URL}/leaderboard/${groupId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkfout - statuscode: ' + response.status);
        }
        fetchLeaderboardData();
      })
      .catch(error => console.error('Fout bij het verwijderen van de entry', error));
  };


  const formatTime = (seconds) => {
    if (isNaN(seconds)) {
      return "Invalid time";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="container">
      <h1>Leaderboard</h1>
      <div className="input-group">
        <label>
          Nieuwe groepsnaam:
          <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
        </label>
      </div>
      <div className="input-group">
        <label>
          Nieuwe tijd (minuten):
          <input type="number" value={newMinutes} onChange={(e) => setNewMinutes(e.target.value)} />
        </label>
      </div>
      <div className="input-group">
        <label>
          Nieuwe tijd (seconden):
          <input type="number" value={newSeconds} onChange={(e) => setNewSeconds(e.target.value)} />
        </label>
      </div>
      <div className="button-group">
        <button onClick={handleAddEntry}>Toevoegen</button>
      </div>
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Positie</th>
            <th>Groepsnaam</th>
            <th>Tijd</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={entry.groupId}>
              <td>{index + 1}</td>
              <td>{entry.groupname}</td>
              <td>{formatTime(entry.time)}</td>
              <td>
                <button onClick={() => handleNameChange(entry.groupId, prompt('Nieuwe groepsnaam:'))}>
                  Pas Naam Aan
                </button>
                <button onClick={() => handleTimeChange(entry.groupId, prompt('Nieuwe tijd (minuten):'), prompt('Nieuwe tijd (seconden):'))}>
                  Pas Tijd Aan
                </button>
                <button onClick={() => handleDeleteEntry(entry.groupId)}>
                  Verwijder Entry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;