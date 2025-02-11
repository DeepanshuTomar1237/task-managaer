import React from 'react';
import { render, screen } from '@testing-library/react';
import Signup from '../Signup'; // Import Signup page
import MainLayout from '../../layouts/MainLayout'; // Import MainLayout component

jest.mock('../../layouts/MainLayout', () => {
  return jest.fn(({ children }) => <div data-testid="main-layout">{children}</div>);
});

describe('Signup Page', () => {
  it('renders MainLayout wrapper', () => {
    // Render the Signup page
    render(<Signup />);

    // Check if the MainLayout is rendered by verifying the presence of its wrapper
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('sets the correct document title', () => {
    // Render the Signup page
    render(<Signup />);

    // Assert the document title is set to "Signup"
    expect(document.title).toBe('Signup');
  });

  it('renders SignupForm', () => {
    // Render the Signup page
    render(<Signup />);

    // Ensure that the SignupForm component is rendered
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
  });
});
