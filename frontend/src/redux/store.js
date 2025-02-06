import { applyMiddleware, createStore, compose } from "redux"; // Importing necessary functions from Redux
import thunk from "redux-thunk"; // Importing the thunk middleware for handling asynchronous actions
import rootReducer from "./reducers"; // Importing the rootReducer that combines all reducers

// Defining the middleware to be used in the store, in this case, the thunk middleware
const middleware = [thunk];

// Setting up Redux DevTools for development, falls back to default compose if not available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Creating the Redux store with the rootReducer, applying middleware (thunk in this case),
// and enabling Redux DevTools for debugging
const store = createStore(
  rootReducer, // The root reducer to manage the global state of the app
  composeEnhancers(applyMiddleware(...middleware)) // Applying the middleware to handle async actions
);

export default store; // Exporting the store so it can be used in the app
