import React from 'react'; // Import React library to build the UI
import ReactDOM from 'react-dom/client'; // Import ReactDOM to render the app to the DOM
import './index.css'; // Import global styles
import App from './App'; // Import the main App component
import { Provider } from "react-redux"; // Import Provider to make Redux store available to the app
import store from './redux/store'; // Import the Redux store
import { ToastContainer } from 'react-toastify'; // Import ToastContainer for toasts (notifications)
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root element in the HTML

root.render(
  <React.StrictMode>  {/* Strict mode helps highlight potential problems in the app */}
    {/* Render the ToastContainer to show toast notifications */}
    <ToastContainer bodyStyle={{ fontFamily: "Roboto" }} />
    
    {/* Wrap the entire app in the Provider to connect the Redux store */}
    <Provider store={store}>
      <App />  {/* Render the main App component */}
    </Provider>
  </React.StrictMode>
);
