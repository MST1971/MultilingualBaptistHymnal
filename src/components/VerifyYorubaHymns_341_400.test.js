import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import YorubaHymnDetail from './YorubaHymnDetail';

const renderHymn = (id) => {
    return render(
        <MemoryRouter initialEntries={[`/yoruba-hymn/${id}`]}>
            <Routes>
                <Route path="/yoruba-hymn/:id" element={<YorubaHymnDetail />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('YorubaHymnDetail Verification (Hymns 341-400)', () => {
    const hymnsToTest = [
        { id: '341', title: 'KỌ́ mi, Olúwa mi' },
        { id: '350', title: 'JÉSÙ wípé k’ a má ṣọ́ra' },
        { id: '360', title: 'BÀBÁ ọ̀run, tí ìfẹ́ Rẹ' },
        { id: '361', title: 'OLÚWA, máṣe jẹ́ k’ á lù ‘lẹ̀' },
        { id: '370', title: 'ÌWỌ l’ Ọba ayérayé' },
        { id: '380', title: 'MÁṢE jẹ́ k’ á dẹ ́bi' },
        { id: '390', title: 'ÌWỌ l’ Ọlọ́run Aláàánú' },
        { id: '400', title: 'ÀWÁ f’ ògo fún Ọlá Rẹ' }
    ];

    hymnsToTest.forEach(({ id, title }) => {
        test(`renders hymn ${id} correctly`, () => {
            const { container } = renderHymn(id);

            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByText(new RegExp(`YBH${id}`, 'i'))).toBeInTheDocument();

            // Check for presence of "Yoruba Baptist Hymnal"
            expect(screen.getByText(/Yoruba Baptist Hymnal/i)).toBeInTheDocument();

            // Check for metadata labels
            expect(screen.getByText(/Nọ́mbà:/i)).toBeInTheDocument();
            expect(screen.getByText(/Onkọ̀wé:/i)).toBeInTheDocument();

            expect(container.querySelector('.lyrics')).not.toBeNull();
        });
    });

    test('verifies specific content for hymn 361', () => {
        renderHymn('361');
        expect(screen.getByText(/YBH361/i)).toBeInTheDocument();
        expect(screen.getByText(/Nínú ìdánwò ayé yìí/i)).toBeInTheDocument();
    });

    test('verifies specific content for hymn 400', () => {
        renderHymn('400');
        expect(screen.getByText(/YBH400/i)).toBeInTheDocument();
        expect(screen.getByText(/Olúwa ìgbàlà wa/i)).toBeInTheDocument();
    });
});
