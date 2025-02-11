import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../Input";

describe("Input Component", () => {
  
  test("renders input with correct placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  test("renders with default value", () => {
    render(<Input value="Hello" onChange={() => {}} />);
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  test("calls onChange function when typing", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "New Text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("renders as disabled when disabled prop is true", () => {
    render(<Input disabled={true} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

});
