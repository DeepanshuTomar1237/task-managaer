import React, { useEffect } from 'react';  
import SignupForm from '../components/SignupForm'; 
import MainLayout from '../layouts/MainLayout';  

const Signup = () => {

  useEffect(() => {
    document.title = "Signup";  // Setting the document title to "Signup" for better SEO and user experience
  }, []);  
  return (
    <>
      <MainLayout>
       
        <SignupForm />
      </MainLayout>
    </>
  );
}

export default Signup;
