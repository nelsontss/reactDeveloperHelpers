import { render, screen }   from '@testing-library/react';
import Teste2 from './Teste2';

test('renders hello text', () => {
  render(<Teste2 />);
  const linkElement = screen.getByText(/Hello I'm Teste2/i);
  expect(linkElement).toBeInTheDocument();
});
