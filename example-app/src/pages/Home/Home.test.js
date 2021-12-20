import { render, screen }   from '@testing-library/react';
import Home from './Home';

test('renders hello text', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Hello I'm Home/i);
  expect(linkElement).toBeInTheDocument();
});
