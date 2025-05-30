
//React Module
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

//Taiwind Css
import './App.css';

// Js Modules
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Webboard from './components/Webboard';
import FAQ from './components/Faq';

function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname === '/faq' || location.pathname === '/webboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/auction" element={<div>Auction Page</div>} />
        <Route path="/classified" element={<div>Classified Page</div>} />
        <Route path="/member" element={<div>Member Page</div>} />
        <Route path="/discuss" element={<div>Discuss Page</div>} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/webboard" element={<Webboard />} />
      </Routes>

      {!hideLayout && (
        <div className="flex max-w-full">
          <MainContent />
          <RightSidebar />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;