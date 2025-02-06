import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';  // Importing necessary hooks and components from React and React Router
import validateManyFields from '../validations';  // Function to validate multiple form fields
import Input from './utils/Input';  // Custom Input component
import { useDispatch, useSelector } from "react-redux";  // Redux hooks to dispatch actions and access state
import { postLoginData } from '../redux/actions/authActions';  // Action to handle login requests
import Loader from './utils/Loader';  // Loader component to show during the API call

const LoginForm = ({ redirectUrl }) => {

  // useState hooks to manage form data, errors, and form submission state
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // useNavigate hook to programmatically navigate the user
  const navigate = useNavigate();

  // Accessing authState from Redux store
  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;  // Destructuring to get loading and isLoggedIn from state

  // Dispatch hook to dispatch actions
  const dispatch = useDispatch();

  // useEffect hook to redirect user if they are already logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Navigate to the provided redirectUrl or the homepage if no URL is specified
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  // handleChange function to update form data when input fields change
  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  // handleSubmit function to validate form and dispatch login action
  const handleSubmit = e => {
    e.preventDefault();

    // Validate the form data
    const errors = validateManyFields("login", formData);
    setFormErrors({});  // Reset errors

    if (errors.length > 0) {
      // If validation errors exist, update state with error messages
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    // Dispatch the login action with email and password from form data
    dispatch(postLoginData(formData.email, formData.password));
  }

  // Helper function to display error message for a specific field
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <form className='m-auto my-16 max-w-[500px] bg-white p-8 border-2 shadow-md rounded-md'>
        {loading ? (
          <Loader />  // Show loader while the request is in progress
        ) : (
          <>
            <h2 className='text-center mb-4'>Welcome user, please login here</h2>

            {/* Email input */}
            <div className="mb-4">
              <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@domain.com" onChange={handleChange} />
              {fieldError("email")}  {/* Show error message if any */}
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-red-500">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password.." onChange={handleChange} />
              {fieldError("password")}  {/* Show error message if any */}
            </div>

            {/* Submit button */}
            <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>Submit</button>

            {/* Link to sign up page for users without an account */}
            <div className='pt-4'>
              <Link to="/signup" className='text-blue-400'>Don't have an account? Signup here</Link>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default LoginForm;
