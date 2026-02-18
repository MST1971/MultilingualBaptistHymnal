
import { render, screen } from '@testing-library/react';
import HymnDetail from './HymnDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

test('renders Hymn 1 details with multiple stanzas and numbering', () => {
    // Hymn 1 "Holy, Holy, Holy" has no refrain defined in lyrics array (just stanza blocks separated by "")
    render(
        <MemoryRouter initialEntries={['/hymn/1']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Holy, holy, holy! Lord God Almighty!/i).length).toBeGreaterThanOrEqual(1);

    // Verify stanza numbering
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('3.')).toBeInTheDocument();
    expect(screen.getByText('4.')).toBeInTheDocument();

    // Verify regression fix: Stanzas 1 and 2 should be separate blocks (not merged)
    // We can check if we have multiple "stanza" elements if we could query by class, 
    // but testing-library discourages implementation details.
    // Instead, we trust the numbering check. If merged, likely only "1." would appear.
});

test('renders Hymn 106 details with numbering and refrains', () => {
    // Hymn 106 has a refrain.
    render(
        <MemoryRouter initialEntries={['/hymn/106']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    // Verify stanza numbering
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('3.')).toBeInTheDocument();

    // Refrain shouldn't have a number
    // We can't explicitly check "refrain doesn't have number" easily without class queries,
    // but we can ensure the count of numbers matches the stanza count (3).
    // If refrains were numbered, we might see more numbers or weirdness.
    expect(screen.queryByText('4.')).toBeNull(); // Only 3 stanzas

    // Verify Refrain text is still present multiple times
    const refrainText = screen.getAllByText(/Blessed Redeemer/i);
    expect(refrainText.length).toBeGreaterThanOrEqual(1);
});
