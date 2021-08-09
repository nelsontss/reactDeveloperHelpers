import { render, screen }   from '@testing-library/react';
import ComponentBoilerplate from './ComponentBoilerplate';

test('renders hello text', () => {
  render(<ComponentBoilerplate />);
  const linkElement = screen.getByText(/Hello I'm ComponentBoilerplate/i);
  expect(linkElement).toBeInTheDocument();
});
