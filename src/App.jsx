
import './App.css';

import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Webboard from './components/Webboard';

function App() {
  return (
  
     <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex max-w-full">
        <Sidebar />
        <MainContent />
        <RightSidebar />
      </div>
      <div className='flex max-w-full'>
          <Webboard />
      </div>
    </div>
  );
}

export default App;
