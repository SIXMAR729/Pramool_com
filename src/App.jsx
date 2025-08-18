import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Assuming your CSS file is correctly imported
import './App.css';

// Import your components
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
import AuctionPage from './components/AuctionPage'; 
import { AuthProvider } from './contexts/AuthContext';

function Layout() {
    const location = useLocation();

    // This logic determines when to hide the RightSidebar.
    // It now correctly handles dynamic paths like '/discuss/123'.
    const hideRightSidebar = [
        '/faq', 
        '/webboard', 
        '/login', 
        '/register', 
        '/discuss', 
        '/discuss/new', 
        '/member', 
        '/auction'
    ].includes(location.pathname) || location.pathname.startsWith('/discuss/');

    return (
        // The main container is a flex column to stack the Header above the content.
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            {/* This container uses flex-row to place sidebars and content next to each other. */}
            <div className="flex flex-1">
                <Sidebar /> {/* Your left sidebar from Sidebar.js */}
                
                {/* The main content area grows to fill the available space between the sidebars. */}
                <main className="flex-grow p-4">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/auction" element={<AuctionPage />} />
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
                        
                        <Route path="/webboard" element={
                            <ProtectedRoute>
                                <Webboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>

                {/* The RightSidebar is now part of the flex container. */}
                {/* It will only render if the path is NOT in our 'hideRightSidebar' list. */}
                {!hideRightSidebar && <RightSidebar />}
            </div>
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
