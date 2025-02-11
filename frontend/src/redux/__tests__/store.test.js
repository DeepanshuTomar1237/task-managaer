import { createStore } from "redux";
import rootReducer from "../reducers"; // Adjust the path if necessary
import store from "../store"; // Adjust the path if necessary
import thunk from "redux-thunk";

// Mocking the global window object for Redux DevTools Extension
global.window = Object.create(window);
Object.defineProperty(window, "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__", {
  value: jest.fn(),
});

describe("Redux Store", () => {
  it("should create the store with thunk middleware", () => {
    const middleware = [thunk];
    const createdStore = createStore(
      rootReducer,
      applyMiddleware(...middleware)
    );

    // Checking if store has been created
    expect(createdStore).toBeDefined();
  });

  it("should apply Redux DevTools extension compose", () => {
    // Mock Redux DevTools extension is available
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jest.fn().mockImplementation(
      () => (f) => f
    );

    const createdStore = createStore(
      rootReducer,
      compose(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())
    );

    expect(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__).toHaveBeenCalled();
    expect(createdStore).toBeDefined();
  });

  it("should apply middleware correctly", () => {
    // Check if the store has been initialized with the correct middleware
    const spy = jest.spyOn(thunk, "applyMiddleware");

    createStore(rootReducer, applyMiddleware(...[thunk]));

    expect(spy).toHaveBeenCalled();
  });

  it("should match the structure of the initial store", () => {
    const state = store.getState();

    // Checking the initial state structure
    expect(state).toHaveProperty("authReducer");
    expect(state.authReducer).toHaveProperty("isLoggedIn");
    expect(state.authReducer).toHaveProperty("token");
  });
});
