import React, { useEffect } from 'react';  // Importing React and useEffect hook
import SignupForm from '../components/SignupForm';  // Importing the SignupForm component for the user to input their details
import MainLayout from '../layouts/MainLayout';  // Importing the MainLayout to maintain consistent layout

const Signup = () => {

  useEffect(() => {
    document.title = "Signup";  // Setting the document title to "Signup" for better SEO and user experience
  }, []);  // Empty dependency array ensures this effect only runs on mount

  return (
    <>
      <MainLayout>
        {/* Wrapping the SignupForm component inside MainLayout to ensure consistent layout */}
        <SignupForm />
      </MainLayout>
    </>
  );
}

export default Signup;
