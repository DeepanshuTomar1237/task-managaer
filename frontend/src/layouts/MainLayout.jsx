import React from 'react';
import Navbar from '../components/Navbar';  // Importing Navbar component

const MainLayout = ({ children }) => {
  return (
    <>
      {/* The outer div acts as a container for the entire layout */}
      <div className='relative bg-gray-50 h-screen w-screen overflow-x-hidden'>
        {/* Rendering Navbar component */}
        <Navbar />
        
        {/* This is where the dynamic children will be rendered */}
        {/* The children prop allows any nested component or page to be displayed here */}
        {children}
      </div>
    </>
  );
}

export default MainLayout;
