




import React from 'react';
import { render, screen } from '@testing-library/react';
import PetCareGame from '../components/PetCareGame';

describe('PetCareGame Component', () => {
  test('renders without crashing', () => {
    render(<PetCareGame />);
    expect(screen.getByText('Pet Care Game')).toBeInTheDocument();
  });

  test('displays creature stats', () => {
    render(<PetCareGame />);
    expect(screen.getByText(/happiness/i)).toBeInTheDocument();
    expect(screen.getByText(/energy/i)).toBeInTheDocument();
    expect(screen.getByText(/magic/i)).toBeInTheDocument();
  });

  test('has a creature that can be petted', () => {
    render(<PetCareGame />);
    const creatureElement = screen.getByText(/🐨|✨/i);
    expect(creatureElement).toBeInTheDocument();
  });

  test('displays current room', () => {
    render(<PetCareGame />);
    expect(screen.getByText(/current room/i)).toBeInTheDocument();
  });
});




