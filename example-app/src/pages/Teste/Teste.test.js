import { render, screen }   from '@testing-library/react';
import Teste from './Teste';

test('renders hello text', () => {
  render(<Teste />);
  const linkElement = screen.getByText(/Hello I'm Teste/i);
  expect(linkElement).toBeInTheDocument();
});
