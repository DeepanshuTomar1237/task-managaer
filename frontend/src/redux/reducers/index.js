import { combineReducers } from "redux"; // Importing the combineReducers function from Redux to combine multiple reducers
import authReducer from "./authReducer"; // Importing the authReducer which handles authentication-related state

// Combining all the reducers into a single rootReducer
const rootReducer = combineReducers({
  authReducer, // Registering authReducer as a key in the root state (the auth state will be accessible as state.authReducer)
});

export default rootReducer; // Exporting the rootReducer to be used in the store configuration
