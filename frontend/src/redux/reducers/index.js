import { combineReducers } from "redux"; 
import authReducer from "./authReducer"; 
// Combining all the reducers into a single rootReducer
const rootReducer = combineReducers({
  authReducer, // Registering authReducer as a key in the root state (the auth state will be accessible as state.authReducer)
});

export default rootReducer; 