// Yoruba Tonations and Accent Utilities
// This file provides utilities for handling Yoruba language tonations and accents

/**
 * Yoruba Tone Marks
 * High tone: á, é, í, ó, ú
 * Mid tone: a, e, i, o, u (no mark)
 * Low tone: à, è, ì, ò, ù
 */

export const YORUBA_TONE_MARKS = {
  HIGH: {
    'a': 'á',
    'e': 'é', 
    'i': 'í',
    'o': 'ó',
    'u': 'ú',
    'A': 'Á',
    'E': 'É',
    'I': 'Í', 
    'O': 'Ó',
    'U': 'Ú'
  },
  LOW: {
    'a': 'à',
    'e': 'è',
    'i': 'ì', 
    'o': 'ò',
    'u': 'ù',
    'A': 'À',
    'E': 'È',
    'I': 'Ì',
    'O': 'Ò', 
    'U': 'Ù'
  },
  MID: {
    'a': 'a',
    'e': 'e',
    'i': 'i',
    'o': 'o', 
    'u': 'u',
    'A': 'A',
    'E': 'E',
    'I': 'I',
    'O': 'O',
    'U': 'U'
  }
};

/**
 * Yoruba Special Characters and Diacritics
 */
export const YORUBA_SPECIAL_CHARS = {
  'ẹ': 'ẹ', // open e
  'Ẹ': 'Ẹ',
  'ọ': 'ọ', // open o
  'Ọ': 'Ọ',
  'ṣ': 'ṣ', // s with dot below
  'Ṣ': 'Ṣ',
  'gb': 'gb', // digraph
  'kp': 'kp', // digraph
  'ń': 'ń', // n with acute
  'Ń': 'Ń'
};

/**
 * Common Yoruba Words and Their Proper Tonations
 */
export const YORUBA_COMMON_WORDS = {
  // Religious terms
  'Olorun': 'Ọlọ́run',
  'Jesu': 'Jésù',
  'Kristi': 'Krístì',
  'Oluwa': 'Olúwa',
  'Baba': 'Bàbá',
  'Emi': 'Ẹ̀mí',
  'Mimo': 'Mímọ́',
  'orin': 'orin',
  'adura': 'àdúrà',
  'iyin': 'ìyìn',
  'ogo': 'ògo',
  'anu': 'àánú',
  'ife': 'ìfẹ́',
  'ayo': 'ayọ̀',
  'alafia': 'àláfíà',
  'bukun': 'bùkún',
  'ope': 'ọpẹ́',
  'halleluya': 'hàlélúyà',
  'amin': 'àmín',
  
  // Common verbs
  'wa': 'wá',
  'lo': 'lọ',
  'ko': 'kọ́',
  'gbo': 'gbọ́',
  'ri': 'rí',
  'mu': 'mú',
  'fun': 'fún',
  'se': 'ṣe',
  'ni': 'ní',
  'si': 'sí',
  'ti': 'tí',
  'bi': 'bí',
  'je': 'jẹ́',
  'di': 'dí',
  'da': 'dá',
  'fi': 'fí',
  'so': 'sọ',
  'tu': 'tú',
  'yo': 'yọ́',
  'ba': 'bá',
  'pa': 'pa',
  'ku': 'kú',
  'sun': 'sùn',
  'dun': 'dùn',
  'yan': 'yàn',
  'ran': 'ràn',
  'han': 'hàn',
  'tan': 'tàn',
  'san': 'sàn',
  'kan': 'kàn',
  'ban': 'bàn',
  'dan': 'dàn',
  'fan': 'fàn',
  'gan': 'gàn',
  'lan': 'làn',
  'man': 'màn',
  'nan': 'nàn',
  'pan': 'pàn',
  'ran': 'ràn',
  'wan': 'wàn',
  'yan': 'yàn'
};

/**
 * Function to apply proper Yoruba tonations to text
 * @param {string} text - The text to apply tonations to
 * @returns {string} - Text with proper Yoruba tonations
 */
export const applyYorubaTonations = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let result = text;
  
  // Apply common word replacements
  Object.keys(YORUBA_COMMON_WORDS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, YORUBA_COMMON_WORDS[word]);
  });
  
  return result;
};

