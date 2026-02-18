// Hausa Language Utilities
// This file provides utilities for handling Hausa language features and diacritics

/**
 * Hausa Diacritical Marks and Special Characters
 * Hausa uses several diacritics to represent sounds not found in English
 */

export const HAUSA_SPECIAL_CHARS = {
  // Ejective consonants
  'ɓ': 'ɓ', // b with hook (implosive b)
  'Ɓ': 'Ɓ',
  'ɗ': 'ɗ', // d with hook (implosive d)
  'Ɗ': 'Ɗ',
  'ƙ': 'ƙ', // k with hook (ejective k)
  'Ƙ': 'Ƙ',
  'ƴ': 'ƴ', // y with hook
  'Ƴ': 'Ƴ',
  
  // Glottalized consonants
  'ts': 'ts', // voiceless alveolar affricate
  'sh': 'sh', // voiceless postalveolar fricative
  
  // Long vowels (marked with macron or doubled)
  'aa': 'aa',
  'ee': 'ee', 
  'ii': 'ii',
  'oo': 'oo',
  'uu': 'uu'
};

/**
 * Common Hausa Religious Terms and Their Proper Spellings
 */
export const HAUSA_RELIGIOUS_TERMS = {
  // Core religious terms
  'Allah': 'Allah',
  'Ubangiji': 'Ubangiji',
  'Yesu': 'Yesu',
  'Kristi': 'Kristi',
  'Ruhu': 'Ruhu',
  'Mai Tsarki': 'Mai Tsarki',
  'Baba': 'Baba',
  'Uba': 'Uba',
  'Sarki': 'Sarki',
  'Maɗaukaki': 'Maɗaukaki',
  
  // Prayer and worship terms
  'addu\'a': 'addu\'a', // prayer
  'addua': 'addu\'a',
  'yabo': 'yabo', // praise
  'waƙa': 'waƙa', // song
  'waka': 'waƙa',
  'sujada': 'sujada', // worship
  'godiya': 'godiya', // thanksgiving
  'ɗaukaka': 'ɗaukaka', // glory
  'daukaka': 'ɗaukaka',
  'girma': 'girma', // greatness
  'iko': 'iko', // power
  'ƙauna': 'ƙauna', // love
  'kauna': 'ƙauna',
  'jinƙai': 'jinƙai', // mercy
  'jinkai': 'jinƙai',
  'gafara': 'gafara', // forgiveness
  'ceto': 'ceto', // salvation
  'nasara': 'nasara', // victory
  'albarka': 'albarka', // blessing
  'baraka': 'albarka',
  'aminci': 'aminci', // faith/trust
  'bangaskiya': 'bangaskiya', // belief
  'tuba': 'tuba', // repentance
  'hakuri': 'hakuri', // patience
  'salama': 'salama', // peace
  'zaman lafiya': 'zaman lafiya', // peace
  'farin ciki': 'farin ciki', // joy
  'bege': 'bege', // hope
  'ƙaunar': 'ƙaunar', // love (possessive)
  'kaunar': 'ƙaunar',
  
  // Biblical terms
  'Littafi Mai Tsarki': 'Littafi Mai Tsarki', // Holy Bible
  'Injili': 'Injili', // Gospel
  'Manzanni': 'Manzanni', // Apostles
  'Annabawa': 'Annabawa', // Prophets
  'Mala\'iku': 'Mala\'iku', // Angels
  'malaikau': 'Mala\'iku',
  'Aljanna': 'Aljanna', // Heaven
  'Jahannama': 'Jahannama', // Hell
  'Kiama': 'Kiama', // Judgment
  'Tashin matattu': 'Tashin matattu', // Resurrection
  
  // Church terms
  'Ikklisiya': 'Ikklisiya', // Church
  'Cocin': 'Cocin', // Church (Baptist)
  'Baptist': 'Baptist',
  'Fasto': 'Fasto', // Pastor
  'Malami': 'Malami', // Teacher/Pastor
  'Diyako': 'Diyako', // Deacon
  'Elder': 'Elder',
  'Dattiijo': 'Dattiijo', // Elder
  'Baftisma': 'Baftisma', // Baptism
  'Cin Abinci na Ubangiji': 'Cin Abinci na Ubangiji', // Lord\'s Supper
  
  // Common expressions
  'Amin': 'Amin', // Amen
  'Halleluyah': 'Halleluyah', // Hallelujah
  'Hosanna': 'Hosanna',
  'Yabo ga Allah': 'Yabo ga Allah', // Praise to God
  'Godiya ga Ubangiji': 'Godiya ga Ubangiji', // Thanks to the Lord
  'Bari mu yi addu\'a': 'Bari mu yi addu\'a', // Let us pray
  'A cikin sunan Yesu': 'A cikin sunan Yesu' // In Jesus\' name
};

