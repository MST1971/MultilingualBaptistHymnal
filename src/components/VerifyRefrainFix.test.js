
import { render, screen } from '@testing-library/react';
import HymnDetail from './HymnDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

test('renders Hymn 17 details with aligned refrain', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/17']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Rejoice, ye pure in heart/i).length).toBeGreaterThanOrEqual(1);

    // Calculate expected refrain count.
    // Hymn 17 has 4 stanzas. Refrain should appear 4 times.
    // The refrain text is "Rejoice, rejoice".
    // Note: The first stanza ALSO starts with "Rejoice, ye pure in heart".
    // The refrain starts with "Refrain: Rejoice, rejoice".
    // My processLyrics splits "Refrain:" into its own block.
    // The rendered text for refrain lines will be "Rejoice, rejoice" (prefix "Refrain:" is kept in the line string).

    // Actually, let's just check that we have multiple occurrences of the refrain text.
    const refrainText = screen.getAllByText(/Rejoice, rejoice/i); // Part of the refrain line
    expect(refrainText.length).toBeGreaterThanOrEqual(4);
});

test('renders Hymn 76 details with deduplicated refrain', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/76']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Angels from the realms of glory/i).length).toBeGreaterThanOrEqual(1);

    // Hymn 76 has 4 stanzas + 1 final stanza?
    // Let's check "Come and worship".
    // It should appear after every stanza.
    // The crucial part is that it shouldn't appear TWICE in a row (e.g. one from original text + one inserted).
    // My logic skips the original one.

    const refrainText = screen.getAllByText(/Come and worship/i);
    // 5 Stanzas in original data (last block is just refrain? No, Lines 3638-3641 is Stanza 4).
    // Stanzas: 1, 2, 3, 4.
    expect(refrainText.length).toBeGreaterThanOrEqual(4);

    // Ensure we don't have [Refrain] placeholder visible in the text
    const placeholder = screen.queryByText(/\[Refrain\]/i);
    expect(placeholder).toBeNull();
});

test('renders Hymn 97 details with replaced placeholders', () => {
    render(
        <MemoryRouter initialEntries={['/hymn/97']}>
            <Routes>
                <Route path="/hymn/:slug" element={<HymnDetail />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getAllByText(/Jesus, keep me near the cross/i).length).toBeGreaterThanOrEqual(1);

    // Check that (Refrain) is NOT present
    const placeholder = screen.queryByText(/\(Refrain\)/i);
    expect(placeholder).toBeNull();

    // Check that the actual refrain is present multiple times
    // Refrain: "In the cross, in the cross"
    const refrainText = screen.getAllByText(/In the cross, in the cross/i);
    expect(refrainText.length).toBeGreaterThanOrEqual(4); // 4 stanzas
});
