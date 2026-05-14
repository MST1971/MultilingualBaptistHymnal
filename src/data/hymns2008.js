import { hymnDetails2008ByNumber } from './hymnDetails2008';

export const hymns2008 = Array.from({ length: 674 }, (_, i) => {
  const number = i + 1;
  const detail = hymnDetails2008ByNumber[number];

  if (!detail) {
    return {
      id: number,
      number,
      title: `2008 Hymn ${number}`,
      theme: "General",
      tune: ""
    };
  }

  return {
    id: number,
    number,
    title: detail.title,
    theme: detail.theme ?? "General",
    tune: detail.tune ?? ""
  };
});
