import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Webboard from './components/Webboard';
import FAQ from './components/Faq';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Discuss from './components/Discuss';
import CreateDiscussion from './components/CreateDiscussion';
import DiscussionDetail from './components/DiscussionDetail';
import MemberPage from './components/MemberPage';
import { AuthProvider } from './contexts/AuthContext';

function Layout() {
  const location = useLocation();
  const hideLayout = ['/faq', '/webboard', '/login', '/register', '/discuss', '/discuss/new', '/member', '/discuss/:id'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/auction" element={<div>Auction Page</div>} />
        <Route path="/classified" element={<div>Classified Page</div>} />
        
        <Route path="/member" element={
          <ProtectedRoute adminOnly={true}>
            <MemberPage />
          </ProtectedRoute>
        } />

        <Route path="/discuss" element={<Discuss />} />
        <Route path="/discuss/new" element={
          <ProtectedRoute>
            <CreateDiscussion />
          </ProtectedRoute>
        } />
        <Route path="/discuss/:id" element={<DiscussionDetail />} />

        <Route path="/faq" element={<FAQ />} />
        
        <Route 
          path="/webboard" 
          element={
            <ProtectedRoute>
              <Webboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {!hideLayout && (
        <div className="flex max-w-full">
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
