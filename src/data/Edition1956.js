import { hymns } from './hymns';

export const hymns1956 = Object.values(hymns).map(h => ({
  id: h.number,
  number: h.number,
  title: h.title,
  tune: h.tune,
  author: h.author
})).sort((a, b) => a.number - b.number);
