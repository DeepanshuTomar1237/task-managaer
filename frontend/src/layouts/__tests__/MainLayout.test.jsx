import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../MainLayout'; // Import your MainLayout component
import Navbar from '../../components/Navbar'; // Import Navbar to mock it

// Mocking Navbar component to avoid complex testing of Navbar itself
jest.mock('../../components/Navbar', () => {
  return jest.fn(() => <div data-testid="navbar">Navbar</div>);
});

describe('MainLayout Component', () => {
  it('renders Navbar component', () => {
    // Render the MainLayout component with some children
    render(
      <MainLayout>
        <div data-testid="children">Test children content</div>
      </MainLayout>
    );

    // Assert that the Navbar is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    // Render the MainLayout with test content as children
    render(
      <MainLayout>
        <div data-testid="children">Test children content</div>
      </MainLayout>
    );

    // Assert that the children content is rendered
    expect(screen.getByTestId('children')).toHaveTextContent('Test children content');
  });

  it('should render the layout with correct class names', () => {
    // Render the MainLayout
    const { container } = render(
      <MainLayout>
        <div>Test children content</div>
      </MainLayout>
    );

    // Assert that the layout container has the correct class
    expect(container.firstChild).toHaveClass('relative bg-gray-50 h-screen w-screen overflow-x-hidden');
  });
});
