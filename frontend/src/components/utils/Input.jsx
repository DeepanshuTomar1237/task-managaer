import React from 'react'

// Input component for rendering a text input field
const Input = ({
  id,          // ID attribute for the input element
  name,        // Name attribute for the input element
  type,        // Type of the input (e.g., text, password, etc.)
  value,       // The current value of the input
  className = "",  // Additional custom class names for styling
  disabled = false, // Flag to disable the input field
  placeholder, // Placeholder text for the input
  onChange     // Callback function to handle changes in the input field
}) => {
  return (
    // Rendering the input element with dynamic classes and properties
    <input 
      id={id} 
      type={type} 
      name={name} 
      value={value} 
      disabled={disabled} 
      className={`block w-full mt-2 px-3 py-2 text-gray-600 rounded-[4px] border-2 border-gray-100 ${disabled ? "bg-gray-50" : ""}  focus:border-primary transition outline-none hover:border-gray-300 ${className}`} 
      placeholder={placeholder} 
      onChange={onChange} 
    />
  )
}

// Exporting the Input component for use in other parts of the app
export default Input

// Textarea component for rendering a multi-line text input field
export const Textarea = ({
  id,          // ID attribute for the textarea element
  name,        // Name attribute for the textarea element
  type,        // Type of the input (e.g., text, password, etc.)
  value,       // The current value of the textarea
  className = "",  // Additional custom class names for styling
  placeholder, // Placeholder text for the textarea
  onChange     // Callback function to handle changes in the textarea field
}) => {
  return (
    // Rendering the textarea element with dynamic classes and properties
    <textarea 
      id={id} 
      type={type} 
      name={name} 
      value={value} 
      className={`block w-full h-40 mt-2 px-3 py-2 text-gray-600 rounded-[4px] border-2 border-gray-100 focus:border-primary transition outline-none hover:border-gray-300 ${className}`} 
      placeholder={placeholder} 
      onChange={onChange} 
    />
  )
}
