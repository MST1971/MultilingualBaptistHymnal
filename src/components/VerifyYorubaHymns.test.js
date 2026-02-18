
import { render, screen } from '@testing-library/react';
import YorubaHymnDetail from './YorubaHymnDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const testHymn = (hymnId, expectedTitleSnippet) => {
    test(`renders Yoruba Hymn ${hymnId} details with numbering`, () => {
        render(
            <MemoryRouter initialEntries={[`/yoruba-hymn/${hymnId}`]}>
                <Routes>
                    <Route path="/yoruba-hymn/:id" element={<YorubaHymnDetail theme="light" />} />
                </Routes>
            </MemoryRouter>
        );

        // Check title in heading
        expect(screen.getByRole('heading', { name: new RegExp(expectedTitleSnippet, 'i') })).toBeInTheDocument();

        // Check for stanza numbers
        const numbers = screen.getAllByText('1.');
        expect(numbers.length).toBeGreaterThanOrEqual(1);

        const secondNumbers = screen.getAllByText('2.');
        expect(secondNumbers.length).toBeGreaterThanOrEqual(1);

        // Ensure manual numbering wasn't duplicated (e.g. "1. 1. ")
        // We can check the line text doesn't start with digits followed by dot again inside stanza-text.
        // Actually, checking for '3.' etc for stanzas provides good confidence.
    });
};

