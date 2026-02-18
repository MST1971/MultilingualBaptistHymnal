export const igboHymns = Array.from({ length: 100 }, (_, i) => ({
  id: `IBH${i + 1}`,
  number: i + 1,
  title: i === 0 ? "Amara Dị Ebube (Amazing Grace)" : 
         i === 1 ? "Chineke Nke Igwe (God of Heaven)" :
         i === 2 ? "Jesu Nke M Huru N'anya (Jesus Whom I Love)" :
         `Abu Igbo ${i + 1} (Igbo Hymn ${i + 1})`,
  lyrics: [
    "Placeholder lyrics for Igbo hymn...",
    "Line 2...",
    "Line 3..."
  ],
  theme: "General"
}));
