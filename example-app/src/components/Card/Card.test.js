import { render, screen }   from '@testing-library/react';
import Card from './Card';

test('renders hello text', () => {
  render(<Card />);
  const linkElement = screen.getByText(/Hello I'm Card/i);
  expect(linkElement).toBeInTheDocument();
});
