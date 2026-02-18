import React, { useState, useEffect } from 'react';

function HymnPage() {
    const [error, setError] = useState(null);
    const [hymns, setHymns] = useState([]);

    useEffect(() => {
        fetchHymns();
    }, []);

    const fetchHymns = async () => {
        try {
            const response = await fetch('/api/hymns');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setHymns(data);
        } catch (err) {
            setError(err.message); // Update error state
        }
    };

    return (
        <div>
            <h1>Hymn Page</h1>
            {error && <div className="error-message">{error}</div>} {/* Display error message */}
            <ul>
                {hymns.map(hymn => (
                    <li key={hymn.id}>{hymn.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default HymnPage; 