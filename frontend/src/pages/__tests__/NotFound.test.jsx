import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound'; // Import NotFound page
import MainLayout from '../../layouts/MainLayout'; // Import MainLayout component

jest.mock('../../layouts/MainLayout', () => {
  return jest.fn(({ children }) => <div data-testid="main-layout">{children}</div>);
});

describe('NotFound Page', () => {
  it('renders MainLayout wrapper', () => {
    // Render the NotFound page
    render(<NotFound />);

    // Check if the MainLayout is rendered by verifying the presence of its wrapper
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('renders 404 error message', () => {
    // Render the NotFound page
    render(<NotFound />);

    // Assert the presence of 404 error message
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for doesn't exist")).toBeInTheDocument();
  });

  it('has the correct heading and message', () => {
    // Render the NotFound page
    render(<NotFound />);

    // Assert the correct title and message appear in the page
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("The page you are looking for doesn't exist");
  });
});
