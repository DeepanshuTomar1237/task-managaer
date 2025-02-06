import React, { useEffect } from 'react';  // Importing React and useEffect hook
import { useSelector } from 'react-redux';  // Importing the useSelector hook to access the Redux store
import { Link } from 'react-router-dom';  // Importing Link to navigate between routes
import Tasks from '../components/Tasks';  // Importing the Tasks component
import MainLayout from '../layouts/MainLayout';  // Importing the MainLayout component

const Home = () => {
  // Accessing authentication state from Redux store
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;  // Destructuring to get the isLoggedIn status from the authState

  // Using useEffect hook to change the document title based on whether the user is logged in
  useEffect(() => {
    // If the user is logged in, set the title to "{user's name}'s tasks"
    // If not, set the title to "Task Manager"
    document.title = authState.isLoggedIn ? `${authState.user.name}'s tasks` : "Task Manager";
  }, [authState]);  // The effect runs whenever authState changes (login state or user info)

  return (
    <>
      <MainLayout>
        {/* Conditional rendering based on login status */}
        {!isLoggedIn ? (
          // If the user is not logged in, show a welcome message and signup link
          <div className='bg-primary text-white h-[40vh] py-8 text-center'>
            <h1 className='text-2xl'> Welcome to Task Manager App</h1>
            <Link to="/signup" className='mt-10 text-xl block space-x-2 hover:space-x-4'>
              {/* Link to the signup page */}
              <span className='transition-[margin]'>Join now to manage your tasks</span>
              <span className='relative ml-4 text-base transition-[margin]'><i className="fa-solid fa-arrow-right"></i></span>
            </Link>
          </div>
        ) : (
          <>
            {/* If the user is logged in, display a welcome message and the Tasks component */}
            <h1 className='text-lg mt-8 mx-8 border-b border-b-gray-300'>Welcome {authState.user.name}</h1>
            {/* Displaying tasks */}
            <Tasks />
          </>
        )}
      </MainLayout>
    </>
  );
}

export default Home;
