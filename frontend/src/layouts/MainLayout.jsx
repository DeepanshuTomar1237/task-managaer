import React from 'react';
import Navbar from '../components/Navbar';  

const MainLayout = ({ children }) => {
  return (
    <>
      
      <div className='relative bg-gray-50 h-screen w-screen overflow-x-hidden'>
        <Navbar />
        {/* The children prop allows any nested component or page to be displayed here */}
        {children}
      </div>
    </>
  );
}

export default MainLayout;
