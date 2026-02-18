import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HymnDetail.css';

function IgboHymnDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [showToolbar, setShowToolbar] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('igboHymnHighlights');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      setHistoryIndex(parsedHistory.length - 1);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('igboHymnHighlights', JSON.stringify(history));
  }, [history]);

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
    const currentNumber = parseInt(id.replace('IBH', ''));
    if (currentNumber > 1) {
      navigate(`/igbo-hymn/IBH${currentNumber - 1}`);
    }
  };

  const handleNextHymn = () => {
    const currentNumber = parseInt(id.replace('IBH', ''));
    const totalHymns = 100; // Placeholder count from EditionIgbo.js
    if (currentNumber < totalHymns) {
      navigate(`/igbo-hymn/IBH${currentNumber + 1}`);
    }
  };

  // Format title in proper title case
  const formatTitleCase = (title) => {
    if (typeof title !== 'string') return '';
    const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 
                           'into', 'nor', 'of', 'on', 'or', 'over', 'so', 'the', 'to', 'up', 'with'];
    const words = title.split(' ');
    return words.map((word, index) => {
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      if (lowercaseWords.includes(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const getIgboHymnDetails = (hymnId) => {
    // Return null for non-IBH IDs or IDs > 100
    if (!hymnId.startsWith('IBH')) return null;
    const num = parseInt(hymnId.replace('IBH', ''));
    if (isNaN(num) || num < 1 || num > 100) return null;

    // Placeholder data generation
    return {
      title: num === 1 ? "Amara Dị Ebube (Amazing Grace)" : 
             num === 2 ? "Chineke Nke Igwe (God of Heaven)" :
             num === 3 ? "Jesu Nke M Huru N'anya (Jesus Whom I Love)" :
             `Abu Igbo ${num} (Igbo Hymn ${num})`,
      number: hymnId,
      author: "Unknown Author",
      composer: "Unknown Composer",
      tune: "UNKNOWN",
      meter: "8.8.8.8",
      key: "C Major",
      scripture: "Psalms 100",
      theme: "Praise",
      year: "2024",
      lyrics: [
        {
          verse: 1,
          text: [
            "This is a placeholder for Igbo hymn lyrics.",
            "The actual content will be added later.",
            "Praise the Lord, O my soul.",
            "And all that is within me, praise His holy name."
          ]
        },
        {
          verse: 2,
          text: [
            "Verse 2 placeholder text.",
            "Sing praises to the King.",
            "Rejoice in His love.",
            "Forever and ever. Amen."
          ]
        }
      ],
      history: "History for this hymn is not yet available."
    };
  };

  const hymn = getIgboHymnDetails(id);

  // Function to handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Hymn ${id}: ${hymn ? hymn.title : 'Igbo Hymn'}`,
          text: `Check out this hymn: ${hymn ? hymn.title : id}`,
          url: window.location.href
        });
      } else {
        setShowShareTooltip(!showShareTooltip);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(false);
  };

  if (!hymn) {
    return (
      <div className={`hymn-detail-page theme-${theme}`}>
        <div className="header-top-row">
          <div className="header-spacer"></div>
        </div>

        <div className="hymn-topic-section">
          <h1>Abu {id.replace('IBH', '')}</h1>
          <div className="hymn-topic">Abu Adighi</div>
          <div className="hymn-source">Igbo Baptist Hymnal</div>
        </div>

        <div className="hymn-content">
          <div className="navigation-arrows">
            <button 
              className="nav-arrow prev-arrow" 
              onClick={handlePreviousHymn}
              disabled={parseInt(id.replace('IBH', '')) <= 1}
            >
              <span className="icon">←</span>
            </button>
            <button 
              className="nav-arrow next-arrow" 
              onClick={handleNextHymn}
              disabled={parseInt(id.replace('IBH', '')) >= 100}
            >
              <span className="icon">→</span>
            </button>
          </div>

          <div className="metadata-box">
             <div className="metadata-item">
               <span className="label">Nọmba:</span>
               <span className="value">{id.replace('IBH', '')}</span>
             </div>
             <div className="metadata-item">
               <span className="value" style={{textAlign: 'center', width: '100%', fontStyle: 'italic'}}>
                 Nkọwa abu adighi.
               </span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hymn-detail-page theme-${theme}`}>
      <div className="header-top-row">
        <div className="header-spacer"></div>
      </div>

      <div className="hymn-topic-section">
        <h1>{formatTitleCase(hymn.title)}</h1>
        <div className="hymn-topic">{hymn.theme}</div>
        <div className="hymn-source">Igbo Baptist Hymnal</div>
      </div>

      <div className="hymn-content">
        <div className="navigation-arrows">
          <button 
            className="nav-arrow prev-arrow" 
            onClick={handlePreviousHymn}
            disabled={parseInt(id.replace('IBH', '')) <= 1}
          >
            <span className="icon">←</span>
          </button>
          <button 
            className="nav-arrow next-arrow" 
            onClick={handleNextHymn}
            disabled={parseInt(id.replace('IBH', '')) >= 100}
          >
            <span className="icon">→</span>
          </button>
        </div>

        <div className="floating-share">
          <button 
            className="share-button"
            onClick={() => setShowNoteModal(true)}
            aria-label="Add note"
            style={{marginBottom: '10px'}}
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
            <span className="label">Nọmba:</span>
            <span className="value">{hymn.number}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Odee:</span>
            <span className="value">{hymn.author}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Onye Ọgụ Egwu:</span>
            <span className="value">{hymn.composer}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Egwu:</span>
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
            <span className="label">Afọ:</span>
            <span className="value">{hymn.year}</span>
          </div>
          <div className="metadata-item" data-type="scripture">
            <span className="label">Akwụkwọ Nsọ:</span>
            <span className="value">{hymn.scripture}</span>
          </div>
        </div>

        <div className="lyrics" style={{
          userSelect: 'text', 
          WebkitUserSelect: 'text', 
          MozUserSelect: 'text', 
          msUserSelect: 'text'
        }}>
          {hymn.lyrics.map((verse, index) => (
            <div key={index} className="stanza" style={{marginTop: 0, marginBottom: 0, display: 'flex', flexDirection: 'row'}}>
              <div className="stanza-number" style={{marginRight: '10px', fontWeight: 'bold'}}>{verse.verse}.</div>
              <div className="stanza-text">
                {verse.text.map((line, lineIndex) => (
                  <div key={lineIndex} className="line" style={{marginTop: 0, marginBottom: '1px'}}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showToolbar && (
        <div className="highlight-toolbar" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme === 'dark' ? '#333' : 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          maxWidth: '300px',
          justifyContent: 'center'
        }}>
          <div className="color-options" style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
            {colors.map((color) => (
              <button
                key={color.name}
                className={`color-btn ${selectedColor === color.name ? 'selected' : ''}`}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: `var(--highlight-${color.name}, ${color.name})`,
                  border: selectedColor === color.name ? '2px solid white' : 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onClick={() => applyHighlight(color.name)}
                title={color.label}
              />
            ))}
          </div>
          <div className="toolbar-actions" style={{display: 'flex', gap: '10px', width: '100%', justifyContent: 'center'}}>
            <button 
              onClick={undo} 
              disabled={historyIndex < 0}
              style={{
                padding: '5px 10px',
                cursor: historyIndex < 0 ? 'not-allowed' : 'pointer',
                opacity: historyIndex < 0 ? 0.5 : 1
              }}
            >
              Undo
            </button>
            <button 
              onClick={redo} 
              disabled={historyIndex >= history.length - 1}
              style={{
                padding: '5px 10px',
                cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
                opacity: historyIndex >= history.length - 1 ? 0.5 : 1
              }}
            >
              Redo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IgboHymnDetail;