/**
 * Common Hausa Verbs in Religious Context
 */
export const HAUSA_RELIGIOUS_VERBS = {
  'yaba': 'yaba', // to praise
  'gode': 'gode', // to thank
  'yi addu\'a': 'yi addu\'a', // to pray
  'bauta': 'bauta', // to worship
  'bi': 'bi', // to follow
  'gaskata': 'gaskata', // to believe
  'tuba': 'tuba', // to repent
  'gafarta': 'gafarta', // to forgive
  'ceta': 'ceta', // to save
  'kare': 'kare', // to protect
  'jagoranta': 'jagoranta', // to guide
  'ƙaunata': 'ƙaunata', // to love
  'kaunata': 'ƙaunata',
  'taimaka': 'taimaka', // to help
  'karɓa': 'karɓa', // to receive/accept
  'karba': 'karɓa',
  'ba da': 'ba da', // to give
  'rera': 'rera', // to sing
  'kaɗa': 'kaɗa', // to play (music)
  'kada': 'kaɗa',
  'karanta': 'karanta', // to read
  'koya': 'koya', // to teach
  'koyi': 'koyi', // to learn
  'hukunta': 'hukunta', // to judge
  'sake': 'sake', // to forgive/release
  'tsarkake': 'tsarkake', // to sanctify
  'albarkaci': 'albarkaci' // to bless
};

/**
 * Function to apply proper Hausa spellings to text
 * @param {string} text - The text to apply corrections to
 * @returns {string} - Text with proper Hausa spellings
 */
export const applyHausaSpellings = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let result = text;
  
  // Apply religious term replacements
  Object.keys(HAUSA_RELIGIOUS_TERMS).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    result = result.replace(regex, HAUSA_RELIGIOUS_TERMS[term]);
  });
  
  // Apply verb replacements
  Object.keys(HAUSA_RELIGIOUS_VERBS).forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    result = result.replace(regex, HAUSA_RELIGIOUS_VERBS[verb]);
  });
  
  return result;
};

/**
 * Function to validate Hausa text for proper spellings
 * @param {string} text - The text to validate
 * @returns {object} - Validation result with suggestions
 */
export const validateHausaText = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, suggestions: [] };
  }
  
  const suggestions = [];
  const words = text.toLowerCase().split(/\s+/);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    
    // Check religious terms
    if (HAUSA_RELIGIOUS_TERMS[cleanWord]) {
      if (word !== HAUSA_RELIGIOUS_TERMS[cleanWord]) {
        suggestions.push({
          original: word,
          suggested: HAUSA_RELIGIOUS_TERMS[cleanWord],
          reason: 'Incorrect spelling of religious term'
        });
      }
    }
    
    // Check verbs
    if (HAUSA_RELIGIOUS_VERBS[cleanWord]) {
      if (word !== HAUSA_RELIGIOUS_VERBS[cleanWord]) {
        suggestions.push({
          original: word,
          suggested: HAUSA_RELIGIOUS_VERBS[cleanWord],
          reason: 'Incorrect spelling of verb'
        });
      }
    }
  });
  
  return {
    isValid: suggestions.length === 0,
    suggestions
  };
};

