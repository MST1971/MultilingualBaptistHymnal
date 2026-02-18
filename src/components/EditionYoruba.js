import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Edition.css';

function EditionYoruba({ theme }) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hymnsPerPage = 50;

  // Load saved data on initial render
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('hymnFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load last viewed page from localStorage
    const savedPage = localStorage.getItem('hymnYorubaPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  // Save current page to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hymnYorubaPage', currentPage.toString());
  }, [currentPage]);

  // Function to go back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Function to toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Function to toggle favorite status
  const toggleFavorite = (e, hymnId) => {
    e.preventDefault(); // Prevent navigation to hymn detail
    e.stopPropagation(); // Prevent event bubbling

    const newFavorites = favorites.includes(hymnId)
      ? favorites.filter(id => id !== hymnId)
      : [...favorites, hymnId];

    setFavorites(newFavorites);
    localStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  // Function to handle pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of list
    document.querySelector('.hymn-list-section').scrollTop = 0;
  };

  // Yoruba hymn data (hymns 1-100)
  const allHymns = [
    { id: 'YBH1', title: "Èfí ìyìn fún Ọlọ́run", number: 1 },
    { id: 'YBH2', title: "Jẹ K' Agb' Ojú Ayọ S' Òke", number: 2 },
    { id: 'YBH3', title: "Ẹ Yọ Gbògb' Orílẹ̀-èdè", number: 3 },
    { id: 'YBH4', title: "Ọwọ́ At' Àlàbúkúnfún", number: 4 },
    { id: 'YBH5', title: "N' Iwájú 'Tẹ̀ Jèhófà Ńlá", number: 5 },
    { id: 'YBH6', title: "Yin Olúwa, e tun ohun se", number: 6 },
    { id: 'YBH7', title: "Didun n' ise na, Oba mi", number: 7 },
    { id: 'YBH8', title: "EWOLE f' Oba, ologo julo", number: 8 },
    { id: 'YBH9', title: "Yin Oluwa, Oro didun", number: 9 },
    { id: 'YBH10', title: "OLUWA po! Ogun orun wole fun", number: 10 },
    { id: 'YBH11', title: "YIN Oluwa, orun wole", number: 11 },
    { id: 'YBH12', title: "IRANSE, e fonrere Oba nyin", number: 12 },
    { id: 'YBH13', title: "GBOGBO eda dapo", number: 13 },
    { id: 'YBH14', title: "GBOGBO eda labe orun", number: 14 },
    { id: 'YBH15', title: "DIDE, yin Oluwa", number: 15 },
    { id: 'YBH16', title: "ẸNYÌN ìran Adam", number: 16 },
    { id: 'YBH17', title: "BABA wa tí ó mbẹ l' ọ̀run", number: 17 },
    { id: 'YBH18', title: "WÁ ròhìn Rẹ̀ yíká", number: 18 },
    { id: 'YBH19', title: "Olúwa t'ó mọ́ jùlọ", number: 19 },
    { id: 'YBH20', title: "KO mi Oluwa bi a ti", number: 20 },
    { id: 'YBH21', title: "OLUWA, a wa 'do, Re", number: 21 },
    { id: 'YBH22', title: "JESU, nib' eni Re pade", number: 22 },
    { id: 'YBH23', title: "MO j' alejo nihin, 'nu ile ajeji", number: 23 },
    { id: 'YBH24', title: "GBAT' ọkàn àrẹ̀ fẹ́ 'sìmí", number: 24 },
    { id: 'YBH25', title: "ỌJỌ́ mẹ́fà t' iṣẹ́ kọjá", number: 25 },
    { id: 'YBH26', title: "JÍ ẹ̀yin mímọ́ jí", number: 26 },
    { id: 'YBH27', title: "KÁBỌ̀ ọjọ́ ìsìmí", number: 27 },
    { id: 'YBH28', title: "Ọjọ́ 'sìmí àt'ayọ̀", number: 28 },
    { id: 'YBH29', title: "BÓ ti dùn tó l' ọj' owó yìí", number: 29 },
    { id: 'YBH30', title: "ÌMỌ́LẸ̀ ọjọ́ 'sìmí", number: 30 },
    { id: 'YBH31', title: "BABA, aniyan àt' ẹ̀rù", number: 31 },
    { id: 'YBH32', title: "OLÚWA, ìsìmí Rẹ̀ dùn", number: 32 },
    { id: 'YBH33', title: "GBOGBO ọgún ọ̀run nró kẹ̀kẹ́", number: 33 },
    { id: 'YBH34', title: "ẸMÍ wa bá w' ápè", number: 34 },
    { id: 'YBH35', title: "ÀBẸ́, a fẹ́ rí ọ", number: 35 },
    { id: 'YBH36', title: "JÉSÙ, a fẹ́ pàdé", number: 36 },
    { id: 'YBH37', title: "OSE, ose rere", number: 37 },
    { id: 'YBH38', title: "OJO 'mọlẹ l' eyi", number: 38 },
    { id: 'YBH39', title: "EYI l' ọjọ́ Olúwa dá", number: 39 },
    { id: 'YBH40', title: "JÉSÙ a w' ọ́dọ̀ Rẹ", number: 40 },
    { id: 'YBH41', title: "FI ìbùkún Rẹ tú wa ká", number: 41 },
    { id: 'YBH42', title: "ỌLỌ́RUN àwa fẹ́", number: 42 },
    { id: 'YBH43', title: "LI òwúrọ̀ Ìwọ ó gbọ́", number: 43 },
    { id: 'YBH44', title: "NI kùtù, mo dé Olúwa", number: 44 },
    { id: 'YBH45', title: "JÉSÙ bùkún ọ̀rọ̀ Rẹ", number: 45 },
    { id: 'YBH46', title: "ÀKÓKÒ 'rẹ gbat' ẹ̀dá tẹ́", number: 46 },
    { id: 'YBH47', title: "JÍ ọkàn mi, ba òrùn jí", number: 47 },
    { id: 'YBH48', title: "ỌLỌ́RUN kùtù ohùn Rẹ", number: 48 },
    { id: 'YBH49', title: "GBAT' ojú mi bá ṣe pẹ̀kí", number: 49 },
    { id: 'YBH50', title: "ỌKÀN mi, ojú rẹ tún rí", number: 50 },
    { id: 'YBH51', title: "NÍGBÀT' ìmọ́lẹ̀ òwúrọ̀", number: 51 },
    { id: 'YBH52', title: "KRIST, ògo, òlọ́lá", number: 52 },
    { id: 'YBH53', title: "ÒTUN ìfẹ́ l' ó ńfàràhàn", number: 53 },
    { id: 'YBH54', title: "JÉSÙ, Olúwa oré-ọ̀fẹ́", number: 54 },
    { id: 'YBH55', title: "NÍNÚ gbogbo ewu òru", number: 55 },
    { id: 'YBH56', title: "OLÚWA mi, mo ńjáde lọ", number: 56 },
    { id: 'YBH57', title: "MÍMỌ́,mímọ́,mímọ́! Olódùmarè", number: 57 },
    { id: 'YBH58', title: "Mo Fẹ́ Ìyẹra S'ápakàn", number: 58 },
    { id: 'YBH59', title: "Jẹ́ Ní Ìmọ́lẹ̀ Ọjọ́", number: 59 },
    { id: 'YBH60', title: "Láti Orí Pẹpẹ Ọkàn Wa", number: 60 },
    { id: 'YBH61', title: "Kí A Tó Sùn, Olùgbàlà Wa", number: 61 },
    { id: 'YBH62', title: "Ọjọ́ Òní Ló Tán", number: 62 },
    { id: 'YBH63', title: "Wò Ìmọ́lẹ̀! Láàrin Òkun Àiyé", number: 63 },
    { id: 'YBH64', title: "Ẹrọ Dídùn Kan Nsọ", number: 64 },
    { id: 'YBH65', title: "Bàbá, A Tún Pàdé L'ọkọ Jésù", number: 65 },
    { id: 'YBH66', title: "Ìwọ Ìmọ́lẹ̀ Ọkàn Mi", number: 66 },
    { id: 'YBH67', title: "Olúwa, Ọjọ́ T'Ó Fún Wa Pín", number: 67 },
    { id: 'YBH68', title: "L'Ójú Alẹ́, 'Gbat'Òrùn Wọ̀", number: 68 },
    { id: 'YBH69', title: "Ìfẹ́ Rẹ Dá Wa Sí Lónì", number: 69 },
    { id: 'YBH70', title: "Òrùn Sì Nyára Wọ̀", number: 70 },
    { id: 'YBH71', title: "Ògó f' Ọlọ́run l' àlẹ́ yì", number: 71 },
    { id: 'YBH72', title: "Jésù, bùkún wa k' á tó lọ", number: 72 },
    { id: 'YBH73', title: "Olùgbàlà, a tún fẹ́ f' òhun kan", number: 73 },
    { id: 'YBH74', title: "Ìwọ tí gbogbo ẹ̀dá ńsìn", number: 74 },
    { id: 'YBH75', title: "Ọlọ́run wa àìyéràìyé", number: 75 },
    { id: 'YBH76', title: "Ọkàn mi, tún ròhìn", number: 76 },
    { id: 'YBH77', title: "Yín 'Lúwa, ọkàn mi", number: 77 },
    { id: 'YBH78', title: "Mo kọrin ìpá Ọlọ́run", number: 78 },
    { id: 'YBH79', title: "Ẹ jẹ́ k' á f' inú dídùn", number: 79 },
    { id: 'YBH80', title: "Ọlọ́run l' ààbò ẹni Rẹ", number: 80 },
    { id: 'YBH81', title: "YIN Ọlọrun Ọba wa", number: 81 },
    { id: 'YBH82', title: "IFE l' Ọlọrun: anu Re", number: 82 },
    { id: 'YBH83', title: "T' OLORUN n' ijoba gbogbo", number: 83 },
    { id: 'YBH84', title: "ONA ara l' Ọlọrun wa", number: 84 },
    { id: 'YBH85', title: "OLUWA l' O nso mi", number: 85 },
    { id: 'YBH86', title: "SAJU wan so, Ọlọrun", number: 86 },
    { id: 'YBH87', title: "AYO b' aiye: Olúwa de", number: 87 },
    { id: 'YBH88', title: "MA wo 'le, Jésù t' a nreti", number: 88 },
    { id: 'YBH89', title: "WO oju sanma ohun ni", number: 89 },
    { id: 'YBH90', title: "GBÓ 'gbe ayọ̀! Olúwa dé", number: 90 },
    { id: 'YBH91', title: "ÌLÚ t' ó dára pọ̀ l' ayé", number: 91 },
    { id: 'YBH92', title: "ODE, Kristi Olúwa", number: 92 },
    { id: 'YBH93', title: "ỌJỌ́ ayọ̀ ńlánlá ná dé", number: 93 },
    { id: 'YBH94', title: "WÒ! gbogbo ilé òkùnkùn", number: 94 },
    { id: 'YBH95', title: "GBÓ ẹda ọ̀run ńkọrin", number: 95 },
    { id: 'YBH96', title: "AYỌ̀ kún ọkàn wa lónì", number: 96 },
    { id: 'YBH97', title: "ONÍGBÀGBỌ́, ẹ bu s' ayọ̀", number: 97 },
    { id: 'YBH98', title: "WÁ ẹ̀yin olóòtọ́", number: 98 },
    { id: 'YBH99', title: "GBỌ́ ohun àlọ́rẹ", number: 99 },
    { id: 'YBH100', title: "ẸYIN Àngẹ́l' l' ọ̀run ògo", number: 100 },
    { id: 'YBH101', title: "JÍ, ìwọ Kristian, kí o kí òro ayọ̀", number: 101 },
    { id: 'YBH102', title: "A JÍN jìn, òru mímọ́", number: 102 },
    { id: 'YBH103', title: "SÚNMỌ́ ọ̀dọ̀ wa, Emmanuel", number: 103 },
    { id: 'YBH104', title: "A NTÍ ọ̀nà tí Olúwa wa rìn", number: 104 },
    { id: 'YBH105', title: "NÍNÚ ìṣẹ̀, nínú ìjà, Olúwa mi", number: 105 },
    { id: 'YBH106', title: "JÉSÙ, Ó ha rẹ́ ara Rẹ̀ lẹ́", number: 106 },
    { id: 'YBH107', title: "ÒGÀNJỌ́ gan: lóke Olífì", number: 107 },
    { id: 'YBH108', title: "Ó PARÍ! – ló Olùgbàlà ké", number: 108 },
    { id: 'YBH109', title: "ẸYIN ti ńkọjá", number: 109 },
    { id: 'YBH110', title: "MO f' ara Mi fún ọ", number: 110 },
    { id: 'YBH111', title: "A RÁ, ẹ wá bá mi sòfò", number: 111 },
    { id: 'YBH112', title: "EGB' ohun ife at' anu", number: 112 },
    { id: 'YBH113', title: "OLUGBALA mi ha gb'ogbe", number: 113 },
    { id: 'YBH114', title: "AGBELEBU ni ere mi", number: 114 },
    { id: 'YBH115', title: "GBO-GB' ogo iyin ola", number: 115 },
    { id: 'YBH116', title: "WÒ t' ó ńbẹ̀bẹ̀ f' ọ̀tá Rẹ̀", number: 116 },
    { id: 'YBH117', title: "Má gẹṣin lọ l’ ọláńlá Rẹ", number: 117 },
    { id: 'YBH118', title: "Kristi Olúwa jí lónìí", number: 118 },
    { id: 'YBH119', title: "Ó kú! – Ọ̀rẹ́ ẹlẹ́ṣẹ̀ kú", number: 119 },
    { id: 'YBH120', title: "Ọ̀run, kọrin! Ayé, yọ̀", number: 120 },
    { id: 'YBH121', title: "Olúwa jí lóòótọ́", number: 121 },
    { id: 'YBH122', title: "Kábọ̀ ọjọ́ rere", number: 122 },
    { id: 'YBH123', title: "Hallelúyà! Hallelúyà!!", number: 123 },
    { id: 'YBH124', title: "Hallelúyà, Hallelúyà", number: 124 },
    { id: 'YBH125', title: "Jésù yè: kò sí 'bẹ̀rù mọ́", number: 125 },
    { id: 'YBH126', title: "Olúwa mbọ̀! orin ayọ̀", number: 126 },
    { id: 'YBH127', title: "Ọlọ́run, ìwọ l'o jọba", number: 127 },
    { id: 'YBH128', title: "Jésù t’ó k’ó gb’ayé là", number: 128 },
    { id: 'YBH129', title: "B’ẹ́lẹ́ṣẹ̀ ṣ’ọwọ́ pọ̀", number: 129 },
    { id: 'YBH130', title: "Ọjọ́ Àjínde ti dé", number: 130 },
    { id: 'YBH131', title: "Òru Bú Kọjá Tán", number: 131 },
    { id: 'YBH132', title: "Ẹnyìn T’ẹ F’Olúwa", number: 132 },
    { id: 'YBH133', title: "A Fún Ìhò Ayọ̀ Mímọ́", number: 133 },
    { id: 'YBH134', title: "Iṣẹ́ ‘Gbàlà Parí", number: 134 },
    { id: 'YBH135', title: "Ìfẹ́ Ọ̀run Aláìlẹ́gbẹ́", number: 135 },
    { id: 'YBH136', title: "Gbogbo Ayé, Gbé Jésù Ga", number: 136 },
    { id: 'YBH137', title: "Ẹnde, Kọrin Móse", number: 137 },
    { id: 'YBH138', title: "Gb’ ọ̀pọ̀ Dúrù Pẹ̀lú Ohùn", number: 138 },
    { id: 'YBH139', title: "Ẹyọ̀ Jésù Jọba", number: 139 },
    { id: 'YBH140', title: "Mo Mọ̀ P’Olùdáǹde Mi Mbẹ", number: 140 },
    { id: 'YBH141', title: "Ẹ̀mí ‘Bùkún, Bí Afẹ́fẹ́", number: 141 },
    { id: 'YBH142', title: "Sọ Ìtàn Kan-nâ Fún Mi", number: 142 },
    { id: 'YBH143', title: "Olúwa, Y’ó Ti Pẹ́ Tó", number: 143 },
    { id: 'YBH144', title: "Jí, Apá Ọlọ́run, K’ Ó Jí", number: 144 },
    { id: 'YBH145', title: "Wò! Olúwa L’áwọsánmọ̀", number: 145 },
    { id: 'YBH146', title: "Ọlọ́run Olùràpadà", number: 146 },
    { id: 'YBH147', title: "Gbà T’ Olùgbàlà W’ Ayé", number: 147 },
    { id: 'YBH148', title: "Àwọn Ẹyẹ N’Ìtẹ́", number: 148 },
    { id: 'YBH149', title: "Krist’ Kí ‘Jọba Rẹ Dé", number: 149 },
    { id: 'YBH150', title: "Ẹ̀mí, Olóore-ọ̀fẹ́", number: 150 },
    { id: 'YBH151', title: "Wá Ẹ̀mí Mímọ́, Wá", number: 151 },
    { id: 'YBH152', title: "Olùràpadà Wa, K’ On Tó", number: 152 },
    { id: 'YBH153', title: "Wá, Ẹ̀mí ‘Re, ‘Dàbà Ọ̀run", number: 153 },
    { id: 'YBH154', title: "Ẹ̀mí Mímọ́, ‘Dàbà Ọ̀run", number: 154 },
    { id: 'YBH155', title: "Ẹ̀mí Ọ̀run, Gb’ Àdúrà Wa", number: 155 },
    { id: 'YBH156', title: "Ẹ̀mí Àánú, Òtítọ́, Ìfẹ́", number: 156 },
    { id: 'YBH157', title: "Ògo Fún Ọlọ́run Baba", number: 157 },
    { id: 'YBH158', title: "A F’ Ìyìn Àìkú Fún", number: 158 },
    { id: 'YBH159', title: "F’ Orúk’ Ọlọ́run Lókè", number: 159 },
    { id: 'YBH160', title: "Ọlọ́run Ti Fi Jésù Ṣe", number: 160 },
    { id: 'YBH161', title: "Olúwa, Aláìmọ́ L’ Èmi", number: 161 },
    { id: 'YBH162', title: "Ẹni ‘Súbu Ṣe Lè", number: 162 },
    { id: 'YBH163', title: "Olúwa, Báwo L’ Ọkàn Mi", number: 163 },
    { id: 'YBH164', title: "Ásán N’ Ìrétí T’ Ènìyàn Kọ́", number: 164 },
    { id: 'YBH165', title: "Gbat’ Ẹ̀mí Rẹ Bá Fò Lọ", number: 165 },
    { id: 'YBH166', title: "Níbò N’ Ìsimi Wà", number: 166 },
    { id: 'YBH167', title: "Lónìí Ni Jésù Pé", number: 167 },
    { id: 'YBH168', title: "Ẹlẹ́ṣẹ̀ Kíl’ Ó Ní T’ Ó", number: 168 },
    { id: 'YBH169', title: "“Àyè Sí Mbẹ!” Ile Odagutan", number: 169 },
    { id: 'YBH170', title: "Ọkàn Àpáta Túbà", number: 170 },
    { id: 'YBH171', title: "Ẹlẹ́ṣẹ̀, Ò Ha Gàn Ìṣẹ́", number: 171 },
    { id: 'YBH172', title: "Ẹ̀ṣẹ̀ Tí Ẹ Kò Lè Ṣàìlọ", number: 172 },
    { id: 'YBH173', title: "Múra Ẹlẹ́ṣẹ̀ Láti Gbọ́n", number: 173 },
    { id: 'YBH174', title: "Olúwa Mo Gb’ Ohùn Rẹ", number: 174 },
    { id: 'YBH175', title: "Ẹlẹ́ṣẹ̀ Ẹ Yí Padà", number: 175 },
    { id: 'YBH176', title: "Ẹnít’ Ó Bá Gbọ́, Kígbe Ìró Náà", number: 176 },
    { id: 'YBH177', title: "Ìyè Wà Ní Wíwò, Ẹnit’ A Kàn Mọ́ ‘Gi", number: 177 },
    { id: 'YBH178', title: "Olúwa, Ṣàánú, Dáríjì", number: 178 },
    { id: 'YBH179', title: "Ẹ̀bi Ẹ̀ṣẹ̀ Ńpa Mí L’ Ẹ̀rù", number: 179 },
    { id: 'YBH180', title: "Olúwa, Ọb’ Aláṣẹ", number: 180 },
    { id: 'YBH181', title: "Wò Olúwa Òkè", number: 181 },
    { id: 'YBH182', title: "Ibú Ìfẹ́! Ó Lè Jẹ́", number: 182 },
    { id: 'YBH183', title: "Olùgbàlà, Ní Ẹsẹ̀ Rẹ", number: 183 },
    { id: 'YBH184', title: "Mo Ti Ńb’ Ẹ̀ṣẹ̀ Rìn Tí Pẹ́", number: 184 },
    { id: 'YBH185', title: "Aláìmọ́ Ni Èmi", number: 185 },
    { id: 'YBH186', title: "Ẹ̀ṣẹ̀ Mi Pọ̀ Bí Ìràwọ̀", number: 186 },
    { id: 'YBH187', title: "Ìwọ Lọ́wọ́ Ẹnit’ Ire Ńsan", number: 187 },
    { id: 'YBH188', title: "Olùgbàlà, Gb’ Ohùn Mi", number: 188 },
    { id: 'YBH189', title: "Olúwa, Má M’ Ojú Kúrò", number: 189 },
    { id: 'YBH190', title: "Olúwa, B’ Agbówóde Ni", number: 190 },
    { id: 'YBH191', title: "Baba Má Yí Ojú Kúrò", number: 191 },
    { id: 'YBH192', title: "Jésù Ńfẹ́ Gbà Ẹlẹ́ṣẹ̀", number: 192 },
    { id: 'YBH193', title: "Ẹkún Kò Lè Gbà Mí", number: 193 },
    { id: 'YBH194', title: "Gbọ́ Ẹlẹ́ṣẹ̀, Àánú Ńpè Ọ́", number: 194 },
    { id: 'YBH195', title: "Jẹ́ Kí Gbogbo Étí Kó Gbọ́", number: 195 },
    { id: 'YBH196', title: "Ẹ̀wá Òtòṣì Ẹlẹ́ṣẹ̀", number: 196 },
    { id: 'YBH197', title: "Bí O Ti Rí Láìsí Àmì", number: 197 },
    { id: 'YBH198', title: "Mo Fi Omíjé Wò Yíká", number: 198 },
    { id: 'YBH199', title: "Wàlejò Kan L’ẹ́nu Ọ̀nà", number: 199 },
    { id: 'YBH200', title: "Kò S’ Ohun T’ Ó Kù K’ In Ṣe", number: 200 },
    { id: 'YBH201', title: "Ẹ̀yí, Ẹ Yípadà, Ẹ̀ṣẹ̀ T’ Ẹ Ó Kú", number: 201 },
    { id: 'YBH202', title: "Àlàáfíà W’ Ọkàn, T’ Ohùn Rẹ̀", number: 202 },
    { id: 'YBH203', title: "Àárẹ̀ Mú Ọ, Ayé Sú Ọ", number: 203 },
    { id: 'YBH204', title: "Ẹ̀yin Ọmọ Òkú", number: 204 },
    { id: 'YBH205', title: "JÉSÙ ńpè wa l' ọ̀sán, l' òrú", number: 205 },
    { id: 'YBH206', title: "Wá Sọ́dọ̀ Jésù, Máṣe Dúró", number: 206 },
    { id: 'YBH207', title: "Gbọ́ Ọkàn Mi, Bí Ángẹ́lì Ti Ńkọrin", number: 207 },
    { id: 'YBH208', title: "Wá Sọ́dọ̀ Mi, Alárè", number: 208 },
    { id: 'YBH209', title: "Nígbàt’ Ìdánwò Yí Mi Ká", number: 209 },
    { id: 'YBH210', title: "Jésù Nígbà ‘Dánwò", number: 210 },
    { id: 'YBH211', title: "Ẹlẹ́ṣẹ̀ Wá Sọ́dọ̀ Jésù", number: 211 },
    { id: 'YBH212', title: "Ọkàn Mi, Súnmọ́ ‘Tẹ́ Àánú", number: 212 },
    { id: 'YBH213', title: "Lọ, L’ Òrò Kùtù Kùtù", number: 213 },
    { id: 'YBH214', title: "Padà Aṣákó S’ Ílé Rẹ", number: 214 },
    { id: 'YBH215', title: "Ọmọ Ọlọ́run Ńlọ S’ Ògun", number: 215 },
    { id: 'YBH216', title: "Ọlọ́run Ńpè, Ngó Ha S’ Áìgbọ́", number: 216 },
    { id: 'YBH217', title: "Ó Ha Lè Jẹ́ P’ Á Mí", number: 217 },
    { id: 'YBH218', title: "Mo Ha Lè Tún Dúró", number: 218 },
    { id: 'YBH219', title: "Wò Tí Ńgb’ Àdúrà Ìgbàgbọ́", number: 219 },
    { id: 'YBH220', title: "Baba, Mo N’ Ọwọ́ Mi Sí Ọ", number: 220 },
    { id: 'YBH221', title: "Jésù, Ọ̀rẹ́ ‘Léṣẹ̀ Ni Ọ", number: 221 },
    { id: 'YBH222', title: "Bí Mo Ti Rí – Láìṣàwáwì", number: 222 },
    { id: 'YBH223', title: "Tìrẹ L’ Ọlá Baba", number: 223 },
    { id: 'YBH224', title: "Ẹlẹ́ṣẹ̀; – Mo Ńfẹ́ ‘Bùkún", number: 224 },
    { id: 'YBH225', title: "Èrédìí Ìròkẹ̀kẹ̀ Yìí", number: 225 },
    { id: 'YBH226', title: "Jìnnà Kúrò N’ Ìbugbé Ẹnìyàn", number: 226 },
    { id: 'YBH227', title: "Wá, Jésù Fí Ara Hàn", number: 227 },
    { id: 'YBH228', title: "Níhìnyí N’ Ìsimi Gbé Wa", number: 228 },
    { id: 'YBH229', title: "B’ Áwọn Ara Ìgbàní", number: 229 },
    { id: 'YBH230', title: "Tìrẹ L’ Èmí Ṣe, Mo Ti Gb’ Ohùn Rẹ̀", number: 230 },
    { id: 'YBH231', title: "Tìrẹ Láìlái L’ Áwa Ṣe", number: 231 },
    { id: 'YBH232', title: "Ìsún Kan Wà T’ Ó Kún F’ Ẹ̀jẹ̀", number: 232 },
    { id: 'YBH233', title: "Dìde Ọkàn Mi, Ńde", number: 233 },
    { id: 'YBH234', title: "Jésù Tí Mo Gbẹ́kẹ̀ Mi Lè", number: 234 },
    { id: 'YBH235', title: "Àpáta Àìyérayé", number: 235 },
    { id: 'YBH236', title: "Nígbà Ìtìjú K’ Óbò Mí", number: 236 },
    { id: 'YBH237', title: "Jésù Olùf’ Ọkàn Mi", number: 237 },
    { id: 'YBH238', title: "Jésù, Iṣẹ́ Rẹ̀ L’ Ó", number: 238 },
    { id: 'YBH239', title: "Bí Mo Ní Ẹgbàárùn-ún Ẹ̀bùn", number: 239 },
    { id: 'YBH240', title: "Lótọ́ Ẹ̀ṣẹ̀ Mi Pọ̀jù", number: 240 },
    { id: 'YBH241', title: "OLUWA ib’ isadi mi", number: 241 },
    { id: 'YBH242', title: "MO k’ ese mi le Jésù", number: 242 },
    { id: 'YBH243', title: "WO Ore okan ti nkanu", number: 243 },
    { id: 'YBH244', title: "PIPE n’ ise ‘gbala", number: 244 },
    { id: 'YBH245', title: "ENI ba gbekel’ Ọlọrun", number: 245 },
    { id: 'YBH246', title: "KI nko ohun gbogbosile", number: 246 },
    { id: 'YBH247', title: "OLUWA l’ atilehin mi", number: 247 },
    { id: 'YBH248', title: "F’ ERU re f’ afefe", number: 248 },
    { id: 'YBH249', title: "GBEKELE ojojumo", number: 249 },
    { id: 'YBH250', title: "GBEKELE onigbagbo", number: 250 },
    { id: 'YBH251', title: "APATA aiyeraiye", number: 251 },
    { id: 'YBH252', title: "OLUWA, Baba orun", number: 252 },
    { id: 'YBH253', title: "NIPA ife Olugbala", number: 253 },
    { id: 'YBH254', title: "LAIFOYA l’apa Jésù", number: 254 },
    { id: 'YBH255', title: "GBA mo le ka oye mi re", number: 255 },
    { id: 'YBH256', title: "IGBAGBO mi duro l’ori", number: 256 },
    { id: 'YBH257', title: "OLORUN mi bojuwo mi", number: 257 },
    { id: 'YBH258', title: "NIGBA nwon kehin si Sion", number: 258 },
    { id: 'YBH259', title: "ALAFIA, li aiye ese yi", number: 259 },
    { id: 'YBH260', title: "GB’ ori soke alare", number: 260 },
    { id: 'YBH261', title: "F’ORUKO Jésù s’ okan re", number: 261 },
    { id: 'YBH262', title: "KO si ewa nibikan ti", number: 262 },
    { id: 'YBH263', title: "NGO fe O, Ọlọrun Baba", number: 263 },
    { id: 'YBH264', title: "MO ti ni Jésù l’ore", number: 264 },
    { id: 'YBH265', title: "MO fe O, Ọlọrun, sugbon", number: 265 },
    { id: 'YBH266', title: "Ìfẹ́ orun, o ti dun to", number: 266 },
    { id: 'YBH267', title: "NGO feran Re, Wo odimi", number: 267 },
    { id: 'YBH268', title: "B’ORUKO Jésù ti dun to", number: 268 },
    { id: 'YBH269', title: "OKAN mi, Olúwa ni", number: 269 },
    { id: 'YBH270', title: "MO fe O n’gbagbogbo", number: 270 },
    { id: 'YBH271', title: "IFE lo to bayi?", number: 271 },
    { id: 'YBH272', title: "MURA ebe, okan mi", number: 272 },
    { id: 'YBH273', title: "GBA aiye mi, Olúwa", number: 273 },
    { id: 'YBH274', title: "BI agbonrin ti nmi hele", number: 274 },
    { id: 'YBH275', title: "EMI ko mo ‘gbat’ Olúwa yio de", number: 275 },
    { id: 'YBH276', title: "WA, iwo isun ibukun", number: 276 },
    { id: 'YBH277', title: "GBAT, a b’Olúwa rin", number: 277 },
    { id: 'YBH278', title: "AYO omo anu ti to", number: 278 },
    { id: 'YBH279', title: "AYO awon ti to", number: 279 },
    { id: 'YBH280', title: "BENI, O bikita fún mi", number: 280 },
    { id: 'YBH281', title: "JESU o ye ki nl’ ayo", number: 281 },
    { id: 'YBH282', title: "BI Jésù ba fe mi", number: 282 },
    { id: 'YBH283', title: "ALAFIA pel’ Olúwa", number: 283 },
    { id: 'YBH284', title: "OKAN mi nsimi, Olúwa", number: 284 },
    { id: 'YBH285', title: "ENYIN t’ e fe Olúwa", number: 285 },
    { id: 'YBH286', title: "MO gbohun Jésù t’ o wipe", number: 286 },
    { id: 'YBH287', title: "ISIN l’ o le fun wa li", number: 287 },
    { id: 'YBH288', title: "JESU, kiki ironu Re", number: 288 },
    { id: 'YBH289', title: "OLORUN ‘yanu! Ona kan", number: 289 },
    { id: 'YBH290', title: "JI, okan mi dide l’ ayo", number: 290 },
    { id: 'YBH291', title: "A! mba le l’ egberun ahon", number: 291 },
    { id: 'YBH292', title: "EYO, eyin mimo, e yin", number: 292 },
    { id: 'YBH293', title: "JESU Od’-agutan", number: 293 },
    { id: 'YBH294', title: "IRO t’ o dun ju orin", number: 294 },
    { id: 'YBH295', title: "IFE t’ o rekojaero", number: 295 },
    { id: 'YBH296', title: "IFE mi s’ ibi ti wa pe", number: 296 },
    { id: 'YBH297', title: "KI sepe mo ko yan O", number: 297 },
    { id: 'YBH298', title: "ODODO Re nikan laise t’ emi", number: 298 },
    { id: 'YBH299', title: "EWE ti Ọba orun", number: 299 },
    { id: 'YBH300', title: "AJIGBESE anu ni mi", number: 300 },
    { id: 'YBH301', title: "OKAN mi yin Ọba orun", number: 301 },
    { id: 'YBH302', title: "YIN Ọlọrun Abra’am", number: 302 },
    { id: 'YBH303', title: "FUN aanu t’ o po b’ iyanrin", number: 303 },
    { id: 'YBH304', title: "ITE anu! E je k’a lo", number: 304 },
    { id: 'YBH305', title: "NINU gbogbo iji ti nja", number: 305 },
    { id: 'YBH306', title: "IKOSE ti po to, t’ a nri", number: 306 },
    { id: 'YBH307', title: "LODO Re sibe nigbat’ojumo mo", number: 307 },
    { id: 'YBH308', title: "JE, Olúwa, sin wa jeje", number: 308 },
    { id: 'YBH309', title: "NGO sunm’ O, Ọlọrun", number: 309 },
    { id: 'YBH310', title: "OLORUN lat’ oro d’ ale", number: 310 },
    { id: 'YBH311', title: "WA k’ a da m’ awon ore wa", number: 311 },
    { id: 'YBH312', title: "GBA alare nwa simi", number: 312 },
    { id: 'YBH313', title: "ADUA didun adua didun", number: 313 },
    { id: 'YBH314', title: "IGBAGBO mi nwo O", number: 314 },
    { id: 'YBH315', title: "TIRE l’ awa Kristi", number: 315 },
    { id: 'YBH316', title: "B’ AYO aiye ti j’ asan to", number: 316 },
    { id: 'YBH317', title: "JESU, agbara mi", number: 317 },
    { id: 'YBH318', title: "BUKUN ni fun ohun", number: 318 },
    { id: 'YBH319', title: "B’ENU mi dun bi t’ awon ju", number: 319 },
    { id: 'YBH320', title: "ARA e jek’ a jumo rin", number: 320 },
    { id: 'YBH321', title: "JÉSÙ, Ìwọ l'a ńwò", number: 321 },
    { id: 'YBH322', title: "WÒ! b' o ti dùn tó láti rí", number: 322 },
    { id: 'YBH323', title: "GBÉKẸ̀ rẹ lé Olúwa", number: 323 },
    { id: 'YBH324', title: "MO dúró dẹ Ọlọ́run mi", number: 324 },
    { id: 'YBH325', title: "ABA lẹ n' ìgbàgbọ́ ayé", number: 325 },
    { id: 'YBH326', title: "Ọ̀NÀ àrà l' Ọlọ́run wa", number: 326 },
    { id: 'YBH327', title: "ÌSÌMÍ wa l' ọ̀run, kò sí l' ayé yìí", number: 327 },
    { id: 'YBH328', title: "ÌGBÀ wa mbẹ li ọwọ́ Rẹ", number: 328 },
    { id: 'YBH329', title: "NÍHÌN l' àyidà wa", number: 329 },
    { id: 'YBH330', title: "À! ÌGBÀGBỌ́ bila! T' èmi l' Olúwa", number: 330 },
    { id: 'YBH331', title: "ỌLỌ́RUN Olódùmarè", number: 331 },
    { id: 'YBH332', title: "OLÚWA, kì s’ agbára mi", number: 332 },
    { id: 'YBH333', title: "B’ AYÉ mi kún fún ‘bànújẹ́", number: 333 },
    { id: 'YBH334', title: "Ọ̀NÀ Rẹ, Olúwa", number: 334 },
    { id: 'YBH335', title: "MÁ tọ́jú, Jèhófà ńlá", number: 335 },
    { id: 'YBH336', title: "BÀBÁ mi, ‘gbà mo ńṣákó lọ", number: 336 },
    { id: 'YBH337', title: "MO ti ṣe ‘lérí, JÉSÙ", number: 337 },
    { id: 'YBH338', title: "JÉSÙ aláìl’ àbawọ́n", number: 338 },
    { id: 'YBH339', title: "JÍ, ọkàn mi dìde gìrì", number: 339 },
    { id: 'YBH340', title: "ÒJÍṢẸ́ Krist’, dìde", number: 340 },
    { id: 'YBH341', title: "KỌ́ mi, Olúwa mi", number: 341 },
    { id: 'YBH342', title: "ÒG' Olúwa j’ ohun ‘yanu", number: 342 },
    { id: 'YBH343', title: "ṢIṢẸ́ torí òru mbọ̀! Ṣiṣẹ́ li òwúrọ̀", number: 343 },
    { id: 'YBH344', title: "ṢIṢẸ́, àkókò ńlọ", number: 344 },
    { id: 'YBH345', title: "ARÁ mi fún ‘rúgbìn rere", number: 345 },
    { id: 'YBH346', title: "A Ó ṣiṣẹ́! a ó ṣiṣẹ́! Ọm’ -Ọlọ́run ni wa", number: 346 },
    { id: 'YBH347', title: "YỌ àwọn tí ńṣègbé, ṣàjò ẹni ńkú", number: 347 },
    { id: 'YBH348', title: "ÀJÀGUN JÉSÙ l’ èmi bí", number: 348 },
    { id: 'YBH349', title: "MÁ ṣọ́ra, ọkàn mi", number: 349 },
    { id: 'YBH350', title: "JÉSÙ wípé k’ á má ṣọ́ra", number: 350 },
    { id: 'YBH351', title: "ỌKÀN wa jí; k’ ẹ̀rù fò lọ", number: 351 },
    { id: 'YBH352', title: "ỌM’ -OGUN Krist’ dìde", number: 352 },
    { id: 'YBH353', title: "Ẹ MÁ tẹ̀ síwájú, Kristian ológun", number: 353 },
    { id: 'YBH354', title: "HÀ! ẹgbẹ́ mi, ẹ w’ àsíá", number: 354 },
    { id: 'YBH355', title: "KRISTIAN má ti wá 'sìmí", number: 355 },
    { id: 'YBH356', title: "DÚRÓ, dúró fún JÉSÙ", number: 356 },
    { id: 'YBH357', title: "BÀBÁ ọ̀run, nín’ ọ̀rọ̀ Rẹ", number: 357 },
    { id: 'YBH358', title: "Á, JẸ́KÍ ọ̀rọ̀ mímọ́ Rẹ", number: 358 },
    { id: 'YBH359', title: "BÍBÉLÌ mímọ́ t’ ọ̀run", number: 359 },
    { id: 'YBH360', title: "BÀBÁ ọ̀run, tí ìfẹ́ Rẹ", number: 360 },
    { id: 'YBH361', title: "OLÚWA, máṣe jẹ́ k’ á lù ‘lẹ̀", number: 361 },
    { id: 'YBH362', title: "NÍNÚ iṣẹ́ ìsìn Rẹ, Olúwa", number: 362 },
    { id: 'YBH363', title: "ÀWÁ ńṣẹ́gun nínú JÉSÙ", number: 363 },
    { id: 'YBH364', title: "IKÚ kì y’ ó ṣẹ́gun mọ́", number: 364 },
    { id: 'YBH365', title: "AYỌ̀ ńlá l’ ọjọ́ náà y’ ó jẹ́", number: 365 },
    { id: 'YBH366', title: "ÌBÙKÚN ni f’ àwọn t’ ó ńṣọ́ra", number: 366 },
    { id: 'YBH367', title: "DÍDÉ Rẹ̀ kò ní pẹ́ mọ́", number: 367 },
    { id: 'YBH368', title: "ÀJIŃDE àti ìyè ni mí", number: 368 },
    { id: 'YBH369', title: "OLÚWA, ràn wá lọ́wọ́", number: 369 },
    { id: 'YBH370', title: "ÀWÁ jẹ́ ajagun JÉSÙ", number: 370 },
    { id: 'YBH371', title: "ÌMỌ́LẸ̀ l’ ọ̀nà wa", number: 371 },
    { id: 'YBH372', title: "Ẹ JẸ́ k’ á jùmọ̀ yọ̀", number: 372 },
    { id: 'YBH373', title: "ÒGO fún Ọlọ́run l’ òkè", number: 373 },
    { id: 'YBH374', title: "ÌFẸ́ Rẹ ga jù lọ", number: 374 },
    { id: 'YBH375', title: "OLÚWA, Ìwọ l’ Alábòó wa", number: 375 },
    { id: 'YBH376', title: "Ẹ JẸ́ k’ á f’ ìyìn fún Ọ", number: 376 },
    { id: 'YBH377', title: "ÌGBÀGBỌ́ wa máa sẹ́gun", number: 377 },
    { id: 'YBH378', title: "ÀLÁÁFÍÀ n’ ìlérí Rẹ̀", number: 378 },
    { id: 'YBH379', title: "ÌWỌ l’ Ọba ayérayé", number: 379 },
    { id: 'YBH380', title: "MÁṢE jẹ́ k’ á dẹ́bi", number: 380 },
    { id: 'YBH381', title: "ÀWÁ ńdúró d’ Ọ́, Olúwa", number: 381 },
    { id: 'YBH382', title: "ÌBÙKÚN n’ f’ àwọn mímọ́", number: 382 },
    { id: 'YBH383', title: "JÉSÙ, Ìwọ l’ Ọ̀nà wa", number: 383 },
    { id: 'YBH384', title: "Ẹ JẸ́ k’ á jùmọ̀ gbadura", number: 384 },
    { id: 'YBH385', title: "ALÁRÈ, wá s’ ọ́dọ̀ JÉSÙ", number: 385 },
    { id: 'YBH386', title: "ÌWỌ l’ Orísun ìyè", number: 386 },
    { id: 'YBH387', title: "ÀWÁ jẹ́ tirẹ, Olúwa", number: 387 },
    { id: 'YBH388', title: "ÌṢẸ́GUN mbẹ nínú ẹ̀jẹ̀ Rẹ̀", number: 388 },
    { id: 'YBH389', title: "OLÚWA, f’ Ẹ̀mÍ Rẹ fún wa", number: 389 },
    { id: 'YBH390', title: "ÌWỌ l’ Ọlọ́run Aláàánú", number: 390 },
    { id: 'YBH391', title: "ÀWÁ f’ ìyìn fún Ọlá Rẹ", number: 391 },
    { id: 'YBH392', title: "JÉSÙ, Ìwọ l’ Ọba Ògo", number: 392 },
    { id: 'YBH393', title: "ÌBÙKÚN n’ f’ ẹni rẹ̀rìn", number: 393 },
    { id: 'YBH394', title: "Ẹ JẸ́ k’ á f’ ayọ̀ sìn Ọ", number: 394 },
    { id: 'YBH395', title: "OLÚWA, tọ́ wa s’ ọ̀nà", number: 395 },
    { id: 'YBH396', title: "ÌWỌ l’ Aláféhìntì wa", number: 396 },
    { id: 'YBH397', title: "ÀWÁ ńkọrin ìṣẹ́gun", number: 397 },
    { id: 'YBH398', title: "JÉSÙ, Ìwọ l’ Ọ̀rẹ́ wa", number: 398 },
    { id: 'YBH399', title: "ÌBÙKÚN n’ f’ ọkàn mímọ́", number: 399 },
    { id: 'YBH400', title: "ÀWÁ f’ ògo fún Ọlá Rẹ", number: 400 },
    { id: 'YBH401', title: "JÉSÙ á dé l’ ọjọ́ òní", number: 401 },
    { id: 'YBH402', title: "Ó FÚN mi l’ èdìdì", number: 402 },
    { id: 'YBH403', title: "KÍ L’ ó lè w’ ẹ̀ṣẹ̀ mi nù", number: 403 },
    { id: 'YBH404', title: "PẸ̀LÚ ìwà mímọ́, b’ Olúwa s’ ọ̀rọ̀", number: 404 },
    { id: 'YBH405', title: "ALÁBÙKÚN n’ isun ẹ̀jẹ̀", number: 405 },
    { id: 'YBH406', title: "“LỌ wàásù Mi,” l’ Olúwa wí", number: 406 },
    { id: 'YBH407', title: "OLÚWA wà mímọ́", number: 407 },
    { id: 'YBH408', title: "JẸ́ K’ alóre Síónì dìde", number: 408 },
    { id: 'YBH409', title: "ỌLỌ́RUN ‘kórè, tẹ́ ‘tí Rẹ", number: 409 },
    { id: 'YBH410', title: "ÌJÌNLẸ̀ l’ ọ̀rọ̀ Rẹ, Jésù", number: 410 },
    { id: 'YBH411', title: "Ọ̀WỌ̀ l’ ẹni òróró Rẹ", number: 411 },
    { id: 'YBH412', title: "KRIST’, nín’ ọgbà Édén", number: 412 },
    { id: 'YBH413', title: "NÍ Kánánì tí Gálílì", number: 413 },
    { id: 'YBH414', title: "IRE t’ a sú ní Édén’", number: 414 },
    { id: 'YBH415', title: "JÉSÙ f’ ara hàn nítòótọ́", number: 415 },
    { id: 'YBH416', title: "SIMI lé Olúwa - ẹ gbọ́", number: 416 },
    { id: 'YBH417', title: "JÉSÙ f’ ẹ̀jẹ̀ Rẹ̀ rà wá", number: 417 },
    { id: 'YBH418', title: "WÁ, Olúwa, l’ àánú tún wa", number: 418 },
    { id: 'YBH419', title: "GBỌ́ l’ ór’ ìtẹ́ Rẹ, Aládé", number: 419 },
    { id: 'YBH420', title: "OLÚWA, mo gbọ́ pé Ìwọ", number: 420 },
    { id: 'YBH421', title: "MÁ kọjá mi, Olúgbàlà", number: 421 },
    { id: 'YBH422', title: "WỌ ‘lé ‘wọ ẹnit’ a bùkún", number: 422 },
    { id: 'YBH423', title: "ARÁ n’nú Kríst’, nítorí Rẹ̀", number: 423 },
    { id: 'YBH424', title: "WỌ ‘lé, ‘wọ alábùkúnfún", number: 424 },
    { id: 'YBH425', title: "Ẹ̀YIN ènìyàn Ọlọ́run", number: 425 },
    { id: 'YBH426', title: "JÉSÙ, ‘Wọ Olùṣ’-àgùtàn", number: 426 },
    { id: 'YBH427', title: "JÍ ‘ṣẹ́ Rẹ nde Jésù", number: 427 },
    { id: 'YBH428', title: "MÁ f’ ara fún ‘dánwò", number: 428 },
    { id: 'YBH429', title: "Á, JÉSÙ Alábùkún", number: 429 },
    { id: 'YBH430', title: "TỌ́ nwọn, Baba sí Ọ", number: 430 },
    { id: 'YBH431', title: "OLÚWA sọ̀kalẹ̀", number: 431 },
    { id: 'YBH432', title: "Ẹ DÌDE kí a sì kọrin", number: 432 },
    { id: 'YBH433', title: "Ọ̀SẸ̀, ọ̀sẹ̀ t’ a ńretí", number: 433 },
    { id: 'YBH434', title: "LẸ́YÌN ‘jọ́ méfà t’ O ṣiṣẹ́", number: 434 },
    { id: 'YBH435', title: "JÉSÙ Ọba, a parí ẹ̀kọ́ wa", number: 435 },
    { id: 'YBH436', title: "K’ ÁWA tó parí ẹ̀kọ́ wa", number: 436 },
    { id: 'YBH437', title: "MO fẹ́ kí ndàbí Jésù", number: 437 },
    { id: 'YBH438', title: "BÍ oṣùn gbẹ́gẹ́ etí ‘dò", number: 438 },
    { id: 'YBH439', title: "ILÉ-Ẹ̀KỌ́ ọjọ́ ‘sinmi", number: 439 },
    { id: 'YBH440', title: "ỌLỌ́RUN Baba, Kríst’ Ọmọ", number: 440 },
    { id: 'YBH441', title: "NÍHÌN-ÍN, l’ óko Rẹ Olúwa", number: 441 },
    { id: 'YBH442', title: "ỌLỌ́RUN Baba, Ológo", number: 442 },
    { id: 'YBH443', title: "KRISTI n’ ìpìlẹ̀ wa", number: 443 },
    { id: 'YBH444', title: "LÁT’ òkè tútù Grinland", number: 444 },
    { id: 'YBH445', title: "GBỌ́ ohùn Jésù tí ńké pe", number: 445 },
    { id: 'YBH446', title: "ÌWỌ tí òkùnkùn", number: 446 },
    { id: 'YBH447', title: "KÈFÈRÍ ńṣègbé lójójó", number: 447 },
    { id: 'YBH448', title: "WÁ, máa ṣiṣẹ́", number: 448 },
    { id: 'YBH449', title: "Wò B' Ìkórè Ti Pọ̀", number: 449 },
    { id: 'YBH450', title: "Ẹ Fún Ìpè Náà Kíkàn", number: 450 },
    { id: 'YBH451', title: "Ìránṣẹ́ Olúwa", number: 451 },
    { id: 'YBH452', title: "Má Ṣiṣẹ́ Lọ, Má Ṣáré", number: 452 },
    { id: 'YBH453', title: "Jésù Y'ó Jọba Ní Gbogbo", number: 453 },
    { id: 'YBH454', title: "Gbọ! Orin Tí Jùbílì", number: 454 },
    { id: 'YBH455', title: "Fúnrùgbìn L' Òwúrọ̀", number: 455 },
    { id: 'YBH456', title: "Ọ̀rọ̀ Díẹ̀ Fún Jésù", number: 456 },
    { id: 'YBH457', title: "Lọ Kẹ́dè Ìgbàlà Jésù", number: 457 },
    { id: 'YBH458', title: "AGOGO ìhìnrere", number: 458 },
    { id: 'YBH459', title: "FÚNRÚGBÌN l’ òwúrọ̀, irúgbìn inú ‘re", number: 459 },
    { id: 'YBH460', title: "ÀTI gbọ́ ìró dídùn", number: 460 },
    { id: 'YBH461', title: "KRÍSTÌ fún gbogb’ ayé", number: 461 },
    { id: 'YBH462', title: "ÌLÚ mi, orin rẹ", number: 462 },
    { id: 'YBH463', title: "OLÚWA, ‘gbàt’ a ńgbàdúrà", number: 463 },
    { id: 'YBH464', title: "OLÚWA, jẹ́kí oore Rẹ", number: 464 },
    { id: 'YBH465', title: "ÁFÍK’ ‘lẹ wàrà àt’ oyin", number: 465 },
    { id: 'YBH466', title: "NÀÌJÍRÍÀ, a kí ọ", number: 466 },
    { id: 'YBH467', title: "ỌLỌ́RUN orílẹ̀-èdè", number: 467 },
    { id: 'YBH468', title: "OLÚWA, Ìwọ l’ àwa ńpé", number: 468 },
    { id: 'YBH469', title: "ORÍSUN laí, t’ ayọ̀ gbogbo", number: 469 },
    { id: 'YBH470', title: "YIN Ọlọrun Ọba wa", number: 470 },
    { id: 'YBH471', title: "OLÚWA, a gbé Ọ ga", number: 471 },
    { id: 'YBH472', title: "Ẹ JẸ́ k’ á yin Olúwa", number: 472 },
    { id: 'YBH473', title: "JẸ́ kí á kọrin ìyìn sí Olúwa", number: 473 },
    { id: 'YBH474', title: "OLÚWA, Ọba wa, orúkọ Rẹ ti níyin tó!", number: 474 },
    { id: 'YBH475', title: "Ẹ fi ìyìn fún Jèhófà", number: 475 },
    { id: 'YBH476', title: "Ẹ YIN Olúwa, ẹ yin Olúwa", number: 476 },
    { id: 'YBH477', title: "OLÚWA, Olúwa wa", number: 477 },
    { id: 'YBH478', title: "MO fẹ́ kọrin ìyìn sí Ọ", number: 478 },
    { id: 'YBH479', title: "GBOGBO ayé, ẹ gbé Jésù ga", number: 479 },
    { id: 'YBH480', title: "ODUN miran ti koja", number: 480 },
    { id: 'YBH481', title: "ALAKOSO ti orun", number: 481 },
    { id: 'YBH482', title: "OLUWA alafia wa", number: 482 },
    { id: 'YBH483', title: "OLORUN t’ odun t’ o koja", number: 483 },
    { id: 'YBH484', title: "B’ ORUN l’ aiduro ti rin", number: 484 },
    { id: 'YBH485', title: "OLUWA at’ ‘igbala wa", number: 485 },
    { id: 'YBH486', title: "NI akoko ipinya", number: 486 },
    { id: 'YBH487', title: "AO ha pade l’ eti odo", number: 487 },
    { id: 'YBH488', title: "K’ OLORUN so o, k’ a tun pade", number: 488 },
    { id: 'YBH489', title: "NIHIN l’ awa nje ‘rora", number: 489 },
    { id: 'YBH490', title: "K’ ORE-ofe Krist’ Olúwa", number: 490 },
    { id: 'YBH491', title: "OLORUN l’ odo eniti", number: 491 },
    { id: 'YBH492', title: "JESU awa nwo O fun", number: 492 },
    { id: 'YBH493', title: "JESU ‘ wo Onisegun nla", number: 493 },
    { id: 'YBH494', title: "MO gbeke mi le O", number: 494 },
    { id: 'YBH495', title: "ISE re Olúwa", number: 495 },
    { id: 'YBH496', title: "B’ ODO ti nyara san lo", number: 496 },
    { id: 'YBH497', title: "KO mi ni iwon ojo mi", number: 497 },
    { id: 'YBH498', title: "OLORUN lat’ irandiran", number: 498 },
    { id: 'YBH499', title: "LAB’ ese, ati l’ oke wa", number: 499 },
    { id: 'YBH500', title: "ILE ‘simi, mo nreti re", number: 500 },
    { id: 'YBH501', title: "AKOKO ati lo mi ya", number: 501 },
    { id: 'YBH502', title: "ARA, b’ a ko tile gbo", number: 502 },
    { id: 'YBH503', title: "GB’ ohun t’ o orun wa ti wi", number: 503 },
    { id: 'YBH504', title: "KIKU n’nu Jésù, iku re", number: 504 },
    { id: 'YBH505', title: "IKU l’ opin ohun gbogbo", number: 505 },
    { id: 'YBH506', title: "O SUN,” ni Jésù wi", number: 506 },
    { id: 'YBH507', title: "GBAT’ a kun fun ‘banuje", number: 507 },
    { id: 'YBH508', title: "ITANA t’ o bo ‘gbe l’ aso", number: 508 },
    { id: 'YBH509', title: "RANSE Ọlọrun seun", number: 509 },
    { id: 'YBH510', title: "MA sun lo, olufe; sa ma simi", number: 510 },
    { id: 'YBH511', title: "KI a to d’ awon oke nla", number: 511 },
    { id: 'YBH512', title: "LALA alagbase tan", number: 512 },
    { id: 'YBH513', title: "IBUKUN ni f’ oku", number: 513 },
    { id: 'YBH514', title: "GB’ ohun to t’ orun wa ti wi", number: 514 },
    { id: 'YBH515', title: "NIGBAT’ ipe ba dun", number: 515 },
    { id: 'YBH516', title: "NJ’ Onidajo yio wa", number: 516 },
    { id: 'YBH517', title: "GBA ‘Wo Onidajo ba de", number: 517 },
    { id: 'YBH518', title: "KO s’ aye ‘jafara nihin", number: 518 },
    { id: 'YBH519', title: "JESU Olúwa mbo", number: 519 },
    { id: 'YBH520', title: "GBAT’ O ba de, gbat’ O ba de", number: 520 },
    { id: 'YBH521', title: "OJO ‘dajo, ojo, eru", number: 521 },
    { id: 'YBH522', title: "NIHIN mo j’ alejo", number: 522 },
    { id: 'YBH523', title: "JERUSALEM ibi ayo", number: 523 },
    { id: 'YBH524', title: "LEHIN odun die", number: 524 },
    { id: 'YBH525', title: "JERUSALEM t’ orun", number: 525 },
    { id: 'YBH526', title: "ILE ewa wonni, b’ o ti dara to", number: 526 },
    { id: 'YBH527', title: "OKAN are, ile kan mbe", number: 527 },
    { id: 'YBH528', title: "ILE ayo kan wa", number: 528 },
    { id: 'YBH529', title: "JEKI m’ n’ ipo mi lodo Re", number: 529 },
    { id: 'YBH530', title: "A! NWON ti gun s’ ebute", number: 530 },
    { id: 'YBH531', title: "A! RO ti ibugbe orun", number: 531 },
    { id: 'YBH532', title: "GBAT’ aiye yi ba koja", number: 532 },
    { id: 'YBH533', title: "OJU ko ti ri, eti ko ti gbo", number: 533 },
    { id: 'YBH534', title: "PARADISE! Paradise", number: 534 },
    { id: 'YBH535', title: "ASORO ile ‘bukun ni", number: 535 },
    { id: 'YBH536', title: "F’ AWON enia Re t’ o lo ‘smi", number: 536 },
    { id: 'YBH537', title: "OKE kan mbe jina rere", number: 537 },
    { id: 'YBH538', title: "LAI lodo Olúwa", number: 538 },
    { id: 'YBH539', title: "LEHIN aiye buburu yi", number: 539 },
    { id: 'YBH540', title: "ALABUKUN n’nu Jésù", number: 540 },
    { id: 'YBH541', title: "AKO n’ ibugbe kan nihin", number: 541 },
    { id: 'YBH542', title: "AWON mimo! Ija nwon pin", number: 542 },
    { id: 'YBH543', title: "TAL’ awon wonyi b’ iranwo", number: 543 },
    { id: 'YBH544', title: "EGBEGBERUN aimoye", number: 544 },
    { id: 'YBH545', title: "OPO ikan omi", number: 545 },
    { id: 'YBH546', title: "MASE huwa ese", number: 546 },
    { id: 'YBH547', title: "GBATI Samueli ji", number: 547 },
    { id: 'YBH548', title: "OJ’ oni lo", number: 548 },
    { id: 'YBH549', title: "JESU Onirele", number: 549 },
    { id: 'YBH550', title: "GB’ adura wa Olúwa", number: 550 },
    { id: 'YBH551', title: "OLORUN Bethel, Eniti", number: 551 },
    { id: 'YBH552', title: "JESU pe omode", number: 552 },
    { id: 'YBH553', title: "MA so fun mi l’ ohun aro", number: 553 },
    { id: 'YBH554', title: "YIKA or’ ite Ọlọrun", number: 554 },
    { id: 'YBH555', title: "ORE kan mbe fun omode", number: 555 },
    { id: 'YBH556', title: "NIGBAKAN ni Betlehemu", number: 556 },
    { id: 'YBH557', title: "SA dake, okan mi", number: 557 },
    { id: 'YBH558', title: "KINI gbogbo lala Re", number: 558 },
    { id: 'YBH559', title: "TAL’ o mo adun isimi", number: 559 },
    { id: 'YBH560', title: "JESU, nigba aiye Re", number: 560 },
    { id: 'YBH561', title: "ESE t' onigbagbo mberu?", number: 561 },
    { id: 'YBH562', title: "OM’ Ọlọrun, a ko ri O", number: 562 },
    { id: 'YBH563', title: "IGBAGBO l’ ategun t’ o so", number: 563 },
    { id: 'YBH564', title: "OLORI ijo t’ orun", number: 564 },
    { id: 'YBH565', title: "TANI yio gbe JaKob’ dide", number: 565 },
    { id: 'YBH566', title: "OLORUN fe araiye", number: 566 },
    { id: 'YBH567', title: "NIHIN l’ Ọlọrun sin mi de", number: 567 },
    { id: 'YBH568', title: "LARIN ewu at’ osi", number: 568 },
    { id: 'YBH569', title: "EREDI iwa s’ aiye mi", number: 569 },
    { id: 'YBH570', title: "JEJE, lai si ariwo", number: 570 },
    { id: 'YBH571', title: "OLUWA, iji nfe s’ oke", number: 571 },
    { id: 'YBH572', title: "OJO ibukun yio siro", number: 572 },
    { id: 'YBH573', title: "GBA Jésù ba de lati pin ere", number: 573 },
    { id: 'YBH574', title: "LAB’ agbelebu Jésù", number: 574 },
    { id: 'YBH575', title: "FUN mi n’ iwa pele", number: 575 },
    { id: 'YBH576', title: "L’ AYO l’ a ro t’ ore-ofe", number: 576 },
    { id: 'YBH577', title: "ORE-OFE! Ohun", number: 577 },
    { id: 'YBH578', title: "ONISEGUN nla wa nihin", number: 578 },
    { id: 'YBH579', title: "KO to k’ awon mimo beru", number: 579 },
    { id: 'YBH580', title: "JESU fe mi, emi mo", number: 580 },
    { id: 'YBH581', title: "PELU mi nibiti mo nlo", number: 581 },
    { id: 'YBH582', title: "JESU l’ Olusagutan mi", number: 582 },
    { id: 'YBH583', title: "NINU oru ibanuje", number: 583 },
    { id: 'YBH584', title: "OLORUN emi wa, at’ igbala wa", number: 584 },
    { id: 'YBH585', title: "JESU ma to wa", number: 585 },
    { id: 'YBH586', title: "A JESU, Iwo nduro", number: 586 },
    { id: 'YBH587', title: "JESU t' O wa l' oke- orun", number: 587 },
    { id: 'YBH588', title: "ENIKAN mbe t’ O feran wa", number: 588 },
    { id: 'YBH589', title: "OLUWA wow a l’ ese Re", number: 589 },
    { id: 'YBH590', title: "Sí Pẹpẹ Olúwa", number: 590 },
    { id: 'YBH591', title: "Mọ́kàndínlọ́gọ́rùn-ún Dùbúlẹ̀ Jẹ́", number: 591 },
    { id: 'YBH592', title: "Mo Fẹ́ Gbọ́ Ìtàn Kannáà", number: 592 },
    { id: 'YBH593', title: "Wá, Ẹ̀yin Ọlọ́pẹ́, Wá", number: 593 },
    { id: 'YBH594', title: "Ohùn Ògo Rẹ̀ L'a Ń Ròyìn", number: 594 },
    { id: 'YBH595', title: "Olúwa Ni Ọba", number: 595 },
    { id: 'YBH596', title: "Yọ̀, Ẹ̀yin Onígbàgbọ́", number: 596 },
    { id: 'YBH597', title: "Mo Fẹ́ràn Ìwé Ọ̀rọ̀ Rẹ̀", number: 597 },
    { id: 'YBH598', title: "Jésù, Aṣọ Òdodo Rẹ", number: 598 },
    { id: 'YBH599', title: "Wá Bá Mi Gbé! Alẹ́ Fẹ́rẹ́ Lẹ́ Tán", number: 599 },
    { id: 'YBH600', title: "Bàbá Ọ̀run! Ẹ̀mí Fẹ́ Wa", number: 600 },
    { id: 'YBH601', title: "Ọkàn Mi, Ọdún Kan Nínú", number: 601 },
    { id: 'YBH602', title: "Lásán Ni Èrò Mi Ń Wá 'pa", number: 602 },
    { id: 'YBH603', title: "Jésù B' Olùṣọ́, Má Sìn Wá", number: 603 },
    { id: 'YBH604', title: "Bàbá, A F' Ara Wa", number: 604 },
    { id: 'YBH605', title: "Bàbá, Ọmọ, Òun Ẹ̀mí", number: 605 },
    { id: 'YBH606', title: "Ó Ń Tọ́ Mi Lọ Ìró 'Bùkún", number: 606 },
    { id: 'YBH607', title: "Ìgbàlà Ni, Ìgbàlà Ni", number: 607 },
    { id: 'YBH608', title: "Ìtàn Ìyanu T' Ìfẹ́", number: 608 },
    { id: 'YBH609', title: "Jésù Ń F' Ohùn Jẹ́jẹ́ Pè Ọ́ Wá 'lé", number: 609 },
    { id: 'YBH610', title: "A Kò Ní 'bùgbé Kan Níhìn-ín", number: 610 },
    { id: 'YBH611', title: "Obìnrin T' A Mú Nínú Panságà 'Ṣe", number: 611 },
    { id: 'YBH612', title: "Ọlọ́run Mi, Ọlọ́run Mi", number: 612 },
    { id: 'YBH613', title: "Kì Í Ṣe L' Àìnírètí", number: 613 },
    { id: 'YBH614', title: "Àlejò Kan Máa Ńkànkùn", number: 614 },
    { id: 'YBH615', title: "Ẹ Tún Wọn Kọ Fún Mi Kí Ngbọ́", number: 615 },
    { id: 'YBH616', title: "Mo Fi Gbogbo Rẹ̀ Fún Jésù", number: 616 },
    { id: 'YBH617', title: "Olúwa Mi, Mo Képè Ọ́", number: 617 },
    { id: 'YBH618', title: "Mo Fẹ́ Mọ̀ Nípa Jésù Síi", number: 618 },
    { id: 'YBH619', title: "Ìgbàgbọ́ Àwọn Ìyá Wa", number: 619 },
    { id: 'YBH620', title: "Bàbá Jọwọ Gb’ Àdúrà Wa", number: 620 },
    { id: 'YBH621', title: "Bàbá Wa, Olódùmarè", number: 621 },
    { id: 'YBH622', title: "Ọlọ́run Ṣọ́ Wa N’ Nú Ọkọ̀", number: 622 },
    { id: 'YBH623', title: "Àpáta Wa N’ Ilẹ̀ Arẹ̀", number: 623 },
    { id: 'YBH624', title: "Gbat’ Ìjì Gòkè L’ Ọ̀nà Rẹ", number: 624 },
    { id: 'YBH625', title: "Síọ́n Yara, K’ O Ṣe Ìṣẹ́ Gíga Rẹ", number: 625 },
    { id: 'YBH626', title: "Jẹ́ Rán ‘Mọ́lẹ̀ Kékèké Nibiti O Nlọ", number: 626 },
    { id: 'YBH627', title: "Ìtàn Kan Wà F’ Àwọn Orílẹ̀", number: 627 },
    { id: 'YBH628', title: "Ngó Jẹ́ ‘Mọ́lẹ̀ Fún Jésù", number: 628 },
    { id: 'YBH629', title: "Wá, Obìnrin, Ẹ Kọ", number: 629 },
    { id: 'YBH630', title: "A Yìn Ọlọ́run", number: 630 },
    { id: 'YBH631', title: "Orin T’ Ó Dùn S’ Ọkàn Mi", number: 631 },
    { id: 'YBH632', title: "A Rẹ̀ M’ Ọkàn Rẹ Pọ̀rúrú?", number: 632 },
    { id: 'YBH633', title: "B’ Ó Ti Dùn Láti Gba Jésù", number: 633 },
    { id: 'YBH634', title: "T’ Ìfẹ́ Jésù T’ Ó Wá Mi", number: 634 },
    { id: 'YBH635', title: "Wọ́n Dúró Fún Ẹgbẹ́ Kan", number: 635 },
    { id: 'YBH636', title: "Enìkan Ṣe Ìṣẹ́ Wúrà", number: 636 },
    { id: 'YBH637', title: "Ọ̀rẹ́ Ni Jésù Fún Mi", number: 637 },
    { id: 'YBH638', title: "Gbàt’ Ìpè Olúwa Bá Dun", number: 638 },
    { id: 'YBH639', title: "Ìjà Ti Dé, Ìpè Ṣíń Dun", number: 639 },
    { id: 'YBH640', title: "Ìmọ́lẹ̀ K’ Ọkàn Mi Lónìí", number: 640 },
    { id: 'YBH641', title: "Ìwọ Ha Ńbẹ̀rù P’ Ọ̀tá Yíò Ṣẹ́gun", number: 641 },
    { id: 'YBH642', title: "Jésù Fẹ́ K’ Èmi Jẹ́ ‘Mọ́lẹ̀", number: 642 },
    { id: 'YBH643', title: "Gbogbo Ayé Ti Nù S’ Ókùnkùn Ẹ̀ṣẹ̀", number: 643 },
    { id: 'YBH644', title: "Jésù Ńfẹ́ K’ Á F’ Ìmọ́lẹ̀ Tí Ó Pé Tán", number: 644 },
    { id: 'YBH645', title: "Jésù Ni Gbogb’ Ayé Fún Mi", number: 645 },
    { id: 'YBH646', title: "Kò S’ Ọ̀rẹ́ Bí Jésù Onírẹ̀lẹ̀", number: 646 },
    { id: 'YBH647', title: "Lásán L’ Adùn Ayé Ńpè Mí", number: 647 },
    { id: 'YBH648', title: "Mo N’ Olùgbàlà T’ Ó Ńbẹ̀rẹ̀ Nín’ Ògo", number: 648 },
    { id: 'YBH649', title: "Mo N' Ọ̀rẹ́ Kan, Á, Ọ̀rẹ́ Náà", number: 649 },
    { id: 'YBH650', title: "Olùṣọ́-Àgùntàn Ni Ńpè Mi", number: 650 },
    { id: 'YBH651', title: "B' Ìfẹ́ Olùgbàlà Ti Dùn Tó", number: 651 },
    { id: 'YBH652', title: "B' Ó Ti Wù K' Ìjì Nà", number: 652 },
    { id: 'YBH653', title: "Jésù, Olùgbàlà, Mo Sá Tọ̀ Ọ́", number: 653 },
    { id: 'YBH654', title: "Jésù Fẹ́ Mi, Jésù Fẹ́ Mi", number: 654 },
    { id: 'YBH655', title: "L' Ẹ́bà Ágọ́ Olùgbàlà", number: 655 },
    { id: 'YBH656', title: "Nígbàtí Mo Wa L' Ọ̀dọ̀ Jésù", number: 656 },
    { id: 'YBH657', title: "Jésù, Jésù, Jésù", number: 657 },
    { id: 'YBH658', title: "Ẹ̀jẹ̀ Jésù, Ẹ̀jẹ̀ Jésù", number: 658 },
    { id: 'YBH659', title: "Ẹ̀yin Èrò, Níbo L' Ẹ Ńlọ", number: 659 },
    { id: 'YBH660', title: "Ohùn Ìpè Kan Ti Òkè Pẹ̀tẹ́lẹ̀ Wá", number: 660 }
  ];

  // Filter hymns based on search term
  const filteredHymns = allHymns.filter(hymn =>
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.number.toString().includes(searchTerm)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredHymns.length / hymnsPerPage);
  const startIndex = (currentPage - 1) * hymnsPerPage;
  const endIndex = startIndex + hymnsPerPage;
  const currentHymns = filteredHymns.slice(startIndex, endIndex);

  return (
    <div className={`edition-page theme-${theme}`}>
      <div className="header-top-row">
        <button className="back-button icon-only" onClick={handleGoBack}>
          <span className="icon">←</span>
        </button>
        <div className="header-spacer"></div>
      </div>

      <div className="edition-topic-section">
        <div className="edition-header-stacked">
          <div className="edition-title">Yoruba Baptist Hymnal</div>
          <div className="edition-topic">Iwe Orin Baptist Yoruba</div>
        </div>
      </div>

      <div className="edition-meta">
        <span>Published: 2024</span>
        <span className="meta-separator">•</span>
        <span>Publisher: Baptist Convention</span>
      </div>

      <div className="edition-meta">
        <span>Hymns: 638</span>
        <span className="meta-separator">•</span>
        <span>Language: Yoruba</span>
        <span className="meta-separator">•</span>
        <button className="history-toggle" onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {showHistory && (
        <div className="edition-history-box">
          <p>Iwe Orin Baptist Yoruba ni o ni awon orin ibile ti a tumo si ede Yoruba. The Yoruba Baptist Hymnal contains traditional Baptist hymns translated into the Yoruba language with proper tonations and cultural adaptations for Yoruba-speaking congregations.</p>
        </div>
      )}

      <div className="hymn-list-section">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search hymns or numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>

          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>

          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>

        <div className="hymn-grid">
          {currentHymns.map(hymn => (
            <Link to={`/yoruba-hymn/${hymn.id}`} key={hymn.id} className="hymn-card">
              <div className="hymn-number">{hymn.number}</div>
              <div className="hymn-title">{hymn.title}</div>
              <button
                className={`favorite-button ${favorites.includes(hymn.id) ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hymn.id)}
              >
                <span className="favorite-icon">
                  {favorites.includes(hymn.id) ? '★' : '☆'}
                </span>
              </button>
            </Link>
          ))}
        </div>

        {filteredHymns.length === 0 && (
          <div className="no-results">
            <p>No hymns found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditionYoruba;
