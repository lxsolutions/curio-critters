


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PetCareGame from './components/PetCareGame';
import RPGAdventure from './components/RPGAdventure';
import Login from './components/Login';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pet-care" element={<PetCareGame />} />
          <Route path="/rpg-adventure" element={<RPGAdventure />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;


