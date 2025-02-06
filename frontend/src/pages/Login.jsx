import React, { useEffect } from 'react';  // Importing React and useEffect hook
import { useLocation } from 'react-router-dom';  // Importing useLocation hook from react-router-dom to access the current location
import LoginForm from '../components/LoginForm';  // Importing LoginForm component
import MainLayout from '../layouts/MainLayout';  // Importing MainLayout component to wrap the login form

const Login = () => {
  // Extracting the 'state' from the location object to get the redirectUrl
  const { state } = useLocation();
  // Checking if the redirectUrl exists in the state, otherwise setting it to null
  const redirectUrl = state?.redirectUrl || null;

  // Using useEffect hook to update the document title when the component mounts
  useEffect(() => {
    document.title = "Login";  // Setting the title of the page to "Login"
  }, []);  // The effect runs only once when the component mounts

  return (
    <>
      <MainLayout>
        {/* Passing the redirectUrl as a prop to the LoginForm component */}
        <LoginForm redirectUrl={redirectUrl} />
      </MainLayout>
    </>
  )
}

export default Login;
