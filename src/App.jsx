import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Webboard from './components/Webboard';
import FAQ from './components/Faq';
import Login from './components/Login'; // Standardized casing for consistency
import Register from './components/Register';
import { AuthProvider } from './contexts/AuthContext';

function Layout() {
  const location = useLocation();
  const hideLayout = ['/faq', '/webboard', '/login', '/register'].includes(location.pathname);

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