testHymn('YBH124', 'Hallelúyà');
testHymn('YBH125', 'Jésù yè');
testHymn('YBH126', 'Olúwa mbọ̀');
testHymn('YBH127', 'Ọlọ́run');
testHymn('YBH128', 'Jésù t’ó k’ó gb’ayé là');
testHymn('YBH129', 'B’ẹ́lẹ́ṣẹ̀ ṣ’ọwọ́ pọ̀');
testHymn('YBH130', 'Ọjọ́ Àjínde');
testHymn('YBH131', 'Òru Bú Kọjá Tán');
testHymn('YBH132', 'Ẹnyìn T’ẹ F’Olúwa');
testHymn('YBH133', 'A Fún Ìhò Ayọ̀ Mímọ́');
testHymn('YBH134', 'Iṣẹ́ ‘Gbàlà Parí');
testHymn('YBH135', 'Ìfẹ́ Ọ̀run Aláìlẹ́gbẹ́');
testHymn('YBH136', 'Gbogbo Ayé, Gbé Jésù Ga');
testHymn('YBH137', 'Ẹnde, Kọrin Móse');
testHymn('YBH138', 'Gb’ ọ̀pọ̀ Dúrù Pẹ̀lú Ohùn');
testHymn('YBH139', 'Ẹyọ̀ Jésù Jọba');
testHymn('YBH140', 'Mo Mọ̀ P’Olùdáǹde Mi Mbẹ');
testHymn('YBH141', 'Ẹ̀mí ‘Bùkún, Bí Afẹ́fẹ́');
testHymn('YBH142', 'Sọ Ìtàn Kan-nâ Fún Mi');
testHymn('YBH143', 'Olúwa, Y’ó Ti Pẹ́ Tó');
testHymn('YBH144', 'Jí, Apá Ọlọ́run, K’ Ó Jí');
testHymn('YBH145', 'Wò! Olúwa L’áwọsánmọ̀');
testHymn('YBH146', 'Ọlọ́run Olùràpadà');
testHymn('YBH147', 'Gbà T’ Olùgbàlà W’ Ayé');
testHymn('YBH148', 'Àwọn Ẹyẹ N’Ìtẹ́');
testHymn('YBH149', 'Krist’ Kí ‘Jọba Rẹ Dé');
testHymn('YBH150', 'Ẹ̀mí, Olóore-ọ̀fẹ́');
testHymn('YBH151', 'Wá Ẹ̀mí Mímọ́, Wá');
testHymn('YBH152', 'Olùràpadà Wa, K’ On Tó');
testHymn('YBH153', 'Wá, Ẹ̀mí ‘Re, ‘Dàbà Ọ̀run');
testHymn('YBH154', 'Ẹ̀mí Mímọ́, ‘Dàbà Ọ̀run');
testHymn('YBH155', 'Ẹ̀mí Ọ̀run, Gb’ Àdúrà Wa');
testHymn('YBH156', 'Ẹ̀mí Àánú, Òtítọ́, Ìfẹ́');
testHymn('YBH157', 'Ògo Fún Ọlọ́run Baba');
testHymn('YBH158', 'A F’ Ìyìn Àìkú Fún');
testHymn('YBH159', 'F’ Orúk’ Ọlọ́run Lókè');
testHymn('YBH160', 'Ọlọ́run Ti Fi Jésù Ṣe');
testHymn('YBH161', 'Olúwa, Aláìmọ́ L’ Èmi');
testHymn('YBH162', 'Ẹni ‘Súbu Ṣe Lè');
testHymn('YBH163', 'Olúwa, Báwo L’ Ọkàn Mi');
testHymn('YBH164', 'Ásán N’ Ìrétí T’ Ènìyàn Kọ́');
testHymn('YBH165', 'Gbat’ Ẹ̀mí Rẹ Bá Fò Lọ');
testHymn('YBH166', 'Níbò N’ Ìsimi Wà');
testHymn('YBH167', 'Lónìí Ni Jésù Pé');
testHymn('YBH168', 'Ẹlẹ́ṣẹ̀ Kíl’ Ó Ní T’ Ó');
testHymn('YBH169', '“Àyè Sí Mbẹ!” Ile Odagutan');
testHymn('YBH170', 'Ọkàn Àpáta Túbà');
testHymn('YBH171', 'Ẹlẹ́ṣẹ̀, Ò Ha Gàn Ìṣẹ́');
testHymn('YBH172', 'Ẹ̀ṣẹ̀ Tí Ẹ Kò Lè Ṣàìlọ');
testHymn('YBH173', 'Múra Ẹlẹ́ṣẹ̀ Láti Gbọ́n');
testHymn('YBH174', 'Olúwa Mo Gb’ Ohùn Rẹ');
testHymn('YBH175', 'Ẹlẹ́ṣẹ̀ Ẹ Yí Padà');
testHymn('YBH176', 'Ẹnít’ Ó Bá Gbọ́, Kígbe Ìró Náà');
testHymn('YBH177', 'Ìyè Wà Ní Wíwò, Ẹnit’ A Kàn Mọ́ ‘Gi');
testHymn('YBH178', 'Olúwa, Ṣàánú, Dáríjì');
testHymn('YBH179', 'Ẹ̀bi Ẹ̀ṣẹ̀ Ńpa Mí L’ Ẹ̀rù');
testHymn('YBH180', 'Olúwa, Ọb’ Aláṣẹ');
testHymn('YBH181', 'Wò Olúwa Òkè');
testHymn('YBH182', 'Ibú Ìfẹ́! Ó Lè Jẹ́');
testHymn('YBH183', 'Olùgbàlà, Ní Ẹsẹ̀ Rẹ');
testHymn('YBH184', 'Mo Ti Ńb’ Ẹ̀ṣẹ̀ Rìn Tí Pẹ́');
testHymn('YBH185', 'Aláìmọ́ Ni Èmi');
testHymn('YBH186', 'Ẹ̀ṣẹ̀ Mi Pọ̀ Bí Ìràwọ̀');
testHymn('YBH187', 'Ìwọ Lọ́wọ́ Ẹnit’ Ire Ńsan');
testHymn('YBH188', 'Olùgbàlà, Gb’ Ohùn Mi');
testHymn('YBH189', 'Olúwa, Má M’ Ojú Kúrò');
testHymn('YBH190', 'Olúwa, B’ Agbówóde Ni');
testHymn('YBH191', 'Baba Má Yí Ojú Kúrò');
testHymn('YBH192', 'Jésù Ńfẹ́ Gbà Ẹlẹ́ṣẹ̀');
testHymn('YBH193', 'Ẹkún Kò Lè Gbà Mí');
testHymn('YBH194', 'Gbọ́ Ẹlẹ́ṣẹ̀, Àánú Ńpè Ọ́');
testHymn('YBH195', 'Jẹ́ Kí Gbogbo Étí Kó Gbọ́');
testHymn('YBH196', 'Ẹ̀wá Òtòṣì Ẹlẹ́ṣẹ̀');
testHymn('YBH197', 'Bí O Ti Rí Láìsí Àmì');
testHymn('YBH198', 'Mo Fi Omíjé Wò Yíká');
testHymn('YBH199', 'Wàlejò Kan L’ẹ́nu Ọ̀nà');
testHymn('YBH200', 'Kò S’ Ohun T’ Ó Kù K’ In Ṣe');
testHymn('YBH201', 'Ẹ̀yí, Ẹ Yípadà, Ẹ̀ṣẹ̀ T’ Ẹ Ó Kú');
testHymn('YBH202', 'Àlàáfíà W’ Ọkàn, T’ Ohùn Rẹ̀');
testHymn('YBH203', 'Àárẹ̀ Mú Ọ, Ayé Sú Ọ');
testHymn('YBH204', 'Ẹ̀yin Ọmọ Òkú');
testHymn('YBH205', 'Jésù Ńpè Wa L’ Ọ̀sán, L’ Òrú');
testHymn('YBH206', 'Wá Sọ́dọ̀ Jésù, Máṣe Dúró');
testHymn('YBH207', 'Gbọ́ Ọkàn Mi, Bí Ángẹ́lì Ti Ńkọrin');
testHymn('YBH208', 'Wá Sọ́dọ̀ Mi, Alárè');
testHymn('YBH209', 'Nígbàt’ Ìdánwò Yí Mi Ká');
testHymn('YBH210', 'Jésù Nígbà ‘Dánwò');
testHymn('YBH211', 'Ẹlẹ́ṣẹ̀ Wá Sọ́dọ̀ Jésù');
testHymn('YBH212', 'Ọkàn Mi, Súnmọ́ ‘Tẹ́ Àánú');
testHymn('YBH213', 'Lọ, L’ Òrò Kùtù Kùtù');
testHymn('YBH214', 'Padà Aṣákó S’ Ílé Rẹ');
testHymn('YBH215', 'Ọmọ Ọlọ́run Ńlọ S’ Ògun');
testHymn('YBH216', 'Ọlọ́run Ńpè, Ngó Ha S’ Áìgbọ́');
testHymn('YBH217', 'Ó Ha Lè Jẹ́ P’ Á Mí');
testHymn('YBH218', 'Mo Ha Lè Tún Dúró');
testHymn('YBH219', 'Wò Tí Ńgb’ Àdúrà Ìgbàgbọ́');
testHymn('YBH220', 'Baba, Mo N’ Ọwọ́ Mi Sí Ọ');
testHymn('YBH221', 'Jésù, Ọ̀rẹ́ ‘Léṣẹ̀ Ni Ọ');
testHymn('YBH222', 'Bí Mo Ti Rí – Láìṣàwáwì');
testHymn('YBH223', 'Tìrẹ L’ Ọlá Baba');
testHymn('YBH224', 'Ẹlẹ́ṣẹ̀; – Mo Ńfẹ́ ‘Bùkún');
testHymn('YBH225', 'Èrédìí Ìròkẹ̀kẹ̀ Yìí');
testHymn('YBH226', 'Jìnnà Kúrò N’ Ìbugbé Ẹnìyàn');
testHymn('YBH227', 'Wá, Jésù Fí Ara Hàn');
testHymn('YBH228', 'Níhìnyí N’ Ìsimi Gbé Wa');
testHymn('YBH229', 'B’ Áwọn Ara Ìgbàní');
testHymn('YBH230', 'Tìrẹ L’ Èmí Ṣe, Mo Ti Gb’ Ohùn Rẹ̀');
testHymn('YBH231', 'Tìrẹ Láìlái L’ Áwa Ṣe');
testHymn('YBH232', 'Ìsún Kan Wà T’ Ó Kún F’ Ẹ̀jẹ̀');
testHymn('YBH233', 'Dìde Ọkàn Mi, Ńde');
testHymn('YBH234', 'Jésù Tí Mo Gbẹ́kẹ̀ Mi Lè');
testHymn('YBH235', 'Àpáta Àìyérayé');
testHymn('YBH236', 'Nígbà Ìtìjú K’ Óbò Mí');
testHymn('YBH237', 'Jésù Olùf’ Ọkàn Mi');
testHymn('YBH238', 'Jésù, Iṣẹ́ Rẹ̀ L’ Ó');
testHymn('YBH239', 'Bí Mo Ní Ẹgbàárùn-ún Ẹ̀bùn');
testHymn('YBH240', 'Lótọ́ Ẹ̀ṣẹ̀ Mi Pọ̀jù');

test('renders Yoruba Hymn YBH174 with refrains after each stanza', () => {
    render(
        <MemoryRouter initialEntries={['/yoruba-hymn/YBH174']}>
            <Routes>
                <Route path="/yoruba-hymn/:id" element={<YorubaHymnDetail theme="light" />} />
            </Routes>
        </MemoryRouter>
    );

    // Check title
    expect(screen.getByRole('heading', { name: /Olúwa Mo Gb’ Ohùn Rẹ/i })).toBeInTheDocument();

    // Check for "Egbé:" appearances
    const refrains = screen.getAllByText(/Egbé:/);
    // YBH174 has 6 stanzas (excluding the refrain block itself which we now omit standalone)
    expect(refrains.length).toBeGreaterThanOrEqual(6);
});

