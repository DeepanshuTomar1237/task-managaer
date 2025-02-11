import { render, screen } from "@testing-library/react";
import Loader from "../Loader";

describe("Loader Component", () => {
  
  test("renders loader component", () => {
    render(<Loader />);
    
    // Check if the div with animation class is present
    const loader = screen.getByRole("presentation");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("animate-loader");
  });

});
