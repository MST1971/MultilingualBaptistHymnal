import { igboHymnDetailsByNumber } from './igboHymnDetails';

export const igboHymns = Array.from({ length: 400 }, (_, i) => {
  const number = i + 1;
  const detail = igboHymnDetailsByNumber[number];

  return {
    id: `IBH${number}`,
    number,
    title: detail?.title ?? `Abu Igbo ${number} (Igbo Hymn ${number})`,
    theme: detail?.theme ?? "General",
    tune: detail?.tune ?? ""
  };
});
