import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  expect(screen.getAllByText(/Multilingual Baptist Hymnal/i).length).toBeGreaterThanOrEqual(1);
});
