import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';  // Import for routing
import useFetch from '../hooks/useFetch';  // Custom hook to handle fetch requests
import validateManyFields from '../validations';  // Function to validate the form fields
import Input from './utils/Input';  // Reusable Input component for form fields
import Loader from './utils/Loader';  // Loader component to show while fetching data

const SignupForm = () => {

  // State to store any form errors
  const [formErrors, setFormErrors] = useState({});
  
  // State to store form data (name, email, password)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  // Custom hook for making API requests
  const [fetchData, { loading }] = useFetch();
  
  // React Router's navigate hook to navigate programmatically
  const navigate = useNavigate();

  // Handle changes in the form inputs
  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate form fields using validation function
    const errors = validateManyFields("signup", formData);
    
    // Clear previous errors
    setFormErrors({});
    
    // If validation errors exist, set errors in state and prevent submission
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    // API request configuration
    const config = { url: "/auth/signup", method: "post", data: formData };
    
    // Call custom hook to perform the API request
    fetchData(config).then(() => {
      // Redirect to login page after successful signup
      navigate("/login");
    });
  }

  // Helper function to display error messages for a specific field
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <form className='m-auto my-16 max-w-[500px] p-8 bg-white border-2 shadow-md rounded-md'>
        {loading ? (
          // Show the loader while the fetch request is in progress
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>Welcome user, please signup here</h2>

            {/* Name input field */}
            <div className="mb-4">
              <label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">Name</label>
              <Input type="text" name="name" id="name" value={formData.name} placeholder="Your name" onChange={handleChange} />
              {fieldError("name")}
            </div>

            {/* Email input field */}
            <div className="mb-4">
              <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@domain.com" onChange={handleChange} />
              {fieldError("email")}
            </div>

            {/* Password input field */}
            <div className="mb-4">
              <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-red-500">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password.." onChange={handleChange} />
              {fieldError("password")}
            </div>

            {/* Submit button */}
            <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>Submit</button>

            {/* Link to login page if user already has an account */}
            <div className='pt-4'>
              <Link to="/login" className='text-blue-400'>Already have an account? Login here</Link>
            </div>
          </>
        )}

      </form>
    </>
  )
}

export default SignupForm;