/**
 * Function to convert English hymn titles to Hausa equivalents
 * @param {string} englishTitle - The English hymn title
 * @returns {string} - Hausa equivalent title
 */
export const getHausaHymnTitle = (englishTitle) => {
  const titleMappings = {
    'Holy, Holy, Holy': 'Mai Tsarki, Mai Tsarki, Mai Tsarki',
    'Love Divine, All Loves Excelling': 'Ƙaunar Allah, Dukan Ƙauna',
    'All Creatures of Our God and King': 'Dukan Halittu na Allah da Sarki',
    'Jesus, the Very Thought of Thee': 'Yesu, Tunanin Ka Yana da Daɗi',
    'Jesus Is All the World to Me': 'Yesu Shi ne Dukan Duniya Gare Ni',
    'How Sweet the Name of Jesus Sounds': 'Yadda Sunan Yesu Ya Zama Mai Daɗi',
    'Spirit Divine, Attend Our Prayers': 'Ruhu Mai Tsarki, Ka Ji Addu\'armu',
    'Guide Me, O Thou Great Jehovah': 'Ka Jagorance Ni, Ya Jehovah Mai Girma',
    'The Lord Is My Shepherd': 'Ubangiji Shi ne Makiyayina',
    'All Glory, Laud, and Honor': 'Dukan Ɗaukaka, Yabo, da Girma'
  };
  
  return titleMappings[englishTitle] || englishTitle;
};

/**
 * Hausa Hymn Singing Guidelines
 */
export const HAUSA_SINGING_GUIDELINES = {
  pronunciationTips: [
    'ɓ is an implosive b - made by sucking air in',
    'ɗ is an implosive d - made by sucking air in', 
    'ƙ is an ejective k - made with a glottal stop',
    'ƴ represents a palatalized y sound',
    'Long vowels (aa, ee, ii, oo, uu) should be held longer',
    'Glottal stops (\') should be clearly articulated'
  ],
  rhythmicPatterns: [
    'Hausa has a stress-timed rhythm',
    'Emphasis usually falls on the penultimate syllable',
    'Long vowels affect the timing of the melody',
    'Ejective consonants may require slight pauses'
  ],
  culturalConsiderations: [
    'Hausa hymns often incorporate traditional praise patterns',
    'Call and response elements are common',
    'Arabic loanwords should maintain their original pronunciation',
    'Regional variations in pronunciation should be respected'
  ]
};

/**
 * Common Hausa Phrases for Worship
 */
export const HAUSA_WORSHIP_PHRASES = {
  openingPhrases: [
    'Bari mu yaba Ubangiji', // Let us praise the Lord
    'Mu taru don yin sujada', // We gather to worship
    'Yabo ga Allah Maɗaukaki', // Praise to Almighty God
    'Godiya ga Ubangiji' // Thanks to the Lord
  ],
  closingPhrases: [
    'A cikin sunan Yesu Kristi', // In the name of Jesus Christ
    'Amin da Amin', // Amen and Amen
    'Yabo ga Allah har abada', // Praise to God forever
    'Albarka ta kasance tare da mu' // May blessing be with us
  ],
  responses: [
    'Amin', // Amen
    'Halleluyah', // Hallelujah
    'Yabo ga Allah', // Praise to God
    'Godiya ga Ubangiji' // Thanks to the Lord
  ]
};

export default {
  HAUSA_SPECIAL_CHARS,
  HAUSA_RELIGIOUS_TERMS,
  HAUSA_RELIGIOUS_VERBS,
  applyHausaSpellings,
  validateHausaText,
  getHausaHymnTitle,
  HAUSA_SINGING_GUIDELINES,
  HAUSA_WORSHIP_PHRASES
};