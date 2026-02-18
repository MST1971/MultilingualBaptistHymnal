﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HymnDetail.css';

function HausaHymnDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [showToolbar, setShowToolbar] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');

  // Load note from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('hymnNotes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      if (notes[id]) {
        setNote(notes[id]);
      } else {
        setNote('');
      }
    } else {
      setNote('');
    }
  }, [id]);

  // Save note to localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('hymnNotes') 
      ? JSON.parse(localStorage.getItem('hymnNotes')) 
      : {};
    
    if (note.trim()) {
      savedNotes[id] = note;
    } else {
      delete savedNotes[id];
    }
    
    localStorage.setItem('hymnNotes', JSON.stringify(savedNotes));
  }, [note, id]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('hausaHymnHighlights');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      setHistoryIndex(parsedHistory.length - 1);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hausaHymnHighlights', JSON.stringify(history));
  }, [history]);

  const colors = [
    { name: 'yellow', label: 'Yellow' },
    { name: 'red', label: 'Red' },
    { name: 'blue', label: 'Blue' },
    { name: 'orange', label: 'Orange' },
    { name: 'ash', label: 'Ash' },
    { name: 'black', label: 'Black' }
  ];

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        setShowToolbar(true);
      } else {
        // Only hide toolbar if clicking outside of it
        const toolbar = document.querySelector('.highlight-toolbar');
        if (toolbar && !toolbar.contains(document.activeElement)) {
          setShowToolbar(false);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', (e) => {
      const toolbar = document.querySelector('.highlight-toolbar');
      if (toolbar && !toolbar.contains(e.target)) {
        setShowToolbar(false);
      }
    });

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleSelection);
    };
  }, []);

  const saveToHistory = (action) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      if (action.type === 'highlight') {
        const element = document.querySelector(`[data-highlight-id="${action.id}"]`);
        if (element) {
          const parent = element.parentNode;
          parent.replaceChild(document.createTextNode(element.textContent), element);
        }
      }
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const action = history[historyIndex + 1];
      if (action.type === 'highlight') {
        const textNode = document.createTextNode(action.text);
        const highlightSpan = document.createElement('span');
        highlightSpan.className = `highlight-${action.color}`;
        highlightSpan.setAttribute('data-highlight-id', action.id);
        highlightSpan.appendChild(textNode);
        
        const range = document.createRange();
        range.setStart(action.startNode, action.startOffset);
        range.setEnd(action.endNode, action.endOffset);
        range.deleteContents();
        range.insertNode(highlightSpan);
      }
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyHighlight = (color) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Create a new range to handle the selection
      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset);
      newRange.setEnd(range.endContainer, range.endOffset);

      // Create a temporary container
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(newRange.extractContents());

      // Create the highlight span
      const highlightSpan = document.createElement('span');
      highlightSpan.className = `highlight-${color}`;
      const highlightId = Date.now().toString();
      highlightSpan.setAttribute('data-highlight-id', highlightId);
      
      // Move the content into the highlight span
      while (tempDiv.firstChild) {
        highlightSpan.appendChild(tempDiv.firstChild);
      }

      // Insert the highlighted content back
      newRange.insertNode(highlightSpan);

      // Save to history
      saveToHistory({
        type: 'highlight',
        id: highlightId,
        color,
        text: highlightSpan.textContent,
        startNode: range.startContainer,
        startOffset: range.startOffset,
        endNode: range.endContainer,
        endOffset: range.endOffset,
        hymnNumber: id // Save the hymn number with the highlight
      });

      // Clear the selection
      selection.removeAllRanges();
      setShowToolbar(false);
      setSelectedColor(color);
    }
  };

  const handlePreviousHymn = () => {
    const currentNumber = parseInt(id.replace('HBH', ''));
    if (currentNumber > 1) {
      navigate(`/hausa-hymn/HBH${currentNumber - 1}`);
    }
  };

  const handleNextHymn = () => {
    const currentNumber = parseInt(id.replace('HBH', ''));
    const totalHymns = 572; // Total number of hymns in the Hausa Baptist Hymnal
    if (currentNumber < totalHymns) {
      navigate(`/hausa-hymn/HBH${currentNumber + 1}`);
    }
  };

  // Format title in proper title case
  const formatTitleCase = (title) => {
    // Handle cases where title is not a string
    if (typeof title !== 'string') {
      return '';
    }

    // Words that should remain lowercase (unless they're the first word)
    const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 
                           'into', 'nor', 'of', 'on', 'or', 'over', 'so', 'the', 'to', 'up', 'with'];
    
    // Split the title into words
    const words = title.split(' ');
    
    // Process each word
    return words.map((word, index) => {
      // Always capitalize the first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      
      // Check if the word should remain lowercase
      if (lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      
      // Capitalize all other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const getHausaHymnDetails = (hymnId) => {
    // Hausa hymn data (hymns 1-10 from 1956 Baptist Hymnal)
    const hausaHymns = {
      "HBH1": {
        title: "Mai Tsarki, Mai Tsarki, Mai Tsarki! Uba Mai Girma!",
        number: "HBH1",
        author: "Reginald Heber, 1783-1826; Fassarar Hausa",
        composer: "John B. Dykes, 1823-1876",
        tune: "NICAEA",
        meter: "11.12.12.10",
        key: "D Major",
        scripture: "Ru'uya ta Yohanna 4:8; Ishaya 6:3",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1826",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mai Tsarki, Mai Tsarki! Uba Mai Girma!",
              "Tun da farkon safe ne muke yabonka",
              "Mai Tsarki, Mai Tsarki, Mai Jinkai, mai girma",
              "Daya cikin uku, mai albarka."
            ]
          },
          {
            verse: 2,
            text: [
              "Mai Tsarki, Mai Tsarki! Waliyai na sujada,",
              "Suna ajiye rawaninsu, A kursiyinka",
              "Cherubim da Seraphim, Na maka sujada",
              "Kai tun fil'azal, Kai madawwami."
            ]
          },
          {
            verse: 3,
            text: [
              "Mai Tsarki, Mai Tsarki! Ga mu nan kasassu",
              "Mai zunubi ba zai iya ganin fuskarka",
              "Kai kadai mai tsarki, Ba wani kamarka",
              "Iko cikakke, Kauna da tsarki."
            ]
          },
          {
            verse: 4,
            text: [
              "Mai Tsarki, Mai Tsarki! Uba Mai Girma",
              "Duk aikin hannuwanka na yabon sunanka",
              "Mai Tsarki, Mai Tsarki, Mai jinkai, mai girma",
              "Daya cikin uku, Mai albarka. Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo ta shahara ce da Reginald Heber ya rubuta a 1826. Heber ya kasance Bishop na Calcutta kuma ya shahara da rubuta waƙoƙin yabo masu zurfi. Waƙar tana mai da hankali kan tsarkin Allah da kuma ra'ayin Triniti. An yi amfani da ita sosai a cikin ibadudduka na Kirista a duk duniya. Kalmar 'Mai Tsarki' ta sake maimaitawa tana nuna girman mutuncin Allah da kuma tsarkinsa."
      },
      "HBH2": {
        title: "Kaunar Allah, Ba Kamar Ta",
        number: "HBH2",
        author: "Charles Wesley, 1707-1788",
        composer: "John Zundel, 1815-1882",
        tune: "LOVE DIVINE",
        meter: "8.7.8.7.D.",
        key: "G Major",
        scripture: "1 Yohanna 4:16",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1747",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Kaunar Allah ba kamarta, Ko a sama ko a nan",
              "Sai ka cika mana zuciya, Sai mu zama cikakku",
              "Yesu mai jin tausayinmu, Kai mai kaunar mutane",
              "Ziyarce mu da cetonka, Shigo dukan zukata."
            ]
          },
          {
            verse: 2,
            text: [
              "Sai ka huro mana Ruhu, Karfafa mu yanzu",
              "Kai ne gadonmu, ya Allah, Za ka ba mu hutawa",
              "Raba mu da son mugunta, Kai ne Ruhu kai ne Rai",
              "Farkon kome da cikansa, Allah ne madawwami."
            ]
          },
          {
            verse: 3,
            text: [
              "Zo ya Allah, domin ceto, Ba mu duk alherinka,",
              "Zo da sauri, zo da zama, Zauna nan har abada",
              "Kai ne kullum muke yabo, Bautarka ce muke so",
              "Yin addu'a da sujada, Sun yi mana daɗi yau."
            ]
          },
          {
            verse: 4,
            text: [
              "Mai da mu sabuwar halitta, Tsarkake mu duka fa.",
              "Har mu ga fansa mai girma, Wadda ka yi dominmu.",
              "Sake mu da darajarka, Har mu isa sama",
              "Za mu rusuna gabanka, Muna maka godiya. Amin"
            ]
          }
        ],
        history: "Wannan waƙar yabo ta nuna ƙaunar Allah mai girma kamar yadda aka bayyana a cikin 1 Yohanna 4:16, tana kira ga Ruhu Mai Tsarki ya cika zukatanmu."
      },
      "HBH3": {
        title: "Dukan Halittun Allahnmu",
        number: "HBH3",
        author: "St. Francis of Assisi, 1182-1226",
        composer: "",
        tune: "LASST UNS ERFREUEN",
        meter: "8.8.4.4.8.8 With Allelujahs",
        key: "",
        scripture: "Zabura 148",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Dukan Halittun Allahnmu, Ta da murya mu yi yabo",
              "Halleluya! Halleluya! Rana, wata da taurari,",
              "Ba shi girma da ɗaukaka, Yabe shi, yabe shi,",
              "Halleluya! Halleluya!, Halleluya!"
            ]
          },
          {
            verse: 2,
            text: [
              "Iska mai ƙarfi yabe shi, Girgijen sama yabe shi,",
              "Mu yabe shi Halleluya! Kai hasken safe yabe shi,",
              "Kai hasken yamma Yabe shi, Yabe shi! Yabe shi!",
              "Halleluya! Halleluya! Halleluya!"
            ]
          },
          {
            verse: 3,
            text: [
              "Duniya da cikarta fa, Saki mana Albarkunki,",
              "Mu yabe shi Halleluya! Itatuwa da furanni,",
              "Ku girmama ɗaukakarsa, Yabe shi, yabe shi,",
              "Halleluya! Halleluya! Halleluya!"
            ]
          },
          {
            verse: 4,
            text: [
              "Duk halittun duniyar nan, Yabe shi cikin tawali'u,",
              "Yabe shi, Halleluya, Yabi Uba Da da Ruhu,",
              "Mu yabi girman sunansa, Yabe shi, yabe shi.",
              "Halleluya! Halleluya!, Halleluya! Amin"
            ]
          }
        ],
        history: "Waƙar yabo ce da ta dogara akan Zabura 148, tana kiran dukkan halittu su yabi Allah Mahalicci."
      },
      "HBH4": {
        title: "Ya Allah Mala'iku Suna Yabonka",
        number: "HBH4",
        author: "Anonymous",
        composer: "",
        tune: "AUTUMN",
        meter: "8.7.8.7.D.",
        key: "",
        scripture: "",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya Allah mun ba ka girma, Mala'iku sun yabe ka,",
              "Ya Allah na duk dangogi, Duniya na shaidarka.",
              "Ubangijin duk ƙasashe, Kana nan tun fil'azal",
              "Labaranka na ko'ina, Yabonka ba iyaka."
            ]
          },
          {
            verse: 2,
            text: [
              "Ya Uba ba mai kamarka, Ka fi gaban misali.",
              "Aikin ka abin mamaki, Cike da Alherinka.",
              "Kaunarka ta mallake mu, Cikin faɗin mulkinka.",
              "Hannunka yake bishe mu, Mulkinka mai albarka."
            ]
          },
          {
            verse: 3,
            text: [
              "Ceton ka kyauta, maigirma, Yana nan tun fil'azal,",
              "Duniya ba ta kula ba, Wa zai raira yabonka.",
              "Hasken ɗaukakar ubanu, Shi ke bishe mu kullum",
              "Ba ni ikon raira yabo, Don in raira mutuwarka."
            ]
          },
          {
            verse: 4,
            text: [
              "Daga bisa kursiyinka, Har dai zuwa kalfari,",
              "Ka yi duk don ka fanshe mu, Daukaka har abada",
              "Ya ubanmu madawwami, Mallake mu ya uba",
              "Yi mulkin mu har abada, Mu dukan mu Naka ne. Amin"
            ]
          }
        ],
        history: "Waƙar yabo ce da mala'iku ke yaba wa Allah saboda girmansa da kuma ikon mulkinsa madawwami."
      },
      "HBH5": {
        title: "Allah Ubanmu, Mun Yabe Ka",
        number: "HBH5",
        author: "Robert C. Singleton, 1810-1881",
        composer: "John Zundel, 1815-1882",
        tune: "LOVE DIVINE",
        meter: "8.7.8.7.D.",
        key: "G Major",
        scripture: "Yohanna 4:23-24",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1867,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah Uba mun yabe ka, Mu 'ya'yanka, muna yabo",
              "Zaɓaɓɓu cikin Almasihu, Tsarkakku a gaban ka",
              "Mun yabe ka, mun yabe ka, Muna raira yabonka",
              "Mun yabe ka, mun yabe ka, Muna raira yabonka."
            ]
          },
          {
            verse: 2,
            text: [
              "Yesu Kristi mun yabe ka, Haske bisa kursiyinka",
              "Mun durƙusa a gaban ka, Kai ka jawo mu kusa",
              "Mun yabe ka, mun yabe ka, Ka zo ka ba da ranka",
              "Mun yabe ka, mun yabe ka, Ka zo ka ba da ranka."
            ]
          },
          {
            verse: 3,
            text: [
              "Mun yabe ka, Ruhu Mai Tsarki, Baƙo daga sama",
              "Aikakke daga Allahnmu, Kai ne ka hutashe mu",
              "Mun yabe ka, mun yabe ka, Godiya ga alherinka,",
              "Mun yabe ka, mun yabe ka, Godiya ga alherinka"
            ]
          },
          {
            verse: 4,
            text: [
              "Uba, Ɗa, da Ruhu Mai Tsarki, Muna yabon sunanka",
              "Don arzikin da mun gada, Muna yabon sunanka",
              "Mun yabe ka, mun yabe ka, Mun albarkace ka yau",
              "Mun yabe ka, mun yabe ka, Mun albarkace ka yau. Amin"
            ]
          }
        ],
        history: "Waƙar tana mai da hankali ne kan bautar Allah a cikin 'Ruhu da Gaskiya' kamar yadda aka nuna a cikin Yohanna 4:23-24."
      },
      "HBH6": {
        title: "Yabo Ga Allahnmu",
        number: "HBH6",
        author: "Joachim Neander, 1650-1680",
        composer: "Joachim Neander, 1650-1680",
        tune: "LOBE DEN HERREN",
        meter: "14.14.4.7.8",
        key: "G Major",
        scripture: "Zabura 103:1-5",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1680,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yabo ga Allahnmu, Shi ne mahaliccin kome",
              "Ya raina, yabe shi, Shi ne Mai Ceto, mai iko,",
              "Zo, masu ji, Maza da mata ku zo,",
              "Ku guso nan, ku yabe shi."
            ]
          },
          {
            verse: 2,
            text: [
              "Yabo ga Allahnmu, mai mulkin sama da duniya",
              "Ya kiyaye mu a ƙarƙashin fukafukansa,",
              "Ba ka ji ba? Bukatar kowa ya biya,",
              "Ta wurin ikon ƙaunarsa."
            ]
          },
          {
            verse: 3,
            text: [
              "Yabo ga Allahnmu, Wanda ya tsare mu duka",
              "Kullum jinƙai da alherinsa, Kan kiyaye mu",
              "Lura da kyau, Kome Mai Iko ya iya,",
              "Don ƙaunarsa a gare mu."
            ]
          },
          {
            verse: 4,
            text: [
              "Ya raina duka, Ka yabi Ubangiji Allah",
              "Yara da manya ku zo, A gabansa da waƙa",
              "Bari 'Amin' shi fito, Bakinmu duk",
              "Har abada mu yabe shi. Amin"
            ]
          }
        ],
        history: "An rubuta wannan waƙar ne bisa Zabura 103:1-5, tana kira ga ranmu ya yabi Allah saboda dukan alheransa da kiyayewarsa."
      },
      "HBH7": {
        title: "Ya Ku Dake Cikin Duniya Tada Murya",
        number: "HBH7",
        author: "Isaac Watts, 1674-1748",
        composer: "Lowell Mason, 1792-1872",
        tune: "ARIEL",
        meter: "8.8.6.D.",
        key: "F Major",
        scripture: "Zabura 98:4-9",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1719,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya ku da ke cikin duniya, Ku raira yabo Ga Allah,",
              "Ku albarkace Shi, Ku bayyana ɗaukakarsa,",
              "Al'ajibansa ga duniya,",
              "Yi shelar cetonsa, Yi shelar cetonsa."
            ]
          },
          {
            verse: 2,
            text: [
              "Sammai da Ƙasai nasa ne, Hasken duniya shi ya yi,",
              "Yana mulkinta fa, Ginshiƙinsa na da haske,",
              "Darajarsa na da girma,",
              "Kursiyinsa da kyau, Kursiyinsa da kyau."
            ]
          },
          {
            verse: 3,
            text: [
              "Ya ke ranar ɗaukaka, zo Jama'a za su ga ceto",
              "Ku dangogi duka, Ku zo gabansa da tsoro",
              "Ku bayyana ɗaukakarsa,",
              "Yi shela cetonsa, Yi shelar cetonsa. Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo ta Isaac Watts tana kira ga dukan duniya su raira waƙa da murna ga Ubangiji, bisa ga Zabura 98:4-9."
      },
      "HBH8": {
        title: "Da Haske Da Daraja Shi Ya Yi",
        number: "HBH8",
        author: "Cecil Frances Alexander, 1818-1895",
        composer: "Conrad Kocher, 1786-1872",
        tune: "SPOHR",
        meter: "7.6.7.6. D",
        key: "F Major",
        scripture: "Takaddama 1:31",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1848,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Da haske da daraja, Da mai girma duka",
              "Da abin ban mamaki, Ubanmu ne ya yi",
              "Duk ƙananan furanni, Har da tsuntsaye duk",
              "Shi ya ƙawata su, Shi ya halicce su."
            ]
          },
          {
            verse: 2,
            text: [
              "Lokacin hunturu, Da na rani duka",
              "da lokacin girbi ma, UBAN mu ne ya yi",
              "Ya ba mu idon gani, Harshe don mu furta",
              "Ubangiji na da kyau, Aikinsa na da kyau. Amin"
            ]
          }
        ],
        history: "Wannan waƙar tana yaba wa Allah saboda kyawun halittunsa, tun daga furanni har zuwa tsuntsaye, kamar yadda aka nuna a cikin Farawa (Takaddama) 1:31."
      },
      "HBH9": {
        title: "Ya Ku Sammai Yabe Shi",
        number: "HBH9",
        author: "Foundling Hospital Collection",
        composer: "Rowland H. Prichard, 1811-1887",
        tune: "HYFRYDOL",
        meter: "8.7.8.7. D",
        key: "G Major",
        scripture: "Zabura 148:1-6",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1796,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya ku sammai yabi Allah, Mala'iku ku yabe shi",
              "Rana da wata yi murna, Taurari ku haskaka",
              "Ku yi yabon ɗaukakarsa, Duniya sun yi biyayya",
              "Shari'arka fa tana nan, Domin ta amfane su."
            ]
          },
          {
            verse: 2,
            text: [
              "Ɗaukakarsa abin yabo, Ya cika alkawari",
              "Tsarkaka na da nasara, Babu ikon zunubi",
              "Yabi Allah don ceton mu, Halittu ku yabe shi",
              "Sammai da ƙassai dukan ku, Ku ɗaukaka girmansa."
            ]
          }
        ],
        history: "Wannan waƙar ta nuna yadda dukkan sammai da halittun cikinsu suke yaba wa Allah, bisa ga Zabura 148:1-6."
      },
      "HBH10": {
        title: "Kyawawan Halittu",
        number: "HBH10",
        author: "Joseph Addison, 1672-1719",
        composer: "Franz Joseph Haydn, 1732-1809",
        tune: "CREATION",
        meter: "L.M.D.",
        key: "G Major",
        scripture: "Zabura 19:1-4",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: 1712,
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Kyawawan halittu duka, Sama da dukan haskenta",
              "Da dukan bayyanuwar ta, Daga farkon kafuwarta",
              "Hasken rana yau da kullum, Suna nuna ikon Allah",
              "Suna a kowace ƙasa, Bayyanuwar aikin Allah"
            ]
          },
          {
            verse: 2,
            text: [
              "Yayin da maraice ta yi, Hasken wata takan fito",
              "Don Haskaka dukan duniya, Don bayyana matsayinta",
              "Da taurari, kewaye ta, Sammai cikin yanayinsu",
              "Suna shaida darajarsu, Sun bayyana a ko'ina"
            ]
          },
          {
            verse: 3,
            text: [
              "Da ban girma da ɗaukaka, Suna tafiya ko'ina",
              "Cikin yanayinsu duka, Babu cikakken kalamai",
              "Suna yin furci mai daɗi, Suna yabon mahalicci.",
              "Suna yabon mahalicci, Tsarkin Allah abin yabo, Amin."
            ]
          }
        ],
        history: "Waƙar Joseph Addison tana bayyana yadda sammai da taurari suke shelar ɗaukakar Allah da aikin hannunsa, bisa ga Zabura 19:1-4."
      },
      "HBH11": {
        title: "Muna Yabonka Ya Allah",
        number: "HBH11",
        author: "Julia Bulkley Cady Cory, 1882-1963",
        composer: "Edward Kremser, 1838-1914",
        tune: "KREMSER",
        meter: "Irregular",
        key: "F Major",
        scripture: "Zabura 100",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1902",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Muna yabonka, Mai Ceton duniya duka",
              "Da godiya muna maka sujada.",
              "Ga mu nan durƙushe cikin ɗaukakarka",
              "Mun albarkace ka, muna raira yabo."
            ]
          },
          {
            verse: 2,
            text: [
              "Mun yabe ka, Allah, mun albarkace ka",
              "Cikin wahala kana tare da mu",
              "Cikin ƙunci da damuwa muna tare",
              "Za mu yi nasara da taimakonka."
            ]
          },
          {
            verse: 3,
            text: [
              "Mun zo gare ka yau da muryoyin yabo",
              "Muna yabonka da waƙoƙin murna",
              "Da ikonka za ka tsare mu ya Allah",
              "Yabo, ɗaukaka, naka har abada. Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo tana godiya ga Allah bisa ga Zabura 100, tana kiran masu bi su raira waƙoƙin murna ga Mai Ceton duniya."
      },
      "HBH12": {
        title: "Zo Ya Madaukaki",
        number: "HBH12",
        author: "Anonymous",
        composer: "Felice de Giardini, 1716-1796",
        tune: "ITALIAN HYMN (TRINITY)",
        meter: "6.6.4.6.6.6.4",
        key: "F Major",
        scripture: "",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1757",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Zo, ya maɗaukaki, Ba mu ikon yabo,",
              "Ka taimake mu Uba, Maɗaukaki, kai ne mai nasara",
              "Zo ka mallake mu madawwami."
            ]
          },
          {
            verse: 2,
            text: [
              "Zo kalmar Allahnmu, Yi mana ƙariyarka",
              "Ji addu'armu, zo, albarkace mu, Ka cika kalmarka,",
              "Ruhu Mai Tsarki sauko mana."
            ]
          },
          {
            verse: 3,
            text: [
              "Zo, mai yin ta'aziya, Zama mai shaidarmu",
              "A sa'annan, kai ne mafifici, Mallaki zuciyarmu,",
              "Kar ka rabu da mu, Ruhun iko."
            ]
          },
          {
            verse: 4,
            text: [
              "Ɗaya cikin uku, Duk yabo naka ne,",
              "Har abada, kai ne mai, Mulkinmu Mu ga ɗaukakarsa,",
              "Har abada abadin, cikin ƙauna. Amin"
            ]
          }
        ],
        history: "Waƙar yabo ce ga Triniti (Uba, Ɗa, da Ruhu Mai Tsarki), tana roƙon Allah ya sauko ya mallaki zukatanmu."
      },
      "HBH13": {
        title: "Ya Al'ummai, Ku Daukaka",
        number: "HBH13",
        author: "William Kethe, d. 1594",
        composer: "Louis Bourgeois, c. 1510-1561",
        tune: "OLD 100TH",
        meter: "L.M.",
        key: "G Major",
        scripture: "Zabura 100",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1561",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya ku mutanen duniya duk, Zo ku yabe Ubangiji,",
              "Ku bauta wa madawwami, Ku yabe shi da rairawa."
            ]
          },
          {
            verse: 2,
            text: [
              "Ubangiji Shi Allah ne, Mahalicci sahihi kuwa",
              "Ya mai da mu mutanensa, Tumakin makiyayarsa."
            ]
          },
          {
            verse: 3,
            text: [
              "Ku shiga cikin ƙofarSa, Da yabo shiga gidansa",
              "Ku gode domin jinƙansa, Albarkacin sunansa kuwa."
            ]
          },
          {
            verse: 4,
            text: [
              "Ubangiji kyakyawa ne, Jinƙansa babu iyaka",
              "Amincinsa ya tabbata, Tun zamanai, har abada.",
              "Amin"
            ]
          },
          {
            verse: 5,
            text: [
              "Yabe Allah don albarku, Yabe shi dukan halittu,",
              "Yabe shi duk mala'iku, Yabi Uba, Ɗa, da Ruhu."
            ]
          }
        ],
        history: "Wannan sananniyar waƙar yabo ce bisa ga Zabura 100, tana kiran dukan mutanen duniya su bauta wa Allah da murna."
      },
      "HBH14": {
        title: "Yabo Naka Ne Allah",
        number: "HBH14",
        author: "Folliott S. Pierpoint, 1835-1917",
        composer: "Conrad Kocher, 1786-1872",
        tune: "DIX",
        meter: "7.7.7.7.7.7",
        key: "G Major",
        scripture: "Zabura 103",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1864",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yabo naka ne Allah, Domin yawan ƙaunarka",
              "Kai ka ba mu murna yau, Za mu furta yabonka,",
              "Kai ne majinginanmu, Kai tushen ni'imarmu."
            ]
          },
          {
            verse: 2,
            text: [
              "Kai mai ba da albarka, Ka cika rumbunan mu",
              "Duk da yawan garkenmu, Da amfanin gonaki",
              "Za mu raira yabonka, Da zuciyar godiya"
            ]
          },
          {
            verse: 3,
            text: [
              "Salama da kwanciyar rai, Kai uba ka ba mu su,",
              "Ilimi da basira, Da sanin ya kamata,",
              "Dukan su kai ka ba mu, Mun yabe ka da godiya."
            ]
          },
          {
            verse: 4,
            text: [
              "Kai ka albarkace mu, Mun sadaukar da kanmu",
              "Da ayyukan ƙaunarmu, Domin dukan ƙaunarka,",
              "Za mu raira koyaushe, Yabi Allah duk duniya.",
              "Amin"
            ]
          }
        ],
        history: "Waƙar Folliott Pierpoint tana godiya ga Allah saboda dukan albarkatun da ya ba mu, bisa ga Zabura 103."
      },
      "HBH15": {
        title: "Ya Allah Kai Ne Haskena",
        number: "HBH15",
        author: "John Keble, 1792-1866",
        composer: "Katholisches Gesangbuch, 1774",
        tune: "HURSLEY",
        meter: "L.M.",
        key: "F Major",
        scripture: "Luka 24:29",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1820",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya Allah kai ne Haskena, Babu duhu in kana nan,",
              "Kar wani shenge har ya taso, Da zai sa in rabu da kai."
            ]
          },
          {
            verse: 2,
            text: [
              "Ka kasance da ni kullum, In ban da kai ba rayuwa,",
              "Ka kasance da ni kullum,In ban da kai na lalace."
            ]
          },
          {
            verse: 3,
            text: [
              "In wani ɓataccen ɗanka, Ya ratse daga hanyarka",
              "Sai ka yi aikin cetonka, Don shi kauce wa zunubi."
            ]
          },
          {
            verse: 4,
            text: [
              "Zo yau ka albarkace mu, Kafin mu fara aikinmu",
              "Har cikin zurfin ƙaunarka, Mu dawwama har abada.",
              "Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo ce da ke roƙon kasancewar Allah a rayuwarmu kullum, bisa ga Luka 24:29."
      },
      "HBH16": {
        title: "Tashi Ku Yabe Shi",
        number: "HBH16",
        author: "William Kethe, d. 1594",
        composer: "Genevan Psalter, 1551",
        tune: "OLD 134TH (ST. MICHAEL)",
        meter: "S.M.",
        key: "G Major",
        scripture: "Zabura 134",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1561",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Tashi ku yabe shi, Zaɓaɓɓu na Allah",
              "Tashi ku yabi Allahnku, Da zuciya, da murya."
            ]
          },
          {
            verse: 2,
            text: [
              "Yabo nasa ne duk, Albarka tasa ce",
              "Wa zai ƙi tsoron sunan, Ya ƙi girmama shi?"
            ]
          },
          {
            verse: 3,
            text: [
              "Ga wutar bagadi, wadda ke ci kuwa",
              "Shi taɓa leɓunan mu yau, Mu tuna da sama."
            ]
          },
          {
            verse: 4,
            text: [
              "Allah ne ƙarfinmu, Ya kuwa ba mu ceto",
              "Kristi ya nuna ƙaunarsa, Mun sami 'yantaswa."
            ]
          },
          {
            verse: 5,
            text: [
              "Tashi ku yabe shi ,Ku girmama Allah",
              "Tashi ku albarkace shi, Yau da har abada. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar tana kiran bayin Allah su tashi su yabe shi a cikin gidansa, bisa ga Zabura 134."
      },
      "HBH17": {
        title: "Yi Murna, Ku Masu Tsabtan Rai",
        number: "HBH17",
        author: "Edward H. Plumptre, 1821-1891",
        composer: "Arthur H. Messiter, 1834-1916",
        tune: "MARION",
        meter: "S.M. With Refrain",
        key: "G Major",
        scripture: "Zabura 33:1",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1865",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ku masu tsabtar rai, Ku shaida godiya",
              "Ku ɗaga tutar ku sama, Ga Yesu Sarkinku."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Ku yi murna, ku shaida godiya"
            ]
          },
          {
            verse: 2,
            text: [
              "Matasa, dattawa, Da mata, kuyangai",
              "Ku ta da muryar yabonsa, Allah abin yabo."
            ]
          },
          {
            verse: 3,
            text: [
              "Ku bi sawayensa, Da waƙoƙin yabo",
              "Da kuruciya, har tsufa, A kowane hali."
            ]
          },
          {
            verse: 4,
            text: [
              "Ku tsaya da ƙarfi, Da jajircewa fa",
              "Komai dai, jaruman yaƙi, Har ku yi nasara. AMIN"
            ]
          }
        ],
        history: "Waƙar Edward Plumptre tana ƙarfafa masu bi su yi murna da nuna godiya ga Allah, bisa ga Zabura 33:1."
      },
      "HBH18": {
        title: "Zo, Jama'a Yabi Allah",
        number: "HBH18",
        author: "Henry Smart, 1813-1879",
        composer: "Henry Smart, 1813-1879",
        tune: "REGENT SQUARE",
        meter: "8.7.8.7.8.7.",
        key: "C Major",
        scripture: "Zabura 67",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1867",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Zo, jama'a, yabi Allah, zo, Mu kawo waƙarmu,",
              "Yana wartsakad da ranmu, Yana kawo cetonmu",
              "Halleluya, Halleluya, Halleluya, amin."
            ]
          },
          {
            verse: 2,
            text: [
              "Domin jinƙai da alheri, Gafara da ƙauna ma",
              "Domin tausayi da haƙuri, Sai mu yi ta yabonsa",
              "Halleluya, Halleluya, Halleluya, amin."
            ]
          },
          {
            verse: 3,
            text: [
              "Kamar uba wurin 'ya'ya, Yana jin juyayinmu",
              "Yana bi da kafafunmu, Yana cin maƙiyanmu,",
              "Halleluya, Halleluya, Halleluya, Amin."
            ]
          },
          {
            verse: 4,
            text: [
              "Mala'iku, ku taimake mu, Cikin yin sujadarmu,",
              "Muna ganin fuska tasa, Sai mu yi biyayyanmu,",
              "Halleluya, halleluya, halleluya, Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo tana kiran dukan al'ummai su yabi Allah saboda jinƙansa da alherinsa, bisa ga Zabura 67."
      },
      "HBH19": {
        title: "Ga Mu Uba Da Wakarmu",
        number: "HBH19",
        author: "John Hatton, d. 1793",
        composer: "John Hatton, d. 1793",
        tune: "DUKE STREET",
        meter: "L.M",
        key: "D Major",
        scripture: "Zabura 95:1-6",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1793",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mu raira waƙa ga Kristi, Raina harshena yabe shi,",
              "Hosanna ga madawwami, Don ƙauna mara iyaka."
            ]
          },
          {
            verse: 2,
            text: [
              "Ga fuskar Yesu mai haske, Dubi hasken alherinsa,",
              "Allah cikin Ɗansa Yesu, Ya yi mana aikin ceto."
            ]
          },
          {
            verse: 3,
            text: [
              "Alherinsa mai daɗi ne, Sunansa na sa ni murna,",
              "Ya ku mala'iku Yabe shi, Ku bayyana shi ga duniya."
            ]
          },
          {
            verse: 4,
            text: [
              "Bari in je can wurinsa, A inda zan ga fuskarsa,",
              "Bari in ga, darajarsa, In raira yabo gare shi.AMIN."
            ]
          }
        ],
        history: "Waƙar tana kiranmu mu raira waƙa ga Kristi da kuma yin sujada ga madawwami, bisa ga Zabura 95:1-6."
      },
      "HBH20": {
        title: "Mu Yi Sujada Ga Ubangiji",
        number: "HBH20",
        author: "Robert Grant, 1779-1838",
        composer: "William Croft, 1678-1727",
        tune: "VERLYONS",
        meter: "10.10.11.11.",
        key: "G Major",
        scripture: "Zabura 104",
        theme: "SUJADA GABA DAYA: Daukaka da yabo",
        year: "1833",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mu yi sujada ga Ubangiji,",
              "Mu yi godiya domin ƙaunarsa,",
              "Mai tsaro garkuwarmu na nan tun farko",
              "Mai yawan ɗaukaka ya isa yabo"
            ]
          },
          {
            verse: 2,
            text: [
              "Furta girmansa, yabi jinƙansa,",
              "Ɗaukakarsa kwa, shi ne haskenmu,",
              "Karusan ƙarfinsa ba misalin sa,",
              "Kai ne garkuwata ko cikin duhu."
            ]
          },
          {
            verse: 3,
            text: [
              "Alherinka fa, Ba misali dai,",
              "Yana bayyana, Yana haskaka,",
              "Yana saukowa, A kan duniya duk,",
              "Albarkun Allahnmu suna saukowa."
            ]
          },
          {
            verse: 4,
            text: [
              "'Ya'yan halitu, duk da kasawa,",
              "Mun zo gare ka, mai yawan ƙauna,",
              "Jinƙanka mai yawa, baya karewa,",
              "Mai tsaron halitta, Mai Ceton duniya. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar Robert Grant tana yaba wa Allah a matsayin garkuwarmu da mai kiyaye dukan halitta, bisa ga Zabura 104."
      },
      "HBH21": {
        title: "Zo Mun Marabce Ki",
        number: "HBH21",
        author: "Friedrich Schneider, 1786-1853",
        composer: "Friedrich Schneider, 1786-1853",
        tune: "LISCHER",
        meter: "6.6.6.6.8.8.",
        key: "G Major",
        scripture: "Zabura 118:24",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1829",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mun marabce ki yau, Ya ke ranar hutu,",
              "Ina marabtar ki, Allah sa albarka,",
              "Tun daga wannan duniya,Zuwa madawwamin rai,",
              "Zuwa madawwamin rai."
            ]
          },
          {
            verse: 2,
            text: [
              "Zatinka shi sauko, Bisa kursiyinka,",
              "Sai ka mallake mu, Lokacin sujada,",
              "Ka iza masu zunubi, Su koya, su ji tsoronka,",
              "Su koya su ji tsoronka."
            ]
          },
          {
            verse: 3,
            text: [
              "Aiko da Ruhunka, Da dukan ikonka,",
              "Ka nuna ƙaunarka, Mu sami albarka,",
              "Raina shi saɓuntu, Kada mu yi hutun banza,",
              "Kada mu yi hutun banza. AMIN."
            ]
          }
        ],
        history: "Waƙar yabo ce ta safiyar ranar hutu (Lahadi), tana marabtar ranar Ubangiji da kuma neman albarkarsa, bisa ga Zabura 118:24."
      },
      "HBH22": {
        title: "Yesu Kai Ne Haskenmu",
        number: "HBH22",
        author: "Spanish Melody",
        composer: "Spanish Melody",
        tune: "SPANISH HYMN",
        meter: "7.7.7.7.7.7",
        key: "G Major",
        scripture: "Yohanna 8:12",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1824",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ɗaukakarka cikakkiya, Ka haskaka ko'ina,",
              "Cire dukan duhunmu, Haskenka ya haskaka",
              "Cikin dukan rayuwarmu, Yesu kai ne rabonmu."
            ]
          },
          {
            verse: 2,
            text: [
              "Safiyarmu banza ce, in ba ka tare da mu,",
              "Rayuwarmu banza ce, Sai tare da tausayinka",
              "Koya mana hanyarka, Don mu sami kwanciyar rai."
            ]
          },
          {
            verse: 3,
            text: [
              "Ziyarci zuciata, Share dukan laifina",
              "Ba ni tsabtar zuciya, Cire dukan shakkuna",
              "Shigo zuciata sosai,Don in bi tafarkinka.AMIN"
            ]
          }
        ],
        history: "Wannan waƙar tana nuna Yesu a matsayin hasken duniya wanda yake korar duhu daga rayuwar masu bi, bisa ga Yohanna 8:12."
      },
      "HBH23": {
        title: "Duk Wayewar Gari",
        number: "HBH23",
        author: "Joseph Barnby, 1838-1896",
        composer: "Joseph Barnby, 1838-1896",
        tune: "LAUDES",
        meter: "6.6.6.6.6.6.",
        key: "C Major",
        scripture: "Zabura 5:3",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1868",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Duk wayewar gari, Zuciyata na roƙo",
              "Yesu zan yabe ka, Cikin addu'a ta",
              "Na sami ƙarfi fa, Yesu zan yabe ka."
            ]
          },
          {
            verse: 2,
            text: [
              "Sa'anda dangogi, Na raira waƙa na raira",
              "Waƙa yabo, Saurari waƙarsu",
              "Ji amon waƙoƙin, Yesu zan yabe ka."
            ]
          },
          {
            verse: 3,
            text: [
              "Salama za ta zo, Sa'anda muka shaida",
              "Yesu zan yabe ka, Ikon duhu zai kau",
              "In muna yabonka, Yesu zan yabe ka."
            ]
          },
          {
            verse: 4,
            text: [
              "Wannan ƙauna ce fa, Murna har abada",
              "Yesu zan yabe ka, Bari duk dangogi",
              "Su ɓarke da waƙa, Yesu zan yabe ka. AMIN."
            ]
          }
        ],
        history: "Waƙar tana bayyana muryar mai bi da safe yana neman Allah da yabo, bisa ga Zabura 5:3."
      },
      "HBH24": {
        title: "Zan Dage Da Daukaka Ta",
        number: "HBH24",
        author: "Isaac Watts, 1674-1748",
        composer: "John Hatton, d. 1793",
        tune: "DUKE STREET",
        meter: "L.M",
        key: "D Major",
        scripture: "Zabura 145",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1719",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Zan dage da ɗaukaka ta, Zuwa ga mai iko duka",
              "Wanda ya cancanci yabo, Tushen hikima da ƙauna"
            ]
          },
          {
            verse: 2,
            text: [
              "Dubi yawan iliminsa, Inda hikima ke samuwa",
              "Ya san sunayen Taurar, Da dukan halittun sama."
            ]
          },
          {
            verse: 3,
            text: [
              "Kalmominsa da daraja, Ikonsa kan dubu dubu;",
              "Da iko kan iskar teku, Sun bayana hikimarsa."
            ]
          },
          {
            verse: 4,
            text: [
              "Dubi Alherin fansarka, Ta fi gaban misaltuwa,",
              "Domin hasken Hikimarka, Raina yabe shi da murna."
            ]
          }
        ],
        history: "Waƙar Isaac Watts ce tana yabon hikima da ikon Allah a cikin halitta da fansa, bisa ga Zabura 145."
      },
      "HBH25": {
        title: "Har Yanzu Tare Da Kai",
        number: "HBH25",
        author: "Harriet Beecher Stowe, 1811-1896",
        composer: "Felix Mendelssohn, 1809-1847",
        tune: "CONSOLATION",
        meter: "11.10.11.10.",
        key: "E Major",
        scripture: "Zabura 139:18",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1855",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Har yanzu tare da kai, da safen nan,",
              "Ya farka duhu ya gushe,",
              "Ta fi kowacce rana haske kuma,",
              "Ina sane yana tare da ni."
            ]
          },
          {
            verse: 2,
            text: [
              "Tare da kai a inuwa al'ajibi,",
              "Halitta ta zama sabuwa fa;",
              "Tare da kai ina ta yin yabonka,",
              "Da sanyin safiya da daɗare."
            ]
          },
          {
            verse: 3,
            text: [
              "Har yanzu tare da kai da safen nan,",
              "Mai daɗi mai kyau yana haskaka,",
              "Haka yana nan a cikin zuciya ta,",
              "Ina begen zuwa samaniyarka."
            ]
          },
          {
            verse: 4,
            text: [
              "A ƙarshe zai zama da safiya mai kyau",
              "Idan an farka, damuwa ta shuɗe,",
              "A sa'ar nan haske yana ɓullowa,",
              "Da sanin yana tare da ni fa."
            ]
          }
        ],
        history: "Wannan waƙar tana nuna kasancewar Allah tare da mai bi a kowane lokaci, musamman da safe, bisa ga Zabura 139:18."
      },
      "HBH26": {
        title: "Ya Raina Dage Da Murna",
        number: "HBH26",
        author: "Samuel Medley, 1738-1799",
        composer: "William Caldwell, 1800-1877",
        tune: "LOVING KINDNESS",
        meter: "L.M",
        key: "G Major",
        scripture: "Zabura 63:3",
        theme: "SUJADA GABA DAYA: Safiya",
        year: "1782",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya raina dage da murna, Raira yabo ga mai ceto,",
              "Yana jin daɗin yabona, Da dukan yawan ƙaunarsa,",
              "Yawan ƙauna, yawan ƙauna, Yawan ƙaunarsa da 'yanci."
            ]
          },
          {
            verse: 2,
            text: [
              "Cikin dukan kasawa ta, Ya ƙaunace ni haka nan,",
              "Ya cece ni daga damuwa, Yawan ƙaunarsa da girma,",
              "Yawan ƙauna, yawan ƙauna, Yawan ƙaunarsa da 'yanci."
            ]
          },
          {
            verse: 3,
            text: [
              "Cikin girman maƙetaci, Da duniya da lahira,",
              "Ya yi mani ƙariyarsa, Yawan ƙaunarsa da girma,",
              "Yawan ƙauna, yawan ƙauna, Yawan ƙaunarsa da girma."
            ]
          },
          {
            verse: 4,
            text: [
              "Kullum cikin zuciyata, Ina ganin kasawa ta,",
              "Duk da haka ya gafarta, Yawan ƙauna ba sakewa,",
              "Yawan ƙauna, yawan ƙauna, Yawan ƙaunarsa ba sakewa",
              "Amin."
            ]
          }
        ],
        history: "Waƙar tana bayyana yabo ga Mai Ceto saboda yawan ƙaunarsa da alherinsa, bisa ga Zabura 63:3."
      },
      "HBH27": {
        title: "Daukaka Zuwa Ga Mai Cetonmu",
        number: "HBH27",
        author: "John Ellerton, 1866",
        composer: "Edward J. Hopkins, 1818-1901",
        tune: "ELLERS",
        meter: "10.10.10.10.",
        key: "Ab Major",
        scripture: "Zabura 29:11",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1866",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Daukaka zuwa ga Mai Cetonmu,",
              "Mun zo da waƙoƙin zumuncinmu,",
              "Muna gabanka cikin sujada,",
              "Muna jiran kalmomin salama."
            ]
          },
          {
            verse: 2,
            text: [
              "Ba mu salamarka a hanyarmu,",
              "Kai ne yau, farkonmu da ƙarshenmu,",
              "Tsare mu daga dukan zunubi,",
              "Cikin masujadarka muke kira."
            ]
          },
          {
            verse: 3,
            text: [
              "Ka ba mu salamarka, da mareci,",
              "Mai da duhunmu zuwa haskenka,",
              "Tsare 'ya'yanka daga hatsari,",
              "Haske da duhu ɗaya ne gun ka."
            ]
          },
          {
            verse: 4,
            text: [
              "Ba mu salama cikin rayuwa,",
              "Kai ne warkaswar mu cikin ƙunci,",
              "Muryar ka ne ke kawo salama,",
              "Ja mu zuwa wurin salamarka. Amin."
            ]
          }
        ],
        history: ""
      },
      "HBH28": {
        title: "A Kan Kasa Da Ruwaye",
        number: "HBH28",
        author: "Samuel Longfellow, 1819-1892",
        composer: "Dimitri S. Bortniansky, 1751-1825",
        tune: "VESPER HYMN",
        meter: "8.7.8.7.8.6.7",
        key: "A Major",
        scripture: "Zabura 107:23-31",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1859",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "A kan ƙasa da ruwaye, Sauko da salamarka,",
              "Ka karɓi waƙar yabonmu, Da natsuwar tsarkaka,",
              "Sai murna fa, sai murna fa, Sai murna fa! Amin,",
              "Ka karɓi waƙar yabonmu, Da natsuwar tsarkaka."
            ]
          },
          {
            verse: 2,
            text: [
              "Ga maraici ya kusanto, Da hasken taurarin sama,",
              "Sun ba da wannan labarin, Ƙauna mara sakewa,",
              "Sai murna fa! sai murna fa! Sai murna fa! Amin.",
              "Sun ba da wannan labarin, Ƙauna mara sakewa."
            ]
          },
          {
            verse: 3,
            text: [
              "Son mu yanzu da matsala, Mun kai gun mai ƙaunarmu",
              "Da dukan sauran buƙatu, Mun bar su a sawunka,",
              "Sai murna! sai murna! Sai murna! Amin!",
              "Da dukan sauran buƙatu, Mun bar su a sawunka."
            ]
          },
          {
            verse: 4,
            text: [
              "Da duhu ya kewaye mu, Sai hasken ka ya ɓullo,",
              "Bege, ƙauna da ɗaukaka, Ruhun ka ya haskaka,",
              "Sai murna! Sai murna! Sai murna! Amin!",
              "Bege, ƙauna da ɗaukaka, Ruhunka ya haskaka.",
              "Amin."
            ]
          }
        ],
        history: "Waƙar tana neman salammar Allah a kan ƙasa da teku, tana nuna ikon Allah na kiyaye masu tafiya a kan ruwaye, bisa ga Zabura 107:23-31."
      },
      "HBH29": {
        title: "Ga Yinin Nan Na Wucewa",
        number: "HBH29",
        author: "Mary A. Lathbury, 1841-1913",
        composer: "William F. Sherwin, 1826-1888",
        tune: "CHAUTAUQUA",
        meter: "7.7.7.7.4. With Refrain",
        key: "Bb Major",
        scripture: "Ishaya 6:3",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1877",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ga yinin nan ya wuce, Lokacin hutu ya yi,",
              "Jira ka yi sujada, Kafin maraici ya yi,",
              "Da duhunsa"
            ]
          },
          {
            verse: "Korus",
            text: [
              "Tsarki Tsarki Tsarki Allah Uba!",
              "Sama da ƙasa kai ne Allah Uba! Amin."
            ]
          },
          {
            verse: 2,
            text: [
              "Kai ne Allahn rayuwa, Duniya ma taka ce,",
              "Tara mu da ke naka, Har ka kai mu wurinka,",
              "Muna kusa."
            ]
          },
          {
            verse: 3,
            text: [
              "Ga maraici fa ya yi, Da zuciya ta ƙauna",
              "Da yawan Alherinka, Da hasken na fuskarka",
              "Muna murna."
            ]
          },
          {
            verse: 4,
            text: [
              "Ga mu nan har abada, Duhun mu zai ƙare",
              "Kai Uba na mala'iku, Hasken ka shi Haskaka",
              "Babu duhu."
            ]
          }
        ],
        history: "Wannan waƙar yamma ce da take yabon tsarkin Allah yayin da rana take faɗuwa, bisa ga Ishaya 6:3."
      },
      "HBH30": {
        title: "Allah Mahalicin Kome",
        number: "HBH30",
        author: "Reginald Heber, 1783-1826",
        composer: "Welsh Traditional Melody",
        tune: "AR HYD Y NOS",
        meter: "8.4.8.4.8.8.8.4.",
        key: "G Major",
        scripture: "Zabura 121:4",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1827",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah mahaliccin kome, Duhu, haske;",
              "Bayan duk aikinmu, Mukan huta,",
              "Mala'ikunka su tsare mu, Lokacin da muna barci,",
              "Mafalkan ka masu tsarki, Cikin dare"
            ]
          },
          {
            verse: 2,
            text: [
              "Yayin da asuba ta yi, Don rayuwa,",
              "Ka ƙarfafa rayuwarmu, Don biyayya,",
              "Tsare mu daga miyagu, Da duk matsattsiyar hanya",
              "Kada ka hana mu murna, Koyaushe fa."
            ]
          },
          {
            verse: 3,
            text: [
              "Tsare mu a dukan yanayi, Ko mutuwa",
              "Bari mu ɓuya wurinka, Da salama",
              "Yayin da mun ji kiranka, Ya Allah kar ka yashe mu",
              "Karɓe mu cikin ɗaukaka, Mu je tare. Amin!"
            ]
          }
        ],
        history: "Waƙar tana roƙon kiyayewar Allah da mala'ikunsa lokacin barci, tana bayyana cewa Allah baya barci, bisa ga Zabura 121:4."
      },
      "HBH31": {
        title: "Uba Ba Mu Albarkarka",
        number: "HBH31",
        author: "John Fawcett, 1740-1817",
        composer: "Sicilian Melody",
        tune: "SICILIAN MARINERS' HYMN",
        meter: "8.7.8.7.8.7",
        key: "Eb Major",
        scripture: "Luka 24:50",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1773",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Uba ba mu albarkarka, Sa mana Albarkarka",
              "Bar mu mallaki ƙaunarka, Domin mu yi Nasara",
              "Uba ka saɓunta mu, Cikin wannan tafiyarmu"
            ]
          },
          {
            verse: 2,
            text: [
              "Mun zo gun ka da godiya, Don ceton mu da ka yi;",
              "Bari 'ya'yan Ruhaniya, Su kasance ta wurinmu",
              "Da aminci, da aminci, Cikin dukan gaskiya"
            ]
          },
          {
            verse: 3,
            text: [
              "Duk lokacin da ka kira, Don mu bar wannan",
              "duniya Ka ƙarfafa zuciyarmu, Da za mu yi biyayya",
              "Da aminci da aminci, Mu dawwama har abada.",
              "Amin."
            ]
          }
        ],
        history: "Waƙar John Fawcett tana neman albarkar Allah yayin rabuwa ko kammala sujada, bisa ga Luka 24:50."
      },
      "HBH32": {
        title: "Rayuwar Wannan Duniya",
        number: "HBH32",
        author: "Godfrey Thring, 1823-1903",
        composer: "Charles F. Gounod, 1818-1893",
        tune: "THE RADIANT MORN",
        meter: "8.8.8.4.",
        key: "C Major",
        scripture: "Zabura 90:10-12",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1864",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Rayuwar wannan duniya, Na wucewa kamar iska,",
              "Tafiya kamar inuwa, Har ta iso."
            ]
          },
          {
            verse: 2,
            text: [
              "Ranmu kamar rana yake, Farat ɗaya ga maraici,",
              "Ya Yesu, ka tallafe mu, Mu kai gida."
            ]
          },
          {
            verse: 3,
            text: [
              "Bishe mu da Alherinka, Ka fifita rayukanmu,",
              "Don mu ga gidan daraja, Da ke sama."
            ]
          },
          {
            verse: 4,
            text: [
              "Da tsarkaka sun bayyana, Ba sauran duhun maraici,",
              "Sai haske na har abada, Wurin Allah. Amin."
            ]
          }
        ],
        history: "Waƙar tana nuna yadda rayuwar duniya take wucewa da sauri kuma tana roƙon Yesu ya bishe mu zuwa gidan daraja, bisa ga Zabura 90:10-12."
      },
      "HBH33": {
        title: "Haske Yana Shudewa",
        number: "HBH33",
        author: "George W. Doane, 1799-1859",
        composer: "Carl M. von Weber, 1786-1826",
        tune: "SEYMOUR",
        meter: "7.7.7.7",
        key: "Eb Major",
        scripture: "Zabura 141:2",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1824",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Haske yana shuɗewa, Nesa da idanunmu,",
              "Hutu daga aikinmu, Mu yi zumunci da Kai!"
            ]
          },
          {
            verse: 2,
            text: [
              "Ba abin da ke ɓoye, Da Allah ba ya gani,",
              "Gafarta zunubanmu, Na ɓoye da na fili!"
            ]
          },
          {
            verse: 3,
            text: [
              "Kwanaki na wucewa, Ba kwa za su dawo ba;",
              "'Yantaswarka muke so, Har ka kai mu wurin ka!",
              "Amin."
            ]
          }
        ],
        history: "Waƙar yamma ce da take roƙon zumunci da Allah da gafara yayin da rana take shuɗewa, bisa ga Zabura 141:2."
      },
      "HBH34": {
        title: "Uba Sa Mana Albarka",
        number: "HBH34",
        author: "James Edmeston, 1791-1867",
        composer: "George C. Stebbins, 1846-1945",
        tune: "EVENING PRAYER",
        meter: "8.7.8.7.",
        key: "A Major",
        scripture: "Zabura 4:8",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1820",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Uba sa mana albarka, Don kada mu raunana,",
              "Mun zo gabanka don tuba, Don kai ne mai fansarmu."
            ]
          },
          {
            verse: 2,
            text: [
              "Miyagu sun kewaye mu, Domin su hallaka mu,",
              "Ikonka ne ke tsare mu, Kai ne mai 'yantas da mu."
            ]
          },
          {
            verse: 3,
            text: [
              "Kome yawan damuwarmu, Ba su gagare ka ba,",
              "Ba ka barci ko gyangyaɗi, Kai ne mai tsaron mu duk."
            ]
          },
          {
            verse: 4,
            text: [
              "In mutuwa ta zo mana, Muna cikin kabari,",
              "Ka karɓe mu can wurinka, Kamar dai mala'iku. Amin."
            ]
          }
        ],
        history: "Waƙar tana nuna amincewa ga kiyayewar Allah da daddare, tana bayyana cewa Allah baya barci ko gyangyaɗi, bisa ga Zabura 4:8."
      },
      "HBH35": {
        title: "Yinin Nan Ya Wuce",
        number: "HBH35",
        author: "Sabine Baring-Gould, 1834-1924",
        composer: "Joseph Barnby, 1838-1896",
        tune: "MERRIAL",
        meter: "6.5.6.5.",
        key: "F Major",
        scripture: "Karin Magana 3:24",
        theme: "SUJADA GABA DAYA: Yamma",
        year: "1865",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yinin nan ya wuce, Dare yana yi,",
              "Babu sauran haske, Duhu yana yi."
            ]
          },
          {
            verse: 2,
            text: [
              "Dubi masu ciwo, Rage zafinsu,",
              "Da duk albarkanka, Ba ni hutunka."
            ]
          },
          {
            verse: 3,
            text: [
              "Tsare mu da dare, Inuwantad da mu,",
              "Ta dalilin barci, Ba mu ƙarfinka."
            ]
          },
          {
            verse: 4,
            text: [
              "In gari ya waye, Bari in tashi,",
              "Ka watsakad da mu, Gaban fuskarka. AMIN."
            ]
          }
        ],
        history: "Waƙar yamma ce mai sauƙi da take roƙon kariya ga masu ciwo da hutu ga dukan masu bi, bisa ga Karin Magana 3:24."
      },
      "HBH36": {
        title: "Yau Ranar Farin Ciki Ce",
        number: "HBH36",
        author: "Christopher Wordsworth, 1807-1885",
        composer: "German Melody",
        tune: "MENDDEBRAS",
        meter: "7.6.7.6.D",
        key: "F Major",
        scripture: "Zabura 118:24",
        theme: "SUJADA GABA DAYA: Rana ta Ubangiji",
        year: "1862",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yau ranar farin ciki, Rana ce ta murna",
              "Rana ce ta watsakarwa, Kyakkyawar rana ce",
              "Da manya da yara duk, Da kowane tsara,",
              "Ce Tsarki, Tsarki, Tsarki, Ga Allah mai girma."
            ]
          },
          {
            verse: 2,
            text: [
              "Gun ka cikin halitta, Aka yi haske",
              "Gun ka ta wurin ceto, Yesu fa ya tashi;",
              "Gun ka mun yi nasara, Ka aiko da Ruhunka,",
              "Ya shigo da ɗaukaka, Ka ba mu haskenka."
            ]
          },
          {
            verse: 3,
            text: [
              "Yau ƙasashe ƙasassu, Ka bada gurasarka;",
              "Domin a yi liyafa, Da an busa ƙaho,",
              "Da hasken bishararka, Yana haskakawa",
              "Ga maɓulɓulan ruwa, Rayuka sun huta."
            ]
          },
          {
            verse: 4,
            text: [
              "Saɓuntuwar Alheri, Domin ranar hutu",
              "Har da sauran ranaku, Da ruhun tsarkaka",
              "Yau mun ba ka yabonmu, Ɗaya cikin uku:",
              "Ga ikilisiyarka yau, Mun albarkace ka. AMIN!"
            ]
          }
        ],
        history: "Waƙar Christopher Wordsworth tana murnar ranar Lahadi a matsayin ranar da Yesu ya tashi daga matattu da kuma ranar sujada, bisa ga Zabura 118:24."
      },
      "HBH37": {
        title: "Ga Wani Mako Ya Zo",
        number: "HBH37",
        author: "John Newton, 1725-1807",
        composer: "Lowell Mason, 1792-1872",
        tune: "SABBATH",
        meter: "7.7.7.7.D.",
        key: "F Major",
        scripture: "Fitowa 20:8",
        theme: "SUJADA GABA DAYA: Rana ta Ubangiji",
        year: "1774",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ga wani mako ya zo, Allah fa ya kawo mu,",
              "Mu nemi albarkarsa, Ga mu nan kan dakali;",
              "Rana ce mai albarka, Alama ta dawwama:",
              "Rana ce mai albarka, Alama na dawwama."
            ]
          },
          {
            verse: 2,
            text: [
              "Alherinka mun biɗa, Don albarkar sunanka.",
              "Nuna mana fuskarka, Kau da duk zunuban mu,",
              "Sai ka 'yantas da mu yau, Muna neman hutunka",
              "Sai ka 'yantas da mu yau, Muna neman hutunka."
            ]
          },
          {
            verse: 3,
            text: [
              "Muna yabon sunanka, Bar mu ga darajarka",
              "Da kuma ɗaukakar ka, Yayin da mun zo gun ka",
              "Ka bar mu mu ɗanɗana, Cima ta ruhaniya:",
              "Ka bar mu mu ɗanɗana, Cima ta ruhaniya."
            ]
          }
        ],
        history: "Waƙar John Newton tana marabtar sabon mako da kuma ranar hutu, tana neman albarkar Allah a kan dakalinsa, bisa ga Fitowa 20:8."
      },
      "HBH38": {
        title: "Da Murna Yau, Mun Girmama Allah",
        number: "HBH38",
        author: "Unknown",
        composer: "William B. Bradbury, 1816-1868",
        tune: "BROWN",
        meter: "C.M.",
        key: "C Major",
        scripture: "Zabura 118:24",
        theme: "SUJADA GABA DAYA: Rana ta Ubangiji",
        year: "",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Da murna yau, mun girmama, Allah Don ranarsa,",
              "Da murna mun karɓi kira, Don yi masa sujada."
            ]
          },
          {
            verse: 2,
            text: [
              "Ruhun alheri zauna da, Ikilisiya a nan,",
              "Don ta yi zama da tsarki, Tana maka sujada."
            ]
          },
          {
            verse: 3,
            text: [
              "Bari mu kasance da salama, mu zama ɗaya,",
              "Mu furta ko'ina hasken, Ta mai haskakawa"
            ]
          },
          {
            verse: 4,
            text: [
              "Allah mai girma mun yabe, Ka don ranar ka,",
              "Da murna mun karɓi kira, Don yi maka sujada.",
              "Amin."
            ]
          }
        ],
        history: ""
      },
      "HBH39": {
        title: "Yau Ce Ranar Da Allah Yayi",
        number: "HBH39",
        author: "Isaac Watts, 1674-1748",
        composer: "Thomas A. Arne, 1710-1778",
        tune: "ARLINGTON",
        meter: "C.M.",
        key: "G Major",
        scripture: "Zabura 118:24",
        theme: "SUJADA GABA DAYA: Rana ta Ubangiji",
        year: "1719",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yau ranar da Allah ya yi, Lokaci nasa ne,",
              "Yi murna sammai, da ƙassai, Mu yabi mulkinsa"
            ]
          },
          {
            verse: 2,
            text: [
              "Ya tashi daga matattu, Mulkin Shaiɗan ya rushe.",
              "Mu yi shelar nasararsa, Mu shaida ikonsa."
            ]
          },
          {
            verse: 3,
            text: [
              "Hossana ga Ubangiji, Dan Dauda Mai Tsarki",
              "Taimake mu, ba mu ceto, Daga kursiyinka"
            ]
          },
          {
            verse: 4,
            text: [
              "Albarka ga Ubangiji, Don saƙon alheri,",
              "Ya zo cikin sunan Uban, Don ceton duniya. AMIN."
            ]
          }
        ],
        history: "Waƙar Isaac Watts tana murnar nasarar Yesu a kan mutuwa da Shaiɗan, tana kiran dukan halitta su yaba masa, bisa ga Zabura 118:24."
      },
      "HBH40": {
        title: "Allahnmu Majingina Ne",
        number: "HBH40",
        author: "Martin Luther, 1483-1546",
        composer: "Martin Luther, 1483-1546",
        tune: "EIN FESTE BURG",
        meter: "8.7.8.7.6.6.6.6.7",
        key: "C Major",
        scripture: "Zabura 46",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "1529",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allahnmu majingina ne, Kuma ba ya kasawa;",
              "Mai taimako ne koyaushe, Yana ba mu nasara;",
              "Kome matsalar mu, Yana jagorar mu,",
              "Aikin sa da girma, Koyaushe a shirye",
              "Duniya babu kamarsa"
            ]
          },
          {
            verse: 2,
            text: [
              "Ko mu cikin ƙarfinmu ne? Da kuma mun kasa",
              "Shi yana tare da mu, Shi zaɓaɓɓe na Allah",
              "Wane ne shi wannan? Shi ne Yesu Kristi;",
              "Ubangiji ne shi, Shi da ba ya sakewa",
              "Nasara kwa tasa ce."
            ]
          },
          {
            verse: 3,
            text: [
              "Dukan jarabobin duniya, Suna neman raba mu",
              "Ya shirya mu don nasara, Gaskiyarsa na cikinmu;",
              "Shaiɗan da ƙarfinsa, Ba ma jin tsoro ba;",
              "Don uban na da mu, Duk ƙarfin magabci",
              "Da kalma ɗaya zai faɗi"
            ]
          },
          {
            verse: 4,
            text: [
              "Kalmar sa tana da iko, Duk masu bada gaskiya;",
              "Baiwar ruhunsa namu ne, Shi da ke zaune da mu,",
              "Bari mu nace bin sa, Cikin wannan jiki,",
              "Ko da sun kashe mu, Gaskiyarsa na da mu,",
              "Mulkinsa har abada. Amin."
            ]
          }
        ],
        history: ""
      },
      "HBH41": {
        title: "Alhamdu Ga Allah Don Dansa Yesu",
        number: "HBH41",
        author: "Fanny J. Crosby, 1820-1915",
        composer: "William H. Doane, 1832-1915",
        tune: "TO GOD BE THE GLORY",
        meter: "11. 11. 11. 11. With Refrain",
        key: "Ab Major",
        scripture: "Galatiyawa 1:5",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "1875",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Alhamdu ga Allah don Dansa, Yesu,",
              "Ya ba da jininsa domin fansarmu,",
              "Amma dai ya tashi, ya koma sammai,",
              "Yakan ba da Ruhu, da yawan kyautai,"
            ]
          },
          {
            verse: "Korus",
            text: [
              "Yabe shi! Yabe shi! Duniya duk ta ji shi",
              "Yabe shi! Yabe shi, duniya ta yi murna",
              "Ku zo wurin Uban ta Yesu Ɗansa",
              "Mu ba shi ɗaukaka don ayyukansa"
            ]
          },
          {
            verse: 2,
            text: [
              "Ya ceto cikakke, kyautar Allahnmu,",
              "Kowane mai tuba, mai ba da gaskiya,",
              "Kowane mai laifi, kome laifinsa,",
              "In ya zo gun Yesu zai sami gafara,"
            ]
          },
          {
            verse: 3,
            text: [
              "Ayyukan da ya yi, ya koya mana,",
              "Za mu yi ta murna ta wurin Yesu,",
              "Za ya tsabtace mu sosai da sosai,",
              "Sa'ad da ya fyauce mu zuwa gun sa. Amin."
            ]
          }
        ],
        history: "Waƙar Fanny J. Crosby tana ba Allah ɗaukaka saboda babban aikin ceto da ya yi ta wurin Ɗansa Yesu Kristi, bisa ga Galatiyawa 1:5."
      },
      "HBH42": {
        title: "Allahmu Mai Iko",
        number: "HBH42",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "RUSSIAN HYMN",
        meter: "11. 10. 11 .9.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allahnmu mai iko cikin shirinsa,",
              "Shari'a da yunwa ko takobi,",
              "Ko cikin yaki ma kai kana mulki,",
              "Ka ba mu salama ya Allah."
            ]
          },
          {
            verse: 2,
            text: [
              "Allah da tausayin duniya yake,",
              "Hanyar albarka ce maganarka,",
              "Kada ka hallaka mu da fushinka,",
              "Ka ba mu salama ya Allah."
            ]
          },
          {
            verse: 3,
            text: [
              "Allah mai tsarki mutane sun kasa,",
              "Duk da haka, kalmarka har abada,",
              "A gare ka babu rashin adalci,",
              "Ka ba mu salama ya Allah. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar tana nuna ikon Allah a cikin shari'a da mulki, tana roƙon salama ga duniya, bisa ga ikon Allah na madawwami."
      },
      "HBH43": {
        title: "Allah Madawwami",
        number: "HBH43",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "JOANNA",
        meter: "11.11.11.11.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah madawwami mai hikima ne,",
              "Kodashike iko ba ya mulkinsa,",
              "Mai albarka, mai daraja tun farko,",
              "Mai iko duka mun yabi sunanka."
            ]
          },
          {
            verse: 2,
            text: [
              "Mai aiki da kamewa kamar haske,",
              "Da cikakkiyar natsuwa kake mulki,",
              "Adalcinka kwa ba shi misaltuwa,",
              "Tushen kauna da jinkai wurin ka ne."
            ]
          },
          {
            verse: 3,
            text: [
              "Ka ba da rai ga manya da kanana,",
              "Kana rayuwar gaskiya cikin kowa,",
              "Muna huda kamar fure kan icce.",
              "A kowane hali ba ka sakewa,"
            ]
          },
          {
            verse: 4,
            text: [
              "Kai ne Uba mai cikakkiyar daukaka,",
              "Kullum mala'iku na yabon sunanka,",
              "Taimake mu mu daukaka sunanka,",
              "Haskenka ne ya hana mu ganin ka. AMIN"
            ]
          }
        ],
        history: "Waƙar tana yabon hikima da daukakar Allah madawwami, wanda haskensa ya mamaye kowace halitta, bisa ga daukakar sunansa."
      },
      "HBH44": {
        title: "Murna Murna, Muna Yabo",
        number: "HBH44",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "HYMN TO JOY",
        meter: "8.7.8.6.D.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Murna murna, muna kauna, Domin kai mai kauna ne;",
              "Zukatanmu na naduwa, Kamar fure da rana,",
              "Dauke mana zunubanmu, Kau da shakka cikin mu,",
              "Rai madawwami naka ne, Cika mu da haskenka."
            ]
          },
          {
            verse: 2,
            text: [
              "Aikinka sun kewaye ka, Kai ka halicci komai,",
              "Mala'iku ma na yabonka, Kullum babu fasawa,",
              "Da sarari da tuddai duk, Furanni ma da ruwaye,",
              "Tsuntsaye ma na yabonka, Suna kuwa yabonka."
            ]
          },
          {
            verse: 3,
            text: [
              "Kana bayar da gafara, Kana bayar da yalwa,",
              "Tushen murna gun ka yake, Gun ka ne farin ciki",
              "Kai ne Uba da Mai Ceto, Masu kauna naka ne,",
              "Koya mana mu yi kauna, Har da za mu kai gun ka"
            ]
          },
          {
            verse: 4,
            text: [
              "Mu duka mu zo da yabo, Da asuba ta yi dai,",
              "Domin kaunarka gare mu fa, Kaunarka ta hada mu,",
              "Rairawa babu fasawa, Nasara da tsanani,",
              "Wakokin murna muke yi, Wakokin nasara ne.",
              "Amin."
            ]
          }
        ],
        history: "Wannan waƙar yabo tana kiran masu bi su yi murna da ƙauna saboda halitta da alherin Allah, bisa ga murnar Ubangiji."
      },
      "HBH45": {
        title: "Allah Da Ya Kawata Mu",
        number: "HBH45",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "GENEVA",
        meter: "8.5.8.5.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah da ya kawata mu, Ba ni kaunarka",
              "Ka sabunta mani Ruhu, Ba ni sabon rai"
            ]
          },
          {
            verse: 2,
            text: [
              "Kamar magudanar ruwa, Ka tsabtace ni;",
              "Karfafa ni dutse, Ba ni karfinka."
            ]
          },
          {
            verse: 3,
            text: [
              "Kamar haskenka na rana, Ba ni 'yancinka,",
              "In tsaya babu jiguwa, Har zuwa karshe"
            ]
          },
          {
            verse: 4,
            text: [
              "Kamar yadda yake sama, In tuna da kai,",
              "Maida mafalkaina gaskiya, Hidimar kauna"
            ]
          },
          {
            verse: 5,
            text: [
              "Allah ya ba mu daraja, Ba ni kaunarka,",
              "Ka tsare ni da Ruhunka, Cikin tsarkinka. Amin."
            ]
          }
        ],
        history: "Waƙar tana roƙon sabuntawa da ƙarfi daga wurin Allah wanda ya ƙawata halitta, tana neman 'yanci da tsarki."
      },
      "HBH46": {
        title: "Uba Na Mika Hannuna",
        number: "HBH46",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. AGNES",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Daukaka da Ikon Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Uba na mika hannuna, Ba wata bukata,",
              "In ba ka taimake ni ba, Babu wurin zuwa"
            ]
          },
          {
            verse: 2,
            text: [
              "Jimrewa na haifaffenka, Kamin ranar karshe!",
              "Ka tsare ni daga dukan, Zafin mutuwa fa."
            ]
          },
          {
            verse: 3,
            text: [
              "Mun zo gun Uban bangaskiya, Dukan begena fa,",
              "Bari in karbi kyautar ka! Banda kai ba ni nan.",
              "Amin."
            ]
          }
        ],
        history: "Waƙar tana bayyana cikakkiyar dogara ga Allah, tana mika dukan buƙatu ga Uban bangaskiya don samun taimako."
      },
      "HBH47": {
        title: "Amincinka Allah Mai Girma Ne",
        number: "HBH47",
        author: "Thomas O. Chisholm, 1866-1960",
        composer: "William M. Runyan, 1870-1957",
        tune: "FAITHFULNESS",
        meter: "11.10.11.10. with Refrain",
        key: "Eb Major",
        scripture: "Makokin Irmiya 3:22-23",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "1923",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Amincinka Allah babu misali,",
              "Ba sakewa gare ka ya Allah,",
              "Jinkanka fa yana nan kullayomi,",
              "Tun fil'azar kai ne har abada."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Amincinka Allah, babu misalinsa,",
              "Yana bishe ni kowace sa'a,",
              "Yana biya mini duk bukatuna,",
              "Amincinka gare ni da girma."
            ]
          },
          {
            verse: 2,
            text: [
              "Lokacin shuka da lokacin girbi,",
              "Duk halittu na shaida girmanka,",
              "Suna yabo suna ba ka daukaka,",
              "Don amincin jinkai da kaunarka."
            ]
          },
          {
            verse: 3,
            text: [
              "Gafarar zunubai da salamarka,",
              "Kasancewarka tare da mu duk,",
              "Kai ne karfina yau, da har abada,",
              "Albarkuna ba su da iyaka. AMIN"
            ]
          }
        ],
        history: "Wannan shahararriyar waƙar Thomas Chisholm tana murnar amincin Allah wanda ba ya sakewa, bisa ga Makokin Irmiya 3:22-23."
      },
      "HBH48": {
        title: "Jinkan Allah Da Girma Ne",
        number: "HBH48",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "WELLESLEY",
        meter: "8.7.8.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Jinkan Allah da girma ne, Na kamar fadin Teku;",
              "Adalcinsa na da kirki, Wanda har ya fi 'yanci"
            ]
          },
          {
            verse: 2,
            text: [
              "Mai zunubi na karbuwa, Da alheri don kirki;",
              "Akwai jinkai wurin Yesu, Jininsa da warkaswa."
            ]
          },
          {
            verse: 3,
            text: [
              "Kaunarsa da fadi take, Ta fi gaban misali;",
              "Har da madawwamin rai, Da ayyukan girmansa."
            ]
          },
          {
            verse: 4,
            text: [
              "In kaunarmu na da sauki, Mu yi masa biyayya;",
              "Rayuwarmu za ta haskaka, Don murnar Ubangiji.",
              "Amin."
            ]
          }
        ],
        history: "Waƙar tana kwatanta jinƙan Allah da faɗin teku, tana nuna alheri da ƙauna ga masu zunubi ta wurin Yesu."
      },
      "HBH49": {
        title: "Ka Raira Waka Harshena",
        number: "HBH49",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "MANOAH",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ka raira waka harshena, Ka shaida girmansa;",
              "Zan bayyana Ayyukansa, Don shi ne sarkinmu."
            ]
          },
          {
            verse: 2,
            text: [
              "Zan bayyana amincinsa, Da kuma girmansa,",
              "Raira yawan Alherinsa, Domin shi ne Allah."
            ]
          },
          {
            verse: 3,
            text: [
              "Don aikinsa na alheri, Ya halicci sammai,",
              "Muryarsa na juya komai, Daga mazauninsa."
            ]
          },
          {
            verse: 4,
            text: [
              "Ka bar ni in ji muryarka, Ka kira ni gun ka,",
              "Don kai ne wakata, Har in bi nufinka. AMIN."
            ]
          }
        ],
        history: "Waƙar tana kiran harshen mai bi ya yaba wa Allah saboda amincinsa da ayyukansa na alheri a cikin halitta."
      },
      "HBH50": {
        title: "Allah Kauna Ne",
        number: "HBH50",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "STUTTGART",
        meter: "8.7.8.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah kauna ne, da jinkai, Ya nuna mana hanya,",
              "Ya saukaka mana hanya, Don hikimar kaunarsa."
            ]
          },
          {
            verse: 2,
            text: [
              "Zarafin canji nasa ne, Cikin kasawarmu,",
              "Alherinsa bai kasa ba, Don hikimar kaunarsa."
            ]
          },
          {
            verse: 3,
            text: [
              "Ko cikin duhun tsanani, Kirkin sa zai bi ni,",
              "Shi zai haskaka hanyata, Don hikimar kaunarsa."
            ]
          },
          {
            verse: 4,
            text: [
              "Dukan damuwoyin duniya, Karfina daga sama,",
              "Daukakarsa an haskaka, Don hikimar kaunarsa.",
              "Amin."
            ]
          }
        ],
        history: "Wannan waƙar tana jaddada cewa Allah ƙauna ne kuma yana haskaka hanyar masu bi da hikimar ƙaunarsa ko da cikin tsanani."
      },
      "HBH51": {
        title: "Ya Raina Ka Yabi Allah",
        number: "HBH51",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "STUTTGART",
        meter: "8.7.8.7",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ya raina ka yabi Allah, Yabe shi da karfina,",
              "Kada in manta da dukan, Ayyukan sa da ya yi."
            ]
          },
          {
            verse: 2,
            text: [
              "Shi ya gafarta laifinka, Ya warkar da cutarka,",
              "Ya 'yantas daga hallaka, Ya yi maka alheri."
            ]
          },
          {
            verse: 3,
            text: [
              "Duk nisan gabas da yamma, Ya kawas da laifinmu,",
              "Kamar juyayi na uba, Haka ne juyayinsa."
            ]
          },
          {
            verse: 4,
            text: [
              "Ya ku halittu yabe shi, Don shi ne mai mulkinmu,",
              "Duk fadin wannan duniya, Ku yabi Ubangiji. Amin."
            ]
          }
        ],
        history: "Waƙar tana kiran rai ya yaba wa Allah saboda gafarar laifuffuka, warkarwa, da kuma juyayin uba da yake nuna mana."
      },
      "HBH52": {
        title: "Kaunarsa Cikakkiya",
        number: "HBH52",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRENTHAM",
        meter: "S.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Alheri da Kauna Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Kaunarsa cikakkiya, Kaunarsa 'yanci ne,",
              "Zo iza ni, zo, cika ni, Zo kai ni wurinka."
            ]
          },
          {
            verse: 2,
            text: [
              "Ka zo ka tsima ni, Haska ni da kauna;",
              "Ka rufe ni da kulawa, Ya ja ni wurinka."
            ]
          },
          {
            verse: 3,
            text: [
              "Teku ma ta lafa, Yanzu babu tsoro,",
              "Ka maida duhuna haske, Domin yawan kauna."
            ]
          },
          {
            verse: 4,
            text: [
              "Kaunarsa cikakkiya, Kaunarsa 'yanci ne,",
              "Ka iza ni ka cika ni, Kai ka karfafa ni. AMIN."
            ]
          }
        ],
        history: "Waƙar tana bayyana ƙaunarsar Allah a matsayin 'yanci da haske wanda yake korar tsoro da duhu daga zuciyar mai bi."
      },
      "HBH53": {
        title: "Allah Na Yin Mu'ujizai",
        number: "HBH53",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. ANNE",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allah na yin mu'ujizai, Mai ban mamaki,",
              "Sawunsa na kan ruwaye, Yana iko da su."
            ]
          },
          {
            verse: 2,
            text: [
              "Ku tsarkaka ku karfafa, Ko me matsalarku,",
              "Domin jinkansa yana nan, Zai ba ku albarku.."
            ]
          },
          {
            verse: 3,
            text: [
              "Hikimar ku duk banza ce, Ku yarda da Allah,",
              "Zai ba ku duk a yalwace, Shi mai adalci ne."
            ]
          },
          {
            verse: 4,
            text: [
              "Rashin bangaskiya wauta ce, Zai hana albarka,",
              "Shi ke wa kansa fassara, Zai bayyana kome. Amin."
            ]
          }
        ],
        history: "Waƙar tana yabon ikon Allah na yin mu'ujizai da kiyaye masu bi, tana ƙarfafa masu bangaskiya su dogara ga hikimarsa."
      },
      "HBH54": {
        title: "Allahn Da Ya Bi Da Ubaninmu",
        number: "HBH54",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "NATIONAL HYMN",
        meter: "10.10.10.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Allahn da ya bi da ubanninmu,",
              "Sai ka kare mu da kariyarka,",
              "Ka haskaka mu da darajarka,",
              "Za mu raira gaban kursiyinka."
            ]
          },
          {
            verse: 2,
            text: [
              "Kaunarka ce ta jagorance mu,",
              "Kai mun zaba a wannan duniya,",
              "Ka zama mai mulkin rayuwarmu,",
              "Kalmarka ta zama garkuwarmu."
            ]
          },
          {
            verse: 3,
            text: [
              "Daga yake-yake na duniya,",
              "Kai ne madogarar mu mai karfi,",
              "Don bangaskiyarmu ta karfafa,",
              "Kirkinka zai gina jikunanmu."
            ]
          },
          {
            verse: 4,
            text: [
              "Ka sabunta karfin mutanenka,",
              "Ka bishe mu a kowace rana,",
              "Cika rayukanmu da kaunarka,",
              "Daukaka da kauna duk naka ne. AMIN."
            ]
          }
        ],
        history: "Waƙar tana neman jagorar Allah da kariyarsa, tana tunawa da yadda ya bi da iyayenmu da kuma neman mulkinsa a rayuwarmu."
      },
      "HBH55": {
        title: "Ka Bishe Ni Ya Jehovah",
        number: "HBH55",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "CWM RHONDDA",
        meter: "8.7.8.7.8.7.7",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ka bishe ni ya Jehovah, Ni bako ne a duniyar nan,",
              "Ni rarrauna, kai mai iko, Rike ni da hannunka,",
              "Ka cishe ni, ka cishe ni, Da gurasan nan mai rai,",
              "Da gurasan nan mai rai."
            ]
          },
          {
            verse: 2,
            text: [
              "Bude mini ya Mai Ceto, Mabulbular warkaswa,",
              "Ka bishe ni da ikonka, Har a kai ni a wurinka",
              "Taimakona, taimakona, Kai ka zama karfina,",
              "Kai ka zama karfina."
            ]
          },
          {
            verse: 3,
            text: [
              "In na taka kwarin mutuwa, Kau da dukan tsorona,",
              "Tokare ni da hannun ka, Kai ni can a gidan ka,",
              "Wakar yabo, wakar yabo, Taka ce har abada,",
              "Taka ce har abada. AMIN."
            ]
          }
        ],
        history: ""
      },
      "HBH56": {
        title: "Ka Bishe Ni Ya Jehovah",
        number: "HBH56",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ZION",
        meter: "8.7.8.7.4.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ka bishe ni ya Jehovah, Ni bako ne a duniyar nan,",
              "Ni rarrauna, kai mai iko, Rike ni da hannunka,",
              "Ka cishe ni, Da gurasan nan mai rai,",
              "Ka cishe ni, Da gurasan nan mai rai."
            ]
          },
          {
            verse: 2,
            text: [
              "Bude mini ya Mai Ceto, Mabulbular warkaswa,",
              "Ka bishe ni da ikonka, Har a kai ni a wurinka,",
              "Taimakona, Kai ka zama karfina,",
              "Taimakona, kai ka zama karfina."
            ]
          },
          {
            verse: 3,
            text: [
              "In na taka kwarin mutuwa, Kau da dukan tsorona,",
              "Tokare ni da hannunka, Kai ni can a gidanka,",
              "Wakar yabo, Taka ce har abada,",
              "Wakar yabo, Taka ce har abada. Amin."
            ]
          }
        ],
        history: "Wannan waƙar addu'a ce ta neman jagoran Allah a matsayinmu na baƙi a wannan duniya, tana dogara ga ikon Allah da kuma ciyarwarsa ta ruhaniya, bisa ga Fitowa 13:21."
      },
      "HBH57": {
        title: "Ubangijinmu Makiyayina Ne",
        number: "HBH57",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "POLAND",
        meter: "11.11.11.11.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ubangijinmu makiyayina ne,",
              "Ya ciyad da ni a danyar ciyawa,",
              "Nakan sha a magudanan ruwaye,",
              "Yakan mayas da ni, ya kuma 'yantas,",
              "Yakan mayas da ni ya kuma 'yantas."
            ]
          },
          {
            verse: 2,
            text: [
              "Ko ina bi ta kwarin mutuwa ma,",
              "Ba zan ji tsaron kowace masifa,",
              "Domin sandarka tana kiyaye ni,",
              "Kana kare ni daga abin cutaswa,",
              "Kana kare ni daga abin cutaswa."
            ]
          },
          {
            verse: 3,
            text: [
              "Ko cikin matsala ka shirya mani,",
              "Teburi da kokon da yana zuba,",
              "Kana shafe kaina da man nan naka,",
              "To mene ne zan sake nema kuma,",
              "To mene ne zan sake nema kuma."
            ]
          },
          {
            verse: 4,
            text: [
              "Kirki da jinkanka su kewaye ni,",
              "Kana tafiyad da ni zuwa gun ka,",
              "Ina bin sawun iyayenmu na da,",
              "Ta kasan da sun yi zaman bakonci,",
              "Ta kasan da sun yi zaman bakonci. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar fassarar Zabura ta 23 ce, tana nuna amincin Allah a matsayin Makiyayi mai kyau wanda yake kiyayewa da kuma ciyar da tumakinsa."
      },
      "HBH58": {
        title: "Mai Albarka, Ya Bishe Ni",
        number: "HBH58",
        author: "Joseph H. Gilmore, 1834-1918",
        composer: "William B. Bradbury, 1816-1868",
        tune: "HE LEADETH ME",
        meter: "L.M. with Refrain",
        key: "D Major",
        scripture: "Zabura 23:2",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "1862",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mai albarka, ya bishe ni, Da kalmarsa ta ta'aziya,",
              "Ko a ina, ko me nake, Da hannunsa ya bishe ni."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Mai albarka ya bishe ni, da hannunsa ya bishe ni",
              "Ni zan bi shi da aminci, da hannunsa ya bishe ni."
            ]
          },
          {
            verse: 2,
            text: [
              "Ko a cikin damuwata, Ko a cikin farin ciki,",
              "Ko da dadi ko ba dadi, Hannuwansa ke bishe ni."
            ]
          },
          {
            verse: 3,
            text: [
              "Ubangiji zai rike ni, Ba zan yi gunaguni ba,",
              "Zan gamsu da ayyukanka, Tun da kai ne kake bishe ni."
            ]
          },
          {
            verse: 4,
            text: [
              "Ran da aikina ya kare, Na yi nasara da duniya,",
              "Ba zan ji tsoron mutuwa ba, Don hannunka ke bishe ni.",
              "Amin."
            ]
          }
        ],
        history: "Wannan waƙar da Joseph Gilmore ya rubuta tana murnar jagoran Allah a kowane yanayi na rayuwa, ko a cikin farin ciki ko damuwa, bisa ga Zabura 23:2."
      },
      "HBH59": {
        title: "Ga Duniyar Ubana",
        number: "HBH59",
        author: "Maltbie D. Babcock, 1858-1901",
        composer: "Franklin L. Sheppard, 1852-1930",
        tune: "TERRA PATRIS",
        meter: "S.M.D.",
        key: "Eb Major",
        scripture: "Zabura 24:1",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "1901",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ga duniyar Ubana, Domin in saurara",
              "Duk duniya ku raira da ni, Wakokin yabonsa,",
              "Ga duniyar Ubana, Ya sanya ni a ciki,",
              "Duk abin da ya halitta, Da babban hannunsa."
            ]
          },
          {
            verse: 2,
            text: [
              "Ga duniyar Ubana, Tsuntsaye sun raira,",
              "Ga haske tun da asuba, Yabonsa suke yi,",
              "Ga duniyar Ubana, Shi ke haskaka ta,",
              "Ina jin kasancewarsa, Muryarsa nake ji."
            ]
          },
          {
            verse: 3,
            text: [
              "Ga duniyar Ubana, Ka sa kar in manta,",
              "Cikin kowane yanayi, Allah ne ke mulki,",
              "Ga duniyar Ubana, Muna cikin yaki,",
              "Mutuwar Yesu ne karfinmu, Ya sulhunta duniya.",
              "Amin."
            ]
          }
        ],
        history: "Waƙar tana yabon Allah Mahalicci ta hanyar kallon kyawun halittunsa da kuma tabbatar da cewa shi ne yake mulki a kan dukan duniya, bisa ga Zabura 24:1."
      },
      "HBH60": {
        title: "Ka Bi Da Ni, Ya Ubangijina",
        number: "HBH60",
        author: "John H. Newman, 1801-1890",
        composer: "John B. Dykes, 1823-1876",
        tune: "LUX BENIGNA",
        meter: "10.4.10.4.10.10.",
        key: "G Major",
        scripture: "Zabura 43:3",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "1833",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ka bi da ni, ya Ubangijina, A duniyan nan,",
              "Na bata dai ban san hanyarka ba, Ka bi da ni,",
              "Tsare zamana, tsare tashina,",
              "Inda na je, ka rike hannuna."
            ]
          },
          {
            verse: 2,
            text: [
              "Da ban san ka ba, ba na addu'a, Ka bi da ni,",
              "Da na bata ina bin nufina, Ka bi da ni,",
              "Ina ta rayuwa cikin tsoro,",
              "Ya kai shugabana ka bi da ni."
            ]
          },
          {
            verse: 3,
            text: [
              "Tun da yanzu na sami ikonka, Ka bi da ni,",
              "Ko cikin tafiya nake yanzu, Ka bishe ni,",
              "Yadda mala'ikunka suna murna,",
              "Cika ni da murna har wurinka. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar addu'a ce ta neman hasken Allah da jagoransa a lokacin duhu ko rashin tabbas, tana dogara ga alherinsa na har abada, bisa ga Zabura 43:3."
      },
      "HBH61": {
        title: "Ubanmu Madawwami Ne",
        number: "HBH61",
        author: "William Whiting, 1825-1878",
        composer: "John B. Dykes, 1823-1876",
        tune: "MELITA",
        meter: "8.8.8.8.8.8",
        key: "C Major",
        scripture: "Zabura 107:29",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "1860",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ubanmu mai ceto ne, Shi ne ke kawo natsuwa,",
              "Iskar Teku ma ta kwanta, Ikonsa babu iyaka,",
              "Ka ji kukanmu ya Uba, Domin kada mu hallaka."
            ]
          },
          {
            verse: 2,
            text: [
              "Mai Ceton da kalmominsa, Iska ma tana biyayya,",
              "Shi da ya taka kan ruwa, Ya kwantar da karfin iska,",
              "Ka ji kukanmu ya uba, Domin kada mu hallaka."
            ]
          },
          {
            verse: 3,
            text: [
              "Ruhu Mai Tsarki na Allah, Da ke yawo kan ruwaye,",
              "Kana kwantar da haushinsu, Kana kawo salamarka,",
              "Ka ji kukanmu ya Uba, Domin kada mu hallaka."
            ]
          },
          {
            verse: 4,
            text: [
              "Kaunar Uba, Da da Ruhu, Ka zo ka kare 'yan'uwa,",
              "A lokacin damuwarsu, Kiyaye su a ko'ina,",
              "Da haka nan ne yabonka, Zai karfafa cikin duniya.",
              "Amin."
            ]
          }
        ],
        history: "Wannan waƙar addu'a ce ga waɗanda suke tafiya a kan teku, tana neman kariyara Allah mai iko a kan iska da raƙuman ruwa, bisa ga Zabura 107:29."
      },
      "HBH62": {
        title: "Kai Ne Wahayi Na Ubangiji",
        number: "HBH62",
        author: "Eleanor H. Hull, 1860-1935",
        composer: "Irish Folk Melody",
        tune: "SLANE",
        meter: "10.10.10.10.",
        key: "Eb Major",
        scripture: "Zabura 16:5",
        theme: "ALLAH UBA: Kulawa da Jagora na Allah",
        year: "1912",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Kai ne wahayina Ubangiji,",
              "Ba ni da komai in ban da kai,",
              "Tunaninka nake a koyaushe,",
              "Kai ne haskena kowane loto."
            ]
          },
          {
            verse: 2,
            text: [
              "Ka zama hikima da kalmata,",
              "Bari ka kasance da ni kullum,",
              "Mu yi rayuwa ta Uba da Da,",
              "Da ni da kai mu kasance daya."
            ]
          },
          {
            verse: 3,
            text: [
              "Yabon mutum, da arziki na ki,",
              "Kai ne gadona da yau da kullum,",
              "Kai kadai ne kana zuciyata,",
              "Arzikina kai ne Ubangiji."
            ]
          },
          {
            verse: 4,
            text: [
              "Sarkin sarkuna mai Nasara,",
              "Bari in dandana murnar sama,",
              "Kai ne farin ciki na zuciyata,",
              "Kai ne wahayina ka mulke ni. AMIN."
            ]
          }
        ],
        history: "Wannan tsohuwar waƙar Irish ce da aka fassara, tana nuna sha'awar mai bi na neman Allah ya zama babban burinsa, hikimarsa, da kuma arzikinsa na gaskiya, bisa ga Zabura 16:5."
      },
      "HBH63": {
        title: "Mala'iku Ne Sun Fara Yabo",
        number: "HBH63",
        author: "Traditional English Carol",
        composer: "Traditional English Carol",
        tune: "THE FIRST NOEL",
        meter: "Irregular With Refrain",
        key: "D Major",
        scripture: "Luka 2:8",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mala'iku ne sun fara yabo,",
              "Sun shaida wa, Makiyaya haihuwarsa.",
              "A filin da suna tsaron su,",
              "Cikin sanyi na tsakiyar dare."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Nowel, Nowel, Nowel, Nowel,",
              "Yau an haife shi Sarkinmu"
            ]
          },
          {
            verse: 2,
            text: [
              "Sun hangi tauraronsa sama,",
              "Ga shi can yana haskaka gabansu",
              "Yana haskaka bisan duniya,",
              "Haka ya ci gaba da haskaka."
            ]
          },
          {
            verse: 3,
            text: [
              "Cikin hasken tauraron nan,",
              "Shehuna uku sun zo daga nesa",
              "Domin su nemi sarki wanda an haifa,",
              "Su bi wannan tauraro ko'ina."
            ]
          }
        ],
        history: "Wannan waƙar Kirsimeti ce ta gargajiya da ke ba da labarin haihuwar Yesu, tun daga sanarwar mala'iku ga makiyaya har zuwa ziyarar masu hikima daga gabas, bisa ga Luka 2:8."
      },
      "HBH64": {
        title: "Mala'iku Na Rairawa",
        number: "HBH64",
        author: "Traditional French Carol",
        composer: "Traditional French Carol",
        tune: "GLORIA",
        meter: "7.7.7.7. With Refrain",
        key: "F Major",
        scripture: "Luka 2:13",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mala'iku na rairawa, Ga su nan a sarari,",
              "Tuddai ma na rairawa, Sun bayyana murnarsu."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Daukaka shi ne mafi girma",
              "Daukaka shi ne mafi girma"
            ]
          },
          {
            verse: 2,
            text: [
              "Me ya sa makiyaya, Suna murna mai yawa?",
              "Mene ne labarin nan, Da ya iza wakar nan."
            ]
          },
          {
            verse: 3,
            text: [
              "Zo garin Baitalami, Ku gan shi da an Haifa,",
              "Zo ku durkusa masa, Yesu ne shi Sarkinmu."
            ]
          },
          {
            verse: 4,
            text: [
              "Ga shi a sakarkari, Mala'iku na rairawa,",
              "Tare da iyayenSa, Zuciyarmu ta yi murna. AMIN."
            ]
          }
        ],
        history: "Waƙar Kirsimeti ce mai daɗi wadda ke kwatanta murnar mala'iku da makiyaya a lokacin haihuwar Almasihu a Baitalami, bisa ga Luka 2:13."
      },
      "HBH65": {
        title: "Yau Fa Duniya Tana Murna",
        number: "HBH65",
        author: "Isaac Watts, 1674-1748",
        composer: "George F. Handel, 1685-1759",
        tune: "ANTIOCH",
        meter: "C.M.",
        key: "D Major",
        scripture: "Zabura 98:4",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1719",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Yau fa duniya tana murna, Mai mulkinta ya zo,",
              "Mu shirya masa zukata, Mala'iku halitta,",
              "mala'iku halitta, Su raira, su raira yabonSa."
            ]
          },
          {
            verse: 2,
            text: [
              "Yesu Kristi yana mulki, Mu raira yabonSa,",
              "HalittarSa a ko'ina, Suna farin ciki,",
              "suna farin ciki, Suna, suna farin ciki."
            ]
          },
          {
            verse: 3,
            text: [
              "Ikon zunubi ya kare, Ba sauran bacin rai,",
              "Ya zo da albarku da yawa, Ba sauran la'ana,",
              "Ba sauran la'ana, ba sauran, Ba sauran la'ana."
            ]
          },
          {
            verse: 4,
            text: [
              "Mulkinsa fa mai gaskiya ne, Duniya su shaida,",
              "Daukakarsa, adalcinsa, Da girman kaunarsa,",
              "Da girman kaunarsa, da girman, Da girman kaunarsa.",
              "AMIN."
            ]
          }
        ],
        history: "Wannan shahararriyar waƙar Isaac Watts tana murnar zuwan Ubangiji a matsayin Sarki, tana kiran dukan halitta su yi murna da adalcinsa da ƙaunarsa, bisa ga Zabura 98:4."
      },
      "HBH66": {
        title: "Jama'ar Dan Allah",
        number: "HBH66",
        author: "John F. Wade, 1711-1786",
        composer: "John F. Wade, 1711-1786",
        tune: "ADESTE FIDELES",
        meter: "Irregular with Refrain",
        key: "G Major",
        scripture: "Luka 2:15",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1743",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Jama'ar Dan Allah ku, taru ku yi murna",
              "Ku taru ku taru, a Baitalami",
              "Zo mu gaishe shi, sarkin mala'iku"
            ]
          },
          {
            verse: "Korus",
            text: [
              "Mu yi masa sujada, mu yi masa sujada",
              "Mu yi masa sujada, Mai Cetonmu"
            ]
          },
          {
            verse: 2,
            text: [
              "Rundunar sama ku, yi ta daukakarsa",
              "Ku daukaka shi, cikin wakoki",
              "Allah a sama cike da daukaka."
            ]
          },
          {
            verse: 3,
            text: [
              "I mun gaishe ka haifaffe na Allah",
              "Yesu duk daukaka taka ce",
              "Kalmatullahi ya zo cikin jiki. AMIN."
            ]
          }
        ],
        history: "Wannan waƙar Kirsimeti ce mai ban sha'awa da ke kiran masu bi su zo Baitalami su gaishe da sabon Sarki, tana jaddada ikon Almasihu a matsayin Kalmar Allah da ta zama jiki, bisa ga Luka 2:15."
      },
      "HBH67": {
        title: "Ga Wakar Asubahi Da Ta Fi Kyau",
        number: "HBH67",
        author: "Reginald Heber, 1783-1826",
        composer: "James P. Harding, 1850-1911",
        tune: "MORNING STAR",
        meter: "11.10.11.10.",
        key: "C Major",
        scripture: "Matta 2:2",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1811",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ga wakar asubahi da ta fi kyau,",
              "Ka fitar da mu cikin duhunmu,",
              "Taurarowar gabas, mai haskakawa,",
              "Ki tsare makwancin jaririn."
            ]
          },
          {
            verse: 2,
            text: [
              "Ga sanyin daukaka kewaye da shi,",
              "Makwancinsa cikin sakarkari,",
              "Mala'iku sun zo masa da daukaka,",
              "Mahalicci da mai ceton duniya."
            ]
          },
          {
            verse: 3,
            text: [
              "Mu kawo masa sujada mai tsada,",
              "Mu zo da hadayu masu kanshi,",
              "Ko a kan tuddai, ko cikin ruwaye,",
              "Ku zo gun sa fa da kyautai kuma."
            ]
          },
          {
            verse: 4,
            text: [
              "Ba kyautai kadai yake so gun mu ba,",
              "Ba za mu sami tagomashi ba,",
              "Idan ba mu ba shi zuciyarmu ba,",
              "Yana son addu'o'in gaskiya. AMIN"
            ]
          }
        ],
        history: "Wannan waƙar ta Bishop Reginald Heber tana murnar tauraron asubahi wanda ya jagoranci masu hikima zuwa ga jariri Yesu, tana jaddada cewa hadayar zuciya ita ce tafi kowane irin kyauta, bisa ga Matta 2:2."
      },
      "HBH68": {
        title: "Mutane Sun Yi Murna",
        number: "HBH68",
        author: "William C. Dix, 1837-1898",
        composer: "Conrad Kocher, 1786-1872",
        tune: "DIX",
        meter: "7.7.7.7.7.7",
        key: "G Major",
        scripture: "Matta 2:10",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1860",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mutane sun yi murna, Suka ga tauraronsa,",
              "Da murna sun bi hasken, Ya haskaka gabansu,",
              "Da godiya ka kai mu, Zuwa wurinka Uba."
            ]
          },
          {
            verse: 2,
            text: [
              "Sun taka da murna fa, Har zuwa sakarkari,",
              "Don su durkusa masa, Wanda ke da martaba,",
              "Bari mu bi haka nan, Mu nemi mai jinkanmu."
            ]
          },
          {
            verse: 3,
            text: [
              "Sun kai kyawawan kyautai, A mazaunin dabbobi,",
              "Muna da farin ciki, Da zuciya mai tsarki,",
              "Da kyautai masu tsada, Zuwa gun ka sarkinmu."
            ]
          },
          {
            verse: 4,
            text: [
              "Yesu mai tsarki kullum, Kebe mu a hanyarka,",
              "Bayan shudewar duniya, Inda babu duhu ma,",
              "Domin yawan haskenka, Shi haskaka ko'ina. Amin."
            ]
          }
        ],
        history: "Waƙar tana kwatanta murnar masu hikima lokacin da suka ga tauraron da ya kai su ga Mai Ceto, tana ƙarfafa mu mu bi sawunsu da godiya da sadaukarwa, bisa ga Matta 2:10."
      },
      "HBH69": {
        title: "Ga Waka A Fili",
        number: "HBH69",
        author: "Josiah G. Holland, 1819-1881",
        composer: "Karl P. Harrington, 1861-1953",
        tune: "CHRISTMAS SONG",
        meter: "6.6.6.6.12.12.",
        key: "F Major",
        scripture: "Luka 2:13",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1874",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ga waka a fili! Ga tauraro a sama!",
              "Ga Uwa na addu'a, Jariri na kuka!",
              "Tauraro na haske ga waka mai dadi,",
              "Cikin sakarkari ga Sarki a kwance!"
            ]
          },
          {
            verse: 2,
            text: [
              "Ga murna mai girma, Don haifuwan Yesu,",
              "Jaririn Budurwa, Ubangiji ne shi;",
              "Tauraro na haske ga waka mai dadi,",
              "Cikin sakarkari ga sarki a kwance!"
            ]
          },
          {
            verse: 3,
            text: [
              "Hasken tauraron na, Da muhimmanci;",
              "Wakar kuwa tana, Da dadi ga duniya.",
              "Dutsen na da haske ga waka mai dadi,",
              "A gidajen al'umma Yesu Sarki ne."
            ]
          },
          {
            verse: 4,
            text: [
              "Muna murna da hasken, Muna rairawa fa,",
              "Waka mai dadi daga, Kursiyin Allah;",
              "Muna farin ciki da wannan labara,",
              "mun kawo gaisuwarmu ga babban Sarki. Amin."
            ]
          }
        ],
        history: "Wannan waƙar tana nuna yanayin murnar da ke sararin sama da kuma sakarkari a lokacin haihuwar Yesu, tana tabbatar da cewa yanzu Yesu Sarki ne a cikin zukatan mutane, bisa ga Luka 2:13."
      },
      "HBH70": {
        title: "Mun Gaishe Ka Yesu Kristi",
        number: "HBH70",
        author: "John Bakewell, 1721-1819",
        composer: "Lowell Mason, 1792-1872",
        tune: "HARWELL",
        meter: "8.7.8.7.D.",
        key: "G Major",
        scripture: "Ru'ya ta Yohanna 5:12",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1757",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mun gaishe ka Yesu Kristi, Ka zo domin ceton mu;",
              "Daga tsoro da zunubai, Wurinka akwai hutu,",
              "Mai ta'aziyar Israila, Kai ne begen tsarkaka,",
              "Al'umma na ta begenka, Murnar masu jiranka."
            ]
          },
          {
            verse: 2,
            text: [
              "An haife ka don cetonmu, Jariri amma Sarki,",
              "Ka zo don ka yi sarauta; Ga alherin mulkinka,",
              "Ta wurin Ruhu Mai Tsarki, Yi mulki har abada,",
              "Sai ka fifita mu cikin, Alherinka ya mai iko. Amin."
            ]
          }
        ],
        history: "Waƙar addu'a ce ta neman Yesu wanda aka daɗe ana jiran zuwansa ya zo ya cece mu daga tsoro da zunubi, kuma ya yi sarauta a cikin zukatanmu ta wurin Ruhu Mai Tsarki, bisa ga Ru'ya ta Yohanna 5:12."
      },
      "HBH71": {
        title: "Cikin Duhun Dare Ta Zo",
        number: "HBH71",
        author: "Edmund H. Sears, 1810-1876",
        composer: "Richard S. Willis, 1819-1900",
        tune: "CAROL",
        meter: "C.M.D.",
        key: "Bb Major",
        scripture: "Luka 2:14",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1849",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Cikin duhun dare ta zo, Wakar nan mai dadi,",
              "Mala'iku suka kawo ta, Da amo mai sauti;",
              "\"Salama ga duniya duka\", Daga Sarkin samaniya;",
              "Duniya ta yi shiru duka, Don sauraron wakar."
            ]
          },
          {
            verse: 2,
            text: [
              "Sun zo daga cikin sama, Dauke da salama;",
              "Suna dauke da waka, Mai dadi ga dukan duniya,",
              "Kan tuddai, gangare da, Damuwa suna firiya;",
              "Tare da kayan sauti, Suna ta raira waka."
            ]
          },
          {
            verse: 3,
            text: [
              "Ya ku masu nauyin kaya, Tare da gajiya,",
              "Kuna fama da wahala, Tare da radadi",
              "Ga shi hutu da kwanciyar, Rai sun zo wurinku;",
              "Ga fa hutu da salama, Ga wakar Mala'iku."
            ]
          },
          {
            verse: 4,
            text: [
              "Lokaci yana kurewa fa, An gama anabci,",
              "Idan kun bar lokaci ya, Gama kurewa fa;",
              "Idan kun bar salama ta, Wuce cikin duniya,",
              "Kuka yi watsi da sakon, Na wakar Mala'iku. Amin."
            ]
          }
        ],
        history: "Wannan waƙar tana magana ne game da waƙar mala'iku a daren Kirsimeti, tana shelanta salama a duniya da kuma alheri ga mutane daga wurin Allah, bisa ga Luka 2:14."
      },
      "HBH72": {
        title: "Da Daren Nan",
        number: "HBH72",
        author: "Joseph Mohr, 1792-1848",
        composer: "Franz Gruber, 1787-1863",
        tune: "STILLE NACHT",
        meter: "Irregular",
        key: "Bb Major",
        scripture: "Luka 2:8",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1818",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Da daren nan, mai tsarki, Sai shuru, sai haske",
              "Kewaye da, uwa da danta, Jariri mai tsarki na Allah",
              "Barci cikin salama, Barci cikin salama."
            ]
          },
          {
            verse: 2,
            text: [
              "Da daren nan, mai tsarki, Ba duhu, sai haske,",
              "Makiyaya sun ji murya, Mala'iku na yabon sarkin",
              "An haifi Mai Ceto, An haifi Mai Ceto."
            ]
          },
          {
            verse: 3,
            text: [
              "Da daren nan, mai tsarki, Ga hasken, Dan Allah,",
              "Yana haskaka ikon ceto, YESU haifaffe mai mulki",
              "Yesu mai mulkin duniya, Yesu mai mulkin duniya."
            ]
          },
          {
            verse: 4,
            text: [
              "Da daren nan, mai tsarki, Tauraro, mai haske,",
              "Da mala'iku raira waka, Halleluya ga sarkinmu,",
              "An haifi Mai Ceto, An haifi Mai Ceto. Amin."
            ]
          }
        ],
        history: "Wannan shahararriyar waƙar Kirsimeti ce ta Joseph Mohr da Franz Gruber, tana kwatanta kwanciyar hankali da tsarkin daren da aka haifi Yesu Almasihu a Baitalami, bisa ga Luka 2:8."
      },
      "HBH73": {
        title: "Maryamu Ta Haifi Da",
        number: "HBH73",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TEMPUS ADEST FLORIDUM",
        meter: "7.6.7.6. D.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Maryamu ta haifi Da, Ta sa shi a kwami,",
              "Yana kwance ba aibi, Ga bako ya zo fa,",
              "Wannan jariri a can, Ko shi ne Mai Ceto?",
              "Tambayi duka tsara, Da ke da tagomashi,"
            ]
          },
          {
            verse: 2,
            text: [
              "Mala'iku sun shaida shi, Shehuna sun zo fa,",
              "Tauraron ya haskaka, A kewaye da shi,",
              "Makiyaya sun gan shi, Ji wakar mala'iku,",
              "Ko'ina sai haske fa, Tuddai ma na murna."
            ]
          },
          {
            verse: 3,
            text: [
              "Maryamu ta haifi Da, Ta sa shi a kwami,",
              "Yana kwance ba aibi, Yanzu ba bako ba,",
              "Dan Allah mai kaskanci, Labari mai dadi,",
              "Yabi sunansa duniya, Daukaka ga sarki."
            ]
          }
        ],
        history: "Wannan waƙar Kirsimeti ce mai sauƙi wadda ke ba da labarin haihuwar Yesu ta wurin Maryamu, tana jaddada gaskiyar cewa shi ne Mai Ceto wanda mala'iku da shehuna suka shaida."
      },
      "HBH74": {
        title: "Masu Bi Na Gaske Yi Murna",
        number: "HBH74",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "IN DULCI JUBILO",
        meter: "Irregular",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Masu bi na gaske, Da zuciya yi murna!",
              "Ku saurari zancenmu; An haifi Yesu Kristi.",
              "Mu yi masa sujada, Yana cikin sakarkari;",
              "An haifi Yesu, An haifi Yesu."
            ]
          },
          {
            verse: 2,
            text: [
              "Masu bi na gaske, Da zuciya yi murna!",
              "Ga labari mai dadi; An haifi Yesu Kristi.",
              "Ya bude kofar sama, Ga albarka har abada;",
              "An haifi Yesu, An haifi Yesu."
            ]
          },
          {
            verse: 3,
            text: [
              "Masu bi na gaske, Da zuciya yi murna!",
              "Ba sauran tsoron mutuwa; An haifi Yesu Kristi.",
              "Yana kiran dukanmu, Domin mu shiga mulkinsa,",
              "An haifi Yesu, An haifi Yesu. Amin."
            ]
          }
        ],
        history: "Wannan waƙar tana kiran dukan masu bi su yi murna da dukan zuciyarsu saboda haihuwar Yesu Kristi, wanda ya buɗe ƙofar sama kuma ya kawar da tsoron mutuwa."
      },
      "HBH75": {
        title: "Baitalami Kankanuwa",
        number: "HBH75",
        author: "Phillips Brooks, 1835-1893",
        composer: "Lewis H. Redner, 1831-1908",
        tune: "ST LOUIS",
        meter: "8.6.8.6.7.6.8.6.",
        key: "Ba a sani ba",
        scripture: "Mikah 5:2",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1868",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Baitalami kankanuwa, Kina kwance shiru!",
              "Cikin shiru da barci sai, Ga taurari kanki,",
              "Cikin titi da duhu, Ga haske ya bullo,",
              "Bege da tsoron shekaru, Yau an kawas da su."
            ]
          },
          {
            verse: 2,
            text: [
              "Maryamu ta haife shi, Mala'iku sun shaida;",
              "Kowa barci, mala'iku na, Tsaro cikin kauna,",
              "Taurarin Asubahi, Sun shaida haifuwarsa;",
              "Wakokin daukakar Allah, salama ga duniya!"
            ]
          },
          {
            verse: 3,
            text: [
              "Cikin shiru, cikin shiru ga fa babban kyauta;",
              "Allah ya ba mutane fa albarku na sama;",
              "Duniya mai zunubi ta, Sami labarin duk;",
              "Masu karyayyun zukata, Karbi Yesu Kristi."
            ]
          },
          {
            verse: 4,
            text: [
              "Jariri na Baitalami! Ka kusance mu yau;",
              "Kawas da duk zunubanmu, Maya haifuwar mu!",
              "Ga Mala'iku na Kristimas, Sun shaida labarin;",
              "Zo wurinmu, ka bi da mu, Allah Immanuel! Amin."
            ]
          }
        ],
        history: "Phillips Brooks ya rubuta wannan waƙar bayan ya ziyarci Baitalami, tana kwatanta yadda hasken madawwami ya haskaka a cikin duhun garin ta hanyar haihuwar Yesu, bisa ga Mikah 5:2."
      },
      "HBH76": {
        title: "Mala'iku Cikin Daukaka",
        number: "HBH76",
        author: "James Montgomery, 1771-1854",
        composer: "Henry T. Smart, 1813-1879",
        tune: "REGENT SQUARE",
        meter: "8.7.8.7.8.7.",
        key: "Ba a sani ba",
        scripture: "Luka 2:13",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1816",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mala'iku cikin daukaka, Kuna firiya kan duniya;",
              "Kuna raira wakar ceto, Shelar haifuwar Yesu.",
              "Yi sujada, yi sujada, Yesu, sabon Sarki!"
            ]
          },
          {
            verse: 2,
            text: [
              "Makiyaya cikin jeji, Suna tsaron garkensu,",
              "Allah ya zo gun mutane, Ga jariri na haske.",
              "Yi sujada, yi sujada, Ga Yesu, sabon Sarki!"
            ]
          },
          {
            verse: 3,
            text: [
              "Ku bar zurfin tunaninku, Ga haske na haskaka;",
              "Sai ku bar duk lamirin ku, Kun ga hasken tauraro.",
              "Yi sujada, yi sujada, Ga Yesu, sabon Sarki!"
            ]
          },
          {
            verse: 4,
            text: [
              "Tsarkaka gaban bagadi, Suna tsaron zuwansa,",
              "Ubangijinmu ya sauko, Ga shi cikin haikali,",
              "Yi sujada, yi sujada, Ga Yesu sabon Sarki! Amin."
            ]
          }
        ],
        history: "Wannan waƙar kira ce ga dukan masu bi da su zo Baitalami don su yi sujada ga sabon Sarki, bisa ga Luka 2:15."
      },
      "HBH77": {
        title: "Cikin Sakarkari",
        number: "HBH77",
        author: "Ba a sani ba",
        composer: "James R. Murray, 1841-1905",
        tune: "MUELLER",
        meter: "11. 11. 11. 11.",
        key: "Ba a sani ba",
        scripture: "Luka 2:7",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1887",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Cikin sakarkari, ga Yesu kwance,",
              "Ubangiji ne shi kwance jariri,",
              "Taurarin sama suna ta haska,",
              "Ga jariri Yesu, kwance a kwami."
            ]
          },
          {
            verse: 2,
            text: [
              "Shanu na ta kallo, jariri kwance,",
              "Ubangiji ne shi baya yin kuka,",
              "Ina kaunarka Yesu madaukaki,",
              "Zauna tare da ni har safiya ta yi."
            ]
          },
          {
            verse: 3,
            text: [
              "Kusance ni Yesu ina rokonka,",
              "Kada ka rabu da ni Yesu Kristi,",
              "Albarkaci duk kankananan yara,",
              "Ka sa mu zauna da kai har abada. Amin."
            ]
          }
        ],
        history: "Wannan shahararriyar waƙar Krismas ce da take kwatanta tawali'un haihuwar Yesu a cikin sakarkari, bisa ga Luka 2:7."
      },
      "HBH78": {
        title: "Na Ji Shelar Ranar Krismas",
        number: "HBH78",
        author: "Henry W. Longfellow, 1807-1882",
        composer: "John B. Calkin, 1827-1905",
        tune: "WALTHAM",
        meter: "L.M.",
        key: "Ba a sani ba",
        scripture: "Luka 2:14",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1863",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Na ji shelar ranar Krismas, Sanannun wakokin yabo,",
              "kalmomin suna ta amo, Salama a gareku fa."
            ]
          },
          {
            verse: 2,
            text: [
              "Ina tunanin ranar nan, Da za a busa kaho fa,",
              "Tare da kiran sunaye, Salama a gareku fa."
            ]
          },
          {
            verse: 3,
            text: [
              "Cikin tsoro na sunkuya, Na ce ba salama duniya,",
              "Ana kiyayyar wako kin, Salama ga duniya fa."
            ]
          },
          {
            verse: 4,
            text: [
              "Aka kara sautin amo, Mahaliccinmu na da rai,",
              "Babu ceto ga miyagu, Salama a gare ku fa."
            ]
          },
          {
            verse: 5,
            text: [
              "Za mu ta raira wakoki, Sai dukan duniya ta ji,",
              "Wakokin farin cikinmu ne, Salama ga duniya.",
              "Amin."
            ]
          }
        ],
        history: "Henry Longfellow ya rubuta wannan waƙar a lokacin yaƙin basasa na Amurka, tana magana game da salama a duniya duk da wahalhalu, bisa ga Luka 2:14."
      },
      "HBH79": {
        title: "Makiyaya Da Daddare",
        number: "HBH79",
        author: "Nahum Tate, 1652-1715",
        composer: "George F. Handel, 1685-1759",
        tune: "CHRISTMAS",
        meter: "C. M.",
        key: "Ba a sani ba",
        scripture: "Luka 2:8-14",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1700",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Makiyaya da daddare, Sun tsare garkensu,",
              "Mala'ikan Allah ya zo, Ya haskaka su fa,",
              "Ya haskaka su fa"
            ]
          },
          {
            verse: 2,
            text: [
              "\"Kada ku ji tsoro\", Ya ce gama sun firgita",
              "\"Labarin murna ne na kawo, Ga dukan duniya\",",
              "Ga dukan duniya."
            ]
          },
          {
            verse: 3,
            text: [
              "\"An haifi Almasihu yau, A birnin Dauda fa\"",
              "Mai ceto, Ubangiji ne, Alamarsa ke nan,",
              "Alamarsa ke nan."
            ]
          },
          {
            verse: 4,
            text: [
              "\"Jariri za ku iske ma, Da siffar mutane\"",
              "A nannade da tsummoki, Cikin sakarkari,",
              "Cikin sakarkari."
            ]
          },
          {
            verse: 5,
            text: [
              "\"Daukaka duk ga Allahnmu, Salama ga duniya",
              "Amincin ga mutane duk, Yanzu da koyaushe,",
              "Yanzu da koyaushe. Amin."
            ]
          }
        ],
        history: "Wannan waƙar tana kwatanta sanarwar da mala'iku suka yi wa makiyaya game da haihuwar Mai Ceto, bisa ga Luka 2:8-14."
      },
      "HBH80": {
        title: "Bari Duniya Ta Yi Shiru",
        number: "HBH80",
        author: "Liturgy of St. James",
        composer: "French Folk Melody",
        tune: "PICARDY",
        meter: "8.7.8.7.8.7.",
        key: "Ba a sani ba",
        scripture: "Habakkuk 2:20",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "4th Century",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Bari duniya ta yi shiru, Tare da rawan jiki;",
              "Daina tunanin duniya, Ga albarku hannunsa,",
              "Yesu Kristi yana zuwa, Ya kai mu gidansa can."
            ]
          },
          {
            verse: 2,
            text: [
              "Dukan ku rundunar sama, Ku ci gaba da tsaro,",
              "Saukowar hasken haskaka, Daga darajar Allah.,",
              "Domin ya kawas da miyagu, Ya kawas da duhu ma."
            ]
          },
          {
            verse: 3,
            text: [
              "Kalkashin sawayensa fa, Mala'iku suna tsaro,",
              "Sun rurrufe fuskokinsu, Suna raira wakoki.",
              "Halleluyah! Halleluyah! Halleluyah! Ga Allah.",
              "Amin."
            ]
          }
        ],
        history: "Wata tsohuwar waƙar ibada ce da take kiran mutane su yi shiru da tsoron Allah sa'ad da suke gabansa, bisa ga Habakkuk 2:20."
      },
      "HBH81": {
        title: "Ji Wakokin Mala'iku",
        number: "HBH81",
        author: "Charles Wesley, 1707-1788",
        composer: "Felix Mendelssohn, 1809-1847",
        tune: "MENDELLSSOHN",
        meter: "7.7.7.7.D.",
        key: "Ba a sani ba",
        scripture: "Luka 2:14",
        theme: "YESU KRISTI DAN ALLAH: HaifuwarSa",
        year: "1739",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ji wakokin mala'iku, \"Yau an haifi sarkinmu\";",
              "Salama ga duniya; Mun sulhuntu da Allah.",
              "Raira wakokin yabo, Da su rundunan sama;",
              "Da muryoyin mala'iku, An haifi Yesu Kristi!",
              "Ji sakon mala'iku, Daukaka ga sarkinmu."
            ]
          },
          {
            verse: 2,
            text: [
              "Yesu Kristi madaukaki, Shi ne Ubangijinmu,",
              "Da mun ji yana zuwa, Shi jaririn Budurwa.",
              "Ya dauki siffan Allah, Shi Allah cikin jiki!",
              "Zaune cikin mutane, Yesu ne Immanuel.",
              "Ji sakon mala'iku, Daukaka ga sarkinmu."
            ]
          },
          {
            verse: 3,
            text: [
              "Haifuwar sarkin salama! Gaida Dan madaukaki,",
              "Ya kawo rai da haske, Ya kawo warkaswa ma.",
              "Ya kaskantar da kansa, Ya zo domin cetonmu.",
              "Ya zo don ya bishe mu, Ya maya haihuwarmu.",
              "Ji sakon mala'iku, Daukaka ga sarkinmu. AMIN."
            ]
          }
        ],
        history: ""
      },
      "HBH82": {
        title: "Ka Bar Mulkinka",
        number: "HBH82",
        author: "Emily E. S. Elliott, 1836-1897",
        composer: "Timothy R. Matthews, 1826-1910",
        tune: "MARGARET",
        meter: "Irregular",
        key: "Ba a sani ba",
        scripture: "Luka 2:7",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "1864",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Ka bar mulkinka da rawaninka,",
              "Ka shigo cikin duniya;",
              "Cikin Baitalami babu masauki,",
              "Babu masauki dominka",
              "Zo zuciyata ya Yesu,",
              "Na baka dukan zuciyata."
            ]
          },
          {
            verse: 2,
            text: [
              "Rundunan sama sun raira waka,",
              "Suna shelar mulkinka",
              "Amma haifuwarka da kaskanci;",
              "Tare da tawali'u.",
              "Zo zuciyata ya Yesu,",
              "Na baka dukan zuciyata."
            ]
          },
          {
            verse: 3,
            text: [
              "Dabbobin kasa, tsuntsayen sama,",
              "Cikin kurmin itatuwa",
              "Kana ko'ina fa, Yesu Dan Allah,",
              "Daga jejin Galili.",
              "Zo zuciyata ya Yesu,",
              "Na baka dukan zuciyata."
            ]
          },
          {
            verse: 4,
            text: [
              "Ka zo ya Yesu tare da kalma,",
              "Don ka kubutar da mu;",
              "Tare da ba'a, rawanin kaya,",
              "Har ya kai ka gicciye.",
              "Zo zuciyata ya Yesu,",
              "Na baka dukan zuciyata."
            ]
          },
          {
            verse: 5,
            text: [
              "In an busa kaho, wakar mala'iku,",
              "Dawowarka da nasara;",
              "Kira mu ga hutu, cewa \"akwai hutu,",
              "Ga hutu zauna wurina\"",
              "Zan yi muma fa, ya Yesu,",
              "Idan ka shigo zuciyata. AMIN."
            ]
          }
        ],
        history: "Emily Elliott ta rubuta wannan waƙar don yara, tana jaddada yadda babu masauki ga Yesu lokacin da aka haife shi, bisa ga Luka 2:7."
      },
      "HBH83": {
        title: "Mai Fansana Da Allah Na",
        number: "HBH83",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "FEDERAL STREET",
        meter: "L.M",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Mai fansana da Allahna, a karanta bukatarka,",
              "Cikin ranka ga dokarka, Horarru ne kalmomin ka."
            ]
          },
          {
            verse: 2,
            text: [
              "Hanyar gaskiya da nufinka, Daidai ne nufin Allah,",
              "Kaunarka da tawali'u, Zan karanta in fassara."
            ]
          },
          {
            verse: 3,
            text: [
              "Kan tuddai da duhun dare, Zan yi shelar alherinka,",
              "Cikin Hamada ka sani, Ka yi nasara da Shaidan."
            ]
          },
          {
            verse: 4,
            text: [
              "Zama Allahna, sa in shaida, Alherinka ko'ina,",
              "Taimake ni in shaida kaunarka, Dukan inda na je.",
              "Amin"
            ]
          }
        ],
        history: "Wannan waƙar tana nuna sha'awar bin koyarwar Yesu da dokokinsa, tana yin bimbini a kan nasararsa a kan Shaiɗan da alherinsa."
      },
      "HBH84": {
        title: "Alamu Masu Kyau",
        number: "HBH84",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "CANONBURY",
        meter: "L.M.A.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Alamu masu kyau na Allah.",
              "Cikinsu ya nuna kauna,",
              "Sun haska hanya sun ratsa",
              "Cikin kauna na Dan Allah!"
            ]
          },
          {
            verse: 2,
            text: [
              "Wane ne kamarka, haske,",
              "Ya Dan Mutum kai hasken rai!",
              "Wake da hakuri irin,",
              "Naka cikin duniya yau?"
            ]
          },
          {
            verse: 3,
            text: [
              "Wake da tawali'u irin ka",
              "A wurin mutane dai?",
              "Cike da tausayi, kai Allah,",
              "Amma ka kaskantar da kai."
            ]
          },
          {
            verse: 4,
            text: [
              "Ubangiji ni zan huta a,",
              "Wurinka har abada,",
              "In yi koyi da kai Allah,",
              "Kamar ka iyakar raina. AMIN."
            ]
          }
        ],
        history: "Waƙar yabo ce da take bayyana kyawawan halayen Yesu, musamman haƙurinsa da tawali'unsa a matsayinsa na hasken duniya."
      },
      "HBH85": {
        title: "Loton Da Sama Ta Cika",
        number: "HBH85",
        author: "J. Wilbur Chapman, 1859-1918",
        composer: "Charles H. Marsh, 1886-1956",
        tune: "CHAPMAN",
        meter: "11.10.11.10. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "1910",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Loton da sama ta cika da yabo,",
              "Loton da zunubi yayi baki;",
              "Hakika Budurwa ta haifi Yesu,",
              "Shi nake koyi da rayuwarsa."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Yana kaunata; domin cetona,",
              "Ya mutu ya wanke zunubaina;",
              "Tashinsa ya kawas da laifina,",
              "Za mu gan shi cikin daukakarsa."
            ]
          },
          {
            verse: 2,
            text: [
              "Loton da aka kai shi kan gicciye,",
              "Loton nan da aka gicciye shi;",
              "Ya sha wahala, an raina shi kwarai;",
              "Dauke da zunubanmu Mai Ceto."
            ]
          },
          {
            verse: 3,
            text: [
              "Loton da aka bar shi cikin lambu,",
              "Bayan ya huta da wahalarmu;",
              "Mala'iku sun kewaye shi da tsaro;",
              "Shi ne begenmu da Mai Cetonmu."
            ]
          },
          {
            verse: 4,
            text: [
              "Loton da kabari bai rike shi ba,",
              "Loton da an gangarar da dutsen;",
              "Sai ya tashi da nasara kan mutuwa;",
              "Yana can sama Ubangijinmu."
            ]
          },
          {
            verse: 5,
            text: [
              "Loton busa kaho na dawowarsa;",
              "Loton nan da sama ta haskaka;",
              "Babbar rana mai kauna fa zai dawo;",
              "Mai girma Mai Ceto shi ne Yesu. AMIN."
            ]
          }
        ],
        history: "J. Wilbur Chapman ya rubuta wannan waƙar don ta bayyana dukan labarin bishara: haihuwa, mutuwa, binne shi, tashi daga matattu, da dawowar Yesu."
      },
      "HBH86": {
        title: "Babban Mai Magani Na Nan",
        number: "HBH86",
        author: "William Hunter, 1811-1877",
        composer: "John H. Stockton, 1813-1877",
        tune: "GREAT PHYSICIAN",
        meter: "8.7.8.7. With Refrain",
        key: "Ba a sani ba",
        scripture: "Markus 2:17",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "1859",
        musicSigns: [],
        lyrics: [
          {
            verse: 1,
            text: [
              "Babban mai magani na nan, Yesu mai jin tausayinmu,",
              "Muryarsa tana warkaswa, Sai mu ji muryar Yesu."
            ]
          },
          {
            verse: "Korus",
            text: [
              "Yesu, suna mai dadin ji, Ba mai kamar sa ba mai ji",
              "Ina son sa kamar me, Yesu Almasihu. AMIN."
            ]
          },
          {
            verse: 2,
            text: [
              "An gafarta zunubanka, Sai ka ji muryar Yesu",
              "Ka tafi cikin salama, Ya ba ka rawanin rai."
            ]
          },
          {
            verse: 3,
            text: [
              "Daukaka ga, Dan ragon nan, Na gaskanta da Yesu",
              "Ina kaunar sunan Yesu, Ina kaunar Mai Ceto."
            ]
          },
          {
            verse: 4,
            text: [
              "Sunansa na fidda tsoro, Ba suna kamar Yesu",
              "Zuciyata tana jin dadin, Kyakkyawan sunan Yesu"
            ]
          }
        ],
        history: "William Hunter ya rubuta wannan waƙar game da Yesu a matsayin Babban Mai Magani wanda yake warkar da jiki da kuma rai, bisa ga Markus 2:17."
      },
      "HBH87": {
        title: "Na Sami Aboki Yesu",
        number: "HBH87",
        author: "Charles W. Fry",
        composer: "J.R. Sweney",
        tune: "SALVATIONIST",
        meter: "Irregular with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na sami aboki Yesu, shi ne komai nawa,", "Shi ne ya fi daraja a gare ni, babu irinsa a duniya,", "Na dogara ga shi, shi zai wanke ni ya tsarkake ni kwa,", "Wahala ko ta zo ne, ko dadi nake ji,", "Sai in sani yana nan tare da ni."] },
          { verse: "Korus", text: ["Babu irinsa a duniya, shi ne mai daukaka", "Shi ne ya fi daraja a gare ni"] },
          { verse: 2, text: ["Damuwa ta duk ya dauke, ba sauran wahala,", "Cikin jarabobi yana kare ni, na rabu da dukan kome,", "Da bautar duniya, za ya ji ni har ya ba ni taimako,", "Ko duniya duk ta ki ni, ba zan ji tsoro ba,", "Sai in ci gaba a cikin hanyar rai."] },
          { verse: 3, text: ["Ba zai bar ni ba a duniya, in zauna ni kadai,", "Cikin bangaskiya zan aika nufinsa,", "Zai tsare ni da ikonsa, ba zan ji tsoro ba,", "Bukatuna duka shi ne za ya biya,", "Ya shaida za ya dawo ya kai ni gidansa,", "Inda zan ga fuskarsa har abada."] }
        ],
        history: "Charles Fry ya rubuta wannan waƙar yana kwatanta Yesu a matsayin 'Abokinmu' kuma 'Hasken Safiya', yana nuna dogara gare shi, bisa ga Waƙar Sulemanu 2:1."
      },
      "HBH88": {
        title: "Yesu Shi Ne Hasken Duniya",
        number: "HBH88",
        author: "P.P. Bliss",
        composer: "P.P. Bliss",
        tune: "LIGHT OF THE WORLD",
        meter: "11.8.11.8. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Dukan duniya ta bata cikin duhu,", "Yesu shi ne hasken duniya,", "Kamar hasken rana haka kaunarsa,", "Yesu shi ne hasken duniya."] },
          { verse: "Korus", text: ["Zo ga haske, yana haskakawa,", "Cikin murna ya haskaka ni,", "Da na bata, yanzu na dawo,", "Yesu shi ne hasken duniya."] },
          { verse: 2, text: ["Ba duhu ga wadanda ke na Yesu;", "Yesu shi ne hasken duniya,", "Bi Yesu don mu tafi cikin haske,", "Yesu shi ne hasken duniya."] },
          { verse: 3, text: ["Ku masu tafiya cikin zunubi,", "Yesu shi ne hasken duniya,", "Ku tsabtace kanku, don ku haskaka,", "Yesu shi ne hasken duniya."] },
          { verse: 4, text: ["Babu bukatar haske cikin sama,", "Yesu shi ne hasken duniya,", "Domin Dan Rago shi ne hasken birnin,", "Yesu shi ne hasken duniya. AMIN."] }
        ],
        history: "P.P. Bliss ya rubuta wannan waƙar don jaddada cewa Yesu ne kaɗai hasken da zai iya korar duhun zunubi daga zuciyar mutum, bisa ga Yohanna 8:12."
      },
      "HBH89": {
        title: "Za Mu Ga Yesu",
        number: "HBH89",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "CUSHMAN",
        meter: "11.10.11.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: RayuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Za mu ga Yesu; shi ne hasken duniya,", "Mala'iku na waka kan kursiyi;", "Ga Yesu cikin sakarkari kwance;", "Sai mu kawo baiko gaban Sarkin."] },
          { verse: 2, text: ["Za mu ga Yesu, Yesu Dan Maryamu,", "Gama Yesu shi ne hasken duniya;", "Haskensa ya bayyana kullayaumi,", "Yesu shi ne Rai, Gaskiya da Hanya."] },
          { verse: 3, text: ["Za mu ga Yesu yana ta koyaswa,", "Mutane suna ta sauraronsa,", "Tsuntsaye da ciyayi na wa'azi,", "Albarka ga masu yin biyayya."] },
          { verse: 4, text: ["Za mu ga Yesu da sanyin safiya,", "Kamar da yana kira \"biyo ni\";", "Sai mu tashi dukanmu domin aiki;", "Mu naka ne, karbi sujadarmu. AMIN."] }
        ],
        history: "Wannan waƙar tana yin bimbini a kan ganin Yesu a matsayin Hasken Duniya, Malaminmu, da kuma wanda yake kiranmu mu bi shi kowace rana."
      },
      "HBH90": {
        title: "Kristi Ya Sha Wahala",
        number: "HBH90",
        author: "Sidney Lanier",
        composer: "Sidney Lanier",
        tune: "LANIER",
        meter: "Irregular",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kristi ya sha wahala fa,", "Can fa ya gaji;", "Kristi ya sha wahala fa,", "Sabili da kauna,", "Amma dukan halittu sun shaida shi,", "Duka sun yi masa hidima,", "Sun yi masa biyayya,", "Yayin da yake wahala."] },
          { verse: 2, text: ["Kristi ya yi nasara fa,", "Babu damuwa", "Kristi ya yi nasara fa,", "Bai hallaka ba,", "Bai damu ko ya ji kunya ba,", "Sa'ad da ya dauki gicciye,", "Har zuwa can tudun gwalgwata,", "Yesu ya yi nasara. AMIN."] }
        ],
        history: "Sidney Lanier ne ya rubuta wannan waƙar don nuna wahalhalun da Kristi ya sha da kuma nasarar da ya samu a kan gicciye saboda ƙauna."
      },
      "HBH91": {
        title: "Mai Ceto Ya Wahala",
        number: "HBH91",
        author: "Paul Gerhardt",
        composer: "Hans Leo Hassler",
        tune: "PASSION CHORALE",
        meter: "7.6.7.6.D.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Mai Ceto ya wahala, An wulakanta shi,", "An sa masa rawanin, Kaya mai zafi fa;", "Ya sha radadi sosai, An yi masa ba'a!", "Fuskarsa ta sauya fa, Ba kamar a da ba."] },
          { verse: 2, text: ["Me ya sa ka sha dukan, Wannan wahaloli?", "Dukan laifi nawa ne, Kai ka sha wahala;", "Ga ni nan dai kasasshe! Gama na yi laifi;", "Sai ka ji tausayina, Ka ba ni Alheri."] },
          { verse: 3, text: ["Ban san yadda zan gode, Maka ba, masoyi,", "Da wahala ka mutu, Ka tausaya mini;", "Ka maishe ni in zama, Naka har abada,", "Ya Ubangiji, sai ka, Sabunta kaunata."] }
        ],
        history: "Wannan waƙar bimbini ce a kan azabar da Yesu ya sha a kan gicciye, wadda Paul Gerhardt ya fassara daga wata tsohuwar waƙar Latin."
      },
      "HBH92": {
        title: "Ga Mabulbula",
        number: "HBH92",
        author: "William Cowper",
        composer: "Lowell Mason",
        tune: "CLEANSING FOUNTAIN",
        meter: "8.6.8.6.6.6.8.6.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ga mabulbula ta jini, Daga Immanuel,", "Masun zunubi sun tsira, Sun sami sabon rai,", "Sun sami sabon rai, Sun sami sabon rai,", "Masun zunubi sun tsira, Sun sami sabon rai."] },
          { verse: 2, text: ["Barawon nan kan gicciye, Na murnar cetonsa,", "Ni mai zunubi kamarsa, Wanke zunubaina,", "Wanke zunubaina, Wanke zunubaina,", "Ni mai zunubi kamarsa, Wanke zunubaina."] },
          { verse: 3, text: ["Jinin Dan ragon mai tsarki, Bai rasa iko ba,", "Har Ikilisiyar Almasihu, Ta sami cetonta,", "Ta sami cetonta, Ta sami cetonta,", "Har ikilisiyar Almasihu, ta sami cetonta."] },
          { verse: 4, text: ["Tun da na ga mabulbula, Inda ka ji rauni,", "Kaunar fansa ce wakata, Har sai na bar duniya,", "Har sai na bar duniya, Har sai na bar duniya,", "Kaunar fansa ce wakata, Har sai na bar duniya."] },
          { verse: 5, text: ["Sa'ad da na bar duniya nan, Na koma gareka,", "Zan yi ta raira wakoki, Zan shaida cetonka,", "Zan shaida cetonka, Zan shaida cetonka,", "Zan yi ta raira wakoki, Zan shaida cetonka."] }
        ],
        history: "William Cowper ya rubuta wannan waƙar don yin bikin ikon wanke zunubi da jinin Yesu yake da shi, bisa ga Zakariya 13:1."
      },
      "HBH93": {
        title: "Tsohon Gicciye",
        number: "HBH93",
        author: "George Bennard",
        composer: "George Bennard",
        tune: "OLD RUGGED CROSS",
        meter: "Irregular with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kan tudu da nisa can ga tsohon gicciye,", "Alama ce na wahala fa;", "Ina son gicciyen inda Yesu ya bada", "Kansa don masu zunubi."] },
          { verse: "Korus", text: ["Ina kaunar tsohon gicciye", "Domin kawas da zunubaina;", "Zan jingina ga tsohon gicciye", "Har in sauya shi da rawani."] },
          { verse: 2, text: ["Duniya ta raina wannan tsohon gicciye,", "Amma ni ina son sa sosai;", "Dan Rago na Allah ya bar daukakarsa,", "Ya dauki gicciyen har mutuwa."] },
          { verse: 3, text: ["Cikin tsohon gicciyen, akwai jini kansa,", "Na ga darajar gicciyen nan;", "Kan tsohon gicciyen Yesu na ya mutu,", "Domin gafarta zunubaina."] },
          { verse: 4, text: ["Zan jingina kan wannan tsohon gicciye,", "Ni ba zan damu da kunya ba;", "Zai kira ni wata rana domin hutu,", "Ga darajarsa har abada."] }
        ],
        history: "George Bennard ya rubuta wannan waƙar don nuna muhimmancin gicciye, inda Yesu ya ba da ransa domin ceton masu zunubi."
      },
      "HBH94": {
        title: "A Bisa Gicciye",
        number: "HBH94",
        author: "Ralph E. Hudson",
        composer: "Ralph E. Hudson",
        tune: "HUDSON",
        meter: "C. M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Mai ceto ya zubda jini, Har ya kai ga mutuwa?", "Zai kaskantar da kansa, Har mutuwa domina?"] },
          { verse: "Korus", text: ["Gun giciye, gun giciye can inda ni na ga haske,", "An kawas da dukan nauyin kaya (an kawas)", "Ta bangaskiya na sami ceto, ina da murna har abada"] },
          { verse: 2, text: ["Domin zunubaina ne ya, Yi kuka kan gicciye?", "Babban tausayi, Alheri, Da kauna mai girma!"] },
          { verse: 3, text: ["Har rana ta daina haske, Ta bar haskakawa;", "Yesu mai iko ya mutu, Domin mai zunubi."] },
          { verse: 4, text: ["Shan wahalarsa domin, Ba zan iya biya;", "Na baka raina ya Yesu, Ka yi mulkinsa."] }
        ],
        history: "Ralph Hudson ya ƙara waƙar yabo ga kalmomin Isaac Watts, yana nuna yadda mutum yake samun haske da ceto sa'ad da ya zo gaban gicciye."
      },
      "HBH95": {
        title: "Can Kan Gicciye",
        number: "HBH95",
        author: "Elisha A. Hoffman",
        composer: "John H. Stockton",
        tune: "GLORY TO HIS NAME",
        meter: "9. 9. 9. 5. With Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Can kan gicciye Yesu ya mutu,", "Na yi kuka domin zunubi;", "Ya zubda jininsa domina;", "Yabi sunansa."] },
          { verse: "Korus", text: ["Yabi sunansa, yabi sunansa;", "Ya zubda jininsa domina; yabi sunansa."] },
          { verse: 2, text: ["Ya cece ni daga zunubi,", "Yesu ya jimre duk wahala;", "Ta wurin gicciye ya cece ni,", "Yabi sunansa."] },
          { verse: 3, text: ["Mabulbula mai gafartawa,", "Ina da murna don na shiga;", "Can Yesu ya wanke zunubi;", "Yabi sunansa."] },
          { verse: 4, text: ["Zo wurin wannan mabulbular,", "Sauke nauyin kayan zunubi,", "Zo wurinsa, don ka tsarkaka; Yabi sunansa."] }
        ],
        history: "Elisha Hoffman ya rubuta wannan waƙar game da farin cikin samun tsarkaka daga zunubi ta wurin gicciye na Yesu."
      },
      "HBH96": {
        title: "A Kalfari",
        number: "HBH96",
        author: "William R. Newell",
        composer: "Daniel B. Towner",
        tune: "CALVARY",
        meter: "9.9.9.4. With Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ina zauna cikin zunubi, Ba na kula da Ubangiji,", "Ko mutuwa wadda shi ya yi, Kan gicciye."] },
          { verse: "Korus", text: ["Jinkan Yesu, ba misalinsa", "Ya yi mini aikin gafara", "Kayan laifina ya dauka kuwa kan gicciye"] },
          { verse: 2, text: ["Na ji zancen ladan zunubi, Tsoron mutuwa ya kama ni", "Sai na je gurin Mai Ceto, Kan gicciye fa."] },
          { verse: 3, text: ["Yanzu ba na mulkin zuciyata, Yanzu Yesu shi ne sarkina", "Ina murna cikin, Raina yau, don gicciye."] },
          { verse: 4, text: ["Kauna wadda ta kawo ceto, Alherinsa ne ya zubo ta,", "Allah ya hada mu da Yesu, Gun gicciye."] }
        ],
        history: "Fanny Crosby ta rubuta wannan waƙar don bayyana sha'awar kasancewa kusa da gicciyen Yesu, wanda take gani a matsayin wurin warkarwa da haske."
      },
      "HBH97": {
        title: "Yesu Ja Ni Wurinka",
        number: "HBH97",
        author: "Fanny J. Crosby",
        composer: "William H. Doane",
        tune: "NEAR THE CROSS",
        meter: "7.6.7.6. With Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Jawo ni gun gicciyenka, Akwai mabulbula,", "Kyauta ce don warkaswa, Zubo daga gicciye."] },
          { verse: "Korus", text: ["A Gicciye, A gicciye, Zama daukakata,", "Har raina ya sulhuntu, Daga nan, har sama."] },
          { verse: 2, text: ["Kauna da alherinka, Gicciyenka ya ba ni,", "Can tauraruwar safe, Ke bi da ni kullum."] },
          { verse: 3, text: ["Kurkusa da gicciyenka, Dan rago na Allah,", "Taimaki rayuwata, Inuwarka ta bi ni."] },
          { verse: 4, text: ["Kurkusa da gicciyen,ka, Bangaskiya da bege,", "Zan yi tsaro, zan jira, Har in ga fuskarka. AMIN."] }
        ],
        history: "Fanny Crosby ta rubuta wannan waƙar don bayyana sha'awar kasancewa kusa da gicciyen Yesu, wanda take gani a matsayin wurin warkarwa da haske."
      },
      "HBH98": {
        title: "Akwai Birni Can Mai Nisa",
        number: "HBH98",
        author: "Cecil F. Alexander",
        composer: "George C. Stebbins",
        tune: "GREEN HILL",
        meter: "C. M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Akwai birni can mai nisa, Ba ta da ganuwa,", "Can aka gicciye Mai Ceto, Ya mutu domina."] },
          { verse: "Korus", text: ["Mai Ceto ya kaunace mu, Mu ma yi kaunarsa,", "Gaskanta jini mai fansa, Mu aika nufinsa."] },
          { verse: 2, text: ["Ba za mu iya sani ba, Wahalar da ya sha;", "Mu yarda domin laifinmu, Ya mutu kan gicciye."] },
          { verse: 3, text: ["Ya mutu don zunubanmu, Domin mu tsarkaka,", "Domin mu shiga mulkinsa, Ta wurin jininsa."] },
          { verse: 4, text: ["Ba abin da ya fi wannan, Ya biya zunubanmu,", "Don ya bude kofar sama, Mu shiga mulkinsa. AMIN."] }
        ],
        history: "Cecil Alexander ta rubuta wannan waƙar don taimaka wa yara su fahimci ma'anar mutuwar Yesu a wajen birnin Urushalima domin cetonmu."
      },
      "HBH99": {
    title: "Randa Na Ga Mai Cetona",
    number: "HBH99",
    author: "Isaac Watts",
    composer: "Lowell Mason",
    tune: "HAMBURG",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Randa na ga Mai Cetona, A kalfari kan gicciye;", "Na ga kaunar Ubangijina, Ba shi dukan zuciyata."] },
      { verse: 2, text: ["Ya mutu dai don laifina, Wahalata shi ne ya sha;", "Wane ni fa har da zan ki in, Karbi kyautar cetonsa?"] },
      { verse: 3, text: ["Ga jininsa ya bayar dai, Ga radadin sa domina;", "Ya Ubangiji, karbe ni, Ka yafe mini laifina."] },
      { verse: 4, text: ["Na gode maka, ya Yesu, Don dukan aikin cetona;", "Na baka rai da zuciya duk, Ni naka ne har abada. AMIN"] }
    ],
    history: "Isaac Watts ya rubuta wannan waƙar a matsayin bimbini a kan gicciye, yana ɗaukar sa a matsayin babban abin mamaki da yake buƙatar dukan ranmu."
  },
  "HBH100": {
    title: "Gicciyen Kristi Da Daukaka",
    number: "HBH100",
    author: "John Bowring",
    composer: "Ithamar Conkey",
    tune: "RATHBUN",
    meter: "8. 7. 8. 7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1825",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Gicciyen Kristi da daukaka, Ya fi dukan zamanai,", "Dukan labaran duniya, Sun taru kalkashinsa."] },
      { verse: 2, text: ["In damuwa ta fi karfina, Rashin bege da tsoro,", "Gicciyen ba zai yashe ni ba, Ga salama da murna."] },
      { verse: 3, text: ["Ga rana na haskakawa, Hanyar da nake ta bi;", "Daga gicciyen hasken rai, Yana ba ni salama."] },
      { verse: 4, text: ["Farin ciki, da damuwa, Gicciyen ya tsarkake su;", "Salama babu iyaka, Ga murna har abada. AMIN."] }
    ],
    history: "John Bowring ya rubuta wannan waƙar bayan ya ga ragowar wata coci a Macao inda gicciye kaɗai ya rage a tsaye, yana nuna ikon Kristi madawwami."
  },
  "HBH101": {
    title: "Mai Ceto Ya Zubda Jini",
    number: "HBH101",
    author: "Isaac Watts",
    composer: "Hugh Wilson",
    tune: "AVON",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1707",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mai Ceto ya zubda jini, Har ya kai ga mutuwa?", "Zai kaskantar da kansa, Har mutuwa domina?"] },
      { verse: 2, text: ["Domin zunubaina ne ya, Yi kuka kan gicciye?", "Babban tausayi, Alheri, Da kauna mai girma!"] },
      { verse: 3, text: ["Har rana ta daina haske, Ta bar haskakawa;", "Yesu mai iko ya mutu, Domin mai zunubi."] },
      { verse: 4, text: ["Shan wahalarsa domina, Ba zan iya biya;", "Na ba ka raina ya Yesu, Iyakar abin yi. AMIN."] }
    ],
    history: "Isaac Watts ya rubuta wannan waƙar don yin tunani a kan babban sadaukarwar da Yesu ya yi domin masu zunubi sa'ad da ya zubda jininsa."
  },
  "HBH102": {
    title: "Madaukaki Mai Daraja",
    number: "HBH102",
    author: "Henry H. Milman",
    composer: "Charles Burney",
    tune: "TRURO",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1827",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Madaukaki mai daraja! Dangogi sun ce Hossana,", "Mai ceto, sun shimfida ganye, Riguna kan hanya."] },
      { verse: 2, text: ["Madaukaki mai daraja! Ka bi hanyar har mutuwa;", "Yesu, nasararka ta faru da, Mutuwa da zunubi."] },
      { verse: 3, text: ["Madaukaki mai daraja! Shugaban sararin sama;", "Dube mu da idon rahama, Da wahalar da muke sha."] },
      { verse: 4, text: ["Madaukaki mai daraja! Ka bi hanyar har mutuwa;", "Ka jikanmu, mu kasassu, Sai ka karbi girma Allah.", "AMIN."] }
    ],
    history: "Henry Milman ya rubuta wannan waƙar don Lahadin Dabino, yana kwatanta shigar Yesu Urushalima cikin ɗaukaka sa'ad da yake fuskantar mutuwarsa."
  },
  "HBH103": {
    title: "Yesu Dutsen Cetona",
    number: "HBH103",
    author: "Augustus M. Toplady",
    composer: "Thomas Hastings",
    tune: "TOPLADY",
    meter: "7.7.7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1776",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu, dutsen cetona, Bar in buya wurinka,", "Jinin, fansar mutane, Ruwan, tsarkakewar rai,", "Ga su, suna zubowa, Daga cikin zuciyarka."] },
      { verse: 2, text: ["Hannun wofi fa na zo, Jinkanka ne nake so,", "Dukan zuciya, dukan rai, Duk kazanta ne kadai,", "Ga ni wurin gicciyenka, Ina neman gafara"] },
      { verse: 3, text: ["Kome yawan aikina, Bai isa cetona ba,", "Ko ban huta ba dadai, Kullum ina hawaye,", "Dukan wannan banza ne, Kai kadai Mai Ceto ne"] },
      { verse: 4, text: ["Ran da za a binne ni, Ko kuwa za a fyauce ni,", "Ran da zan bar duniyan nan, Zan dai gan ka zaune can", "Amma kamin ranan nan, Bar in buya wurinka.", "AMIN."] }
    ],
    history: "An ce Augustus Toplady ya rubuta wannan waƙar sa'ad da yake neman mafaka daga guguwa a cikin kogon dutse, yana amfani da shi azaman misalin samun tsira a wurin Kristi."
  },
  "HBH104": {
    title: "Daren Nan A Cikin Jeji",
    number: "HBH104",
    author: "William B. Tappan",
    composer: "William B. Bradbury",
    tune: "OLIVE'S BROW",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1822",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Daren nan, a cikin jeji, Taurari sun daina haske,", "Cikinsa, Mai Ceto ya ratsa, Shi kadai da addu'a."] },
      { verse: 2, text: ["Daren nan, ya gama komai, Immanuel yayi kokawa,", "Almajiransa sun kasa, Su jimre da wahalarsa."] },
      { verse: 3, text: ["Daren nan, ya dauki zunuban, Mutane da jininsa;", "Kristi bai manta da wahalar, Da ya sha dominmu ba."] },
      { verse: 4, text: ["Daren nan, can cikin sama, Mala'iku sun raira waka;", "Duniya ba ta ji wakar ba, Wanda ta rage zafinsa.", "AMIN."] }
    ],
    history: "William Tappan ya rubuta wannan waƙar game da azaba da kuma kaɗaicin da Yesu ya ji a gonar Gethsemane kafin a kama shi."
  },
  "HBH105": {
    title: "Je Gonar Gethsamani",
    number: "HBH105",
    author: "James Montgomery",
    composer: "Richard Redhead",
    tune: "GETHSAMANE",
    meter: "7. 7. 7. 7. 7. 7",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "1820",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Je gonar Gethsamani, Masu tsoron jaraba;", "Ku ga wahalar Yesu, Kalle shi sa'a daya!", "Kada ku juya baya; Koyi addu'ar Yesu."] },
      { verse: 2, text: ["Bi shi har dakin shari'a; Ga yadda an daure shi;", "Da zafi da radadi! Har da dukan da ya sha;", "Kada ku guje masa; Yi koyi da gicciye."] },
      { verse: 3, text: ["Ya hau tudun gicciye; Kalkashin kafafunsa;", "Alamar mu'ajizai, Ya kammala hadaya.", "\"Ya kare\" Yesu ya ce; Yi koyi da gicciye."] },
      { verse: 4, text: ["Sammako zuwa kabari, Inda aka ajiye shi;", "Ko'ina ya yi duhu, Wa ya dauki jikinsa?", "Ya tashi duk mun gan shi; Mai Ceto ka tashe mu.", "AMIN."] }
    ],
    history: "James Montgomery ya rubuta wannan waƙar don ya ja-goranci masu bi ta matakai na ƙarshe na tafiyar Yesu a duniya, tun daga Gethsemane har zuwa kabari."
  },
  "HBH106": {
    title: "Mai Albarka Mai Fansa",
    number: "HBH106",
    author: "Ba a sani ba",
    composer: "William J. Kirkpatrick",
    tune: "REDEEMER",
    meter: "9. 9. 9. 9.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Azaba da MutuwarSa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Hanyar Kalfari da ban tsoro,", "Yesu ya shiga da gajiya;", "Ya dauki zunuban mutane,", "Don ya cece mu daga mutuwa."] },
      { verse: "Korus", text: ["Mai albarka! Mai daraja ne!", "Na gan shi kan gicciye na Kalfari;", "Jini ko'ina, don mai zunubi", "Ba mu kula ba duk domina."] },
      { verse: 2, text: ["\"Uba, gafarta\", addu'arsa,", "Duk jikinsa na zubda jini;", "Duk da haka ya yi addu'a,", "Babu mai kauna irin Yesu."] },
      { verse: 3, text: ["Ina kaunarsa, Mai Cetona,", "Yaya zan yabe ka koyaushe?", "Shekaru masu yawa a sama,", "Zan yi yabonsa har abada."] }
    ],
    history: "William Kirkpatrick ya rubuta wannan waƙar don nuna girman ƙaunar Yesu sa'ad da ya sha wahala a Kalfari domin ya ceci masu zunubi."
  },
  "HBH107": {
    title: "Jayayyan Mu Ta Kare",
    number: "HBH107",
    author: "Latin, 1695",
    composer: "Giovanni P. da Palestrina",
    tune: "VICTORY",
    meter: "8. 8. 8. 4. with Hallelujas",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1591",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Jayayyarmu fa ta kare, Mun riga mun yi nasara,", "Mun fara wakar nasara, Halleluya."] },
      { verse: 2, text: ["Mutuwa ta yi ikonta, Amma Yesu ya fi ta,", "Bar mu raira wakar murna, Halleluya."] },
      { verse: 3, text: ["Bayan kwanaki uku fa, Ya tashi daga matattu,", "Daukaka ga shi Yesunmu, Halleluya."] },
      { verse: 4, text: ["Uba yadda ka wahala, Daga duk zafin mutuwa,", "Domin bayinka su rayu, Halleluya. AMIN."] }
    ],
    history: "Wata tsohuwar waƙar Latin ce da take yin bikin nasarar Yesu a kan mutuwa bayan kwanaki uku a kabari, tana kiranmu mu yi murna."
  },
  "HBH108": {
    title: "Mu Yi Murna Ubangiji Sarki Ne",
    number: "HBH108",
    author: "Charles Wesley",
    composer: "John Darwell",
    tune: "DARWELL",
    meter: "6.6.6.6.8.8.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1744",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mu yi masa yabo, Don Uba Sarki ne,", "Mu yi murna da godiya, Domin nasara,", "Ku kuma tada muryarku, Ku yi murna, Ku yi murna."] },
      { verse: 2, text: ["Mai Ceto na mulki, Shi Allah Mai kauna,", "Ya dau zunubanmu, Yana zaune a can,", "Ku kuma tada muryarku, ku yi murna, Ku yi murna."] },
      { verse: 3, text: ["Shi Mai iko duka, Baya kuwa faduwa,", "Makullin mutuwa, Na wurin Yesunmu,", "Ku kuma tada muryarku, Ku yi murna, Ku yi murna.", "AMIN."] }
    ],
    history: "Charles Wesley ya rubuta wannan waƙar don ƙarfafa masu bi su yi murna da yabo domin Kristi yana mulki a matsayin Sarki madawwami."
  },
  "HBH109": {
    title: "Ku Tsarkaku Sai Ku Zo",
    number: "HBH109",
    author: "John of Damascus",
    composer: "Arthur S. Sullivan",
    tune: "ST. KEVIN",
    meter: "7.6.7.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "8th Century",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ku tsarkaku sai ku zo, Yi murnar nasara,", "Don Ya cece 'ya'yansa, Daga bakin ciki,", "Yi murna, Urshelima, Da kauna ta gaskiya,", "Kada ku yi damuwa, Yesunmu yana nan"] },
      { verse: 2, text: ["Ranar ta murna ce yau, Don Yesu ya kwance,", "Duk daurarru na Shaidan, Haske ya haska ra-", "Yuwanmu ta zunubi, Duhu na shudewa,", "Don wannan hasken sa fa, Godiya ta tabbata."] },
      { verse: 3, text: ["Mu raira halleluya, Ga Yesu Sarkinmu,", "Wanda Ya yi nasara fa, Daga mutuwa,", "Halleluya, ga Yesu, Dan rago na Allah,", "Halleluya fa ga shi, Ruhun Allah. AMIN."] }
    ],
    history: "Wannan waƙar Easter ce daga ƙarni na takwas wadda John na Damascus ya rubuta, tana kiran dukan duniya ta yi murnar tashin Yesu."
  },
  "HBH110": {
    title: "Maraba Ke Safiya Mai Kyau",
    number: "HBH110",
    author: "Venantius Fortunatus",
    composer: "Ba a sani ba",
    tune: "HEEMAS",
    meter: "6.5.6.5.D. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "6th Century",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Maraba, ke safiya, Kullum za ta ce,", "Jahannama ta shude, Sama ta samu,", "Matattu na raye, Allah rayayye,", "Shi ne mahalicci, Aikinsa ya yi."] },
      { verse: "Korus", text: ["Maraba, safiya, Kullum za ta ce,", "Jahannama ta shude, Sama ta samu yau."] },
      { verse: 2, text: ["Duniya ta Shai-dan, zafi na zuwa,", "Duk kyautai tare da sarkinta mai zuwa,", "Ko'ina na da kyau, rassa da ganye,", "Babu bakin ciki, ya yi nasara."] },
      { verse: 3, text: ["Zo amintattuna, cika alkawari,", "Safiyarka ta uku, tashi kai mai rai!", "Haska da fuskarka, kowa ya gani,", "Mai da haskenmu yau; rana taka ce! AMIN."] }
    ],
    history: "Wata tsohuwar waƙar yabo ce ta Easter wadda take gaishe da safiyar tashin matattu, tana nuna yadda hasken Kristi ya korar duhun jahannama."
  },
  "HBH111": {
    title: "Ranar Tashin Matattu",
    number: "HBH111",
    author: "John of Damascus",
    composer: "Ba a sani ba",
    tune: "GREEMLAND",
    meter: "7.6.7.6.7.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "8th Century",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ranar tashin matattu, Ku shaida ga duniya", "Ranar ta farin ciki, Rana ce ta Allah,", "Da ya tashi daga, Matattu zuwa sama,", "Yesu ya zo mana da, Waka ta nasara."] },
      { verse: 2, text: ["Mu nesanta zunubi, Don gani da kyau,", "Abin da Uba Ya yi, Don tashin matattu,", "Mu kuma saurare shi, Mu ji da kyau,", "Yadda aka yabe shi, Domin nasaransa."] },
      { verse: 3, text: ["Bar sammai su yi murna, Duniya ta raira,", "Wakoki na nasara, Da abin da ke nan,", "Da dukan abubuwan, Da ke nan fa,", "Gama Yesu ya tashi, Murna ba iyaka. AMIN."] }
    ],
    history: "Wannan wata waƙar John na Damascus ce wadda take bayyana ranar tashin matattu a matsayin rana ta farin ciki da nasara ga dukan halitta."
  },
  "HBH112": {
    title: "Yesunmu Ya Tashi",
    number: "HBH112",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "KIRN",
    meter: "11.11.12.11.11.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesunmu ya tashi, Ya dakile Shaidan,", "Shi da mala'ikunsa, Da fa karfinsa."] },
      { verse: "Korus", text: ["Raira halleluya! Raira halleluya !", "Raira halleluya! Tare da murna,", "Shaidan ya kasa fa, Kristi ne Sarki."] },
      { verse: 2, text: ["Ikon ka ya kare, Mutuwa don ma", "Fiye da kai ya shigo, Babu tsoro kuma,"] },
      { verse: 3, text: ["Mulkin ka ya kare, Ya kai zunubi,", "Ko da fa kana nan, Ba mua tsoronka."] },
      { verse: 4, text: ["Yesunmu Ya tashi, Gari ya waye,", "Daren ku fa ya, Riga ya wuce."] }
    ],
    history: "Waƙa ce ta nasara da take bayyana yadda tashin Yesu ya ruguza ikon Shaiɗan da na mutuwa, tana kiran dukan halitta su yi halleluya."
  },
  "HBH113": {
    title: "Can Cikin Kabari Kwance",
    number: "HBH113",
    author: "Robert Lowry",
    composer: "Robert Lowry",
    tune: "CHRIST AROSE",
    meter: "6.5.6.5.6.5. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1874",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Can cikin kabarin, Yesu Mai Ceto,", "Ya kwana uku fa, Ubangiji."] },
      { verse: "Korus", text: ["Ya tashi a kabari, Ya yi nasara a kan Shaidan,", "Ya yi nasara a kan mulkin Shaidan,", "Zai kuma yi mulkin dukan tsarkaku,", "Ya tashi, ya tashi, Halleluya ya tashi."] },
      { verse: 2, text: ["An tsare kabarin, Yesu Mai Ceto,", "Banza ne hatimi, Ubangiji."] },
      { verse: 3, text: ["Ya raina mutuwa, Yesu Mai Ceto,", "Ya tsinke tsarkoki, Ubangiji."] }
    ],
    history: "Robert Lowry ya rubuta wannan waƙar don kwatanta bambanci tsakanin shiru na kabari da kuma ƙarfin tashin Yesu da nasara."
  },
  "HBH114": {
    title: "Halleluya Kristi Ya Tashi",
    number: "HBH114",
    author: "James McGranahan",
    composer: "James McGranahan",
    tune: "MCGRANAHAN",
    meter: "8.7.8.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Halleluya! Halleluya! Tada murya zuwa sama,", "Raira ga Allah da murna, Raira yabo ga Allah,", "Shi wanda Ya ba da ransa,Domin ceton duniya,", "Yesu Kristi madaukaki, Ga shi yau fa ya tashi."] },
      { verse: 2, text: ["Ya fa tashi, Yesu Kristinmu, Dan rago na Allah,", "Shi wanda aka gicciye, A cikin daukakarsa,", "Duniya duka sun gan Shi, Suka kuma tabbatar,", "Ya tashi fa cikin murna, Daga cikin kabari."] },
      { verse: 3, text: ["Halleluya! Halleluya! Daukaka ga Allahnmu,", "Halleluya ga Mai Ceto, Tushin kauna da fa rai,", "Halleluya ga Shi Ruhu, Bari mu girmama Shi,", "Halleluya! Yanzu da har, Abada ga su uku."] }
    ],
    history: "James McGranahan ya rubuta wannan waƙar don yaba wa Allah Uba, da Ɗa, da kuma Ruhu Mai Tsarki saboda aikin ceto da tashin Yesu."
  },
  "HBH115": {
    title: "Yesunmu Ya Tashi Yau",
    number: "HBH115",
    author: "Charles Wesley",
    composer: "Ba a sani ba",
    tune: "EASTER HYMN",
    meter: "7.7.7.7. with Hallelujas",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1739",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesunmu ya tashi yau, halleluya!", "Mala'iku na rairawa, halleluya!", "Raira wakar nasara, halleluya!", "Duniya da sama ku amsa, halleluya!"] },
      { verse: 2, text: ["Daukaka ga Sarkinmu, halleluya!", "Ina kike mutuwa, halleluya!", "Yesu shi ne Mai Ceto, halleluya!", "Ina burinka, kabari? Halleluya!"] },
      { verse: 3, text: ["Aikin Ceto fa ya yi, halleluya!", "Yi yaki don nasara, halleluya!", "Mutuwa ta sha kunya, halleluya!", "Kristi Ya bude hanya, halleluya!"] },
      { verse: 4, text: ["Ga murna fa ko'ina, halleluya!", "Domin shi Mai Cetonmu, halleluya!", "Za mu tashi kamarsa, halleluya!", "Mu dauki gicciyensa, halleluya! AMIN."] }
    ],
    history: "Charles Wesley ya rubuta wannan shahararriyar waƙar Easter wadda take cike da 'Halleluya' don yin bikin nasarar Kristi a kan kabari."
  },
  "HBH116": {
    title: "Yesunmu Zai Yi Mulki",
    number: "HBH116",
    author: "Isaac Watts",
    composer: "John Hatton",
    tune: "DUKE STREET",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1719",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesunmu zai yi mulki fa, Mulkinsa fa ba iyaka,", "Zai yi mulki a ko'ina, Mulkinsa fa har abada."] },
      { verse: 2, text: ["Mu zo gun addu'armu yau, Da raira wakar yabonsa,", "Sunansa na da dadin ji, Za mu yi ta masa yabo."] },
      { verse: 3, text: ["Mutane dukan duniya, Mu zauna cikin kaunarsa,", "Yara za su yi yabonsa, Don albarkunsa a kansu."] },
      { verse: 4, text: ["Bar duniya su tashi su, Daukaka shi fa Sarkinmu,", "Mala'iku su raira waka, Duniya duk su ce amin!", "AMIN."] }
    ],
    history: "Isaac Watts ya rubuta wannan waƙar don bayyana yadda mulkin Yesu zai yaɗu zuwa dukan sasannin duniya, yana kawo salama da albarka."
  },
  "HBH117": {
    title: "Kan Da An Sa Masa Kaya",
    number: "HBH117",
    author: "Thomas Kelly",
    composer: "Carl G. Glaser",
    tune: "AZMON",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1820",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kan da an sa masa kaya, Yau fa wannan kai ne,", "Yana dauke da rawani, Na yin nasara fa."] },
      { verse: 2, text: ["Murna na dukan mutane, Can sama da kasa,", "Ga wanda yake kaunarsa, Ya bayana ga su,"] },
      { verse: 3, text: ["Ga wadanda sun dau gicciye, Alherinsa na nan,", "Tare da su har abada, Su yi murna da Shi."] },
      { verse: 4, text: ["Ya dau gicciye domin rai, Abin kunya ga Shi,", "Bege ne ga mutanensa, Taken har abada. AMIN."] }
    ],
    history: "Thomas Kelly ya rubuta wannan waƙar don kwatanta yadda Yesu, wanda aka wulakanta da rawanin ƙaya, yanzu yake sanye da rawanin nasara a sama."
  },
  "HBH118": {
    title: "Ga Mai Ceto Zaune Kan Kursiyi",
    number: "HBH118",
    author: "Anne Steele",
    composer: "Thomas Hastings",
    tune: "ORTONVILLE",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Tashi da Daukakarsa",
    year: "1760",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ga Mai Ceto zaune a can, A bisan kursiyinsa,", "Cike fa da daukakarsa, Ga fa alherinsa,", "Yana fa zubowa."] },
      { verse: 2, text: ["Babu kamani kamarsa, A dukan duniya,", "Shi ne fa mafi adalci, Duk sama da kasa", "Duk sama da kasa."] },
      { verse: 3, text: ["Ya gan ni cikin wahala, Ya zo ya cece ni,", "Ya sha kunya domina fa, Ya dau damuwata,", "Ya dau damuwata."] },
      { verse: 4, text: ["Dukan raina fa nasa ne, Da dukan murnata,", "Ya sa ni na yi nasara, A bisan mutuwa,", "Da kuma kabari. AMIN."] }
    ],
    history: "Anne Steele ta rubuta wannan waƙar don yin bimbini a kan girman Yesu a matsayinsa na Sarki mai adalci wanda yake zaune a kan kursiyin alheri."
  },
  "HBH119": {
    title: "Ran Da Ubangiji Za Ya Dawo",
    number: "HBH119",
    author: "Ba a sani ba",
    composer: "D. Dutton",
    tune: "WOODSTOCK",
    meter: "10.7.10.7. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ran da Ubangiji za ya dawo, Don ya karbi masu bi", "Ko za ya iske ka kana tsaro, Ko fitilarka na ci."] },
      { verse: "Korus", text: ["Sai dai ka tabbata ka yi shiri, Ko an kira ka yanzu,", "Domin ka sadu da Ubangiji, Lalle, lalle ya fi kome", "kyau."] },
      { verse: 2, text: ["Ran da ya tafi, ya ba ka aiki, Wanda za ka dinga yi,", "ko ka yi aikinsa da aminci? Ko ka bata lokaci?"] },
      { verse: 3, text: ["Ran da ka mayar da talents naka, \"Bawan kirki\" za yace,", "\"Shiga ka huta a cikin gida\", Ko, \"kai mugun bawa ne\"?"] },
      { verse: 4, text: ["Ba daman shiri idan ka mutu, Ba ka iya rudin sa,", "Kada ka kasa ka shiga hutu, Domin rashin gaskiya.", "AMIN."] }
    ],
    history: "Wannan waƙar gargaɗi ce ga masu bi da su kasance cikin shiri da aminci, domin ba a san ranar da Ubangiji zai dawo ba."
  },
  "HBH120": {
    title: "Ko Da Safe Ne",
    number: "HBH120",
    author: "H. L. Turner",
    composer: "James McGranahan",
    tune: "CHRIST RETURNETH",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1878",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko da safe ne, gari yana wayewa,", "Hasken rana na budewa cikin duhu,", "Sa'ad da Yesu zai zo cikin daraja,", "Don ya tafi da nasa kuwa."] },
      { verse: "Korus", text: ["Ubangiji yaushe, yaushe za mu", "Raira waka, Kristi ya zo! Halleluya!", "Halluluya! Amin, Halleluya! AMIN"] },
      { verse: 2, text: ["Ko da rana, ko a farin wata ne,", "Ko kuwa a duhu na tsakar dare ne fa,", "Zai bayyana cikin hasken daraja,", "Yesu zai karbi nasa."] },
      { verse: 3, text: ["Runduna daga sama rairawa,", "Tare da tsarkaka suna saukowa,", "Da hasken daraja a wurinSa,", "Yesu zai tattara nasa."] },
      { verse: 4, text: ["Murna ce mai yawa babu sauran mutuwa,", "Ba ciwo ba bakin ciki babu kuka,", "An fyauce mu cikin darajar Allahnmu,", "In Yesu ya zo don nasa. AMIN."] }
    ],
    history: "H.L. Turner ya rubuta wannan waƙar don bayyana begen da masu bi suke da shi na dawowar Yesu cikin ɗaukaka don ya ɗauki nasa."
  },
  "HBH121": {
    title: "Yana Zuwa",
    number: "HBH121",
    author: "Thomas Kelly",
    composer: "Ba a sani ba",
    tune: "NEWCASTLE",
    meter: "9.6.9.6. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1809",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zai komo, da 'Ya Sha wahala\", Daukaka sama can;", "Zai zo da wakokin hosanna, Cikin gizagizai."] },
      { verse: "Korus", text: ["Halleluya! Halleluya! Zai sake dawowa;", "Za mu taru a wurinSa, In Ya zo ya yi mulki"] },
      { verse: 2, text: ["Mai Ceton mu yana zuwa fa, Dan rago da ya zo;", "Cikin darajar Ubansa, Zai yi mulkin duniya."] },
      { verse: 3, text: ["Zai komo, shi Ubangijinmu, Mai fansa, Sarkinmu,", "Zo mu gan Shi cikin daraja, Za mu yi yabonSa."] },
      { verse: 4, text: ["Zai tara zababbun nasa duk, Ana kiransu da Shi;", "Fansassu daga kabilu duk, Su ne mallakarsa."] }
    ],
    history: "Thomas Kelly ya rubuta wannan waƙar don bayyana yadda Yesu zai sake dawowa cikin girma, yana kira ga dukan halitta su yi masa sujada."
  },
  "HBH122": {
    title: "Raina Ka Tashi Ka Mike",
    number: "HBH122",
    author: "Robert Seagrave",
    composer: "James Nares",
    tune: "ANSTERDAM",
    meter: "7.6.7.6.7.7.7.6.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1742",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Raina tashi ka mike, Ka san makomarka;", "Kar ka tsaya ko'ina fa, Ka nufa sama fa:", "Rana, wata za su kau, Duniya ma za ta shude;", "Mike raina ka tafi, Mazauninka sama."] },
      { verse: 2, text: ["Koguna sun gangara, Kuwa teku duka;", "Wuta daga sama fa, Ta sa mu hanyarsa:", "Raina daga Allah ne, Yana so ya ga fuskarSa,", "Ya nufa zuwa wurinsa, Ya huta a hannunSa."] },
      { verse: 3, text: ["Raina ka daina damuwa, Matsa zuwa lada;", "Yesu zai zo da sauri, Mai nasara ne Shi,", "Za mu kai ga saninSa, Za a ce mu huta,", "Mun bar damuwa baya, Yanzu muna sama. AMIN."] }
    ],
    history: "Robert Seagrave ya rubuta wannan waƙar don ƙarfafa rai ya tashi ya nufi gidan sa na gaskiya a sama, domin duniya za ta shude."
  },
  "HBH123": {
    title: "Yana Zuwa Da Girgije",
    number: "HBH123",
    author: "Charles Wesley",
    composer: "Henry Smart",
    tune: "REGENT SQUARE",
    meter: "8.7.8.7.8.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1758",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yana zuwa da girgije, Ya mutu don cetonmu,", "Tsarkaka dubbai a wurin, Na yabon nasararSa:", "Halleluya, halleluya! Allah ya zo yin mulki"] },
      { verse: 2, text: ["Kowane ido zai gan Shi, Yafe da daukakarSa;", "Wadanda sun sayar da Shi, Sun gicciye Shi a itace,", "Suna kuka, suna kuka, Ko za su ga Mai ceto."] },
      { verse: 3, text: ["Mai Ceto da ake jira, Ga Shi cikin daraja;", "Wadanda sun kaunace Shi; Za su sadu da shi fa,", "Halleluya, halleluya! Ranar Allah ce ta zo."] },
      { verse: 4, text: ["Bari duka su yabe ka, Zaune a kan kursiyi;", "Iko daraja naka ne, Mulki duka naka ne:", "Zo da sauri, zo da sauri! Madawwami, ka sauko.", "AMIN"] }
    ],
    history: "Charles Wesley ya rubuta wannan shahararriyar waƙar game da zuwan Yesu na biyu cikin girgije, inda kowane ido zai gan shi a matsayin Mai Shari'a da Mai Ceto."
  },
  "HBH124": {
    title: "Akwai Haske Kan Duwatsu",
    number: "HBH124",
    author: "Mary L. Lathbury",
    composer: "Louis von Esch",
    tune: "AUTUMN",
    meter: "8.7.8.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Akwai haske kan duwatsu, Itatuwa na yin huda,", "Sa'ad da za mu ga kyau fa da, Daukaka ta sarkin:", "Zukatanmu na ta jira, Jira fa ya yi tsawo,", "Ranar nasara na zuwa, Da waka mu gaishe ta."] },
      { verse: 2, text: ["Hasken taurari na raguwa, Za mu ga hasken safe,", "Hasken mutane na raguwa, Cikin darajar yamma;", "Gabas tana ta yin haske, Kamar da hasken wuta,", "Zukata na ta kadawa, Cike da yawan buri."] },
      { verse: 3, text: ["An yi shuru na saurara, Ba a jin motsin komai,", "Lumfashin Allah na motsi, A cikin anniyar addu'a;", "Yesu da ya sha wahala, Shi ne a kan kursiyi,", "Wahala ta ruhunmu fa, Ta zama tasa ce ma."] },
      { verse: 4, text: ["Ga muryar waka a nesa, Tana amo da yawa;", "Wakar nasara ta Yesu, Sarkinmu Immanuel!", "Je da murna ku tarbe Shi! Raina na saurin kawo,", "Abu da yake da kyau ma, Domin nasarar Sarkin!", "AMIN."] }
    ],
    history: "Mary Lathbury ta rubuta wannan waƙar don kwatanta begen da masu bi suke da shi yayin da suke jiran ranar nasara ta Sarki Immanuel."
  },
  "HBH125": {
    title: "In Yau Ne Fa?",
    number: "HBH125",
    author: "Charles H. Gabriel",
    composer: "Charles H. Gabriel",
    tune: "SECOND COMING",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1909",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu zai sake zuwa duniya,", "Ko zuwansa yau ne?", "Zai zo cikin iko don mulki,", "Ko zuwansa yau ne fa?", "Zai zo ya dauki Amaryarsa,", "Dukan fansassu da tsarkaka", "watse a dukan duniya,", "Ko zuwansa yau ne fa?"] },
      { verse: "Korus", text: ["Ubangiji! Murna zai kawo fa,", "Ubangiji! Ya zama Sarkinmu;", "Ubangiji! A shirya hanya fa,", "Ubangiji! Yesu zai sake zuwa"] },
      { verse: 2, text: ["Mulkin Shaidan zai kawo karshe", "Da ma a ce yau ne!", "Babu kunci ba bakin ciki,", "Da ma a ce yau ne!", "Masu bi za su tashi kuwa, su tarbe,", "Shi sararin sama,", "Yaushe za mu ga da-ra-jar nan?", "Da ma a ce yau ne?"] },
      { verse: 3, text: ["Zai iske mu cikin aminci:", "Ko zuwansa yau ne?", "Muna tsaro da murna sosai,", "In ya zo fa a yau?", "Alamun zuwanSa na da yawa,", "Hasken safiya a can gabas,", "Muna tsaro lokaci na zuwa,", "Da ma a ce yau ne?"] }
    ],
    history: "Charles H. Gabriel ya rubuta wannan waƙar don tambayar masu bi ko a shirye suke idan har yau ne ranar da Yesu zai sake dawowa duniya."
  },
  "HBH126": {
    title: "Ubangiji Yana Zuwa",
    number: "HBH126",
    author: "John Milton",
    composer: "Jeremiah Clark",
    tune: "ST. MAGNUS",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1623",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ubangiji yana zuwa, Ba da jinkiri ba;", "GabanSa fa ga adalci, Mai shelar zuwanSa."] },
      { verse: 2, text: ["Gaskiya a duniya, kamar fure, Za ta bude kanta;", "Gaskiya ta zo daga sama, Don duk 'yan adam."] },
      { verse: 3, text: ["Da iko Allah, yi shari'a, Bisa duniyan nan,", "Gama kai bisa ga iko, Al'ummai naka ne."] },
      { verse: 4, text: ["Mai girma, mai al'ajibai, Ka yi dukan komai;", "A madawwamin kursiyinka, Kai ne kadai Allah.", "AMIN."] }
    ],
    history: "Shahararren marubucin nan John Milton ya rubuta wannan waƙar don bayyana adalci da gaskiyar Allah yayin da yake mulkin duniya."
  },
  "HBH127": {
    title: "Na San Mai Cetona Yana Da Rai",
    number: "HBH127",
    author: "Jessie Brown Pounds",
    composer: "James H. Fillmore",
    tune: "HANNAH",
    meter: "9.8.9.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Dawowansa",
    year: "1897",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na san mai ceto yana da rai, A duniya zai sake tsayawa", "Yana ba da rai madawwami, Duk alheri na hannunSa."] },
      { verse: "Korus", text: ["Na san, na san Yesu Yana da rai,", "A duniya zai sake tsayawa;", "Na san na san rai yake bayaswa,", "Alheri iko naSa ne."] },
      { verse: 2, text: ["AlkawarinSa gaskiya ce, maganarsa tana da rai;", "Kodayake ni zan mutu, Amma zan gan Shi wata ran."] },
      { verse: 3, text: ["Yana shirya wuri domina, Inda yake nan zan zauna;", "Na sani yana lura da ni, A karshe zai zo domina."] }
    ],
    history: "Jessie Brown Pounds ta rubuta wannan waƙar don bayyana tabbacin da take da shi cewa Yesu yana da rai kuma zai sake tsayawa a duniya."
  },
  "HBH128": {
    title: "Zo Mu Raira Waka Mai Girma",
    number: "HBH128",
    author: "Samuel Medley",
    composer: "John Hatton",
    tune: "DUKE STREET",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1782",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zo raira waka mai girma, Mu ta da murya ga Yesu;", "Sujada da godiya, Duk nasa ne har abada."] },
      { verse: 2, text: ["IkonSa ya halicemu; Ruhunmu lumfashinsa ne;", "Don zunubanmu ya mutu, Ya cece mu daga wuta."] },
      { verse: 3, text: ["Don kowa ya san kaunarSa, Murna ta cika zukata;", "Tsarkaku duniya da sama, Su raira wakar yabonSa."] },
      { verse: 4, text: ["Yabi Dan rago da waka, A yi ta raira yabonSa,", "Sujada godiya nasa ne, Mai mulki ne har abada.", "AMIN"] }
    ],
    history: "Samuel Medley ya rubuta wannan waƙar don kiran kowa ya raira waƙar yabonsa ga Yesu, wanda ya halicce mu kuma ya fanshe mu."
  },
  "HBH129": {
    title: "Harsuna Dubbai Su Raira",
    number: "HBH129",
    author: "Charles Wesley",
    composer: "Carl G. Glaser",
    tune: "AZMON",
    meter: "C. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1739",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Harsuna dubbai su raira, Wakar mai fansa,", "Daukaka ta Allah sarki; Nasara da ya yi!"] },
      { verse: 2, text: ["Ubangiji da Allahna, Bi da ni in shaida,", "In yada cikin duniya, Darajar sunanka."] },
      { verse: 3, text: ["Sunan Yesu na karfafa, Na kawas da tsorona;", "Sunan nan na da dadin ji, Don rai da salama."] },
      { verse: 4, text: ["Ya karya ikon zunubi, Ya kwance daurarru;", "JininSa mai tsarkakewa, Ya wanke zuciyata.", "AMIN."] }
    ],
    history: "Charles Wesley ya rubuta wannan waƙar don yin bikin cikar shekara ɗaya da samun cetonsa, yana kiran harsuna dubbai su yaba wa Allah."
  },
  "HBH130": {
    title: "Yesu Ya Zo Don Cetonmu",
    number: "HBH130",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BENTON HARBOR",
    meter: "6.7.6.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu ya zo don cetonmu, Yesu Mai Cetonmu,", "Yanzu na sami cetona, Wurin Yesu Mai Ceto."] },
      { verse: "Korus", text: ["Ina murna don Yesu, Shi ne Ya cece ni,", "Shi Ya ba ni salama, Cikin zuciyata."] },
      { verse: 2, text: ["Na yabe shi don kaunarsa, Yesu Mai Cetonmu,", "Da Ya shirya ni da Allah, Yanzu na sami ceto."] },
      { verse: 3, text: ["Ya wanke duk zunubaina, Yesu Mai Cetonmu,", "Yanzu yana mulkin raina, Yanzu na sami ceto."] },
      { verse: 4, text: ["Ya ba ni ikon nasara, Yesu Mai Cetonmu,", "Don yin nasara a kullum, Yanzu na sami ceto. AMIN."] }
    ],
    history: "Waƙa ce ta murna wadda take bayyana farin cikin samun ceto ta wurin Yesu, wanda yake ba da salama da nasara a kan zunubi."
  },
  "HBH131": {
    title: "Akwai Sunan Da Nake Son Ji",
    number: "HBH131",
    author: "Frederick Whitfield",
    composer: "Ba a sani ba",
    tune: "OH NOW I LOVE JESU",
    meter: "C.M. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1855",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Akwai sunan da nake son ji, Ina son raira ta,", "Kamar waka ce gare ni, Suna ne mafi kyau."] },
      { verse: "Korus", text: ["Ni ina son Yesu, ni ina son Yesu,", "Ni ina son Yesu, don shi yana so na."] },
      { verse: 2, text: ["Sunan nan fa akwai kauna, Ya mutu domina,", "Ya zubda jini don fansa, Shi Yesu Mai Ceto,"] },
      { verse: 3, text: ["Yakan ba ni bege fa, A kowace rana,", "Ko da ina cikin duhu, Yakan haskaka ni."] },
      { verse: 4, text: ["Yakan nuna irin kaunar, Da shi yake da shi,", "Ya dau duk bakin cikinmu, Babu kamarsa. AMIN."] }
    ],
    history: "Frederick Whitfield ya rubuta wannan waƙar don nuna ƙaunarsa ga sunan Yesu, wanda yake jin sa kamar waƙa mai daɗi gare shi."
  },
  "HBH132": {
    title: "Mu Girmama Sunan Yesu",
    number: "HBH132",
    author: "Edward Perronet",
    composer: "Oliver Holden",
    tune: "CORONATION",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1780",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mu girmama sunan Yesu, Mu durkusa masa,", "Mu girmama Shi Yesunmu, Mu durkusa masa", "Mu girmama sunan Yesu, Mu durkusa masa"] },
      { verse: 2, text: ["Ku mutanen duniya duk, Ku da an cece ku,", "Ku girmama Shi Mai Ceto. Ku da an cece ku,", "Mu girmama sunan Yesu, Mu durkusa masa,"] },
      { verse: 3, text: ["Ku dangin duniya ko'ina, Cikin wannan duniya,", "Ku girmama shi Yesunmu, Cikin wannan duniya.", "Mu girmama sunan Yesu, Mu durkusa masa,."] },
      { verse: 4, text: ["Ya ku tsarkaku na Allah, Da muke gabansa,", "Za mu raira ga yabonsa, Da muke gabansa,", "Mu girmama sunan Yesu, Mu durkusa masa. AMIN."] }
    ],
    history: "Edward Perronet ya rubuta wannan shahararriyar waƙar yabonsa ga sunan Yesu, tana kiran dukan al'ummai su durƙusa masa (Tune: Coronation)."
  },
  "HBH133": {
    title: "Mu Girmama Sunan Yesu",
    number: "HBH133",
    author: "Edward Perronet",
    composer: "William Shrubsole",
    tune: "MILES LANE",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1779",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mu girmama sunan Yesu,", "Mu durkusa masa,", "Mu girmama Shi Yesunmu.", "Yesu, Yesu, Yesu, Mu girmama shi."] },
      { verse: 2, text: ["Ku mutanen duniya duk,", "Ku da an cece ku,", "Ku girmama Shi Mai Ceto,", "Shi Yesu, Yesu, Yesu, mu girmama shi."] },
      { verse: 3, text: ["Ku dangin duniya ko'ina,", "Cikin wannan duniya,", "Ku girmama shi Yesunmu,", "Shi Yesu, Yesu, Yesu, Mu girmama shi."] },
      { verse: 4, text: ["Ya ku tsarkaku na Allah,", "Da muke gabansa,", "Za mu raira ga yabonsa,", "Shi Yesu, Yesu, Yesu, Mu girmama shi. AMIN."] }
    ],
    history: "Wani salon waƙar Edward Perronet ne (Tune: Miles Lane), wadda take jaddada girmama sunan Yesu a matsayin Sarkin sarakuna."
  },
  "HBH134": {
    title: "Mu Girmama Sunan Yesu",
    number: "HBH134",
    author: "Edward Perronet",
    composer: "James Ellor",
    tune: "DIADEM",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1838",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mu girmama sunan Yesu, Mu durkusa masa,", "Mu durkusa masa, Mu girmama Shi Yesunmu."] },
      { verse: "Korus", text: ["Shi Yesu, Yesu, Yesu", "Yesu, mu girmama Yesu"] },
      { verse: 2, text: ["Ku mutanen duniya duk, Ku da an cece ku,", "Ku da an cece ku, Ku girmama Shi Mai Ceto."] },
      { verse: 3, text: ["Ku dangin duniya ko'ina, Cikin wannan duniya,", "Cikin wannan duniya, Ku girmama shi Yesunmu."] },
      { verse: 4, text: ["Ya ku tsarkaku na Allah, Da muke gabansa,", "Da muke gabansa, Za mu raira ga yabonsa. AMIN."] }
    ],
    history: "Wani salon waƙar Edward Perronet ne (Tune: Diadem), wadda take kiran dukan tsarkaku su raira waƙar yabo ga sunan Yesu."
  },
  "HBH135": {
    title: "Yesu Ina Tuna Da Kai",
    number: "HBH135",
    author: "Bernard of Clairvaux",
    composer: "John B. Dykes",
    tune: "ST AGNES",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1153",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu ina tuna da kai, Murna nake kullum,", "Bukata ta, in fa gan ka, Saboda hutawa."] },
      { verse: 2, text: ["Ba murya a wannan duniya, Ko kuwa sunan da,", "Yana da dadi fiye da, Sunan Mai Cetonmu."] },
      { verse: 3, text: ["Begen karyayyun zuciya, Murnar 'yan tawali'u,", "Mai kaunar marasa karfi, Da masu neman ka."] },
      { verse: 4, text: ["Ga wadanda sun same ka, Ba mai iya nuna,", "Kauna irin ta Yesunmu, Sam babu irin ta. AMIN."] }
    ],
    history: "Bernard na Clairvaux ya rubuta wannan waƙar a ƙarni na goma sha ɗaya, tana bayyana farin ciki da hutawar da ake samu yayin tuna da Yesu."
  },
  "HBH136": {
    title: "Yesu Murnar Dukan Kowa",
    number: "HBH136",
    author: "Bernard of Clairvaux",
    composer: "Henry Baker",
    tune: "QUEBEC",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1153",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu murnar dukan kowa, Kai ne hasken duk mutane,", "Mukan juyo gun ka domin, Niman farin ciki yanzu."] },
      { verse: 2, text: ["Gaskiyarka, ba ta canzawa, Ka cece masun nimanka,", "Kuma ga masun nimanka, Sukan same ka a kullum."] },
      { verse: 3, text: ["Begenka fa kullum muke, A duk kowani lokaci,", "Yayin da muka gan ka fa, Farin ciki muke yi fa."] },
      { verse: 4, text: ["Ya Yesu, kasance da mu, Don ka sa mu farin ciki.", "Kau da ayyuka na duhu, Ka haskaka duk duniya.", "AMIN."] }
    ],
    history: ""
  },
  "HBH137": {
    title: "Mu yabe shi",
    number: "HBH137",
    author: "Fanny Crosby",
    composer: "Chester G. Allen",
    tune: "JOYFUL SONG",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1869",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mu yabe shi! Yesu Mai Cetonmu duka,", "Duk duniya, mu raira don kaunarsa,", "Mu gaida shi,shi ne kadai madaukaki,", "Mu girmama daukakar sunansa,", "Yesu zai bi da mu, makiyayinmu,", "Ya rike mu cikin hannuwansa."] },
      { verse: "Korus", text: ["Mu yabe shi, mu shaida girman sunansa,", "Sai mu yabe shi, da farin ciki,"] },
      { verse: 2, text: ["Mu yabe shi, Yesu Mai Cetonmu duka,", "Don Ya mutu domin zunubanmu,", "Shi ne dutsen cetonmu, kuma begenmu,", "Gaida Yesu da aka gicciye,", "Yabe shi don ya dau duk damuwarmu,", "Da kuma dukan yawan kaunarsa."] },
      { verse: 3, text: ["Mu yabe shi Yesu Mai Cetonmu duka,", "Mala'iku suna raira yabonsa,", "Yesu shi ne mai mulki na har abada,", "Mu girmama shi babban Sarkinmu.", "Yesu na zuwa da duk nasararsa,", "Iko da daukaka gun sa yake."] }
    ],
    history: "Fanny Crosby ta rubuta wannan waƙar don kiran dukan duniya su yaba wa Yesu, Makiyayinmu mai ƙauna wanda ya mutu domincetonmu."
  },
  "HBH138": {
    title: "Sunanka Da Daraja",
    number: "HBH138",
    author: "Lydia Baxter",
    composer: "William H. Doane",
    tune: "GLORIOUS NAME",
    meter: "8.7.8.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1870",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ya Mai Ceto, mun yabe ka, Domin yawan kaunarka,", "Kai Mai iko, Kai mai Tsarki, Daukaka ne sunanka."] },
      { verse: "Korus", text: ["Daukaka, daukaka, Daukaka ne sunanka,", "Daukaka, daukaka, Daukaka ne sunanka,"] },
      { verse: 2, text: ["Ya Mai Ceto, Ubangiji, Hasken dukan duniya,", "Bar tsarkaku dukan duniya, Su yi raira yabonka."] },
      { verse: 3, text: ["Daga kursiyen daukaka, Zuwa gicciyen kunya,", "Ka fa mutu don cetonmu, Daga dukan zunubai."] },
      { verse: 4, text: ["Ka zo Ya Mai Ceton duniya, Zauna a kursiyinka,", "Ka yi mulki har abada, Dukan mulki naka ne.", "AMIN."] }
    ],
    history: "Lydia Baxter ta rubuta wannan waƙar don daukaka sunan Yesu, wanda yake da iko da tsarki a dukan duniya."
  },
  "HBH139": {
    title: "Ina Mamaki Gabansa",
    number: "HBH139",
    author: "Charles H. Gabriel",
    composer: "Charles H. Gabriel",
    tune: "MY SAVIOUR'S LOVE",
    meter: "8.7.8.7. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1905",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina mamaki gabansa, Yesu Kristi Mai Tsarki", "Ina mamakin kaunarsa, Ya fanshi zunubaina"] },
      { verse: "Korus", text: ["Al'ajibi! Al'ajibi! Wakar yabo ce zan yi", "Al'ajibi! Al'ajibi! Mai cetona kaunata"] },
      { verse: 2, text: ["Domina ya yi addu'a, A can cikin lambun nan", "Ya bada ransa domina, Don fansar zunubaina"] },
      { verse: 3, text: ["Mala'iku cikin tausayi, Sun ga ya zo daga can", "Domin su ta'azatad da shi, A cikin wahalunsa"] },
      { verse: 4, text: ["Ya dau dukan zunubaina, Ya maishe su fa nasa,", "Ya kai damuwata kalfari, Domina ya bada rai"] },
      { verse: 5, text: ["Tare da duk tsarkakkunsa, Zan dubi fuska tasa", "Zan raira wakar yabonsa, Don kaunarsa gare ni"] }
    ],
    history: "Charles H. Gabriel ya rubuta wannan waƙar don nuna mamakinsa ga ƙaunar Yesu da sadaukarwar da ya yi a lambun Gatsamani da kan gicciye."
  },
  "HBH140": {
    title: "Albarka Ga Sunansa",
    number: "HBH140",
    author: "William H. Clark",
    composer: "Ralph E. Hudson",
    tune: "BLESSED NAME",
    meter: "L.M. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1891",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Za mu raira ga Ubanmu, Albarka ga sunan Allah.", "Daukakar Allah sarkinmu, Albarka ga sunan Allah."] },
      { verse: "Korus", text: ["Mu daukaka shi, mu daukaka shi,", "Albarka ga sunan Allah.", "Mu daukaka shi, mu daukaka shi,", "Albarka ga sunan Allah"] },
      { verse: 2, text: ["Yesu, suna mai kau da tsoro, Albarka ga sunan Allah", "Sunan Yesu mai dadin ji, Albarka ga sunan Allah"] },
      { verse: 3, text: ["Ya karya ikon zunubi, Albarka ga sunan Allah", "Jininsa za ya wanke mu, Albarka ga sunan Allah"] }
    ],
    history: "William H. Clark ya rubuta wannan waƙar don daukaka sunan Allah Uba da sunan Yesu wanda yake kau da tsoro da wanke zunubi."
  },
  "HBH141": {
    title: "Ina Marmarin Shaida Labari",
    number: "HBH141",
    author: "Katherine Hankey",
    composer: "William G. Fischer",
    tune: "HANKEY",
    meter: "7.6.7.6.D. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1866",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina marmarin shaida, Ayyukan Yesunmu", "Da dukan daukakarsa, Da dukan kaunarsa,", "Ina marmarin shaida, Domin gaskiya ce,", "Ya kosad da zuciata, Fiye da kome duk."] },
      { verse: "Korus", text: ["Ina marmarin shaida", "Kalmarsa, daukakarsa", "Zan shaida labarinsa,", "Don yawan kaunarsa."] },
      { verse: 2, text: ["Ina marmarin shaida, In maimaita kullum", "Zan shaida labarin nan, Mai dadin ji sosai", "Ina marmarin shaida, Wasu ba su ji ba", "Labarin ceto kyauta, Daga wurin Allah"] },
      { verse: 3, text: ["Ina marmarin shaida, Ga wanda ya gane", "Gasu suna marmari, Su ji ta koyaushe,", "Cikin daukakar Allah, Zan raira wakata,", "Waka ce labarina, Da ina marmari."] }
    ],
    history: "Katherine Hankey ta rubuta wannan waƙar don bayyana marmarinta na shaida labarin ceto da ƙaunar Yesu ga waɗanda ba su ji ba."
  },
  "HBH142": {
    title: "Yesu Mai Al'ajibi",
    number: "HBH142",
    author: "C.F. Weigle",
    composer: "C.F. Weigle",
    tune: "NEW ORLEANS",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1932",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Babu yini mara dadi fa, Babu dare mai tsawo ma,", "Wanda ya jingina ga Yesu, Zai yi murna sosai."] },
      { verse: "Korus", text: ["Ya Yesu mai ban mamaki, Ya sa waka a zuciata", "Waka ce ta ceto da karfafawa, Ya sa waka a zuciata"] },
      { verse: 2, text: ["Babu gicciye mai nauyi fa, Babu rayuwa ta kaito,", "Yesu zai dauka maimakonmu,Don yana kaunarmu."] },
      { verse: 3, text: ["Babu damuwa ko kadan fa, Babu kuka ko yin rashi,", "Kaunarsa za ta koya mana, In mun dauki gicciye."] },
      { verse: 4, text: ["Babu wani mai zunubi fa, Babu wanda yake yawo,", "Cikin tausayin Ubangiji, Yesu zai yafe mu."] }
    ],
    history: "C.F. Weigle ya rubuta wannan waƙar don nuna yadda Yesu yake ba da murna da ƙarfafawa a cikin kowane hali na rayuwa."
  },
  "HBH143": {
    title: "Zan Shaida Shi Mai Fansata",
    number: "HBH143",
    author: "Philip P. Bliss",
    composer: "James McGranahan",
    tune: "MY REDEEMER",
    meter: "8.7.8.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1876",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zan shaida shi mai fansata, Da kaunarsa gare ni", "Ya sha wahala kan gicciye, Domin ya 'yantad da ni"] },
      { verse: "Korus", text: ["Zan shaida shi mai fansata,", "Jininsa, ya saye ni, kan gicciye", "Ya yafe mani, gafara,", "Ya biya, Na sami rai"] },
      { verse: 2, text: ["Zan raira wannan labari, Yadda na dawo gida", "Na kauna da tausayinsa Ya fanshe ni da ransa"] },
      { verse: 3, text: ["Zan yabe shi mai fansata, Ni zan shaida ikonsa", "Yadda ya ba ni nasara, Kan mutuwa da zunubi"] },
      { verse: 4, text: ["Zan shaida shi mai fansata, Da kaunarsa gare ni", "Shi ne ya maida ni mai rai, Zan kasance can da shi"] }
    ],
    history: "Philip P. Bliss ya rubuta wannan waƙar don yin godiya ga Yesu, Mai Fansarmu, wanda ya ba da ransa don ya 'yanta mu."
  },
  "HBH144": {
    title: "Zan Raira Labarin Yesu",
    number: "HBH144",
    author: "Francis H. Rowley",
    composer: "Peter P. Bilhorn",
    tune: "WONDROUS STORY",
    meter: "8.7.8.7. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "1886",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zan raira labarin Yesu, Da ya mutu domina", "Ya bar gidansa a sama; Don gicciye a Kalfari"] },
      { verse: "Korus", text: ["I zan raira wannan waka, Na Yesu, Mai Ceto", "Zan raira da tsarkakkunsa, In mun taru wurinsa."] },
      { verse: 2, text: ["Na bace shi ya neme ni; Tunkiyarsa, batacciya", "Ya ba ni cikakkiyar kauna; Ya sa ni cikin hanya."] },
      { verse: 3, text: ["Shi ne ya ba ni warkaswa; Daga bautan zunubi", "Ga tsoro ya mamaye ni; Amma ya 'yantas da ni."] },
      { verse: 4, text: ["Kwanakin duhu kan zo man; Damuwa ta mamaye ni", "Amma Yesu ya bishe ni; Na tsira ta hannunsa."] },
      { verse: 5, text: ["Shi ne za ya kiyaye ni; Cikin rigyawar rayuwa,", "Sa'annan shi za ya kai ni; In sadu da tsarkakku"] }
    ],
    history: "Francis H. Rowley ya rubuta wannan waƙar don bayyana labarin ceto na ban mamaki, inda Yesu ya nemi batacciyar tunkiyarsa ya cece ta."
  },
  "HBH145": {
    title: "Saurari, Dubban Molaye",
    number: "HBH145",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "HARWELL",
    meter: "8.7.8.7. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Saurari, dubban molaye; Raira wakokin yabo", "Yesu Kristi yana mulki; Yesu, Allah mai kauna.", "Ga shi bisan kursiyi; Shi kadai ne mai mulki", "Halleluya, halleluya, halleluya AMIN."] },
      { verse: 2, text: ["Yesu kawo daukakarka; Ta sauko bisanmu", "Allahnmu ka koya mana; Don mu cika da murna", "Bar mu yi kaunar juna; Kyautarka ce gare mu", "Halleluya, halleluya, halleluya amin."] },
      { verse: 3, text: ["Sarkin daukaka yi mulki; Mulkinka har abada", "Ba abin da za ya hana; Kaunarka ga 'ya'yanka", "Bar mu yi farin ciki; Don za mu ga fuskarka", "Halleluya, halleluya, halleluya amin"] }
    ],
    history: "Waƙar yabo ce wadda take nuna daukakar Yesu a kan kursiyinsa, tana kiran dukan halitta su raira wakokin nasara."
  },
  "HBH146": {
    title: "Ko Ni Zan Shaida Girmansa",
    number: "HBH146",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ARIEL",
    meter: "8.8.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko ni zan shaida girmansa, Ko zan shaida daukakarsa,", "Da Yesu ya nuna, Na hau bisa, na yi waka,", "Da mala'ikunsa a can, Da murna irin taka,", "Da murna irin taka."] },
      { verse: 2, text: ["Zan shaida karfin jininsa, Da ya wanke zunubaina,", "Da hukunci nawa, Ni zan raira daukakarsa,", "Wadda ta zama cikakkiya, Raina ya haskaka,", "Raina ya haskaka."] },
      { verse: 3, text: ["Zan raira halayensa duk, Da dukan yawan kaunarsa,", "Madaukaki ne shi, In yi ta yabonsa kwarai,", "Zan raira yabonsa kullum, In shaida girmansa,", "In shaida girmansa."] },
      { verse: 4, text: ["Mai Ceto ka zo da sauri; Sauko da daukakarka", "Ran da za mu ji kiranka; Duniya za ta shude", "Za mu dinga wakoki; Daukaka ga sarkinmu", "Halleluya, halleluya, halleluya amin."] }
    ],
    history: "Waƙa ce ta shaida wadda take bayyana muradin mai bi na daukaka girmansa da ƙarfin jinin Yesu wanda ya wanke zunubai."
  },
  "HBH147": {
    title: "Ku Bayin Allah",
    number: "HBH147",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "LYONS",
    meter: "10.10.11.11.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ku bayin Allah, yi ta shaidarsa", "Cikin duniya, girman sunansa", "Ku rike sunan nan don yin nasara", "Shi mai daukaka, shi mai mulkinmu"] },
      { verse: 2, text: ["Shi yana mulki, shi zai cece mu", "Yana nan kusa, ga shi nan da mu", "Jama'arsa duka, za su yabe shi", "Su ba shi duk girma, shi ne sarkinsu"] },
      { verse: 3, text: ["Ceto ga Allah, bisan kursiyi,", "Mu ta da murya, mu daukaka Dan", "Yabon Yesu Mai Ceto ne suke yi", "Suna durkusawa suna sujada"] },
      { verse: 4, text: ["Mu yi sujada, ba shi girmansa", "Dukan daukaka, da duk hikima", "Duk daraja nasa ne kullayaumin,", "Muna ta yin godiya, domin kaunarsa. AMIN."] }
    ],
    history: "Wannan waƙar tana kiran dukan bayin Allah su raira waƙar yabo da sujada ga Sarkin sarakuna, suna daukaka ikon sunansa."
  },
  "HBH148": {
    title: "Ku Tsarkakku Yi Ta Duba",
    number: "HBH148",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REGENT SQUARE",
    meter: "8.7.8.7.8.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ku tsarkakku yi ta duban, Yesu Dan ragon Allah", "Yana zuwa da nasara, Mu durkusa gabansa", "Girmama shi, girmama shi, Rawani ne rabonsa."] },
      { verse: 2, text: ["Girmama shi mala'iku, Nasara fa cikakkiya", "Ba shi duka daukakarsa, Sa'ad da yana mulkinsa", "Girmama shi, girmama shi, Shi sarkin sarakuna."] },
      { verse: 3, text: ["Al'ummai na masa ba'a, Ba gaskiya cikinsu", "Tsarkakku da mala'iku, Suna ta yin yabonsa", "Girmama shi, girmama shi, Shaida duk nasararsa."] },
      { verse: 4, text: ["Mutane na ta yin murna, Ji muryoyin nasara", "Yesu ne mafi daukaka, Murnarmu ba iyaka", "Girmama shi, girmama shi, Shi sarkin sarakuna."] }
    ],
    history: "Waƙa ce ta yabo wadda take kiran tsarkaku su duba ga Yesu, Ɗan ragon Allah, wanda yake zuwa da nasara da rawanin daukaka."
  },
  "HBH149": {
    title: "Yabo, Ga Yesu Wanda Aka Ki!",
    number: "HBH149",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "AUTUMN",
    meter: "8.7.8.7.D",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ga Yesu wanda aka ki!, Gai da sarkin Galili!", "Ka sha wahala dominmu; Ka kawo ceto kyauta;", "Gai da Mai Cetonmu wanda, Ya dauke zunubanmu!", "Ta wurinka muka tsira; Sunan ka ya ba mu rai."] },
      { verse: 2, text: ["Ragon hadaya na Allah, Ka dauki zunubanmu;", "Da kauna dawwamammiya, Ka yi fansa cikakkiya;", "An gafarce mutanenka, Domin zub' da jininka;", "Aka bude kofar sammai, Mun sulhuntu da Allah."] },
      { verse: 3, text: ["Gai da Yesu madaukaki!, Rayayye har abada;", "Rundanan Sama na yabe ka, Kana zaune da Uban:", "Roko don masu zunubi, Kana shirya wurinmu,", "Tare da sulhu dominmu, Har mu zo da daukaka."] },
      { verse: 4, text: ["Girma, mulki, da daukaka, Ka isa mu ba ka su;", "Yabo mara misaltuwa, Su ne muke kawo wa;", "Ku taimaka, mala'iku, Kawo naku sadakar;", "Zo mu raira alheranSa, Mu yabi Immanuel. AMIN."] }
    ],
    history: "Waƙa ce ta godiya ga Yesu wanda ya sha wahala dominmu, tana daukaka shi a matsayin Ragon hadaya na Allah wanda ya buɗe ƙofar sammai."
  },
  "HBH150": {
    title: "Ina Son Ka, Ubana",
    number: "HBH150",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "I LOVE THEE",
    meter: "11.11.11.11.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina son ka, ina son ka, Ubana;", "Ina son ka, Mai Ceto da Allahna:", "Ina son ka, ina son ka, Ka sani;", "Gama halayena za su bayyana."] },
      { verse: 2, text: ["Ina da murna, Ina da murna kam!", "Murna mara iyaka, a kan dutse:", "Ina duban ajiyata da bege,", "Da Yesu, mala'iku da tsarkaka."] },
      { verse: 3, text: ["Yesu mai fansata da albarkata;", "Raina da ceto, dadina da hutu,", "Sunan Ka da kaunarka ce wakata,", "Alherinka za ya karfafa raina."] },
      { verse: 4, text: ["Wa ke kamar Mai Ceto sarkin salama?", "Da murmushi, yana rairawa da ni.", "Zan yabe shi ba tare da tsoro ba,", "Da jin dadi, zan raira ga sunansa. AMIN."] }
    ],
    history: "Waƙa ce ta nuna ƙauna da dogara ga Allah da Yesu Mai Ceto, tana bayyana murna da begen da mai bi yake da shi a cikin alherin Ubangiji."
  },
  "HBH151": {
    title: "Dukan Girma, Da Daukaka",
    number: "HBH151",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ST. THEODULPH",
    meter: "7.6.7.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Dukan girma, daukaka, Mun ba ka, sarkinmu,", "Wanda lebnan yara, Ke raira hosanna;", "Kai ne sarkin Isra'ila, Haifaffe Dan Dauda,", "Wanda yake tafiye, Sarki mai albarka."] },
      { verse: 2, text: ["Duk taron mala'iku, Suna raira yabai;", "Ga halittu, 'yan adam, Suna raira tasu;", "Ga Ibraniyawa da, Ganyayen dabino;", "Wakarmu, da addu'a, Mun kawo maka su."] },
      { verse: 3, text: ["Gare ka, a gabanka, Sun raira wakoki;", "Gare ka, madaukaki, Muna ba ka yabbai", "Ka karbi rairawarsu, Mu ma, karbi tamu,", "Da dukan farin ciki, Sarki Mai alheri. AMIN"] }
    ],
    history: "Wannan waƙar Palm Sunday ce wadda take kwaikwayon yadda yara da mutanen Isra'ila suka raira 'Hosanna' ga Yesu yayin da ya shiga Urushalima."
  },
  "HBH152": {
    title: "Mun Ba Ka Sarauta",
    number: "HBH152",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "DIADEMATA",
    meter: "S.M.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mun ba ka Sarauta, Dan rago na Allah,", "Ji! Rundunan sammai da amo, Dukan muzika;", "Raina, tashi ka raira, Ya mutu dominka,", "Ka ba shi dukan daukaka, Har abada abadin."] },
      { verse: 2, text: ["Mun ba ka sarauta, Mai ikon kabari,", "Ya yi nasara a kansa, Domin cetattunsa;", "Mun raira ikonsa, Ya mutu, Ya tashi", "Ya kawo rai madawwami, Rai na har abada."] },
      { verse: 3, text: ["Ya sarkin salama, Mai mulkin dukan sammai", "Mai ba da salama duka, Da addu'a da waka", "Mulki har abada, Karkashin sawunsa", "Dukkan furannin aljanna, Sun ba da kamshinsu."] },
      { verse: 4, text: ["Ubangijin kauna, Ga hannunsa duka", "Ga raunuka a hannunsa, Wanda an daukaka,", "Gai da mai cetonmu! Ka mutu domina", "Yabon ka da daukakarka, Zan yi har abada. AMIN"] }
    ],
    history: "Matthew Bridges ya rubuta wannan waƙar don daukaka Yesu a matsayin Sarkin salama da ƙauna, wanda ya yi nasara a kan kabari ya ba mu rai madawwami."
  },
  "HBH153": {
    title: "Domin Hasken Duniya",
    number: "HBH153",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "DIX",
    meter: "7.7.7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Domin Hasken duniya, Domin daukakar sammai,", "Don kaunarsa tun farko, A bisa mutanensa;", "Allah, da mun yabe ka, Karbi girma, daukaka."] },
      { verse: 2, text: ["Ga yanayin lokaci, Hasken rana da dare,", "Furanni da duwatsu, Rana, wata, taurari;", "Allah, suna yabonka, Karbi girma, daukaka."] },
      { verse: 3, text: ["Domin kaunar mutane, Dan'uwa, 'yar'uwa, iyaye", "Abokai na rayuwa; Ga akidan rayuwa;", "Allah, suna yabonka, Karbi girma, daukaka."] },
      { verse: 4, text: ["Domin ikilisiyarka, Mun mika hannayenmu,", "Baikonmu na godiya, Hadayan nuna kauna;", "Allah, da mun yabe ka, Karbi girma, daukaka.", "AMIN."] }
    ],
    history: "Folliott Pierpoint ya rubuta wannan waƙar godiya don yaba wa Allah saboda kyawun halitta, ƙaunar iyali, da kuma ikilisiyarsa mai tsarki."
  },
  "HBH154": {
    title: "Mai Fansarmu, Mun Yabeka",
    number: "HBH154",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REDENTORE",
    meter: "8.7.8.7.D",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mai fansarmu, mun yabeka, Allah mai nuna jinkai;", "Cika mu da naka halin, Har mu iya ganinka!", "Mai fansarmu, mun yabe ka, Kaunar Allah ga mutum;", "Mun yabe ka, mai fansarmu, Mulkin ka har abada."] },
      { verse: 2, text: ["Mai fansarmu, mun roke ka, Kau da tsoron mu duka;", "Nuna mana fuska taka, Bari mu ga haskenka!", "Mai fansarmu, mun yabe ka, Tuddai ma, sun yabe ka;", "Mun yabe ka, mai fansarmu, Muna yabon sunanka."] },
      { verse: 3, text: ["Kaunarka na haskakawa, Ta kawas da damuwa;", "Sarkin jinkai da daukaka, Cika mu da saninka!", "Mai fansarmu, mun roke ka, Rai da fansa naka ne;", "Mun yabe ka, mai fansarmu, Cika mu da kaunarka."] },
      { verse: 4, text: ["Lokacin da za mu gan ka, Za mu zama kamarka;", "Ka yi mu da kamaninka, Mai fansarmu, kaunarmu!", "Mai fansarmu, mun yabe ka, Za mu zama kamarka;", "Mun yabe ka, mai fansarmu, Allahnmu har abada.", "AMIN."] }
    ],
    history: "Waƙa ce ta roƙo da yabo wadda take neman alherin Allah don kau da tsoro da kuma cika masu bi da ƙaunarsa da saninsa."
  },
  "HBH155": {
    title: "Yesu Shi Ne Komai Nawa",
    number: "HBH155",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ELIZABETH",
    meter: "Irregular",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu shi ne komai nawa, Raina da komaina;", "Shi ke iko da karfina, Ban da shi, zan fadi:", "Shi ne mai ta'aziya ta, Babu wani kama da shi;", "Shi ne farin cikina da, Aboki."] },
      { verse: 2, text: ["Yesu shi ne komai nawa, Ko cikin jaraba;", "Nakan je wurin sa kuma, Ya ba ni albarku:", "Ga ruwan sama ya ba mu; Ya ba mu amfanin gona;", "Rana, ruwan sama, Shi ne, Aboki."] },
      { verse: 3, text: ["Yesu shi ne komai nawa, Da bangaskiya ta;", "Ba zan taba kin bin sa ba, Tun da shi yana so na;", "Na yi dacen zaben bin sa, Yana kula da ni sosai,", "Ni zan bi shi dare, rana, Aboki."] },
      { verse: 4, text: ["Yesu shi ne komai nawa, Aboki mafi kyau;", "Na gaskanta shi yanzu har, Karshen rayuwa ta:", "Rayuwa mai kyau sai da shi, Wanda ba ta da matuka;", "Shi ne rai har abada da, Aboki. AMIN."] }
    ],
    history: "Waƙa ce ta dogara wadda take bayyana yadda Yesu yake matsayin komai ga mai bi - ƙarfinsa, abokinsa, da kuma murnarsa a kowane hali."
  },
  "HBH156": {
    title: "Yesu, Mai Kaunar Raina",
    number: "HBH156",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MARTIN",
    meter: "7.7.7.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu mai kaunar raina, Bar in boye a wurinka,", "Damuwa ta rufe ni, Hankali na ya tashi", "Boye ni Mai Cetona, Guguwar duniya ta lafa,", "Boye ni a inuwarka, Karbe ni a hutunka."] },
      { verse: 2, text: ["Wurin buya ban da shi, Gare ka na dogara,", "Kar ka bar ni in karai, Don kai ne mai ta'aziyya,", "Kanka bege na yake, Kai ne mai tallafawa,", "Shinge ni da hannuwanka, Na boye a inuwarka."] },
      { verse: 3, text: ["Kai ne Almasihu a, Cikin ka na sami rai", "Gwiwarmu ka karfafa, Gajiyayyu mayas da su", "Kai ne mai tsarki duka, Ni cike da zunubi,", "Ni mara adalci ne, Kai mai adalci ne fa."] },
      { verse: 4, text: ["Alheri duk naka ne, Jinkai don zunubaina,", "Warkaswa ta yawaita, Tsarkake ni cikinka,", "Kai mai rai har abada, Ba ni rai a yalwace,", "Kai ne mabulbular rai, Kai ne kwa har abada."] }
    ],
    history: "Charles Wesley ya rubuta wannan waƙar a matsayin roƙon neman mafaka a wurin Yesu yayin da guguwar rayuwa da damuwa suka taso (Tune: Martin)."
  },
  "HBH157": {
    title: "Yesu Mai Kaunar Raina",
    number: "HBH157",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REFUGE",
    meter: "7.7.7.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu mai kaunar raina, Bar in boye a wurinka,", "Damuwa ta rufe ni, Hankali na ya tashi", "Boye ni mai cetona, Guguwar duniya ta lafa", "Boye ni a inuwarka, Karbe ni a hutunka."] },
      { verse: 2, text: ["Wurin buya ban da shi, Gare ka na dogara", "Kar ka bar ni in karai, Don kai ne mai ta'aziyya", "Kanka bege na yake, Kai ne mai tallafawa", "Shinge ni da hannuwanka, Na boye a inuwarka"] },
      { verse: 3, text: ["Kai ne Almasihu a cikin, Ka na sami rai", "Gwiwarmu ka karfafa, Gajiyayyu mayas da su", "Kai ne mai tsarki duka, Ni cike da zunubi", "Ni mara adalci ne, Kai kuwa mai adalci ne fa."] },
      { verse: 4, text: ["Alheri duk naka ne, Jinkai don zunubaina,", "Warkaswa ta yawaita, Tsarkake ni cikinka,", "Kai mai rai har abada, Ba ni rai a yalwace", "Kai ne mabulbular rai, Kai ne kwa har abada. AMIN."] }
    ],
    history: "Salon waƙar Charles Wesley ne (Tune: Refuge), wadda take jaddada dogara ga Yesu a matsayin mai ta'aziyya da tallafawa a lokacin wahala."
  },
  "HBH158": {
    title: "Yesu Mai Kaunar Raina",
    number: "HBH158",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ABERYSTWYTH",
    meter: "7.7.7.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu mai kaunar raina, Bar in boye a wurinka", "Damuwa ta rufe ni, Hankalina ya tashi", "Boye ni Mai Cetona, Guguwar duniya ta lafa", "Boye ni a inuwarka, Karbe ni a hutunka."] },
      { verse: 2, text: ["Wurin buya ban da shi, Gareka na dogara,", "Kar ka bar ni in karai, Don kai ne mai ta'aziyya", "Kanka begena yake, Kai ne mai tallafawa", "Shinge ni da hannuwanka, Na boye a inuwarka."] },
      { verse: 3, text: ["Kai ne Almasihu a cikin, ka na sami rai", "Gwiwarmu ka karfafa, Gajiyayyu mayas da su", "Kai ne mai tsarki duka, Ni cike da zunubi", "Ni mara adalci ne, Kai mai adalci ne fa."] },
      { verse: 4, text: ["Alheri duk naka ne, Jinkai don zunubaina", "Warkaswa ta yawaita, Tsarkake ni cikinka", "Kai mai rai har abada, Ba ni rai a yalwace", "Kai ne mabulbular rai, Kai ne kwa har abada. AMIN."] }
    ],
    history: "Wani salon waƙar Charles Wesley ne (Tune: Aberystwyth), tana bayyana yadda Yesu yake mabulbular rai wadda take ba da alheri da jinkai mara iyaka."
  },
  "HBH159": {
    title: "Yesu Mai Adalci",
    number: "HBH159",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CRUSADERS HYMN",
    meter: "5.6.8.5.5.8.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu mai adilci, Mai mulkin halittu", "Ya kai na Allah da mutum, Kai nake kauna", "Kai zan girmama, Kai ne sanadin murnata."] },
      { verse: 2, text: ["Da kyau fa kai ka, Halicci furanni,", "Furannin jeji, itatuwa, Ya kawata su.", "Ya fi su duka, Ya sa mai damuwa, murna."] },
      { verse: 3, text: ["Rana na da kyau, Da hasken wata ma,", "Da kuma hasken taurari, Shi mafi haske,", "Shi mafi tsarki, Fiye da dukan mala'iku. AMIN."] }
    ],
    history: "Waƙa ce ta yabo wadda take kwatanta kyawun Yesu da na halitta, tana nuna yadda ya fi rana, wata, da taurari haske da tsarki."
  },
  "HBH160": {
    title: "Sunan Yesu Da Dadin Ji",
    number: "HBH160",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ORTONVILLE",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Sunan Yesu da dadin ji, Ga masu binsa.", "Ya warkar da cutukansu, Ya kori duk tsoro", "Ya kori duk tsoro"] },
      { verse: 2, text: ["Ya watsakar da zuciyata, Ya kawo kwanciyar rai", "Abinci ne, ga mai yunwa, Da masu damuwa,", "Da masu damuwa."] },
      { verse: 3, text: ["Sunan nan shi ne begena, Shi ne mafakata,", "Shi ne yalwata da rabona, Don yawan alherinsa,", "Don yawan alherinsa."] },
      { verse: 4, text: ["Yesu shi ne aminina, Annabi da sarki,", "Yesu shi ne komai nawa, Karbi yabona duk,", "Karbi yabona duk."] }
    ],
    history: "John Newton ya rubuta wannan waƙar don bayyana yadda sunan Yesu yake kawo kwanciyar rai, warkaswa, da kuma bege ga masu baƙin ciki."
  },
  "HBH161": {
    title: "Nemi Sanin Abu Mai Girma",
    number: "HBH161",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "HENDON",
    meter: "7.7.7.7.7",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Tambayi ni dalilin, Da ke sa ni yin murna", "Don ladar da na samu, Don daukakar sunansa,", "Yesu da an gicciye."] },
      { verse: 2, text: ["Wane ne tushen bangaskiyarmu, Wa ke sa ni yin waka", "Shi mai daukar laifina, Ya sada ni da Allah", "Yesu da an gicciye"] },
      { verse: 3, text: ["Wane ne rai a guna? Wa ya mutu domina?", "Wa zai sa ni a hanya? Da irin wannan haske,", "Yesu da an gicciye."] },
      { verse: 4, text: ["Wannan babban abu ne, Shi ya sa ni yin murna", "Gaskanta da Mai Ceto, Shi da ya yi nasara", "Yesu da an gicciye. AMIN."] }
    ],
    history: "Waƙa ce ta shaida wadda take bayyana cewa dalilin murna da nasarar mai bi shine Yesu wanda aka gicciye, tushen bangaskiya da rayuwarmu."
  },
  "HBH162": {
    title: "Makiyayi Mai Kyau",
    number: "HBH162",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "KIBY BEDON",
    meter: "6.6.4.6.6.6.4.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Makiyayi mai kyau, Kana kiyaye mu", "Da kulawa, Yesu mai nasara,", "Mun raira yabonka, Mun kawo 'ya'yanmu,", "Don su raira."] },
      { verse: 2, text: ["Ubangijin Tsarki, Kalma mafi iko,", "Mai warkaswa; Ka sauko dominmu,", "Ka dauki laifinmu, Domin ka cice mu,", "Ka ba mu rai."] },
      { verse: 3, text: ["Kai ne malamin mu; Ka shirya liyafa", "Ta kaunarka, A cikin kuncin mu,", "Ba ka yashe mu ba; Kana kula da mu,", "Mai taimako."] },
      { verse: 4, text: ["Ka zama shingenmu, Da makiyayinmu,", "Da wakarmu; Yesu, Kalmar Allah", "Ta wurin kalmarka, Kai mu tafarkinKa,", "Karfafa mu. AMIN."] }
    ],
    history: "Wannan waƙar tana daukaka Yesu a matsayin Makiyayi mai kyau (Zabura 23), wanda yake kiyaye mu, yake warkar da mu, kuma yake bishe mu a tafarkin gaskiya."
  },
  "HBH163": {
    title: "Duba Dai Mai Fansar Mu",
    number: "HBH163",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "HALLELUJAH WHAT A SAVIOUR",
    meter: "7.7.7.8.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Duba dai mai fansarmu, Dauke da zunubanmu", "Yana shan wahalarmu, Halleluyah Mai Cetonmu."] },
      { verse: 2, text: ["Raini duka nasa ne, Ba a, kunyar, gicciye,", "Mutuwa rabonsa ne, Halleluya, Mai Cetonmu"] },
      { verse: 3, text: ["A Gicciye ya mutu, Ya kare ne kukansa,", "Allah ya daukaka shi, Halleluya, Mai Cetonmu."] },
      { verse: 4, text: ["Randa sarkinmu zai zo, Dauke da ladar kowa", "Za mu yi sabuwar waka, Halleluya, Mai Cetonmu."] }
    ],
    history: "Philip Bliss ya rubuta wannan waƙar don yaba wa 'Mutumin baƙin ciki' (Yesu) wanda ya ɗauki zunubanmu kuma ya tashi da nasara (Hallelujah, What a Saviour!)."
  },
  "HBH164": {
    title: "Allah Kai Ne Mai Cetona",
    number: "HBH164",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REGENT SQUARE",
    meter: "8.7.8.7.8.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "YESU KRISTI DAN ALLAH: Yabo da Bangirma",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Allah kai ne, Mai Cetona, Kai ne mai fansar raina", "Kana da tausayi kuma, Ka mutu don in tsira,", "Zan yabe ka zan yabe ka, Ina zan fara yabo?"] },
      { verse: 2, text: ["Ina kaunar Mai Cetona, Don shi ya kawo ceto,", "Ya ba ni tagomashinsa, Ran da zai dawo duniya,", "Duk jikina, duk jikina, Zai dauki kamanninsa."] },
      { verse: 3, text: ["Sa'ad da runduna na sama, Na raira daukakarsa,", "Ni da su mu yi ta raira, Daukaka ga Dan rago", "Sunan Yesu, sunan Yesu, Suna ne mai dadin ji"] }
    ],
    history: "Waƙa ce ta yabo da godiya ga Allah saboda fansa da ceton da muka samu ta wurin Yesu, tana sa ran ranar da za mu zama kamarsa a daukaka."
  },
  "HBH165": {
    title: "Ruhu Mai Tsarki, Jagora",
    number: "HBH165",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "FAITHFUL GUIDE",
    meter: "7.7.7.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhu Mai Tsarki, Jagora, Kasance da masu bi", "Hannunka ya bi da mu, Cikin wannan duniya", "Gajiyayyu na murna, Yayin da suka ji ka", "Kana kiran batacce, \"Ka zo fa zan bishe ka\""] },
      { verse: 2, text: ["Kana nan kullayaumi, Aboki na gaskiya", "Karka bar mu da tsoro, Ka zama mafakarmu", "A lokacin damuwa, Mukan sami karaya", "Kana kiran batacce, \"Ka zo fa zan bishe ka\""] },
      { verse: 3, text: ["Ran da za mu bar duniya, Mu zo gun ka a sama", "Allah muna rokonka, Sunayenmu su shiga", "Ba ma tsoron wahala, Cece mu da jininka", "Kana kiran batacce, \"Ka zo fa zan bishe ka\""] }
    ],
    history: "Marcus Wells ya rubuta wannan waƙar a matsayin roƙon neman jagorancin Ruhu Mai Tsarki a cikin wannan duniya, domin ya bishe mu zuwa gidanmu na sama."
  },
  "HBH166": {
    title: "Ruhun Allah Sauko",
    number: "HBH166",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "LONGWOOD",
    meter: "10:10:10:10.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhun Allah, sauko zuciyata", "Cire mani sha'awar duniya", "Cire mani dukan kasawata", "In kaunace ka yadda kake so."] },
      { verse: 2, text: ["Anabci da mafalkai ba na so", "Ko bayyanin abin da ka boye", "Ko ziyarar mala'ikun sama", "Amma ka cire duhun zuciyata."] },
      { verse: 3, text: ["Ba ka ce mu kaunace ka ba?", "'Ya'yanka duk, da karfi da zuciya", "Bari in dogara ga gicciyenka", "Nan za ka koya mani nufinka."] },
      { verse: 4, text: ["Koya mani in san kana kusa", "Koya mani jimriya ta zuciya", "Don in tsaya da karfi ba shakka", "Koya mani jiran lokacinka. AMIN."] }
    ],
    history: "George Croly ya rubuta wannan waƙar don neman Ruhu Mai Tsarki ya sauko cikin zuciya, ya cire sha'awar duniya, kuma ya koya wa mai bi yin juriya da ƙauna."
  },
  "HBH167": {
    title: "Allah Ka Ba Ni Rai",
    number: "HBH167",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "TRENTHAM",
    meter: "S.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Allah ka ba ni rai, Ba ni sabon rayuwa,", "In yi kaunar maganarka, In aika nufinka"] },
      { verse: 2, text: ["Allah ka ba ni rai, In zama da tsarki,", "Nufinka Allah, Nake so, in yi da jurewa"] },
      { verse: 3, text: ["Allah ka ba ni rai, Har in zama naka,", "Har haskenka ya haska ni, Da dukan komai na"] },
      { verse: 4, text: ["Allah ka ba ni rai, Don kada in mutu,", "Amma, in kasance da kai, Nan da har abada. AMIN"] }
    ],
    history: "Edwin Hatch ya rubuta wannan waƙar a matsayin roƙo ga Allah ya hura rayuwarsa (Ruhu Mai Tsarki) cikin mai bi, domin ya zama mai tsarki da kuma mai yin nufin Allah."
  },
  "HBH168": {
    title: "Ruhun Allah Na Nan",
    number: "HBH168",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BOYSTON",
    meter: "S.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhun Allah na nan, Inda muke addu'a", "Yayin da kyautar Kristi fa, Ke kusa da jama'a"] },
      { verse: 2, text: ["Yana kusa da mu, Don ya ji rokonmu,", "Ga shi cikin darajarsa, Daidai a kursiyinsa"] },
      { verse: 3, text: ["Yana nan cikin mu, Shi babban bakon nan", "Yana mulkin zuciyarmu, Kamar basarake"] },
      { verse: 4, text: ["Cika mu da iko, Dzon mu yi nufinka,", "Ka albarkaci sa'annan, Ka cika begenmu. AMIN."] }
    ],
    history: "Waƙa ce ta yabo ga Ruhu Mai Tsarki wanda yake tare da mu a lokacin addu'a da bauta, yana mulkin zukatanmu a matsayin 'Babban Baƙo' mai iko."
  },
  "HBH169": {
    title: "Zo, Ruhun Allah Mai Tsarki",
    number: "HBH169",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BALERMA",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zo Ruhun Allah Mai tsarki, Zo da duk ikonka,", "Kunna mana wutar kauna, A cikin zuciyarmu"] },
      { verse: 2, text: ["A banza wakokinmu yau, Karfinmu ya kasa", "Wakarmu babu ma'ana, Sai ka taimake mu"] },
      { verse: 3, text: ["Uba za mu dawwama kira? A sanyin zuciyar nan", "Da sanyin kauna gare ka? Taka fa da girma?"] },
      { verse: 4, text: ["Zo Ruhun Allah mai tsarki, Zo da duk ikonka", "Nuna mana kaunarka, Mu yi koyi gare ka. AMIN."] }
    ],
    history: "Isaac Watts ya rubuta wannan waƙar don kiran Ruhu Mai Tsarki ya sauko ya kunna wutar ƙauna a zukatanmu, domin ibadarmu ta zama mai rai da ma'ana."
  },
  "HBH170": {
    title: "Ruhun Allah Mai Tsarki",
    number: "HBH170",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MERCY",
    meter: "7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhun Allah mai tsarki, Haska cikin zuciyata", "Kau da, ayyukan duhu, Kau da dukan damuwata"] },
      { verse: 2, text: ["Ruhun Allah mai iko, ka wanke zunubaina", "Zunubi yayi kanta, Ka zama mai mulkina"] },
      { verse: 3, text: ["Ruhu Mai Tsarki ga ni, Ka faranta mini rai,", "Ka kawas da damuwata, Ka warkar da zuciyata"] },
      { verse: 4, text: ["Ruhun Allah mai tsarki, Zauna cikin zuciyata,", "Rushe duk gumakana, Sai ka mulki zuciyata. AMIN"] }
    ],
    history: ""
  },
  "HBH171": {
    title: "Ruhun Allah Daga Sama",
    number: "HBH171",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "SEYMOR",
    meter: "7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhun Allah a sama, Dube mu da idonka,", "Falkar da zukatanmu, Mu rabu da zunubi"] },
      { verse: 2, text: ["Haska kowane lungu, Cikin zukatanmu yau", "Inda muke kasawa, Ka sa mu cikin hanya."] },
      { verse: 3, text: ["Koya mana mu tuba, Muna neman saukinka", "Bayyanar jinin Yesu, Ya dauke damuwarmu"] }
    ],
    history: "Waƙa ce ta roƙon Ruhu Mai Tsarki ya sauko daga sama don falkar da zukatan masu bi da kuma nuna musu hanyar gaskiya ta wurin jinin Yesu."
  },
  "HBH172": {
    title: "Ruhu Mai Tsarki Ji Addu'armu",
    number: "HBH172",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BRECON",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhu Mai Tsarki ji addu'a, Zauna cikinmu,", "Ka sauko da iko kanmu, Zo Ruhu Mai Tsarki."] },
      { verse: 2, text: ["Bayyana mana gaskiya, Wadda muke nema,", "Nuna mana wannan, Hanya, Hanyar da za mu bi."] },
      { verse: 3, text: ["Tsarkake zukatanmu kamar, Wutar hadaya", "Har zukatanmu su zama, Karbabbu gare ka"] },
      { verse: 4, text: ["Zo Ruhu da alherin, Pentikos bayyana,", "Nuna cetonka ga dukan, Duniya duk ta ji. AMIN."] }
    ],
    history: "Waƙa ce ta neman ikon Ruhu Mai Tsarki (Pentikos) don tsarkake zukata, kawo tuba, da kuma ƙarfafa ikilisiya don aikin bishara."
  },
  "HBH173": {
    title: "Kamar Ran Fentikos",
    number: "HBH173",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "OLD TIME POWER",
    meter: "C.M. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kamar ran fentikos, Allah, ka nuna ikonka,", "Da wutar taka mai tsarki, Sauko a kan mu yau."] },
      { verse: "Korus", text: ["Ka sauko da iko, da ikon Fentikos", "Bude kofar albarka a kan mu duka", "Ka sauko da iko, ikon fentikos", "Masu zunubi su tuba, a daukaka ka."] },
      { verse: 2, text: ["Domin babban aikinka, Shirya zukatanmu duk", "Ka mallaki jama'arka, Karka rabu da mu."] },
      { verse: 3, text: ["Mu bar ayyukanmu, Na jiki domin nemanka", "Shirye muke don aikinka, Sabunta mu Allah"] },
      { verse: 4, text: ["Yi magana muna jin ka, Mun gaskanta da kai", "Ba mu rabuwa da kai sai, Mun sami albarka."] }
    ],
    history: "Waƙa ce ta roƙon Ruhu Mai Tsarki ya sauko da ikon Fentikos don sabunta zukata, nuna alheri, da kuma daukaka sunan Allah ta wurin tuba."
  },
  "HBH174": {
    title: "Ruhun Allah Iza Ni",
    number: "HBH174",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "TRUETT",
    meter: "7.6.8.6. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhun Allah iza ni, In zama da tsarki,", "Bari hasken ya haskaka, Ya haskaka ainun."] },
      { verse: "Korus", text: ["Iza ni, iza ni,", "Ga zuciyata ka wanke", "Ruhun Allah zo iza ni."] },
      { verse: 2, text: ["Ruhun Allah iza ni, Ka kaskantar da ni", "Koya mini maganarka, In aika nufinka"] },
      { verse: 3, text: ["Ruhun Allah iza ni, Cika ni da iko", "Cika ni da Ruhun kauna, Cikin zuciyata."] },
      { verse: 4, text: ["Ruhun Allah iza ni, Har in zama naka", "Har in kai ga yin nufinka, Don in rayu don kai. AMIN"] }
    ],
    history: "Waƙa ce ta roƙo ga Ruhu Mai Tsarki don ya iza (bishe) mai bi zuwa ga tsarki, ya koya masa maganar Allah, kuma ya cika shi da ƙauna da iko."
  },
  "HBH175": {
    title: "Hatimce Mu Ya Ruhu",
    number: "HBH175",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CARSON",
    meter: "7.7.8.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "RUHU MAI TSARKI",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Hatimce mu ya Ruhu, Cika mu da ikonka,", "Mu zama kama da Yesu, Dauke da sifarsa yau"] },
      { verse: "Korus", text: ["Hatimce mu, Ruhu hatimce mu,", "Hatimce mu ya Ruhu, Don yin aikin Allah yau"] },
      { verse: 2, text: ["Hatimce mu ya Ruhu, Bar a ga kamanninka,", "Cikin rayuwarmu yau fa, Albarkun ka su zubo."] },
      { verse: 3, text: ["Hatimce mu ya Ruhu, Ka mai da mu naka yau,", "Mu zama kayan aikinka, Ba mu ikon bishara."] }
    ],
    history: "Waƙa ce ta roƙon Ruhu Mai Tsarki ya hatimce masu bi don aikin Allah, yana sa su zama kama da Yesu da kuma ba su ikon yin bishara."
  },
  "HBH176": {
    title: "Kalmar Allah Tun Fil'azar",
    number: "HBH176",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "AUSTRAIN HYMN",
    meter: "8.7.8.7.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kalmar Allah tun fil'azar, Sakonka ne gare mu", "Begenmu a kullayomi, Na bayyana gare mu", "Yana shaida, jinkan Allah, Alherinsa yana nan,", "Yana bi da mu koyaushe, Kyauta a gare mu ce."] },
      { verse: 2, text: ["Ga labarin wani mutum, Na tafiya da dare,", "Da taimakon Annabinsa, Don nuna masa hanya,", "Kalmar da ayyukan Kristi, Na nuna mana rayuwa", "Yana ta roko, gun uba, Domin ya taimake mu."] },
      { verse: 3, text: ["Cikin harsunan duniya, Kalmar ta yi albarka,", "Mu da muke masun koyo, Kan bayana mana kullum", "Ka yi musu albarka, Su yi ta yin nufinka,", "Har duniya ta ji bishara, Duniya ta san ka sosai. AMIN."] }
    ],
    history: "Waƙa ce ta yabo ga Kalmar Allah wadda take bayyana jinkai da alherin Ubangiji tun fil'azar, tana bishe mu a tafarkin rayuwa."
  },
  "HBH177": {
    title: "Kalmar Ka Mai Bayyana Haske",
    number: "HBH177",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ST. PETERSBURG",
    meter: "8.8.8.8.8.8.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kalma mai bayyana haske, Kunshe da ayyukan Allah", "Mun ga hikima da kauna, Ta nuna hoton aljanna", "Shirin Allah mai daraja, Bayyane a littafinka."] },
      { verse: 2, text: ["Kalma mai iza gaskiya, Na sa bege a zuciyarmu", "Daurarru na samun 'yanci, Salamar ka na samuwa", "A sami karin ilimi, Ta wurin binciken kalmar."] },
      { verse: 3, text: ["Dawwamar kalmarka ta tsaya, Da karfi da iko amma,", "Kai kana dawwama, Daraja ta har abada", "Da uba a can sama a inda, Gadonmu yake. AMIN."] }
    ],
    history: "Waƙa ce ta nuna darajar littafin Allah a matsayin haske da hikima wadda take bayyana shirin fansa da kuma ba da 'yanci ga dukan al'ummai."
  },
  "HBH178": {
    title: "Yesu Gurasar Rai",
    number: "HBH178",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BREAD OF LIFE",
    meter: "6.4.6.4.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu gurasar rai ba ni in ci,", "Yadda ka bayar a gefen Teku,", "Ba ni da kome nan, sai kai kadai,", "Raina, na kishin ka, gurasar rai."] },
      { verse: 2, text: ["Albarkaci gurasar gare ni", "Yadda ka yi fa da a Galili", "Don in rabu da bauta, na Shaidan,", "In sami salama, Mai Cetona."] },
      { verse: 3, text: ["Kai ne gurasar rai, a gare ni,", "Kalmar ka ita ce, ta cece ni,", "Bar in ci in rayu, tare da kai,", "Koya mani kauna, kai ne kauna."] },
      { verse: 4, text: ["Sauko da Ruhunka, Bisa kaina,", "Ya taba idona, har in gani", "Nuna mani gaskiya, da ke boye,", "Cikin littafinka, Na ga Allah. AMIN."] }
    ],
    history: "Mary Lathbury ya rubuta wannan waƙar don daukaka Yesu a matsayin Gurasar Rai (Yohanna 6), tana roƙon Allah ya buɗe idanunmu mu ga gaskiyar da ke cikin maganarsa."
  },
  "HBH179": {
    title: "Littafi Na Allahnmu",
    number: "HBH179",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ALETTA",
    meter: "7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Littafi na Allahnmu, Mai daraja gare ni,", "Koya mani, tushena, Koya mani, wa nake,"] },
      { verse: 2, text: ["Hore ni, in na bace, Nuna kaunar Mai Ceto,", "Mai tsaro, mai bishe ni, Mai horo, mai sakawa."] },
      { verse: 3, text: ["Mai yi man ta'aziya, A cikin matsala ta,", "Ta wurin bangaskiya, Babu tsoron mutuwa."] },
      { verse: 4, text: ["Begen farin cikina, Da karshen mai zunubi", "Ya kai littafin Allah, Mai daraja gare ni. AMIN."] }
    ],
    history: "Waƙa ce ta godiya ga Allah saboda kyautar littafi mai tsarki wanda yake koya mana tushenmu, yana hore mu, kuma yake ba mu ta'aziya da bege."
  },
  "HBH180": {
    title: "Maganar Ka Fitila Ce",
    number: "HBH180",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "EOLA",
    meter: "8.7.8.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Maganar ka fitila ce, Tana haska hanyata,", "Jagora ta kullayomi, Mai nuna mani hanya,"] },
      { verse: "Korus", text: ["A Zuci, na boye kalmar,", "Kar in yi maka zunubi,", "Don kada in yi, maka zunubi,", "A zuci, na boye kalmar."] },
      { verse: 2, text: ["Kalmar ka ba ta canjawa, Kafaffiya ce a sama,", "Amincin ka ga mutane, Yana nan har abada."] },
      { verse: 3, text: ["Da safe, rana da dare, Ni zan yi ta yabon ka,", "Kai ne rabona ya Uba, Nawa ne har abada."] }
    ],
    history: "Wannan waƙar tana daukaka maganar Allah a matsayin fitila ga sawayenmu (Zabura 119:105), tana bayyana amincin Allah wanda ba ya canjawa har abada."
  },
  "HBH181": {
    title: "Kalmomi Masu Rai",
    number: "HBH181",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WORDS OF LIFE",
    meter: "8.6.8.6.6.6. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Raira su gare ni kuma, Kalmomi masu rai", "Bari in rika ga kyaun su, Kalmomi masu rai", "Kalmomi masu rai, Koya mini gaskiya."] },
      { verse: "Korus", text: ["Kyawawan kalmomi na rai, Kalmomin mamaki", "Kyawawan kalmomi na rai, Kalmomin mamaki"] },
      { verse: 2, text: ["Yesu Kristi ya ba duniya, Kalmomi masu rai", "Mai zunubi ka saurari, Kalmomi masu rai", "Kyauta ce gare mu, Don ya kai mu sama."] },
      { verse: 3, text: ["Murya mai dadi na kira, Kalmomi masu rai,", "Gafara da salamarsa, Kalmomi masu rai,", "Yesu ne Mai Ceto, Tsarkake ni sarai."] }
    ],
    history: "Philip Bliss ya rubuta wannan waƙar don bayyana kyawun kalmomin rai (Yesu) waɗanda suke kawo gafara, salama, da kuma jagora zuwa gidanmu na sama."
  },
  "HBH182": {
    title: "Kalmar Ka Kamar Lambu Ne",
    number: "HBH182",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CLONMEL",
    meter: "C.M.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kalmarka, kamar lambu ne, Da fure masu kyau", "Wanda ke nema zai tsinki, Kyakkyawan 'ya'yan nan", "Kalmarka tana da zurfi, Kamar ma'adina", "Boyayya ce cikin rami, Ga duk mai neman ta."] },
      { verse: 2, text: ["Kalmarka tana da haske, Mai dumbin yawa", "Tana bi da matafiyi, Tana haskaka shi,", "Bar in yi kaunar kalmarka, In bincike ta kwarai", "Bari in tsinci furenta, Ya kwa haskaka ni. AMIN."] }
    ],
    history: "Waƙa ce ta misalta kalmar Allah da lambu mai fure ko kuma ma'adanar dukiya mai zurfi, tana haskaka hanyar matafiyi a cikin duhun rayuwa."
  },
  "HBH183": {
    title: "Ya Yesu Kalmar Allah",
    number: "HBH183",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MUNICH",
    meter: "7.6.7.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ya Yesu kalmar Allah, Kai Hikimar Allah", "Kai da ba ka sakewa, Ya Yesu hasken mu", "Mun yabe ka don haske, Da kake haskawa", "Fitilar sawayenmu, Kai ne har abada."] },
      { verse: 2, text: ["Daga gunka, ya Yesu, Ka ba mu kyautarka", "Mun kuma haskaka ta, Ga dukan duniya", "Hasken ka ne runbun mu, Na ajiyar gaskiya", "Shi ne ke bayyana ka, Ga dukan duniya."] },
      { verse: 3, text: ["Ga ta dai kamar tuta, A gaban 'ya'yanka", "Tana haskakawa dai, Bisa duniya duka", "Ita ce idanun mu, Cikin duk rayuwa", "Cikin duk duhun dare, Ta kawo mu gunka."] }
    ],
    history: "William Walsham How ya rubuta wannan waƙar don daukaka Yesu a matsayin Kalmar Allah (Yohanna 1:1), wanda yake fitila ga sawayenmu da kuma hasken duniya."
  },
  "HBH184": {
    title: "Na San Maganar Gaskiya Ce",
    number: "HBH184",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "GRICE",
    meter: "9.7.9.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Allah ya aiko littafinsa, A kullum sabo ne,", "Mai tsarki ne, mai tsimawa, Maganarsa gaskiya ce."] },
      { verse: "Korus", text: ["Na sani cewa, maganarsa gaskiya ce,", "Yakan tsimar da, dukan duniya", "Maganarsa gaskiya ce."] },
      { verse: 2, text: ["Labarin Yesu gaskiya ce, Da kuma haifuwarsa", "Mutuwarsa da tashinsa fa, Da zuwan sa na biyu."] },
      { verse: 3, text: ["Na san maganarsa gaskiya ce, Takan ba ni salama", "Takan ta'azantar da ni kullum, Takan ba ni nasara."] },
      { verse: 4, text: ["Magabta na musun kalmar nan, A kullum sabuwa", "ce,", "Tana da dadin ji, koyaushe, Maganarsa gaskiya ce."] }
    ],
    history: "Waƙa ce ta jaddada cewa maganar Allah gaskiya ce kuma ba ta canjawa, tana bayyana labarin Yesu, haifuwarsa, mutuwarsa, da kuma dawowarsa."
  },
  "HBH185": {
    title: "Kyautar Allah",
    number: "HBH185",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ANCIENT OF DAYS",
    meter: "11.10.11.10.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["O ya Allah, kalmarka ce fitila", "Tana haskaka duhu na duniya", "Mun yi nasara, kan tsoro da shakka", "Bi da sawayenmu har abada"] },
      { verse: 2, text: ["Tun fil'azal har ga wannan lokaci", "Ka bayyana kanka ga mutane", "Ka yi ta magana ga dukan tsara", "Wanda sun rubuta maganarKa"] },
      { verse: 3, text: ["Har yau kana bayyana maganarKa", "Alherinka ga masu zunubi,", "da masu son salama da wakarsu,", "ta neman tausayin ka shi ne Mai Ceto Kristi."] },
      { verse: 4, text: ["Maganarka ta shigo duk duniya", "Ta shigo cikin kowane lungu", "Da murya daya suna tada amo", "Jama'a na murna don wannan kyauta. AMIN"] }
    ],
    history: ""
  },
  "HBH186": {
    title: "Daukaka Kamar Haske",
    number: "HBH186",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BURLINGTON",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Daukaka kamar haske fa, Ta haska ko'ina,", "Tana haske ga duk tsara, Ta haskaka kyauta."] },
      { verse: 2, text: ["Hannunka ne mai bayarwa, Cike da alheri,", "Gaskiyarka na kan duniya duk, Ba za ta kare ba."] },
      { verse: 3, text: ["Muna godiya ya Allah, Domin daukakarka", "Da ta haskaka duniya duk, Don mu ga nufinka."] },
      { verse: 4, text: ["Raina na murna ya Allah, Na son tafarkinka", "Har daukakarka ya Allah, A gan ta a kaina. Amin"] }
    ],
    history: "Waƙa ce ta yabo ga daukakar Allah wadda take haskaka ko'ina kamar hasken rana, tana bayyana nufin Allah da gaskiyarsa ga dukan tsara."
  },
  "HBH187": {
    title: "Sammai Na Ba Ka Daukaka",
    number: "HBH187",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "DUKE STREET",
    meter: "L.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "KALMAR ALLAH",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Sammai na ba ka daukaka, Hikimar ka a bayyane", "Amma in mun ga kalmarka, Ta bayyana sunanka dai."] },
      { verse: 2, text: ["Rana, wata, da taurari, Sun furta girman ikonka", "Amma cikakken ikonka, Ba mai iya bayyanawa."] },
      { verse: 3, text: ["Ya Ubanmu mai adalci, Ba mu albarkanka yanzu", "Bishararka ta ba mu rai, Mai hukunci cikin gaskiya."] },
      { verse: 4, text: ["Mun ga ikonka a bayyane, Ka yafe dukan laifinmu", "Ba mu ikon yin nasara, Har ran da za mu kai sama.", "AMIN"] }
    ],
    history: "Isaac Watts ya rubuta wannan waƙar (Zabura 19) don gwama yabon Allah ta wurin halitta (sammai da rana) da kuma yabon Allah ta wurin bishararsa mai ceton rai."
  },
  "HBH188": {
    title: "Alherinsa Da Dadin Ji",
    number: "HBH188",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "AMAZING GRACE",
    meter: "C.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Alherinsa da dadin ji, Wanda ya cece ni,", "Na bace da ya samo ni, Na makance a da"] },
      { verse: 2, text: ["Yadda nake tsoron Allah, Aikin alheri ne,", "Alherinsa darajarsa, Tun ran da na tuba,"] },
      { verse: 3, text: ["Da gwagwarmaya da kunci, Ni na riga na zo", "Alherinsa ya kawo ni, Zai kai ne can gida"] },
      { verse: 4, text: ["Ran da za mu taru a can, Muna haskakawa", "Za mu dinga raira yabo, Wanda ba iyaka. AMIN"] }
    ],
    history: "John Newton ya rubuta wannan shahararriyar waƙar (Amazing Grace) don bayyana yadda alherin Allah ya cece shi, bawan zunubi, ya kuma ba shi begen gidan sama."
  },
  "HBH189": {
    title: "Ya Kristi Mai Fansa",
    number: "HBH189",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MOORE",
    meter: "7.7.7.7.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ya Kristi mai fansa bar, In yi tafiya da kai", "Kaunarka ta bishe ni, Domin in ga fuskarsa"] },
      { verse: 2, text: ["Ta wurin bangaskiya, In koya wa batattu,", "Su bar hanyar zunubi, Su sami hanyar ceto"] },
      { verse: 3, text: ["Koya mini hakuri, In gaskata kalmarka", "Karfafa bangaskiya ta, Ka ba ni nasara"] },
      { verse: 4, text: ["Ran da zan bar duniyar nan, Zuwa gidan nan mai kyau,", "Nan ne zan ga fuskarka, Ta wurin alherinka. AMIN"] }
    ],
    history: "Waƙa ce ta roƙon tafiya tare da Kristi, tana neman ƙarfafa daga wurinsa don koya wa wasu hanyar ceto da kuma samun nasara ta wurin alherinsa."
  },
  "HBH190": {
    title: "Na Ga Gicciyen Yesu",
    number: "HBH190",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WHITFILED",
    meter: "7.6.7.6.D",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na ga gicciyen Yesu, Loton zunubaina,", "Na nemi gicciyen Yesu, Ya ba ni salama", "Na kai kaina gun Yesu, Ya wanke ni sarai", "A gicciye na Yesu, Na sami salama"] },
      { verse: 2, text: ["Ina son gicciyen Yesu, Don shi ya cece ni", "Masu zunubi a duniya, Yesu ya cece su,", "Ba don adalcina ba, Ba domin kyau na ba,", "Gicciyensa mai daraja, Nan na sami iko"] },
      { verse: 3, text: ["Na gaskanta gicciyen, A kowace sa'a,", "Shi ne duk mallakata, Ba zai yashe ni ba,", "Duk lokacin damuwa, Nakan yi nasara,", "Rayuwa ta nan duniya, Yesu ke bishe ni."] },
      { verse: 4, text: ["A kan gicciyen Yesu, Na sami kwanciyar rai", "Yesu ne salamata, Ba zan rabu da shi,", "A cikin daukakarsa, Zan raira yabonsa,", "Inda babu zunubi, Da kuma mutuwa."] }
    ],
    history: "Waƙa ce ta shaida wadda take bayyana yadda mai bi ya sami salama da kwanciyar rai a wurin gicciyen Yesu, inda aka wanke shi daga dukan zunubansa."
  },
  "HBH191": {
    title: "Mun Ji Murya Mai Dadi",
    number: "HBH191",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "JESU SAVES",
    meter: "7.6.7.6.7.7.7.6.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mun ji murya mai dadi, Yesu ne Mai Ceto,", "Shaida labarin Yesu, Yesu ne Mai Ceto", "Shaida wa duniya duk, Don su ji labarin nan", "Wannan shi ne aikin mu, Yesu ne Mai Ceto."] },
      { verse: 2, text: ["Watsa wannan labarin, Yesu ne Mai Ceto", "Ce wa masu zunubi, Yesu ne Mai Ceto", "Yaku halittun duniya, Ku zo mu raira yabo", "Duniya ta yi murna, Yesu ne Mai Ceto"] },
      { verse: 3, text: ["Yesu ya yi nasara, Yesu ne Mai Ceto", "Nasara kan mutuwa, Yesu ne Mai Ceto", "Ko muna bakin ciki, Mu raira wannan waka", "Cewa Yesu ya tashi, Yesu ne Mai Ceto"] },
      { verse: 4, text: ["Sai mu ta da muryarmu, Yesu ne Mai Ceto", "Duniya ta yi murna, Yesu ne Mai Ceto", "Ceton Yesu kyauta ce, Zuwa ga duniya duk,", "Wannan shi ne wakarmu, Yesu ne Mai Ceto."] }
    ],
    history: "Priscilla Owens ya rubuta wannan waƙar bishara (Jesus Saves) don kiran masu bi su watsa labarin ceto ga dukan duniya, a cikin murna da kuma bakin ciki."
  },
  "HBH192": {
    title: "Ko Kun Zo Gun Yesu Domin Gafara",
    number: "HBH192",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WASHED IN THE BLOOD",
    meter: "11.9.11.9. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko kun zo gun Yesu domin gafara?", "Ko jinin Yesu ya wanke ku?", "Ko kuna dogara ga alherinsa,", "Ko jinin Yesu ya wanke ku?"] },
      { verse: "Korus", text: ["Ko an wanke ku yau?", "Cikin wannan jinin Dan rago?", "Ko an tsarkake ku daga zunubi?", "Ko Yesu Kristi ya wanke ku?"] },
      { verse: 2, text: ["Ko kuna bin nufin Mai Cetonmu yau?", "Ko jinin Yesu ya wanke ku?", "Ko kun sami hutawa gun Yesu yau?", "Ko jinin Yesu ya wanke ku."] },
      { verse: 3, text: ["Ango zai same ku cikin tsarki kwa?", "Ko jinin Yesu ya wanke ku?", "Ko Yesu zai same ku kuna shirye", "Ko jinin Yesu ya wanke ku."] },
      { verse: 4, text: ["Ku bar wannan hali na yin zunubi,", "A wanke ku cikin jininsa,", "A kwai mubulbula da zai wanke mu,", "Sai ku zo wurin Yesu ku zo"] }
    ],
    history: "Elisha Hoffman ya rubuta wannan waƙar don tambayar mai zunubi idan an wanke shi a cikin jinin Dan Ragon Allah, wanda shine kaɗai zai iya ba da tsarki da salama."
  },
  "HBH193": {
    title: "Akwai Iko Cikin Jinin",
    number: "HBH193",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "POWER IN THE BLOOD",
    meter: "10.9.10.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko ka gaji da bautar zunubi?", "Akwai iko fa, cikin jinin,", "Son yin nasara da shaidan?", "Akwai iko cikin jinin."] },
      { verse: "Korus", text: ["Akwai iko, mai al'ajibi,", "A jinin Dan rago;", "Akwai iko, iko mai al'ajibi,", "A jini na Dan rago."] },
      { verse: 2, text: ["Kana son ka rabu da fahariya?", "Akwai iko fa, cikin jinin,", "Zo za a wanke ka a kalfari;", "Akwai iko cikin jinin."] },
      { verse: 3, text: ["Kana son fa ka fita fari fat?", "Akwai iko fa, cikin jinin;", "Duk daudar zunubi za a wanke;", "Akwai iko cikin jinin."] },
      { verse: 4, text: ["Ko za ka bauta wa Yesu Sarki?", "Akwai iko fa, cikin jinin;", "Za ka yi ta raira yabo kullum?", "Akwai iko cikin jinin."] }
    ],
    history: "Lewis Jones ya rubuta wannan waƙar don jaddada cewa akwai iko mai ban al'ajabi a cikin jinin Yesu don yin nasara a kan zunubi da kuma tsarkake mai bi."
  },
  "HBH194": {
    title: "Yesu Ya Tuna Da Ni",
    number: "HBH194",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "SEWELL",
    meter: "9.9.9.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina murna cikin Yesu yau,", "Shi ya sa ina raira yabo", "Murna nake in fadi cewa,", "Yesu ya tuna da ni"] },
      { verse: "Korus", text: ["Yesu Mai Cetona, iya tuna da ni", "Yesu shi ne Mai Cetona, ya tuna da ni", "Yesu Mai Ceto na, iya tuna da ni", "Yesu shi ne Mai Cetona, ya tuna da ni"] },
      { verse: 2, text: ["Na karanta cikin littafi,", "Wanda zai zo mabulbular rai,", "Sa'anda na karanta, na ce,", "Yesu ya tuna da ni."] },
      { verse: 3, text: ["Ruhun Allah yana kiran mu,", "Sai mu amsa wannan kira yau,", "Da kiransa kullum nakan ce,", "Yana tunawa da ni."] },
      { verse: 4, text: ["Zo ka sami maganarsa fa,", "Mai watsakarwa za ta cika", "Zuciyarka da farin ciki,", "Yesu ya tuna da ni."] }
    ],
    history: "Waƙa ce ta murna da godiya wadda take bayyana yadda Yesu yake tuna da mai bi, yana ba shi farin ciki da kuma jagora ta wurin maganarsa mai rai."
  },
  "HBH195": {
    title: "Yesu Za Ya Karbe Mu",
    number: "HBH195",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "NEUMEISTER",
    meter: "7.7.7.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu za Ya karbe mu, Ku gaya wa duniya", "Kira zuwa gun Uba, Wanda ya ki, zai rasa."] },
      { verse: "Korus", text: ["Shaida Shi... Ga duniya...", "Yesu za...Ya karbe mu...", "Gaya wa... duk mutane...", "Yesu za ya karbe mu."] },
      { verse: 2, text: ["Zo, za Ya ba ku hutu; Yarda da maganarsa;", "Ba Ya kin mai zunubi; Yana son mai zunubi;"] },
      { verse: 3, text: ["Yanzu ina da murna, Mai Ceto Ya wanke ni", "Daga aibin zunubi; Cike nake da murna."] },
      { verse: 4, text: ["Yana son mai zunubi, Har da ni ma, bai ki ba;", "Za Ya wanke ni duka; Don in je sama da Shi."] }
    ],
    history: "Erdmann Neumeister ya rubuta wannan waƙar don tabbatar wa masu zunubi cewa Yesu yana maraba da su, yana wanke su, kuma yana shirya musu gida a sama."
  },
  "HBH196": {
    title: "Hanyar Gicciye Mai Kawo Ceto",
    number: "HBH196",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WAY OF THE CROSS",
    meter: "irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zan tafi gida, ta hanyar gicciye,", "Wannan shi kadai hanya,", "Ba zan ga hanyar, na zuwa gidan nan", "In na rasa hanyar gicciye,"] },
      { verse: "Korus", text: ["Hanyar gicciye ne, hanyar,", "Da ta kai mu zuwa gida", "Ina murna fa, ina tafiya,", "Ta zuwa wannan hanya."] },
      { verse: 2, text: ["Zan yi tafiya, ta wannan hanya,", "Hanyar da Yesu ya bi,", "In har ina so in je wurinsa,", "Wurin da tsarkakku suke."] },
      { verse: 3, text: ["Na yi ban kwana, Da duniya fa,", "Ba zan taba koma ba,", "Ubangiji ya ce zo ga hutu,", "Ga kofar sa a bude fa."] }
    ],
    history: "Jessie Pounds ya rubuta wannan waƙar don jaddada cewa hanyar gicciye ita ce kaɗai hanyar da take kai mai bi gida zuwa wurin Yesu da tsarkakku."
  },
  "HBH197": {
    title: "An Cece Ni",
    number: "HBH197",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "RAPTURE",
    meter: "9.6.9.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina da aboki mai so na, Yana so na sosai;", "Ina kaunar furta aikinSa, Da aikin al'ajibinSa."] },
      { verse: "Korus", text: ["An cece ni dai fa! Ga ni da sabon rai!", "Yanzu dai, murnata ta cike fa, An 'yantas da ni!"] },
      { verse: 2, text: ["Ya cece ni daga jaraba, Ya ba ni kariya;", "Ina dogaro da ikonsa; Na san za ya kula da ni."] },
      { verse: 3, text: ["Cikin talauci da kadaici, Cikin kauna Ya ce;", "\"Zo gare ni, zan ba ka hutu, Zo ka zauna tare da Ni.\""] }
    ],
    history: "Waƙa ce ta shaida wadda take bayyana murnar samun sabon rai ta wurin fansar Yesu, wanda ya cece mu daga jaraba kuma ya ba mu hutu."
  },
  "HBH198": {
    title: "Yana Da Ikon Cetonka",
    number: "HBH198",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "DELIVERANCE",
    meter: "10.10.10.10. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kalma mafi dadi da muka ji;", "Kalma daga lebunan mutane;", "Wanda duniya duka ta raira;", "Allahnmu na da ikon 'yantaswa."] },
      { verse: "Korus", text: ["Yana da ikon 'yantas da ku,", "Yana da ikon 'yantas da ku,", "Komai nauyin zunubi, zo gun Sa,", "Allahnmu na da ikon 'yantaswa."] },
      { verse: 2, text: ["Kalma mafi dadi da muka ji;", "Kalma mai dadi da aka raira;", "Gaya wa duniya, wannan kalmar:", "Allahnmu na da ikon 'yantaswa."] },
      { verse: 3, text: ["Kalma mafi dadi, a raira ta;", "Masu nauyin zuci da damuwa,", "Zo wurin Allah da bangaskiya;", "Allahnmu na da ikon 'yantaswa."] }
    ],
    history: "Waƙa ce ta bishara wadda take bayyana cewa Allahnmu yana da ikon 'yantas da dukan masu nauyin zunubi, tana kiran duniya ta ji wannan kalma mai dadi."
  },
  "HBH199": {
    title: "An 'Yantas Da Ni, Ina Da Murna",
    number: "HBH199",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ONCE FOR ALL",
    meter: "10.10.9.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["An 'yantas da ni, ina da murna;", "Yesu Ya zub da jini domina;", "Shi ya mutu domin mu rayu,", "Alherin ya 'yantas da mu."] },
      { verse: "Korus", text: ["Kai mai zunubi, zo ka karba!", "Ke mai zunubi, zo ki karba!", "Zo gun gicciye don gafara,", "Ga Yesu ya 'yantas da mu."] },
      { verse: 2, text: ["Tun da mun 'yantu, babu hukunci,", "Yesu ya ba da ceto cikakke;", "\"Zo gare ni,\" In ji muryarsa,", "Ku zo, za Ya 'yantas da mu."] },
      { verse: 3, text: ["'Ya'yan Allah, Kira daga sama,", "I, alherinSa za ya kare mu;", "Za ya ba mu rai cikakke,", "Ceto ga dukan mutane."] }
    ],
    history: "Philip Bliss ya rubuta wannan waƙar don daukaka fansar da muka samu sau ɗaya kuma gaba ɗaya ta wurin jinin Yesu, wanda ya 'yantas da mu daga hukuncin zunubi."
  },
  "HBH200": {
    title: "Alherin Da Ya Fi Zunubinmu",
    number: "HBH200",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MOODY",
    meter: "9.9.9.9. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Alherin Uba mai kaunarmu,", "Wanda ya fi duk zunubanmu,", "A kalfari ne ya yi mana,", "A can ne ya ba da jininsa."] },
      { verse: "Korus", text: ["Alherinsa, wanda zai wanke zunubanmu", "Alherinsa, wanda ya fi duk zunubanmu"] },
      { verse: 2, text: ["Ba za mu biye zunubi ba,", "Mene ne za ya wanke shi duk?", "Duba jininsa na zubowa,", "Har mu zama fari kamar snow."] },
      { verse: 3, text: ["Alherinsa babu irinsa,", "Zuwa ga wanda ya gaskanta,", "Kai da kake begen ganinsa,", "Ko za ka karbi alherinsa."] }
    ],
    history: "Julia Johnston ya rubuta wannan waƙar don bayyana yadda alherin Allah a Kalfari ya fi dukan zunubanmu girma, yana wanke mu har mu zama fari kamar snow."
  },
  "HBH201": {
    title: "Fiye Da Snow",
    number: "HBH201",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "FISCHER",
    meter: "11.11.11.11 with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ubangiji, ka maida ni cikakke,", "Ka kasance cikina har abada.", "Kawas da gumaka da magabtana", "Wanke ni yanzu in zama kamar snow."] },
      { verse: "Korus", text: ["Zama fari fari kamar snow", "Wanke ni yanzu in zama kamar snow"] },
      { verse: 2, text: ["Ya Yesu, dube ni daga kursiyinka", "Taimake ni in yi hadaya mai kyau", "Na bada kaina da dukan sanina", "Wanke ni yanzu in zama kamar snow"] },
      { verse: 3, text: ["Ya Yesu, wannan shi ne rokona fa.", "Uba, ina jira a gicciyenka", "Cikin bangaskiyata, na ga jininka", "Wanke ni yanzu in zama kamar snow"] },
      { verse: 4, text: ["Ya Yesu, Ka san cewa ina jira.", "Yanzu, ka ba ni sabuwar zuciya", "Ba ka kin wadanda suke nemanka", "Wanke ni yanzu in zama kamar snow"] }
    ],
    history: "James Nicholson ya rubuta wannan waƙar a matsayin roƙo ga Allah ya wanke zuciyar mai bi da jininsa, domin ya zama mai tsarki da kuma fari fiye da snow."
  },
  "HBH202": {
    title: "Yesu Ya Zo Cikin Kauna",
    number: "HBH202",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "HE LIFTED ME",
    meter: "8. 8. 8. 6. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu ya zo cikin kauna, Da jinkansa ya fanshe ni", "Daga kunyar zunubina, Na ga alherinsa"] },
      { verse: "Korus", text: ["Ya rike ni da hannunsa, Domin kada fa in nutse", "Zan raira yabonsa kullum, Domin ya rike hannuna"] },
      { verse: 2, text: ["Ya kira ni kafin in ji, Kafin damuwa ta rufe ni", "Amma da na ji muryarsa, Na ga cetonsa fa"] },
      { verse: 3, text: ["An sa masa rawanin kaya, Ga kusoshi a hannunsa", "Duka domin zunubaina, Na ga kaunarsa fa"] },
      { verse: 4, text: ["Yanzu gidana na sama, Damuwata duk sun kare", "Zan shaida shi in kuma ce, Yayi man alheri"] }
    ],
    history: "Charles Gabriel ya rubuta wannan waƙar don daukaka ƙauna da jinkai na Yesu wanda ya riƙe hannun mai bi don kada ya nutse a cikin zunubi."
  },
  "HBH203": {
    title: "Da Jininsa Ne Ya Fanshe Ni",
    number: "HBH203",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REDEEMED",
    meter: "9. 8. 9. 8. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Da jininsa ne ya fanshe ni", "Ina kaunar shaida wannan", "Ya fanshe ni don tausayinsa", "Ni dansa ne har abada."] },
      { verse: "Korus", text: ["Ya fanshe ni, Shi Dan rago na Allahnmu", "Ya fanshe ni, Ni dansa ne har abada"] },
      { verse: 2, text: ["Ni na sami murna cikakkiya", "Da ba zan iya furta ba", "Na san yana nan tare da ni", "Zai ci gaba da bi da ni"] },
      { verse: 3, text: ["Ina tunanin mai fansata", "Ina tunaninsa kullum", "Zan yi ta raira wakar yabo", "Kaunarsa ce maganata"] },
      { verse: 4, text: ["Na san zan gan shi cikin kawa", "Shi sarki da nake kauna", "Shi yana bi da sawayena", "Ya sa waka a bakina."] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar murna (Redeemed) don bayyana yadda jinin Dan Ragon Allah ya fanshe mu, ya sa murna cikakkiya a zuciya."
  },
  "HBH204": {
    title: "Me Zai Wanke Laifina?",
    number: "HBH204",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "PLAINFIELD",
    meter: "7.8.7.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Me zai wanke laifina? Babu sai dai jinin Yesu", "Mene zai tsarkake ni? Babu sai dai jinin Yesu"] },
      { verse: "Korus", text: ["Jinin mai tamani, Ya wanke ni sarai", "Ba wani taimako, Babu sai dai jinin Yesu"] },
      { verse: 2, text: ["Ina begen gafara, Babu sai dai jinin Yesu", "Ina rokon wankewa, Babu sai dai jinin Yesu"] },
      { verse: 3, text: ["Ba mai kawo gafara, Babu sai dai jinin Yesu", "Ba don nagarta ta ba, Babu sai dai jinin Yesu"] },
      { verse: 4, text: ["Bege da salama ta, Babu sai dai jinin Yesu", "Jininsa adalcina, Babu sai dai jinin Yesu"] }
    ],
    history: "Robert Lowry ya rubuta wannan waƙar (Nothing But the Blood of Jesus) don bayyana cewa babu abin da zai iya wanke zunubi ko ya ba da salama sai dai jinin Yesu."
  },
  "HBH205": {
    title: "Mun Gode Maka Ya Uba Allahnmu",
    number: "HBH205",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "REVIVE US AGAIN",
    meter: "11. 11 With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mun gode maka, Ya Uba, Allahnmu,", "Don ka aiko da Danka sabili da mu."] },
      { verse: "Korus", text: ["Halleluya, Madaukaki halleluya amin,", "Halleluya, Madaukaki, ka falkas da mu."] },
      { verse: 2, text: ["Mun gode maka, ya Ubagijinmu,", "Domin Ruhu Mai Tsarki, mai taimakonmu."] },
      { verse: 3, text: ["Dukan daukaka, da yabo naka ne", "Kai ka ba da ranka, ka dauke zunubai."] },
      { verse: 4, text: ["Ka falkas da mu, cika mu da kauna", "Iza mu don mu yi aikinka da gaskiya."] }
    ],
    history: "William Mackay ya rubuta wannan waƙar don jaddada godiya ga Uba saboda aiko da Ɗansa da kuma Ruhu Mai Tsarki don falkar da zukatan masu bi."
  },
  "HBH206": {
    title: "Cikin Begenka Ne, Na Zo Gunka",
    number: "HBH206",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "KEDRON",
    meter: "6. 4. 6. 4. 6. 6. 4.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Cikin begenka ne, na zo gunka", "Cikin bangaskiya, na durkusa", "Ni mai zunubi ne, wannan ne rokona", "Yesu nawa."] },
      { verse: 2, text: ["Ah! Ga zunubaina, sun yi yawa", "Duk da yawan su fa, ka dauke su", "Laifin rashin kauna, na rashin bangaskiya", "Su nake yi."] },
      { verse: 3, text: ["Ina so in tuba gare ka yau.", "Ina furta maka, duk laifina.", "Ka yafe mani su, ka wanke ni sosai", "Wanke ni yau."] },
      { verse: 4, text: ["Kai mai adalci ne, mai yafewa", "Kai mai kauna ne kuwa, Idan mun zo,", "Uba, ka wanke mu, da jinin Dan rago", "Jinin Yesu."] },
      { verse: 5, text: ["Bari salamarka, ta haska ni", "In yi tafiya ta, cikin kauna", "Ina jinginawa, ga bishewar ruhu", "Babu damuwa. AMIN."] }
    ],
    history: "Waƙa ce ta roƙo da bangaskiya wadda take bayyana yadda mai zunubi yake zuwa wurin Yesu don samun yafiya, wankewa, da kuma salamar Ruhu."
  },
  "HBH207": {
    title: "Ga Masu Bacewa, Sai Ku Cece Su",
    number: "HBH207",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "RESCUE",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ga masu bacewa, sai ku cece su", "Sai mu cece su daga zunubi", "Bi rudaddu yanzu, bi su da kuka,", "Gaya masu game da cetonsu"] },
      { verse: "Korus", text: ["Bi masu bacewa, kada su mutu", "Yesu mai tausayi zai cece su"] },
      { verse: 2, text: ["Duk masu zunubi, Yesu na jira", "Yana jiran duk mai son yin tuba", "Ga shi fa yana nan yana ta roko,", "Zai gafarta, wanda ya gaskanta"] },
      { verse: 3, text: ["Shaidan da wayonsa, ya farauce mu", "Ya so ya kai mu zuwa hallaka,", "Yesu da kaunarsa Ya kawo ceto,", "Zai sake sabunta zumuncinmu"] },
      { verse: 4, text: ["Ga masu bacewa, sai ku cece su", "Karfin aikin, Yesu zai tanada,", "Yi wa'azin ceto cikin hakuri,", "Cewa Yesu, ya mutu domin su."] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar bishara (Rescue the Perishing) don kiran masu bi su ceci masu bacewa su kuma dawo da su ga ƙaunar Yesu mai tausayi."
  },
  "HBH208": {
    title: "Tun Da Ya Fanshe Ni",
    number: "HBH208",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "OTHELLO",
    meter: "C. M. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina da farin ciki yau, Tun da ya fanshe ni", "Fansa ta Ubangijina, Tun da an fanshe ni"] },
      { verse: "Korus", text: ["Tun da an fanshe ni, Tun da an fanshe ni", "Zan daukaka sunansa, Tun da an fanshe ni,", "Zan daukaka shi mai cetona."] },
      { verse: 2, text: ["Yesu na mai gamsarwa ne, Tunda an fanshe ni", "Nufinsa ne fa burina, Tun da an fanshe ni"] },
      { verse: 3, text: ["Yesu Kristi ne shaidata, Tun da an fanshe ni", "Ya kawas da duk tsorona, Tun da an fanshe ni"] },
      { verse: 4, text: ["Ina da gida can sama, Tun da an fanshe ni", "Can zan zauna har abada, Tun da an fanshe ni"] }
    ],
    history: "Waƙa ce ta shaida da murna wadda take bayyana yadda fansar Yesu ta kawas da tsoro kuma ta ba wa mai bi farin ciki da begen gida a sama."
  },
  "HBH209": {
    title: "Wanda Yake So",
    number: "HBH209",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "McCONNELL",
    meter: "Irregular with refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Ceto ta wurin Alheri",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ina da murna yau, na sami haske.", "Babu sauran duhu fa, Yesu fa ya ce.", "Duk mai nauyin kaya ya zo gare shi."] },
      { verse: "Korus", text: ["\"Mai son tuba ya gaskanta ni\"", "Ya gaskanta ni ya gaskanta ni", "\"Mai son tuba ya gaskanta ni\"", "Mai son tuba ya gaskanta ni"] },
      { verse: 2, text: ["Begena cikakke, Zan yi yabonsa", "Yana cikin zuciyata, Shi ya cece ni,", "Daga zunubi, ceto da jininsa"] },
      { verse: 3, text: ["Wannan ce kauna fa, da alherinsa.", "Da ya mutu domina, na bata sosai", "Na bi duniya. Amma ya cece ni."] }
    ],
    history: "Waƙa ce ta shaida wadda take jaddada cewa ta wurin alherin Yesu da jininsa, mai bi yana samun haske da ceto daga zunubi."
  },
  "HBH210": {
    title: "Zunubaina Gun Yesu",
    number: "HBH210",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "AURELIA",
    meter: "7. 6. 7. 6. D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zunubaina gun Yesu, Dan Ragon Allahnmu", "Ya maida su laifinsa, Ya ba mu cetonsa", "Zunubaina gun Yesu, Domin ya wanke ni", "Kamar snow in zama, Ba illa ko kadan."] },
      { verse: 2, text: ["Bukatuna gun Yesu, Allah madawwami", "So nake kamar Yesu, In zama a raina", "Damuwata gun Yesu, Dukansu gare shi", "Shi zai raba ni da su, Zai raba ni da su."] },
      { verse: 3, text: ["In zama kamar Yesu, Cike da hakuri", "In zama kamar Yesu, Dan Allah Mai Tsarki", "In zauna fa da Yesu, Tare da tsarkakku", "Ina raira Yabonsa, Da tsarkakkunsa duk. AMIN."] }
    ],
    history: "Horatius Bonar ya rubuta wannan waƙar don bayyana yadda mai bi yake miƙa dukan zunubansa da damuwarsa ga Yesu, Dan Ragon Allah, domin ya sami tsarki."
  },
  "HBH211": {
    title: "Fada Man Labarin Yesu",
    number: "HBH211",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "STORY OF JESUS",
    meter: "8. 7. 8. 7. With Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Fada man labarin Yesu, Rubuta man a zuciya", "Fada mani labarin nan, Labari mai dadin ji", "Mala'iku sun yi waka, Sa'ad da aka haife shi", "Daukaka ga Allah Uba, Cikin duniya salama"] },
      { verse: "Korus", text: ["Fada man labarin Yesu", "Rubuta man a zuciya", "Fada mani labarin nan", "Labari mai dadin ji."] },
      { verse: 2, text: ["Ya yi azumi a jeji, Ba ni labarin nan fa", "Dominmu, an jarabce shi, Ya kuma yi nasara", "Ba ni labarin aikinsa, Da wahala da ya sha", "Ba'a da raini duk nasa ne, Duk ya sha saboda ni"] },
      { verse: 3, text: ["Fadi labarin gicciye, Da dukan wahalarsa", "Da labarin kabarinsa, Da yadda shi ya tashi", "Ba ni labarin kaunarsa, Domin in gane sosai", "Bari damuwata ta kare, Don kauna ta fanshe ni"] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar (Tell Me the Story of Jesus) don nuna sha'awar mai bi na jin labarin haihuwa, hidima, da kuma mutuwar Yesu a gicciye."
  },
  "HBH212": {
    title: "Kauna Ta Daga Ni",
    number: "HBH212",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "SAFETY",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zunubi ya danne ni, Ba ni da salama,", "Ni na nutse cikinsa, Har ba ni da bege", "Amma Ubangijina, Ya ji tausayina", "Shi ya ba ni cetonsa, Na tsira yau."] },
      { verse: "Korus", text: ["Kaunarsa ce Ta cece ni", "Sa'ad da ba taimako, ta cece ni", "Kaunarsa ce Ta cece ni", "Sa'ad da ba taimako, ta cece ni"] },
      { verse: 2, text: ["Zan ba shi dukan raina, Dogara gare shi,", "In zauna da shi kullum, Ina ta yabonsa,", "Kaunarsa mai girma ce, Yana son waka ta,", "Ni zan yi ta yabonsa, Don nasa ne"] },
      { verse: 3, text: ["Mai zunubi dube shi, Yesu zai cece ka,", "Daga dukan wahalu, Ta wurin kaunarsa.", "Shi shugaban halittu, Duk sun yi biyayya,", "Zai zama mai cetonka, Zo gunsa yau."] }
    ],
    history: "James Rowe ya rubuta wannan waƙar (Love Lifted Me) don bayyana yadda ƙaunar Yesu ta cece shi sa'ad da ya nutse a cikin zunubi kuma babu wani taimako."
  },
  "HBH213": {
    title: "Komai Munin Zunubanku",
    number: "HBH213",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CRIMSON",
    meter: "Irregular",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Komai munin zunubanku, Za a wanke su sarai", "Komai munin zunubanku, Za a wanke su sarai", "Ko sun yi ja kamar galura, Za su yi fari!", "Komai munin zunubanku; Komai munin zunubanku,", "Za a wanke su sarai, Za a wanke su sarai."] },
      { verse: 2, text: ["Ji murya na kiran ku, Komo wurin Allahnku!", "Ji murya na kiran ku, Komo wurin Allahnka!", "Shi mai yawan tausayi ne, Mai kauna kwarai;", "Ji murya na kiran ku, Ji murya na kiran ku", "Komo wurin Allahnku! Komo wurin Allahnku!"] },
      { verse: 3, text: ["Zai gafarta laifinku, Zai manta da su duka;", "Zai gafarta laifinku, Zai manta da su duka;", "\"Mutane sai ku lura fa\", In ji Allahnku!", "Zai gafarta laifinku, Zai gafarta laifinku", "Zai manta da su duka; Zai manta da su duka."] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar bisa ga littafin Ishaya 1:18, tana bayyana cewa ko da zunubanmu sun yi ja kamar galura, Allah zai iya wanke su su yi fari sarai."
  },
  "HBH214": {
    title: "Yesu Shi Ne Abokin Ka",
    number: "HBH214",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "LURA",
    meter: "10.7.10.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["A lokacin da kake damuwa, Ka nemi Yesu Kristi", "Lokacin da ka gaji da duniya, Ka nemi Yesu Kristi."] },
      { verse: "Korus", text: ["Ka nemi Yesu Kristi, Ya zama abokin ka,", "Shi wanda ya ji kukan, Ka zai share hawaye", "Ka nemi Yesu Kristi."] },
      { verse: 2, text: ["In ka bata cikin zunubinka, Ka nemi Yesu Kristi", "Yesu kadai ne fa zai cece ka, Ka nemi Yesu Kristi."] },
      { verse: 3, text: ["Lokacin da kake bakin ciki, Ka nemi Yesu Kristi", "Idan za ka yi shiri don Shaidan, Ka nemi Yesu Kristi."] },
      { verse: 4, text: ["In kullum kana fuskantar damuwa, Ka nemi Yesu Kristi", "Daukaka ga Yesu, bai canja ba, Ka nemi Yesu Kristi."] }
    ],
    history: "Waƙa ce ta bishara wadda take ƙarfafa mutane su nemi Yesu Kristi a lokacin damuwa, domin shi ne abokin da zai share hawaye kuma ya ba da ceto."
  },
  "HBH215": {
    title: "Sai An Sake Haifuwanka",
    number: "HBH215",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "BORN AGAIN",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Babban mallami ya zo gun Yesunmu", "Ya tambaye Shi hanyar ta samun ceto", "Ubangijinmu ya ba shi amsa fa,", "Sai an haifeka kuma"] },
      { verse: "Korus", text: ["Sai an sake haifuwar ka,", "Cikin Ruhu Mai Tsarki,", "Yau ina gaya maka, sai ka ji,", "Sai an haifeka kuma."] },
      { verse: 2, text: ["Ku 'ya'yan Allah ku ji wannan kalma,", "Da ke fitowa daga bakin Yesu,", "Ka da wannan sako ya zama banza,", "Sai an haifeka kuma."] },
      { verse: 3, text: ["Ku wadanda za ku shiga wannan gida,", "Sai ku raira wakar nan mai albarka,", "Kamin ku sami rai na har abada,", "Sai an haifeka kuma."] },
      { verse: 4, text: ["Gidan nan da kake ta yin begensa,", "Wata rana zan shiga wannan gida,", "Amma fa kamin ka shiga gidan nan,", "Sai an haifeka kuma."] }
    ],
    history: "William Sleeper ya rubuta wannan waƙar (Ye Must Be Born Again) bisa ga labarin Nikodimus a cikin Yahaya 3, inda Yesu ya ce dole ne a sake haifuwar mutum kafin ya ga mulkin Allah."
  },
  "HBH216": {
    title: "Na Kudurta Zan Bar Bin Duniya",
    number: "HBH216",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "RESOVED",
    meter: "10.6.10.6. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na kudurta zan bar bin duniya, Da sha'awowinta", "Abubuwan da sun fi na duniya, Suka rinjaye ni."] },
      { verse: "Korus", text: ["Ni fa da sauri zan je, Gun sa da murna,", "Yesu mafifici, Za ni wurin ka."] },
      { verse: 2, text: ["Na kudurta zan je gun Mai Ceto, In bar zunubaina", "Shi ne kadai mai gaskiya kuma, Gurasan nan mai rai."] },
      { verse: 3, text: ["Na kudurta zan bi Mai Cetona, Bi shi da gaskiya,", "Yi biyayya da umurninsa fa, Shi ne hanya mai rai."] },
      { verse: 4, text: ["Na kudurta zan shiga mulkinsa, In bar hanyar Shaidan", "Ko abokaina duka sun ki ni, Sai na shiga gidan."] },
      { verse: 5, text: ["Na kudurta wa zai je da ni yau, Ku zo abokaina,", "Ruhu Mai Tsarki ne ke bishe ni, Mu bi hanyar Yesu yau."] }
    ],
    history: "Palmer Hartsough ya rubuta wannan waƙar don bayyana ƙudurin mai bi na barin bin duniya da sha'awowinta domin ya bi Yesu, wanda shi ne hanyar gaskiya da rai."
  },
  "HBH217": {
    title: "Yi Taimako Ga Mazauna Duhu",
    number: "HBH217",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "LIFELINE",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yi taimako ga mazauna duhu", "Akwai wanda fa ke neman ceto", "Wani fa yana cikin hallaka,", "Wa zai taimake su domin su tsira?"] },
      { verse: "Korus", text: ["Ka yi taimako! Ka yi taimako! Wani yana hallaka", "Ka yi taimako! Ka yi taimako! Wani yana hallaka."] },
      { verse: 2, text: ["Yi taimako da sauri ba jinkiri:", "Ina dalilin bata lokaci?", "Ga shi yana mutuwa yi sauri yau,", "Je ka da sauri don ka taimake shi!"] },
      { verse: 3, text: ["Yi taimako ga masu shan wuya,", "Suna wahala babu misali:", "Iskar jarabobi da damuwa,", "Za su jefa su cikin bakin duhu."] },
      { verse: 4, text: ["Lokacin taimako na wucewa,", "Za su bar duniya zuwa lahira,", "Yi sauri dan'uwa kar ka shagala,", "Yi taimako domin ka yi ceto yau."] }
    ],
    history: "Edward Ufford ya rubuta wannan waƙar (Throw Out the Life-Line) a matsayin kira ga masu bi su yi hanzarin kai bishara ga waɗanda suke hallaka a cikin duhun zunubi."
  },
  "HBH218": {
    title: "Loton Da Muke Addu'a",
    number: "HBH218",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WHY NOT NOW?",
    meter: "7.7.7.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Loton da muke addu'a, Ka kwa ga damuwarka,", "Ubanmu, na kiran ka, Me zai hana ka zuwa?"] },
      { verse: "Korus", text: ["Me zai sa, Ba za ka, amsa kiran Yesu ba?", "Me zai sa, Ba za ka, Amsa kiran Yesu ba?"] },
      { verse: 2, text: ["Ka yi gantali sosai, Bar bata wani lokaci,", "Ba wa Allah fuskarka, Ka karbi alherinsa,"] },
      { verse: 3, text: ["Babu sauran salama, Cikin wannan duniya,", "Sai ka zo yau gun Yesu, Za ka sami salama."] }
    ],
    history: "Waƙa ce ta bishara wadda take tambayar mai zunubi dalilin da ya sa ba zai amsa kiran Yesu yanzu ba, tana gargaɗi game da jinkiri da hatsarinsa."
  },
  "HBH219": {
    title: "Ya Uba Na Cikin Sama",
    number: "HBH219",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "PASS ME NOT",
    meter: "8.5.8.5. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ya uba na cikin sama, Ina rokonka", "Bisa ga alkawarinka, Ji addu'a"] },
      { verse: "Korus", text: ["Yesu, Yesu, ji addu'ata", "Ina zuwa wurin Uba, cikin sunanka"] },
      { verse: 2, text: ["Uba, ga ni nan gabanka, Na yi zunubi", "In ba za ka karbe ni ba, Wa zai taya ni."] },
      { verse: 3, text: ["Ni ban isa ba ka ji ni, Allah Ubana,", "Amma cikin sunan Yesu, Kawo gafara."] },
      { verse: 4, text: ["Uba, ina yin godiya, Kai ka karbe ni", "Ka maishe ni bawa naka, Aikinka in yi."] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar (Pass Me Not, O Gentle Savior) a matsayin roƙo ga Allah ya ji muryar mai zunubi, ya kuma kawo gafara ta wurin sunan Yesu."
  },
  "HBH220": {
    title: "Don Me Kake Jinkiri",
    number: "HBH220",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "SHEFFIELD",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Don me ka yi jinkiri, Me kake jira tuntuni?", "Mai Ceto na jira Ya ba ka, Wuri can a kursiyinsa."] },
      { verse: "Korus", text: ["Me zai hana, ka zuwa wurin Yesu?", "Me zai hana, ka zuwa wurin Yesu?"] },
      { verse: 2, text: ["Me kake bege dan'uwa, Ka samu a jinkirin nan?", "Yesu shi ne kadai Mai Ceto, Babu wata hanya sai shi."] },
      { verse: 3, text: ["Ko kana ji a yanzu, Motsawan Ruhu Mai Tsarki?", "Ko za ka bi Cetonsa yau? Ka rabu da zunubanka?"] },
      { verse: 4, text: ["Me kake jira dan'uwa? Girbin fa yana wucewa,", "Albarkan Yesu na jiranka, Jinkiri na da hatsari."] }
    ],
    history: "Waƙa ce ta bishara mai jaddada kiran mai zunubi ya zo wurin Yesu ba tare da jinkiri ba, domin girbi yana wucewa kuma jinkiri yana da hatsari."
  },
  "HBH221": {
    title: "Kai Ne Nake Bukata",
    number: "HBH221",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "AURELIA",
    meter: "7.6.7.6. D",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Kai ne nake bukata, Ni mai zunubi ne", "Ina cikin damuwa, Zuciyata ta yi suwu", "Jinin Yesu nake so, Domin ya wanke ni", "Jininsa mai tamani, Mai laifi ke bida"] },
      { verse: 2, text: ["Kai ne nake bukata, Ni fa talaka ne,", "Bako ne a duniya nan, Ban da komai a nan,", "Ina son kaunar Yesu, Domin ta iza ni", "Ta kau da duk shakkuna, Ta zama karfina."] },
      { verse: 3, text: ["Kai ne nake bukata, Zama a bokina,", "Da aminina kuma, Mai kulawa da ni", "Kai ne nake bukata, Don biyan bukata", "In shaida damuwata, Don ka kau da ita"] }
    ],
    history: "Annie Hawks ya rubuta wannan waƙar (I Need Thee Every Hour) don nuna yadda mai bi yake buƙatar Yesu a kowane lokaci domin samun ƙarfi da salama."
  },
  "HBH222": {
    title: "Ba Ni Labarin Nan",
    number: "HBH222",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "Old, Old, Story",
    meter: "7.6.7.6.D with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ba ni labarin nan fa, Mulkin samaniya", "Na Yesu da zatinsa, Na kauna ta Yesu", "Ba ni labarin kawai, Don in gane da shi", "Don ba ni da karfi fa, Domin na lalace."] },
      { verse: "Korus", text: ["Ba ni labarin nan fa, Ba ni labarin nan fa,", "Ba ni labarin nan fa, Na kaunar Yesunmu"] },
      { verse: 2, text: ["Fada mini ba sauri, Domin in rike shi,", "Na fansar nan mai girma, Don shafe zunubai!", "Fada mini shi kullum, Ina da mantuwa;", "Komai yana shudewa, Komai na wucewa."] },
      { verse: 3, text: ["Ba ni labarin nan fa, Da murya mai taushi,", "Ka san ni mai laifi ne, Da Yesu zai ceto.", "Fada babu fasawa, Idan ka yarda fa", "A lokacin wahala, Yi mini ta'aziya."] },
      { verse: 4, text: ["Ba ni labarin nan fa, Idan ka lura dai", "Darajar duniyar nan, Na so ta rude ni.", "I, rudin duniyar nan, Na jan hankalina.", "Ba ni labarin nan fa: \"Kristi ne Mai Ceto\"."] }
    ],
    history: "Catherine Hankey ya rubuta wannan waƙar (I Love to Tell the Story) don nuna sha'awar mai bi na yawaita faɗin labarin ƙaunar Yesu da cetonsa ga wasu."
  },
  "HBH223": {
    title: "Allah Na Kira",
    number: "HBH223",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WOODWORTH",
    meter: "L. M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Allah na kira zan ji shi? Ko za in manne wa duniya?", "Ko kwanakina sun wuce? Zuciyata ta karaya?"] },
      { verse: 2, text: ["Allah yana kwankwasawa, Zuciya ta a rufe ne?", "Yana jira don ya karba, Ko zan bata masa rai dai?"] },
      { verse: 3, text: ["Allah na kira zan ji shi? Zan ci gaba da bin Shaidan?", "Allah ba zai bar ni ba fa, In yi ta bauta wa Shaidan!"] },
      { verse: 4, text: ["Allah na kira na zan tafi, Ba zan bata lokaci ba", "Na yi bankwana da duniya, Yanzu na amsa kiransa."] }
    ],
    history: "Waƙa ce ta bishara wadda take tambayar mai zunubi ko zai amsa kiran Allah yanzu, ko kuwa zai ci gaba da bin hanyar Shaidan da duniya."
  },
  "HBH224": {
    title: "Na Ji Kiran Ka Yau",
    number: "HBH224",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WELCOME VOICE",
    meter: "S.M. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na ji kiranka yau, Ya Ubangijina,", "A cikin jinin ka Yesu, Ka wanke zuciyata."] },
      { verse: "Korus", text: ["Ubangijina, ga ni nan na zo,", "Wanke duk zunubaina", "Da jininka Yesu."] },
      { verse: 2, text: ["Karfina ya kasa, Gun ka, na dogara,", "Kai ka wanke zunubaina, Na zama tsarkake"] },
      { verse: 3, text: ["Yesu na kirana, Don in kaunace Shi,", "In sa bege da bangaskiya, Yau da har abada"] },
      { verse: 4, text: ["Mu gai da Mai Ceto, Don shi ya fanshe mu,", "Mu gode da kaunar Yesu, Don shi ne karfinmu."] }
    ],
    history: "Lewis Hartsough ya rubuta wannan waƙar (I Hear Thy Welcome Voice) don nuna yadda mai bi yake amsa kiran Yesu na samun tsarki da wankewa ta wurin jininsa."
  },
  "HBH225": {
    title: "Yesu Ya Biya Duk",
    number: "HBH225",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "ALL TO CHRIST",
    meter: "6.6.7.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Tuba Da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ubangiji ya ce, Ku zo gare ni duk", "Da kayan laifinku, Zan ba ku hutawa"] },
      { verse: "Korus", text: ["Shi ya biya duk, Domin laifina", "Yesu ya hutar da ni, Ya ba ni sabon rai."] },
      { verse: 2, text: ["Yesu, na gaskata, Ikonka shi kadai", "Zai sake zuciyata, Ya ba ni sabon rai."] },
      { verse: 3, text: ["Ko kyau ba ni da shi, Ban isa kome ba", "Amma jinin Yesu, Ya wanke zuciyata."] },
      { verse: 4, text: ["A bisa kursiyinsa, Ina tsaye da shi,", "Ya mutu domina, Bakina yabe Shi."] }
    ],
    history: "Elvina Hall ya rubuta wannan waƙar (Jesus Paid It All) don bayyana cewa dukan bashin zunubinmu Yesu ya riga ya biya, kuma jininsa ya wanke mu sarai."
  },
  "HBH226": {
    title: "Zo Gun Mai Ceto Yau",
    number: "HBH226",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "INVITATION",
    meter: "6.6.6.6. D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zo gun Mai Ceto yau, Shi yana kiranka,", "Yi tuba ta gaskiya, Daga zuciyarka,", "A shirye ya ba ka, Ceto da salama,", "Daga nan duniya, Har zuwa can sama."] },
      { verse: 2, text: ["Zo gun Mai Ceto yau, Ku masu gantali,", "Sabunta rayuwarku, Yana kusa da ku", "Ku zo fa da sauri, Don za ya karbe ka", "Saboda kaunarsa, Zai bi da ku kullum."] },
      { verse: 3, text: ["Zo gun Mai Ceto yau, Da nauyin kayanka,", "Sai ka ji kirana, Ka mika mani su", "Kai mai damuwa, Ka zo gun Yesu yau", "Shi ne abokin da, Zai taimake ka yau."] }
    ],
    history: "Waƙa ce ta gayyata wadda take kiran dukan masu zunubi da masu nauyin kaya su zo wurin Yesu yanzu domin samun hutawa, ceto, da kuma salama."
  },
  "HBH227": {
    title: "Ku Zo Masu Nauyin Kaya",
    number: "HBH227",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "MERIONYDD",
    meter: "7.6.7.6.D.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ku zo masu wahala, Zan hutashe ku fa", "Maganar Yesu ta zo, Ga mai shan wahala", "Murya ce ta albarka, Da na alherinsa", "Murna na har abada, Da kauna mai yawa."] },
      { verse: 2, text: ["Ku zo masu mutuwa, Ni fa zan ba ku rai", "Maganar Yesu ta zo, Ga mai zaman kadaici", "Shaidan yana ta yaki, Domin ya danne mu", "Amma kai ka ba mu karfi, Don mu yi nufinka."] },
      { verse: 3, text: ["Duk wanda ya so ya zo, Ba zai kore shi ba", "Muryar Yesu Kristinmu, Na koran shakkunmu,", "muryarsa na kiranmu, Duk masu zunubi", "kaunarsa fa kyauta ce, A gare ka mun zo."] }
    ],
    history: "William Chatterton Dix ya rubuta wannan waƙar don jaddada kiran Yesu ga dukan masu wahala da masu mutuwa su zo wurinsa domin samun rai da alheri."
  },
  "HBH228": {
    title: "Ruhuna Ya Bace A Cikin Duniya",
    number: "HBH228",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "Haven of Rest",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ruhuna ya bace a cikin duniya,", "Ga zunubi ga damuwa,", "Sai na ji murya mai kyau tana cewa,", "\"Zabe ni ka sami hutu\"."] },
      { verse: "Korus", text: ["Na sa raina a cikin hannun Yesu,", "Ni ba zan sake bacewa ba;", "Damuwar duniya na iya zuwa,", "Amma ina cikin Yesu."] },
      { verse: 2, text: ["Na ba da kaina domin ya rike ni,", "Cikin bangaskiya ba shakka,", "Sarkokin hannuna duka sun zube,", "Na sami hutu cikinsa."] },
      { verse: 3, text: ["Wakar da nake yi don ya cece ni,", "Ita ce ta shaidar ceto, ta", "Yesu wanda zai ceci duk mai so", "Ya zauna a gidan sama."] },
      { verse: 4, text: ["Zo wurin Yesu yana ta jiran ka", "Domin ya yi maka ceto,", "Ka sa ranka a cikin hannuwansa,", "Ka ce, \"Yesu Shi ne nawa\"."] }
    ],
    history: "Henry Gilmour ya rubuta wannan waƙar (The Haven of Rest) don bayyana yadda ya sami hutawa da tsira a cikin Yesu bayan ya yi gantali a cikin zunuban duniya."
  },
  "HBH229": {
    title: "Yesu Mai Tausayi Yana Kira",
    number: "HBH229",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CALLING TODAY",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yesu mai tausayi yana kira, Ka ji kira, ka amsa yau", "Mai ya sa kana ta yin ta yawo? Kana ta nesa da Shi?"] },
      { verse: "Korus", text: ["Ya - - - na kira, Ya - - - kira", "Ye - - - su na kira - - -", "Mai tausayi na kiran ka yau."] },
      { verse: 2, text: ["Yesu mai tausayi yana kira, Mai nauyin kaya, sai ka zo", "Za ka sami hutawa a gunsa, Ba zai yi musun ka ba."] },
      { verse: 3, text: ["Yesu yana kira, ka zo gun sa, Yana jira, ka zo gun sa,", "Ka zo wurin sa da zunubanka, Kada ka yi jinkiri."] },
      { verse: 4, text: ["Yesu na roko, ka ji muryarsa, Ka ji muryarsa fa yanzu,", "Wanda ya gaskanta da sunansa, Za ya yi murna kwarai."] }
    ],
    history: "Fanny Crosby ya rubuta wannan waƙar (Jesus Is Calling) a matsayin kira mai tausayi ga dukan masu yawo da masu nauyin kaya su amsa kiran Yesu yau."
  },
  "HBH230": {
    title: "Bari Yesu Ya Shigo Zuciyarka",
    number: "HBH230",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "McCONNELSVILLE",
    meter: "10.8.10.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko ka gaji da yin zunubinka? Ba wa Yesu zuciyarka", "Kana so ka yi sabon rayuwa? Ka ba Yesu zuciyarka."] },
      { verse: "Korus", text: ["Yanzu, ka bar yin shakka, Ka bar kin Yesu kuma,", "Bude, kofar zuciyarka, Yesu Kristi ya shiga."] },
      { verse: 2, text: ["Ko don tsarkakewa ce kake so? Ba wa Yesu zuciyarka", "Mabubulan rai yana nan kusa? Ka ba Yesu zuciyarka."] },
      { verse: 3, text: ["In jaraba ta sha duk karfinka? Ba wa Yesu zuciyarka,", "Ko akwai taimako da kake so? Ka ba Yesu zuciyarka."] },
      { verse: 4, text: ["Don zama cikin masu yin murna? Ba wa Yesu zuciyarka", "Don zama a gidan nan na hutu? Ka ba Yesu zuciyarka."] }
    ],
    history: "C.H. Morris ya rubuta wannan waƙar don ƙarfafa mutane su buɗe kofofin zukatan su domin Yesu ya shiga ya kawo sabon rai da tsarkakewa."
  },
  "HBH231": {
    title: "Je Wurin Gicciye",
    number: "HBH231",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "LUBBOCK",
    meter: "11.8.11.8 with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko ka kasa cikin shirye-shiryenka?", "Je wurin gicciyensa fa", "Ko ka gaji da rayuwar duniyan nan", "Je wurin gicciyensa fa."] },
      { verse: "Korus", text: ["Je wurin gicciyensa fa", "Je wurin gicciyensa fa", "Za ya lura da kai amininka ne", "Je wurin gicciyensa fa"] },
      { verse: 2, text: ["Kana tafiya kai kadai cikin duhu", "Je wurin gicciyensa fa", "Kristi zai ta'azantar da zuciyarka", "Je wurin gicciyensa fa."] },
      { verse: 3, text: ["Ko za ka bi nufin Ubangijinmu", "Je wurin gicciyensa fa", "Ko za ka yi tafiya bisa maganarsa?", "Je wurin gicciyensa fa."] },
      { verse: 4, text: ["Ko kana dauke da nauyin zunubi?", "Je wurin gicciyensa fa", "Bude zuciyarka Kristi ya shiga,", "Je wurin gicciyensa fa."] }
    ],
    history: "Waƙa ce ta bishara wadda take nuna cewa mafita ga dukan damuwa, gajiya, da nauyin zunubi ita ce zuwa wurin gicciyen Yesu Kristi."
  },
  "HBH232": {
    title: "Ina Addu'a Domin Ku",
    number: "HBH232",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "INTERCESSION",
    meter: "11.11.12.11. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Mai Cetona, na roko domina fa,", "Shi ne mai kauna ta a duniyan nan", "Shi mai tausayi yana lura da ni dai,", "Shi Mai Cetona, shi ne Mai Ceton ka."] },
      { verse: "Korus", text: ["Ina addu'a fa, domin ku, a sama,", "Ina ta addu'a domin ku duk."] },
      { verse: 2, text: ["Ina da uba, da ya ba ni bege", "Bege na samun shiga mulkin Allah", "Jim kadan zai kira ni don sadu da Shi", "Shi wanda ya bi da ni zai bi da kai."] },
      { verse: 3, text: ["Ina da riga, shiryayyiya domina,", "Tana jira na, so in je in ganta,", "Sa'anda na karbi wannan rigan nan fa,", "Ina fatan abokaina su karba."] },
      { verse: 4, text: ["Gaya wa wasu labarin cetonka,", "Mai Cetona Yesu ne Mai Ceton ka,", "Yi addu'a Mai Ceto ya karbe su yau,", "Zai ji addu'arka yadda da yake yi."] }
    ],
    history: "Samuel O'Malley ya rubuta wannan waƙar (I Am Praying for You) don nuna yadda mai bi yake addu'a ga wasu su gane ƙaunar Yesu su kuma karɓi rigar cetonsa."
  },
  "HBH233": {
    title: "Daga Bauta Ta Da Damuwa",
    number: "HBH233",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "JESUS I COME",
    meter: "Irregular",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Daga bauta ta da damuwa,", "Yesu na zo, Yesu na zo", "Cikin haskenka da damuwa,", "Yesu na zo gunka,", "Na sami warkaswa gunka,", "Daga talauci zuwa wadata,", "Na bar zunubi, na zo gun ka,", "Yesu na zo gun ka."] },
      { verse: 2, text: ["Daga kunya da gazawa ta,", "Yesu na zo, Yesu na zo,", "Cikin daukakar gicciyenka,", "Yesu na zo gunka,", "Daga bacin rai da damuwa,", "Zuwa ga murna da salama,", "Daga bacin rai zuwa ga murna,", "Yesu na zo gun ka."] },
      { verse: 3, text: ["Daga hargitsi da girman kai,", "Yesu na zo, Yesu na zo,", "Na zo domin in yi nufinka,", "Yesu na zo gun ka,", "Na zauna yau cikin kaunarka,", "Yau na bar duniya, na zo gun ka,", "Domin in zauna tare da kai,", "Yesu na zo gun ka."] }
    ],
    history: "William Sleeper ya rubuta wannan waƙar (Out of My Bondage, Sorrow and Night) don bayyana sauyin da mai bi yake samu sa'ad da ya zo wurin Yesu."
  },
  "HBH234": {
    title: "Yau Ne Zarafi Domin Ka",
    number: "HBH234",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "CALVIN",
    meter: "8.8.8.8. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Yau ne zarafi domin ka", "Karbi yau hasken ceton nan", "Mai zunubi yau naka ne", "Yau ne ranar ka."] },
      { verse: "Korus", text: ["Me zai hana yau? Me zai hana yau?", "Ko za ka karba? Me zai hana yau?"] },
      { verse: 2, text: ["Kila gobe ba namu ba,", "Karbi albarka da ke yau", "Yau muna da tamu dama,", "Me zai hana yau?"] },
      { verse: 3, text: ["Allah mai jinkirin fushi,", "Yana kira cikin kauna", "Saki hanyar taurarewa,", "Me zai hana yau?"] },
      { verse: 4, text: ["Ubanmu ba ya kin kowa,", "Duk wadanda sun zo gun sa", "Suna da rai har abada,", "Me zai hana yau?"] }
    ],
    history: "Waƙa ce ta bishara wadda take ƙarfafa mai zunubi ya amsa kiran Allah yau, domin ba a san abin da gobe za ta haifa ba."
  },
  "HBH235": {
    title: "Gaskanta Shi",
    number: "HBH235",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "STOCKTON",
    meter: "C.M. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zo, kowane mai zunubi, ka nemi gafara,", "Yesu ya yi alkawari, Zai ba ka nasara."] },
      { verse: "Korus", text: ["Gaskanta shi, gaskanta shi, Gaskanta shi yau,", "Zai karbe ka, zai karbe ka, Zai karbe ka yau."] },
      { verse: 2, text: ["Yesu ya ba da jininsa, Jini mai daraja", "Har ma ya sha hukuncinka, Domin ka barata."] },
      { verse: 3, text: ["Yesu shi ne mai ba da rai, Shi ne mai gaskiya.", "Ka dogara gare shi dai, Zai tsare zuciyarka."] },
      { verse: 4, text: ["Zo cikin tsarkakkunsa yau, Yi tafiya da su", "Don rayuwa a can sama, Inda akwai murna."] }
    ],
    history: "John Stockton ya rubuta wannan waƙar (Only Trust Him) don kiran masu zunubi su dogara ga alkawarin Yesu kuma su gaskata cewa zai karɓe su yau."
  },
  "HBH236": {
    title: "Yesu Na Kira",
    number: "HBH236",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "THOMPSON",
    meter: "11.7.11.7. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Zo wurin Yesu yau yana kiran mu", "Kiran mu duka mu zo,", "Dube Shi can yana jira, na kira", "Jiranmu duka mu zo"] },
      { verse: "Korus", text: ["Ku zo, ku zo,", "Kira mu duka mu zo,", "Kiran mu duka da gaske na kira", "Ku masun nauyin kaya."] },
      { verse: 2, text: ["Don me muna yin jinkiri da amsa", "Shi yana kira mu zo", "Don me muna yin watsi da kaunarSa,", "Kaunar da ya ba mu duk."] },
      { verse: 3, text: ["Ga lokacin nan fa yana ta wuce", "Wucewa mani da ku;", "Inuwar mutuwa kwa tana zuwa", "Zuwa gare mu duka."] },
      { verse: 4, text: ["Kauna mai yawa ce ya alkawarta", "Ya alkawarta mana.", "Don zunuban da ya gafarta mana", "Ya gafarta mana duk."] }
    ],
    history: "Will Thompson ya rubuta wannan waƙar (Softly and Tenderly Jesus Is Calling) don nuna yadda Yesu yake kiran masu zunubi da tausayi su zo wurinsa domin samun gafara."
  },
  "HBH237": {
    title: "Ubangiji Ina Zuwa Gida",
    number: "HBH237",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "COMING HOME",
    meter: "8.5.8.5. with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na yi nesa da Allahna, Ina dawowa", "Na dade da bautar, Shaidan ina dawowa"] },
      { verse: "Korus", text: ["Dawowa, dawowa, Ba sauran yawo", "Karbe ni, da kaunarka, Uba ina dawowa"] },
      { verse: 2, text: ["Na bata yawan shekaru, Ina dawowa", "Da hawaye ina tuba, Ina dawowa"] },
      { verse: 3, text: ["Na gaji da yin zunubi, Ina dawowa", "Zan dogara ga kalmarka, Ina dawowa"] },
      { verse: 4, text: ["Zuciyata ta raunana, Ina dawowa", "Sabunta ni, ba ni bege, Ina dawowa"] }
    ],
    history: "William Kirkpatrick ya rubuta wannan waƙar (Lord, I'm Coming Home) don bayyana taba zuciyar mai zunubi wanda ya yi nesa da Allah kuma yanzu yake dawowa gida."
  },
  "HBH238": {
    title: "Duk Wanda Ke So",
    number: "HBH238",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WHOSOEVER",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Duk wanda ya ji sai ya ta da murya", "Ba da labarin ga dukan duniya", "Mutanen duniya su ji a ko'ina", "Don su ji su sami rai"] },
      { verse: "Korus", text: ["Duk wanda ke so duk wanda ke so", "Sai ya kai labarin ceto ko'ina", "Ubangiji ne yana wannan kira", "Duk wanda ke so ya zo."] },
      { verse: 2, text: ["Duk wanda ya ji ya zo banda shakka", "Ga kofofin sa duk a bude suke", "Yesu ne gaskiya shi ne kuma hanya", "Duk wanda ke so ya zo."] },
      { verse: 4, text: ["Alkawalinsa kullum a shirye ne", "Duk wanda ke so ya zo da jimrewa", "Zo ku karbi rai, rai kwa madawwami", "Duk wanda ke so ya zo."] }
    ],
    history: "Philip Bliss ya rubuta wannan waƙar (Whosoever Will) don jaddada kiran bishara ga dukan duniya cewa duk wanda yake so ya zo ya karɓi ruwan rai kyauta."
  },
  "HBH239": {
    title: "Tafarkinsa Tare Da Kai",
    number: "HBH239",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "NUSBAUM",
    meter: "Irregular with Refrain",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Ko za ku yi rayuwa domin Yesu kullum?", "Ko za ku bi matsatsen hanya da Shi?", "Ko za ku yarda ya dauki duk nawayanku?", "Bari ya yi nufinsa."] },
      { verse: "Korus", text: ["Ikonsa zai sa ku zama nasa.", "Jininsa zai wanke zunubanku", "Kaunarsa za ta bude idonku", "Abu mai kyau ne ya yi nufinsa."] },
      { verse: 2, text: ["Ko za ku amsa kiransa domin 'yantaswa?", "Ko kun san karbansa na kawo salama?", "Ko za ku karbe Shi domin ya taimake ku?", "Bari ya yi nufinsa."] },
      { verse: 3, text: ["Ko za ku sami wurin hutu a mulkinsa?", "Za ku bayyana gaskiyarsa ga kowa?", "Ko za ku yi bautarsa kullum da gaskiya?", "Bari ya yi nufinsa."] }
    ],
    history: "Waƙa ce ta ƙarfafawa wadda take kiran masu bi su ba da kansu ga nufin Yesu, ta wurin dogara ga ikonsa da kuma wankewar jininsa."
  },
  "HBH240": {
    title: "Na Zo Kamar Yadda Nake",
    number: "HBH240",
    author: "Ba a sani ba",
    composer: "Ba a sani ba",
    tune: "WOODWORTH",
    meter: "L.M.",
    key: "Ba a sani ba",
    scripture: "Ba a sani ba",
    theme: "CETO: Gayyata da Furtawa",
    year: "Ba a sani ba",
    musicSigns: [],
    lyrics: [
      { verse: 1, text: ["Na zo kamar yadda nake, Amma domin jininka ne", "Ka wanke ni domin in zo, Dan rago na Allahna zo."] },
      { verse: 2, text: ["Na zo kamar yadda nake, Don in kawas da zunubi", "Don jininka na wankewa, Dan rago na Allah Na zo."] },
      { verse: 3, text: ["Na zo dai cikin kasawa, Da damuwa da shakka na", "Yaki na zuci, da tsoro,Dan rago na Allah Na zo"] },
      { verse: 4, text: ["Na zo dai cikin talauci, Da makanta na zuciya", "Ina neman warkaswarka, Dan rago na Allah Na zo"] },
      { verse: 5, text: ["Na zo ko za ka karbe ni, Da kalmomi na marabta,", "Domin ka yi alkawali, Dan rago na Allah Na zo"] },
      { verse: 6, text: ["Na zo gun mai yawan kauna, Kaunar da ta bude kofa", "Domin yau na zama naka, Dan rago na Allah Na zo."] }
    ],
    history: "Charlotte Elliott ya rubuta wannan waƙar (Just As I Am) a matsayin shaida ta yadda mai zunubi yake zuwa wurin Yesu ba tare da wani abu ba sai dai dogara ga jininsa."
  },
  "HBH241": {
        title: "Ni Zan Tafi Wurin Yesuna",
        number: "HBH241",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ARISE",
        meter: "8.8.8.7. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Talaka mai zunubi zo, Raunana nakassashe", "Yesu na shirye da ceto, Yana da ikon jinkai."] },
          { verse: "Korus", text: ["Ni zan tafi wurin Yesuna.", "Zai karbe ni da hannuwansa;", "A hannayen Mai Cetona", "Darajarsa da yawa."] },
          { verse: 2, text: ["Ku zo ku masun jin kishi, Daukaka na yalwace;", "Bangaskiya da tuba kyauta, Alherinsa na kusa"] },
          { verse: 3, text: ["Ku zo masun nauyin kaya, Batattu, nakasassu;", "Kada ku jira sai gobe, Don kar ku kasa zuwa."] }
        ],
        history: "Joseph Hart ya rubuta wannan waƙar (Come, Ye Sinners, Poor and Needy) don kiran waɗanda suke jin rauni da nakasa su zo wurin Yesu domin yana da ikon jinkai."
  },
  "HBH242": {
        title: "Ana samun Jinkai!",
        number: "HBH242",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SEYMOUR",
        meter: "7.7.7.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ko ana samun jinkai, Domin masun zunubi?", "Ko Allah zai gafarta? Ya ceci mai zunubi?"] },
          { verse: 2, text: ["Na dade ina yawo, Cikin bautar zunubi", "Ba na ma jin kiransa, Kullum cikin zunubi."] },
          { verse: 3, text: ["Yesu ka amsa mani, Domin kai mai kauna ne", "Za ka gafarta mani? Ga ni yau a durkushe."] },
          { verse: 4, text: ["Ka sa ni yau in tuba, In yi nadama kuma", "Domin nauyin kayana, In rabu da zunubi."] }
        ],
        history: "Charles Wesley ya rubuta wannan waƙar (Depth of Mercy) don nuna mamaki ga yadda Allah yake da jinkai mai yawa ga mai zunubi wanda ya dade yana bijirewa."
  },
  "HBH243": {
        title: "Ga Ni Tafe Gun Gicciye",
        number: "HBH243",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRUSTING",
        meter: "7.7.7.7. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ga ni tafe gun gicciye, Gama ni mai laifi ne", "Ba na bukatar kome, Sai gafarta zunubi"] },
          { verse: "Korus", text: ["Na dogara da kai fa, Dan rago na Allah,", "Ga ni gun gicciyenka, Cece ni ya Yesuna."] },
          { verse: 2, text: ["Na dade da nemanka, Na dade da zunubi,", "Yesu ya yi mani Magana, \"Zan yafe zunubinka\""] },
          { verse: 3, text: ["Yau na ba ka duk raina, Da dukan wadata ta", "Jiki da dukan raina, Naka ne har abada."] },
          { verse: 4, text: ["Domin alkawalinka, Jinin ka ya fanshe ni", "Ga ni yau a durkushe, An gicciye ni da Shi."] }
        ],
        history: "William McDonald ya rubuta wannan waƙar (I Am Coming to the Cross) don bayyana tabbataccen dogara ga gicciyen Yesu domin samun wankewa da kuma yafiya."
  },
  "HBH244": {
        title: "Zo In Ji Muryar Yesu",
        number: "HBH244",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "HORTON",
        meter: "7.7.7.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Zo in ji muryar Yesu, Zo ka bi tawa hanya;", "Zan kai ka naka gida, Sai ka zo wurina yau.."] },
          { verse: 2, text: ["Ka rayu babu gida, Gori ma an yi maka", "Ka yi kamar mai yawo, Ka yi tafiya ko'ina"] },
          { verse: 3, text: ["Ka rayu cikin kunci, Ba ka sami jin dadi", "Kai da ba ka da laifi, Ka rayu da makoki"] },
          { verse: 4, text: ["Sai ka zo gun hutawa, Ana samun warkaswa", "Cikakkiyar salama, Hutawa har abada."] }
        ],
        history: "Waƙa ce ta bishara wadda take kiran masu zunubi su zo wurin Yesu domin samun warkaswa da kuma salama har abada a cikin gidan hutawa."
  },
  "HBH245": {
        title: "Ko Kana Damuwa?",
        number: "HBH245",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "STEPHANOS",
        meter: "8.5.8.3.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ko zunubi ya yi nauyi, Ya sa ku damu?", "Ku zo gare ni in ji shi, Don hutu."] },
          { verse: 2, text: ["Yana da hanya da zan bi, In ya bishe ni", "Ya sha wahala domina, Da suka."] },
          { verse: 3, text: ["Idan na dogara ga shi, Me yake da shi", "Wahala ta za ta kare, A urdu."] },
          { verse: 4, text: ["In na roki taimakonsa, Shi ba zai ki ba", "Ko da sama da duniya, Ta shude."] }
        ],
        history: "John Mason Neale ya fassara wannan waƙar daga Helenanci (Art Thou Weary, Art Thou Languid) don nuna cewa Yesu ne kaɗai mafita ga mai nauyin zunubi."
  },
  "HBH246": {
        title: "Ku Zo Gun Yesu Dukanku",
        number: "HBH246",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "BULLINGER",
        meter: "8.5.8.3.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ku zo gun Yesu dukan ku, Masu zunubi", "Ko mene ne zunubinku, Don hutu"] },
          { verse: 2, text: ["Zo gun sa da, damuwar ka, Nemi hutawa", "Warkaswa na gun Yesu, Zo gun sa"] },
          { verse: 3, text: ["Karkiyarsa na da sauki, Zai sauke nauyi", "Ko mene ne nawayarku, Zai sauke"] },
          { verse: 4, text: ["Zo gun sa da muryoyin fa, Da nufin tuba", "Saukar da duk zunubinku, Gun Yesu."] }
        ],
        history: "Waƙa ce ta yabo da daukaka wadda take kiran dukan duniya su buɗe kofofin zukatan su don karɓar Sarkin sarakuna da Mai Ceto Yesu Kristi."
  },
  "HBH247": {
        title: "KU TA DA KANKU KYAMARAI",
        number: "HBH247",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRURO",
        meter: "L.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ku ta da kanku kyamarai, Ga sarkinmu mai daraja", "Domin sarkin sarakuna, Ga sarkin duniya ya zo"] },
          { verse: 2, text: ["Bude kofofin zuciya, Bari ku zama santalai", "Masun daraja don Allah, Zama da murna da kauna"] },
          { verse: 3, text: ["Mai Ceto zo muna shirye, Kofofin mu a shirye ne", "Muna son yin zumunci da kai, Bayyana mana kaunarka."] }
        ],
        history: "Philip Bliss ya rubuta wannan waƙar (Almost Persuaded) don yin gargaɗi ga waɗanda suka kusan yarda su karɓi Yesu amma har yanzu suna jinkiri."
  },
  "HBH248": {
        title: "Ni Na Yarda In Bada Gaskiya",
        number: "HBH248",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ALMOST PERSUADED",
        meter: "Irregular",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ni na yarda in bada gaskiya", "Ni na yarda in karbi Yesu;", "Ka da ku ce babu ya kai ruhu jeka", "Sai ko wata rana, zan zo gun ka."] },
          { verse: 2, text: ["Na rinjayu zo, zo guna yau", "Na rinjayu ba zan juya ba", "Yesu na kira yau, mala'iku na kusa", "Cikin ruhun addu'a; kasashe zo."] },
          { verse: 3, text: ["Na rinjayu girbi da yawa", "Na rinjayu shari'a na zuwa", "Ba zan yarda ba in, kunyata a ranar", "Domin kada muma mu yi kuka."] }
        ],
        history: "Waƙa ce ta miƙa kai wadda take nuna yadda matashi ko kowane mai bi yake zuwa wurin Yesu don mika dukan rayuwarsa ga hidimar Allah."
  },
  "HBH249": {
        title: "Na Zo Kamar Yadda Nake",
        number: "HBH249",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "JUST AS I AM",
        meter: "8.8.8.6.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na zo kamar yadda nake, Kai ne abokin kanana", "Na tsarkake kaina don kai, Yesu ga ni na zo"] },
          { verse: 2, text: ["Ga ni tun da asubahi, Na mika duk rayuwata", "Babu abin da na boye, Da duk zuciya na zo"] },
          { verse: 3, text: ["Zan yi rayuwar haskenka, Zan yi rayuwar gaskiyarka", "Zan bauta maka kai kadai, Gare ka ne na zo."] },
          { verse: 4, text: ["Na zo kamar yadda nake, Matashi ne da 'yanci na", "In yi rayuwar bangaskiya, Ubangiji na zo."] }
        ],
        history: "Charles Wesley ya rubuta wannan waƙar (Blow Ye the Trumpet, Blow!) don shelar shekarar jubili, inda ake kiran fansassun Allah su dawo gida cikin farin ciki."
  },
  "HBH250": {
        title: "Zo Ku Busa Kaho",
        number: "HBH250",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "LENOX",
        meter: "6.6.6.6.8.8.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "CETO: Gayyata da Furtawa",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Zo ku busa kaho, Ku ta da muryarku", "Bari duniya ta ji, Birni da karkara", "Shekarar farin ciki ce, Shekarar farin ciki ce", "Komo gida ku fansassu."] },
          { verse: 2, text: ["Yesu ne babban firist, Shi ya 'yantas da mu", "Ku masu damuwa, Da masu makoki", "Shekarar farin ciki ce, Shekarar farin ciki ce", "Komo gida ku fansassu."] },
          { verse: 3, text: ["Ji muryar bishara, Albishir gare ku", "Ku karbi cetonsa, Da shiga mulkinsa", "Shekarar farin ciki ce, Shekarar farin ciki ce", "Komo gida ku fansassu."] }
        ],
        history: "Jane Borthwick ya fassara wannan waƙar daga Jamusanci (My Jesus, as Thou Wilt!) don bayyana cikakkiyar biyayya ga nufin Allah a cikin kowane hali."
  },
  "HBH251": {
        title: "Yesu Ubangiji",
        number: "HBH251",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "JEWEETT",
        meter: "6.6.6.6.D",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Yesu Ubangiji, Nufin ka shi zama", "Ina cikin kauna, Cikin ta zan rayu;", "Ko dadi ko rashi, Rike ni naka ne", "Taimake ni in ce, Nufin ka shi zama"] },
          { verse: 2, text: ["Yesu Ubangiji, Ka gan hawayena", "Karfafa begena, Domin in haskaka", "Ka rayu a duniya, Cikin rashin dadi", "Domin in ji dadi, Nufin ka shi zama"] },
          { verse: 3, text: ["Yesu Ubangiji, Kome mai yiwuwa ne", "Kowane sauyi ne, Da zuciya daya", "Zan karbi duk komi, Domin hanya zuwa", "Madawwamin rai fa, Nufin ka shi zama. AMIN"] }
        ],
        history: "Frederick Faber ya rubuta wannan waƙar (Faith of Our Fathers) don daukaka bangaskiyar iyayenmu da ta tsira duk da tsanantawa, tana kiranmu mu bi ta."
  },
  "HBH252": {
        title: "Bangaskiyar Iyayenmu",
        number: "HBH252",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. CATHERINE",
        meter: "8.8.8.8.8.8.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Bangaskiyar iyayenmu, Duk da yawan tsanantawa", "Yau muna da farin ciki, Duk inda mun ji kalmarka", "Bangaskiyar iyayenmu, Tamu ce har matuka fa"] },
          { verse: 2, text: ["Bangaskiyar iyayenmu, Za mu sa kowa ya karba", "Domin ita ce hanyar rai, Wanda kowa na da 'yanci", "Bangaskiyar iyayenmu, Tamu ce har matuka fa."] },
          { verse: 3, text: ["Bangaskiyar iyayenmu, Kaunarmu ce na komi fa", "Za mu shaida wannan kaunar, Cikin dukan rayuwarmu", "Bangaskiyar iyayenmu, Tamu ce har matuka fa. AMIN"] }
        ],
        history: "Waƙa ce ta ƙarfafawa wadda take kiran mai bi ya ba da gaskiya ga Allah a kowane hali, domin shi yana mulki kuma ba zai taɓa kasawa ba."
  },
  "HBH253": {
        title: "Ka bada Gaskiya Ga Allah",
        number: "HBH253",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "MUSKOGEE",
        meter: "11.10.11. 8. With Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ko cikin kadaici ka bada gaskiya", "Yana gani ya kuma san hanya", "'Ya'yansa ba za su rayu su kadai", "Bada gaskiya, bada gaskiya."] },
          { verse: "Korus", text: ["Bada gaskiya, yana mulki", "Bada gaskiya don yana kiyaye;", "Ba zai kasa zai yi nasara", "Bada gaskiya, Bada gaskiya."] },
          { verse: 2, text: ["Bada gaskiya ko addu'a bai karba", "Ka ci gaba shi ba zai manta ba", "Sai ku jimre kuna ta addu'o'i", "Bada gaskiya, shi zai amsa"] },
          { verse: 3, text: ["Bada gaskiya cikin duk damuwarku", "Zuciyarsa za ta tuna da ku", "Kai dukan damuwarku gun Mai Ceto", "Kai su gunsa, kai su gunsa."] },
          { verse: 4, text: ["Bada gaskiya ko duk komi ba ya yi", "Ba da gaskiya shi makiyayi ne", "Ba ya kasa ko mulkoki sun kasa", "Yana mulki, yana mulki."] }
        ],
        history: "Waƙa ce ta dogara wadda take kiran mai bi ya kai dukan damuwarsa ga Uba, domin shi ne madogara wanda ya yi alkawarin kiyaye mu."
  },
  "HBH254": {
        title: "Kai Damuwa Gun Uba",
        number: "HBH254",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SEYMOUR",
        meter: "7.7.7.7",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kai damuwa gun Uba, Dogara kan kalmarsa", "Shi ne madogararmu, Ko zamanai sun shude,"] },
          { verse: 2, text: ["Ko mene ne damuwan, Za ka ga kaunar Allah;", "Alkawarin sa na nan, Ni ne kar ka ji tsoro."] },
          { verse: 3, text: ["Kai damuwarku gun sa, Jinkansa a yalwace", "Shi zai rike hannunka, Har zuwa wurin hutu."] },
          { verse: 4, text: ["Ikonsa na da karfi, A lokacin kasawa", "Dogara ga kalmarsa, Kai damuwa gun Uba. AMIN"] }
        ],
        history: "William Bathurst ya rubuta wannan waƙar (O for a Faith That Will Not Shrink) don roƙon Allah ya ba mu bangaskiya mai ƙarfi wadda ba za ta jijjigu ba."
  },
  "HBH255": {
        title: "Bangaskiya Mara Kasawa",
        number: "HBH255",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ARLINGTON",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Cikakkiyar bangaskiya, Ba za ta jijjigu ba", "Kome yawan matsaloli, Na wannan duniya."] },
          { verse: 2, text: ["Wadda ba ta gunaguni, Ko cikin damuwa", "A loton da mun karaya, Shi ne madogara"] },
          { verse: 3, text: ["Bangaskiya sahihiya, Cikin matsaloli", "Ba ta jin tsoron hatsari, Ba ta kwa jin shakka"] },
          { verse: 4, text: ["Ina son wannan bangaskiya, Komene ya taso", "Kai ne Allah madogara, Ka kai mu gidanka.AMIN."] }
        ],
        history: "John Yates ya rubuta wannan waƙar (Faith Is the Victory) don ƙarfafa sojojin Almasihu su yi yaƙi da bangaskiya, domin ita ce nasarar da take shawo kan duniya."
  },
  "HBH256": {
        title: "Bangaskiya Ita Ce Nasara",
        number: "HBH256",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SANKEY",
        meter: "C.M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ku sojojin Almasihu, Dauki makamanku", "Ku yi kuwwa domin yaki, Ku dage da karfi", "Ga magabcinku nan tsaye, Ku yi da karfinku", "Bangaskiya ce nasara, Za ta, shawo kan duniya"] },
          { verse: "Korus", text: ["Bangaskiya, ce nasara, Bangaskiya, ce nasara", "Cikakiyar nasara, Da ta shao kan duniya."] },
          { verse: 2, text: ["Tutan sa a kanmu kauna, Kalmarsa takobi", "Muna bin sawun tsarkaka, Da ihun nasara.", "Karfinsu na kamar iska, Tana sharewa duk", "Har sun tsere wa mutuwa, Sun kai ga nasara."] },
          { verse: 3, text: ["Ga maganar mu ko'ina, Suna shirin yaki", "Mu bar wurin shakatawa, Mu ja dagar yaki", "Mu dauki kwalkwalin ceto, Damararmu gaskiya", "Har sai mun shao kan duniya, Da ihun Nasara."] }
        ],
        history: ""
      },
      "HBH257": {
        title: "Na Ta Da Idona Wurin Mai Cetona",
        number: "HBH257",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "OLIVETT",
        meter: "6.6.4.6.6.6.4.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na ta da idona, Wurin Mai Cetona", "Wurin Yesu, Sai ka ji rokona,", "Yafe laifofina, In zama naka yau", "Har abada"] },
          { verse: 2, text: ["Bari alherinka, Ya tabi zuciyata", "Karfafa ni, Ta wurin mutuwarka,", "Na sami cetonka, Sai ka tsabtace ni", "Don aikinka."] },
          { verse: 3, text: ["A cikin Tafiyata, A wannan duniya,", "Lura da ni, Na gane damuwata,", "Share duk hawaye, Ka da in kauce", "Daga hanyarka."] },
          { verse: 4, text: ["Na yi ta tunani, Karshen rayuwata,", "Zan koma can, Saboda kaunarka,", "Ka dauke tsorona, Ka bi tare da ni,", "Har mulkinka."] }
        ],
        history: "Ray Palmer ya rubuta wannan waƙar (My Faith Looks Up to Thee) a matsayin addu'a ta bangaskiya, yana roƙon Yesu ya ba shi ƙarfi da salama a cikin tafiyarsa ta duniya."
  },
  "HBH258": {
        title: "Dogara Ga Sunan Yesu",
        number: "HBH258",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRUST IN JESUS",
        meter: "8.7.8.7. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Dogara ga sunan Yesu, Gaskanta da kalmarsa", "Na jingina wurin Yesu, Ba kwa zan sha kunya."] },
          { verse: "Korus", text: ["Yesu, Yesu ina sonka, Kai kadai Mai Ceto ne", "Yesu, Yesu ni zan bi ka, Daga nan har abada"] },
          { verse: 2, text: ["Dogara ga sunan Yesu, Jinin sa ya wanke ni", "Bangaskiya ta fanshe ni, Warkaswa har na samu."] },
          { verse: 3, text: ["Dogara ga sunan Yesu, Na daina yin zunubi", "Rai kyauta gun sa na samu, Salama da kwanciyar rai."] },
          { verse: 4, text: ["Ina murna na san Yesu, Yesu Kristi Mai Ceto", "Na san kana tare da ni, Har abada ka nanan."] }
        ],
        history: "Louisa Stead ya rubuta wannan waƙar ('Tis So Sweet to Trust in Jesus) don bayyana zaƙi da farin ciki na dogara ga sunan Yesu da kuma gaskata da maganarsa."
  },
  "HBH259": {
        title: "Bada Gaskiya Ga Yesu",
        number: "HBH259",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRUSTING JESUS",
        meter: "7.7.7.7. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Bada gaskiya koyaushe, A kowane yanayi", "Ko cikin raunanawa, Yesu ne bangaskiyata."] },
          { verse: "Korus", text: ["Bangaskiya kulayomi, Bangaskiya na koyaushe", "Bangaskiya ko mene ne, Yesu ne bangaskiyata."] },
          { verse: 2, text: ["Ruhunsa na haskaka, Cikin karyayen zuciya", "Shi ne yana bishe ni, Yesu ne bangaskiyata"] },
          { verse: 3, text: ["Zan raira masa yabo, Addu'a gunsa zan kai;", "Ko cikin hatsari ne, Yesu ne gaskiyata."] },
          { verse: 4, text: ["Bangaskiya duk rayuwa, Bangaskiya ta koyaushe", "Har matuka ma ta yi, Yesu ne bangaskiyata."] }
        ],
        history: "Waƙa ce ta ƙarfafawa wadda take jaddada cewa a kowane hali, Yesu ne tushen bangaskiyarmu da kuma madogara mara girgiza."
  },
  "HBH260": {
        title: "In Mun Yi Tafiya Da Yesu",
        number: "HBH260",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "TRUST AND OBEY",
        meter: "6.6.9 D with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["In mun yi tafiya, Cikin hasken Yesu,", "Za mu ga hasken daukakarsa, In mu yi nufinsa,", "Yana tare damu, Da duk wanda zai yi biyayya."] },
          { verse: "Korus", text: ["Yi biyayya, babu wata hanya,", "Na murna cikin Yesu, sai mu yi biyayya."] },
          { verse: 2, text: ["Cikin kuncinmu duk, Yakan tallafe mu", "Yana karfafa zukatanmu, Ko jaraba ta zo,", "Zai yi hanyar tsira, Masu bi za su ci nasara."] },
          { verse: 3, text: ["In mun zo gun Yesu, Tare da bada kai,", "Za ya tabbatar da kaunarsa, Domin alherinsa,", "Da yake nunawa, Ga duk wanda ke yin biyayya."] },
          { verse: 4, text: ["Cikin zumuncinmu, Za mu zauna da shi", "Muna tafiya tare da shi, Za mu yi biyayya,", "Cikin umurninsa, Babu tsoro sai dai biyayya."] }
        ],
        history: "John Sammis ya rubuta wannan waƙar (Trust and Obey) don nuna cewa sirrin farin ciki a rayuwar Krista shine dogara ga Allah da kuma yin biyayya ga umurninsa."
  },
  "HBH261": {
        title: "Na Sami Aboki Yesu",
        number: "HBH261",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "FRIEND",
        meter: "8.7.8.7.D",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bangaskiya da Yarda",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na sami aboki Yesu, Shi kuwa yana kaunata;", "Kaunarsa ce ta jawo ni, Ya damre ni a gunsa", "Ya kewaye zuciyata, Babu wani kamarsa", "Da ni da shi duk daya ne, Da yau, da har abada."] },
          { verse: 2, text: ["Na sami aboki Yesu, Shi ya mutu domina;", "Ya ba ni rai har abada; Ya kuma bada ransa", "Domin ni, in sami nawa, Shi ne kwa mai bayaswa;", "Dukan karfina da komai, Nashi ne har abada."] },
          { verse: 3, text: ["Na sami aboki Yesu, Dukan iko nasa ne,", "Domin shi ne mai tsare ni, Don ya kai ni gidansa,", "Gidan nan na samaniya, Inda babu wahala;", "Yanzun ne lokacin aiki, Kafin lokacin hutu."] },
          { verse: 4, text: ["Na sami aboki Yesu, Aboki mai alheri,", "Mashawarci ne kwa mai kyau, Shi kwa mai tsaro mai kyau", "Gun sa ne na koyi kauna, Da kuma ikon ceto", "Ko mene ne ya same ni, Zan mika kaina gun sa."] }
        ],
        history: "James Small ya rubuta wannan waƙar (I've Found a Friend, O Such a Friend) don bayyana kyakkyawan zumunci da kauna da ke tsakanin Krista da Mai Ceto Yesu Kristi."
  },
  "HBH262": {
        title: "Tushen Bangaskiya",
        number: "HBH262",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ADESTE FIDELES",
        meter: "11.11.11.11.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Tushen bangaskiya na dukan, tsarkaka,", "Yana cikin Littafin Allah Mai Rai!", "Kasa kunnenka, Ga maganar Allah,", "Domin ka buya cikin Yesu Kristi,", "Domin ka buya cikin Yesu Kristi."] },
          { verse: 2, text: ["Ni ne Allah mai girma Mai taimako,", "Tsoro kada ka ji ko ka yi fargaba", "Karfi zan ba ka, zan rike ka sosai", "Da hannuna mai iko mai yin nasara", "Da hannuna mai iko mai yin nasara"] },
          { verse: 3, text: ["Ko cikin tsanani ko cikin kunci,", "Zan taimake ka fa da alherina", "Ba za su cuce ka, su yi illa ba", "Ku zama da tsarki da karfin zuciya", "Ku zama da tsarki da karfin zuciya"] }
        ],
        history: "John Rippon ya rubuta wannan waƙar (How Firm a Foundation) don jaddada cewa maganar Allah ita ce madogara mafi ƙarfi ga dukan tsarkaka a cikin kowane tsanani."
  },
  "HBH263": {
        title: "Tushen Bangaskiya",
        number: "HBH263",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "FOUNDATION",
        meter: "11.11.11.11.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Tushen bangaskiya na dukan, tsarkaka,", "Yana cikin Littafin Allah Mai Rai!", "Kasa kunnenka, Ga maganar Allah", "Domin ka buya cikin Yesu Kristi."] },
          { verse: 2, text: ["Ni ne Allah mai girma Mai taimako", "Tsoro kada ka ji ko ka yi fargaba", "Karfi zan ba ka, zan rike ka sosai", "Da hannuna mai iko mai yin nasara."] },
          { verse: 3, text: ["Ko cikin tsanani ko cikin kunci,", "Zan taimake ka fa da alherina", "Ba za su cuce ka, su yi illa ba", "Ku zama da tsarki da karfin zuciya."] },
          { verse: 4, text: ["Wanda ya dogara ga Yesu Kristi", "Ba zai yashe shi ko rabu da shi ba,", "Shi ko Shaidan, Ya so ya girgiza shi,", "Ina rike da shi ba zan bar shi ba", "Ina rike da shi ba zan bar shi ba. AMIN"] }
        ],
        history: "Wannan wata sigar ce ta waƙar 'How Firm a Foundation' wadda take ƙara jaddada alƙawarin Allah na rashin barin waɗanda suka dogara gare shi."
  },
  "HBH264": {
        title: "Albarkar Allah Na Zuwa",
        number: "HBH264",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SHAWER OF BLESSINGS",
        meter: "8.7.8.7. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Albarkar Allah na zuwa, Kamar dai ake yin ruwa", "Bisa ga baiwa da bawa, Bisa kan mutane duk."] },
          { verse: "Korus", text: ["Albarkar na zuwa, Albarkar Allah na zuwa", "Kamar dai ake yin ruwa, Bisa kan duniya duk."] },
          { verse: 2, text: ["Albarkar Allah na zuwa, Tare da wartsakewa,", "Bisa ga halitta duka, Za su sami yalwarta."] },
          { verse: 3, text: ["Albarkar Allah na zuwa, Aiko bisan mu a yau", "Wartsake rayukan mu duk, Cika alkawarinka."] },
          { verse: 4, text: ["Albarkar Allah na zuwa, Muna bukatar ta yau", "Ga Allah muna yin roko, Ga Yesu muna kira."] }
        ],
        history: "Daniel Whittle ya rubuta wannan waƙar (There Shall Be Showers of Blessing) bisa ga Ezekiel 34:26, yana roƙon Allah ya menci albarkunsa bisa ga ikilisiya."
  },
  "HBH265": {
        title: "Ko'ina Cikin Salamar Zuciya",
        number: "HBH265",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "VILLE DU HAVRE",
        meter: "11.8.11.9. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ko'ina cikin salamar zuciyar,", "Ko bakin ciki nake yi", "Ba zan damu ba Yesu ya ce mini,", "Kada fa in damu yana nan"] },
          { verse: "Korus", text: ["Kada fa in damu", "Ya ce min kada fa in damu."] },
          { verse: 2, text: ["Shaidan in ya zo yana jarabce ni,", "Kada zuciyata ta damu", "Jinin da Yesu ya zubar kan gicciye", "Wannan ya kawo mini ceto."] },
          { verse: 3, text: ["Ina murna laifina an share shi", "Laifina duka ba saura", "A kan gicciye, Yesu ya dauke shi,", "Raina ka yabe shi, yabe shi."] },
          { verse: 4, text: ["Ina jiran ranar zuwan Yesu,", "Sama za ta shude sarai", "Yesu da kansa za ya sauko ya zo,", "Da kara da karar kafonsa."] }
        ],
        history: "Horatio Spafford ya rubuta wannan waƙar (It Is Well with My Soul) bayan ya rasa 'ya'yansa mata a teku, don nuna cewa salamar Allah tana gaba da kowane hali na rayuwa."
  },
  "HBH266": {
        title: "Na Tsaya Kan Alkawarin Mai Ceto",
        number: "HBH266",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "PROMISES",
        meter: "11.11.11.9. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na tsaya kan alkawarin Mai Ceto,", "Yabonsa zai tabbata har abada,", "Da murya zan daukaka shi sarkina", "Na tsaya kan alkawarinsa."] },
          { verse: "Korus", text: ["Tsaya, Tsaya, na tsaya bisan alkawarin Mai Ceto", "Tsaya, Tsaya, na tsaya kan alkawarin Allah"] },
          { verse: 2, text: ["Na tsaya kan alkawarin Mai Ceto,", "Ko da wahala da shakka sun taso,", "Zan yi nasara da ikon kalmarsa", "Na tsaya kan alkawarinsa."] },
          { verse: 3, text: ["Na tsaya kan alkawarin Mai Ceto,", "Har abada abadin ni nasa ne", "Da takobin Ruhu nike nasara,", "Na tsaya kan alkawarinsa."] },
          { verse: 4, text: ["Na tsaya kan alkawarin Mai Ceto,", "Kullum ina saurara ga Ruhunsa,", "Ina dogara ga ikon Mai Ceto,", "Na tsaya kan alkawarinsa."] }
        ],
        history: "Russell Kelso Carter ya rubuta wannan waƙar (Standing on the Promises) don bayyana tabbataccen dogara ga alkawuran Allah waɗanda ba za su taɓa kasawa ba."
  },
  "HBH267": {
        title: "Loton Bukata Yesu Yana Nan",
        number: "HBH267",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "GABRIEL",
        meter: "9.9.9.6. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Loton bukata Yesu na nan, Loton faduwa loton tsoro", "Shirye yake ya karfafa ni, Loton bukata duk."] },
          { verse: "Korus", text: ["Loton bukata fa, Loton bukata fa", "Yesu na nan ya karfafa ni, Loton bukata duk"] },
          { verse: 2, text: ["Loton bukata Yesu na nan, Ba za ya bar ni ni kadai ba", "Zai kawo murna da kwanciyar rai, Loton bukata duk"] },
          { verse: 3, text: ["Loton bukata Yesu na nan, Ya tallafe ni a rana duk", "Murna maimakon bakin ciki, Loton bukata duk"] },
          { verse: 4, text: ["Loton bukata shi ne komai, In na kira za ya amsa min,", "Don kada in fada jaraba, Loton bukata duk."] }
        ],
        history: "Charles Gabriel ya rubuta wannan waƙar don bayyana cewa a cikin kowane loto na buƙata ko tsoro, Yesu yana nan kusa don ƙarfafa mu."
  },
  "HBH268": {
        title: "Ubangiji Ka Bishe Ni",
        number: "HBH268",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ALL THE WAY",
        meter: "8.7.8.7.D.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ubangiji ka bishe ni, A tafiya ta duka", "Sai ka ba ni farin ciki, Sai ka ba ni bangaskiya", "Sai ka yi mini alheri, Sai ka taimake ni yau", "Gama ni ban iya kome, Ni kadai, a duniya ba."] },
          { verse: 2, text: ["Ubangiji ka bishe ni, A tafiya ta duka", "Gama akan jarabce ni, Nikan shiga tsanani", "Duk wahala daga Shaidan, Takan dulmayad da ni", "Gama ni ban iya kome, Ni kadai, a duniya ba."] },
          { verse: 3, text: ["Ubangiji ka bishe ni, A tafiyata duka", "Gama ilmi yakan kasa, Ina son hikimarka", "Duk kokarina ya kasa, Sai ka ba ni karfinka", "Gama ni ban iya kome, Ni kadai, a duniya ba."] }
        ],
        history: "Fanny Crosby ta rubuta wannan waƙar (All the Way My Savior Leads Me) don nuna yadda Yesu yake jagorantar mai bi ta kowace hanya da kuma kowane yanayi na rayuwa."
  },
  "HBH269": {
        title: "Na Tabbata Ina Da Yesu",
        number: "HBH269",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ASSURANCE",
        meter: "9.10.9.9. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na tabbata ina da Yesu, Wannan albarka ce ta Allah", "An saye ni da jinin Yesu, Ruhu ya maya haifuwata."] },
          { verse: "Korus", text: ["Shaida ta kenan da wakata,", "Yabon Mai Ceto kulayaumi", "Shaida ta kenan da wakata", "Yabon Mai Ceto kulayaumi."] },
          { verse: 2, text: ["Saboda na mika rayuwata, Za ya dauke ni zuwa sama", "Mala'iku daga can sama, Sun kawo jinkai da kaunarsa."] },
          { verse: 3, text: ["Saboda na mika rayuwata, Akwai albarka cikin Yesu", "Na zuba ido har ya dawo, Ina da murna don kaunarsa."] }
        ],
        history: "Fanny Crosby ta rubuta wannan waƙar (Blessed Assurance) don nuna tabbataccen murna da salama da ke zuwa ta hanyar fansar da Yesu ya yi mana."
  },
  "HBH270": {
        title: "Ubana Sarki Ne",
        number: "HBH270",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "BINCHAMTON",
        meter: "10.11.11.11. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Wadatar duniya da kayanta,", "Uba na sama shi yake da su duk", "Albarkatun kasa ya yi su duk,", "Arzikinsa ba shi da iyaka fa."] },
          { verse: "Korus", text: ["Ubana sarki ne, Sarki mai mulki", "Yesu Mai Ceto, ni dan sarki ne fa."] },
          { verse: 2, text: ["Yesu Dan Allah Mai Ceton duniya,", "A cikin duniya ya yi talauci fa", "A sama yana roko domin mu duk,", "Domin mu zama nasa 'ya'yansa fa."] },
          { verse: 3, text: ["Da ni batacce ne a duniyar nan,", "Mai zunubi ne mai gaba da Allah,", "Sai Yesu ya saye ni da jininsa,", "In da gado da rawani na rai."] }
        ],
        history: "Harriet Buell ya rubuta wannan waƙar (A Child of the King) don bayyana alfaharin kasancewa ɗan Allah, Sarkin sarakuna, ta wurin bangaskiya ga Yesu."
  },
  "HBH271": {
        title: "Ina Cikin Yesu Dutsen Cetona",
        number: "HBH271",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "HINDING IN THEE",
        meter: "11.11.11.11. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ina cikin Yesu dutsen cetona,", "Duk wahala ta zan kai ta wurinsa,", "Ko zunubi ko kuwa rashin karfina,", "Na boye gun Yesu dutsen cetona."] },
          { verse: "Korus", text: ["Mafakata, Mafakata,", "Ya dutsen cetona", "Gun ka na boye"] },
          { verse: 2, text: ["A halin farin ciki ko na damuwa,", "In jaraba ta zo da ikonta fa,", "Wahalar rayuwa tana matsa min,", "Na boye gun Yesu dutsen cetona."] },
          { verse: 3, text: ["Magabci yana ta yin gaba da ni,", "na gudu gun Yesu mafakar rai na,", "Jarabobi kan zo kamar koguna,", "Na boye gun Yesu dutsen cetona."] }
        ],
        history: "William Cushing ya rubuta wannan waƙar (Hiding in Thee) don nuna cewa a kowane lokaci na wahala ko tsoro, Yesu ne madogara da mafakar mai bi."
  },
  "HBH272": {
        title: "Ya Boye Raina",
        number: "HBH272",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "KIRKPATRICK",
        meter: "11.8.11.8. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ba wani Mai Ceto kamar Yesuna,", "Mai Ceto Mai al'ajibi,", "Ya boye raina cikin ikonsa fa,", "In da akwai kwanciyar rai."] },
          { verse: "Korus", text: ["Ya boye raina cikin, ikonsa fa,", "Inda babu kaunar tsoro,", "Ya boye raina cikin kaunarsa ma", "Hannunsa yana rufe ni,", "Hannunsa yana rufe ni."] },
          { verse: 2, text: ["Ba wani Mai Ceto kamar Yesuna,", "Ya dauki nauyin kayana,", "Ya boye ni inda ba mai taba ni,", "Hannunsa yana rufe ni."] },
          { verse: 3, text: ["Albarku masu yawa yana ba ni,", "Yana cikin rayuwata", "Zan yi yabo ran da za a fyauce ni,", "Domin Mai Ceto nawa ne."] },
          { verse: 4, text: ["Sa'ad da na yafa ikon daraja,", "An fyauce ni cikin sama", "Zan sadu da shi cikin gizagizai,", "Waka za mu raira a can."] }
        ],
        history: "Fanny Crosby ta rubuta wannan waƙar (He Hideth My Soul) don bayyana kariya da kuma alherin Allah wanda yake lulluɓe da mu a kowane lokaci."
  },
  "HBH273": {
        title: "Akwai Haske Cikin Raina",
        number: "HBH273",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SUNSHINE",
        meter: "9.6.8.6. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Akwai haske cikin raina yau,", "Haske mai daraja,", "Wanda ya fi hasken duniya,", "Yesu ne haskena."] },
          { verse: "Korus", text: ["Akwai haske, mai albarka", "Akwai haske cikin raina yau,", "Mai albarka cikin raina", "Akwai haske a raina."] },
          { verse: 2, text: ["Akwai waka cikin raina yau,", "Nake ta yabonsa", "Yesu yana saurare ni,", "Jin dadi yake yi."] },
          { verse: 3, text: ["Akwai waka cikin raina yau,", "Yesu na yana nan", "Muryar salama nake ji,", "Domin alherinsa."] },
          { verse: 4, text: ["Akwai farin ciki mai yawa,", "Don begen kaunarsa", "Albarkunsa ya ba ni duk,", "A sama sai murna."] }
        ],
        history: "Eliza Hewitt ta rubuta wannan waƙar (Sunshine in My Soul) don bayyana farin ciki da hasken da ke zuwa cikin zuciya lokacin da Yesu yake mulki a ciki."
  },
  "HBH274": {
        title: "Allah Zai Kula Da Kai",
        number: "HBH274",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "GOD CARES",
        meter: "C.M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Komai ya zo kar ka damu, Allah zai kare ka;", "Kaunarsa za ta rufe ka, Allah zai kare ka."] },
          { verse: "Korus", text: ["Allah zai kare ka, A rana duk a rayuwa", "Allah zai kare ka, Allah zai kare ka."] },
          { verse: 2, text: ["Cikin wahalar rayuwa, Allah zai kare ka,", "Idan bala'o'i sun zo fa, Allah zai kare ka"] },
          { verse: 3, text: ["Bukatun ka zai biya su, Allah zai kare ka", "Rokonka ba zai ki ji ba, Allah zai kare ka."] },
          { verse: 4, text: ["Komai zafin jaraba fa, Allah zai kare ka", "Ka dogara ga ikonsa, Allah zai kare ka."] }
        ],
        history: "Civilla Martin ya rubuta wannan waƙar (God Will Take Care of You) don ƙarfafa dukan masu bi su dogara ga ikon Allah na kiyaye su a kowane hali."
  },
  "HBH275": {
        title: "Na San Wanda Na Gaskanta",
        number: "HBH275",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "EL NATHAN",
        meter: "C.M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Alherin Yesu, Ubangiji, Ya wuce gaban ganewa", "Gama tun ina makiyinsa fa, Ya mutu don in sami rai."] },
          { verse: "Korus", text: ["Gama na san na bada gaskiya", "Na hakikance yana da iko", "Ya tsare duk komai nawa", "Domin waccan ranar nan."] },
          { verse: 2, text: ["Ban iya gane ko in fassara, Abin da aka aika ba,", "Amma na sani cikin zuciata, Salama tana nan zaune."] },
          { verse: 3, text: ["Ruhu Mai Tsarki yana aikinSa, A cikin masu zunubi", "Domin su san bukatar zuciya, Su karbi Yesu Mai ceto"] },
          { verse: 4, text: ["Ban san ran zuwan Ubangiji ba, Da dare ko da rana", "Ko ina hanya ina tafiya, Ko a sararin sama."] }
        ],
        history: "Daniel Whittle ya rubuta wannan waƙar (I Know Whom I Have Believed) bisa ga 2 Timoti 1:12, don bayyana tabbataccen dogara ga ikon Allah na kiyaye mu har zuwa ranar ƙarshe."
  },
  "HBH276": {
        title: "Ashe Jaririn Baitalami",
        number: "HBH276",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. AGNES",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ashe jaririn Baitalami, Allah ne mai iko,", "Ga shi cikin sakarkari, Ya kawo rai kyauta."] },
          { verse: 2, text: ["Ashe mutuwar gicciye, Ta shafe zunubi,", "Kaunarta mara iyaka, A gare ni sosai."] },
          { verse: 3, text: ["Ashe kabarin Yusufu, Ya zama shaida fa,", "Cewa Yesu yana da rai, Mu ma za mu rayu. AMIN"] }
        ],
        history: "Waƙa ce ta yabo wadda take bayyana girman Yesu Kristi, tun daga haihuwarsa a Baitalami har zuwa daukakarsa a matsayin Sarkin dukan duniya."
  },
  "HBH277": {
        title: "Kauna Mara Shudewa",
        number: "HBH277",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SERENITY",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kaunarsa mara shudewa, Tana nan a kullum", "Ba za ta kare ba sam sam, Har abada abadin."] },
          { verse: 2, text: ["Ba za mu iya sauko da, Yesu ba a duniya", "Ba za mu same shi ba sam, A karkashin duniya."] },
          { verse: 3, text: ["Ikonsa yana warkaswa, Yana tare da mu,", "Sai mu taba shafin rigarsa, Za mu warke fa."] }
        ],
        history: "George Matheson ya rubuta wannan waƙar (O Love That Wilt Not Let Me Go) a matsayin addu'a ta miƙa kai ga kauna madawwami ta Allah wadda ba za ta taɓa barin mu ba."
  },
  "HBH278": {
        title: "Ba Zan Manta Da Kai Ba",
        number: "HBH278",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SWEET PROMISE",
        meter: "11.11.11.11. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Na yi alkawarin kasance da kai", "Ba abin da zai sa in manta da shi", "Ko rayuwa ta yi min duhu sosai,", "Sai ka sani akwai rai har abada"] },
          { verse: "Korus", text: ["Ba zan manta ko in rabu da kai", "Ba zan manta da kai ba, ba zan rabu da kai ba", "Ba zan manta ko in rabu da kai", "Ni ne mai fansarka, zan lura da kai."] },
          { verse: 2, text: ["Na dogara ga alkawarin Yesu,", "Da murna da kauna zan raira waka,", "Idan an ki ni, abokai sun bar ni,", "A gida a sama za a san da ni."] },
          { verse: 3, text: ["Idan ina tsaye a kofar sama,", "Dukan tsananina zan manta da su,", "Zan yi murna in ji muryarsa ta ce,", "“Shiga bawan kirki, yau ka zo gida!”"] }
        ],
        history: "Waƙa ce ta dogara wadda take jaddada alƙawarin Allah na rashin manta da 'ya'yansa, kamar yadda ya faɗa a cikin maganarsa (Ishaya 49:15)."
  },
  "HBH279": {
        title: "Yana Da Rai",
        number: "HBH279",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ACKLEY",
        meter: "Irregular with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ina hidimar Yesu, wanda ke duniya yau", "Na sani yana raye, na shaida jinkansa,", "Kome mutane sun ce, ya karfafa ni kwa", "In na shiga wahala, yana kusa."] },
          { verse: "Korus", text: ["Yana da rai, Yesunmu yana da rai,", "Tare da ni yakan tafi a duniya lallai,", "Yana da rai ya fito kabari,", "Labarin nan na gaskanta,", "Yesu na zuciata."] },
          { verse: 2, text: ["Yana lura da ni kuwa, da kauna mai yawa,", "Ko na shiga damuwa, ba zan karaya ba,", "Da hannunsa mai iko, yana ta bi da ni,", "Rana fa tana zuwa, da zai dawo."] },
          { verse: 3, text: ["Yi farin ciki Krista, ta da muryar yabo,", "Halleluya ga Yesu, Sarki mai adalci,", "Masu neman sa duka, suna da bege kwa,", "Shi ne kadai mai kauna, mai nagarta."] }
        ],
        history: "Alfred Ackley ya rubuta wannan waƙar (He Lives) don bayyana tabbataccen murna na sanin cewa Yesu yana da rai kuma yana zaune a cikin zukatanmu yau."
  },
  "HBH280": {
        title: "Mai Ceto Yana Kaunata",
        number: "HBH280",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "DOMINUS REGIT ME",
        meter: "8.7.8.7.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Tabbaci",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Mai ceto yana kaunata, Shi makiyayina ne", "Tun Yesu yana kiwona, Ni ba na rasa komai."] },
          { verse: 2, text: ["Ko a cikin hanyar ruwa, Kullum zai bi da raina,", "A cikin gonar mulkinsa, Yana ciyar da raina."] },
          { verse: 3, text: ["Da ina zaman tayarwa, Na ki tafarkin Yesu", "Sai kaunarsa ta jawo ni, Ta sa ni cikin garke."] },
          { verse: 4, text: ["Ko cikin kwarin mutuwa, Ba zan ji tsoro ba fa", "Ba wanda za ya taba ni, Tun Yesu na kaunata"] },
          { verse: 5, text: ["Kaunarsa marar karewa, Nan gaba za ta bi ni", "A cikin gidan Allah kuwa, Har abada zan zauna. Amin."] }
        ],
        history: "Anna Warner ta rubuta wannan waƙar (Jesus Loves Me) don nuna cewa babban abin da ya kamata kowane mutum ya sani shi ne cewa Yesu yana kaunarsa, kamar yadda Littafi Mai Tsarki ya faɗa."
  },
  "HBH281": {
        title: "Kusa Da Yesu Zan Rika Bi",
        number: "HBH281",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "MORRIS",
        meter: "9.10.9.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kusa da Yesu zan rika bi,", "Jawo ni kusa Mai Ceto Mai kyau;", "Rike ni sosai a kirjinka fa;", "Kare ni a wurin hutawar nan,", "Kare ni a wurin hutawar nan."] },
          { verse: 2, text: ["Kusa da Yesu zan rika bi,", "Ga Sarkina ban ba shi komai ba", "Sai zuciata mai zunubi,", "Wanke ni da jininka mai tsarki", "Wanke ni da jininka mai tsarki."] },
          { verse: 3, text: ["Kusa da Yesu zan rika bi,", "Na rabu da zunubi sam sam fa,", "Komai dadinsa Yesu nake so,", "Ni ba ni Yesu Ubangijina,", "Ni a ba ni Yesu Ubangijina."] },
          { verse: 4, text: ["Kusa da Yesu zan rika bi,", "Cikin rayuwata zan yi kusa", "Har zuwa sama in huta can,", "Ni zan yi kusa da Mai Cetona,", "Ni zan yi kusa da Mai Cetona. AMIN"] }
        ],
        history: "Waƙa ce ta miƙa kai wadda take bayyana sha'awar mai bi na zama kusa da Yesu a kowane lokaci, yana tafiya a cikin haskensa da kuma kariya."
  },
  "HBH282": {
        title: "Begen Duniya",
        number: "HBH282",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "O PERFECT LOVE",
        meter: "11.10.11.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Bege na duniya kai Kristi mai tausai,", "Kwantad da zukata masu tsoro;", "Cece mu daga sha'awoyin duniya,", "Da ba su kara mana komai ba."] },
          { verse: 2, text: ["Bege na duniya kyauta daga Allah,", "Abinci na rai ga masu yunwa,", "Ruhun ka har yanzu ka sauko mana", "Ya kawo warkaswa da kwanciyar rai"] },
          { verse: 3, text: ["Bege na duniya, wanda ya cece mu,", "Daga mutuwa shakka zunubi,", "Mu ma mun kaunace ka don jinkanka,", "“Yi amfani” da mu mu naka ne."] },
          { verse: 4, text: ["Bege na duniya, Kristi mai nasara", "Bisa bakin ciki da shan wuya,", "Aminci za mu yi ga bishararka", "Kai Ubangijinmu har abada."] }
        ],
        history: "Waƙa ce ta yabo da ke bayyana cewa Yesu ne kaɗai begen duniya da kuma hasken da yake kora duhu, yana kawo salama da ceto ga kowa."
  },
  "HBH283": {
        title: "Dutsen Ceto",
        number: "HBH283",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "SOLID ROCK",
        meter: "L.M. With Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ina da begena yanzu, A cikin jinin Almasihu", "Ba zan dogara ga komai, Sai cikin sunan Mai Ceto"] },
          { verse: "Korus", text: ["Kan Yesu, fa ceto, na tsaya", "Ba wani wurin rai, ko daya", "Ba wani wurin rai ko daya."] },
          { verse: 2, text: ["Ko damuwa ta yi yawa, Na sani ba ya sakewa,", "A cikin dukan wahala, Raina zai tsaya cikinsa."] },
          { verse: 3, text: ["Alkawarinsa yana nan, Ya ba ni karfin zuciya,", "Ko na rasa duk masoya, Yesu yana tare da ni."] },
          { verse: 4, text: ["Randa zai sake dawowa, Bari in zauna cikinsa", "Ina yafe da adalci, Baratacce a gabansa."] }
        ],
        history: "Augustus Toplady ya rubuta wannan waƙar (Rock of Ages) a matsayin addu'a ta roƙon ceto ta wurin Yesu Kristi, wanda shi ne dutsen da aka tsaga domina."
  },
  "HBH284": {
        title: "Za Mu Yi Aiki Har Yesu Ya Dawo",
        number: "HBH284",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "LAND OF REST",
        meter: "C.M. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Gidan sama na hutawa! Yaushe ne za ni can,", "Inda ba zan yi yaki ba, Sai hutawa kadai"] },
          { verse: "Korus", text: ["Aiki za mu yi, Aiki har Yesu ya zo", "Aiki za mu yi, Har a tara mu a can"] }
        ],
        history: "Waƙa ce ta ƙarfafawa ga hidima, tana kiran dukan masu bi su zama masu aminci wajen yin aikin Ubangiji har sai sa'ad da zai sake dawowa."
  },
  "HBH285": {
        title: "Salama Ta Mai Cetona",
        number: "HBH285",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "VENTING",
        meter: "11.11.11.10. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kamar haske bayan ruwa na sama", "Kamar hutu mai kyau bayan damuwa", "Kamar bege wanda an sake samu", "Cikin salama ta Mai Cetona"] },
          { verse: "Korus", text: ["Salama fa mai dadi kuwa", "Mai kyau ta mai cetona ne", "Ba abu a duniya kamar dadin nan", "Kamar salama ta Mai Cetona."] },
          { verse: 2, text: ["Mai sanyaya rai kamar rabar sama", "Alkawarin da ba zai fasa maka.", "Haske a cikin tafiyarka duka", "Cikin salama ta Mai Cetona."] },
          { verse: 3, text: ["Tana haskaka dukan duhun duniya,", "Ta taimake ka daukar damuwarka,", "Mafaka ne Shi mai daukar damuwa,", "Cikin dukan wahala ta duniyar nan."] },
          { verse: 4, text: ["Mai kariya inda akwai mugunta,", "Abin dogara a fuskar yakoki,", "Jagora kan hanya zuwa can sama,", "Shi ne salama Mai Ceto mai tausayi."] }
        ],
        history: "Waƙa ce ta yabo da ke bayyana zaƙin salamar da Yesu yake bayarwa, wadda ta fi kowane irin farin ciki na duniya kuma tana tabbata har abada."
  },
  "HBH286": {
        title: "Ya Allah Mai Taimakonmu",
        number: "HBH286",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. ANNE",
        meter: "C.M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ya Allah mai taimakonmu, Kai ne begenmu fa", "Kai ne madogararmu dai, Rabonmu aljanna."] },
          { verse: 2, text: ["Karkashin kursiyinka fa, Zababbu sun fake", "Cetonka mayalwaci ne, Mun sami kariya."] },
          { verse: 3, text: ["Tun kafin halittu su zo, Ko duniya kanta", "Kai ne Allah tun fil'azal, Har zamanai duka."] },
          { verse: 4, text: ["Shekaru dubu wurinka, Kamar yammaci ne", "Kamar duhun dare daya, Kafin asubahi."] },
          { verse: 5, text: ["Ya Allah mai taimakonmu, Kai ne begenmu fa", "Zama mai tsaron bayinka, Rabonmu aljanna.", "AMIN"] }
        ],
        history: "Isaac Watts ya rubuta wannan waƙar (O God, Our Help in Ages Past) bisa ga Zabura 90, don bayyana cewa Allah ne madogara da kuma gidanmu na har abada."
  },
  "HBH287": {
        title: "Mai Tsarki Aboki Mara Ganuwa",
        number: "HBH287",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "FLEMMING",
        meter: "8.8.8.6.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Bege",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Yesu aboki Ruhu ne, Tun da ka bidi in bi ka,", "Tallafe ni a rayuwa, Don in manne maka."] },
          { verse: 2, text: ["Duniyar nan tana da rudi, Abokai sun yashe ni duk", "Cikin kauna da hakuri, Zan manne maka fa."] },
          { verse: 3, text: ["Ko ni kadai nake tafiya, A rayuwar nan mai wuya,", "Na ji muryarka ta kauna, Ta ce manne mini."] },
          { verse: 4, text: ["Ko an gwada bangaskiyata, Zan dogara a gare ka,", "Akwai kwanciyar rai da gamsuwar, Ga mai manne maka", "Amin."] }
        ],
        history: "Charlotte Elliott ta rubuta wannan waƙar (O Holy Savior, Friend Unseen) don bayyana tabbataccen zumunci da kariya da ke cikin Yesu, wanda shi ne abokinmu mara ganuwa."
  },
  "HBH288": {
        title: "Kaunar Yesu Mara Iyaka",
        number: "HBH288",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. CATHERINE",
        meter: "8.8.8.8.8.8.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Kaunar Yesu mara iyaka, Girman ta ba mai iya fade,", "Yesu hasken zuciyata, Yi mulkin ta kowane sashen ta,", "Ni naka ne ni naka ne, Kullum karfafa zuciyata."] },
          { verse: 2, text: ["Bari kaunarka ita kadai, Ta zauna cikin zuciyata,", "Ta mallaki dukan raina, Mai kawo farin ciki kuwa,", "Kawar da sanyin zuciya, Komai zan yi cikin kauna."] },
          { verse: 3, text: ["Ya kauna mai alheri kuwa, Ka kawar da dukan tsoro,", "Damuwa bakin ciki su narke, Tun da ikonka yana nan,", "Ya Yesu kai ne nake so, Kai ne bege na rayuwata.", "AMIN"] }
        ],
        history: "Frederick Lehman ya rubuta wannan waƙar (The Love of God) don bayyana cewa kauna ta Allah tana da girma da zurfi wadda harshen ɗan adam ba zai iya kwatantawa ba."
  },
  "HBH289": {
        title: "Yesu Ina Son Ka",
        number: "HBH289",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "GORDON",
        meter: "11.11.11.11.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Yesu ina son ka, don kai ne nawa", "Don kaunarka na watsar da zunubi,", "Mai fansata kai kadai, Mai Cetona,", "Kaunata gare ka, babu kamarta."] },
          { verse: 2, text: ["Ina kaunarka, don ka kaunace ni", "Ka yi hanyar gafara kan gicciye", "Don rawanin kaya, ina kaunarka,", "Kauna ta gare ka babu kamarta."] },
          { verse: 3, text: ["Zan kaunace ka da rai ko mutuwa,", "Har tsawon lumfashina zan yabe ka,", "A dukan rayuwa ta a duniya,", "Kaunata gare Ka babu kamarta."] },
          { verse: 4, text: ["A gida na sama cike da murna,", "Zan yi ta yabonka a samaniya,", "Da rawanin daraja zan yabe ka,", "Kaunata gareka babu kamarta. Amin."] }
        ],
        history: "William Featherston ya rubuta wannan waƙar (My Jesus, I Love Thee) don bayyana zurfin soyayya da miƙa kai ga Yesu, yana mai tabbatar da cewa 'in na taɓa son ka, Yesu na, yanzu ne'."
  },
  "HBH290": {
        title: "Ya Madawwamiyar Kauna",
        number: "HBH290",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "ST. MARGARET",
        meter: "8.8.8.8.6.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ya madawwamiyar kauna, Na kafa bege gare ka,", "Na ba ka duk rayuwata, Daga cikin kaunarka dai,", "Na sami salama."] },
          { verse: 2, text: ["Haskenka na haskaka ni, Na sadaukar da kaina fa,", "Zuciyata na da bege, Domin ta wurin haskenka", "Ni ma zan haskaka"] },
          { verse: 3, text: ["Ina murna cikin damuwa, Ba zan kawar da zuciya ba,", "Ina zuba idona fa, Alkawarin ba shi faduwa,", "Begena zai cika."] },
          { verse: 4, text: ["Gicciyenka na haskaka, Ba ni boye maka sam-sam", "Ko na mutu a jikin nan, Zan sake tashi da jiki", "Mara mutuwa fa. AMIN"] }
        ],
        history: "George Matheson ya rubuta wannan waƙar (O Love That Wilt Not Let Me Go) don nuna cewa kauna ta Allah tana da tabbas kuma ba za ta taɓa yashe mai bi ba, har abada."
  },
  "HBH291": {
        title: "Koya Mini Kaunarka",
        number: "HBH291",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "INNOCENTS",
        meter: "7.7.7.7.7",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Koya mini kaunarka, Yesu in yi biyayya,", "Shi ya fara kaunata dai, In kaunace shi fa"] },
          { verse: 2, text: ["Yadda kana kaunata, Sai in yi biyayya fa", "In yi bauta in bi ka, Sai in kaunace Ka fa."] },
          { verse: 3, text: ["Koya mini bin ka yau, Cikin alherinka fa", "In yi kauna kamarka, Sai in kaunce Ka fa."] },
          { verse: 4, text: ["Haka zan nuna murna, Hakki ne in yi haka,", "In yi wakar kaunarka, Wanda ya kaunace ni.", "AMIN"] }
        ],
        history: "Waƙa ce ta addu'a wadda take roƙon Allah ya koya mana yadda za mu ƙaunace shi da kuma mutane, kamar yadda Yesu ya nuna mana ta wurin misalinsa."
  },
  "HBH292": {
        title: "Ina Ta Kaunar Ka",
        number: "HBH292",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "MORE LOVE TO THEE",
        meter: "6.4.6.4.6.6.4.4.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ina ta kaunarka, Ubangiji,", "Ka ji addu'a ta, Na durkusa,", "Roko ne nake yi, Ina ta kaunarka,", "Ina kauna, ina kauna."] },
          { verse: 2, text: ["Da na so duniya, Da kayanta;", "Yanzu kai nake so, Da albarka,", "Addu'a ta kenan, Ina ta kaunarka,", "Ina kauna, ina kauna."] },
          { verse: 3, text: ["Karshen lumfashina, Zan yabe ka;", "Abin da zuciyata, Ne za ta yi;", "Addu'a ta ke nan, Ina ta kaunarka", "Ina kauna, ina kauna. AMIN"] }
        ],
        history: "Elizabeth Prentiss ya rubuta wannan waƙar (More Love to Thee, O Christ) a matsayin addu'a ta kashin kai, yana roƙon Allah ya ƙara masa soyayya ga Almasihu a kowane hali."
  },
  "HBH293": {
        title: "Kauna Ce Kan Magana",
        number: "HBH293",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "FISHER",
        meter: "7.7.7.9. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Kauna",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Daga kawunan magana, Daya ta tsaya ita kadai", "Ta tsaya a cikin shekaru, Ita ce kauna mai mamaki."] },
          { verse: "Korus", text: ["Kauna ce kan maganar nan; Sai yawaita daraja ma,", "Kamar rana ta haskaka, Kan magana, har abada."] },
          { verse: 2, text: ["A buga kararrawar sama, Tsarkaka su kawo bangirma,", "Duniya ta raira yabbai, Ita kaunarsa ce mai banmamaki"] },
          { verse: 3, text: ["Tun da Yesu ya 'yantar da ni, Ina shaida wa ga kowa,", "Akwai gafara, salama fa, Kaunarsa ce mai ban mamaki."] },
          { verse: 4, text: ["Da makafi duk da guragu, Sun zo wurin Ubangijinmu,", "Masu zunubi sun kira shi, Sun dogara ga kaunarsa fa."] }
        ],
        history: "Waƙa ce ta yabo wadda take daukaka kauna ta Allah wadda take bayyana a cikin maganarsa, a cikin halitta, kuma musamman a cikin ceton da ya yi mana ta wurin Yesu."
  },
  "HBH294": {
        title: "Salama Ta Allah Kamar Kogi Ne",
        number: "HBH294",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "WYE VALLEY",
        meter: "6.5.6.5.D. with Refrain",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Salama ta Allah kamar kogi ne,", "Tana ikon kome cikin yalwarta.", "Cikakkiya mai gudu, tana karuwa,", "Cikakkiya mai girma zurfafa ce fa."] },
          { verse: "Korus", text: ["Dogara ga Allah hanyar kwanciyar rai,", "Gun sa za a sami hutu cikakke."] },
          { verse: 2, text: ["Daga tafin hannun Ubangijinmu,", "Ba abokin gaban da zai fizge mu,", "Babu tashin zuciya babu damuwa,", "Ba mugun abu da zai taba rayuwa."] },
          { verse: 3, text: ["Dukan farin ciki dukan damuwa,", "Da Allah ya yarda su tabi ranmu,", "Sai mu dogara ga ikon hannunSa,", "Wanda sun dogara za su sami rai."] }
        ],
        history: "Waƙa ce ta yabo wadda take kwatanta salamar Allah da kogi, farin cikinsa da maɓuɓɓuga, kuma kaunarsa da teku, tana bayyana yalwar albarkunsa."
  },
  "HBH295": {
        title: "Ka Bi Da Ni",
        number: "HBH295",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "AVENTIDE",
        meter: "10.10.10.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Ka bi da ni, rana na faduwa", "Dare na yi, ka bi da ni Yesu", "Ba taimako, ba mai karfafawa", "Ya mai taimako sai ka bi da ni."] },
          { verse: 2, text: ["Kwanaki suna saurin wucewa", "Dadin duniyan nan yana wucewa", "Ruba, lalacewa, nake gani", "Rai mara canzawa, ka bi da ni."] },
          { verse: 3, text: ["Ina bukatar kasancewar ka", "Allahnmu zai ba ni nasara fa,", "Wane ne kamarka mai bi da ni", "Kowane yanayi ka bi da ni."] },
          { verse: 4, text: ["Rike gicciyenka a gabana,", "Domin ya rika bi da ni kullum,", "Taimakon ka ya kawas da damuwa,", "Da rai ko mutuwa, ka bi da ni. AMIN"] }
        ],
        history: "Joseph Gilmore ya rubuta wannan waƙar (He Leadeth Me, O Blessed Thought) don bayyana tabbataccen murna na sanin cewa Allah ne yake jagorantar mu a kowane lokaci."
  },
  "HBH296": {
        title: "Daga Kowace Iskar Wahala",
        number: "HBH296",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "RETREAT",
        meter: "L. M.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Daga duk iskar wahala, Daga haukar illar ruwa", "Akwai salama da hutu, Karkashin kursiyin jinkai"] },
          { verse: 2, text: ["Inda Yesu ya shafe mu, Muna da farin ciki fa", "Wurin sa mafi daraja, Ya fanshe mu da jininsa"] },
          { verse: 3, text: ["Akwai tarayya na ruhu, Inda aminai ke zama", "Bangaskiya ta hada su, A gaban kursiyin Kristi"] },
          { verse: 4, text: ["Da iko mun yi firiya, Ba zunubi da bacin rai,", "Sammai duk sun marabce mu, Daukaka kewaye da shi."] }
        ],
        history: "Hugh Stowell ya rubuta wannan waƙar (From Every Stormy Wind That Blows) don bayyana zaƙin addu'a da kuma mafakar da mai bi yake samu a wurin jinƙai na Allah."
  },
  "HBH297": {
        title: "Zo Masu Damuwa",
        number: "HBH297",
        author: "Ba a sani ba",
        composer: "Ba a sani ba",
        tune: "CONSOLATION (WEBBE)",
        meter: "11.10.11.10.",
        key: "Ba a sani ba",
        scripture: "Ba a sani ba",
        theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
        year: "Ba a sani ba",
        musicSigns: [],
        lyrics: [
          { verse: 1, text: ["Zo masu damuwa inda, karfi ya kare,", "Zo wurin kursiyi, ku durkusa;", "Kawo zukatanku; nan kawo damuwar ku,", "Duk girman, damuwa za a warware."] },
          { verse: 2, text: ["Murnar mai damuwa, haske mai ratsewa,", "Bege ga mai tuba, bai shudewa!", "Mai taimako yana, tabbatarwa fa,", "“Komai damuwar duniya za a share”."] },
          { verse: 3, text: ["Ga gurasar rai, ga ruwa, mai gudu,", "Daga kursiyin Allah; daga sama,", "Zo bukin Salama, zo don ka sani fa,", "Komai, damuwar duniya za a share."] }
      ],
      history: "Thomas Moore ya rubuta wannan waƙar (Come, Ye Disconsolate) don kiran waɗanda suke cikin baƙin ciki su zo wurin jinƙai na Allah, inda za su sami salama da waraka."
  },
  "HBH298": {
      title: "Zan Shaida Wa Yesu",
      number: "HBH298",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ORWIGSBURG",
      meter: "10.9.10.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zan shaida dukan damuwa ga Yesu;", "Ba zan iya daukar nauyin ba,", "Cikin kuncina zai taimake ni,", "Domin yana kaunata sosai."] },
        { verse: "Korus", text: ["Zan shaida dukan! Damuwa ga Yesu!", "Ba zan iya daukar, nauyin ba,", "Zan shaida, dukan, damuwa ga Yesu", "Yesu kadai zai taimake ni."] },
        { verse: 2, text: ["Zan shaida dukan wahalolina,", "Ga Yesu Kristi mai jin tausayi,", "Idan na roke Shi zai kubutar,", "Damuwata zai sa ta kare."] },
        { verse: 3, text: ["Yesu zai kawas da jarabobi,", "Shi zai dauki nauyin kayana,", "Zan shaida masa zan shaida masa,", "Zai dauki dukan damuwata."] },
        { verse: 4, text: ["Duniya tana jan hankali nawa!", "Ana so in aika zunubi!", "Zan shaida masa! Zai taimake ni,", "In yi nasara da duniya."] }
      ],
      history: "Elisha Hoffman ya rubuta wannan waƙar (I Must Tell Jesus) don bayyana cewa Yesu ne kaɗai abokin da ya kamata mu kai masa dukan damuwarmu, domin shi ne mai taimakonmu."
  },
  "HBH299": {
      title: "Salama Kyautar Allah Ce",
      number: "HBH299",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWEET PEACE",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na ji dadi a zuciyata, Murna da raha mai amo,", "Ina yabonsa a kullum, Salama kyautar Allahnmu."] },
        { verse: "Korus", text: ["Salama kuwa kyautar, Allah gare mu,", "Salama mai banmamaki, Salama kyautar Allah."] },
        { verse: 2, text: ["A kan gicciye ga salama, An biya dukan bashi nawa ,", "Mutuwarsa ta cece ni, Salama kyautar Allahnmu."] },
        { verse: 3, text: ["Cikin salamar na zauna, Na zauna kusa da Yesu,", "Salama tana zuciyata, Salama kyautar Allahnmu."] }
      ],
      history: "Peter Bilhorn ya rubuta wannan waƙar (Peace, Peace, Wonderful Peace) don daukaka salamar Allah wadda ta fi gaban dukan fahimi kuma take saukowa daga sama zuwa cikin zuciya."
  },
  "HBH300": {
      title: "Bari Haske Ya Haskaka",
      number: "HBH300",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LOWER LIGHTS",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Haske daga Uban jinkai, Daga gidan, haskenSa,", "Amma shi ya ba mu aikin, Nuna hasken nan kullum."] },
        { verse: "Korus", text: ["Bari hasken nan na Allah, Ya haskaka ko'ina!", "Mai yawo a cikin Duhu, Za ya sami tsirar nan."] },
        { verse: 2, text: ["Duhun zunubi ya zauna, Yana hana haske kuwa,", "Idanu suna ta kira, Don su, duba hasken nan."] },
        { verse: 3, text: ["Dan'uwa gyara fitila, Wani yana hallaka,", "Yana so ya kai ga gaba. Inda haske yake can."] }
      ],
      history: "Waƙa ce ta ƙarfafawa ga hidima, tana kiran dukan masu bi su zama haske a cikin duniyar nan, suna haskaka duhu ta wurin bisharar Almasihu."
  },
  "HBH301": {
      title: "Kusa Da Allahnmu",
      number: "HBH301",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "McAFEE",
      meter: "C.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Akwai fa wurin hutawa, Kusa da Allahnmu,", "Inda zunubi babu sam, Kusa da Allahnmu."] },
        { verse: "Korus", text: ["Ya Yesu mai yin fansa, Allah ya aiko ka,", "Rike mu da hannunka, Kusa da Allahnmu."] },
        { verse: 2, text: ["Akwai fa wurin ta'aziya, Kusa da Allahnmu,", "Wurin saduwa da Mai Ceto, Kusa da Allahnmu."] },
        { verse: 3, text: ["Akwai fa wurin 'yantaswa, Kusa da Allahna,", "Wurin da akwai salama, Kusa da Allahna."] }
      ],
      history: "Sarah Adams ta rubuta wannan waƙar (Nearer, My God, to Thee) a matsayin addu'a ta kashin kai, tana roƙon Allah ya ƙara kusantar da ita zuwa gare shi a kowane hali."
  },
  "HBH302": {
      title: "Na Ji Muryar Yesu Ta Ce",
      number: "HBH302",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SPOHR",
      meter: "C. M. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na ji muryar Yesu ta ce, “Zo nan ga hutawa", "Kwanta mai gajiya kwanta, A cikin kirjina”.", "Na zo gun Yesu ba karfi, Sai bakin ciki kuwa,", "Na sami hutu cikinSa, Ya sa na yi murna."] },
        { verse: 2, text: ["Na ji muryar Yesu ta ce, “Kyauta, Na ba ka shi", "Ruwana mai rai mai kishi, Ka sha don ka yi rai”", "Na zo gun Yesu har na sha, Daga kogi na rai,", "Na daina jin kishi yanzu, Na sami rayuwa."] },
        { verse: 3, text: ["Na ji muryar Yesu ta ce, “Ni ne hasken duniya,", "Ka dube ni domin haske, A cikin rayuwarka”,", "Na dubi Yesu na sami, Haske a cikinSa,", "A cikin hasken zan taka, Har in bar duniya. AMIN"] }
      ],
      history: "Horatius Bonar ya rubuta wannan waƙar (I Heard the Voice of Jesus Say) don bayyana yadda mai bi yake samun hutu da kuma rai sa'ad da ya amsa kiran Yesu."
  },
  "HBH303": {
      title: "Zama Cikin Kauna",
      number: "HBH303",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NYLAND",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Salama da Kwanciyar Rai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zama cikin kaunarsa, Ba zan ji tsoro ba,", "Na bada gaskiya fa, Ba zan canja ba fa,", "Rigyawa za ta taso, Zuciya ta yi suwu,", "Allah zai kewaye ni, Ko zan ji fargaba?"] },
        { verse: 2, text: ["Duk inda ya bishe ni, Ba ni koma baya,", "Makiyayina ne shi, Ba ni rasa komai,", "Shi mai hikima ne fa, Yana ganin komai,", "Hanyarsa daidai ce fa, Zan yi tafiya da shi."] },
        { verse: 3, text: ["Ina begen rayuwa, Wadda ban gani ba,", "Zan ga haskensa kuma, In da duhu yake,", "Ba zan iya kwatanta, Rayuwata ba fa,", "Mai cetona Kristi ne, Zai yi tafiya da ni. _AMIN"] }
      ],
      history: "Waƙa ce ta dogara wadda take bayyana yadda mai bi yake samun cikakkiyar salama sa'ad da ya amince da jagorancin Allah da kuma ƙaunarsa a kowane hali."
  },
  "HBH304": {
      title: "Yesu Mai Cetona Mai Daraja Ne",
      number: "HBH304",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PRECIOUS TO ME",
      meter: "11.11.11.8. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu Mai Cetona mai daraja ne,", "Kullum zan yabe shi ya kai ni sama,", "Ban da karfi zan dogara gare shi,", "Gama mai daraja ne shi."] },
        { verse: "Korus", text: ["Gama mai daraja ne shi,", "Gama mai daraja ne shi", "Nan duniya na san mai cetona;", "Gama mai daraja ne shi."] },
        { verse: 2, text: ["Yana tare da ni cikin wahala,", "Yana so ya mallaki zuciyata,", "Amma na dade ban ba shi dama ba,", "Gama daraja ne shi."] },
        { verse: 3, text: ["Na tsaya a dutse na albarkarsa,", "Ba abin da ya hana ni ganin", "Murmushinsa ya kau da bakin ciki,", "Gama daraja ne shi."] },
        { verse: 4, text: ["Ina yabonsa domin yana so na,", "Ya shirya mani gida a can sama,", "Na sani zan gan shi, zan ga fuskarsa,", "Gama mai daraja ne shi."] }
      ],
      history: "Waƙa ce ta yabo da ke daukaka darajar Yesu Kristi a matsayin Mai Ceto wanda yake jagorantar mai bi zuwa sama, yana ba shi ƙarfi da murmushi a cikin wahala."
  },
  "HBH305": {
      title: "Akwai Suna Mai Dadi",
      number: "HBH305",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PRECIOUS NAME",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Akwai sunan nan mai dadi, Wanda ba mai kamarsa,", "Wato sunan Ubangiji, Begen dukan masu bi."] },
        { verse: "Korus", text: ["Sunan nan, Yesu ne, Sunansa da dadin ji,", "Sunan nan, Yesu ne, Begen dukan masu bi."] },
        { verse: 2, text: ["Tun da na ji sunan Yesu, Murna nake yi sosai,", "Wurin sa na sami ceto, Gafara da kwanciyar rai."] },
        { verse: 3, text: ["Cikin sunan nan mai girma, Ake samun ceto fa,", "Cikinsa ake sujada, Cikinsa ake addu'a."] },
        { verse: 4, text: ["Sunan nan ya bude kofa, Zuwa Allah Ubansa,", "Gama ban da sunan Yesu, Allah ba za ya ji mu ba."] }
      ],
      history: "Lydia Baxter ta rubuta wannan waƙar (Take the Name of Jesus with You) don ƙarfafa masu bi su riƙe sunan Yesu a matsayin garkuwa da kuma begen kowane loto."
  },
  "HBH306": {
      title: "Rashin Dadin Sa'a",
      number: "HBH306",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CONTRAST",
      meter: "L.M.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Idan ban ga Yesuna ba, Sa'o'in da gajiyarwa,", "Komai ba dadi ba gamsuwa, Don sun kasa faranta rai", "Hasken damina ya dushe, Kyaun filin ba yana nan kuma", "A cikinsa ina murna, Murna fa mara iyaka."] },
        { verse: 2, text: ["Sunansa mai faranta rai, Muryarsa tana da dadi", "Kasancewarsa ba duhu, Ta sa in yi murna sosai", "Ina so ya zauna kusa ban, Son komai sai shi kadai", "Babu mai murna kamar ni, Farin cikina zai dade."] },
        { verse: 3, text: ["Ina son ganin fuskarsa, Domin tana ba ni murna,", "Ba sauyawar al'amura, Za su kawo sauyar raina,", "Domin kaunarsa mai girma, Ta sa komai banza ne fa", "Darajar duniya banza ce, Idan Yesu shi ne nawa."] },
        { verse: 4, text: ["Idan Allah, ni naka ne, Kai ne haske da wakata,", "Don me nake yankwanewa? Don me damuwa na yawa", "Ka kawas da duhun rayuwata, Dadin kasancewar ta zo,", "Ka kai ni sama wurinka, In da babu bakin ciki."] }
      ],
      history: "John Newton ya rubuta wannan waƙar (How Tedious and Tasteless the Hours) don bayyana cewa ba tare da Yesu ba, komai na duniyar nan ba shi da daɗi ko gamsuwa."
  },
  "HBH307": {
      title: "Ya Sa Ni Waka",
      number: "HBH307",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWEETEST NAME",
      meter: "9.7.9.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina da murna a zuciya, Yesu ya shaida mini,", "“Kada ka ji tsoro gama fa, Ina nan tare da kai."] },
        { verse: "Korus", text: ["Yesu, Yesu, Yesu, suna mai dadi", "Bukata ta biya, Ya sa ni raira waka."] },
        { verse: 2, text: ["Zunubi ya bata rayuwata, Rikici ya dame ni", "Yesu ya kawo farin ciki, Ya karfafa zuciyata."] },
        { verse: 3, text: ["Ina murna cikin alheri, Ikonsa mai kare ni", "Murmushi nake ta gani, Don haka na yi yabo."] },
        { verse: 4, text: ["Yakan yarda in sha wahala, Jarabobi ko'ina,", "Hanya takan zama da wuya, Amma yana bi da ni."] },
        { verse: 5, text: ["Wata rana za ya kai ni can, Sama gidan daraja,", "Wurin ba kamar na duniya ba, Zan yi mulki fa da shi."] }
      ],
      history: "Luther Bridgers ya rubuta wannan waƙar (He Keeps Me Singing) a cikin wani lokaci na baƙin ciki mai zurfi, don shaida yadda Yesu yake sa waƙa a cikin zuciya duk da wahala."
  },
  "HBH308": {
      title: "Za Mu Je Sihiyona",
      number: "HBH308",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MARCHING TO ZION",
      meter: "6.6.8.8.6.6. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Masu kaunar Yesu, Mu shaida murnar mu", "Mu yi murna da hada kai, Mu yi murna da hada kai", "Mu kewaye kursiyin, Mu kewaye kursiyin"] },
        { verse: "Korus", text: ["Za mu je Sihiyona, Birni mai kyau Sihiyona", "Muna tafiya Sihiyona, Birnin Ubangiji Allah."] },
        { verse: 2, text: ["Masu kin yin waka, Da ba su san Allah,", "Amma 'ya'yan sarkin sama, Amma 'ya'yan sarkin sama,", "Su shaida ko'ina, Su shaida ko'ina."] },
        { verse: 3, text: ["Tudu na birnin nan, Na cike da dadi", "Kafin mu kai filin sama, Kafin mu kai filin sama", "Ko taka tituna, Ko taka tituna."] },
        { verse: 4, text: ["Mu yi ta yin waka, Mu share hawaye,", "Muna cikin kasar Yesu, Muna cikin kasar Yesu,", "Gida mai daraja, Gida mai daraja."] }
      ],
      history: "Isaac Watts ya rubuta wannan waƙar (We're Marching to Zion) don kiran masu kaunar Ubangiji su yi murna yayin da suke tafiya zuwa ga birni mai tsarki na Sihiyona."
  },
  "HBH309": {
      title: "Falka Raina Ka Mike",
      number: "HBH309",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CHRISTMAS",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Falka raina ka mike fa, Ka yi gaba da niyya", "Da zuciya daya yi tsere, Don samun rawani", "Don samun rawani."] },
        { verse: 2, text: ["Shaidu suna a kewaye, Suna duba rayuwarka", "Manta da rayuwar baya, Yi karfin zuciya,", "Yi karfin zuciya."] },
        { verse: 3, text: ["Muryar Allah mai iko ce, Ke kiran ka ka zo", "Yana mika maka lada, Wadda kake bege,", "Wadda kake bege."] },
        { verse: 4, text: ["Mai ceto taimake ni yau, A cikin wannan tserena,", "Don in sami rawanin rai, Don in yi godiya,", "Don in yi godiya."] }
      ],
      history: "Philip Doddridge ya rubuta wannan waƙar (Awake, My Soul, Stretch Every Nerve) don ƙarfafa masu bi su yi tseren bangaskiya da dukan ƙarfinsu domin samun rawanin rai."
  },
  "HBH310": {
      title: "Tun Da Yesu Ya Zo Cikin Zuciya Ta",
      number: "HBH310",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "McDANIEL",
      meter: "12.8.12.8. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na sami sauyawa cikin zuciyata,", "Tun Yesu ya zo zuciata", "Akwai haske a raina da nake bege,", "Tun Yesu ya zo zuciata."] },
        { verse: "Korus", text: ["Tun Yesu ya zo zuciata,", "Tun Yesu ya zo zuciata,", "Cikakkiyar murna ta cika zuciata", "Tun Yesu ya zo zuciata."] },
        { verse: 2, text: ["Na daina yawo da bin hanyoyin shaidan,", "Tun Yesu ya zo zuciata", "Zunubaina masu yawa an wanke su,", "Tun Yesu ya zo zuciata"] },
        { verse: 3, text: ["Yanzu dai nake da tabbataccen bege,", "Tun Yesu ya zo zuciata", "Babu shakka yanzu cikin zuciata,", "Tun Yesu ya zo zuciata"] },
        { verse: 4, text: ["A birnin da na sani zan je in zauna,", "Tun Yesu ya zo zuciata,", "Ina murna sosai domin na tafi can,", "Tun Yesu ya zo zuciata."] }
      ],
      history: "Rufus McDaniel ya rubuta wannan waƙar (Since Jesus Came into My Heart) don shaida babban canji da farin cikin da ya samu sa'ad da ya karɓi Yesu cikin rayuwarsa."
  },
  "HBH311": {
      title: "Sabuwar Waka Cikin Zuciya",
      number: "HBH311",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "REDEEMING LOVE",
      meter: "10.8.10.8. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Murna",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sabuwar waka cikin zuciya,", "Irin ta mala'iku a can,", "Dukan rana sai farin ciki fa;", "Wakar kauna mai yin fansa."] },
        { verse: "Korus", text: ["Zan yi waka kan kaunarSa.", "Har sai na gan Shi sarkina", "Har matuka zan yi waka", "Ta Mai Ceto Kristi mai yin fansa."] },
        { verse: 2, text: ["Sa'anda na bace cikin duniya", "Inda kafafu na yawo", "Cikin duhu na sami haskenSa,", "Domin duk kauna mai fansa."] },
        { verse: 3, text: ["Tare da mawaka a can sama,", "Na tsaya a hasken kursiyi,", "Gabar kogi ce mai gamsarwa fa,", "Don raira waka ta fansa."] }
      ],
      history: "Waƙa ce ta yabo da ke bayyana farin cikin samun sabuwar waƙa a cikin zuciya, wadda take daukaka ƙauna mai ceton ta Almasihu Yesu."
  },
  "HBH312": {
      title: "Bude Idon Zuciyata",
      number: "HBH312",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SCOTT",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bude idon zuciyata,", "Gaskiya domin rayuwata,", "Ka ba ni mabudin ka mai kyau,", "Domin ya kwance ni yanzu,", "Na yi shiru ina jira,", "Shirye don in ga nufinka;", "Bude idanuna in ga,", "Ruhun Allah."] },
        { verse: 2, text: ["Bude kunnuwana in ji,", "Muryoyin gaskiya domina,", "Sa'ad da sun shiga kunnena,", "Karya za ta shude sosai", "Na yi shiru ina jira,", "Shirye don in ga nufinka;", "Bude kunnuwana in ji,", "Nufin Allah."] },
        { verse: 3, text: ["Bude bakina in shaida,", "Gaskiyar ka a ko'ina,", "Bude zuciyata don in shirya,", "In shaida yawan kaunarka", "Na yi shiru ina jira,", "Shirye don in ga nufinka", "Bude zuciya ta ya Allah,", "Zo ka zauna. AMIN."] }
      ],
      history: "Clara Scott ta rubuta wannan waƙar (Open My Eyes, That I May See) a matsayin addu'a ta neman hasken Ruhu Mai Tsarki don fahimtar gaskiyar Allah da kuma nufinsa."
  },
  "HBH313": {
      title: "Zo Mabulbular Albarka",
      number: "HBH313",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NETTLETON",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zo mabulbular albarka, Iza ni in yabe ka;", "Kaunarka mara karewa, Ta isa wakar yabo;", "Koya mini in yi waka, Da mala'ikun sun yi,", "Ina tsaye bisa dutse, Na kauna ta fansarka."] },
        { verse: 2, text: ["Nan ina da taimakonsa; Can ga taimakon kuwa,", "Ina bege, da ikonka, Zan kai gida lafiya,", "Na bace Yesu ya kawo ni, Na yi nisa da Allahna;", "Ya cece ni daga wuta, Jininsa na taimako."] },
        { verse: 3, text: ["Ina da bashi a kai na, Kullum in yi nufinka;", "Bar alheri ya jawo ni, Kusa da kai Allahna,", "Kada in bar hanyar Allah, Kada in bar kaunarSa,", "Ka yi mulkin zuciyata, Don ka kai ta wurinka."] }
      ],
      history: "Robert Robinson ya rubuta wannan waƙar (Come, Thou Fount of Every Blessing) don bayyana godiya ga alherin Allah wanda yake kiyaye mu duk da karkatacciyar zuciyarmu."
  },
  "HBH314": {
      title: "Kristi Ka Jawo Ni Kusa Da Kai",
      number: "HBH314",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. EDMUND",
      meter: "6.4.6.4.6.6.6.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kristi ka jawo ni, Kusa da kai,", "Saukad da nufinka, A cikina!", "Mikad da ni sosai, Da kaunar ka mai rai,", "A gan ka cikina, Kristi mai rai."] },
        { verse: 2, text: ["Zo ka bi da raina, Da naka yau;", "Zan bi ka domin ban, San hanya ba!", "Sabunta karfina; Ka ba ni aikin yi!", "Ta cikina nuna, Da gaskiya."] },
        { verse: 3, text: ["Ba don kaina kadai, Ina addu'a;", "Ka jawo duniyarka, Kusa da kai!", "Tsarkake zuciyarta, Ta san wakar ceto", "Har duniya ta cika, Nufin Allah. AMIN"] }
      ],
      history: "Fanny Crosby ta rubuta wannan waƙar (Draw Me Nearer) a matsayin addu'a ta miƙa kai, tana roƙon Allah ya ƙara kusantar da ita zuwa ga gicciyen Almasihu."
  },
  "HBH315": {
      title: "Zan Yi Gaskiya",
      number: "HBH315",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PEEK",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zan yi gaskiya don an amince da ni,", "Zan zama da tsarki don shaida shi,", "Zan karfafa don yaki da wahala,", "Ba zan ja baya don wahala ba,", "Ba zan ja baya don wahala ba."] },
        { verse: 2, text: ["Zan yi abota da duk makiya nawa,", "Zan rika bayarwa ba yin gori,", "Ba zan yi fahariya ko girman kai,", "Zan zuba ido ga Yesu Kristi,", "Zan zuba ido ga Yesu Kristi."] },
        { verse: 3, text: ["Zan rika yin addu'a a koyaushe,", "Zan rika zumunci da Allahna,", "Zan kasa kunne domin jin muryarSa,", "Zan taka hanya cikin bangaskiya,", "Zan taka hanya cikin bangaskiya."] }
      ],
      history: "Howard Walter ya rubuta wannan waƙar (I Would Be True) a matsayin wata alƙawari na kashin kai na yin rayuwar gaskiya da kuma jaruntaka a matsayin matashi Krista."
  },
  "HBH316": {
      title: "Zan Zama Kamar Yesu",
      number: "HBH316",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MORE LIKE JESUS",
      meter: "7.7.7.7.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zan zaman kamar Yesu, Bar ya zauna cikina,", "Cika ni da salama, Mai da ni mara aibi,", "Kamar Yesu koyaushe, A cikin tafiyata,", "Ruhuna ya talauce; Yesu zauna cikina."] },
        { verse: 2, text: ["In ya ji kukan tsuntsu, Kuma ya kula da shi,", "Ya san faduwarsa fa, Na san zai ji kukana,", "Zai nuna yin rayuwa, Zai gafarta zunubi,", "Zan zauna cikin tsarki, Yesu zauna cikina."] },
        { verse: 3, text: ["Cikin addu'a kullum, Zan zama kamar Yesu,", "Zan huta kusa da Shi, Inda babu damuwa,", "An sabunta rayuwata, kaunarsa ta bishe ni,", "Zan yi ta bangaskiya, Yesu zauna cikina."] }
      ],
      history: "James Rowe ya rubuta wannan waƙar (More Like Jesus) a matsayin addu'a ta neman kasancewa kamar Kristi a cikin hali da rayuwa, kamar yadda aka nuna a 1 Yohanna 2:6."
    },
    "HBH317": {
      title: "Lokacin Jaraba",
      number: "HBH317",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PENITENCE",
      meter: "6.5.6.5.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Lokacin jaraba bi da ni Yesu,", "Domin kada in yi musun sunanka,", "Idan ka ga na kauce, ka jawo ni", "Kada ka kyale ni har ga faduwa."] },
        { verse: 2, text: ["Duniya da hanyarta tana yin rudi,", "Arzikin ta ya bazu don yin illa,", "Sai in tuna da kai a Gesthsemani", "Ta wahalar gicciye, ceto ya zo."] },
        { verse: 3, text: ["A karshen rayuwata cike da kunci,", "In jikina ya koma ga turbaya,", "Kanka na dogara a wannan yaki", "A mutuwar Yesu kai ni sama can. AMIN"] }
      ],
      history: "James Montgomery ya rubuta wannan waƙar (In the Hour of Trial) don roƙon taimakon Allah a lokacin jaraba da kuncin rayuwa, bisa ga addu'ar Yesu ga Bitrus a Luka 22:32."
    },
    "HBH318": {
      title: "Lissafta Alherin Allahnka",
      number: "HBH318",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BLESSINGS",
      meter: "11.11.11.11. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Lokacin da kake shan wahala fa", "Kana ganin komai duk ya lalace", "Tuna da alherin Ubangijinka,", "Wannan dai zai ba ka karfin zuciya."] },
        { verse: "Korus", text: ["Lissafta alherin Allahnka", "Lissafta yawan albarkunsa", "Yi lissafin, yawan kaunarsa", "Wannan za ya baka karfin zuciya."] },
        { verse: 2, text: ["Ko kana ta yin fama da damuwa,", "Ko kana tunani za ka bar bin sa,", "Lissafta alherinsa ka karfafa,", "Za ka yi ta raira wakokin yabo."] },
        { verse: 3, text: ["Sa'ad da ka duba masu dukiya,", "Tuna da albarka wurin Mai ceto,", "Rai madawwami Shi ya ce zai bayar,", "Ga duk wanda yake bada gaskiya."] },
        { verse: 4, text: ["Ko a matse kake babu sakewa,", "Kada ka karaya Yesu yana nan,", "Lissafta alherin Ubangijinka,", "Wannan ne zai baka karfin zuciya."] }
      ],
      history: "Johnson Oatman Jr. ya rubuta wannan waƙar (Count Your Blessings) a cikin 1897 don ƙarfafa Kiristoci su tuna da alherin Allah a kowane hali, maimakon damuwa da matsaloli."
    },
    "HBH319": {
      title: "Ina Ta Kutsawa Gaba",
      number: "HBH319",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HIGHER GROUND",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina ta kutsawa gaba, Don in yi girma koyaushe,,", "Cikin tafiya ina addu'a, “Uba karfafa tsayuwata”."] },
        { verse: "Korus", text: ["Ubangiji karfafa ni, In tsaya cikin karfinka,", "Wurin da nan ne ikonka, Ka karfafa tsayuwata."] },
        { verse: 2, text: ["Ba ni son zama wurin da, Akwai shakka da ban tsoro;", "Wasu suna son zama nan, Ka karfafa tsayuwata."] },
        { verse: 3, text: ["Burina in yi rayuwa, Ba irin ta duniya ba,", "Amma shaidan na ta gaba, Ka karfafa tsayuwata."] },
        { verse: 4, text: ["Hankalina yana sama, Inda zan ga darajarka,", "Addu'a ta in kai sama, “Ubangiji ka bi da ni”."] }
      ],
      history: "Johnson Oatman Jr. ya rubuta wannan waƙar (Higher Ground) don bayyana burin mai bi na girma a ruhaniya da kuma kusanci da Allah a kowace rana, bisa ga Filibiyawa 3:13-14."
    },
    "HBH320": {
      title: "Dutsen Da Ya Fi Ni Girma",
      number: "HBH320",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ROCK OF REFUGE",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Wani loto inuwar da zurfi,", "Hanyar kaiwa ga Goal ba kyau,", "Damuwa, wani loto kan zo,", "Kamar gwaji a zuciya."] },
        { verse: "Korus", text: ["Bar in gudu zuwa dutse (in gudu)", "Zuwa Dutsen da ya fi ni girma (ya fi ni girma)", "Bar in gudu zuwa Dutse (in gudu)", "Zuwa Dutsen da ya fi ni girma."] },
        { verse: 2, text: ["Wani loto ga damuwa,", "Wani loto na gaji fa,", "Amma aiki cikin kunci,", "Inuwar Dutsen da albarka."] },
        { verse: 3, text: ["Kusa da Dutsen zan zauna,", "Ko albarku, damuwa sun zo,", "Sun zo ko dutsen ya yi tsawo fa,", "Ko tafiya ta tsananta."] }
      ],
      history: "E. Johnson ya rubuta wannan waƙar (The Rock That Is Higher Than I) bisa ga Zabura 61:2, don bayyana Kristi a matsayin mafaka da dutsen tsira a lokacin wahala."
    },
    "HBH321": {
      title: "Ina Son Sanin Yesu Fa",
      number: "HBH321",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWENEY",
      meter: "L.M with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina son sanin Yesu fa, Nuna jinkansa ga wasu,", "A ga cikin cetonsa fa, Har ma da yawan kaunarsa."] },
        { verse: "Korus", text: ["Ina so in san Yesu, Ina so in san Yesu", "A ga cikin Cetonsa fa, Wanda ya mutu domina."] },
        { verse: 2, text: ["Ina son sanin Yesu fa, In san nufinsa mai tsarki", "Ruhun Allah ya koya mini, Zai nuna min nufinsa"] },
        { verse: 3, text: ["Ina son sanin kalmarsa, Zan yi zumunci da Allah", "Zan saurare shi koyaushe, Maganarsa zan rike ta"] },
        { verse: 4, text: ["Ina son sanin Yesu fa, Daraja duka tasa ce", "Mulkinsa na ta karuwa, Ga shi nan sarkin salama. AMIN"] }
      ],
      history: "Eliza Hewitt ta rubuta wannan waƙar (More About Jesus) don bayyana sha'awar mai bi na sanin Kristi sosai ta wurin Kalmarsa da kuma Ruhu Mai Tsarki, bisa ga 2 Bitrus 3:18."
    },
    "HBH322": {
      title: "Kusa Da Kai Allah",
      number: "HBH322",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BETHANY",
      meter: "6.4.6.4.6.6.6.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kusa da kai Allah, Kusa da kai,", "Ko da gicciye ne, Ya daga ni,", "Wannan ne wakata, Kusa da kai Allah,", "Kusa da kai Allah, Kusa da kai."] },
        { verse: 2, text: ["Kamar mai yin yawo, Yamma ta yi.", "Duhu ya kewaye ni, Ba ni da hutu,", "Ni, za ni kasance, Kusa da kai Allah,", "Kusa da kai Allah, Kusa da kai."] },
        { verse: 3, text: ["Bari in ga hanya, Zuwa sama,", "Aikin da ka ba ni, Cikin tausayi,", "Mala'iku na kira, Kusa da kai Allah,", "Kusa da kai Allah, Kusa da kai."] },
        { verse: 4, text: ["Cikin tunanina, Zan yi yabo,", "Cikin damuwata, Betel gidana,", "Ko cikin kuncina, Kusa da kai Allah,", "Kusa da kai Allah, Kusa da kai. AMIN"] }
      ],
      history: "Sarah Flower Adams ta rubuta wannan waƙar (Nearer, My God, to Thee) a cikin 1841, tana amfani da labarin Yakubu a Betel (Farawa 28) don nuna burin rai na kusanci da Allah."
    },
    "HBH323": {
      title: "Bar Lebunanmu Su Shaida",
      number: "HBH323",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WAREHAM",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bar lebunanmu su shaida, Bisharar da mun gaskanta", "Halayenmu su haskaka, Su shaida koyaswar Allah."] },
        { verse: 2, text: ["Ta haka za mu yi shelar, Girman Allah Mai Cetonmu", "Sa'ad da cetonsa na mulki, In alheri ya rinjaya"] },
        { verse: 3, text: ["Mu yaki jikunanmu fa, Kishi, jaraba, girman kai", "A gan diyan Ruhu gare mu, Su tabbata gare mu fa."] },
        { verse: 4, text: ["Addini na gina ruhu, In mun kasance da bege,", "Bayyanuwar Ubangiji, In mun rike kalmarsa gam."] }
      ],
      history: "Wannan waƙar tana ƙarfafa Kiristoci su rayu cikin gaskiya da haske, domin halayensu su zama shaida ga wasu game da bisharar Kristi, bisa ga Matta 5:16."
    },
    "HBH324": {
      title: "Za Mu Ga Yesu",
      number: "HBH324",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CONSOLATION",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Za mu ga Yesu, ko inuwa na nan", "A cikin wannan rayuwarmu fa", "Za mu ga Yesu, za a karfafa mu", "Daga damuwa da bakin ciki"] },
        { verse: 2, text: ["Za mu ga Yesu, babban tushen Dutsen", "In da muke ta wurin alheri", "Rai ko mutuwa da duk damuwarsu", "In mun gan shi ba za mu matsa ba."] },
        { verse: 3, text: ["Za mu ga Yesu, haske mai daraja", "Wanda shekaru muna begen fa", "Albarkun bakuntarmu ba tabbas fa", "Bacin rai babu, don gun ka za mu."] },
        { verse: 4, text: ["Za mu ga Yesu, wannan ne begenmu", "Karfi, murna da niyya da sa rai", "Za mu ga Yesu, rayayye kuma fa", "Zai kuwa marabce mu bayin kirki."] }
      ],
      history: "Anna Warner ta rubuta wannan waƙar (We Would See Jesus) don nuna begen da Kirista yake da shi na ganin Yesu a kowane hali na rayuwa, wanda hakan yake kawo ƙarfafa da murna."
    },
    "HBH325": {
      title: "Zama Kamar Kristi",
      number: "HBH325",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HANFORD",
      meter: "10.10.11.11. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zama kamar Kristi ne begena,", "Saukin halinsa, da tawali'u,", "Himma don aiki, da karfin zuciya", "In kebe kai don aikin da ya ba ni,"] },
        { verse: "Korus", text: ["Ga zuciata... Taka ce kadai fa", "Ga zuciata ...Ta zama taka fa", "Kau da zunubi .... Kristi na kira", "Ka wanke ni ka maishe ni naka"] },
        { verse: 2, text: ["Zama kamar Kristi ne rokona", "Karfi domin in dauki gicciye", "Kokarina ne in kawo mulkinsa", "Ruhunsa mai yawo don ribato rai."] },
        { verse: 3, text: ["Zama kamar Kristi zan yi girma", "Zan nuna kaunar Kristi ga wasu", "Yi musun kai kamar shi a Galili", "Zama kamar Kristi shi ne begena."] }
      ],
      history: "Charles H. Gabriel ya rubuta wannan waƙar (More Like Jesus) don bayyana babban burin kowane mai bi, wato zama kamar Kristi a cikin hali da aiki, bisa ga 1 Yohanna 3:2."
    },
    "HBH326": {
      title: "Kristi Ne Komai Na",
      number: "HBH326",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "EVERY DAY AND HOUR",
      meter: "7.9.7.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Sa Rai Na Gaba",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kristi ne makomata, Ina a manne, kusa da kai,", "Bari jininka mai kyau, Ya ajiye ni kusa da kai."] },
        { verse: "Korus", text: ["Kullum dai kullum dai,", "Bar in ga ikonka", "Bar kaunarka ta sa ni kusa,", "Da kai ya Ubangiji. AMIN"] },
        { verse: 2, text: ["A cikin wannan duniya, Ka bishe ni cikin tafiya,", "Na dogara gare ka, Ba zan ratse ba, ko bata ba."] },
        { verse: 3, text: ["Bari in kaunace ka, Har sai rayuwar nan ta shude,", "Sai kauna ta cika ni, A can sama wurin Ubanmu.", "AMIN"] }
      ],
      history: "Fanny Crosby ta rubuta wannan waƙar a matsayin nuna dogara ga Kristi a kowane lokaci, tana rokon kusanci da Shi yau da kullum, kamar yadda aka nuna a Ibraniyawa 13:5."
    },
    "HBH327": {
      title: "Sa'a Ta Addu'a",
      number: "HBH327",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWEET HOUR",
      meter: "L.M.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sa'ar addu'a, sa'ar addu'a, Da ke kira daga duniya,", "Da ke kai ni gaban Uba, In sanar da bukatuna,", "A lokacin bakin ciki, Zuciata na kwantawa,", "Nikan tsere tarkon Shaidan, A lokaci na yin addu'a."] },
        { verse: 2, text: ["Sa'ar addu'a, sa'ar addu'a, Murnar da nake da ita,", "Ga wadanda ruhunsu ke, Cike da begen komowarka!", "Gama ina saurin zuwa, Inda zan ga fuskar Kristi,", "Da murna na zauna a nan, Ina jiran ka sa'ar addu'a."] },
        { verse: 3, text: ["Sa'ar addu'a, sa'ar addu'a, Ka saurari bukatuna,", "Wanda bangaskiya da, Amincinsa ke ba da albarka,", "Da shike ya ce in nemi, Fuskarsa in gaskanta shi,", "Zan jibga masa duk bukatuna, In jira gare Shi."] }
      ],
      history: "William W. Walford ne ya rubuta wannan waƙar a shekarar 1845, tana bayyana mahimmancin addu'a a matsayin mafaka da lokacin samun kwanciyar hankali a gaban Allah."
    },
    "HBH328": {
      title: "Ba Aboki Kamar Yesu",
      number: "HBH328",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CONVERSE",
      meter: "8.7.8.7. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ba aboki kamar Yesu, Shi ya mutu dominmu,", "Babbar dama ce gare mu, Yi addu'a ga Allah,", "Mukan rasa salamarsa, Kunci yakan dame mu,", "Don mun kasa yin addu'a, Ga Allah Uba mai rai."] },
        { verse: 2, text: ["Ko jaraba ta same mu, Da masifa ko'ina,", "Sai mu nace mu karfafa, Yi addu'a ga Yesu,", "Ba mai aminci kamarsa, Da zai dauki kuncinmu,", "Yesu ya san kasawarmu, Yi addu'a ga Yesu."] },
        { verse: 3, text: ["Ko karfinmu duk ya kasa, Ba mu iya kome ba,", "Mai ceto mai taimakonmu, Yi addu'a ga Yesu,", "Ko abokannai sun ki mu, Yi addu'a ga Yesu,", "Zai karbe ka, ya kare ka, Cikin ikon karfinsa."] }
      ],
      history: "Joseph Scriven ya rubuta wannan waƙar a shekarar 1855 don ta'azantar da mahaifiyarsa, tana koyarwa cewa Yesu shine abokinmu mafi aminci wanda muke iya kai wa dukan damuwarmu."
    },
    "HBH329": {
      title: "Lokaci Ne Na Addu'a",
      number: "HBH329",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BLESSED HOURS",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Lokaci ne na addu'a, in mun yi saduda", "Mun taru wurin Yesu, Mai Cetonmu ne;", "In mun neme shi da gaske, zai ba mu kariya,", "Wannan kwarin gwiwa ce! wannan wuri da kyau!"] },
        { verse: "Korus", text: ["Lokaci ne na addu'a, lokaci ne na addu'a", "Wannan kwarin gwiwa ce! wannan wuri da kyau!"] },
        { verse: 2, text: ["Lokaci ne na addu'a, sa'ad da Mai ceto ya zo,", "Tare da tausayi, 'ya'yansa su ji;", "Sa'ad da ya ce mu zuba masa duk damuwarmu;", "Wannan kwarin gwiwa ce! wannan wuri da kyau!"] },
        { verse: 3, text: ["Lokaci ne na addu'a sa'ad da gwaji ya zo", "Ga Kristi da ke kaunar masu bakin ciki", "Ta wurin tausayi yana cire damuwar su;", "Wannan kwarin gwiwa ce! Wannan wuri da kyau!"] },
        { verse: 4, text: ["A lokaci na addu'a, mun dogara gare shi", "Za mu sami albarkunmu da muke jira;", "A wannan lokaci za mu rabu da damuwa,", "Wannan kwarin gwiwa ce! Wannan wuri da kyau!"] }
      ],
      history: "Fanny Crosby ce ta rubuta wannan waƙar tana jaddada cewa lokacin addu'a lokaci ne na samun albarka da kwarin gwiwa daga wurin Mai Ceto."
    },
    "HBH330": {
      title: "Koya Mini Addu'a",
      number: "HBH330",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AREITZ",
      meter: "9.9.9.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Koya mini addu'a Kristi", "Wannan shi ne kukana kullum", "Ina begen in san nufinsa", "Koya mini addu'a Kristi."] },
        { verse: "Korus", text: ["Zama cikinka, Kristi, kai cikina,", "Ina zama kullum, shi ne begena;", "Ba ni ikonka, mara iyaka,", "In shaku da mutane da kai."] },
        { verse: 2, text: ["Iko cikin addu'a, Kristi,", "A nan zunubi na duniya ne;", "Jama'a na mutuwa ba bege;", "Ka ba ni iko cikin addu'a."] },
        { verse: 3, text: ["Nufina mai rauni, sauya shi", "Halin mutuntaka na kawas", "Ka cika ni da sabon iko", "Iko in yi addu'a da aiki"] },
        { verse: 4, text: ["Koya mani addu'a, Kristi,", "Kai ne gurbi gare ni kullum,", "Kai lamunina, har abada,", "Koya mani addu'a, Kristi."] }
      ],
      history: "Wannan waƙar addu'a ce ta neman sanin nufin Allah da samun ikon yin addu'a yadda ya kamata don samun nasara a ka zunubi da hidima ga wasu."
    },
    "HBH331": {
      title: "Yi Magana Ya Yesu",
      number: "HBH331",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOLCOMB",
      meter: "7.6.7.6. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yi magana, Ya Yesu, Cikin zuciata,", "Yi magana, Ya Yesu, Ka kau da tsorona."] },
        { verse: "Korus", text: ["Yi magana, cikin zuciata, Ina rokonka Yesu", "Wannan shi ne, rokona a yau, Yi magana da ni."] },
        { verse: 2, text: ["Yi magana, Ya Yesu, Wanke zunubaina,", "Taimake ni, Ya Yesu, In jawo batattu."] },
        { verse: 3, text: ["Yi magana, Ya Yesu, Yau na zama naka", "Yi magana, Ya Yesu, Ka tsarkake ni yau."] }
      ],
      history: "B.B. McKinney ya rubuta wannan waƙar a shekarar 1927, tana rokon Yesu ya yi magana da zuciyar mai bi don samun ja-gora da tsarkakewa."
    },
    "HBH332": {
      title: "Sa Mutane A Zuciata",
      number: "HBH332",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LEILA",
      meter: "C.M. With Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sa mutane a zuciata, Da zan kaunace su", "In yi aikina cikin gaskiya, Don in rinjayo su."] },
        { verse: "Korus", text: ["In kawo su a wurinka, Wannan ne addu'ata", "Taimake ni cikin aiki, In kawo su gun ka."] },
        { verse: 2, text: ["Bari in yi bishararka, In iya jimrewa", "Ba ni iko in ribato, Rayuka gareka."] },
        { verse: 3, text: ["Shelar bishararka kadai Shi ne addu'ata", "Idan na zo kursiyinka, In ga 'yantattu can."] }
      ],
      history: "Waƙar tana nuna sha'awar mai bi na yin aikin bishara, yana rokon Allah ya ba shi damar jawo wasu zuwa ga Kristi."
    },
    "HBH333": {
      title: "Falkad Da Mu Ya Allah Uba",
      number: "HBH333",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MATTHEWS",
      meter: "9.9.9.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Falkad da mu ya Allah Uba,", "Cikin zuciyar kowanenmu,", "Bisa ga maganarka Allah,", "Bari ta fara da ni."] },
        { verse: "Korus", text: ["Ka aiko da falkawa fa, Aiko da falkawa", "Aiko da falkawa fa, Bari ta fara da ni."] },
        { verse: 2, text: ["Falkad da mu ya Allah Uba,", "Taimake mu mu bar zunubi", "Don mu yi kusa da kursiyinka,", "Wannan shi ne rokonmu."] },
        { verse: 3, text: ["Falkad da masu yin zunubi,", "Don su juyo daga hanyarsu,", "Don su fara sabuwar rayuwa,", "Yesu ba su nasara."] },
        { verse: 4, text: ["Falkad da kowace zuciya,", "Ja mu domin yin kusa da kai", "Bari mu dandana cetonka,", "Bari ta fara da ni."] }
      ],
      history: "Wannan waƙar roko ce ga Allah don ya kawo falkawa (revival) a cikin rayuwar masu bi da kuma janyo masu zunubi zuwa ga tuba."
    },
    "HBH334": {
      title: "Ina Bukatarka",
      number: "HBH334",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NEED",
      meter: "6.4.6.4 with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina bukatarka, Ban iya kome ba", "Muryarka ce kadai, Mai ba da salama"] },
        { verse: "Korus", text: ["Ya Yesu, Yesu Kristi,", "Sai ka taimake ni", "Yanzu na zo gareka, mai cetona."] },
        { verse: 2, text: ["Ina bukatarka, Kusance ni,", "Jarabobi sun kau, In kana kusa."] },
        { verse: 3, text: ["Ina bukatarka, A kowanne hali,", "Zo ka mallake ni, Kada in lalace."] },
        { verse: 4, text: ["Ina bukatarka, Kai Mai Tsarki", "Ka maishe ni naka, Kai mai albarka. AMIN"] }
      ],
      history: "Annie S. Hawks ta rubuta wannan waƙar a shekarar 1872, tana bayyana tsananin bukatar da mai bi ke da ita ga kasancewar Kristi a kowane lokaci na rayuwarsa."
    },
    "HBH335": {
      title: "Ya Kristi Uban 'Yan Adam",
      number: "HBH335",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "REST (ELTON)",
      meter: "8.6.8.8.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Kristi Uban 'yan adam, Ka gafarta mana", "Ka maida mu bisa turba, Ka yi aikinka mai tsarki", "A cikin bangirma"] },
        { verse: 2, text: ["Ka sauko da ni'imarka, Har himmarmu ta kau", "Ka dauke mana damuwa, Bar rayuwarmu ta furta", "Kyaun salama naka"] },
        { verse: 3, text: ["Ka daidaita burorinmu, Su bi nufinka,", "Bari mutuntaka ta kau, Yi magana ta guguwa,", "Ta karamar murya."] },
        { verse: 4, text: ["Kamar su masu imani, Gefen Kogin Siriya,", "Kiran Kristi mai daraja, Bari muma kamarsu fa,", "Mu tashi mu bi ka. AMIN"] }
      ],
      history: "John Greenleaf Whittier ya rubuta wannan waƙar a shekarar 1872, tana kira ga samun natsuwa da gafara a gaban Allah a cikin duniyar da ke cike da hayaniya."
    },
    "HBH336": {
      title: "Addu'a Bukatar Zuciya",
      number: "HBH336",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CAMPMEETING",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Addu'a bukatar zuciya, Kalmomin ba a ji,", "Wuta wadda fa ba a ganinta, Tana motsi a zuciya."] },
        { verse: 2, text: ["Addu'a furci mai sauki, Ko jariri zai yi;", "Addu'a tana kai wurin, Allah madaukaki"] },
        { verse: 3, text: ["Addu'a rokon mai laifi, Da ya bar laifinsa;", "Mala'iku na murna can, \"Suna cewa, ya yi addu'a!\""] },
        { verse: 4, text: ["Kristi mai kai mu ga Allah, Kai ne hanyar gaskiya,", "Tafarkinka addu'a ce, Koya mana mu bi. AMIN"] }
      ],
      history: "James Montgomery ne ya rubuta wannan waƙar a shekarar 1818, tana bayyana cewa addu'a ita ce mafi kyawun furci na zuciya ga Allah."
    },
    "HBH337": {
      title: "Yesu, Kristi Bi Da Ni",
      number: "HBH337",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PILOT",
      meter: "7.7.7.7.7.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu Kristi, bi da ni, A rigyawa ta rayuwa,", "Igiyar ruwa na nan, Da ke boye halittu,", "Kai ne ka san hanya fa, Yesu Kristi, bi da ni."] },
        { verse: 2, text: ["Yadda uwa da danta, Kana iko da iska,", "Igiyar ruwa na jin ka, Sa'ad da ka ce kwanta,", "Mai iko bisa teku, Yesu, Kristi bi da ni."] },
        { verse: 3, text: ["In na kusa da gaba, Ruwa na ta yin hauka", "Razana kuma ta zo, In na jingina gun ka", "Sai in ji kana cewa, Ni kuwa fa zan bi da kai."] }
      ],
      history: "Edward Hopper ya rubuta wannan waƙar a shekarar 1871 don masu ruwa (sailors), tana rokon Yesu ya zama jagora (pilot) a cikin teku na rayuwa."
    },
    "HBH338": {
      title: "Kara Mani Tsarki",
      number: "HBH338",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MY PRAYER",
      meter: "6.5.6.5.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kara mana tsarki, Da kwazo ciki", "Kara mani juriya, In ki zunubi", "Kara bangaskiya, In san kaunarka;", "Kara mini murna, In yi addu'a."] },
        { verse: 2, text: ["Ba ni halin godiya, Da yin dogara", "In so darajarSa, Da begen kalma.", "Hawaye dominSa, Don radadinsa", "In kaskantad da kai, In yi yabonsa."] },
        { verse: 3, text: ["Ba ni tsabtar zuciya, Da iko kuma", "'Yanci daga duniya, Begen aljanna", "In kamaci mulkin, Da Amfani kwa", "In kara albarka, zama kamarsa. AMIN"] }
      ],
      history: "Philip P. Bliss ya rubuta wannan waƙar a shekarar 1873, tana rokon Allah ya ba mai bi ƙarin tsarki, haƙuri, da murna a cikin hidimarsa."
    },
    "HBH339": {
      title: "Ubangiji Domin Gobe",
      number: "HBH339",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "VINCENT",
      meter: "8.4.8.4. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubangiji, domin gobe, Ban roka ba,", "Tsare ni daga zunubi, A ranar yau", "Taimake ni in yi aiki, In yi addu'a", "Bari in zama nagari, Uba a yau."] },
        { verse: 2, text: ["Kar kalma da bata da kyau, In fade ta,", "Ka tsare maganganuna, A komai yau,", "Bari in zama fa da kyau, A koyaushe,", "In yi aminci gare ka, Uba a yau."] },
        { verse: 3, text: ["Cikin radadi da kunci, Ba dadewa,", "Idan mutuwa ta zo yau, Za ni gida,", "Domin gobe da batunta, Ban roka ba,", "Ka bishe ni, kaunace ni, Allah a yau. AMIN"] }
      ],
      history: "Wannan waƙar tana nuna dogara ga Allah don samun ƙarfin yin rayuwa mai tsarki yau, ba tare da damuwa da gobe ba, kamar yadda aka nuna a Matiyu 6:34."
    },
    "HBH340": {
      title: "Kristi Yi Magana Da Ni",
      number: "HBH340",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CANONBURY",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kristi yi magana da ni, Don in furta maganarka,", "Kamar yadda ka nemo mu, Bari in nemi batattu."] },
        { verse: 2, text: ["Ya Kristi ka koya mini, Domin in koya wa wasu,", "Kuma in furta Magana, Domin su kai ga jama'a,"] },
        { verse: 3, text: ["Kristi ka zauna cikina, Har zuciyata ta cika,", "Ka sa in zama nagari, In shaida nuna yabonka,"] },
        { verse: 4, text: ["Kristi yi amfani da ni, Yadda kake so ko'ina,", "Har sai na ga fuskarka fa, Na dandana daukakarka. AMIN."] }
      ],
      history: ""
    },
    "HBH341": {
      title: "Wakar Safiya",
      number: "HBH341",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WE THANK THEE",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba mun gode don dare, Da hasken safe mai dadi", "Don hutu, abinci, kula, Da duk abubuwan rayuwa."] },
        { verse: 2, text: ["Taimake ni yin nufinka, Mu yi nagarta ga wasu,", "A cikin kowane hali, Mu kaunace ka kullum fa."] }
      ],
      history: ""
    },
    "HBH342": {
      title: "Aiko Da Falkawa Cikina",
      number: "HBH342",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "TRAVIS AVENUE",
      meter: "9.9.9.10. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina zuwa gare ka Kristi, Na dogara ga maganarka", "Bari ka ji addu'ata fa, Aiko da falkawa a cikina."] },
        { verse: "Korus", text: ["Aiko da falkawa cikina,", "Aiko da falkawa cikina.", "Bar Ruhu Mai Tsarki ya mallake ni,", "Ka aiko da falkawa cikina."] },
        { verse: 2, text: ["Aiko da Ruhunka Mai Tsarki, Ya fidda dauda da zunubi", "A ga aikinka na alheri, Aiko da falkawa a cikina"] },
        { verse: 3, text: ["Aiko da falkawa cikina, Ka taimake ni in yi murna", "Ka ba ni karfi don nasara, Aiko da falkawa a cikina."] },
        { verse: 4, text: ["Na bada kaina don aikinka, Don ribato wasu jama'a,", "Ka taimake ni ka bishe ni, Aiko da falkawa a cikina."] }
      ],
      history: ""
    },
    "HBH343": {
      title: "Ubanmu Na Sama",
      number: "HBH343",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. MICHELS",
      meter: "11.11.11.11.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba na sama sunanka tsarkakke:", "Mulkin ka shi zo, Abin da kake so,", "A yi shi a duniya kamar a sama,", "Ka ba mu yau da abincin yini fa,", "Daga yalwarka ne kwa ni zan koshi."] },
        { verse: 2, text: ["Ka gafarta mana laifofinmu fa,", "Kamar yadda muke ta gafartawa,", "Kada ka kai mu wuraren jaraba,", "Ka tsare mu daga dukan mugaye,", "Girma duka nake ne har abada. Amin"] }
      ],
      history: ""
    },
    "HBH344": {
      title: "Yesu Ne Makiyayinmu",
      number: "HBH344",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BRADBURY",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Addu'a",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu ne makiyayinmu, Muna son lurarka kuwa,", "Ya makiyayi kosad da mu, Mu tumaki naka ne,", "Mai albarka Yesu Kristi, Ka saye mu naka ne.", "Mai albarka Yesu Kristi, Ka saye mu naka ne."] },
        { verse: 2, text: ["Mu naka ne kaunace mu, Bishe mu a hanyar mu,", "Tsare mu daga zunubi, Neme mu in mun kauce,", "Mai albarka Yesu Kristi, Ji addu'a in mun yi;", "Mai albarka Yesu Kristi, Ji addu'a in mun yi."] },
        { verse: 3, text: ["Kai ka ce za ka karbe mu, Komai yawan laifinmu,", "Za ka nuna mana jinkai, Za ka tsarkake kuwa:", "Mai albarka Yesu Kristi, Ga mu wurin ka yanzu,", "Mai albarka Yesu Kristi, Ga mu wurin ka yanzu."] },
        { verse: 4, text: ["Ka ba mu tagomashinka, Bari mu yi nufinka", "Kristi kai mai albarka ne, Cika mu da kaunarka", "Mai albarka Yesu Kristi, Kana kaunarmu kullum,", "Mai albarka Yesu Kristi, Kana kaunarmu kullum."] }
      ],
      history: ""
    },
    "HBH345": {
      title: "Kusa Da Gicciyen Yesu",
      number: "HBH345",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. CHRISTOPHER",
      meter: "7.6.8.6.8.6.8.6",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kusa gicciyen Yesu, A nan ne zan tsaya,", "Inuwar dutse mai girma, A kasa mai wuya;", "Ga gida a cikin jeji, Hutu a kan hanyar,", "Daga kaifin zafin rana, Da kuma wahala."] },
        { verse: 2, text: ["A gicciyen Yesu fa, Idanuna kanka,", "Irin mutuwar nan wadda, Shi ya sha domina,", "Daga zuciata mai kunci, Na shaida abu biyu,", "Al'ajibi na kaunarSa, Rashin cancanta ta."] },
        { verse: 3, text: ["Inuwar gicciyenka, Ne wurin zamana,", "Ba na neman wani haske, Sai hasken fuskarsa;", "Na bar duniya da kayan ta, Ban yi asara ba,", "Ni mai zunubi da kunya, Gicciye, daukaka."] }
      ],
      history: ""
    },
    "HBH346": {
      title: "Ga Yesu Yana Tsaye",
      number: "HBH346",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. HILDA",
      meter: "7.6.7.6. D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ga Yesu yana tsaye, Waje kofar rufe,", "Tsaye cikin hakuri, Don ya shiga ciki,", "Ana kirga mu Krista, An hatimce mu duk,", "Abin kunya a kanmu, Mun bar Shi tsaye nan!"] },
        { verse: 2, text: ["Yesu na kwankwasawa, Hannunsa da tabo,", "Hawaye na zubowa, Ga rawanin kaya,", "Kauna mara iyaka, Cikin hakuri fa,", "Zunubin da yawa fa, Yana rufe kofa."] },
        { verse: 3, text: ["Yesu, kana ta riko, Da murya mai taushi,", "\"Na mutu don 'ya'yana, Don me kun raina ni?", "Kristi cike da kunya, Mun bude zuciya", "Ya mai ceto ka shiga, Zauna har abada! AMIN"] }
      ],
      history: ""
    },
    "HBH347": {
      title: "Inda Ya Kai Ni Zan Je",
      number: "HBH347",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "FALLS CREEK",
      meter: "8.6.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["\"Dauki gicciyen biyo Ni\", In ji Ubangiji,", "\"Na ba da raina dominka, Ka mika ranka yau."] },
        { verse: "Korus", text: ["Inda ya kai ni zan je, ..., Inda ya kai ni zan je, ...", "Ni zan bi Kristi mai kaunata, Inda ya kai ni zan je."] },
        { verse: 2, text: ["Ya jawo ni kusa da Shi, Na nemi nufinSa,", "Don haka yanzu zan zauna, Inda ya kai ni zan je."] },
        { verse: 3, text: ["Ko a cikin duhu ne fa, Ko ta rigyawa ma,", "Na dauki gicciyena fa, Inda ya kai ni zan je."] },
        { verse: 4, text: ["Zuciyata rayuwata, Na kawo gun Yesu", "Shi Ubangiji Sarkina, Inda ya kai ni zan je."] }
      ],
      history: ""
    },
    "HBH348": {
      title: "Bar A Ga Yesu Cikinka",
      number: "HBH348",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "COLEMAN",
      meter: "8.7.8.8. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A tafiyar ka zuwa sama, Mutane na kallonka,", "Zama da tsarki cikinka, Bar a ga Yesu cikinka."] },
        { verse: "Korus", text: ["Bar a ga Yesu cikinka..., Bar a ga Yesu cikinka...", "Yi ta shaida bishara da aminci, Bar a ga Yesu cikinka."] },
        { verse: 2, text: ["Rayuwarka littafi ne, Suna karanta wa kwa,", "Ko tana kai su gun Yesu, Ko suna ganin Yesu kwa?"] },
        { verse: 3, text: ["Akwai murna a can sama, Can gida mai daraja,", "Kan rayuka da ka jawo; Bar a ga Yesu cikinka."] },
        { verse: 4, text: ["Yi rayuwa domin Yesu, Yi aminci ba tsoro,", "Kai batattu wurin haske; Bar a ga Yesu cikinka."] }
      ],
      history: ""
    },
    "HBH349": {
      title: "Ni Fa Naka Ne Uba",
      number: "HBH349",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "I AM THINE",
      meter: "10.7.10.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ni fa naka ne, Na ji muryarka, Na ji zancen kaunarka;", "Ina so cikin bangaskiyata, In zo kurkusa da kai."] },
        { verse: "Korus", text: ["Ja ni kusa,ya mai cetona, Ga gicciye da ka mutu,", "Ja ni Kusa, ya mai cetona, Wurin zuban jininka."] },
        { verse: 2, text: ["Tsarkake ni domin hidimarka, Da ikon alherinka,", "Bar raina ya duba cikin bege, In yi nufinka kadai."] },
        { verse: 3, text: ["Ina da murna domin lokaci, Da zan tsaya gabanka,", "In yi addu'a gareka Allah, In yi zumunci da kai!"] },
        { verse: 4, text: ["Kaunar tana da zurfin ganewa, Sai na je can zan gane;", "Murnata a nan ba ta cika ba, Sai na shiga hutunka. AMIN"] }
      ],
      history: ""
    },
    "HBH350": {
      title: "Ko Ka Kawo A Bagadi Na Hadaya?",
      number: "HBH350",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOFFMAN",
      meter: "12.9.12.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kana so salama, da karin bangaskiya,", "Ka yi addu'a da aniya;", "Hutu ba zai samu babu albarka ma", "Sai ka kawo a kan bagadin."] },
        { verse: "Korus", text: ["Ko ka kawo a bagadi na hadaya?", "Ko Ruhunsa yana mulkinka?", "Za ka yi albarka, salama da hutu,", "In ka ba Shi jiki da ranka."] },
        { verse: 2, text: ["Ko za ka yi zama, a cikin haskensa", "Ka sami salama koyaushe", "Sai ka yi nufinsa don ka kauce illa,", "In ka ba Shi jiki da ranka."] },
        { verse: 3, text: ["Ba za mu sami abin da na Yesu ne", "Na albarku da muka roka", "Sai dai jiki da rai yana mallakarsu,", "Sai mun kawo a kan bagadi."] }
      ],
      history: ""
    },
    "HBH351": {
      title: "“Za Ku Iya”, In Ji Yesu",
      number: "HBH351",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BEACON HILL",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["“Za ku yarda”, Yesu ya ce, “A gicciye ku da ni!”", "“I”, in ji masu fahariya, “Za mu bi ka har mutuwa”."] },
        { verse: "Korus", text: ["“Uba, za mu iya”, mu naka ne,", "Sake su, maishe su kamarka,", "Zatinka bisanmu zai bi da mu,", "Fitilar Allah, ga imani sosai."] },
        { verse: 2, text: ["“Za ku yarda” Har yanzu fa, Yana kira don aljanna,", "Jarumawa suka amsa, Yanzu kamar Galili."] }
      ],
      history: ""
    },
    "HBH352": {
      title: "Rayuwa Don Yesu",
      number: "HBH352",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LIVING",
      meter: "10.10.10.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Rayuwa don Yesu cikin gaskiya,", "Don in gamshe Shi a cikin komai,", "Yin aminci da sahihiyar gaskiya,", "Hanyar albarka ce a gare ni."] },
        { verse: "Korus", text: ["Yesu, Uba mai ceto, Na ba ka raina yau;", "Gama ka yi hadaya da kanka domina;", "Ban da wani sai dai kai, zauna a zuciata", "Na ba da rayuwata kadai, ga Kristi ba wani ba."] },
        { verse: 2, text: ["Rayuwa don Yesu wanda ya mutu,", "A kan gicciye ya dauki laifina,", "Kauna ta sa in amsa kiranSa,", "In bi nufinsa in ba shi kaina."] },
        { verse: 3, text: ["Rayuwa don Yesu a cikin duniya,", "Abin daraja hasken muryarsa,", "Neman wanda ya mutu dominsu,", "Kawo gajiyayyu su sami hutu."] }
      ],
      history: ""
    },
    "HBH353": {
      title: "Ka Yi Himma Mafi Girma Ga Uba",
      number: "HBH353",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BARNARD",
      meter: "8.7.8.7.D. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka yi himma mafi girma, Yi shi da kuruciya;", "Ba da ranka ya haskaka, Cikin yaki don gaskiya,", "Yesu yana nuna gurbi, Saurayi mara tsoro,", "Ka yi masa duk biyayya, Ba Shi mafi girma duk."] },
        { verse: "Korus", text: ["Ka yi himma mafi girma, Yi shi da kuruciyarka;", "Yafa kayan yakin ceto, Shiga yaki don gaskiya."] },
        { verse: 2, text: ["Ka yi himma mafi girma, Ba shi wuri na fari;", "Na farko a hidimarka, Mika kowane sashe,", "In ka bayar za a ba ka, Allah ya ba da Dansa;", "Nemi ka yi hidimarSa, Ba shi mafi girma duk."] },
        { verse: 3, text: ["Ka yi himma mafi girma, Kaunarsa ba kamarta,", "Ya ba da ransa fansarka, Ya bar darajarsa ma,", "Ya ba da ranSa da son Sa, Kar ka shiga hallaka,", "Sai zuciyarka ta yabe Shi, Ba Shi mafi girma duk."] }
      ],
      history: ""
    },
    "HBH354": {
      title: "Kai Ne Nawa Har Abada",
      number: "HBH354",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CLOSE TO THEE",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kai ne nawa har abada, ka fi aboki ko rai;", "A tafiya ta ibada, bar in yi tare da kai.", "Kusa da kai Yesu, kusa da kai Yesu", "A cikin tafiyar ibada, Zan taka tare da kai."] },
        { verse: 2, text: ["Ba don jin dadi na duniya, ban roki in yi suna;", "Zan yi aiki da shan wuya zan taka tare da kai.", "Kusa da kai Yesu, kusa da kai Yesu,", "Zan yi aiki da shan wuya, Zan taka tare da kai."] },
        { verse: 3, text: ["Bi da ni a cikin duhu, Bisa wahalar duniya,", "A kofar rai har abada, In shiga tare da kai.", "Kusa da kai Yesu, kusa da kai Yesu,", "A kofar rai har abada, In shiga tare da kai."] }
      ],
      history: ""
    },
    "HBH355": {
      title: "Yi Nufinka Cikin Nawa Rai",
      number: "HBH355",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "POLLARD",
      meter: "5.4.5.4.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yi nufinka cikin nawa rai,", "Kai magini ne, ni yumbu ne,", "Shirya ni bisa ga nufinka,", "Na ba da kaina a hannunka."] },
        { verse: 2, text: ["Yi nufinka cikin nawa rai,", "Gwada, ka gani yadda nake,", "Wanke ni sarai da jininka,", "Na ba da kaina a hannunka."] },
        { verse: 3, text: ["Yi nufinka cikin nawa rai,", "Ina da ciwo na zunubi,", "Kai ne mai ikon warkad da ni,", "Na ba da kaina a hannunka."] },
        { verse: 4, text: ["Yi nufinka cikin nawa rai,", "Ka yi sarauta bisana dai,", "Ba ni ruhunka, kowa ya ga,", "Yesu ke zaune a zuciata. AMIN"] }
      ],
      history: ""
    },
    "HBH356": {
      title: "Ka Dauki Rayuwa Ta",
      number: "HBH356",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "YARBROUGH",
      meter: "7.7.7.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka dauki rayuwata, Tsarkake ni Allahna", "Ka dauki hannayena, Bisa ga kaunarka fa,"] },
        { verse: "Korus", text: ["Na baka duk rayuwata", "Taka ce har abada", "Taka ce har abada"] },
        { verse: 2, text: ["Dauki kafafuwana, Don yin aiki dominka,", "Bar in yi maka yabo kullum domin sarkina,"] },
        { verse: 3, text: ["Dauki duk mallakata, Ba zan hana komai ba,", "Dauki duk kwanakina, Don su yi ta yabonka,"] },
        { verse: 4, text: ["Dauki duka nufina, Mai da shi nufinka yau", "Zuciyata taka ce, Ta zama kursiyinka."] }
      ],
      history: ""
    },
    "HBH357": {
      title: "Ka Dauki Rayuwa Ta",
      number: "HBH357",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HENDON",
      meter: "7.7.7.7.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka dauki rayuwa ta, tsarkake ni Allahna", "Ka dauki hannayena, bisa ga kaunarka fa,", "Bisa ga kaunarka fa, Bisa ga kaunarka fa."] },
        { verse: 2, text: ["Dauki kafafuwana, Don yin aiki dominka,", "Bar in yi maka yabo, kullum domin sarkina,", "Kullum domin sarkina. Kullum domin sarkina."] },
        { verse: 3, text: ["Dauki duk mallakata, Ba zan hana komai,", "Dauki duk kwanakina, don su yi ta yabonka.", "Don su yi ta yabonka. Don su yi ta yabonka."] },
        { verse: 4, text: ["Dauki duka nufina, mai da shi nufinka yau", "zuciata taka ce, ta zama kursiyinka.", "Ta zama kursiyinka. Ta zama kursiyinka."] }
      ],
      history: ""
    },
    "HBH358": {
      title: "An Ba Ni Umurni",
      number: "HBH358",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BOYLSTON",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["An ba ni umurni, Zan daukaka Allah,", "Ya cece raina da DanSa, Zan hau sama da Shi"] },
        { verse: 2, text: ["Don hidima yanzu, Zan cika kirana,", "Zan mori karfina, In aika nufinSa!"] },
        { verse: 3, text: ["Ka kiyaye ni fa, In zauna gabanka,", "Uba ka shirya bawanka, Zan kawo lissafi. AMIN"] }
      ],
      history: ""
    },
    "HBH359": {
      title: "Zan Rayu Domin Kristi",
      number: "HBH359",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DUNBAR",
      meter: "8.8.8.6. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na baka kauna da raina, Dan rago ka mutu don ni,", "Bar in zama da aminci, Mai ceto Allahna."] },
        { verse: "Korus", text: ["Zan rayu don, Ya cece ni, Farin ciki raina zai yi!", "Zan rayu don ya cece ni, Mai ceto Allahna."] },
        { verse: 2, text: ["Na amince ka karbe ni, Ka mutu domin in rayu,", "Zan dogara a cikinka, Mai Ceto Allahna!"] },
        { verse: 3, text: ["Ka mutu dai a kalfari, Ka cece ni don in tsira,", "Zan damka raina gare ka, Mai ceto Allahna."] }
      ],
      history: ""
    },
    "HBH360": {
      title: "Yesu Yana Kiranmu",
      number: "HBH360",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GALILLE",
      meter: "8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu Yana kiranmu duk, Daga wahalar rayuwa,", "Kullayomi yana kira, Cewa, “Krista, biyo ni!”"] },
        { verse: 2, text: ["Yesu Yana kiranmu duk, Daga bautar duniya", "Daga gunki mai mallaka, Cewa, “Krista, biyo ni”."] },
        { verse: 3, text: ["Cikin murna da damuwa, Yawan fama da hutu,", "Har yau Yana ta yin kira, “Kaunace ni fiye da su”."] },
        { verse: 4, text: ["Ya kira mu don jinkansa, Bari mu ji kiran,", "Ba mu halin yin biyayya, Mu bauta maka sosai."] }
      ],
      history: ""
    },
    "HBH361": {
      title: "Inda Ya Kai Ni",
      number: "HBH361",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NORRIS",
      meter: "8.8.8.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na ji kira na Mai Ceto,", "Na ji kira na Mai Ceto", "Na ji kira na Mai Ceto,", "“Dauki gicciye, gicciye biyo ni”."] },
        { verse: "Korus", text: ["Inda ya bishe ni zan je, Inda ya bishe ni zan je", "Inda ya bishe ni zan je, zan je da shi", "Da shi ko'ina."] },
        { verse: 2, text: ["Zan je da Shi cikin gonar,", "Zan je da Shi cikin gonar", "Zan je da Shi cikin gonar,", "Zan je da Shi, da Shi har karshe."] },
        { verse: 3, text: ["Zan je da Shi cikin shari'a,", "Zan je da Shi cikin shari'a,", "Zan je da Shi cikin shari'a,", "Zan je da Shi da Shi har karshe."] },
        { verse: 4, text: ["Shi zai yi mini alheri,", "Shi zai yi mini alheri,", "Zai min alheri da daukaka,", "In je da Shi, da Shi har karshe."] }
      ],
      history: ""
    },
    "HBH362": {
      title: "Sawayen Yesu",
      number: "HBH362",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "FOOTSTEPS",
      meter: "9.4.9.4. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muryar Ubangiji na kira, “Ku biyo ni”", "Sawayenka na bi da mu , Zuwa wurinka."] },
        { verse: "Korus", text: ["Sawayen Yesu na haskaka hanya;", "Za mu bi sawaye na Yesu inda sun kai."] },
        { verse: 2, text: ["Ko sun bi ta duwatsu don neman, Batattu,", "Ko sun bi ta wurin tafki ne, Don taimako."] },
        { verse: 3, text: ["In sun kai zuwa haikali ne, Don wa'azi", "Ko a gidan talakawa yin, Bautar Allah."] },
        { verse: 4, text: ["A karshen tafiyarmu zai gan, Mu a sama,", "Za mu huta inda sun tsaya, A kursiyin."] }
      ],
      history: ""
    },
    "HBH363": {
      title: "Na Ba Yesu Dukan Rai Na",
      number: "HBH363",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SURRENDER",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Na ba Yesu dukan raina, Na ba Shi ba ragewa,", "Zan kaunace Shi Zan dogara, Gare Shi Koyaushe."] },
        { verse: "Korus", text: ["Na ba Yesu duk, Na ba Yesu duk,", "Na ba Yesu duk, A gare ka, mai cetona na baka duka."] },
        { verse: 2, text: ["Na ba Yesu dukan raina, Maida ni duka naka,", "Bari ruhunka a cikina, Ya shaida ni naka ne."] },
        { verse: 3, text: ["Na ba Yesu dukan raina, Na ba ka dukan raina,", "Zubo kauna da ikonka, Albarka ta zo mini."] }
      ],
      history: ""
    },
    "HBH364": {
      title: "Kada Ka Jarabtu",
      number: "HBH364",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PALMER",
      meter: "6.5.6.5.D. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Keɓe Kai",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka da ka jarabtu, Don zunubi ne,", "Kowane nasara, Zai taimake ka,", "Ci gaba da yaki, Ki duk sha'awa,", "Sa ido ga Yesu, Za ya bishe ka."] },
        { verse: "Korus", text: ["Roki taimakon Yesu, Da karfafawansa,", "Ba zai ki taimakonka, Za ya bishe ka."] },
        { verse: 2, text: ["Ki abokan banza, Ki kalmar wofi,", "Girmama sunanSa, Yi ta rike shi,", "Yi tunani mai kyau, Nuna alheri,", "Sa ido ga Yesu, Za ya bishe ka."] },
        { verse: 3, text: ["Ga duk mai nasara, Akwai rawani,", "Bangaskiya za ta sa, Mu yi nasara,", "Shi ne mai cetonmu, Zai karfafa mu,", "Sa ido ga Yesu, Za ya bishe ka."] }
      ],
      history: ""
    },
    "HBH365": {
      title: "Domin Tafiya Da Allah",
      number: "HBH365",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BALEERMA",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Domin tafiya da Allah, Shi ne jigon sama,", "Hasken da ke haska hanyar, Da ke kai ga Yesu"] },
        { verse: 2, text: ["Ina albarkar nan ta da, Daga Ubangiji?", "Ina wartsakarwar zuciya, Na maganar Yesu?"] },
        { verse: 3, text: ["Na sami salama sosai, Tuna da wannan fa", "Sun bar wurinsa yanzu kwa, Wanda ba mayewa."] },
        { verse: 4, text: ["Ruhu Mai Tsarki ka komo, Ka kawo hutun rai", "Zunuban da suna kore ka, Ba na son su kuma."] }
      ],
      history: ""
    },
    "HBH366": {
      title: "Albarka Ga Yesu",
      number: "HBH366",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DENNIS",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Albarka ga Yesu, Wanda ya hada mu", "Zumuntar kamar fa wadda, Ake yi a sama"] },
        { verse: 2, text: ["A gaban kursiyin, Muna yin addu'a,", "Muradin mu fa daya ne, Wato damuwarmu."] },
        { verse: 3, text: ["Mun san damuwar juna, Mun kula da juna,", "Muna zubar da hawayen, Tausayi ga juna."] },
        { verse: 4, text: ["Sa'ad da mun rabu, Ya sa mu bacin rai,", "Amma za mu sake taru, Za mu hadu kuma."] }
      ],
      history: ""
    },
    "HBH367": {
      title: "Ka Zama Da Tsarki",
      number: "HBH367",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOLINESS",
      meter: "6.5.6.5. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka zama da tsarki, Yi zance da shi", "Zauna da shi kullum, Ta maganarSa", "Ka so 'ya'yan Allah, Ka taimake su,", "Nemi albarkunsa, A duk lokaci."] },
        { verse: 2, text: ["Ka zama da tsarki, Duniya na shude,", "Ka kebe lokaci, Tare da Yesu,", "Na duban Yesu fa, Zama kamar shi", "Cikin komai naka, Za a gan shi fa."] },
        { verse: 3, text: ["Ka zama da tsarki, Bar ya bishe ka,", "Kar ka sha gabansa, A cikin kome", "Ko murna ko kunci, Bi Ubangiji,", "Ta wurin dubansa, Dogara ga shi."] },
        { verse: 4, text: ["Ka zama da tsarki, Cikin zuciya,", "Cikin tunani fa, Bar ya bi da kai", "Ta haka Ruhunsa, Za ya bishe ka", "Ba da jimawa ba, Za ka cancanta."] }
      ],
      history: ""
    },
    "HBH368": {
      title: "'Yan'uwa Mun Taru Domin Sujada",
      number: "HBH368",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOLY MANNA",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["'Yan'uwa mun taru domin sujada, Da yabon Allahnmu", "Ko za ku yi addu'a, Tun da muna yin wa'azi?", "Dukan komai banza ne fa, Sai dai Ruhu ya sauko.", "'Yan'uwa yi addu'a, abinci zai sauko daga sama."] },
        { verse: 2, text: ["'Yan'uwa ga masu zunubi, fuskantar mutuwa", "Mutuwa matsawa take kusa, Za ku bar su hallaka?", "Ga shi fa iyayenmu ne, Sun nufi jahannama", "'Yan'uwa ku yi addu'a, abinci zai yalwata."] },
        { verse: 3, text: ["Mata ku taimaka, 'yar'uwar Musa ta yi haka", "Ko za ku taimaki wasu, Masu fama da laifi?", "Shaida masu akwai ceto, Cewa yana samuwa", "'Yan'uwa Mata, yi addu'a Abinci zai sauko."] },
        { verse: 4, text: ["Mu kaunaci Allah kwarai, Mu kaunaci 'yan'uwa", "Mu yi addu'a don masu laifi, don su sami tuba", "zai kira mu zuwa gida, Za mu ci tare da Shi", "Kristi fa zai yi damara, Zai ba mu abincinsa."] }
      ],
      history: ""
    },
    "HBH369": {
      title: "Ba Ni Tsabtar Zuciya",
      number: "HBH369",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PURER IN HEART",
      meter: "6.4.6.4.6.6.4.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ba ni tsabtar zuciya, ya Allahna,", "Bari in ba ka duk rayuwata,", "Lura da kafata, ban shawara mai kyau,", "Ba ni tsarki na zuciya."] },
        { verse: 2, text: ["Ba ni tsabtar zuciya, ya Allahna,", "Koya min nufinka da kauna,", "Zama abokina in zauna wurinka,", "Ba ni tsarki na zuciya."] },
        { verse: 3, text: ["Ba ni tsabtar zuciya, ya Allahna,", "Har in ga fuskarka wata rana,", "Kawas da zunubi, yi mulki cikina,", "Ba ni tsarki na zuciya. Amin."] }
      ],
      history: ""
    },
    "HBH370": {
      title: "Yi Tafiya Cikin Haske",
      number: "HBH370",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MANOAH",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yi tafiya cikin haske, Don zumuncin kauna", "Ruhunsa ne zai kawo shi, Shi wanda ke mulki."] },
        { verse: 2, text: ["Yi tafiya cikin haske, Zai mai da kai nasa,", "Wanda ke zaune a haske, Ba duhu gare shi."] },
        { verse: 3, text: ["Yi tafiya cikin haske, Duhuna zai bace,", "Don haskenka shi haskaka, Cikinsa ba damuwa."] },
        { verse: 4, text: ["Yi tafiya cikin haske, Hanya managarcija,", "Allah zai kasance da kai, Allahnmu haske ne."] }
      ],
      history: ""
    },
    "HBH371": {
      title: "Zumunci Mai Kyau",
      number: "HBH371",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SHOWALTER",
      meter: "10.9.10.9. With Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zumunci mai kyau, mai kawo murna", "Ni na jingina ga hannunsa", "Akwai albarka akwai salama", "Ni na jingina ga hannunsa"] },
        { verse: "Korus", text: ["Na jingina, Ba abin da zai taɓa ni,", "Na jingina, Ni na jingina ga hannunsa."] },
        { verse: 2, text: ["Tafiyar mai ibada na da daɗi", "Ni na jingina ga hannunsa", "Hanyar tana ta ƙara yin haske", "Ni na jingina ga hannunsa."] },
        { verse: 3, text: ["Me zan ji tsoro, in yi fargaba", "Ni na jingina ga hannunsa", "Ni ina da salamar Yesu", "Ni na jingina ga hannunsa."] }
      ],
      history: ""
    },
    "HBH372": {
      title: "Ubangijinmu Ya Raka Ka",
      number: "HBH372",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GOD BE WITH YOU",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Zumunci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubangijinmu ya raka ka, Ikon Allah ya ɓoyeka,", "Hannunsa ya taimake ka, Har ya sake tara mu da kai."] },
        { verse: "Korus", text: ["Har ya tara mu, Ko a cikin Sama ne,", "Har ya tara mu, Ubangijinmu ya bishe ka."] },
        { verse: 2, text: ["Ubangijinmu ya raka ka, Ko jaraba ta dame ka,", "Ubangiji ya cece ka, Har ya sake tara mu da kai."] },
        { verse: 3, text: ["Ubangijinmu ya raka ka, Ikonsa ya agaje ka,", "Ƙaunarsa ta kewaye ka, Har ya sake tara mu da kai. AMIN"] }
      ],
      history: ""
    },
    "HBH373": {
      title: "Gidan Da Kristi Ke Ƙauna",
      number: "HBH373",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ALVERSTROKE",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gidan ƙauna, nan ake son ka ƙwarai", "Kai amininmu da mai cetonmu", "Babu wanda ya cancanci kujerar", "Mai girma da daraja sai dai kai."] },
        { verse: 2, text: ["Gidan ƙauna, inda muke bautarka", "Ko da wanda irin aiki ne fa,", "Har sai dukan aiki ya zama babba", "Idan an yi shi zuwa gare ka."] },
        { verse: 3, text: ["Gidan ƙauna, ba a manta da kai ba,", "In murna ta mamaye ko'ina,", "Wurin da dukan ruhu mai raunana,", "Ke zuwa gunka domin magani."] },
        { verse: 4, text: ["A ƙarshe, in aikin duniya ya kare,", "Za mu taru gida mai daraja,", "Daga inda ka fito, can ka tafi,", "Gidan salamarka har abada."] }
      ],
      history: ""
    },
    "HBH374": {
      title: "Gida In Da Allah Ya Kafa",
      number: "HBH374",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. AGNES",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gida inda Allah ya kafa, Akwai ƙauna sosai,", "Burin su shi ne su Zauna, A can gidan sama."] },
        { verse: 2, text: ["Gida inda sunan Yesu, Mai daɗi a ke ji,", "Inda yara ke yabonsa, Iyaye na son sa."] },
        { verse: 3, text: ["Gida wanda ake addu'a, Ana ta jin yabo,", "Iyaye na son maganar, Da hikimar ta duk."] },
        { verse: 4, text: ["Ubangiji bar gidan mu, Ya sami salama,", "Haɗa mu cikin ƙaunarka, Ka yi mulkinmu duk. AMIN"] }
      ],
      history: ""
    },
    "HBH375": {
      title: "Ka Sa Albarka Kan Gida",
      number: "HBH375",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "REST (ELTON)",
      meter: "8.6.8.8.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka sa albarka kan gida, Da ke baitanya,", "Gidan nan wurin hutu ne, An shirya shi don baƙonta,", "Mun keɓe domin ka."] },
        { verse: 2, text: ["In ka wuce zuwa haikali, Domin yin addu'a,", "Gidan Ubanka ne babba, Da ƙauna ka tsarkake shi,", "Kaɗai gidan ka ne."] },
        { verse: 3, text: ["Mun yi bagadi na addu'a, Don mu ga fuskarka,", "Allah in ka zauna da mu, Mun keɓe gidan nan a yau,", "Ya zama mai tsarki. AMIN"] }
      ],
      history: ""
    },
    "HBH376": {
      title: "Aboki Na Gida",
      number: "HBH376",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ELLERS",
      meter: "10.10.10.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Aboki ne, kamar a Galili,", "Uwaye sun kawo 'ya'ya gun ka,", "Mu za mu kawo 'ya'yanmu a yau", "Muna roƙo domin ka kare su."] },
        { verse: 2, text: ["Ikilisiyarka a matsayin uwa,", "Ta rungumi 'yan tumakin kuwa;", "Kamar safiya mai kai tsakar rana", "Suna cikin ƙaunar ta da aiki."] },
        { verse: 3, text: ["Jawo iyaye ta wurin 'ya'ya.", "Cika gidan su da yawan tsarki,", "Ka tara gidaje su zama ɗaya", "A sama in an bar wannan duniya. AMIN"] }
      ],
      history: ""
    },
    "HBH377": {
      title: "Ba Mu Gidan Krista",
      number: "HBH377",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CHRISTIAN HOME",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWAR KRISTA: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ba mu gidan Krista! Inda za a san Maganarka,", "Inda ake neman nufinka, Wurin da ƙaunarka take nan,", "Yi mulkin gidan mu, Ba mu gidan Krista.", "Ba mu gidan Krista."] },
        { verse: 2, text: ["Ba mu gidan Krista! Inda Uba ke nuna gaskiya,", "Inda babu hali mara kyau, Inda akwai murna da waƙa,", "Ba mu gidan Krista, Ba mu gidan Krista."] },
        { verse: 3, text: ["Ba mu gidan Krista! Inda a ke girmama uwa,", "Tana ce hanyarka ce mai kyau, In da ake ɗaukaka Allah;", "Ba mu gidan Krista, Ba mu gidan Krista!"] },
        { verse: 4, text: ["Ba mu gidan Krista! nda 'ya'ya suna san Kristi,", "Wanda yake ƙaunar su sosai, Inda ba a fasa yin addu'a", "Ba mu gidan Krista; Ba mu gidan Krista. AMIN"] }
      ],
      history: ""
    },
    "HBH378": {
      title: "Sihiyona Kewaye Da Dutse",
      number: "HBH378",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ZION",
      meter: "8.7.8.7.4.7",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sihiyona kewaye da dutse, Allah ne mai kare ta", "Maƙiyanta za su faɗi, Kome shiri da sun yi", "Sihiyona, kina da tagomashi", "Sihiyona, kina da tagomashi."] },
        { verse: 2, text: ["Dangantaka za ta rushe, Ba aminci ga juna,", "Iyaye sun bar son nasu, Har randa za ka dawo,", "Ba sakewa, kamar ƙaunar Yahweh fa", "Ba sakewa, kamar ƙaunar Yahweh fa."] },
        { verse: 3, text: ["Ko a cikin wahalarka, Zai sa ka zama haske,", "Ba zai daina ƙaunarka ba, Don ya baka daraja,", "Yana tare da kai shi ne haskenka,", "Yana tare da kai shi ne haskenka."] }
      ],
      history: ""
    },
    "HBH379": {
      title: "Hannunka Ya Kawo Mu",
      number: "HBH379",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WEBB",
      meter: "7.6.7.6.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Hannunka ya kawo mu, Wannan rana mai kyau,", "Karɓi dukan godiyarmu, Saurari addu'armu,", "Bari dukan shirinmu, Na yin hidimarka,", "Da zuciya ɗaya ne, Muna ba ka ranmu."] },
        { verse: 2, text: ["Yabonmu don gidanka, Da aka goye mu,", "Don kowane taimako, Da yi da zuciya fa;", "Yanzu a haikalinka, Mun ga ɗaukakarka,", "Don ikon jamalinsa, Banza in ba ka nan."] },
        { verse: 3, text: ["Sa'ad da muka taru, Domin yin sujada,", "Gaskiya ta nuna iko, Addu'a ta hau sama,", "Mai fama da hidima, Nemi mulkin Allah,", "A ƙarfafa duk kowa, Don su san ƙaunarka. AMIN"] }
      ],
      history: ""
    },
    "HBH380": {
      title: "Tushen Ikilisiya",
      number: "HBH380",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AURELA",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tushen ikilisiya shi ne, Yesu Ubangiji,", "Sabuwar halittarSa ce, Ta Ruhu da kalmar;", "Ya zo daga can sama, Don zama angon ta,", "Da jini ya saye ta, Ya mutu dominta."] },
        { verse: 2, text: ["Zaɓaɓɓu cikin duniya, Dukansu ɗaya ne,", "Shaidarta na cetonta, Komai nasu ɗaya,", "Tana albarkace shi, Cikin maganarsa,", "Tana bin bege ɗaya, Cike da alheri."] },
        { verse: 3, text: ["A tsakiyar shan tsanani, Da razanar yaƙi,", "Tana jiran cikar ta, Zuwan salamarSa,", "Har sai darajar Allah, Ta kai ga ganinta,", "Ikilisiyar mai nasara, Za ta sami hutu."] },
        { verse: 4, text: ["A nan tana zumunci, Da Allahnmu mai rai,", "Da zumunci mai tsarki, Waɗanda ke hutu,", "Masu farin ciki ne! Allah ba mu iko,", "Mu zama da halinka, A sama da kai can."] }
      ],
      history: ""
    },
    "HBH381": {
      title: "Ɗaukaka Ki Ake Ta Yi",
      number: "HBH381",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AUSTRIAN HYMN",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ɗaukaka ki ake ta yi, Sihiyona Birnin Allah,", "Wanda kalmarSa ta tsaya, Ya shirya ki dominsa:", "A kan dutse ya kafa ki, Wa za ya jijjiga ki?", "Da ceto an kewaye ki, Nasara fa naki ne."] },
        { verse: 2, text: ["Maɓulɓular ruwa na rai, Daga ƙaunar Allahnmu,", "Za ta shayar da 'ya'yanku, Babu tsoron rashi kuwa,", "Wa zai ki shi a kogin nan, Yana kashe ƙishirwa?", "Alheri kamar Allah fa, ba zai taɓa ƙare ba."] },
        { verse: 3, text: ["Kewaye da wurin zama, Ga girgije da wuta,", "Domin ɗaukaka Allahnmu, Na nuna yana kusa,", "Ɗaukakar ki ake ta yi, Sihiyona Birnin Allah,", "Wanda kalmarSa ta tsaya, Ya shirya ki dominsa. AMIN"] }
      ],
      history: ""
    },
    "HBH382": {
      title: "Ina Son Mulkinka, Allah",
      number: "HBH382",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. THOMAS",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina son mulkinka, Can wurin zamanka,", "Ya ceci ikilisiyarmu, Ta wurin jininsa."] },
        { verse: 2, text: ["Ina son ikilisiyar! Ta kafu gabanka,", "kamar ƙwayar idanunka, Tana kan hannunka."] },
        { verse: 3, text: ["Hawaye dominta, Zan yi mata addu'a,", "In yi ta aiki dominta, Har zuwa ga ƙarshe."] },
        { verse: 4, text: ["Darajar tafiyarta, Fiye da murnata,", "Alkawarina, zan raira, Waƙoƙin yabonta."] },
        { verse: 5, text: ["Gaskiyar ka uba, Za a ba Sihiyona,", "Duniya na cike da murna, Allah a can sama. AMIN"] }
      ],
      history: ""
    },
    "HBH383": {
      title: "Ina Sarakuna Suke",
      number: "HBH383",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. ANNE",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Waƙoƙi a Ikilisiya",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina Sarakuna suke? Na da da na yanzu?", "Ikilisiyarka tana nan, A shekaru dubbai."] },
        { verse: 2, text: ["Muna yin bukin ta a yau, Ta tsaya da ƙarfi,", "Muna jin muryoyi kullum, Waƙa har abada."] },
        { verse: 3, text: ["Daban da mulkin duniya, Ikilisiyarta ke fa!", "Ko wahala ta nufo ta, A nan har da waje."] },
        { verse: 4, text: ["Ga ta tsaye kamar dutse, Ba za ta jijjigu,", "Dutse da zai cika duniya, Gidansa da ya yi. AMIN"] }
      ],
      history: ""
    },
    "HBH384": {
      title: "Wannan Damar Mai Ceto Ya Kawo",
      number: "HBH384",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "McCOMB",
      meter: "8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Wannan damar da Mai fansa, Ya ba mai ba da gaskiya", "Yana bi da ƙafafunmu, Domin mu bi gurbinsa."] },
        { verse: 2, text: ["Zan bi Ubangiji nawa, Zan bar fa dukan komai,", "Ya cece ni maganarsa, Za ta bi da ni kullum."] },
        { verse: 3, text: ["Yesu na miƙa kaina fa, A cikin hannuwan ka,", "Na ƙudurta babu tsoro, Ikonka zai riƙe ni."] },
        { verse: 4, text: ["Da daɗi cikin bin Allah; An nuna shi a fili,", "Ga waɗanda sun bi Kristi, Za a ga darajarSa. AMIN"] }
      ],
      history: ""
    },
    "HBH385": {
      title: "Ruhu Mai Tsarki Sai Ka Zo",
      number: "HBH385",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MARTON",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ruhu Mai Tsarki sai ka zo, Bisa ruwan baftismar nan,", "Koya mana a zuciya, Mu yabi Ɗan ragon Allah."] },
        { verse: 2, text: ["Mun ƙaunace dokokinka, Da murna za mu bi ka fa,", "Mun ƙaunaci cetonka fa, Ɗan rago mai fansarmu ne."] },
        { verse: 3, text: ["Mun nutse a cikin ruwa, Mun gode domin cetonka,", "Mun mutu ga zunubanmu, Tare da kai akwai bege fa."] },
        { verse: 4, text: ["Mun tashi don rayuwa da kai, Ruhun Allah sa Hatimi,", "Aikakke daga can sama, Ba mu farin ciki naka. AMIN"] }
      ],
      history: ""
    },
    "HBH386": {
      title: "Yesu Na Yi Alkawari",
      number: "HBH386",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ANGEL'S STORY",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu na yi alkawari, In bi ka har ƙarshe,", "Yi kusa da ni kullum, Ya Ubangijina.", "Ba na jin tsoron kome, In kana nan da ni", "Ba zan ɓace hanya ba, In kai ka bi da ni."] },
        { verse: 2, text: ["Alkawarinka Yesu, Ga dukan 'ya'yanka,", "A cikin ɗaukakarka, Nan za su kasance,", "Alkawarina, Yesu, In bi ka har ƙarshe,", "Ka ba ni alherinka, Ya Ubangijina."] },
        { verse: 3, text: ["Ka zauna kusa da ni, Duniya ta fi kusa,", "Ga kwa abin sha'awa, Suna kewaye ni,", "Magabta suna kusa, Duk sun kewaye ni", "Ka ja ni kusa Yesu, Tsare ni koyaushe."] },
        { verse: 4, text: ["Bari in ji muryarka, In gane ta sosai,", "Gaba da duk jaraba, Da dukan nufina,", "Sai ka tabbatas mani, Ka bi da hanya ta,", "In ji ka kullayaumi, Tsare ni ko'ina. AMIN"] }
      ],
      history: ""
    },
    "HBH387": {
      title: "Yesu Na Ɗauki Gicciyena",
      number: "HBH387",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ELLESDIE",
      meter: "8.7.8.7. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu, na ɗau gicciyena, Na bar kome na bi ka,", "An yashe ka, an raina ka, Amma kai ne komai na,", "Cire man tunanin wofi, Da burina na duniya,", "Kome yawan arziƙina, Aljanna ne rabona."] },
        { verse: 2, text: ["Ko duniya duka sun ƙi ni, Sun bar bin mai cetona,", "Ayyukansu na ruɗina, Kai ne kaɗai gaskiya,", "Yayin da kana ƙaunata, Allahna mai hikima,", "Abokanai za su bar ni. Nuna mani fuskarka."] },
        { verse: 3, text: ["Mutum zai iya matsa min, Kai za ka ƙaunace ni", "Zan iya fuskanci damuwa, Za ka ba ni hutunka", "Ni fa ba zan raunana ba, In kana tare da ni", "Na rabu da kayan duniya. Don in yi murna da kai."] },
        { verse: 4, text: ["Sami alheri da sauri, Ka yafa bangaskiya", "Rana ta ƙarshe ta yi kusa. Allah za ya bisheka", "Za ka gama aikinka nan, In mun bar duniyan nan", "Bege za ya zama murna, Bangaskiya kuma yabo. AMIN"] }
      ],
      history: ""
    },
    "HBH388": {
      title: "Kai Da Kake Urdun",
      number: "HBH388",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. MICHEL'S",
      meter: "11.11.11.11.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Da tawali'u ka bada kai Urudun,", "Saboda mu ka bada kai ka mutu,", "Ka tashi daga duhu zuwa sama,", "Mulkinka domin ƙaunatattunka ne."] },
        { verse: 2, text: ["Sawayenka muke bi kullum fa,", "An binne mu tare da kai kuma fa,", "Mun tashi cikin kamaninka Kristi,", "Muna haskakawa kowace rana."] },
        { verse: 3, text: ["Ya Yesu, Mai cetonmu, Ubangijinmu,", "Ta wurin juyayinka da alherinka,", "Karɓe mu, fanshe mu, zauna cikinmu,", "Bari Ruhunka ya tsare zuciyarmu."] },
        { verse: 4, text: ["Har sai mun sa rawaninka da shewa,", "Tufafinmu za su yi haske sosai,", "Za mu sadu da tsarkaka a sama,", "Mu shaida yabonka da ɗaukaka. Amin."] }
      ],
      history: ""
    },
    "HBH389": {
      title: "Ranar Farin Ciki",
      number: "HBH389",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HAPPY DAY",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A ranar nan da na tuba, Na karɓi Yesu mai ceto", "Bar zuciata ta yi murna, Ta shaida yawan ƙaunarsa."] },
        { verse: "Korus", text: ["Ranar farin ciki, Yesu ya wanke laifina", "Ya bi da ni in yi tsaro, kulayaumi ina murna", "Ranar farin ciki, Yesu ya wanke laifina."] },
        { verse: 2, text: ["An gama aikin cetona, Ga jininsa ya fanshe ni", "Yanzu na zama bawanka, Har abada ni naka."] },
        { verse: 3, text: ["Yanzu na sami kwanciyar rai, Yanzu ba sauran damuwa,", "Yanzu na sani hanyar rai, Rabon mulkinsa nawa ne."] },
        { verse: 4, text: ["Allah mai yin alkawali, Kullayomi zai bishe ni,", "Har ran da zan bar duniyan nan, Alherinsa zai bi da ni."] }
      ],
      history: ""
    },
    "HBH390": {
      title: "Kai Ka Faɗa, Ya Yesuna",
      number: "HBH390",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GREENVILLE",
      meter: "8.7.8.7.8.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Baftisma",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kai ka faɗa, ya Yesuna, Ɗau gicciye ka bi ni,", "Kalmarka kamar tsawa ce, Ko damuwa ta rufe mu?", "Zan ɗauke shi, Zan ɗauke shi, In bi ka fa da murna."] },
        { verse: 2, text: ["Yayin da wannan kabari, Shaidan kabarin Yesu,", "Ko zan yi musun shaidar nan, In zama kamar bawa,", "A'a zan shiga a'a zan shiga, Yesu ya shiga Urdun."] },
        { verse: 3, text: ["Ka albarkace ni Yesu, Don ƙaunarka gare ni", "Ka ƙara nuna ƙaunarka, Cikin ikonta gun ka", "Abin murna abin murna, Yesu na tare da ni"] },
        { verse: 4, text: ["Zumunci ne zan yi da shi, Bar in rabu da laifi,", "Bari in mori albarka, Ta wurin nasara fa", "Bari in bi, bari in bi, Inda Yesu ya je."] }
      ],
      history: ""
    },
    "HBH391": {
      title: "A Nan Ubangijina",
      number: "HBH391",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PENITENTIA",
      meter: "10.10.10.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A nan Uba, ni, na ga fuskarka,", "Nan zan ga ɓoyayyun abubuwa,", "Nan zan riƙe alherinka kamkam,", "Na danƙa maka duk damuwata."] },
        { verse: 2, text: ["Nan zan ci daga akushin Allah,", "In kuma sha jibi mai daraja,", "In rabu da duk nauyin kayana,", "In ɗanɗana gafaran zunubi."] },
        { verse: 3, text: ["Mu fa tashi, babu alama fa,", "Bukin, ba ƙauna, ba ya fa wuce,", "Ko babu abinci, kai kana nan", "Kai mafakata, a kullayomi."] },
        { verse: 4, text: ["Zumuncin da dama na wucewa", "Wannan kuwa hoton samaniya ne,", "Murna, murna, mara iyaka ce,", "Wannan babban bukin ɗan rago ne. AMIN"] }
      ],
      history: ""
    },
    "HBH392": {
      title: "A Teburin Ka Ubangiji",
      number: "HBH392",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BREAD OF LIFE",
      meter: "6.4.6.4.6.4.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A teburinka fa, Wannan sa'a,", "Bar mu ɗanɗana, Kasancewarka,", "Ƙaunarka na hana, Mu yin laifi,", "Duk sa'ad da muke, A gabanka."] },
        { verse: 2, text: ["Zo ya Yesu Kristi, Ka ciyar da mu,", "Zama jagoranmu, Kullayomi,", "Bar rayuwa ta zama, Da alheri", "Har randa za mu zo, Wurinka can. AMIN"] }
      ],
      history: ""
    },
    "HBH393": {
      title: "Tunawa Da Mai Ceto",
      number: "HBH393",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. PETER",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Don tunawa da ƙaunarsa, Muna cin jibin nan,", "Kowane mai tsarkin zuciya, An marabce shi fa."] },
        { verse: 2, text: ["Gurasa kwatancin jikin, Mun ci gurasar nan", "Koƙo kwatancin jininsa, Domin masu laifi"] },
        { verse: 3, text: ["Muna yabonsa yanzu, Don yawan ƙaunarsa", "Da bangaskiya za mu yi, Bukin a sama can.AMIN."] }
      ],
      history: ""
    },
    "HBH394": {
      title: "Ya Ceton Duniya, Jinkai Ya Zo",
      number: "HBH394",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "EUCHARISTIC HYMN",
      meter: "9.8.9.8.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ceton duniya jinkai ya zo, Ya kawo mana fansarsa", "Ta wurinsa kalmar rai ta zo, Mutuwar sa ta cece mu."] },
        { verse: 2, text: ["Ka dubi zuciyar kumama, Masu zunubi na kuka", "Ka zama mai ciyar da mu fa, Ta wurin alherinka dai. AMIN"] }
      ],
      history: ""
    },
    "HBH395": {
      title: "Gurasar Rai, A Gare Ka Muke Samun Ciyaswa",
      number: "HBH395",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOLLEY",
      meter: "7.7.7.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gurasar rai mai ceto, Ka bada jikinka dai", "Bar zuciyarmu su ƙoshi, Da wannan gurasarka"] },
        { verse: 2, text: ["Jininka ka bada shi, Ta wurin hadayar nan", "Kristi ciwon da ka ji, Shi ke warkas da namu"] },
        { verse: 3, text: ["Kana sabunta mu fa, Ta wurin mutuwarka", "Kristi bari mu zauna, Mu girma a cikinka. Amin."] }
      ],
      history: ""
    },
    "HBH396": {
      title: "Kasance A Teburinmu",
      number: "HBH396",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "UXBRIDGE",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka kasance a Teburinmu; Ya Ubangiji mun roƙa,", "Talikai masu albarka, Begenmu shi ne aljanna. Amin."] }
      ],
      history: ""
    },
    "HBH397": {
      title: "Waƙa Muke Rairawa",
      number: "HBH397",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LABAN",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Waƙa ce muke yi, A Teburin Uba,", "Muna shaida godiyarmu, Mun yi alkawali."] },
        { verse: 2, text: ["Nan mun ga fuskarka, Da kasancewarka,", "Bari jinkan mai cetonmu, Shi bayyana mana."] },
        { verse: 3, text: ["Darajar jininka, Ya kau da zunubi,", "Hanyar da mai ceto ya bi, Mu yi murna da shi."] },
        { verse: 4, text: ["Ta wurin ƙaunarka, Yi zumunci da mu,", "Tun daga nan zuwa sama, Sai mu ji madalla. AMIN"] }
      ],
      history: ""
    },
    "HBH398": {
      title: "Kasance Da Mu, Yayin Da Muna Cin Gurasa",
      number: "HBH398",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DUNDEE",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "IKILISIYA: Jibin Ubangiji",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kasance da mu, mai ceto, Kada ka bar mu dai,", "Mai Ceto kasance da mu, A cikin zuciya."] },
        { verse: 2, text: ["Ka haɗa mu da ƙaunarka, Jiki da jininka,", "Ya gurasa daga sama, Ciyas da Ruhunmu. AMIN."] }
      ],
      history: ""
    },
    "HBH399": {
      title: "Na Bada Raina Dominka",
      number: "HBH399",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "KENOSIS",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ni na ba da raina, Na zub da jinina,", "Don ka sami ceto, Ta wurin mutuwa,", "Na ba da raina dominka, Mene ne ka bayar?", "Na ba da raina dominka, Mene ne ka bayar?"] },
        { verse: 2, text: ["Can gidan Ubana, Cike da ɗaukaka,", "Na bar na zo duniya, Don masu damuwa,", "Na bar su duka dominka, Ko kai ka yi haka?", "Na bar su duka dominka, Ko kai ka yi haka?"] },
        { verse: 3, text: ["Ni na sha wahala, Wadda ba misali ,", "Azabar da na sha, Domin in cece ka,", "Na yi wannan duk dominka, Kai me ka yi mini?", "Na yi wannan duk dominka, Kai me ka yi mini?"] },
        { verse: 4, text: ["Na fa kawo maka, Daga can gidana,", "Ceto nawa kyauta, Gafara da ƙauna,", "Ni na kawo maka kyautai, Mene kai ka bayar?", "Ni na kawo maka kyautai, Mene kai ka bayar? AMIN"] }
      ],
      history: ""
    },
    "HBH400": {
      title: "Wani Abu Dominka",
      number: "HBH400",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SOMETHING FOR JESUS",
      meter: "6.4.6.4.6.6.6.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mai Cetona, kai ka ba ni ƙauna,", "Ba abin da zai raba ni da kai,", "Na yi alkawari, na cika ta a yau,", "Hadaya na kawo, a wurinka,"] },
        { verse: 2, text: ["Can na sami jinkai, roƙa mani,", "Bangaskiyata Yesu, na dubanka,", "Bar in ɗauki gicciye, in shaida ƙaunarka,", "Na yi waƙar yabo, gun ka Yesu,"] },
        { verse: 3, text: ["Bar in yi aminci, kamar naka,", "Kullayomi fa, in iya ganin", "Ayyukan ƙaunarka, da na alherinka,", "Shi nake buƙata, gun ka Yesu."] },
        { verse: 4, text: ["Ni da komai nawa, kyautarka ce,", "Ko cikin daɗi ko wahala ma,", "In na ga fuskarka, murna zan yi sosai,", "Har abada fa, a wurinka Yesu. AMIN."] }
      ],
      history: ""
    },
    "HBH401": {
      title: "Shugabanmu Mai Girma Ga Baikonmu",
      number: "HBH401",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LOVE OFFERING",
      meter: "6.4.6.4.6.6.4.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Shugaba mai girma, ga baikonmu,", "Kamar na Magadalliya, karɓe shi,", "Bar ƙauna ta ƙaru fiye da hadaya,", "A gare ka, Ubangiji, A gare ka, Ubangiji"] },
        { verse: 2, text: ["Kullum rayukanmu ke ƙarfafa,", "Cikin wahaloli da raɗaɗi,", "Cikin alherinka muna yin nasara,", "A gare ka Ubangiji, A gare ka, Ubangiji."] },
        { verse: 3, text: ["Kalmomin ka suna kawo bege,", "Kamar man shafawa ga idanu,", "Cikin rahamar ka, mun dawo kan hanya,", "A gare ka Ubangiji, A gare ka, Ubangiji."] },
        { verse: 4, text: ["Karɓi sujadarmu, a gabanka,", "Ya Allah mai girma, har matuƙa,", "Mu zauna da kai da salama fa,", "A gare ka Ubangiji, A gare ka, Ubangiji. AMIN"] }
      ],
      history: ""
    },
    "HBH402": {
      title: "Mun Baka Naka Duk",
      number: "HBH402",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. ANDREW",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mun baka naka duk, Kowace baiwa ce,", "Dukan kayan mu naka ne, Mun dogara ga kai."] },
        { verse: 2, text: ["Bari mu wakilci, Mu sami albarku", "Da murna don albarkanka, Mun zo da godiyarmu"] },
        { verse: 3, text: ["A saki ɗaurarru, A kawo su gunka,", "Don samin rai da salama, A gun Yesu Kristi."] },
        { verse: 4, text: ["Mun gaskanta kalmarka, Duk da shakkarmu fa,", "Dukan abin da muke yi, Muna yi gare ka. AMIN."] }
      ],
      history: ""
    },
    "HBH403": {
      title: "Kome Duk Naka Ne",
      number: "HBH403",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GERMANY",
      meter: "L.M",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Yesu komi naka ne, Ba mu zo da kome ba fa", "Sai dai zuciyar godiya, Mun kawo su a gabanka"] },
        { verse: 2, text: ["Nufinka na zuciyarmu, Hannunka ne ke bishe mu,", "Ta wajen izawarka ne, Shirin ka ke aikatuwa"] },
        { verse: 3, text: ["Cikin buƙatu mun kira, Gare ka kai mai runduna,", "Ɗaukaka taka tamu ce; Farin cikinka namu ne."] },
        { verse: 4, text: ["Ya Uba albarkace mu, Ka cika mu da ƙaunarka.", "Ka bishe mu Ubangiji, Domin fa mu zo gare ka. AMIN"] }
      ],
      history: ""
    },
    "HBH404": {
      title: "Gwada Ni Ya Ubangiji",
      number: "HBH404",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GIVING",
      meter: "10.9.10.10. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Wakilci",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kawo dukan zaka cikin ma'aji,", "Dukan kuɗi, lokaci, ƙauna,", "Ka zuba su a bisa bagadi,", "Mai Ceto zai ce na ji daɗinka."] },
        { verse: "Korus", text: ["Gwada ni in ji Ubangiji,", "Albarka fa mara iyaka, mara iyaka,", "Zan zuba a bisanka."] },
        { verse: 2, text: ["In bangaskiyata babu ƙarfi,", "In hannunsa bai bi da ni ba,", "Cikin ƙauna da jinkai mai yawa,", "Cikin Maganarsa ya ce mini."] },
        { verse: 3, text: ["Na miƙa rayuwata gare shi,", "Yadda nake yadda zan zama,", "Ba abin da zai raba ni da shi,", "Sa'ad da ya ce ɗana ka ji fa."] }
      ],
      history: ""
    },
    "HBH405": {
      title: "Ko Ni Sojan Gicciye Ne",
      number: "HBH405",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ARLING ON",
      meter: "C.M. 8.6.8.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ko ni sojan gicciye ne, Mabiyin Ɗan rago,", "Ko zan ji tsoron raɗaɗi, Ko kunyan sunansa?"] },
        { verse: 2, text: ["Ko Yesu za ya fyauce ni, Ya kai ni wurinsa", "Wasu na faman bishara, Da sadaukar da rai?"] },
        { verse: 3, text: ["Ko zan fuskanci magabta, Ko ba zan jimre ba", "Ko zan bi sha'awar duniya ,Ta kai ni gun Allah?"] },
        { verse: 4, text: ["Zan yi ta yin gwagwarmaya, Uba ƙarfafa ni", "In iya jimre wahala, Ta wurin kalmarka. AMIN"] }
      ],
      history: ""
    },
    "HBH406": {
      title: "Yakin Kirki",
      number: "HBH406",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PENTECOST",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yi yaƙi fa da aniya, Kristi ne ƙarfi da 'yanci", "Damƙa masa dukan ranka, Zai ba ka kambin nasara"] },
        { verse: 2, text: ["Ka nemi alherin Allah, Daga ido ka dube shi", "Akwai rai cikin hanyarsa, Yesu ne hanyar ladar mu."] },
        { verse: 3, text: ["Damƙa masa duk damuwarka, Buƙatunka zai tanada", "Gaskanta shi, don shi ne rai, Kristi ne bege da ƙauna."] },
        { verse: 4, text: ["Hannuwansa na nan kusa, Bar jin tsoro yana kusa,", "Gaskanta shi za ka gane, Yesu ne kome da kome.", "AMIN"] }
      ],
      history: ""
    },
    "HBH407": {
      title: "Yi Biyayya Ga Kristi",
      number: "HBH407",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LAMDIN",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Daga ko'ina fa ana ta jin kira,", "Yi biyayya biyayya ga Yesu Kristi,", "Ga muryar waƙoƙi ana ji ko'ina,", "Na biyayya, biyayya, I, ga Yesu Kristi."] },
        { verse: "Korus", text: ["Zuwa ga nasara! Zuwa ga nasara!", "In ji babban kwamanda,", "Umarninsa zan bi, za mu gaji ƙasar,", "Ta biyayya, biyayya, I, ga Yesu Kristi."] },
        { verse: 2, text: ["Jarumai duk ku ji, ƙarar ƙahonsa fa,", "Yi biyayya, biyayya, ga Yesu Kristi,", "Tashi gabagaɗi, shaida kalmar ceto,", "Ta biyayya, biyayya, I ga Yesu Kristi."] },
        { verse: 3, text: ["Mun ba da ƙarfinmu ga Yesunmu a yau,", "Don biyayya, biyayya ga Yesu Kristi,", "Za mu shaida Yesu a cikin duniya,", "Da biyayya, biyayya, I ga Yesu Kristi."] }
      ],
      history: ""
    },
    "HBH408": {
      title: "Tutar Nasar",
      number: "HBH408",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ROYAL BANNER",
      meter: "11. 7.11.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Akwai tuta mai daraja domin mu,", "Dukan sojojin Yesu", "Mun tada ita yau da zuciya ɗaya,", "Muna farin ciki yau."] },
        { verse: "Korus", text: ["Ci gaba ci gaba, Don nasara ta Yesu ce", "Mu girmama shi da waƙa, Ƙaƙashin tutar Yesu."] },
        { verse: 2, text: ["Kodayake magabta sun yi yawa,", "Sai mu dage da gaske,", "Mu sojojin Yesu, kar mu ja baya,", "Don mu sha kunya."] },
        { verse: 3, text: ["Da waƙoƙin yabo, da murna sosai,", "Za mu yi nasara kan Shaiɗan,", "A ƙarshe Ubangiji mai cetonmu,", "Za ya ba kowa rawaninsa."] }
      ],
      history: ""
    },
    "HBH409": {
      title: "Mulkinsa Na Zuwa",
      number: "HBH409",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "THE KINGDOM IS COMING",
      meter: "6.6.8.6.6.8. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Daga mazauni, al'umman duniya,", "Duba duhu yana shuɗewa,", "Ga kira na ceto ga duk al'ummai,", "Ce zo ka taimake mu yau."] },
        { verse: "Korus", text: ["Mulkinsa na zuwa, ka ba da labari,", "Za mu ɗaga tutar Allahnmu,", "Duniya za ta cika da ɗaukakarsa,", "Kamar ruwan teku take fa."] },
        { verse: 2, text: ["Haske na haskakawa kan sojojin,", "Don su yi nasara kan Shaiɗan,", "Ubangijinsu zai albarkace su,", "Darajarsa jagoran su."] },
        { verse: 3, text: ["Dukan wurare, inda akwai mutum,", "Shaida labarin Yesu,", "Labari mai girma na Yesu Kristi,", "Labarin Yesu Kristi."] },
        { verse: 4, text: ["Sa'adda ɗaukakar Yesu ta zo kusa,", "Ta fa kusato ƙwarai,", "Magabta duk za su watse gabansa,", "Duk duniya ta shaida shi."] }
      ],
      history: ""
    },
    "HBH410": {
      title: "Zuciyar Gaskiya, Da Bangaskiya",
      number: "HBH410",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GERTRUDE",
      meter: "11. 10. 11. 10 with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zuciyar gaskiya, da bangaskiya,", "Uba, alherinka zai bi da mu,", "Ƙarƙashin dukan shiri na mulkinka,", "Za mu yi gwagwarmaya dominka."] },
        { verse: "Korus", text: ["Raira nufinsa! Banda yin shiru,", "Waƙa ta ruhunmu cikin murna,", "Raira nufinsa, cikin aminci,", "Uba, alherinka zai bi da mu."] },
        { verse: 2, text: ["Zuciyar gaskiya, cikakken yarda,", "Daga yanzu mun ba ka duk ranmu,", "Za mu yi maka biyayya da ƙauna,", "Za mu yi shi cikin farin ciki."] },
        { verse: 3, text: ["Zuciyar gaskiya, Ya maɗaukaki,", "Karɓi ikonka ka yi mulki nan,", "Bisa tunaninmu cikin nasara,", "Mu miƙa kanmu cikin gaskiya."] }
      ],
      history: ""
    },
    "HBH411": {
      title: "Ka Tsaya Da Karfin Zuciya",
      number: "HBH411",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "COURAGE",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka tsaya da ƙarfin zuciya,", "Allah na nan da kai,", "Yaƙin zunubi, ka dage fa,", "Shi ne kyaftin, kar ka ji tsoro."] },
        { verse: "Korus", text: ["Yi yaƙin kirki banda tsoro,", "Yesu ne kyaftin zai cece ka."] },
        { verse: 2, text: ["Ka tsaya da ƙarfin zuciya,", "Allah Uba yana lura da kai", "Shi ya san dukan damuwarka,", "Kira gare shi, don alherinsa."] },
        { verse: 3, text: ["Ka tsaya da ƙarfin zuciya,", "Allah ya baka ƙarfi na ƙwazo,", "Yi ƙoƙarin taimakon wasu,", "Taimaki waɗanda suka kasa."] }
      ],
      history: ""
    },
    "HBH412": {
      title: "Mu 'Yan Yakin Yesu Ne",
      number: "HBH412",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. GERTRUDE",
      meter: "6.5.6.5. D. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu 'yan yaƙin Yesu ne, Gaba muke yi,", "Shaiɗan ya amsa da mun, Yi bautarsa,", "Mutuwar Almasihu, Fansarmu ta yi,", "Mu yanzu, nan gaba, Bin sa za mu yi."] },
        { verse: "Korus", text: ["Yaƙin Almasihu 'yan'uwa muke yi,", "Ya shige abanmu, bin sa muke yi."] },
        { verse: 2, text: ["Sarakunan duniya, Duk da ikonsu,", "Sukan zo su wuce, Ba su tsayawa,", "Jama'ar Almasihu, Ta tabbata nan,", "Ikon Shaiɗan ba, Su yi nasara."] },
        { verse: 3, text: ["Inda muke bi yanzu, Sawun mutanen da,", "Su sun fara shiga, Ciki hutunsu,", "Mu da su ɗaya ne, Duk jama'arsa,", "Ƙaunarmu da sanin mu, Duk da nasu ɗaya."] },
        { verse: 4, text: ["Gaba dai jama'a, Shiga mulkin nan,", "Tada muryoyinku, Cikin yabonsa,", "Ɗaukaka ga Allah, Ɗaukaka Yesu,", "Yi yabon sunan, Yesu ba iyaka. AMIN"] }
      ],
      history: ""
    },
    "HBH413": {
      title: "Wane Ne Na Allah?",
      number: "HBH413",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ARMAGEDDDON",
      meter: "6.5.6.5.6.5.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Wane ne na Allah, zai bauta masa", "Wa zai taimake shi, kawo rayuka?", "Wa zai bar bin duniya, wa zai sha wuya?", "Wane ne na Allah! Wa zai je don shi?", "Ta wurin kiran ka da alherinka,", "Mu na Yesu ne fa mu ne bayinka."] },
        { verse: 2, text: ["Komai zafin yaƙi, da masun gaba", "Mayaƙa na Yesu ke da nasara", "Cikin bangaskiya akwai nasara,", "Gaskiyarsa na nan, ta hatimce mu,", "Da murna mu bi shi, don alherinsa,", "Mu na Yesu ne fa mu ne bayinsa."] },
        { verse: 3, text: ["Zaɓaɓɓun sojoji, a bakuwar ƙasa,", "Su amintatu ne, a rundunarsa,", "Cikin bautar sarkin kar mu yi sanyi", "Mu zama masu biyayya da gaskiya,", "Uba zai tsare mu, da alherinsa,", "Kullum za mu bi shi, mu ne bayinsa."] }
      ],
      history: ""
    },
    "HBH414": {
      title: "Yesu Yana Dagar Yaki",
      number: "HBH414",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ALL SAINTS, NEW",
      meter: "C. M. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu yana dagar yaƙi, Domin sarautarsa", "Ga jininsa zube a can, Wane ne zai bi shi?", "Sai wanda ya bada kansa, Domin yin nasara", "Ya ɗauki gicciyensa fa, Ya bi shi ko'ina"] },
        { verse: 2, text: ["Wanda ya bada ransa fa, A cikin mutuwa", "Zai ga Yesu ya ce masa, Ka cece ni yanzu,", "Cikin dukan wahalarsa, Za ya sami ceto", "Yesu na masu addu'a, Wane ne zai bi shi?"] },
        { verse: 3, text: ["Mayaƙa maza da yara, Mata da 'yan mata", "Suna murna a kursiyinsa, Da fararen kaya", "Sun hau zuwa cikin sama, Ta wurin wahala", "Allah ba mu alherinka, Mu bi ka ko'ina."] }
      ],
      history: ""
    },
    "HBH415": {
      title: "Mu Tashi Tsaye Dukanmu",
      number: "HBH415",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WEBB",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu tashi tsaye dukanmu, 'Yan yaƙin gicciye,", "Mu ta da tutar Yesu, Ba za mu kasa ba", "Mu 'yan yaƙin gicciye, Zai ba mu nasara,", "Har mu kau da magabta, Da ikon Yesunmu."] },
        { verse: 2, text: ["Mu tashi tsaye duka, Biyayya za mu yi,", "Ga Yesu shugabanmu, A cikin yaƙinsa,", "Ku mazaje ku tashi, Ku yi da ƙarfinku,", "Ba damar jin tsoro fa, Ba damar ragwanci."] },
        { verse: 3, text: ["Mu tashi tsaye duka, I cikin ikonsa,", "A cikin ikon kanmu, Ba za mu iya ba,", "Mu tafi da bishara, Mu yi ta yin addu'a,", "Ta wurin bangaskiya, Za mu ci nasara. AMIN"] }
      ],
      history: ""
    },
    "HBH416": {
      title: "Sojojin Yesu Ku Tashi",
      number: "HBH416",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DIADEMATA",
      meter: "S.M.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sojojin Yesu tashi, Yafa makamanku,", "Yi ƙarfi cikin ƙarfinsa, Ta wurin shi Ɗansa,", "Ka tsaya da ƙarfi, A cikin ikonsa,", "Duk wanda ya bada gaskiya, Mai nasara ne shi."] },
        { verse: 2, text: ["Tsaya Da ikonsa, Shi za ya bi da kai,", "Zai baka, ƙarfin yin yaƙi, Ƙarfi ba iyaka", "Zai ba ka nasara, Cikin dukan komai", "Cikin sunan Yesu Kristi, Za ka ci nasara."] },
        { verse: 3, text: ["Ka tsaya da ƙarfi, Yi addu'a ƙwarai", "Taka duk ikokin duhu, Domin yin nasara,", "Bar Ruhu ya kira, Sojojinsa su zo,", "Har Yesu Ubangijinmu, Zai kai mu gidansa."] }
      ],
      history: ""
    },
    "HBH417": {
      title: "Gaba Dai Ya Sarkinmu",
      number: "HBH417",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LANCASHIRE",
      meter: "7.6.7.6.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gaba dai ya sarkinmu, Ranar Yaƙi ta zo", "Cikin dukan yaƙinmu, Kai ne mafakarmu", "Kai ne ƙarfinmu cikin, Kwanakin shirin nan,", "Yanzu fa ya sarkinmu, Mun ta da muryarmu."] },
        { verse: 2, text: ["Gaba dai ya sarkinmu, Sai mun ci nasara ,", "Har tsarki ya bayyana, Mu same salama,", "Ba ta ikon jiki ba, Amma ta ruhaniya", "Mu yi shi cikin ƙauna, Mulkin Allah na zuwa"] },
        { verse: 3, text: ["Gaba dai ya sarkinmu, Muna bi ba tsoro,", "Za mu ga fuskarka, Cikin sabuwar murna,", "Gicciyenka tsare mu, Cikin haske muke,", "Gaba dai ya sarkinmu, Mu sami rawani."] }
      ],
      history: ""
    },
    "HBH418": {
      title: "Ga Kowane Mutum Da Al'umma",
      number: "HBH418",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AUSTRAIN HYMN",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zuwa ga jama'a duka, Loton zaɓi yana zuwa", "Cikin gwagwarmayar gaskiya, Da daɗi ko ba daɗi", "Imani ba ja da baya. Zai kai mu ga nasara", "Sai ka yi shawara mai kyau. Da daɗi ko ba daɗi."] },
        { verse: 2, text: ["Bin gaskiya yana da kyau, Sa'ada an bayyana ta", "Tana haifar da amfani, Akwai kuwa wadataswa,", "Jarumi kuwa zai tsaya, Mai tsaro kwa zai kasa", "Har taron jama'a su shaida, Gaskiya da sun musunta."] },
        { verse: 3, text: ["Mugunta ta yawaita, Duk da haka gaskiya ta fi", "Kodayake akwai daɗi, Kuma yana ruɗaswa.", "Zai ɓata rayuwar gobe, Wadda ba a sani ba.", "Allah da ba a ganinsa, Yana lura da nasa. AMIN"] }
      ],
      history: ""
    },
    "HBH419": {
      title: "Mu Tashi Tsaye Dukanmu",
      number: "HBH419",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GEIBEL",
      meter: "7.6.7.6.D. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu tashi tsaye dukanmu, 'Yan yaƙin gicciye", "Mu ta da tutar Yesu, Ba za mu kasa ba,", "Mu 'yan yaƙin gicciye, Zai ba mu nasara", "Har mu kau da magabta, Da ikon Yesunmu"] },
        { verse: "Korus", text: ["Tashi tsaye sojojin Yesu,", "Masu yaƙinsa ku ta da tuta,", "Ku ta da ta sama,"] },
        { verse: 2, text: ["Mu tashi tsaye duka, Biyayya za mu yi", "Ga Yesu shugabanmu, A cikin yaƙinsa", "Ku mazaje ku tashi, Ku yi da ƙarfinku,", "Ba damar jin tsoro fa, Ba damar ragwanci."] },
        { verse: 3, text: ["Mu tashi tsaye duka, I cikin ikonsa", "A cikin ikon kanmu, Ba za mu iya ba", "Mu tafi da bishara, Mu yi ta yin addu'a", "Ta wurin bangaskiya Za mu ci nasara."] },
        { verse: 4, text: ["Mu tashi tsaye duka, I cikin ikonsa,", "A cikin ikon kanmu, Ba za mu iya ba,", "Mu tafi da bishara mu, Yi ta yin addu'a,", "Ta wurin bangaskiya, Za mu yi nasara."] }
      ],
      history: ""
    },
    "HBH420": {
      title: "Ya Raina Yi Tsaro",
      number: "HBH420",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LABAN",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya raina yi tsaro, Ga abokan gaba", "Sun zo da dukan ƙarfinsu, Su sa ka tuntuɓe."] },
        { verse: 2, text: ["Yi tsaro da addu'a, Kada ka karaya,", "Sabunta dukan ƙarfinka, Nemi taimakonsa."] },
        { verse: 3, text: ["Kada don nasara, Ka bar kayan yaƙi,", "Aikinka bai ƙare ba fa, Sai ka sami lada."] },
        { verse: 4, text: ["Yi yaƙi ya raina, Har ranar mutuwa,", "Ran da ka sadu da Allah, Za ya marabce ka. AMIN"] }
      ],
      history: ""
    },
    "HBH421": {
      title: "Muna Zama, Muna Raye",
      number: "HBH421",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AUSTRIAN HYMN",
      meter: "8.7.8.7. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muna zama muna raye, Cikin mugun lokaci", "A cikin wannan zamani, Mutane na son girma", "Al'ummai suna tasowa, Don su nakasar da mu", "Wannan ne kukan halitta, Domin rata gobe."] },
        { verse: 2, text: ["Ma yi wasa? Za mu raina, Yaƙin da muke ta yi?", "Yaƙi ne na Ubangiji, Zo kai ma ka sa hannu,", "Sama na duban yaƙin nan, Lokacin ka kaɗan ne,", "Gicciyensa ya bayyana, Bisa dukan gaskiya."] },
        { verse: 3, text: ["Mun rantse, ba ja da baya, An maya haifuwarmu,", "Don zama sojojin Yesu, A gaba fa masu bi!", "Bar ruhun da ke cikinka, Ya yi shela ko'ina,", "Bari dukan masu rai fa, Su shaida ka ko'ina AMIN"] }
      ],
      history: ""
    },
    "HBH422": {
      title: "Ci Gaba, Ku Jimre, Kamar Jaruman Da!",
      number: "HBH422",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ARTHUR'S SEAT",
      meter: "6. 6. 6. 6. 8. 8.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ci gaba, ku jimre, Kamar jaruman da!", "Da sun tsaya daram, Bisa tsantsan gaskiya,", "Sun sha tsanani mai yawa, Amma fa ka ɗaukaka su."] },
        { verse: 2, text: ["Mu 'ya'yan Uba ne, Shi ya koya mana,", "Kada mu ji tsoro, Zai yi mana yaƙi,", "Jaruman yaƙi, kada fa, A ruɗe mu mu bar Kristi."] },
        { verse: 3, text: ["Ci gaba, ku jimre, Komai jaraba fa.", "Mu guji zunubi, Mu tsaya da ƙarfi,", "Cikin wahalarmu Yesu, Riƙe mu fa da hannunka."] },
        { verse: 4, text: ["Bada daɗewa ba, Yaƙi ya ƙare.", "Za mu yi nasara, Muna murna kullum,", "Duba, ga rawaninmu nan, Ci gaba, kullum ku jimre."] }
      ],
      history: ""
    },
    "HBH423": {
      title: "Tashi Ku Matasa",
      number: "HBH423",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LEAVELL",
      meter: "S.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Yaƙi Na Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tashi ku matasa, Ku bada himma fa", "Ku bada zuciya da ƙarfi, Ku bauta wa Allah"] },
        { verse: "Korus", text: ["Tashi Tashi, Yesu na kiranku", "Tashi tashi ya matasa, Zuwa ga nasara"] },
        { verse: 2, text: ["Tashi ku matasa, Mulkinsa ba iyaka", "Bar Ruhunku shi zama ɗaya, Ku kau da mugunta"] },
        { verse: 3, text: ["Tashi ku matasa, Ikilisiya na sonku", "Ku ne ƙarfinta fa ku ji, Tashi ku yi himma"] },
        { verse: 4, text: ["Ku ɗau gicciyen Kristi, Ku je inda ya je", "Ku zama da biyayya fa, Tashi, ku matasa."] }
      ],
      history: ""
    },
    "HBH424": {
      title: "Tashi Mu Kama Aiki",
      number: "HBH424",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WORK SONG",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tashi mu kama aiki, Aikin Ubangiji", "Hatsi ya isa girbi, Zo dai mu yi ta yi", "Aiki kowace sa'a, Tun da hasken rana", "Bari mu tara hatsi, Kar ya lalace."] },
        { verse: 2, text: ["Tashi mu kama aiki, Komai zafin rana", "More kowace sa'a, Kafin hutawa fa,", "More duk zarafinka, Don kawo rayuka", "Yi aiki tun da dama, Cikin lokaci."] },
        { verse: 3, text: ["Tashi mu kama aiki, Tun muna duniya,", "Tun muna ganin haske, Duhu na zuwa fa,", "Aiki har faɗuwar rana har, Ba sauran haske,", "Aiki tun kafin duhu, Aiki zai ƙare."] }
      ],
      history: ""
    },
    "HBH425": {
      title: "Zan Tafi Inda Kake So",
      number: "HBH425",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MANCHESTER",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ba lallai sai bisan tsauni ba,", "Ko kan haɗarin Teku", "Ba lallai a dagar yaƙi ba,", "Uba zai buƙace ni,", "Ko cikin raɗa ya kira ni,", "Inda ban sani ba,", "Ni zan amsa maka da duk raina,", "Zan je duk inda kake so."] },
        { verse: "Korus", text: ["Zan je inda ka ce in je Uba,", "Ko tsauni, fili, Teku,", "Zan faɗi abin da ka ce Uba,", "Zan je inda ka ce in je."] },
        { verse: 2, text: ["Ƙila akwai kalmomin ƙauna,", "Yesu zai so in shaida,", "Akwai masu aika zunubi,", "Batattu da zan nemo,", "In za ka zama jagora na,", "Komai gargadar hanya,", "Muryata za ta shaida ƙaunarka.", "Zan faɗi abin da ka so."] },
        { verse: 3, text: ["Haƙiƙa girbi da yawa,", "Da zan yi a duniya", "Tun kafin lokaci ya ƙure,", "Domin Yesu gicciyayye,", "Don haka na ba ka zuciata,", "Kai ne mai ƙaunata,", "Zan yi nufinka da zuciya ɗaya,", "Zan kuwa aikata nufinka."] }
      ],
      history: ""
    },
    "HBH426": {
      title: "Bari In Yi Tafiya Da Kai Uba",
      number: "HBH426",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MARTYON",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bari in yi tafiya da kai, In yi bauta koyaushe,", "Uba gaya min nufinka, In jimre dukan wahala."] },
        { verse: 2, text: ["Taimake ni yin haƙuri, Da kalmominka na ƙauna,", "Tsayar da ni kan hanyarka, Har in iya kai su gunka."] },
        { verse: 3, text: ["Koya mani haƙurinka, In yi tafiya tare da kai,", "A aiki mai kawo murna, Muna nasara da mugu."] },
        { verse: 4, text: ["Tare da bege rayuwar, Gobe za ta yi kyau sosai", "Kai ne mai bada salama, Bari in yi tafiya da kai. Amin"] }
      ],
      history: ""
    },
    "HBH427": {
      title: "Ubangiji Ya Zo",
      number: "HBH427",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ASG GROVE",
      meter: "12.11.12.11.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubangiji ya zo, ya kira mu bi shi,", "Can bisan tuddai, da cikin kwari ma,", "Hanyar nan ta bi da mu cikin duk rana", "Ubangiji ya kira mu 'ya'yansa,", "Dukan su masu zuwa kusa da shi fa,", "Ga mu 'ya'yansa muna ƙaunarsa fa,", "Muna fa marmarin zuwa kusa da shi.", "Mu huta cikin ƙasa mai daraja."] },
        { verse: 2, text: ["Ubangiji ya kira mu duk 'ya'yansa,", "Kodashike hanyar ba ta da sauƙi,", "Amma Allahnmu za ya bi tare da mu,", "Mu bi mai ceto babu juya baya,", "Shi ne ya kira mu ko ma da jaraba.", "Za mu yi murna da waƙoƙin yabo,", "Mu dage cikin wahala da damuwa,", "'Ya'yan Sihiyona su bi sarkinsu."] },
        { verse: 3, text: ["Ubangiji ya kira mu tun da safe,", "Da ruhu kamar raɓa a bisanmu,", "Mun juyo daga sha'awar duniyar nan,", "Don mu je tare da mutanen Allah,", "Ubangiji ya kira 'ya'yansa duka,", "Mu roƙi albarku da ƙaunarsa fa,", "Za ya bi da mu zuwa wurin makiyaya,", "Mai armashi a ƙarshe can gidansa."] }
      ],
      history: ""
    },
    "HBH428": {
      title: "Ko Yesu Zai Ɗauki Gicciye Shi Kaɗai",
      number: "HBH428",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MAITLAND",
      meter: "C.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ko Yesu zai ɗauki gicciye, Don ceton duniya duk?", "Akwai gicciye ga kowa, Gicciye domina."] },
        { verse: 2, text: ["Tsarkaku da ke a sama, Sun sha wuya a nan!", "Yanzu sun ɗanɗana ƙauna, Da murna ba kuka."] },
        { verse: 3, text: ["Zan ɗauki gicciye mai Tsarki, Har ran da zan mutu,", "In je gida in sa kambin, Rawani domina. AMIN"] }
      ],
      history: ""
    },
    "HBH429": {
      title: "Muryar Makiyayi Ce",
      number: "HBH429",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SHEPHERD",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muryar makiyayi ne fa, Can cikin jeji nake ji,", "Kira tumaki ɓatattu, Nesa da garke sun watse."] },
        { verse: "Korus", text: ["Zo da su, zo da su, Zo da su wurin cetonsu,", "Zo da su, zo da su, Zo da su wurin Yesu."] },
        { verse: 2, text: ["Wa za ya taimaki Yesu? Taimake shi da samun su", "Wa za ya kawo ɓatattu? Wurin da za a cece su."] },
        { verse: 3, text: ["Suna ta kuka can jeji, Inda fa babu taimako,", "Umurnin Yesu kake ji, 'Je ka nemi tumakina'."] }
      ],
      history: ""
    },
    "HBH430": {
      title: "Ko Zan Tafi Da Hannu Wofi",
      number: "HBH430",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PROVIDENCE",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ko zan tafi da hannu wofi, Wurin Ubangijina,", "Ba mai tuba da zan kawo, Ran da na ga fuskarsa."] },
        { verse: "Korus", text: ["Ko zan tafi da hannu wofi, Wurin Ubangijina,", "Babu kowa da zan kawo, Lailai kunya ce zan ji."] },
        { verse: 2, text: ["Babu sauran tsoron mutuwa, Domin ina da ceto", "Amma zuwa hannu wofi, Ni mai bi fa me zan yi."] },
        { verse: 3, text: ["Shekaru na ta wucewa, Babu shaidar aikina", "Zan ba Yesu rayuwata, Ni zan aika nufinsa."] },
        { verse: 4, text: ["Tsarkaka mu kama aiki, Tun da sauran lokaci,", "Kar mutuwa ta sace mu, Shiga neman ɓatattu."] }
      ],
      history: ""
    },
    "HBH431": {
      title: "Ka Sa In Zama Da Albarka",
      number: "HBH431",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SCHULER",
      meter: "10.7.10.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A cikin rayuwar duniyan nan,", "Da yawa na wahala", "Mu kai haske inda babu haske,", "Sa mai ɓacin rai murna."] },
        { verse: "Korus", text: ["Bari in zama tushen albarka,", "A rayuwata a ga Yesu", "Bari in zama ina roƙo fa,", "In zama da amfani ga wani"] },
        { verse: 2, text: ["Shaida labarin ƙaunar Yesu yau,", "Mai ikon gafartawa", "Wasu za su gaskanta da shi yau,", "Ta wurin tafiyarka."] },
        { verse: 3, text: ["Bayar kamar yadda shi ya ba ka,", "Ka nuna ƙauna kamarsa,", "Ka zama mai taimako ga wasu,", "Ka zama mai gaskiya."] }
      ],
      history: ""
    },
    "HBH432": {
      title: "Ribato Rayuka",
      number: "HBH432",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HARVEST",
      meter: "12.11.12.11. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Damuna ta faɗi, ana ta yin ruwa,", "Daidai shukar iri, ƙasa ta yi kyau,", "Sai mu yi wa Yesu shukarsa a gona,", "Cikin farin ciki za mu yi girbi."] },
        { verse: "Korus", text: ["Farar zuciya, farar zuciya", "Lalle za mu samu in kaka ta yi,", "Manyan dammuna, manyan dammuna,", "Lalle za mu samu in kaka ta yi,"] },
        { verse: 2, text: ["Ko da rashin ruwa, ko da wani abu", "Wanda ya yiwu ya ɓata mana rai,", "Sai mu dinga noma, muna roƙon Allah,", "Kwana tashi, sai hatsi ya fid da kai."] },
        { verse: 3, text: ["“Sai ku yi add'a”, in ji Almasihu,", "“Sai ku roƙi wanda girbin nasa ne,", "Masu iya aikin girbi sai ya aiko", "Zuwa gonar hatsi, domin ya nuna”."] }
      ],
      history: ""
    },
    "HBH433": {
      title: "Hidimar Sarkina",
      number: "HBH433",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CASSEL",
      meter: "12.12.12.18. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ni baƙo ne a nan, a baƙowar ƙasa,", "Gidana da nesa gida mai daraja,", "Ni manzon Yesu, na zo daga sama,", "Na zo don saƙon sarkina."] },
        { verse: "Korus", text: ["Wannan shi ne, saƙo da na,", "Kawo daga Yesunmu,", "Ku riƙa gafarta,", "Ma junan ku kullum,", "Ina nan don aikin Allah."] },
        { verse: 2, text: ["Wannan ne umurnin, Na Allah gare mu,", "Mu tuba mu juyo daga zunubanmu,", "Mai yin biyayya fa zai rayu a can da shi", "Wannan shi ne fa aikana."] },
        { verse: 3, text: ["Gidana can sama, yana da daraja,", "Raina har abada, murna ba ƙarewa,", "Yesu ya nuna min rayuwa can sama,", "Wannan shi ne fa aikana."] }
      ],
      history: ""
    },
    "HBH434": {
      title: "Yabe Shi Da Murna",
      number: "HBH434",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LEE",
      meter: "6.5.6.5.6.5.6.4. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yabe shi da murna, Cikin aikinmu,", "Sai mu zo gabansa, Muna rairawa,", "Gare shi Allahnmu, Mu fa ƙudurta", "Mu yi masa sujada, Ta gaske."] },
        { verse: "Korus", text: ["Yabe shi da murna, Tare da rairawa", "Ga shi Allahnmu, sai mu yabe shi,", "Domin jinkansa, ayyukan mamaki,", "Don haka mu yabe shi da murna."] },
        { verse: 2, text: ["Yabe shi da murna, Mu gode masa,", "Saboda jinkansa, Da duk ƙaunarsa,", "Da ma albarkunsa, Bata canzuwa", "Za mu bauta masa, Da rairawa."] },
        { verse: 3, text: ["Yabe shi da murna, Taken mu kenan", "Muna tafiya tare, Cikin ƙaunarsa", "Muna ta sauraron, Dan murya tasa,", "Wannan muryar, Tasa mai daraja."] }
      ],
      history: ""
    },
    "HBH435": {
      title: "Yi Aiki",
      number: "HBH435",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "TOILING ON",
      meter: "12.12.12.12. with refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yi aiki! Yi aiki! Mu barorin Allah,", "Sai mu bi sawun Yesu Ubangijinmu,", "Da shawararsa za mu sami ƙarfi kuwa,", "Sai mu yi aiki da dukan ƙarfin kuwa."] },
        { verse: "Korus", text: ["Yi fama, Yi fama, Yi fama, Yi fama,", "Yi bege, yi tsaro, yi aiki, Har Yesu ya zo", "Har Yesu ya zo"] },
        { verse: 2, text: ["Yi aiki! Yi aiki! Ciyar da masu yunwa,", "Gajiyayyu a kai su maɓulɓulan rai,", "A gicciye ne tutar darajarmu take,", "Cikin shaida Labarin “Ceto kyauta ce!”"] },
        { verse: 3, text: ["Yi aiki! Yi aiki! Kowa na da aiki,", "Gama mulkin duhu na shaiɗan zai rushe,", "Za a ɗaukaka sunan Ubangijinmu,", "Da murya za a shaida “Ceto kyauta ce!”"] },
        { verse: 4, text: ["Yi aiki! Yi aiki! Cikin ƙarfin Allah,", "Riga da rawani su ne fa ladarmu,", "Gida na amintattu shi ne fa gidanmu,", "Da fansassu za mu ce “Ceto kyauta ce!”"] }
      ],
      history: ""
    },
    "HBH436": {
      title: "Na Gamsu Da Yesu",
      number: "HBH436",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ROUTH",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ai ni na gamsu da Yesu, Ya biya duk buƙatuna,", "Wahalarsa ta fanshe ni, Na tsira ta mutuwarsa."] },
        { verse: "Korus", text: ["Ai ni na gamsu, Ai ni na gamsu,", "Ai ni na gamsu da Yesu,", "In na tuna Kalfari, sai in tambayi kaina,", "Ko Yesu na ya gamsu da ni?"] },
        { verse: 2, text: ["Cikin damuwa ta yana nan, Ya fi dukan abokai.", "Ni zan dogara ga Yesu, Ko shi zai gamsu da ni?"] },
        { verse: 3, text: ["Ina jin muryar Yesu na, Kira na cikin roƙo,", "Je ka ribato ɓatattu, Ko shi zai gamsu da ni?"] },
        { verse: 4, text: ["Ran da na bar wannan duniya, Na bayyana gabansa", "Ko dai zan ji yana cewa, “Ai ni na gamsu da kai!”"] }
      ],
      history: ""
    },
    "HBH437": {
      title: "Mafi Kyau",
      number: "HBH437",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "TULLAR",
      meter: "6.4.6.4.D. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ku ji kiran Yesu, “Ba mafi kyau”", "Babba ko ƙarami, Gwajinsa ne,", "Bashi iyawarka, Ba don lada,", "Ko yabon mutum ba, Yi don Allah."] },
        { verse: "Korus", text: ["Yesu zai sa maka albarka,", "Amma yana buƙatar mai kyau,", "Talent namu kaɗan duk da haka,", "Yana buƙatar mu ba shi mai kyau."] },
        { verse: 2, text: ["Kada fa mu biɗi, Yabon mutum,", "Albarkar Allah na, Kawo murna,", "Taimakon gaskiya, Sai albarka,", "Duk ayyukan mu fa, Ba shi mai kyau."] }
      ],
      history: ""
    },
    "HBH438": {
      title: "Ka Maishe Ni Tushen Albarka",
      number: "HBH438",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "EUCLID",
      meter: "9.9.10.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ko ka zama tushen albarka ne?", "Ko ƙaunar Allah na cikinka?", "Ko ka shaida Yesu ga ɓatattu?", "Ko ka shirya don yin aikinsa?"] },
        { verse: "Korus", text: ["Maida ni tushen albarka a yau", "Maida ni tushen albarka a yau", "Ka mallake ni, albarkace ni,", "Maida ni tushen albarka a yau."] },
        { verse: 2, text: ["Ko ka zama tushen albarka ne?", "Kana juyayi don ɓatattu?", "Ko kana shaida fa ga ɓatattu?", "Mutuwar da Yesu ya yi fa?"] },
        { verse: 3, text: ["Ko ka zama tushen albarka ne?", "Ko kullum kana ta shaidarsa?", "Ko kana bada labarin ceto?", "Ga matattu cikin zunubai?"] },
        { verse: 4, text: ["In mun yi rayuwar zunubi,", "Ba za mu zama albarka ba", "Za mu zama sanadin faɗuwa,", "Ga masu buƙatar cetonsa."] }
      ],
      history: ""
    },
    "HBH439": {
      title: "Yi Shiri",
      number: "HBH439",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "TILLMAN",
      meter: "C.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Shirin wahala ko ƙunci, Shirin dukan gwaji,", "Shirin aikas da waɗansu, Wanda sun cancanta."] },
        { verse: "Korus", text: ["Ina shirye, domin aiki, Shirin yin aikina", "Shirin yin aiki ko yaya ne, Shirin yin nufinsa"] },
        { verse: 2, text: ["Shirin tafiya da jimrewa, Yin tsaro da addu'a,", "Shirin ba shi duk zuciyata, Har ya nuna hanya."] },
        { verse: 3, text: ["Shirin Magana da tunani, Shiri na zuciya,", "Inda ya kai ni nan zan tsaya, Kome wahala fa."] },
        { verse: 4, text: ["Shirin Magana da kashedi, Shirin yin bishara,", "Ko cikin rai, ko mutuwa, Shiri don zuwansa."] }
      ],
      history: ""
    },
    "HBH440": {
      title: "Muryar Yesu Tana Kira",
      number: "HBH440",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ELLESDIE",
      meter: "8.7.8.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Hidima",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ji muryar Yesu na kira, Wa zai je yin aiki yau?", "Girbin kaka yana jira, Wa zai tara dammuna,", "Ji shugaba yana kira, Zai bada lada kyauta,", "Wa zai amsa fa da murna, Ga ni nan ka aike ni."] },
        { verse: 2, text: ["In baka iya tafi ba, Zuwa ƙasa mai nisa", "Masu buƙata na kusa, Har a bakin ƙofarka,", "In ba ka ba da dubbai ba, Kawo bisa ƙarfinka,", "Duk abin da ka ba Yesu, Na da daraja gunsa."] },
        { verse: 3, text: ["Kada a ji kana cewa, Ba aiki da ni zan yi", "Mutane na fa mutuwa, Ji kiran Ubangiji,", "Karɓi aikinsa da murna, Yi aikin da daraja,", "Amsa maza in ya kira, Ga ni nan ka aike ni. AMIN."] }
      ],
      history: ""
    },
    "HBH441": {
      title: "Ubangiji Mahalici",
      number: "HBH441",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AMESBURY",
      meter: "C. M. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubangiji mahalici, Mutumin Galili", "Tun cikin kuruciyarka fa, Ka san dukan kome", "Mun gode don bangaskiyarka, Da ta haska rayuwa,", "Ba ku san aikina ne, In yi aikin Uba ba?"] },
        { verse: 2, text: ["Ya Ƙafintan Nazaret, Kai ne mai ba da rai", "Ka yi mutum yadda ka so, Kai Kanka na da kyau.", "Bar mu zama kamar Kristi, Mu iya dubawa", "Aikin mu kamar naka fa, Muna aikin Uba."] },
        { verse: 3, text: ["Kai wanda ka ba mu ruya, Kowa da aikinsa", "Ka ba mu ƙarfin yin aiki, Ka nuna nufinka", "Ba mu sanin ya kamata, Ba mu nufin gaskiya.", "Shi zama murnar mu sosai, Muna aikin Uba. AMIN"] }
      ],
      history: ""
    },
    "HBH442": {
      title: "Hasken Allah Ya Haska",
      number: "HBH442",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MISSIONARY HYMN",
      meter: "7. 6. 7. 6. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Hasken Allah na haska, Rayuwarmu kullum", "Muryar Uba na kira, “Yi tafiya da ni yau”", "Ba aikin da ya kasa, Gare shi Ubanmu,", "Rayuwa duk cikin tsarki, Ya Kristin Galili."] },
        { verse: 2, text: ["Ya biya buƙatunmu, Shi mai aminci ne", "Shi mai yawan albarka, Shi mai yafe zunubai", "Shi baya son zunubi, Tsarki ne yake so", "Yana zaune da Allah, Yana shirya wuri."] },
        { verse: 3, text: ["A taruwar mutane, Ga kayan zunubi,", "Ma'aikatanka suna, Begen yin bishara,", "Kristi, babban amini na, Dukan tsarkakku,", "In sun samo ɓatattu, Sai mulkin ka shi zo."] },
        { verse: 4, text: ["Ga fansassu cikinka, Suna yin addu'a,", "Suna duban gicciyenka, “Ga mutumin” sun ce", "Ga Ikilisiya na roƙo, Wa masu yi da kyau,", "Muryarka ke bishe mu, Waƙarmu kenan fa. Amin."] }
      ],
      history: ""
    },
    "HBH443": {
      title: "Mu Ɗaya Ne Duk Cikin Kristi",
      number: "HBH443",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. PETER",
      meter: "C. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu ɗaya ne duk cikin Kristi, Dukan mu ɗaya ne,", "Zumuncinmu na ƙaunae, Cikin dukan duniya!"] },
        { verse: 2, text: ["Cikin Kristi, masun gaskiya, Za su yi ta murna,", "Aikinsa ne ya haɗa mu, Fiye da kome duk."] },
        { verse: 3, text: ["Bar mu haɗa kai 'yan'uwa, Ban da bambanci fa,", "Mu yi wa Allahnmu aiki, Mu 'yan'uwa ne fa."] },
        { verse: 4, text: ["Bar mu taru kamar 'yan'uwa, Dukan mu ɗaya ne", "Dukan mu 'ya'yan Allah ne, Cikin dukan duniya! AMIN"] }
      ],
      history: ""
    },
    "HBH444": {
      title: "Bari Haske Ya Kasance",
      number: "HBH444",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PENTECOST",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bari haske ya kasance, Da hikimarka a duniya,", "'Ya'yanka su yi albarka, Bar aikinmu ya shaida ka."] },
        { verse: 2, text: ["Cikin zuciyarmu ya Allah, Bari mu sami natsuwa,", "Mu zama masu aikinka, Cire mana sha'awar duniya,"] },
        { verse: 3, text: ["Ba mu wahayin salama, Mu ga ci gaban 'Yan'uwanmu,", "Kar su wahala su kaɗai, Ƙaunarka mai fidda tsoro."] },
        { verse: 4, text: ["Bari faman mu ya ƙare, Aikinmu shi yi albarka,", "Mu gina juna da ƙauna, Ba mu salamarka Allah. AMIN"] }
      ],
      history: ""
    },
    "HBH445": {
      title: "Tashi Ku Mazaje",
      number: "HBH445",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. THOMAS",
      meter: "S.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tashi ku mazaje, Ku bada himma fa,", "Bada zuciya da ƙarfi, Ku bauta wa Allah"] },
        { verse: 2, text: ["Tashi ku mazaje, Mulkinsa ba iyaka,", "Bar Ruhunku shi zama ɗaya, Ku kau da mugunta."] },
        { verse: 3, text: ["Tashi ku mazaje, Ikilisiya na sonku,", "Ku ne ƙarfinta fa ku ji, Tashi ku yi himma."] },
        { verse: 4, text: ["Ku ɗau gicciyen Kristi, Ku je inda ya je,", "Ku bayin Yesu Kristi ne, Tashi, ku mazaje."] }
      ],
      history: ""
    },
    "HBH446": {
      title: "Mu Ta Da Tuta",
      number: "HBH446",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WALTHAM",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu ta da Tuta! A gan ta, Sama da ƙasa ko'ina,", "Don rana ta haskaka ta, Gun gicciye da ya mutu."] },
        { verse: 2, text: ["Mu ta da Tuta! Mala'iku, Suma suna marmari fa", "Amma ba su da ganewa, Wannan abin al'ajibi."] },
        { verse: 3, text: ["Mu ta da Tuta! Tutar Allahnmu, Su ga darajar ta,", "Ƙasashe na amsa kiran, Zuciyarsu cike da murna."] },
        { verse: 4, text: ["Mu ta da Tuta! A gan ta, Sama da ƙasa ko'ina", "Ɗaukakarmu cikin gicciye, Begenmu Yesu ne kaɗai."] }
      ],
      history: ""
    },
    "HBH447": {
      title: "Ya Ɗan'uwa So Ɗan'uwanka",
      number: "HBH447",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ILONA",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "MULKIN ALLAH: Dayantaka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Ɗan'uwa so ɗan'uwanka fa,", "In akwai tausayi, salama na nan,", "Sujada mai kyau na buƙatar ƙauna,", "Yi waƙa da addu'a tare fa."] },
        { verse: 2, text: ["Domin ku ne Yesu Kristi ya mutu,", "Ya kawo sujada mai albarka,", "Shi ya cece, ɓatattu, da jininsa,", "Ya ciyar da gwamraye da marayu."] },
        { verse: 3, text: ["Inda mun yi kuskure, Mukan ce hanyarsa,", "Ka taimake mu Allah, Mu shaida bishara,", "Har ƙabilun duniya, Su zama da kai nan,", "Cike da alheranka, A cikin mulkinka."] },
        { verse: 4, text: ["Ubangiji, tsare mu, Bi da tafarkinmu,", "Don shelar bishararka, Ta ƙauna da haske,", "Har mu sami izawa, Ta wurin kalmarka,", "Cikin dukan duniya, Ka zama Allahnmu."] }
      ],
      history: ""
    },
    "HBH448": {
      title: "Gari Yana Wayewa",
      number: "HBH448",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WEBB",
      meter: "7. 6. 7. 6. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gari yana wayewa, Duhu na watsewa,", "'Yan duniya na falkawa, Cikin damuwarsu,", "Bari mu ji labari, Cikin wannan duniya,", "Labarin shirin yaƙi, Yaƙin Sihiyona."] },
        { verse: 2, text: ["Ka zubo alherinka, A bisan dukanmu,", "Ya haskaka hanyarmu, A kowace sa'a", "Amsa dukan roƙonmu, Idan mun yi addu'a", "Ga iskar ka mai ƙarfi, Ta huro salama."] },
        { verse: 3, text: ["Ga al'ummai na durƙushe, Gabanka Allahnmu,", "Ga dubbai suna zuwa, Gunka da godiya,", "Mutane suna tuba, Sun bi umurninka,", "Suna neman albarka, Albarkan Mai Ceto. AMIN"] }
      ],
      history: ""
    },
    "HBH449": {
      title: "Ga Ƙasa Mai Daraja",
      number: "HBH449",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MISSIONARY HYMN",
      meter: "7.6.7.6 D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ga ƙasa mai daraja, Babu kwatantawa", "Haske na haskakawa, Kowane lokaci", "Daga kogi mai girma, Ga tsire tsire,", "Sun kira a cece su, Daga hallaka fa."] },
        { verse: 2, text: ["Ga ma iska mai sanyi, Tana ta hurawa,", "Dukan tsirai na murna, Duka domin mutum,", "Muna raina halittar, Allah da kyautarsa,", "Cikin rashin sani ne, An bauta wa gunki."] },
        { verse: 3, text: ["Mu da ke haskaka ku, Tare da hikima fa,", "Ma kasance da duhu, Haskenmu ya mutu?", "Ceto fa! I ceto fa!, Abin farin ciki,", "Har iyakar duniya ta, Karɓi Almasihu"] },
        { verse: 4, text: ["Iska, baza labarin, Ruwaye gangara,", "Har duniya ta ji saƙon, Kudu da Arewa,", "Har ma gabas da yamma, Su sami tsira duk,", "Mai fansa, mahalicci zai, Dawo don mulki. Amin."] }
      ],
      history: ""
    },
    "HBH450": {
      title: "Cikin Dukan Duniya",
      number: "HBH450",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LANCASHIRE",
      meter: "7.6.7.6. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Cikin dukan duniya, Kai ne Allahnmu fa,", "Muna fa da kuɗuri, Na maka biyayya", "Ɗaukaka muke maka, Ƙasa mai albarka,", "Koguna da ruwaye, Suna ɗaukaka ka."] },
        { verse: 2, text: ["Don ɗaukakarka Kristi, Da albarkar ƙasa,", "Muna roƙonka Allah, Ka bayyana kanka,", "Ka ba mu sani Yesu, Sauko da hannunka,", "Warkar da cututtuka, Da iko kan Shaiɗan."] },
        { verse: 3, text: ["Ga saƙonmu ga dukan al'umma,", "Ubangiji shi ne Sarki,", "Ya aiko da mai cetonmu,", "Ya nuna ƙaunar Allah,", "Ya nuna ƙaunar Allah."] },
        { verse: 4, text: ["Ga mai ceto ga dukan al'umma,", "Wanda ya ratsa hanyar rai,", "Domin duk mutanen duniya,", "Su san gaskiyar Allah,", "Su san gaskiyar Allah."] }
      ],
      history: ""
    },
    "HBH451": {
      title: "Sihiyona, Yi Shelar Bishararki",
      number: "HBH451",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "TIDINGS",
      meter: "11.10.11.10. With Refrains",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sihiyona, yi shelar bishararki,", "Don duniya ta sani Allah ne haske,", "Shi ne mahallicinmu shi ba ya so,", "Wani ya mutu cikin zunubi."] },
        { verse: "Korus", text: ["Shelar bisharar, ta salama,", "Bisharar Yesu, ta ceto da 'yanci,"] },
        { verse: 2, text: ["Duba da yawa na cikin zunubi,", "Suna ɗaure cikin sarkan Shaiɗan,", "Babu wanda zai kai bisharar Yesu,", "Cewa, ya mutu don zunubansu."] },
        { verse: 3, text: ["Yi shelar bishara ga duk al'ummai,", "Allah da ya ba su rai ƙauna ne,", "Faɗi yadda ya zo don ya cece mu,", "Har ya mutu domin mu sami rai."] },
        { verse: 4, text: ["Bar 'ya'yanku su yi shelar bishara,", "Bada dukiyarku domin aikin,", "Yi masu addu'a domin nasara,", "Dukan aikinku, Yesu zai biya."] }
      ],
      history: ""
    },
    "HBH452": {
      title: "Ku Manzani Masu Shaida",
      number: "HBH452",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NATIONAL HYMN",
      meter: "10.10.10.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ku manzanni masu shaida saƙo,", "Kuna ɗauke da saƙo mai girma,", "Ku shaida labarin da sauri fa,", "Gyara dukan tafarkun sarkinmu."] },
        { verse: 2, text: ["Cikin Hamada ga danshin ruwa,", "Cikin kwari teku ya ɓulɓulo.", "Shirya hanya, babu ragonci fa,", "Shirya hayar sarkinmu a duniya"] },
        { verse: 3, text: ["Inda hanyar ta tanƙware a da,", "Bari muryoyinku su yi amo.", "Inda mutane ke ta makoki,", "Gyara dukan tafarkun Sarkinmu"] },
        { verse: 4, text: ["Allah ba mu ikon shirya hanya,", "Mu ga mu cika alƙawarinmu,", "Inda babu damuwa ko yaƙi,", "A kan tafarkin sarkin salama."] }
      ],
      history: ""
    },
    "HBH453": {
      title: "Muna Yabonka Ya Ubangijinmu",
      number: "HBH453",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WESLEY",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muna yabonka ya Ubangijinmu!", "Farin ciki waɗanda ke duhu!", "Ya kawas da dukan baƙin cikinsu,", "Sihiyona yanzu tana mulki."] },
        { verse: 2, text: ["Muna yabonka ya Ubangijinmu!", "Annabawa sun yi anabci da", "Da farin ciki ga wanda an 'yantas,", "Mutane sun ga shirinka mai kyau."] },
        { verse: 3, text: ["Cikin Hamada furanni sun tsiro,", "Koguna sun fito da ruwa can,", "Tuddai ma na baka dukan ɗaukaka,", "Mara amfani yanzu sun sauya."] },
        { verse: 4, text: ["Ga ƙasashe da tsibirai na teku,", "Suna raira yabo ga Allahnmu,", "Al'amuran yaƙi duka sun ƙare,", "Waƙoƙin nasara na ta amo."] }
      ],
      history: ""
    },
    "HBH454": {
      title: "Hasken Mu Mun Yabeka",
      number: "HBH454",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SAVE DOMINE",
      meter: "7.6.7.6. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Haskenmu mun yabe ka, Mai kawas da duhu", "Duhu ba zai ɓoye ka, Ba daga fuskar mu", "Mun daɗe cikin duhu yanzu, Haske ko'ina,", "Haskenka mai daraja, Zai yi ta haskawa."] },
        { verse: 2, text: ["Haskenmu darajarka, Tana zuciyarmu,", "Kai ne ka ɗaukaka mu, Cikin ƙasƙancinmu", "Cikin ɗaukakarka ne, Ka shirya hanyanmu,", "Ka taimake mu domin, Mu nuna haskenka."] },
        { verse: 3, text: ["Haskenmu ka haskaka, Wannan duniyar ka,", "Har sai dukan mutane, Sun sami haskenka.", "Har sai dukan mutane, Sun bar zunubinsu,", "An maya haifuwarsu, Ta wurin ƙaunarka. AMIN"] }
      ],
      history: ""
    },
    "HBH455": {
      title: "Ga Labari",
      number: "HBH455",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MESSAGE",
      meter: "10. 8. 8. 7. 7. With Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ga labari ga dukan al'umma,", "Da zai sauya zukatansu,", "Labarin gaskiya da jinkai,", "Labarin salamar rai,", "Labarin salamar rai,"] },
        { verse: "Korus", text: ["Gama duhu zai zama haske,", "Kuma haske zai haskaka,", "Sarautar Kristi za ta kwa zo,", "Ƙaunarsa da hasken rai"] },
        { verse: 2, text: ["Ga waƙarmu ga dukan al'umma,", "Da za ta kai su ga Allah", "Waƙar cike da nasara,", "Za ta karya makamai,", "Za ta karya makamai"] }
      ],
      history: ""
    },
    "HBH456": {
      title: "Ya Allah Muna Roƙonka",
      number: "HBH456",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ORTONVILLE",
      meter: "C. M",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Allah muna roƙonka, Duniya ta ratse,", "Muna roƙon alherinka, Cikin wannan rana,", "Cikin wannan rana."] },
        { verse: 2, text: ["Kai masanin zuciyar mutum, Tushen zunubansa,", "Muguntarsa, ha'incinsa, Dukan su banza ne,", "Dukan su banza ne."] },
        { verse: 3, text: ["Muna roƙo ya Allah, Don wahalar duniya,", "Ba kai ka haliccemu ba? Ka albarkace mu,", "Ka albarkace mu."] },
        { verse: 4, text: ["Ka taimake mu ya Allah, Mu ga ɗaukakarka;", "Ga tauraron assubahi, Shi wanda an gicciye,", "Shi wanda an gicciye."] }
      ],
      history: ""
    },
    "HBH457": {
      title: "Kira Ga Duk Masu Nauyin Kaya",
      number: "HBH457",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MCCABE",
      meter: "11.6.11.6. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ga kira ga duk masu nauyin kaya,", "Haskaka, Haskaka,", "Ga masu ɓacewa, suna son ceto,", "Haskaka, Haskaka."] },
        { verse: "Korus", text: ["Haskaka Hasken bisharar rai,", "Haskaka ta ko'ina", "Haskaka hasken bisharar rai,", "Haskaka har abada."] },
        { verse: 2, text: ["Yau mu ji kira na Makidoniya,", "Haskaka, Haskaka", "Mun kawo baikonmu gare ka Allah.", "Haskaka, Haskaka ."] },
        { verse: 3, text: ["Addu'a don alheri ya yawaita,", "Haskaka, Haskaka,", "Sai mu yi rayuwa irin ta Kristi,", "Haskaka, Haskaka."] },
        { verse: 4, text: ["Kada mu yi suwu da aikin ƙauna,", "Haskaka, Haskaka,", "Sai mu tara dukiyarmu a sama,", "Haskaka, Haskaka."] }
      ],
      history: ""
    },
    "HBH458": {
      title: "Muna Shelar Yesu",
      number: "HBH458",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CUTTING",
      meter: "6.6.4.6.6.6.4",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muna shelar Yesu, Zuwa ga duniya duk", "Cikin himma, Talakawa duka,", "Da masu damuwa, Kristi ne magani", "Zo wurin shi."] },
        { verse: 2, text: ["Muna shelar Yesu, Zuwa ga duniya duk", "Cikin addu'a, Ɓatattu, ko'ina", "Sun Bi duniya, Kristi ya fanshe su", "Daga duhu."] },
        { verse: 3, text: ["Muna shelar Yesu, Zuwa duniya duka,", "Da zuciya ɗaya, Mu yi aiki tare,", "Ba kunya, ba tsoro, Za mu ɗauki gicciyen", "Domin Yesu."] },
        { verse: 4, text: ["Muna shelar Yesu, Zuwa ga duniya duk", "Muna waƙa, Ga sabobbin tuba,", "Da aka ceto su, Suna raira yabo,", "Ga shi Kristi."] }
      ],
      history: ""
    },
    "HBH459": {
      title: "Ku Krista Aikakku, Yi Shela",
      number: "HBH459",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DUKE STREET",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ku Krista aikakku, yi shelar, Ceto ta wurin Immanuel", "Har dukan duniya ta ji, Har ya faranta Zuciya"] },
        { verse: 2, text: ["Zai tsare ka da wutansa, Zai baka ikon yin aiki,", "Damuwarka za ta ƙare, Za ya baka salamarsa."] },
        { verse: 3, text: ["Idan mun bar duniyan nan, Can inda babu rabuwa,", "Can za mu yi farin ciki, Mu girmama shi Sarkinmu.", "AMIN"] }
      ],
      history: ""
    },
    "HBH460": {
      title: "Ubanmu Mai Kaunar Kowa",
      number: "HBH460",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SAXBY",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubanmu na ƙaunar kowa, Taimake mu muna kira,", "Daga tsara zuwa tsara, Mu kasance cikin tsarki."] },
        { verse: 2, text: ["Bar mu iya bi da kanmu, Zama cikin tsarki kullum,", "Domin fa mu kawo maka, Hadayarmu mara aibi."] },
        { verse: 3, text: ["Koya mana zama tare, Kar mu cuci mara ƙarfi,", "Amma ta wurin ikon ka, Mu ta'azantar da junanmu."] },
        { verse: 4, text: ["Bar mu daina dogon buri, Mu daina wa wasu ba'a", "Da yafewa cikin gaskiya, Mu nuna ƙauna ga kowa.", "AMIN"] }
      ],
      history: ""
    },
    "HBH461": {
      title: "Ya Kalma Mai Iko",
      number: "HBH461",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ITALIAN HYMN (TRINITY)",
      meter: "6.6.4.6.6.6.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya kalma mai Iko, Mai kau da damuwa,", "Ubangiji, Ka ji addu'armu,", "Inda ba bishara, Bari haskenka fa,", "Ya haska yau."] },
        { verse: 2, text: ["Ruhun gaskiya da ƙauna, Ruhu mai ba da rai,", "Yi aikinka, Haskaka ko'ina,", "Bayyana nufinka, Bari haskenka fa,", "Ya haska yau."] },
        { verse: 3, text: ["Ya Ruhu Mai Tsarki, Uku cikin ɗaya,", "Kaunace mu!, Don mu zama ɗaya,", "Har abada badin, Bari haskenka fa,", "Ya haska yau.AMIN"] }
      ],
      history: ""
    },
    "HBH462": {
      title: "Ina Labarin Tsaro",
      number: "HBH462",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. GEORGES, WINDSOR",
      meter: "7.7.7.7. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina labarin tsaro, Mene ne al'amuran ta,", "Masu tafiya kan tuddai, Dubi hasken tauraro,", "Mai tsaro, wannan hasken, Na murna ne ko bege?", "Matafiya sun ga rana, Salamar Israila."] },
        { verse: 2, text: ["Ina labarin tsaro, Tauraro na ta hawa,", "Matafiya haske, Salama da gaskiya;", "Mai tsaro, haske kaɗai, Za ya kawo sauyawa", "Matafiyi da daɗewa, Ga hasken kan duniya."] },
        { verse: 3, text: ["Ina labarin tsaro, Assubahi ya kusa,", "Matafiya dare ya yi, Babu sauran tsoro fa,", "Ka huta da zagaya, Huta cikin gidanka,", "Matafiyi mai salama, Ga Ɗan Allah ya zo. AMIN"] }
      ],
      history: ""
    },
    "HBH463": {
      title: "A Cikin Shekaru",
      number: "HBH463",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. GERTRUDE",
      meter: "6.5.6.5.D with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "BISHARA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["A cikin shekarun, A tafiya tare,", "Cikin bangaskiya, Allah na kira,", "Da baye baye fa, Zukata ɗaya,", "Hikimomi da yawa, Akwai lada fa."] },
        { verse: "Korus", text: ["A cikin shekaru fa,", "A tafiya tare,", "Cikin bangaskiya,", "Allah na kira."] },
        { verse: 2, text: ["Mulkin yana girma, Ga ƙaunar juna,", "Sai fa mu yi aiki, Har mu kai gida,", "Annabawa sun yi shi, Shaidar tsarkakku.", "Mawaƙa sun raira, Wasu sun mutu."] },
        { verse: 3, text: ["Nasararmu tare, Faɗuwa tare,", "A rashi ko nasara, Rashin nasara,", "Muna yin nufinsa, Tare dukan mu,", "Tare muke tafiya, Zuwa ga goal. AMIN"] }
      ],
      history: ""
    },
    "HBH464": {
      title: "Inda Rayuwa Ta Cakude",
      number: "HBH464",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GERMANY",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "ZAMANTAKEWA MAI INGANCI",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Inda rayuwa ta cakuɗe, Inda jama'a na damuwa,", "Gaba da gwagwarmayarmu, Mun ji kiranka Ɗan Allah."] },
        { verse: 2, text: ["Cikin matsi na rayuwa, Da inuwar duhu da tsoro,", "Da hanyoyi na kwaɗayi, Mun ga hawayen ƙaunarka."] },
        { verse: 3, text: ["Daga kuruciya ta banza, Da rayuwar mutum mai wuya", "Har da ruhu mai kasawa, Zuciyarka tana nan daram."] },
        { verse: 4, text: ["Ya Allahnmu daga sama, Ka warkar da zukatanmu,", "Daga yawan damuwarmu, Taka cikin rayuwarmu."] },
        { verse: 5, text: ["Har mu gane da ƙaunarka, Mu bi dukan sawayenka,", "Har ɗaukaka daga sama, Ta mamaye rayuwarmu."] }
      ],
      history: ""
    },
    "HBH465": {
      title: "Allah Alheri Da Daukaka",
      number: "HBH465",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CWM RHONDDA",
      meter: "8.7.8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "ZAMANTAKEWA MAI INGANCI",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah mai yawan alheri, Zubo mana ikonka,", "Hatimce ikilisiyarka, Ka ba mu ɗayantakarka,", "Ba mu hikima, da ƙarfi, Don fuskantar loton nan,", "Don fuskantar loton nan."] },
        { verse: 2, text: ["Miyagu sun kewaye mu, Sa mu cikin hanyarka,", "Tsoro, shakka sun ɗaure mu, 'Yanta mu don yabonka", "Ba mu hikima, da ƙarfi, Domin rayuwa ta yau,", "Domin rayuwa ta yau."] },
        { verse: 3, text: ["Ka bi da sawayenmu fa, Yi jagoran zuciyarmu,", "Ba mu alherinka Kristi, Don mu ceci rayuka,", "Ba mu hikima da ƙarfi, Domin kada mu faɗi!", "Domin kada mu faɗi! AMIN."] }
      ],
      history: ""
    },
    "HBH466": {
      title: "Ya Yesu Ubangiji",
      number: "HBH466",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HUMILITY",
      meter: "L. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "ZAMANTAKEWA MAI INGANCI",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Yesu Ubangijinmu, Sa'ad da na ga jama'a fa", "Dauke da kaya mai nauyi, Bar in haskaka haskenka."] },
        { verse: 2, text: ["Don in kawo su wurinka, Kafin duhun dare ya yi.", "Don mu ƙarfafa rayuka, Har sai babu sauran duhu."] },
        { verse: 3, text: ["Ka sa su san buƙatuna, Lokacin da muke tare,", "Ka sa mu fahimci juna, Da ƙaunarka mai girma fa."] },
        { verse: 4, text: ["Ka ƙarfafa hannayenmu, Ka sa mu yabi sunanka,", "Lokacin da muke tare, Mu sasance juna sosai."] }
      ],
      history: ""
    },
    "HBH467": {
      title: "Saurara Duk Duniya",
      number: "HBH467",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "JOANNA",
      meter: "11. 11. 11. 11.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "ZAMANTAKEWA MAI INGANCI",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Saurara duk duniya yi biyayya,", "Saƙon da muka ji da, da na yanzu,", "Wahalar duniya na ta ƙaruwa,", "Ga yaƙe - yaƙe na kashe mutane."] },
        { verse: 2, text: ["Ga sabon zamani na kau da tsohuwar,", "Wannan fa shi ne cikawar anabci,", "Cikin mummunan yaƙi muna roƙo,", "Bari duniya ta sami salama."] },
        { verse: 3, text: ["Cikin ki ƙasata, mun zama ɗaya,", "Ke mafi ƙanƙanta, bari haskenki,", "Ya haskaka dukan wannan duniya,", "Domin duniya ta sami salama. AMIN"] }
      ],
      history: ""
    },
    "HBH468": {
      title: "Sa'ad Da Na San Matsayi Na",
      number: "HBH468",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PISGAH",
      meter: "8.6.8.6.6.6.8.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Idan lokaci ya yi fa, Zuwa gidan Allah,", "Zan rabu da dukan tsoro, In share hawaye,", "In share hawaye, In share hawaye,", "Zan rabu da dukan tsoro, In share hawaye."] },
        { verse: 2, text: ["Idan duniya ta ƙi ni, Tare da azaba fa;", "Zan yi nasara kan Shaiɗan, In fuskanci duniya", "In fuskanci duniya, In fuskanci duniya,", "Zan yi nasara kan Shaiɗan, In fuskanci duniya."] },
        { verse: 3, text: ["Bari in sami hutu fa, Damuwa ta kawu!", "In isa gida lafiya, Allah kai gatana,", "Allah kai gatana, Allah kai gatana,", "In isa gida lafiya, Allah kai gatana."] },
        { verse: 4, text: ["Can zan wanke zuciyata, Cikin tekun hutu,", "Duk damuwa za ta wuce, Lokacin salama,", "Lokacin salama, Lokacin salama", "Duk damuwa za ta wuce, Lokacin salama."] }
      ],
      history: ""
    },
    "HBH469": {
      title: "Saurara Ya Raina",
      number: "HBH469",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PILGRIMS",
      meter: "11. 10. 11. 10. With Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Saurara raina, mala'iku na waƙa,", "A ko'ina cikin duniyan nan,", "Waƙa mai daɗi da ke faɗin gaskiya,", "Na rayuwa da babu zunubi."] },
        { verse: "Korus", text: ["Mala'ikun Yesu, masu haske,", "Suna waƙar marabtar maniyaci."] },
        { verse: 2, text: ["Gaba gaba muna ji suna cewa,", "Mai damuwa, Yesu yana kira,", "Komai duhu fa, suna ta rairawa,", "Waƙoƙin bishara na Yesunmu."] },
        { verse: 3, text: ["Can da nisa kamar dai ƙararrawa,", "Muryar Yesu na kira ko'ina,", "Masun nauyin kaya suna hutawa,", "Makiyayi, sake rayuwarsu."] },
        { verse: 4, text: ["Ci gaba da rairawa mala'iku,", "Waƙoƙi masu daɗi na sama,", "Murnar mu ta share baƙin cikinmu,", "Har mu ƙarfafu cikin ƙaunarsa. AMIN."] }
      ],
      history: ""
    },
    "HBH470": {
      title: "Ko Zan Sami Rawani Mai Daraja?",
      number: "HBH470",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "STARS IN MY CROWN",
      meter: "12.9.12.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina tunanin gida mai daraja fa,", "Zan kai bayan ƙarewar rana", "Bisa alherinsa kullum ni zan tsaya,", "Ko zan sami rawani mai kyau?"] },
        { verse: "Korus", text: ["Ko zan sami rawani mai daraja kwa", "Sa'anda na amsa kiransa.", "In na farka a gaban uba mai iko", "Ko zan sami rawani mai kyau?"] }
      ],
      history: ""
    },
    "HBH471": {
      title: "Akwai Kasa Mai Haske A Can",
      number: "HBH471",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWEET BY AND BY",
      meter: "9.9.9.9. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Akwai ƙasa mai haske a can,", "Shiryayiyya don duk masubi,", "Almasihu mai ceto na nan,", "Za mu gan shi tare da Uba."] },
        { verse: "Korus", text: ["Can akwai hutawa,", "Daɗin hutu gun Yesu mai rai,", "Za mu zauna tare,", "Cikin mulkinsa har abada."] },
        { verse: 2, text: ["Can akwai murna har abada,", "Wurin Yesu akwai kwanciyar rai,", "Za mu manta da wahalar nan,", "Wurin Yesu sai daɗi kaɗai."] },
        { verse: 3, text: ["Wurin Allah Ubangijinmu,", "Za mu raira darajarsa fa,", "Cikin ɗaukakar Allah Uba,", "Tare da albarku masu yawa."] }
      ],
      history: ""
    },
    "HBH472": {
      title: "Mai Cetona Shi Ne Farko",
      number: "HBH472",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "I SHALL KNOW HIM",
      meter: "14.11.14.11. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Randa aikina zai ƙare in koma gidana,", "Randa zan kwa ga hasken ɗaukakarsa,", "Zan gane da mai fansata a can inda yake,", "Da murmushi zai fara marabta ta."] },
        { verse: "Korus", text: ["Zan san Shi I, ni zan san shi", "Zan zama 'yantacce gabansa", "Ni zan san Shi", "Ni zan san Shi", "Ta wurin alamar hannunsa"] },
        { verse: 2, text: ["Sa'ad da za a fyauce ni, in duba fuskarsa,", "Zan ga idanunsa mai yawan jinƙai,", "Da yadda zan yabi ƙaunarsa da alherinsa,", "Su suke shirya ni domin mulkinsa."] },
        { verse: 3, text: ["Ya ku cikin ɗaukaka, yadda suka ce in zo,", "Na tuna da rabuwa cikin jiki,", "Zuwa wuri mai daɗi da za a marabce ni,", "So nike in fara ganin Mai Ceto."] },
        { verse: 4, text: ["Cikin ƙofofin sama da tufafi farare,", "Za ya bi da ni inda ba a kuka,", "Ina raira waƙoƙi cikin farin ciki,", "So nike in fara ganin Mai Ceto."] }
      ],
      history: ""
    },
    "HBH473": {
      title: "In Safiya Ta Yi",
      number: "HBH473",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BY AND BY",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Jarabobi ko'ina, Amma ba mu gane ba", "Inda Allah ke bida mu, Zuwa ƙasar alkawali,", "Idanunsa za ya bi da mu har zuwa mutuwa", "Za mu fahimce shi da kyau wata ran"] },
        { verse: "Korus", text: ["Wata rana, in safiya ta yi", "In tsarkakkunsa sun je gida,", "Za mu bada labarin nasaranmu,", "Za mu fahimce shi da kyau wata ran"] },
        { verse: 2, text: ["Kodashike shirinmu, Ya kasa yin nasara,", "Muna tafiya cikin duhu, Ba zuciya mai nauyi,", "Yanzu muna da bege, bisa ga maganarsa", "Za mu fahimce shi da kyau wata ran."] },
        { verse: 3, text: ["Jarabobi ɓoyayyu, Sun ɗauke mu ba zato", "Zuciyarmu na mamaki, Don irin wannan wahala", "Me ke kawo wannan fa duk da yawan famanmu", "Za mu fahimce shi da kyau wata ran."] }
      ],
      history: ""
    },
    "HBH474": {
      title: "Za Mu Gan Shi Sarkinmu",
      number: "HBH474",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "JONES",
      meter: "11.7.11.7 with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kodayake tafiyarmu na da wuya,", "Za mu ga Yesu Kristi", "Za mu rabu da wahala a ranan.", "Za mu gan shi Sarkinmu"] },
        { verse: "Korus", text: ["Za mu gan shi Sarkinmu", "Za mu raira yabonsa", "In mun taru can", "Za ya kira nasa", "Za mu ganshi Sarkinmu."] },
        { verse: 2, text: ["Bayan mun sha wahala a duniyan nan", "Za mu ga Yesu Kristi", "Muna samun albarku da murna", "Za mu gan shi Sarkinmu."] },
        { verse: 3, text: ["Bayan mun yi nasara da magabta.", "Za mu ga Yesu Kristi", "Bayan wahalunmu sun ƙare duka", "Za mu gan shi Sarkinmu."] },
        { verse: 4, text: ["Can tare da waɗanda sun riga mu,", "Za mu ga Yesu Kristi,", "Wahala fa ta ƙare sai salama,", "Za mu gan shi Sarkinmu."] }
      ],
      history: ""
    },
    "HBH475": {
      title: "Fuska Da Fuska Tare Da Kristi",
      number: "HBH475",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "FACE TO FACE WITH CHRIST",
      meter: "8.7.8.7 with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Fuska da fuska da Kristi, Zan gan shi mai cetona,", "Cikin fyaucewa zan gan shi, Shi ya mutu domina."] },
        { verse: "Korus", text: ["Fuska da fuska zan gan shi, Can cikin gajimare,", "Cikin dukan ɗaukakarsa, Zan gan shi wata rana."] },
        { verse: 2, text: ["A yanzu kam ina gani, Daukakarsa shiryayyiya,", "Ranar albarka na zuwa, Da zan ga ɗaukakarsa."] },
        { verse: 3, text: ["Zan yi murna a gabansa, In wahalar ta ƙare,", "Hanyoyi zai zama da kyau, Za a kawas da duhu."] },
        { verse: 4, text: ["Zan ga loto mai albarka! Fuska, fuska zan san shi,", "Fuska, fuska da mai fansa, Shi Yesu mai ƙaunata."] }
      ],
      history: ""
    },
    "HBH476": {
      title: "Kamar Dai Yashin Teku",
      number: "HBH476",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ALFORD",
      meter: "7.6.8.6.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kamar dai yashin teku, Fansassu, tsarkakku,", "Ga ɗaukakarka a kan su, Sun taru gare ka,", "An gama, an gama duk, Yaƙi da zunubi,", "Sun buɗe ƙofofin sama, Don masun nasara."] },
        { verse: 2, text: ["Waƙarmu halleluya, Ta cika ko'ina,", "Da garayu dubu ɗaya, Ta nuna nasara,", "Yau ne rana shiryayyiya, Da ka yi dominmu,", "Da za ka cire damuwarmu. Ka ba mu albarka"] },
        { verse: 3, text: ["Shi za ya marabce mu, Can cikin gidansa,", "Yana ƙulla zumuncinmu, Can babu rabuwa,", "Sai farin ciki kullum, Da babu kamarta,", "Babu marayu fa a can, Balle ma gwamraye."] }
      ],
      history: ""
    },
    "HBH477": {
      title: "Urushalima Wadda Ke Cike Da Albarka",
      number: "HBH477",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "EWING",
      meter: "7.6.7.6.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Urushalima wadda ke, Cike da albarka", "Cikin damuwata, Da nauyin zuciya", "Ni ba zan iya faɗan murnar da ke can ba,", "Darajar Urushalima, ba ta misaltuwa"] },
        { verse: 2, text: ["Suna tsaye a kursiyin, suna raira waƙa,", "Su haska da mala'iku, da masu shahada", "Yesu na tare da su, haske na saduda", "Albarkunsa a kansu, basu misaltuwa."] },
        { verse: 3, text: ["Ya ƙasa mai albarka, ko zan ga fuskarki?", "Ya ƙasa mai albarka, ko zan ga alherinki?", "Ku yi murna 'yan Adam yana tare da ku", "Ku nasa ne, nasa ne, nasa har abada. AMIN"] }
      ],
      history: ""
    },
    "HBH478": {
      title: "A Gefen Kogin Urdun",
      number: "HBH478",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "O'KANE",
      meter: "C.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina gefen kogin Urdun, Cike da marmari,", "Zuwa ƙasa mai daraja, Can dukiya ta take."] },
        { verse: "Korus", text: ["Za mu huta cikin farin ciki, A gidan Allah mai daraja,", "Mu raira waƙar yabo irin ta Musa.Zaune da Yesu koyaushe"] },
        { verse: 2, text: ["Bisan duk duniya da sammai, Zan ga ɗaukakarsa", "Can ne Yesu zai yi mulki, Zai kawas da duhu"] },
        { verse: 3, text: ["Babu gurbataciyar iska, Da za ta kai ƙasar,", "Ciwo, damuwa, da mutuwa, Duk babu su a can."] },
        { verse: 4, text: ["Yaushe zan kai wannan gida, In yi murna kullum?", "Yaushe zan ga fuskar uba, In yi hutu da shi?"] }
      ],
      history: ""
    },
    "HBH479": {
      title: "A Gefen Kogin Urdun",
      number: "HBH479",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PROMISED LAND",
      meter: "C.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina gefen kogin Urdun, Cike da marmari", "Zuwa ƙasa mai daraja, Can dukiyata take."] },
        { verse: "Korus", text: ["Za ni ƙasar alkawali, Za ni ƙasar alkawali", "Wa zai tafi tare da ni? Za ni ƙasar alkawali"] },
        { verse: 2, text: ["Bisan duk duniya da sammai, Zan ga ɗaukakarsa", "Can ne Yesu zai yi mulki, Zai kawas da duhu"] },
        { verse: 3, text: ["Babu gurbataciyar iska, Da za ta kai ƙasar", "Ciwo, damuwa, da mutuwa, Duk babu su a can."] },
        { verse: 4, text: ["Yaushe zan kai wannan gida, In yi murna kullum?", "Yaushe zan ga fuskar uba, In yi hutu da shi?"] }
      ],
      history: ""
    },
    "HBH480": {
      title: "Tuna Da Gidanmu A Can",
      number: "HBH480",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HOME OVER THERE",
      meter: "8.9.9.8. With Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tuna da gidanmu a can, Gida wanda ke da daraja,", "Inda tsarkakku suka taru, Sanye da fararen kaya,", "A can fa, a can fa, Tuna da gidanmu a can,", "A can fa, a can fa, a can fa, Tuna da gidanmu a can."] },
        { verse: 2, text: ["Tuna da abokai a can, Da sun riga mu gidan gaskiya", "Da waƙoƙi da suke ta yi, A gaban kursiyin Allah", "A can fa, a can fa, Tuna da abokai a can", "A can fa, a can fa, a can fa, Tuna da abokai a can"] },
        { verse: 3, text: ["Mai Cetona yana a can 'Yan'uwa suna hutu a can", "In zan kauce wa damuwata, Bar in je ƙasa ta a can", "A can fa, a can fa, Mai Cetona yana a can", "A can fa, a can fa, a can fa, Mai cetona yana a can"] },
        { verse: 4, text: ["Komawata ta yi kusa Rayuwata ta kusan ƙarewa", "Masu ƙaunata da yawa can, Na yin tsaro da jirana", "A can fa, a can fa, Ni ma zan koma can gida", "A can fa, a can fa, a can fa, Ni ma zan koma can gida."] }
      ],
      history: ""
    },
    "HBH481": {
      title: "Ko Za Mu Taru A Sama",
      number: "HBH481",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HANSON PLACE",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ko za mu taru a sama, Tare da mala'iku,", "Muna murna har abada, Kewaye da kursiyinsa."] },
        { verse: "Korus", text: ["In za mu taru a sama, Gida mai kyau gida mai kyau sosai", "Za mu taru da tsarkakkunsa, Kewaye da kursiyinsa."] },
        { verse: 2, text: ["Yayin da muke shigowa, Haskenka ya haskaka", "Za mu yi maka sujada, Har abada abadin."] },
        { verse: 3, text: ["Kafin dai mu kai can sama, Mun bar dukan wahalu,", "Cikin alherinka duka, Ka ba mu rawanin rai."] },
        { verse: 4, text: ["Mun kusa mu kai can sama, Mun kusan barin duniya,", "Za mu yi ta farin ciki, Da waƙoƙin salama,"] }
      ],
      history: ""
    },
    "HBH482": {
      title: "Ran Da Aikinmu Ya Kare",
      number: "HBH482",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ROLL CALL",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ran da aikin mu ya ƙare cikin wannan duniya,", "Za mu hau mu zauna gun mai cetonmu,", "Za mu huta daga ƙuncinmu, mu yi ta zamanmu,", "Wurin Yesu Kristi, Ubangijinmu."] },
        { verse: "Korus", text: ["Za ya kira mu a sama,", "Za mu shiga gaban Allah,", "Za mu wurin mai cetonmu,", "Zuwa gidan da ya shirya dominmu."] },
        { verse: 2, text: ["Can a gida mai darajar nan, a gaban Allahnmu,", "Za mu yi sujada gaban kursiyinsa,", "Za mu haɗa kai da masu bi na dukan zamanai,", "Za mu yi ta yabon Yesu, Mai Ceto."] },
        { verse: 3, text: ["Can ma gane duk dalilin ƙuncinmu a duniya,", "Za mu gane yawan ceton da ya yi,", "Za mu yi ta godiya domin dukan aikinsa fa,", "Za mu yabi sunan Yesu, Mai ceto."] },
        { verse: 4, text: ["Gaba dai, mu masu bin sa, Har mu ga Mai Cetonmu,", "Wata rana ƙofar sama, Za ta buɗe dominmu."] }
      ],
      history: ""
    },
    "HBH483": {
      title: "Zo Mu Yabi Kaunar Yesu",
      number: "HBH483",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "HEAVEN",
      meter: "8.7.8.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zo, mu yabi ƙaunar Yesu, Jinƙansa da alherinsa", "Yana shirya mana wuri, Cikin sama gun Uban."] },
        { verse: "Korus", text: ["Can sama, wurin Yesu, Masu bi za su taru wurinsa,", "Za mu raira waƙa, Mu raira waƙar nasara."] },
        { verse: 2, text: ["Lokacin da muke nan a duniya, 'Yar wahala muke sha,", "Amma ran da za mu sama, Farin ciki za mu yi."] },
        { verse: 3, text: ["Bi shi nan da dukan zuciya, Yi aniya cikin aikinsa", "Za mu manta da wahala, In mun shiga mulkinsa."] },
        { verse: 4, text: ["Gaba dai, mu masu bin sa, Har mu ga Mai Cetonmu,", "Wata rana ƙofar sama, Za ta buɗe dominmu."] }
      ],
      history: ""
    },
    "HBH484": {
      title: "Sun Faɗa Mani Game Da Gida A Can",
      number: "HBH484",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "THE UNCLOUDED DAY",
      meter: "12.10.12.10. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sun faɗa mani game da gida a can,", "Sun ce mani gidan na da nisa,", "Sun ce mani gidan nan fa babu damuwa,", "Ranar zuwa babu ko damuwa,"] },
        { verse: "Korus", text: ["Ƙasar da ba damuwa,", "Ya ƙasar da ba damuwa,", "Sun ce mani gidannan fa babu damuwa,", "Ranar zuwa babu ko damuwa."] },
        { verse: 2, text: ["Sun ce mani can ne abokaina sun je,", "Sun ce mani gidan na da nisa,", "Wurin da itacen rai ke ƙamshi ciki,", "Wannan rana da babu damuwa."] },
        { verse: 3, text: ["Sun ce yana yin murmushi ga 'ya'yansa,", "Murmushinsa na koran wahala,", "Sun ce can babu hawaye har abada,", "A kasar nan da babu damuwa."] }
      ],
      history: ""
    },
    "HBH485": {
      title: "Wannan Zai Zama Daukaka",
      number: "HBH485",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GLORY SONG",
      meter: "10.10.10.10. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "RAYUWA BAYAN MUTUWA",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["In aiki da famana sun kare,", "Har na je gidan nan mai daraja,", "In zauna da uba ina yabo,", "Har abada zan yi ta ɗaukaka."] },
        { verse: "Korus", text: ["Wannan zai zama ɗaukaka,", "Ɗaukakata, ɗaukakata,", "Cikin alheri zan ga fuskarsa,", "Wannan zai zama mani ɗaukaka."] },
        { verse: 2, text: ["A cikin alherinsa mai yawa,", "Ina da wurin zama a sama,", "Zaune can in dubi fuskarsa,", "Har abada zan yi ta ɗaukaka."] },
        { verse: 3, text: ["Kaunatattun abokai suna can,", "Za mu yi farin ciki mai yawa,", "Zan yi murmushi da Mai Cetona,", "Har abada zan yi ta ɗaukaka."] }
      ],
      history: ""
    },
    "HBH486": {
      title: "Ya Allahna",
      number: "HBH486",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NATIONAL ANTHEM",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Allahna, na yi ta yin mamaki", "Duk halittu, da hannunka yayi,", "Ga taurari, da rugugin hadari,", "Ikonka ya cika dukan duniya."] },
        { verse: "Korus", text: ["Raina ya raira, Waƙa gare ka,", "Kai mai girma, Mai girma ne,", "Raina ya raira, Waƙa gare ka,", "Kai mai girma, Mai girma ne."] },
        { verse: 2, text: ["Duk sa'ad da na shiga cikin jeji,", "Ga tsuntsaye, na raira yabonka,", "Kan tuddanka, da ka yi su kyawawa,", "Na ji iska da ruwa na zubowa."] },
        { verse: 3, text: ["Da na tuna Allah ya aiko Ɗansa,", "Don ya mutu, wannan ban gane ba,", "Kan gicciye ya ɗauke damuwata,", "Da jininsa ya ɗauke laifina."] },
        { verse: 4, text: ["Ran da zai zo don ya kai ni gidansa,", "Zan yi murna a zuciyata sosai,", "Zan durƙusa, In yi masa sujada,", "Zan shaida cewa kai mai girma ne."] }
      ],
      history: ""
    },
    "HBH487": {
      title: "Bangaskiyar Uwayenmu",
      number: "HBH487",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AMERICA",
      meter: "6.6.4.6.6.6.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bangaskiyar Uwayenmu na raye", "Cikin waƙoƙi ko addu'a", "Cikin yaranta da ƙauna", "Kasancewarka na ko'ina", "Rayayyiyar bangaskiyar uwaye", "Za mu riƙe har abada."] },
        { verse: 2, text: ["Bangaskiyar Uwaye ƙaunataciya", "Tushen bangaskiya da alheri", "Tsarkakewarki ta tabbata", "Tushen bangaskiyar masu bi", "Rayayyar bangaskiyar uwaye", "Za mu riƙe har abada."] },
        { verse: 3, text: ["Bangaskiyar uwaye jagoranmu", "Tana jagoran matasa", "Tana haskaka tafiyarsu", "Tare da kulawar ruhu", "Rayayyiyar bangaskiyar uwaye", "Za mu riƙe har abada."] },
        { verse: 4, text: ["Bangaskiyar uwayenmu ta Krista,", "Cikin gaskiya da ƙarfafawa", "Na ceton gida da ikilisiya", "Karfafa mu da ruhunka", "Rayayyiyar bangaskiyar Krista", "Za mu riƙe har abada."] }
      ],
      history: ""
    },
    "HBH488": {
      title: "Idanuna Sun Ga Daukakarsa",
      number: "HBH488",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BATTLE HYMN",
      meter: "Irregular with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Idanuna sun ga ɗaukakar zuwan Ubangiji,", "Yana shafe zunubanmu don mu guji fushinsa,", "Ya kwance damararsa don mu guji fushinsa,", "Gaskiyar ta ci gaba."] },
        { verse: "Korus", text: ["Ɗaukaka shi haleluya", "Ɗaukaka shi haleluya", "Ɗaukaka shi haleluya", "Allah na ci gaba"] },
        { verse: 2, text: ["Na ganshi yana tsaro inda mutanensa suke,", "Sun shirya wurin sujada safe, rana da yamma,", "Da haskensa zan iya karanta maganarsa,", "Ranar ta ci gaba."] },
        { verse: 3, text: ["Shi ya hura ƙahonsa sai gaba gaba muke yi", "Yana tsabtacce zuciyar mutane a kursiyinsa", "Ya raina ƙarɓi maganarsa fa da farin ciki", "Allah na ci gaba."] },
        { verse: 4, text: ["Cikin ƙawa aka haifi Yesu Ubangijina", "Da ɗaukaka a wurinsa shi ya canza kai da ni", "Yadda mun zama tsarkakku bari mu yi 'yantaswa", "Tun yana ci gaba."] }
      ],
      history: ""
    },
    "HBH489": {
      title: "Arise O Compatriots",
      number: "HBH489",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "Ba a sani ba",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Arise o compatriots,", "Nigeria calls obey", "To serve our fatherland,", "With love and strength and faith", "The labour of our heroes past,", "Shall never be in vain", "To serve with heart and might,", "One nation bound in freedom", "Peace and unity."] },
        { verse: 2, text: ["O God of creation,", "Direct our noble course", "Guide our leaders right,", "Help our youth the truth to know", "In love and honesty to grow,", "And living just and true", "Great lofty height attain,", "To build a nation where peace", "And justice shall reign."] }
      ],
      history: ""
    },
    "HBH490": {
      title: "Zo Jama'a Yi Godiya",
      number: "HBH490",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. GEORGE'S, WINDSOR",
      meter: "7.7.7.7.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Zo jama'a yi godiya, Raira waƙar girbi dai", "An tattara su duka, Kafin bazara ta yi", "Allah shi ke bayarwa, Don biyan buƙatunmu", "Ku zo haikalin Allah, Raira waƙar girbi dai."] },
        { verse: 2, text: ["Mu gonar Allah ce fa, Mu raira masa yabo,", "An shuka alkama nan, Cikin yawan wahala,", "Farko, tsiro, sai ganye, Sai hatsi ya bayyana,", "Uba mai girbi ka sa, Mu zama da amfani."] },
        { verse: 3, text: ["Ubangijinmu zai zo, Zai fyauce zaɓaɓɓunsa,", "Daga gonarSa zai ware, Duk marasa gaskiya", "Mala'iku za su jefa, Mugaye cikin wuta", "Amma zai sanya adalai, A wuri mai daraja. AMIN"] }
      ],
      history: ""
    },
    "HBH491": {
      title: "Mun Gode Wa Allah",
      number: "HBH491",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NUN DANKET",
      meter: "6.7.6.7.6.6.6.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mun gode wa Allah, Da dukan zuciyarmu,", "Duniya na yin murna, Don girman ayyukansa,", "Tun muna jarirai, Ya albarkace mu", "Da yawan ƙaunarsa, Sun zama namu yau."] },
        { verse: 2, text: ["Allah mawadaci, Ka shigo rayuwarmu,", "Ba mu salamarka, Da zuciya ta yin murna,", "Ba mu salamarka, A loton damuwarmu", "'Yantar duk damuwarmu, Yau da har abada."] },
        { verse: 3, text: ["Yabo da ɗaukaka, Mun ba ka Ubangiji", "Allah Uba da Ɗa na, Mulki cikin sama", "Uba makaɗaici, Ɗaukaka duk naka ne", "Tun fil'azar har yau, Haka har abada. AMIN"] }
      ],
      history: ""
    },
    "HBH492": {
      title: "Mun Taru Tare",
      number: "HBH492",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "KREMSER",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mun taru don mu roƙi albarkar Allah,", "Kuma yana sanar da mu nufinSa,", "Miyagu da ke zalunci za su daina,", "Raira yabo ga Allah bai manta nasa."] },
        { verse: 2, text: ["Allahnmu yana kusa don ya bishe mu,", "Yana nuna ikon sarautarSa fa,", "Tun farkon yaƙinmu masu nasara ne,", "Allah kana tare da mu, mun yabe ka."] },
        { verse: 3, text: ["Duk mun ɗaukaka ka, shugaban yaƙinmu,", "Addu'armu ka zama garkuwarmu,", "Don jama'arka su tsere wa azaba,", "Bari a yabi sunanka: Ubangiji. AMIN"] }
      ],
      history: ""
    },
    "HBH493": {
      title: "Mun Yi Huda",
      number: "HBH493",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. ANSELM",
      meter: "7.6.7.6.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mun yi huɗa mun shuka, Iri a gona fa,", "Amma hannun Allah, Ne na ban ruwa da kula,", "Yana aiko da raɓa, Don hatsi ya girma,", "Da iska da rana fa, Yayyafin ruwa ma."] },
        { verse: 2, text: ["Shi ne mahalicci fa, Na abu kusa da nesa,", "Ya ƙawata furanni, Taurari su haska,", "Ya ciyar da tsuntsaye, Iska na biyayya,", "Balle mu ma 'ya'yansa, Yana ciyas da mu."] },
        { verse: 3, text: ["Muna godiya Uba, Domin alherinka,", "Lokacin shukan iri, Kana nan da mu fa,", "Ka karɓi kyautarmu duk, Domin ƙaunarka ma,", "Ka fi son zuciyarmu, Fa na tawali'u. AMIN"] }
      ],
      history: ""
    },
    "HBH494": {
      title: "Wakar Godiya",
      number: "HBH494",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "LYONS",
      meter: "10.10.11.11.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubangiji Mai Cetonmu sarki,", "Har abada za mu raira yabo,", "Mun zo bagadinka domin shafewa,", "Inda za mu sami salamarka fa."] },
        { verse: 2, text: ["Muna waƙar godiya gare ka,", "Don yalwar ƙasa, 'ya'yan itace,", "Domin maɓulɓular ruwa mafi kyau", "Domin kasancewar wurin sujada"] },
        { verse: 3, text: ["Ga girbi mai yawa na abinci,", "Daga gonaki da kuma saura,", "Ga makiyaya mai amfani ga mutum,", "Wannan kaɗan ne cikin albarkunka."] },
        { verse: 4, text: ["Ya Ubangiji mai mulki duka,", "Kai mai gaskiya ne kodayaushe,", "Ka zama garkuwarmu kullayaumi,", "Taimake mu kullum mu shaida godiya. AMIN"] }
      ],
      history: ""
    },
    "HBH495": {
      title: "Domin Albarkun Shekara",
      number: "HBH495",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "OLDBRIDGE",
      meter: "8.8.8.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Domin albarkun shekara, Domin duk abokanannu", "Domin salama a duniya, Muna godiya."] },
        { verse: 2, text: ["Domin rai da lafiya ma, Wanda muke mora kullum,", "Domin gida mai daraja, Muna godiya."] },
        { verse: 3, text: ["Domin ƙaunarka kuma dai, Da tunaninmu ke biɗa,", "Tana iza rayuwarmu, Muna godiya. AMIN"] }
      ],
      history: ""
    },
    "HBH496": {
      title: "Mu Raira Sabuwar Waka",
      number: "HBH496",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WALTHAM",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu raira sabuwar waƙa,", "Zuwa ga duniya duka,", "Ga shekara ta kai ƙarshe,", "Mu raira sabuwar waƙa."] },
        { verse: 2, text: ["Mu raira waƙa mai daɗi,", "Mai ɗauke da salo na da,", "Ya raina ka raira waƙa,", "Mai daɗi bisa shari'a,"] },
        { verse: 3, text: ["Ka kawar da ciwon nan fa,", "Ka kawar da mugun sha'awa,", "Ka kawar da tsohon gaba,", "Domin ka sami aljanna."] },
        { verse: 4, text: ["Ku kambama shi Jarumin,", "Mai alheri da tausayi,", "Kau da ayyukan duhun nan,", "Ku rungume shi Mai Ceto. AMIN"] }
      ],
      history: ""
    },
    "HBH497": {
      title: "Shekara Ta Kewayo",
      number: "HBH497",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AURELLA",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Shekara ta kewayo, Bari ta kasance", "Cikin aiki ko jira, Cikin shekarar nan,", "Shekara ta ci gaba, Shekara ta yabo", "Shekara ce ta shaida, Kasancewarka fa."] },
        { verse: 2, text: ["Shekara ce ta jinƙai, Domin alherinsa,", "Shekara ce ta murna, Daukakar fuskarka,", "Shekara ta jingina a gare ka kuma,", "Shekara ce ta bege, Da samun hutunka"] },
        { verse: 3, text: ["Shekarar hidima ce, Da shaida ƙaunarka,", "Shekarar izawa ce, Don aiki mai tsarki,", "Shekara ta kewayo, Bari ta kasance,", "Shekara mai amfani, Da sama da duniya. AMIN"] }
      ],
      history: ""
    },
    "HBH498": {
      title: "Uba Bari In Mika Shekarar Gare Ka",
      number: "HBH498",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NEW YEAR",
      meter: "7.5.7.5.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba bar in miƙa shekarar gare ka,", "A kowanne matsayi za ka sanya ni,", "Ko da cikin baƙin ciki zan kuɓuta,", "Addu'a ta kenan fa ka karɓi girma."] },
        { verse: 2, text: ["Yaro zai iya zaɓan inda zai zauna,", "Uba zai iya ƙin ba da abu mai kyau?", "Kana biyan buƙatunmu kulayaumi,", "Ba ka hana abin ɗaukakarka ba fa."] },
        { verse: 3, text: ["In ka ba ni murnarka mara iyaka,", "In ka sa rayuwa ta zama da ma'ana,", "Bari zuciyata ta raira yabonka,", "Bari samuna ya girmama sunanka. AMIN"] }
      ],
      history: ""
    },
    "HBH499": {
      title: "Wakar Kebewa",
      number: "HBH499",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ELLACOMBE",
      meter: "C.M.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gare shi wanda zuciyarmu ke masa sujada,", "Muna fa raira waƙar yabo zuwa gare ka,", "Mun keɓe wannan gida gare ka yau ya Allah,", "Bari manufar ta zama jigo a gare ka."] },
        { verse: 2, text: ["Hannunka mai taimako ne alheri mai yawa,", "Bari mazauninka shi kafu har abada fa,", "Kuma a yayin da shekarun nan ke wucewa,", "Bari zuciyar da ta yi tauri ta ga haskenka."] },
        { verse: 3, text: ["Ta wurin ruhunka bar zaɓaɓɓu su yi murna,", "Da ikonka suke ci gaba da wannan tsere,", "Bar leɓunan adalai su shaida bishararka,", "Har ƙabilu da harsuna su yabi Immanuel."] }
      ],
      history: ""
    },
    "HBH500": {
      title: "Wakar Tumsawa",
      number: "HBH500",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "KREMSER",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah ne Ubanmu mun yabi sunanka", "Domin jinƙanka a shekarun baya", "Bishewa da alherinka a tsararraki", "Ka kawo mu a yau sabuwar rana fa."] },
        { verse: 2, text: ["Taimake mu mu zama masu aminci", "Ga ikilisiyarka da aikin Kristi", "Bar mu zama masu biyayya da ba da kai", "Mu faɗaɗa aikinka da ke hannunmu"] },
        { verse: 3, text: ["Aikinmu fa bai fi wanda ubanninmu", "Suka yi da gaskiya da ƙwazo ba", "Mun sani duk tuddai za su kau a gabanmu", "In za ka bishe mu ka kasance da mu"] },
        { verse: 4, text: ["Yanzu muna tabbatar da miƙa kanmu", "Muna addu'a ka cika mu da alheri", "Sa bayinka su yi nasara har abada", "Bari mu yi tseren tare da aminci. AMIN"] }
      ],
      history: ""
    },
    "HBH501": {
      title: "Sahihiyar Kauna",
      number: "HBH501",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "O PERFECT LOVE",
      meter: "11.10.11.10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sahihiyar kauna ta fi ganewarmu,", "Mun zo da roƙo gaban kursiyinKa,", "Cika su da ƙauna mara iyaka,", "Wadda sun zama ɗaya a yau."] },
        { verse: 2, text: ["Cikakkiyar rayuwa ta zama tasu,", "Ta ƙauna, bangaskiya da jimrewa,", "Bege da lumana da ƙarfin hali,", "Da imani mara jijjiguwa."] },
        { verse: 3, text: ["Cika zuciyarsu da murna mai yawa,", "Ba su salama, ɗauke damuwarsu", "Rayuwar gobe, mai cike da bege,", "Kai ka ba da ƙauna madawwamiya. AMIN"] }
      ],
      history: ""
    },
    "HBH502": {
      title: "Muryarka Ce Ta Hada",
      number: "HBH502",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BLAIRGOWRIE",
      meter: "7. 6. 7. 6. D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muryarka ce ta haɗa, Auren nan na farko,", "Mai cike da albarka, Tana nan har yanzu,", "Alkawalin 'ya'yanka, Namiji da mace,", "Allah na tare da mu, Sa mana albarka."] },
        { verse: 2, text: ["Kasance ya Ubanmu, Ka miƙa macen nan,", "Yadda ka ba Adamu, Haƙarƙarinsa ne,", "Ka kasance Mai Ceto, Ka haɗa auren nan,", "Yadda ka haɗa biyu, Su yi zama tare."] },
        { verse: 3, text: ["Ka kasance ya ruhu, Don ka sa albarka,", "Kamar kai Yesu Kristi, Da ikilisiyarka,", "Shinge su da hannunka, Kawas da damuwarsu,", "Idan sun zo gare ka, Suka bi hanyarka. AMIN"] }
      ],
      history: ""
    },
    "HBH503": {
      title: "Mai Alheri Mai Daukaka",
      number: "HBH503",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MOTHERHOOD",
      meter: "8.7.8.7.7.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mai alheri, ka ɗaukaka, Mace kamar 'yar mace,", "Mutum ne haifaffen Allah, Shi da uba ɗaya ne", "Bar uwaye su zama, Tsarkakku a gare ka"] },
        { verse: 2, text: ["Yesu, kai haifuwar mace, Albarkaci uwaye,", "Ba mu ikon bi da 'ya'ya, Zuwa gare ka kullum,", "Bar 'ya'yanmu su miƙa, Kansu zuwa gare ka."] },
        { verse: 3, text: ["Kai ka yi aiki da Yusuf, Ka yi cikin ƙaskanci,", "Bari mu bi tafarkinka, Na aiki da haƙuri,", "Bari mu yi rayuwarmu, Duka zuwa gare ka."] },
        { verse: 4, text: ["Ka sha wuya dominmu fa, Don mutane su tsira,", "Ka jawo mutane gunka, An raina ka, an ƙi ka,", "Mun sa ka sha ƙaskanci, Mu shaida duniya ta ji. AMIN"] }
      ],
      history: ""
    },
    "HBH504": {
      title: "Ranar Uwa Mai Albarka",
      number: "HBH504",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MATER",
      meter: "C.M.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ranar uwaye mai albarka, Ga mu muna yabo", "Don godiyar duk abu mai kyau, Da ka ba mu kullum", "Albarkacin wannan rana, Ubanmu, da yalwa", "Ranar albarka da ƙauna, Bari mu yi yabo."] },
        { verse: 2, text: ["Ranar uwaye mai alheri, Ƙara bangaskiyarmu,", "Mu yaƙi dukan jaraba, Ya saki ruhunmu,", "Albarkacin wannan rana, Ubanmu, da yalwa,", "Ranar alheri da ƙauna, Bari mu yi yabo."] },
        { verse: 3, text: ["Ranar uwaye muhimmiya, Koya mana mu san,", "Amfanin ƙaunar junanmu, Ba mu salamarka,", "Albarkaci wannan rana, Ubanmu, da yalwa,", "Rana Muhimmiya da ƙauna, Bari mu yi yabo."] },
        { verse: 4, text: ["Ranar uwa mai mamaki, Kaunarka ga kowa,", "Maryamu ta taɓa tsaya, Kusa da gicciyenka,", "Albarkacin wannan rana, Ubanmu, da yalwa,", "Ranar mamaki da ƙauna, Bari mu yi yabo."] }
      ],
      history: ""
    },
    "HBH505": {
      title: "Fada Min Labarin Yesu",
      number: "HBH505",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "STORIES OF JESUS",
      meter: "8.4.8.4.5.4.5.4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Faɗa min labarin Yesu, Mai daɗin ji", "Abin da zan so ya faɗa, In yana nan", "Labarun hanya, Da na teku", "Labarun Yesu, Faɗa mini."] },
        { verse: 2, text: ["Bari in fara jin yara, Tare da shi,", "In ƙaunaci albarkarsa, A bisana,", "Da kalmominsa, Na alheri,", "Duka a cikin, Kaunar Yesu."] },
        { verse: 3, text: ["Zuwa cikin birni zan bi, Taron yara,", "In ɗaga ganyen dabino, A hannuna,", "Ina shelarsa, I zan raira,", "Hosanna Yesu, Shi ne sarki. AMIN"] }
      ],
      history: ""
    },
    "HBH506": {
      title: "Nakan Yi Tunannin Labarin Yesu",
      number: "HBH506",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SWEET STORY",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Nakan yi tunanin labarin Yesu,", "Yayin da yana nan duniya,", "Yadda ya maida yara 'yan garkinsa,", "Na so da ina tare da su."] },
        { verse: 2, text: ["Na so da hannunsa na bisa kaina,", "Hannunsa kewaye da ni,", "In kuwa ɗanɗana alherinsa, in ya ce,", "Bari yara su zo gare ni."] },
        { verse: 3, text: ["Zan tafi gunsa ina yin addu'a,", "In yi roƙo don ƙaunarsa,", "Idan na yi addu'a da gaskiya,", "Zan gan shi, in ji shi a sama. AMIN"] }
      ],
      history: ""
    },
    "HBH507": {
      title: "Tare Da Muryar Murna",
      number: "HBH507",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BERTHOLD",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Tare da muryar murna, 'Ya'yanka sun taru,", "Sun kawo maka yabo, Cikin waƙoƙinsu,", "Domin ɗaukakar sama, Kamar ruwan teku,", "Domin yalwa mai yawa, Karɓi sujadarmu."] },
        { verse: 2, text: ["Ba wanda ke ganinka, Hannu bai taɓa ka", "Halittarka ke shaida, Duka da na sammai", "Duniya da ɗaukakarta, Da duk mallakarmu", "Na shaida labarinka, Kai ne mai mulkinmu."] },
        { verse: 3, text: ["Me zai hana mu yabo, Cikin farin ciki", "Muna rayuwar gaskiya, Ga ƙawa ga ƙarfi", "Albarkacin aikinmu, Mu zama da gaskiya", "Har abada abadin, Muna yin yabonka. AMIN"] }
      ],
      history: ""
    },
    "HBH508": {
      title: "Mene Ne Zan Ba Yesu",
      number: "HBH508",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DEDICATION",
      meter: "7.6.8.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mene ne zan ba Yesu, Domin mutuwarsa", "Ta yaya zan ƙaunace shi, Ya mutu domina", "Zan ba shi dukan raina, Sa'annan in huta", "Duk bege da buƙatuna, Zan kawo gabansa."] },
        { verse: 2, text: ["Zan ba Yesu murya ta, In neme shi kullum,", "Zan tsarkake talent nawa, Don yabo da murna,", "Zan ba Yesu ƙarfina, Ta kowace hanya,", "Zan je inda ya aike ni, In cika nufinsa."] },
        { verse: 3, text: ["Zan ba Yesu dukiyata, Komai ƙanƙantarta,", "Karɓi dukan dukiyata, Sa mani albarka,", "Mene ne zan ba Yesu, Domin mutuwarsa,", "Zan ba shi dukan komaina, Ya mutu domina."] }
      ],
      history: ""
    },
    "HBH509": {
      title: "Ina Murna Domin Allah Uba",
      number: "HBH509",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "JESUS LOVES EVEN ME",
      meter: "10.10.10.10. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ina murna domin Allah Uba,", "Kaunarsa cikakkiya a littafin,", "Al'ajibansa cikin littafin,", "Mafi girma Yesu na ƙaunata."] },
        { verse: "Korus", text: ["Ina murna yana ƙaunata", "Yesu Kristi na ƙaunata", "Ina murna yana ƙaunata", "Yesu na ƙaunata"] },
        { verse: 2, text: ["Ko da na yi nisa da shi sosai,", "Cikin jinƙansa ya dawo da ni,", "Can a wurinsa ne zan kasance,", "In na tuna Yesu na ƙaunata."] },
        { verse: 3, text: ["Idan akwai waƙar da zan raira,", "Ran da zan ga fuskarsa Sarkinmu,", "Zan raira waƙar nan har abada,", "Kaunarsa abin al'ajibi ce."] }
      ],
      history: ""
    },
    "HBH510": {
      title: "Yesu Mai Tawali'u",
      number: "HBH510",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SEYMOUR",
      meter: "7.7.7.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu mai tawali'u, Lura da ƙaramin ɗa,", "Ka ji tausayina fa, Kira ni zuwa gunka"] },
        { verse: 2, text: ["Gare ka nake duba, Zama mani misali,", "Kai mai tawali'u ne, Ka taɓa zama yaro"] },
        { verse: 3, text: ["Ni zan zama kamarka, Ba ni zuciyar biyayya", "Kai mai tausayi ne fa, Ba ni irin zuciyarka"] },
        { verse: 4, text: ["Dan rago mai ƙaunarmu, A hannunka nake yau", "Bar in zama kamarka, Yi rayuwa cikina"] },
        { verse: 5, text: ["Sa'annan zan yabe ka, Da farin ciki kullum", "Sa'annan ne duniya, Za ta ganka cikina. AMIN"] }
      ],
      history: ""
    },
    "HBH511": {
      title: "Yabe Shi Kankananan Yara",
      number: "HBH511",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GOD IS LOVE",
      meter: "10.6.10.6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yabe shi fa ƙanƙananan yara, Allah, shi ƙauna ne,", "Yabe shi fa ƙanƙananan yara, Allah, shi ƙauna ne."] },
        { verse: 2, text: ["Yi ƙaunarsa ƙanƙananan yara, Allah, shi ƙauna ne", "Yi ƙaunarsa ƙanƙananan yara, Allah, shi ƙauna ne."] },
        { verse: 3, text: ["Yi godiya ƙanƙananan yara, Allah, shi ƙauna ne,", "Yi godiya ƙanƙananan yara, Allah, shi ƙauna ne."] }
      ],
      history: ""
    },
    "HBH512": {
      title: "Yesu Yana Kaunata",
      number: "HBH512",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CHINA",
      meter: "7.7.7.7. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu yana ƙaunata, Wannan na sakankance,", "Dukan yara nasa ne, Shi ne mai lura da su"] },
        { verse: "Korus", text: ["I yana so na, I yana so na", "Littafinsa ne ya bayyana mini"] },
        { verse: 2, text: ["Yesu yana ƙaunata, Mutuwarsa ta keɓe ni,", "Zai shafe zunubaina, Bar yara su zo gunsa"] },
        { verse: 3, text: ["Yesu yana ƙaunata, Ga ni nan mara ƙarfi,", "Daga can kursiyinsa, Ya maida ni mai ƙarfi."] },
        { verse: 4, text: ["Yesu yana ƙaunata, Kullum yana nan da ni,", "In na yi ta ƙaunarsa, Za ya kai ni Gidansa."] }
      ],
      history: ""
    },
    "HBH513": {
      title: "Mutane Za Su Kawo Iliminsu",
      number: "HBH513",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ELLON",
      meter: "7.6.7.6.D",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "AL'AMURA NA MUSAMMAN",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mutane za su iya, Kawo iliminsu", "Wadatarsu da girma, Karfi da lafiya", "Muma fa za mu kawo, Dukiyarmu ga Yesu", "Ga mu ba mu da komai, Me za mu kawo fa."] },
        { verse: 2, text: ["Za mu ba shi Zuciyarmu, Za mu yi yabonsa,", "Muna ta yin ƙoƙarin, Zama cikin tsarki,", "Wannan ne dukiyarmu, Da za mu ba Yesu,", "Wannan fa shi ne kyauta, Da zan iya kawo."] },
        { verse: 3, text: ["Za mu yi maka aiki, Kullum za mu yi shi,", "Mu faranta maka rai, A duk inda muke,", "Wannan shi ne dukiyarmu, Da za mu ba Yesu,", "Kyautarmu mafi girma, Yaro zai kawo duk. AMIN"] }
      ],
      history: ""
    },
    "HBH514": {
      title: "Albarku Daga Allah Ne",
      number: "HBH514",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "OLD 100TH",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Albarku daga Allah ne", "Yabe shi duka halittu", "Yabe shi duk mala'iku", "Yabi Uba, Da da Ruhu. AMIN"] }
      ],
      history: ""
    },
    "HBH515": {
      title: "Uba Na Cikin Haikalinsa",
      number: "HBH515",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "QUAM DILECTA",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba na cikin haikalinsa", "Yana cikin haikalinsa Mai Tsarki", "Bar duniya ta yi shiru", "Bari ta yi shiru a gabansa. AMIN"] }
      ],
      history: ""
    },
    "HBH516": {
      title: "Uba Na Cikin Haikalinsa",
      number: "HBH516",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SHAWNEE",
      meter: "IRREGULAR",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba na cikin haikalinsa", "Yana cikin haikalinsa Mai Tsarki", "Bar duniya ta yi shiru gabansa", "Yi shiru, shiru, yi shiru gabansa. AMIN"] }
      ],
      history: ""
    },
    "HBH517": {
      title: "Ji Addu'armu",
      number: "HBH517",
      author: "Ba a sani ba",
      composer: "WARREN M. ANGELL",
      tune: "JI ADDU'ARMU",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1907",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ya Uba ji addu'armu AMIN"] }
      ],
      history: ""
    },
    "HBH518": {
      title: "Ba Ni Tsabtar Zuciya",
      number: "HBH518",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PSALM 51:10",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Psalm 51:10",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ba ni tsabtar zuciya,", "Allah sabunta ruhu da ke cikina AMIN"] }
      ],
      history: ""
    },
    "HBH519": {
      title: "Za Mu Yi Sujada",
      number: "HBH519",
      author: "Ba a sani ba",
      composer: "JAMES BIGELOW",
      tune: "JAMES BIGELOW 1920",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1920",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu za mu taru, mu yi sujada,", "Yi maka sujada da gaskiya AMIN"] }
      ],
      history: ""
    },
    "HBH520": {
      title: "Allah Mai Kauna",
      number: "HBH520",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "VICTORY",
      meter: "8.8.8.4. with Hallelujah",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah, ƙauna. kai ne haske", "Duniya ta ga ɗaukakarka", "Mun yabe ka, mu naka ne", "Halleluyah. AMIN"] }
      ],
      history: ""
    },
    "HBH521": {
      title: "Mu Yi Masa Sujada",
      number: "HBH521",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PORTER",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu yabi Allah cikin girman Daukakarsa", "Yi masa bauta da murna AMIN"] }
      ],
      history: ""
    },
    "HBH522": {
      title: "Bishe Ni Allah",
      number: "HBH522",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "Ba a sani ba",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bishe ni Allah da adalcinka", "Bar in gene tafarkinka AMIN"] }
      ],
      history: ""
    },
    "HBH523": {
      title: "Ruhun Allahnmu Mai Rai",
      number: "HBH523",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "Ba a sani ba",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ruhun Ubangijinmu sauko kaina", "Ruhun Ubangijinmu sauka kaina", "Maida ni fa yadda ka so", "Ruhun Ubangijinmu sauko kaina. AMIN"] }
      ],
      history: ""
    },
    "HBH524": {
      title: "Daukaka Ga Uba",
      number: "HBH524",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GLORIA PATRI",
      meter: "First setting",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Daukaka ga Uba, tare da Da da Ruhu Mai Tsarki", "Yadda take tun a farko, haka take yanzu da har abada.", "Amin."] }
      ],
      history: ""
    },
    "HBH525": {
      title: "Daukaka Ga Uba",
      number: "HBH525",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GLORIA PATRI",
      meter: "Second setting",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Daukaka ga Uba,", "Tare da Da da Ruhu Mai Tsarki", "Yadda take tun a farko,", "Haka take yanzu da har abada. Amin AMIN"] }
      ],
      history: ""
    },
    "HBH526": {
      title: "Daukaka Ga Uba",
      number: "HBH526",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GLORIA PATRI",
      meter: "Third setting",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Daukaka ga Uba, Tare da", "Da da Ruhu Mai Tsarki", "Yadda take tun a farko,", "Haka take yanzu da har abada amin AMIN"] }
      ],
      history: ""
    },
    "HBH527": {
      title: "Yanzu Ga Duk Mai Bege",
      number: "HBH527",
      author: "Ba a sani ba",
      composer: "JAMES BIGELOW",
      tune: "JAMES BIGELOW 1920",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1920",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yanzu ga duk mai bege", "Cika mu da kauna", "Ji mu Uba. AMIN"] }
      ],
      history: ""
    },
    "HBH528": {
      title: "A Cikin Sunan Yesu",
      number: "HBH528",
      author: "Ba a sani ba",
      composer: "WILLIAM J. REYNOLDS",
      tune: "WILLIAM J. REYNOLDS 1920",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1920",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Cikin sunan Yesu AMIN"] }
      ],
      history: ""
    },
    "HBH529": {
      title: "Uba Mai Girma Ji Addu'armu",
      number: "HBH529",
      author: "Ba a sani ba",
      composer: "FELIX MENDELSSOHN",
      tune: "FELIX MENDELSSOHN 1909, 1847",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1909",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba mai girma, ji mu yanzu", "Sa albarkarka bisanmu yau. AMIN"] }
      ],
      history: ""
    },
    "HBH530": {
      title: "Ka Ji Addu'armu",
      number: "HBH530",
      author: "Ba a sani ba",
      composer: "GEORGE WHELPTON",
      tune: "GEORGE WHELPTON 1847-1930",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1847-1930",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ji addu'armu ya Ubangiji", "Matso kusa da mu, Ba mu salama. AMIN"] }
      ],
      history: ""
    },
    "HBH531": {
      title: "Ji Addu'armu Ya Uba",
      number: "HBH531",
      author: "Ba a sani ba",
      composer: "FREDERIC CHOPIN",
      tune: "FREDERIC CHOPIN 1810-1849",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1810-1849",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ji addu'armu, ya Uba", "Ta dalilin ceto. AMIN"] }
      ],
      history: ""
    },
    "HBH532": {
      title: "Bar Kalmar Bakina",
      number: "HBH532",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "PSALM 19:14",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Psalm 19:14",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bar Kalmar bakina, da duk tunanin", "Zuciyata su zama karɓaɓɓu gare ka yau", "Ƙarfina da cetona. AMIN"] }
      ],
      history: ""
    },
    "HBH533": {
      title: "Sa Albarku Kan Kyautarmu",
      number: "HBH533",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "CANONBURY",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Sa albarku kan kyautarmu", "Albarkaci tunaninmu", "Namu shi ne bangaskiya", "Duk sauran suna hannunka. AMIN"] }
      ],
      history: ""
    },
    "HBH534": {
      title: "Komai Namu Naka Ne",
      number: "HBH534",
      author: "Ba a sani ba",
      composer: "LUDWIG VAN BEETHOVEN",
      tune: "LUDWIG VAN BEETHOVEN 1770-1827",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "1770-1827",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Komai namu naka ne", "Daga ciki mun miƙa maka. AMIN"] }
      ],
      history: ""
    },
    "HBH535": {
      title: "Mun Baka Naka Fa",
      number: "HBH535",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "Ba a sani ba",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mun Baka Naka Fa, kowane iri ce", "Duk mallakarmu taka ne", "Yarda gare ka ne AMIN"] }
      ],
      history: ""
    },
    "HBH536": {
      title: "Dukan Kome Naka Ne",
      number: "HBH536",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "Herr Jesus Christ",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Dukkan kome naka ne fa, Ba abin da za mu baka", "Sai dai zuciyar godiya, Mun kawo zuwa gabanka.", "AMIN"] }
      ],
      history: ""
    },
    "HBH537": {
      title: "Ka Ba mu Ruhun Bayaswa",
      number: "HBH537",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "STUTTGART",
      meter: "8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ka ba mu ruhun bayaswa, Mu yi da hannu sake", "Rayuwarmu da duk mallakarmu, Mun miƙa maka.", "AMIN"] }
      ],
      history: ""
    },
    "HBH538": {
      title: "Bari Alherin Yesunmu",
      number: "HBH538",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DORRNANCE",
      meter: "8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bari alherin Yesunmu, Da kaunar Allah Uba", "Tagomashin Ruhu Mai Tsarki, Su kasance bisanmu."] },
        { verse: 2, text: ["Don mu yi zaman zumunci, Da juna cikin Yesu", "Mu kasance cikin murna, Wadda babu irinta. AMIN"] }
      ],
      history: ""
    },
    "HBH539": {
      title: "Alherinsa Ya Bi da Ku",
      number: "HBH539",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MERIDIAN",
      meter: "Irregular",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Alherinsa ya bi da ku yau.", "Cikin Yesu Mai Ceto. AMIN"] }
      ],
      history: ""
    },
    "HBH540": {
      title: "Bari Alherin Yesunmu",
      number: "HBH540",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "BRYSON CITY",
      meter: "8.7.8.7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bari alherin Yesunmu", "Da ƙaunar Allah Uba", "Tagomashin Ruhu Mai Tsarki", "Su kasance bisanmu."] }
      ],
      history: ""
    },
    "HBH541": {
      title: "Allah Ya Albarkace Ku",
      number: "HBH541",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NUMBERS 6:24-26",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Numbers 6:24-26",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bari albarkar Allah,", "Da bishewarsa ta haskaka ku", "Ta yi maku alheri,", "Bari fuskarsa ta nuna ƙaunarsa", "Da salama, da salama."] }
      ],
      history: ""
    },
    "HBH542": {
      title: "Allah Ya Albarkace Ku",
      number: "HBH542",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NUMBERS 6:24-26",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Numbers 6:24-26",
      theme: "KALMOMINA YABO, AMSHI: Da Sa Albarka",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Albarkar Ubangiji, Ta nuna ƙaunarsa a kanku", "Da salama da salama, Bari fuskarsa ta nuna ƙauna", "Ya ba ku alherinsa, Alheri, ya yi alherinsa a bisanku", "AMIN"] }
      ],
      history: ""
    },
    "HBH543": {
      title: "Amin",
      number: "HBH543",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "DRESDEN",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin"] }
      ],
      history: ""
    },
    "HBH544": {
      title: "Amin",
      number: "HBH544",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "THREE FOLD",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin"] }
      ],
      history: ""
    },
    "HBH545": {
      title: "Amin",
      number: "HBH545",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "THREE FOLD Traditional",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin"] }
      ],
      history: ""
    },
    "HBH546": {
      title: "Amin",
      number: "HBH546",
      author: "Ba a sani ba",
      composer: "JOHN STAINER",
      tune: "FOUR FOLD",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "1840-1901",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin,"] }
      ],
      history: ""
    },
    "HBH547": {
      title: "Amin",
      number: "HBH547",
      author: "Ba a sani ba",
      composer: "JOHN STAINER",
      tune: "SEVEN FOLD",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "1840-1901",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin,", "Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH548": {
      title: "Amin",
      number: "HBH548",
      author: "Ba a sani ba",
      composer: "ELLEN KETT",
      tune: "ST PETER",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH549": {
      title: "Amin",
      number: "HBH549",
      author: "ELLEN KETT",
      composer: "ELLEN KETT",
      tune: "CHOLMONDELY",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH550": {
      title: "Amin",
      number: "HBH550",
      author: "A. GUNNER",
      composer: "A. GUNNER",
      tune: "GUNNER",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH551": {
      title: "Amin",
      number: "HBH551",
      author: "Ba a sani ba",
      composer: "JOHN STORER",
      tune: "PACEM",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "1858-1930",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH552": {
      title: "Amin",
      number: "HBH552",
      author: "Ba a sani ba",
      composer: "JOHN STORER",
      tune: "RESTARE",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "1858-1930",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin"] }
      ],
      history: ""
    },
    "HBH553": {
      title: "Amin",
      number: "HBH553",
      author: "Ba a sani ba",
      composer: "T.S. TEARNE",
      tune: "THE BELL CADENCE",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin, Amin, Amin, Amin, Amin,", "Amin, Amin, Amin, Amin, Amin, Amin, Amin."] }
      ],
      history: ""
    },
    "HBH554": {
      title: "Amin",
      number: "HBH554",
      author: "Ba a sani ba",
      composer: "JOHN STORER",
      tune: "FINIR",
      meter: "Ba a sani ba",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "1858-1930",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Amin, Amin,"] }
      ],
      history: ""
    },
    "HBH555": {
      title: "Ga Tsarkakku Duka",
      number: "HBH555",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SINE NOMINE",
      meter: "10. 10. 10. 10. with Alleluias",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ga tsarkakku da suke hutawa", "Sun shaida ka cikin bangaskiyarsu", "Sunanka Yesu, shi yi albarka", "Halleluya, halleluya"] },
        { verse: 2, text: ["Ka tsare su, kai mafakarsu ne", "Kai ne shugaba cikin yaƙinsu", "Kai ne hasken gaskiya, cikin duhu", "Halleluya, halleluya"] },
        { verse: 3, text: ["Bar sojojinka, cikin bangaskiya", "Su yi yaƙi kamar tsarkakku na da", "Su sami rawani na zinariya.", "Halleluya, halleluya"] },
        { verse: 4, text: ["Ɗaya cikin Uku, Uku cikin ɗaya,", "Mu kasassu ne, Kai mai albarka ne.", "Kai ne duka Uku, duka Kai ne", "Halleluya, halleluya"] },
        { verse: 5, text: ["Sa'ada rayuwa na mana wuya", "Muna jin alamun yin nasara.", "Ka ƙarfafa mu kuwa, mu yi ƙarfi", "Halleluya, halleluya"] },
        { verse: 6, text: ["A ko'ina, a duniya da sammai,", "Rundunan sama ba mai ƙirgawa,", "Suna yabo ga Uku cikin Ɗaya", "Halleluya, halleluya. AMIN"] }
      ],
      history: ""
    },
    "HBH556": {
      title: "Yesu Na Da Rai",
      number: "HBH556",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST ALBINUS",
      meter: "7. 8. 7. 8. with Alleluias",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Yesu na nan, mutuwa, Ba za ki razana mu ba", "Mun san Yesu yana nan, Kabari ina ƙarin ka?", "Halleluya."] },
        { verse: 2, text: ["Yana nan, haka mutuwa, Amma kuwa ƙofar sama", "Za ta kau da tsoronmu. Randa mun bar duniyar nan.", "Halleluya."] },
        { verse: 3, text: ["Shi ya mutu dominmu, Muna rayuwa cikinsa", "Bar mu zauna da tsarki, Mu ɗaukaka Mai Cetonmu.", "Halleluya"] },
        { verse: 4, text: ["Mun sani Yesu na nan, Ba zai fasa ƙaunarmu ba.", "Rai, mutuwa ikon Shaiɗan, Yesu zai kula da mu.", "Halleluya."] },
        { verse: 5, text: ["Yesu na nan kan kursiyi, Yana mulkin duniya duk.", "Bar mu je inda yake, Mu huta da shi a sama.", "Halleluya. AMIN."] }
      ],
      history: ""
    },
    "HBH557": {
      title: "Mu Naka Ne",
      number: "HBH557",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NEWINGTON",
      meter: "7. 7. 7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mu naka ne mai ƙauna, Ji mu daga kursiyinka.", "Bari mu zama naka, Nan duniya da lahira."] },
        { verse: 2, text: ["Mu naka ne, ya mai rai. Tsare mu daga Shaiɗan", "Kai ne rai, gaskiya, hanya. Bishe mu kullayomi"] },
        { verse: 3, text: ["Mu naka ne, Albarka, Ta masun hutunka ne,", "Mai ceto da abokinmu, Tsare mu har ga ƙarshe."] },
        { verse: 4, text: ["Mu naka ne, Ubanmu, Buƙatunmu, ka biya,", "Ka yafe mana laifi, Bishe mu zuwa sama."] }
      ],
      history: ""
    },
    "HBH558": {
      title: "Har Abada Tare Da Ubangiji",
      number: "HBH558",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "NEARER HOME",
      meter: "S.M.D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Bar mu zauna da kai, Amin, har abada", "Akwai rai cikin kalmarka, Rai, na har abada.", "Gani cikin jiki, Ban kula da shi ba", "Amma shi yana tsare ni, Ikon tafiya gida."] },
        { verse: 2, text: ["Can gidan Ubana, Mazaunin ruhuna", "Bangakiya ta nuna min, Ƙofofin gidanka", "Ruhuna na begen, Zuwa can gidanka.", "In sami gadon tsarkakku, Sabuwar Urshalima."] },
        { verse: 3, text: ["Akwai daidaitawa, Burina ya watse,", "Kamar kurciyar tufana, Zan tashi gaba da,", "Dukan damuwata, Babu sauran damuwa,", "Yayin da ina ta murna, Ya ba ni salama."] },
        { verse: 4, text: ["Da safe, da yamma, Da rana da dare", "Na ji mawaƙa na sama, Da mutanen duniya", "Ga Kalmar tashinsa, Ga shewar nasara,", "Yanzu, bar mu zauna da kai, Amin, har abada."] }
      ],
      history: ""
    },
    "HBH559": {
      title: "Jira Ban Da Gunaguni",
      number: "HBH559",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WAIT AND MURMUR NOT",
      meter: "L.M. with Refrain",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mai damuwa, akwai gida, Babu aiki ko ciwo a can", "Ba tsufa a can har abada, Wa ba zai so hutun nan ba?"] },
        { verse: "Korus", text: ["Jira, Jira, cikin hakuri, Jira ban da gunaguni,", "Jira, jira, Jira ban da gunaguni."] },
        { verse: 2, text: ["Lokacin da damuwa ta zo, Ubanmu yana sane fa.", "Neme shi cikin addu'a. Jira, ban da gunaguni"] },
        { verse: 3, text: ["In rayuwarka da tangarda, Tuna da shi mai fansarmu", "In damuwa ta mamaye ka, Ubanmu yana sane fa."] },
        { verse: 4, text: ["Ci gaba komai wahala, Ka yi ta yin gwagwarmaya", "Ranar hutunka na zuwa, Jira, ban da gunaguni"] }
      ],
      history: ""
    },
    "HBH560": {
      title: "Mutuwar Krista Riba Ce",
      number: "HBH560",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "REST",
      meter: "L.M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Mutuwar Krista riba ce, Babu falkawa don kuka", "Hutu ne da ba irin shi, Makiyi ba zai hana ba"] },
        { verse: 2, text: ["Mutuwar Krista, dadi ne, Mutum yayi don saduwa", "Da tsarkakku, muna cewa, Mutuwa ina karin ki"] },
        { verse: 3, text: ["Mutuwar Krista, salama, Falkawa ta da albarka,", "Ba tsoro, babu wahala, Da ta fi ikon Yesunmu."] },
        { verse: 4, text: ["Mutuwar Krista, domina, Bar mabuya mai daraja,", "Ta boye ni cikin toka, Har dai in ji karar kaho."] },
        { verse: 5, text: ["Mutuwar Krista, 'yan'uwanka, Na kabari nesa da kai,", "Naka barcin albarka ne, Babu falkawa don kuka."] }
      ],
      history: ""
    },
    "HBH561": {
      title: "Bankwanan Krista",
      number: "HBH561",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "GOOD NIGHT",
      meter: "10. 10. 10. 6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Kari",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Huta, dan'uwa, sai ka huta,", "Sa kanka bisan kirjin Mai Ceto,", "Yesunmu ya fi mu kaunarka,", "Sai mun sake saduwa."] },
        { verse: 2, text: ["Barci kamar irin na jariri,", "Falkawarka babu wahala,", "Hutunka fa sahihi ne kwarai,", "Sai mun sake saduwa."] },
        { verse: 3, text: ["Sai randa mun bar wannan duniya,", "Sai randa ya tara tumakinsa,", "Har babu sauran duhu a kanmu,", "Sai mun sake saduwa."] },
        { verse: 4, text: ["Sai mun ga hasken daukakar gicciye,", "Har sai Yesu ya ta da matattu,", "Sa'annan zai zo, ba da kaskanci ba,", "Sai mun sake saduwa."] },
        { verse: 5, text: ["Har sai kaunarsa ta canza mu duk,", "Cikin sifarsa za ka haskaka", "Sa'annan zai ba ka rawanin rai", "Sai mun sake saduwa"] },
        { verse: 6, text: ["Dan'uwa Sai mun sake saduwa", "Cikin dan lokaci, tsarkakkunsa", "Za su zauna cikin zumunci", "Sai mun sake saduwa"] },
        { verse: 7, text: ["Sai mun sadu kuma a gabansa,", "Sanye da tufa da zai ba nasa", "Mu gane kamar yadda an san mu.", "Sai mun sake saduwa"] }
      ],
      history: ""
    },
    "HBH562": {
      title: "Ubanmu Mahallici",
      number: "HBH562",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AURELIA",
      meter: "7. 6. 7. 6. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ubanmu mahallici, Ka hada mutum biyu,", "Ta wurin hikimarka, Tun aure na farko", "Yau ga 'ya'yanka sun zo, Sabunta shirinka", "Ba su gidan salama, Da sahihiyar kauna"] },
        { verse: 2, text: ["Mai Ceto, mai albarka, Na Galili a da", "Kasance da 'ya'yanka, Masu kiranka yau", "Dukiyarsu ta duniya, Sa albarka bisa", "Cikin dandanawarsu, Su san kyautar ka ce."] },
        { verse: 3, text: ["Ya ruhun Allah Uba, Sa masu albarka", "Su zauna cikin tsarki, Su nuna kaunarka", "Ruhunka, ya tsare su, Daga yin zunubi,", "Bishe da rayuwarsu, Mallaki zuciyarsu."] },
        { verse: 4, text: ["Idan baka gina ba, A banza an gina,", "In babu albarkarka, Babu farin ciki,", "Ba abin da zai raba, Abinda ka hada,", "Kaunar da Ruhu ke so, Kauna har abada."] }
      ],
      history: ""
    },
    "HBH563": {
      title: "Allah Kauna Mun Yabe Ka",
      number: "HBH563",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SAFTFROM WALDEN",
      meter: "8. 8. 8. 6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah kauna mun yabe ka, Muna addu'a don 'ya'yanka", "Da sun hadu cikin aure, Bari su zama daya."] },
        { verse: 2, text: ["A kwanakin farin ciki, Da kome na tafiya daidai", "Cikin bangaskiya kadai fa, Bari su zama daya."] },
        { verse: 3, text: ["Sa'ad da guguwa ta taso, Murnar su ta koma ciki,", "Bar su dogara gare ka, Bari su zama daya."] },
        { verse: 4, text: ["Ko da mene ne rabonsu, Mai kyau ko wanda basu so,", "Ka ba su ikon jimrewa, Bari su zama daya"] },
        { verse: 5, text: ["Kauna ta kasance da su, Bar su boye a cikinka,", "Mutuwa ba za ta raba ba, Bari su zama daya. Amin"] }
      ],
      history: ""
    },
    "HBH564": {
      title: "Duk Mun Taru Cikin Murna",
      number: "HBH564",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. PETER",
      meter: "C. M.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Duk mun taru cikin murna, Domin addu'a,", "Don Yesu Kristi ya hada su yau, Cikin kauna kullum."] },
        { verse: 2, text: ["Cikin furci da suka yi, Aure alama ce,", "Ta kaunar Kristi gare mu, Cikin alkawali,"] },
        { verse: 3, text: ["Yau muna addu'a fa ga, Uku cikin Daya", "Alherinka ya bishe su, Cikin kauna kullum. AMIN"] }
      ],
      history: ""
    },
    "HBH565": {
      title: "Uba Mai Alheri, Cika",
      number: "HBH565",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "AUSTRIA",
      meter: "8. 7. 8. 7. D.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Uba mai alheri, cika, Bayinka da kaunarka", "A kan wannan tafiyarsu, Bari su shaida kaunar,", "Rike su kada su fadi, Ko su kauce a hanya,", "Ka zamar masu jagora, Kasance da su kullum."] },
        { verse: 2, text: ["Bar kaunarsu ta dawwama, Ba tare da damuwa ba", "Taimake su ranar wuya, Su sami rawanin rai", "Ba su kauna cikakkiya, Cire duka tsoronsu,", "Basu irin salamarka, Suna yin girma kullum."] },
        { verse: 3, text: ["Ba mu albarkarka ya Allah,", "Kyautar da ba irinta, Bar ta kasance bisansu,", "Kawas da damuwarsu, Bayan rayuwar wannan duniya,", "Bar su sami hutunka, Rungume su da hannunka,", "Har abada abadin."] },
        { verse: 4, text: ["Ubanmu mai ban tsoro, Zo ka mika 'yarka", "Yadda ka ba Adamu, Hakarkarinsa ne"] },
        { verse: 5, text: ["Ka zo ya Dan Maryamu, Hada hannayen nan,", "Su biyu su zama daya, Cikin kauna kullum."] },
        { verse: 6, text: ["Zo ya Ruhu Mai Tsarki, Sa masu albarka,", "Kai angon ikilisiya, Ka hatimce su fa."] },
        { verse: 7, text: ["Ka shinge rayuwarsu, Daga ikon Shaidan,", "Idan fa sun neme ka, Bar su bi hanyarka."] },
        { verse: 8, text: ["Bar su baka kambinsu, Cikakkiyar hadaya", "Har zuwa gidan murna, Da ikilisiyar Kristi."] }
      ],
      history: ""
    },
    "HBH566": {
      title: "Muryar Ka Ta Gonar Aidan",
      number: "HBH566",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MATRIMONY",
      meter: "7. 6. 7. 6.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Muryarka da ta kafa, Auren nan na farko", "Mai cike da albarka, Tana nan har a yau."] },
        { verse: 2, text: ["Cikin yardar zuciyarsu, Na yin auren Krista", "Triniti na nan da mu, Da dukan albarku"] },
        { verse: 3, text: ["Don 'ya'ya na albarka, Domin bangaskiya", "Don zumunci mai kyau fa, Da ba mai rabawa"] }
      ],
      history: ""
    },
    "HBH567": {
      title: "Ta Wurin Kaunar Mai Cetonmu",
      number: "HBH567",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SOOTHGATE",
      meter: "8. 4. 8. 4. 8. 8. 8. 4.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Aure",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Ta wurin kaunar Mai Ceto, Ba damuwa", "Yardarsa ba ta canzawa, Ba damuwa", "Jininsa ya warkas da mu, Alherinsa ya zo mana,", "Ya tsare mu da hannunsa, Ba damuwa."] },
        { verse: 2, text: ["Ko muna cikin tsanani, Ba damuwa", "Ceto cikakke namu ne, Ba damuwa", "Murna, in muna da Yesu, Tare da dubban albarku", "Tsarki cikin bishewarsa, Ba damuwa"] },
        { verse: 3, text: ["Muna begen gobe mai kyau, Ba damuwa,", "Muna raira alherinsa, Ba damuwa,", "Dogara ga kaunarsa fa, Yana biyan bukatunmu,", "Cikin rayuwa ko mutuwa, Ba damuwa"] }
      ],
      history: ""
    },
    "HBH568": {
      title: "Ubangiji Tushen Rai",
      number: "HBH568",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ST. THOMAS (2)",
      meter: "8. 7. 8. 7. 8. 7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Raɗa Suna da Miƙa Yaro",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah rai ka taba kwanciya, Kan shimfidar jariri", "A kafafun mahaifiyarka, Ta lura da kai kullum", "Albarkaci taruwanmu, Mun kawo bukatunmu"] },
        { verse: 2, text: ["Tashi da sanyin safiya, Muna ta fama kullum,", "Daga safe, zuwa yamma, Muna aikin hannunmu,", "Ba mu iko na hakuri, Na yin ayyukanmu fa."] },
        { verse: 3, text: ["Mun gode maka don 'ya'yanmu, Ka ba su kwanciyar rai,", "Farin cikin su cikakke, Kana ta lura da su,", "Ba mu ikon koya masu, Zaman gaskiya, koyaushe."] },
        { verse: 4, text: ["Ka ba mu ikon kwabe su, Har lokacin yaye su,", "Su baka girma da kauna, Su zauna cikin tsarki,", "Suna yi maka sujada, Da dukan zuciyarsu."] },
        { verse: 5, text: ["Tun da mukan kauce maka, Mun bi mummunar hanya,", "Ga jaraba, ga damuwa, Mu, iyaye na roko,", "Ka zama masu jagora, Tsare su da ikonka."] }
      ],
      history: ""
    },
    "HBH569": {
      title: "Makiyayi, Mai Ceto",
      number: "HBH569",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "ROUSSEAU",
      meter: "8. 7. 8. 7. 8. 7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Raɗa Suna da Miƙa Yaro",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Makiyayi, mai alheri, Kana kaunar kanana", "Ka tara su da hannunka, Tsare su a kirjinka", "Cikin dadi da kwanciyar rai, Daga dukan hatsari"] },
        { verse: 2, text: ["Makiyayi, lura da su, Kada su kauce maka", "Cikin dubanka, na kauna, Ka bi da tafiyarsu,", "Lura da su, kiyaye su, Su tsere wa zunubi."] },
        { verse: 3, text: ["Ka koya masu kalmarka, Haskaka zuciyarsu,", "Tsauta masu da kalmarka, Domin sanin gaskiya,", "Bari su san saukin binka, Da saukin yin aikinka."] },
        { verse: 4, text: ["Ka koya masu yabonka, Wanda 'ya'yanka ke yi,", "Na baki da na zuciya, Bar su kawo godiyarsu,", "Tare da duk tsarkakkunka, Su yi wa sarki yabo."] }
      ],
      history: ""
    },
    "HBH570": {
      title: "Kristi Mai Marabtan Yara",
      number: "HBH570",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "SHARON",
      meter: "8. 7. 8. 7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Raɗa Suna da Miƙa Yaro",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Kristi mai marabtan yara, Zuwa gunka Galili,", "Mun kawo dan jaririn nan, Domin samun albarkarka."] },
        { verse: 2, text: ["Ka karbi yabon iyaye, Ka basu alherinka,", "Bari kulawarsu mai kyau, Ta maida shi danka yau."] },
        { verse: 3, text: ["Ka kasance a gidansu, Bishe su kullayomi,", "Cika rayuwarsu da kauna, Muddin rayuwar dan nan"] },
        { verse: 4, text: ["Cikin tunanin zuciyarsa, Bar ka zama sarkinsa,", "Ya bi tafarkin tsarkakku, Ya ba ka duk zuciyarsa."] },
        { verse: 5, text: ["Kristi mai marabtan yara, Marabci wannan yaro,", "Bar hannunka ya tsare shi, Cikin rayuwarsa duk."] }
      ],
      history: ""
    },
    "HBH571": {
      title: "Ubangiji Mai Ba Da Rai",
      number: "HBH571",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "MANNHEIM",
      meter: "8. 7. 8. 7. 8. 7.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Allah Rai, sarkin daukaka, Ka yarda ka zama Da,", "Jariri a hannun uwa, Kana cike da iko,", "Ga 'ya'yan da kai ka bayas, Za mu amsa gare ka."] },
        { verse: 2, text: ["Tun randa aka haife ka, Kai ne Mai Ceton duniya", "Ka karrama mu da girma, Mata ba su sani ba", "Domin mun gane nufinka, Dole ne mu neme ka"] },
        { verse: 3, text: ["Ka ba mu tsabtar zuciya, Cikin duk ayyukanmu,", "Bar su yi koyi da mu, Domin kada su kauce,", "Bari su bi sawayenmu, Cikin hanya mai sauki."] },
        { verse: 4, text: ["Idan 'ya'yanmu na girma, Domin rayuwa mai kyau,", "Ka ba mu cikakken sani, Sabon ikon hadaya,", "Bangaskiya don lura da su, Da nuna masu kauna."] },
        { verse: 5, text: ["Bar mu ci gaba da kira, Cikin tsabtar zuciya,", "In mun bar wannan duniya, Mun bar duk wahalarmu,", "Dukan 'ya'ya da ka ba mu, Su zama rawaninmu"] }
      ],
      history: ""
    },
    "HBH572": {
      title: "Gidan Murna, Inda Ake Kaunarka",
      number: "HBH572",
      author: "Ba a sani ba",
      composer: "Ba a sani ba",
      tune: "WELWYN",
      meter: "11. 10. 11. 10.",
      key: "Ba a sani ba",
      scripture: "Ba a sani ba",
      theme: "KALMOMINA YABO, AMSHI: Gidan Krista",
      year: "Ba a sani ba",
      musicSigns: [],
      lyrics: [
        { verse: 1, text: ["Gidan murna, inda ake kaunarka fa,", "Ya abokinmu da mai cetonmu,", "Cikin baki duka babu kamarka,", "Mai cike da girma da daukaka."] },
        { verse: 2, text: ["Gidan murna, inda biyu sun hadu,", "Sun zama daya cikin bangaskiya,", "Mutuwa ce kadai za ta raba su,", "Ba kwa za ta hana zumunci ba."] },
        { verse: 3, text: ["Gidan murna, inda ka bada 'ya'ya,", "Muna addu'a da bangaskiya,", "Gare ka abokinsu daga sama,", "Ka bishe su cikin kaunarka duk."] },
        { verse: 4, text: ["Gidan murna, ba a manta da kai ba,", "Yayin da akwai farin ciki kwa,", "Gidan murna, inda mun kawo maka,", "Dukan damuwa, mai taimakonmu."] }
      ],
      history: ""
    }
  };

  // Return the hymn details or null if not found
  return hausaHymns[hymnId] || null;
  };

  const hymn = getHausaHymnDetails(id);
  
  if (!hymn) {
    return (
      <div className={`hymn-detail-page theme-${theme}`}>
        <div className="header-top-row">
          <div className="header-spacer"></div>
        </div>

        <div className="hymn-topic-section">
          <h1>Waka {id.replace('HBH', '')}</h1>
          <div className="hymn-topic">Ba a sani ba</div>
          <div className="hymn-source">Hausa Baptist Hymnal</div>
        </div>

        <div className="hymn-content">
          <div className="navigation-arrows">
            <button 
              className="nav-arrow prev-arrow" 
              onClick={handlePreviousHymn}
              disabled={parseInt(id.replace('HBH', '')) <= 1}
            >
              <span className="icon">←</span>
            </button>
            <button 
              className="nav-arrow next-arrow" 
              onClick={handleNextHymn}
              disabled={parseInt(id.replace('HBH', '')) >= 572}
            >
              <span className="icon">→</span>
            </button>
          </div>

          <div className="metadata-box">
             <div className="metadata-item">
               <span className="label">Lamba:</span>
               <span className="value">{id.replace('HBH', '')}</span>
             </div>
             <div className="metadata-item">
               <span className="value" style={{textAlign: 'center', width: '100%', fontStyle: 'italic'}}>
                 Bayanin waka ba ya nan.
               </span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Waka ${hymn.number}: ${hymn.title}`,
    text: `Duba wannan waka mai kyau: ${hymn.title} (Waka ${hymn.number})`,
          url: window.location.origin + `/hausa-hymn/${hymn.number}`
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        setShowShareTooltip(!showShareTooltip);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Function to copy link
  const copyLink = () => {
    const url = window.location.origin + `/hausa-hymn/${hymn.number}`;
    navigator.clipboard.writeText(url);
    setShowShareTooltip(false);
  };

  return (
    <div className={`hymn-detail-page theme-${theme}`}>
      <div className="header-top-row">
        <div className="header-spacer"></div>
      </div>

      <div className="hymn-topic-section">
        <h1>{formatTitleCase(hymn.title)}</h1>
        <div className="hymn-topic">{hymn.theme}</div>
        <div className="hymn-source">Hausa Baptist Hymnal</div>
      </div>

      <div className="hymn-content">
        <div className="navigation-arrows">
          <button 
            className="nav-arrow prev-arrow" 
            onClick={handlePreviousHymn}
            disabled={parseInt(id.replace('HBH', '')) <= 1}
          >
            <span className="icon">←</span>
          </button>
          <button 
            className="nav-arrow next-arrow" 
            onClick={handleNextHymn}
            disabled={parseInt(id.replace('HBH', '')) >= 572}
          >
            <span className="icon">→</span>
          </button>
        </div>

        <div className="floating-share">
          <button
            className="share-button"
            onClick={() => setShowNoteModal(true)}
            aria-label="Rubuta bayani"
            style={{ marginBottom: '10px' }}
          >
            <span className="icon">📝</span>
          </button>
          <button
            className="share-button"
            onClick={handleShare}
            aria-label="Raba waka"
          >
            <span className="icon">↗️</span>
          </button>
          {showShareTooltip && (
            <div className="share-tooltip visible">
              <div className="share-option" onClick={copyLink}>
                <span className="icon">📋</span>
                Kwafi Link
              </div>
              <div className="share-option" onClick={() => setShowShareTooltip(false)}>
                <span className="icon">✕</span>
                Rufe
              </div>
            </div>
          )}
        </div>

        <div className="metadata-box">
          <div className="metadata-row">
            <span className="metadata-label">Waka:</span>
            <span className="metadata-value">{hymn.number}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Marubucin Waka:</span>
            <span className="metadata-value">{hymn.author}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Marubucin Kida:</span>
            <span className="metadata-value">{hymn.composer}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Kida:</span>
            <span className="metadata-value">{hymn.tune}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Ma'auni:</span>
            <span className="metadata-value">{hymn.meter}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Maballi:</span>
            <span className="metadata-value">{hymn.key}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Nassi:</span>
            <span className="metadata-value">{hymn.scripture}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Jigo:</span>
            <span className="metadata-value">{hymn.theme}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Shekara:</span>
            <span className="metadata-value">{hymn.year}</span>
          </div>
        </div>

        <div className="hymn-text-section">
          <div className="lyrics" style={{ 
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            msUserSelect: 'text'
          }}>
            {(() => {
              let stanzaCounter = 1;
              
              // Handle verse objects format (like HBH2)
              if (hymn.lyrics.length > 0 && typeof hymn.lyrics[0] === 'object' && hymn.lyrics[0].verse) {
                // Find the chorus if it exists
                const korusVerse = hymn.lyrics.find(v => v.verse === 'Korus');

                return hymn.lyrics.map((verseObj, index) => {
                  const isKorus = verseObj.verse === 'Korus';
                  
                  // Skip rendering the standalone chorus in the main loop
                  if (isKorus) {
                    return null;
                  }

                  return (
                    <div key={`verse-${index}`} className="stanza-group">
                      <div className="stanza-container" style={{ marginTop: 0, marginBottom: 0 }}>
                        {verseObj.text.map((line, lineIndex) => {
                          const musicSign = hymn.musicSigns && hymn.musicSigns[index] && hymn.musicSigns[index][lineIndex];
                          return (
                            <div key={lineIndex} className="stanza" style={{ marginTop: 0, marginBottom: '1px' }}>
                              <div className="music-signs" style={{ color: musicSign ? '#888' : 'transparent' }}>
                                {musicSign || 'x'}
                              </div>
                              <div className="stanza-number">{lineIndex === 0 ? `${verseObj.verse}.` : ''}</div>
                              <div className="stanza-text">
                                <div className="line" style={{ marginTop: 0, marginBottom: '1px' }}>
                                  {line}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Inject Korus after each stanza if it exists */}
                      {korusVerse && (
                        <div className="refrain-container" style={{ marginTop: '12px', marginBottom: '12px' }}>
                          {korusVerse.text.map((line, lineIndex) => (
                            <div key={`korus-${index}-${lineIndex}`} className="refrain" style={{
                              fontStyle: 'italic',
                              marginLeft: '40px',
                              marginTop: 0,
                              marginBottom: 0
                            }}>
                              <div className="line" style={{
                                ...(lineIndex > 0 ? { marginLeft: '45px' } : { marginLeft: '4px' }),
                                marginTop: 0,
                                marginBottom: '4px'
                              }}>
                                {lineIndex === 0 ? <span className="refrain-marker" style={{ fontWeight: 'bold', fontStyle: 'italic', marginRight: '10px' }}>Korus:</span> : ""}
                                {line}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {index < hymn.lyrics.length - 1 && <div className="stanza-break" style={{ marginTop: 0, marginBottom: '2px' }}></div>}
                    </div>
                  );
                });
              }
              
              // Handle simple string format (like other hymns)
              return hymn.lyrics.reduce((acc, line, index, arr) => {
                const lineStr = String(line);
                
                if (lineStr === "") {
                  acc.push({ type: 'break' });
                } else {
                  if (acc.length === 0 || acc[acc.length - 1].type === 'break') {
                    acc.push({ type: 'stanza', lines: [lineStr] });
                  } else {
                    acc[acc.length - 1].lines.push(lineStr);
                  }
                }
                return acc;
              }, []).map((item, index) => (
                item.type === 'break' ? (
                  <div key={`break-${index}`} className="stanza-break" style={{ marginTop: 0, marginBottom: '2px' }}></div>
                ) : (
                  <div key={`stanza-${index}`} className="stanza-container" style={{ marginTop: 0, marginBottom: 0 }}>
                    {item.lines.map((line, lineIndex) => {
                      const globalLineIndex = hymn.lyrics.indexOf(line);
                      const musicSign = hymn.musicSigns && hymn.musicSigns[globalLineIndex];
                      return (
                        <div key={lineIndex} className="stanza" style={{ marginTop: 0, marginBottom: '1px' }}>
                          <div className="music-signs" style={{ color: musicSign ? '#888' : 'transparent' }}>
                            {musicSign || 'x'}
                          </div>
                          <div className="stanza-number">{lineIndex === 0 ? `${stanzaCounter}.` : ''}</div>
                          <div className="stanza-text">
                            <div className="line" style={{ marginTop: 0, marginBottom: '1px' }}>
                              {line}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {(() => { stanzaCounter++; return null; })()}
                  </div>
                )
              ));
            })()}
          </div>
        </div>

        <div className="hymn-history">
          <h3>Tarihi</h3>
          <p>{hymn.history}</p>
        </div>

        {showNoteModal && (
          <div className="modal-overlay" onClick={() => setShowNoteModal(false)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px',
              color: theme === 'dark' ? '#fff' : '#000'
            }}>
              <h3>Bayanin Waka</h3>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Rubuta bayaninka game da wannan waka..."
                style={{
                  width: '100%', height: '150px', marginTop: '10px', marginBottom: '20px',
                  padding: '10px', borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                  border: '1px solid #ccc'
                }}
              />
              <div className="modal-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button onClick={() => setShowNoteModal(false)} style={{
                  padding: '8px 16px', borderRadius: '4px', border: 'none',
                  backgroundColor: '#ccc', cursor: 'pointer'
                }}>
                  Rufe
                </button>
              </div>
            </div>
          </div>
        )}

        {showToolbar && (
          <div className="highlight-toolbar">
            <div className="toolbar-title">Zabi Launi:</div>
            <div className="color-options">
              {colors.map(color => (
                <button
                  key={color.name}
                  className={`color-option color-${color.name} ${selectedColor === color.name ? 'selected' : ''}`}
                  onClick={() => applyHighlight(color.name)}
                  title={color.label}
                >
                  <span className="color-circle"></span>
                </button>
              ))}
            </div>
            <div className="toolbar-actions">
              <button 
                className="toolbar-btn" 
                onClick={undo}
                disabled={historyIndex < 0}
                title="Koma baya"
              >
                ↶
              </button>
              <button 
                className="toolbar-btn" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                title="Ci gaba"
              >
                ↷
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HausaHymnDetail;
