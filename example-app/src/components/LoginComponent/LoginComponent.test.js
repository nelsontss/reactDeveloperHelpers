import { render, screen }   from '@testing-library/react';
import LoginComponent from './LoginComponent';

test('renders hello text', () => {
  render(<LoginComponent />);
  const linkElement = screen.getByText(/Hello I'm LoginComponent/i);
  expect(linkElement).toBeInTheDocument();
});
