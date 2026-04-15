
import { render, screen } from '@testing-library/react';
import HymnDetail from './HymnDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

test('renders Hymn 105 details', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/105']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Go to Dark Gethsemane/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/James Montgomery/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Your Redeemer's conflict see/i)).toBeInTheDocument();
});

test('renders Hymn 106 details', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/106']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Blessed Redeemer/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Harry.*Loes/i).length).toBeGreaterThanOrEqual(1);
    const refrainElements = screen.getAllByText(/Blessed Redeemer/i);
    expect(refrainElements.length).toBeGreaterThanOrEqual(1);

    // Check that we have the refrain repeated
    expect(screen.getAllByText(/Seems now I see Him on Calvary's tree/i).length).toBeGreaterThan(1);
});
