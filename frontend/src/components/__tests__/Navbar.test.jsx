import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";

const mockStore = configureStore([]);

describe("Navbar Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authReducer: { isLoggedIn: false },
    });
    store.dispatch = jest.fn();
  });

  test("renders Navbar correctly", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/task manager/i)).toBeInTheDocument();
  });

  test("toggles mobile menu on button click", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    // Find the menu toggle button
    const menuButton = screen.getByTestId("menu-button");
    expect(menuButton).toBeInTheDocument();

    // Click to open the menu
    fireEvent.click(menuButton);

    // Wait for "Login" to appear in the menu
    await waitFor(() => expect(screen.getByText(/login/i)).toBeInTheDocument());

    // Find and click the close button
    const closeButton = screen.getByTestId("close-menu");
    fireEvent.click(closeButton);

    // Ensure menu disappears
    await waitFor(() => expect(screen.queryByText(/login/i)).not.toBeInTheDocument());
  });

  test("shows login button when user is not logged in", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    // Ensure at least one login button is present
    const loginButtons = await screen.findAllByText(/login/i);
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  test("shows logout button when user is logged in", async () => {
    store = mockStore({
      authReducer: { isLoggedIn: true },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    // Ensure at least one logout button is present
    const logoutButtons = await screen.findAllByText(/logout/i);
    expect(logoutButtons.length).toBeGreaterThan(0);
  });
});
