// Utility function to check if the email is valid using a regular expression
const isValidEmail = (email) => {
  return String(email) // Convert email to string and ensure it's lowercased
    .toLowerCase()
    .match( // Matches email against a regex pattern for validation
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // Regex pattern for valid email format
    );
};

// Function to validate individual fields based on group (signup, login, or task)
export const validate = (group, name, value) => {

  // Validation logic for "signup" group
  if (group === "signup") {
    switch (name) {
      case "name": { // Name field validation
        if (!value) return "This field is required"; // Check if empty
        return null;
      }
      case "email": { // Email field validation
        if (!value) return "This field is required"; // Check if empty
        if (!isValidEmail(value)) return "Please enter valid email address"; // Check if the email is valid
        return null;
      }
      case "password": { // Password field validation
        if (!value) return "This field is required"; // Check if empty
        if (value.length < 4) return "Password should be atleast 4 chars long"; // Check for min length
        return null;
      }
      default: return null;
    }
  }

  // Validation logic for "login" group
  else if (group === "login") {
    switch (name) {
      case "email": { // Email field validation for login
        if (!value) return "This field is required"; // Check if empty
        if (!isValidEmail(value)) return "Please enter valid email address"; // Check if the email is valid
        return null;
      }
      case "password": { // Password field validation for login
        if (!value) return "This field is required"; // Check if empty
        return null;
      }
      default: return null;
    }
  }

  // Validation logic for "task" group
  else if (group === "task") {
    switch (name) {
      case "description": { // Task description validation
        if (!value) return "This field is required"; // Check if empty
        if (value.length > 100) return "Max. limit is 100 characters."; // Check max length
        return null;
      }
      default: return null;
    }
  }

  // Default case returns null for unsupported groups
  else {
    return null;
  }

}

// Function to validate many fields at once for a given group
const validateManyFields = (group, list) => {
  const errors = [];
  // Iterate over each field and validate
  for (const field in list) {
    const err = validate(group, field, list[field]);
    if (err) errors.push({ field, err }); // Collect errors
  }
  return errors; // Return list of errors
}

export default validateManyFields; // Export the function for use in other components
