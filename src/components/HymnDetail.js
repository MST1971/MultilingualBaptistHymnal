import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getHymnById } from '../data/hymns';
import { getHymnBySlug, getHymnByNumber, getNextHymnSlug, getPreviousHymnSlug } from '../data/hymns1975';
import { hymns1991 } from '../data/hymns1991';
import { hymns2008 } from '../data/hymns2008';

function HymnDetail({ theme }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [showToolbar, setShowToolbar] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  // Note state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');

  // Determine if we are looking at a 1956 hymn (numeric ID) or 1975 (slug)
  const isNumericId = !isNaN(parseInt(slug));

  // Parse edition
  const searchParams = new URLSearchParams(location.search);
  const edition = searchParams.get('edition');

  // Get hymn details from shared data
  let hymn = null;
  if (edition === '1991') {
      hymn = hymns1991.find(h => h.number.toString() === slug || h.id.toString() === slug);
  } else if (edition === '2008') {
      hymn = hymns2008.find(h => h.number.toString() === slug || h.id.toString() === slug);
  } else if (edition === '1975') {
      hymn = getHymnByNumber(slug) || getHymnBySlug(slug);
  } else if (edition === '1956') {
      hymn = getHymnById(slug);
  } else {
      // Legacy fallback
      hymn = isNumericId ? getHymnById(slug) : getHymnBySlug(slug);
  }

  // Load note
  useEffect(() => {
    if (hymn) {
      const savedNotes = localStorage.getItem('hymnNotes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        if (notes[hymn.number]) {
          setNote(notes[hymn.number]);
        } else {
          setNote('');
        }
      } else {
        setNote('');
      }
    }
  }, [hymn]);

  // Save note
  const saveNote = () => {
    const savedNotes = localStorage.getItem('hymnNotes');
    let notes = savedNotes ? JSON.parse(savedNotes) : {};
    
    if (note.trim()) {
      notes[hymn.number] = note;
    } else {
      delete notes[hymn.number];
    }
    
    localStorage.setItem('hymnNotes', JSON.stringify(notes));
    setShowNoteModal(false);
  };

  // Track recent visits
  useEffect(() => {
    if (hymn) {
      const visitedHymn = {
        number: hymn.number.toString().padStart(3, '0'),
        title: hymn.title,
        category: hymn.theme || 'Unknown',
        timestamp: new Date().toLocaleString()
      };

      const savedRecents = localStorage.getItem('recentlyVisitedHymns');
      let recents = savedRecents ? JSON.parse(savedRecents) : [];

      // Remove existing entry for this hymn if present (to move it to top)
      recents = recents.filter(h => h.number !== visitedHymn.number);

      // Add to beginning
      recents.unshift(visitedHymn);

      // Limit to 20 items
      if (recents.length > 20) {
        recents = recents.slice(0, 20);
      }

      localStorage.setItem('recentlyVisitedHymns', JSON.stringify(recents));
    }
  }, [hymn]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('hymnHighlights');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      setHistoryIndex(parsedHistory.length - 1);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hymnHighlights', JSON.stringify(history));
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
        hymnNumber: slug // Save the hymn number with the highlight
      });

      // Clear the selection
      selection.removeAllRanges();
      setShowToolbar(false);
      setSelectedColor(color);
    }
  };

  const handlePreviousHymn = () => {
    const currentNumber = parseInt(slug);
    const search = location.search;
    
    if (!isNaN(currentNumber)) {
      if (currentNumber > 1) {
        navigate(`/hymn/${currentNumber - 1}${search}`);
      }
    } else {
      const prevSlug = getPreviousHymnSlug(slug);
      if (prevSlug) {
        navigate(`/hymn/${prevSlug}${search}`);
      }
    }
  };

  const handleNextHymn = () => {
    const currentNumber = parseInt(slug);
    const search = location.search;
    
    if (!isNaN(currentNumber)) {
      // Allow navigation to next number without hard limit
      // (User will see empty page if out of bounds, or we could add bounds check per edition)
      navigate(`/hymn/${currentNumber + 1}${search}`);
    } else {
      const nextSlug = getNextHymnSlug(slug);
      if (nextSlug) {
        navigate(`/hymn/${nextSlug}${search}`);
      }
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

  const processLyrics = (lyrics) => {
    if (!lyrics || !Array.isArray(lyrics)) return [];

    // 1. Identify the Refrain Content
    let refrainLines = [];

    for (let i = 0; i < lyrics.length; i++) {
      const line = String(lyrics[i]);
      if (line.toLowerCase().startsWith('refrain:') || line.toLowerCase() === 'refrain') {
        // Capture refrain lines until empty line or end of array
        for (let j = i; j < lyrics.length; j++) {
          if (lyrics[j] === '') break;
          refrainLines.push(lyrics[j]);
        }
        break; // Found the first refrain definition, that's our source of truth
      }
    }

    // 2. Parse Stanzas
    const stanzas = [];
    let currentStanza = [];

    // We skip lines that are part of the "Refrain Definition" OR placeholders
    let i = 0;
    while (i < lyrics.length) {
      let line = String(lyrics[i]);

      // Check for Refrain start (case insensitive)
      if (line.toLowerCase().startsWith('refrain:') || line.toLowerCase() === 'refrain') {
        // We hit a refrain block. Retrieve the current stanza if any.
        if (currentStanza.length > 0) {
          stanzas.push(currentStanza);
          currentStanza = [];
        }
        // Skip this refrain block (consume until empty line or end)
        while (i < lyrics.length && String(lyrics[i]) !== '') {
          i++;
        }
        continue; // Continue outer loop (which might be at an empty line now)
      }

      // Check for empty line (Stanza separator)
      if (line === '') {
        if (currentStanza.length > 0) {
          stanzas.push(currentStanza);
          currentStanza = [];
        }
        i++;
        continue;
      }

      // Clean placeholders from the line
      // e.g. "Yonder shines the infant light: [Refrain]" -> "Yonder shines the infant light:"
      const cleanedLine = line.replace(/\[Refrain\]|\(Refrain\)/gi, '').trim();

      // If line was ONLY a placeholder, it becomes empty.
      if (cleanedLine.length > 0) {
        currentStanza.push(cleanedLine);
      } else {
        // If the line became empty (it was just a placeholder), treat it as a break potentially?
        if (currentStanza.length > 0) {
          stanzas.push(currentStanza);
          currentStanza = [];
        }
      }

      i++;
    }

    // Capture final stanza
    if (currentStanza.length > 0) {
      stanzas.push(currentStanza);
    }

    // 3. Reconstruct Structured Data
    const structures = [];
    stanzas.forEach((stanza, index) => {
      // Add Stanza
      structures.push({ type: 'stanza', lines: stanza });

      // If there are refrains to insert
      if (refrainLines.length > 0) {
        // Add Refrain
        structures.push({ type: 'refrain', lines: refrainLines });
      } else {
        // For hymns WITHOUT refrain, we still need breaks between stanzas (FIX for regression)
        if (index < stanzas.length - 1) {
          structures.push({ type: 'break' });
        }
      }
    });

    return structures;
  };

  if (!hymn) {
    // Return a simplified view with navigation if hymn is not found
    return (
      <div className={`hymn-detail-page theme-${theme}`}>
        <div className="header-top-row">
          <div className="header-spacer"></div>
        </div>

        <div className="hymn-topic-section">
          <h1>Hymn {slug}</h1>
          <div className="hymn-topic">Unknown Theme</div>
          <div className="hymn-source">{isNumericId ? "1956 Baptist Hymnal" : "1975 Baptist Hymnal"}</div>
        </div>

        <div className="hymn-content">
          <div className="navigation-arrows">
            <button
              className="nav-arrow prev-arrow"
              onClick={handlePreviousHymn}
              disabled={isNumericId ? parseInt(slug) <= 1 : !getPreviousHymnSlug(slug)}
            >
              <span className="icon">←</span>
            </button>
            <button
              className="nav-arrow next-arrow"
              onClick={handleNextHymn}
              disabled={isNumericId ? parseInt(slug) >= 572 : !getNextHymnSlug(slug)}
            >
              <span className="icon">→</span>
            </button>
          </div>
          
          <div className="metadata-box">
             <div className="metadata-item">
               <span className="label">Number:</span>
               <span className="value">{slug}</span>
             </div>
             <div className="metadata-item">
               <span className="value" style={{textAlign: 'center', width: '100%', fontStyle: 'italic'}}>
                 Hymn details not available.
               </span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  let stanzaCounter = 1;

  // Function to handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Hymn ${hymn.number}: ${hymn.title}`,
          text: `Check out this beautiful hymn: ${hymn.title} (Hymn ${hymn.number})`,
          url: window.location.origin + `/hymn/${hymn.number}`
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
    const url = window.location.origin + `/hymn/${hymn.number}`;
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
        <div className="hymn-topic">{hymn.theme || 'General'}</div>
        <div className="hymn-source">{isNumericId ? "1956 Baptist Hymnal" : "1975 Baptist Hymnal"}</div>
      </div>

      <div className="hymn-content">
        <div className="navigation-arrows">
          <button
            className="nav-arrow prev-arrow"
            onClick={handlePreviousHymn}
            disabled={isNumericId ? parseInt(slug) <= 1 : !getPreviousHymnSlug(slug)}
          >
            <span className="icon">←</span>
          </button>
          <button
            className="nav-arrow next-arrow"
            onClick={handleNextHymn}
            disabled={isNumericId ? parseInt(slug) >= 572 : !getNextHymnSlug(slug)}
          >
            <span className="icon">→</span>
          </button>
        </div>

        <div className="floating-share">
          <button
            className="share-button"
            onClick={() => setShowNoteModal(true)}
            aria-label="Add note"
            style={{ marginBottom: '10px' }}
          >
            <span className="icon">📝</span>
          </button>
          <button
            className="share-button"
            onClick={handleShare}
            aria-label="Share hymn"
          >
            <span className="icon">↗️</span>
          </button>
          {showShareTooltip && (
            <div className="share-tooltip visible">
              <div className="share-option" onClick={copyLink}>
                <span className="icon">📋</span>
                Copy Link
              </div>
              <div className="share-option" onClick={() => setShowShareTooltip(false)}>
                <span className="icon">✕</span>
                Close
              </div>
            </div>
          )}
        </div>

        <div className="metadata-box">
          <div className="metadata-item">
            <span className="label">Number:</span>
            <span className="value">{hymn.number}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Author:</span>
            <span className="value">{hymn.author}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Composer:</span>
            <span className="value">{hymn.composer}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Tune:</span>
            <span className="value">{hymn.tune}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Meter:</span>
            <span className="value">{hymn.meter}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Key:</span>
            <span className="value">{hymn.key}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Year:</span>
            <span className="value">{hymn.year}</span>
          </div>
          <div className="metadata-item" data-type="scripture">
            <span className="label">Scripture:</span>
            <span className="value">{hymn.scripture}</span>
          </div>
        </div>

        <div className="lyrics" style={{
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text'
        }}>

          {processLyrics(hymn.lyrics).map((item, index) => (
            item.type === 'break' ? (
              <div key={`break-${index}`} className="stanza-break" style={{ marginTop: 0, marginBottom: '2px', height: '1em' }}></div>
            ) : item.type === 'refrain' ? (
              <div key={`refrain-${index}`} className="refrain" style={{
                fontStyle: 'italic',
                marginLeft: '40px',
                marginTop: '12px',
                marginBottom: '12px'
              }}>
                {item.lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="line" style={{
                    ...(lineIndex > 0 ? { marginLeft: '45px' } : {}),
                    marginTop: 0,
                    marginBottom: '4px'
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div key={`stanza-${index}`} className="stanza" style={{ marginTop: 0, marginBottom: 0, display: 'flex', flexDirection: 'row' }}>
                <div className="stanza-number" style={{ marginRight: '10px', fontWeight: 'bold' }}>{stanzaCounter++}.</div>
                <div className="stanza-text">
                  {item.lines.map((line, lineIndex) => (
                    <div key={lineIndex} className="line" style={{ marginTop: 0, marginBottom: '1px' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="hymn-history">
          <h3>History</h3>
          <p>{hymn.history}</p>
        </div>
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
            <h3>Hymn Note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your personal notes for this hymn..."
              style={{
                width: '100%', height: '150px', marginTop: '10px', marginBottom: '20px',
                padding: '10px', borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                fontFamily: 'inherit'
              }}
            />
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowNoteModal(false)} style={{
                padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                backgroundColor: '#ccc'
              }}>Cancel</button>
              <button onClick={saveNote} style={{
                padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                backgroundColor: '#4a90e2', color: 'white'
              }}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      <div className={`highlight-toolbar ${showToolbar ? 'visible' : ''}`}>
        <div className="color-picker-title">Select Underline Color</div>
        <div className="color-grid">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`color-button ${color.name} ${selectedColor === color.name ? 'active' : ''}`}
              onClick={() => applyHighlight(color.name)}
              data-color={color.label}
              title={`${color.label} underline`}
            />
          ))}
        </div>
        <div className="undo-redo-buttons">
          <button
            className="undo-redo-button"
            onClick={undo}
            disabled={historyIndex < 0}
            title="Undo"
          >
            <span className="icon">↩</span> Undo
          </button>
          <button
            className="undo-redo-button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <span className="icon">↪</span> Redo
          </button>
        </div>
      </div>
    </div>
  );
}

export default HymnDetail;