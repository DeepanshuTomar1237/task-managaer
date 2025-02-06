import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';  // Redux hooks to dispatch actions and access state
import { Link } from 'react-router-dom';  // React Router Link component for navigation
import { logout } from '../redux/actions/authActions';  // Action to handle logout

const Navbar = () => {

  // Access authentication state from Redux store
  const authState = useSelector(state => state.authReducer);
  
  // Dispatch hook to dispatch actions like logout
  const dispatch = useDispatch();
  
  // State to toggle the visibility of the mobile navbar
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  
  // Toggle function to open and close the mobile navbar
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  // Logout handler function, dispatches the logout action
  const handleLogoutClick = () => {
    dispatch(logout());
  }

  return (
    <>
      {/* Main header/navbar section */}
      <header className='flex justify-between sticky top-0 p-4 bg-white shadow-sm items-center'>
        
        {/* Task Manager Logo/Title */}
        <h2 className='cursor-pointer uppercase font-medium'>
          <Link to="/"> Task Manager </Link>
        </h2>
        
        {/* Desktop navigation links */}
        <ul className='hidden md:flex gap-4 uppercase font-medium'>
          {authState.isLoggedIn ? (  // Check if the user is logged in
            <>
              {/* Add task button */}
              <li className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md">
                <Link to='/tasks/add' className='block w-full h-full px-4 py-2'> <i className="fa-solid fa-plus"></i> Add task </Link>
              </li>

              {/* Logout button */}
              <li className='py-2 px-3 cursor-pointer hover:bg-gray-200 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
            </>
          ) : (
            // If not logged in, show the login link
            <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-100 transition rounded-sm'><Link to="/login">Login</Link></li>
          )}
        </ul>
        
        {/* Mobile menu toggle button */}
        <span className='md:hidden cursor-pointer' onClick={toggleNavbar}>
          <i className="fa-solid fa-bars"></i>  {/* Hamburger icon */}
        </span>

        {/* Mobile navigation displayed as a sidebar */}
        <div className={`absolute md:hidden right-0 top-0 bottom-0 transition ${(isNavbarOpen === true) ? 'translate-x-0' : 'translate-x-full'} bg-gray-100 shadow-md w-screen sm:w-9/12 h-screen`}>
          <div className='flex'>
            <span className='m-4 ml-auto cursor-pointer' onClick={toggleNavbar}><i className="fa-solid fa-xmark"></i></span>  {/* Close button */}
          </div>
          
          {/* Mobile navigation links */}
          <ul className='flex flex-col gap-4 uppercase font-medium text-center'>
            {authState.isLoggedIn ? (
              <>
                {/* Add task link in mobile */}
                <li className="bg-blue-500 text-white hover:bg-blue-600 font-medium transition py-2 px-3">
                  <Link to='/tasks/add' className='block w-full h-full'> <i className="fa-solid fa-plus"></i> Add task </Link>
                </li>

                {/* Logout link in mobile */}
                <li className='py-2 px-3 cursor-pointer hover:bg-gray-200 transition rounded-sm' onClick={handleLogoutClick}>Logout</li>
              </>
            ) : (
              // If not logged in, show login link in mobile
              <li className='py-2 px-3 cursor-pointer text-primary hover:bg-gray-200 transition rounded-sm'><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </header>
    </>
  )
}

export default Navbar;
