import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './CreatePlan.css';

function CreatePlan({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  
  const initialTitle = location.state?.title || 'Service';
  const headerColor = location.state?.color || '#007bff';

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hymnInput, setHymnInput] = useState('');
  const [hymns, setHymns] = useState([]);
  const [notes, setNotes] = useState('');

  const handleAddHymn = () => {
    if (hymnInput.trim()) {
      setHymns([...hymns, hymnInput.trim()]);
      setHymnInput('');
    }
  };

  const handleSave = () => {
    if (!name || !date) {
      alert('Please fill in Name and Date');
      return;
    }

    const newPlan = {
      id: Date.now(),
      type: type,
      name,
      date,
      hymns,
      notes,
      createdAt: new Date().toISOString()
    };

    const savedPlans = localStorage.getItem('readingPlans');
    const plans = savedPlans ? JSON.parse(savedPlans) : [];
    const updatedPlans = [newPlan, ...plans];
    
    localStorage.setItem('readingPlans', JSON.stringify(updatedPlans));
    navigate('/reading-plans');
  };

  return (
    <div className={`create-plan-container ${theme}`}>
      <div className="create-header" style={{ backgroundColor: headerColor }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>{initialTitle}</h1>
      </div>

      <div className="create-form">
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Service Name (e.g. Sunday Worship)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Add Hymn</label>
          <div className="hymn-input-group">
            <input 
              type="text" 
              placeholder="Hymn #"
              value={hymnInput}
              onChange={(e) => setHymnInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHymn()}
            />
            <button className="add-btn" onClick={handleAddHymn} style={{ backgroundColor: headerColor }}>
              Add
            </button>
          </div>
        </div>

        {hymns.length > 0 && (
          <div className="hymns-preview">
            {hymns.map((h, i) => (
              <span key={i} className="hymn-chip-removable">
                {h} 
                <button onClick={() => setHymns(hymns.filter((_, idx) => idx !== i))}>×</button>
              </span>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Notes</label>
          <textarea 
            placeholder="Add notes for this service..."
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button className="save-btn" onClick={handleSave} style={{ backgroundColor: headerColor }}>
          Save Plan
        </button>
      </div>
    </div>
  );
}

export default CreatePlan;
