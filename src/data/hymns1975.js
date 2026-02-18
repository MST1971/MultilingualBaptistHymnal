export const hymns1975 = [
  { id: 1, number: 1, title: "How Great Thou Art", tune: "O STORE GUD" },
  { id: 2, number: 2, title: "Amazing Grace", tune: "NEW BRITAIN" },
  { id: 3, number: 3, title: "Blessed Assurance", tune: "ASSURANCE" },
  { id: 4, number: 4, title: "It Is Well with My Soul", tune: "VILLE DU HAVRE" },
  { id: 5, number: 5, title: "Great Is Thy Faithfulness", tune: "FAITHFULNESS" },
  { id: 6, number: 6, title: "Victory in Jesus", tune: "HARTFORD" },
  { id: 7, number: 7, title: "Because He Lives", tune: "RESURRECTION" },
  { id: 8, number: 8, title: "Just As I Am", tune: "WOODWORTH" },
  { id: 9, number: 9, title: "The Old Rugged Cross", tune: "THE OLD RUGGED CROSS" },
  { id: 10, number: 10, title: "At Calvary", tune: "CALVARY" },
  { id: 11, number: 11, title: "What a Friend We Have in Jesus", tune: "CONVERSE" },
  { id: 12, number: 12, title: "I Love to Tell the Story", tune: "HANKEY" }
];

export const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
};

export const getHymnByNumber = (number) => {
  return hymns1975.find(h => h.number.toString() === number.toString()) || null;
};

export const getHymnBySlug = (slug) => {
  return hymns1975.find(h => createSlug(h.title) === slug) || null;
};

export const getNextHymnSlug = (currentSlug) => {
  const index = hymns1975.findIndex(h => createSlug(h.title) === currentSlug);
  if (index !== -1 && index < hymns1975.length - 1) {
    return createSlug(hymns1975[index + 1].title);
  }
  return null;
};

export const getPreviousHymnSlug = (currentSlug) => {
  const index = hymns1975.findIndex(h => createSlug(h.title) === currentSlug);
  if (index > 0) {
    return createSlug(hymns1975[index - 1].title);
  }
  return null;
};
