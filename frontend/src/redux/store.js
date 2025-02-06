import { applyMiddleware, createStore, compose } from "redux"; 
import thunk from "redux-thunk"; 
import rootReducer from "./reducers"; 

// Defining the middleware to be used in the store, in this case, the thunk middleware
const middleware = [thunk];

// Setting up Redux DevTools for development, falls back to default compose if not available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware)) 
);

export default store; 