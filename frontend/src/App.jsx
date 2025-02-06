import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"; // Import necessary routing components
import Task from "./pages/Task"; // Import pages for different routes
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { saveProfile } from "./redux/actions/authActions"; // Import the action to save profile data
import NotFound from "./pages/NotFound"; // Import NotFound page for invalid routes

function App() {

  const authState = useSelector(state => state.authReducer); // Access auth state from Redux store
  const dispatch = useDispatch(); // Initialize dispatch function to dispatch actions

  // Effect hook to check if a token exists in localStorage and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) return; // If no token, exit early
    dispatch(saveProfile(token)); // Dispatch action to save profile data
  }, [authState.isLoggedIn, dispatch]); // Run this effect when login status or dispatch function changes

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home route */}
          
          {/* Signup route, redirects to Home if user is logged in */}
          <Route path="/signup" element={authState.isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          
          <Route path="/login" element={<Login />} /> {/* Login route */}
          
          {/* Task routes: Redirect to login if user is not logged in */}
          <Route path="/tasks/add" 
                 element={authState.isLoggedIn ? <Task /> : <Navigate to="/login" state={{ redirectUrl: "/tasks/add" }} />} />
          
          <Route path="/tasks/:taskId" 
                 element={authState.isLoggedIn ? <Task /> : <Navigate to="/login" state={{ redirectUrl: window.location.pathname }} />} />
          
          {/* 404 route for any invalid paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
