import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Cameras from './Cameras';
import Navigation from './Navigation';
import Leaderboard from './Leaderboard';

function App() {
 return (
 <Router>
   <Navigation />
   <Routes>
     <Route path="/" element={<Dashboard />} />
     <Route path="/cameras" element={<Cameras />} />
     <Route path="/leaderboard" element={<Leaderboard />} />
   </Routes>
 </Router>
 );
}

export default App;
