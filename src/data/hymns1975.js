import { hymnDetails1975ByNumber } from './hymnDetails1975';

export const hymns1975 = Array.from({ length: 512 }, (_, i) => {
  const number = i + 1;
  const detail = hymnDetails1975ByNumber[number];

  if (!detail) {
    return {
      id: number,
      number,
      title: `1975 Hymn ${number}`,
      tune: ""
    };
  }

  return {
    id: number,
    number,
    title: detail.title,
    tune: detail.tune ?? ""
  };
});

export const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
};

export const getHymnByNumber = (number) => {
  return hymnDetails1975ByNumber[number] || null;
};

export const getHymnBySlug = (slug) => {
  return Object.values(hymnDetails1975ByNumber).find(h => createSlug(h.title) === slug) || null;
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
