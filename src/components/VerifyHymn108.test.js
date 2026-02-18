
import { render, screen } from '@testing-library/react';
import HymnDetail from './HymnDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

test('renders Hymn 108 details', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/108']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText(/Rejoice/i)).toBeInTheDocument();
});
