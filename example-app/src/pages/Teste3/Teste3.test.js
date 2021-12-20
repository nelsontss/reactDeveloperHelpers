import { render, screen }   from '@testing-library/react';
import Teste3 from './Teste3';

test('renders hello text', () => {
  render(<Teste3 />);
  const linkElement = screen.getByText(/Hello I'm Teste3/i);
  expect(linkElement).toBeInTheDocument();
});
