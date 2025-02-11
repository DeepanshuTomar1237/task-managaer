import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../LoginForm";
import { postLoginData } from "../../redux/actions/authActions";

jest.mock("../../redux/actions/authActions", () => ({
  postLoginData: jest.fn(),
}));

const mockStore = configureStore([]);

describe("LoginForm Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authReducer: { isLoggedIn: false, loading: false },
    });
    store.dispatch = jest.fn();
  });

  test("renders login form correctly", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/please login here/i)).toBeInTheDocument();
  });

  test("displays validation errors when submitting empty form", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/submit/i));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test("dispatches login action on valid form submission", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/youremail@domain.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your password../i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(postLoginData).toHaveBeenCalledWith("test@example.com", "password123");
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  test("redirects user when already logged in", () => {
    store = mockStore({
      authReducer: { isLoggedIn: true, loading: false },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText(/please login here/i)).not.toBeInTheDocument();
  });
});