/**
 * Function to validate Yoruba text for proper tonations
 * @param {string} text - The text to validate
 * @returns {object} - Validation result with suggestions
 */
export const validateYorubaText = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, suggestions: [] };
  }
  
  const suggestions = [];
  const words = text.toLowerCase().split(/\s+/);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (YORUBA_COMMON_WORDS[cleanWord]) {
      if (word !== YORUBA_COMMON_WORDS[cleanWord]) {
        suggestions.push({
          original: word,
          suggested: YORUBA_COMMON_WORDS[cleanWord],
          reason: 'Missing or incorrect tonation'
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
 * Function to get tone pattern for a Yoruba word
 * @param {string} word - The Yoruba word
 * @returns {string} - Tone pattern (H=High, M=Mid, L=Low)
 */
export const getTonePattern = (word) => {
  if (!word || typeof word !== 'string') return '';
  
  const tonePattern = [];
  
  for (let char of word) {
    if (/[áéíóúÁÉÍÓÚ]/.test(char)) {
      tonePattern.push('H'); // High tone
    } else if (/[àèìòùÀÈÌÒÙ]/.test(char)) {
      tonePattern.push('L'); // Low tone
    } else if (/[aeiouAEIOU]/.test(char)) {
      tonePattern.push('M'); // Mid tone
    }
  }
  
  return tonePattern.join('');
};

/**
 * Function to convert English hymn titles to Yoruba equivalents
 * @param {string} englishTitle - The English hymn title
 * @returns {string} - Yoruba equivalent title
 */
export const getYorubaHymnTitle = (englishTitle) => {
  const titleMappings = {
    'Holy, Holy, Holy': 'Mímọ́, Mímọ́, Mímọ́',
    'Love Divine, All Loves Excelling': 'Ìfẹ́ Ọlọ́run, Gbogbo Ìfẹ́',
    'All Creatures of Our God and King': 'Gbogbo Ẹ̀dá Ọlọ́run àti Ọba',
    'Jesus, the Very Thought of Thee': 'Jésù, Èrò Rẹ Dùn',
    'Jesus Is All the World to Me': 'Jésù ni Gbogbo Ayé Fún Mi',
    'How Sweet the Name of Jesus Sounds': 'Bí Orúkọ Jésù Ṣe Dùn Tó',
    'Spirit Divine, Attend Our Prayers': 'Ẹ̀mí Mímọ́, Gbọ́ Àdúrà Wa',
    'Guide Me, O Thou Great Jehovah': 'Darí Mi, Ọ Jèhófà Ńlá',
    'The Lord Is My Shepherd': 'Olúwa Ni Olùṣọ́ Mi',
    'All Glory, Laud, and Honor': 'Gbogbo Ògo, Ìyìn, àti Ọ̀lá'
  };
  
  return titleMappings[englishTitle] || englishTitle;
};

/**
 * Yoruba Hymn Singing Guidelines
 */
export const YORUBA_SINGING_GUIDELINES = {
  tonalConsiderations: [
    'Pay attention to tone marks when singing - they affect melody',
    'High tones (á, é, í, ó, ú) should be sung on higher pitches',
    'Low tones (à, è, ì, ò, ù) should be sung on lower pitches',
    'Mid tones (a, e, i, o, u) follow the natural melody line'
  ],
  pronunciationTips: [
    'ẹ is pronounced like "eh" in "bet"',
    'ọ is pronounced like "aw" in "law"', 
    'ṣ is pronounced like "sh" in "shoe"',
    'gb and kp are pronounced as single sounds',
    'Nasalized vowels (ń) should have nasal quality'
  ],
  rhythmicPatterns: [
    'Yoruba is a tonal language - rhythm follows speech patterns',
    'Syllable timing is important for meaning',
    'Some syllables may need to be held longer for tonal clarity'
  ]
};

export default {
  YORUBA_TONE_MARKS,
  YORUBA_SPECIAL_CHARS,
  YORUBA_COMMON_WORDS,
  applyYorubaTonations,
  validateYorubaText,
  getTonePattern,
  getYorubaHymnTitle,
  YORUBA_SINGING_GUIDELINES
};