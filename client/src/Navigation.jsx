import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
 return (
 <nav>
  <div className="nav-content">
    <p className='title'>Escape Room</p>
    <ul>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      
      <li>
        <Link to="/leaderboard">Leaderboard</Link>
      </li>
    </ul>
  </div>
 </nav>
 );
};

export default Navigation;
