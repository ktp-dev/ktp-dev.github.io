import './App.css';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './tailwind.css';
import Home from './home'
import Rush from './rush';
import Members from './members';
import About from './about';
import Nationals from './nationals';
import LifeApp from './lifeapp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rush" element={<Rush />} />
        <Route path="/members" element={<Members />} />
        <Route path="/about" element={<About />} />
        <Route path="/nationals" element={<Nationals />} />
        <Route path="/lifeapp" element={<LifeApp />} />
      </Routes>
    </Router>
  );
}

export default App;
