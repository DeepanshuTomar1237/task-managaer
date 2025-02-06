import React from 'react';  // Importing React
import MainLayout from '../layouts/MainLayout';  // Importing the MainLayout component to maintain consistent layout

const NotFound = () => {
  return (
    <MainLayout>
      {/* Wrapping the content in MainLayout to ensure consistent layout structure */}
      <div className='w-full py-16 text-center'>
        {/* Main content for the 404 page */}
        <h1 className='text-7xl my-8'>404</h1>  {/* Large text displaying "404" */}
        <h2 className='text-xl'>The page you are looking for doesn't exist</h2>  {/* Descriptive message */}
      </div>
    </MainLayout>
  );
}

export default NotFound;
