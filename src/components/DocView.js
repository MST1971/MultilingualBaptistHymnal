import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './DocView.css';

function DocView({ theme = 'light' }) {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => ([
    {
      id: 'overview',
      title: 'Overview',
      content: `Multilingual Baptist Hymnal is a React project that provides hymn browsing across multiple editions and languages.

Key features:
- Theme switching (light/dark/blue)
- Hymn listing and detail pages
- Language support (Yoruba, Hausa, Igbo)
- Favorites and Responsive Reading pages`,
    },
    {
      id: 'routing',
      title: 'Routing',
      content: `Routing is defined in App.js using react-router v6. Core paths include:
/- '/' → Welcome
/- '/hymns' → HymnList
/- '/hymn/:slug' → HymnDetail
/- '/edition/*' → Edition pages per year/language
/- '/favorites' → FavoritesPage
/- '/responsive-reading' → ResponsiveReading
/- '/about' → About

DocView is available at '/docs'.`,
    },
    {
      id: 'components',
      title: 'Components',
      content: `Primary components are under src/components/:
- Navbar and MobileNav for navigation and theme controls
- HymnList and HymnDetail for hymn browsing
- Edition* components per edition/language
- YorubaHymnDetail and HausaHymnDetail for language-specific details
- FavoritesPage and ResponsiveReading for user features`,
    },
    {
      id: 'theme',
      title: 'Theme',
      content: `Theme state is stored in localStorage ('hymnTheme') and passed down from App. Buttons in Navbar toggle themes. Styles should respect classes for light/dark/blue.`,
    },
    {
      id: 'data',
      title: 'Data Sources',
      content: `Edition data is located under src/data (e.g., Edition1956.js). Images are under public/images and src/images.`,
    },
  ]), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        content: s.content,
        matches: s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q),
      }))
      .filter((s) => s.matches);
  }, [query, sections]);

  return (
    <div className={`docview-container theme-${theme}`}>
      <h2 className="docview-title">Documentation</h2>

      <div className="docview-grid">
        <aside className="docview-sidebar">
          <input
            className="docview-search"
            type="search"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <nav>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="section-link">{s.title}</a>
            ))}
          </nav>
          <div style={{ marginTop: 16 }}>
            <Link to="/">Back to Home</Link>
          </div>
        </aside>

        <div className="docview-content">
          {filtered.map((s) => (
            <section key={s.id} id={s.id} className="doc-section">
              <h3>{s.title}</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{s.content}</pre>
            </section>
          ))}
          {filtered.length === 0 && (
            <div className="doc-section">
              <h3>No results</h3>
              <p>Try a different keyword.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocView;