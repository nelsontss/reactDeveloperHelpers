import { render, screen }   from '@testing-library/react';
import Login from './Login';

test('renders hello text', () => {
  render(<Login />);
  const linkElement = screen.getByText(/Hello I'm Login/i);
  expect(linkElement).toBeInTheDocument();
});
