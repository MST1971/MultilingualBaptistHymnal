// Sample hymn data for demonstration with categories
const hymnsData = {
  newYear: [
    { id: 4, title: "Mighty God, While Angels Bless Thee", number: 4 },
    { id: 5, title: "God, Our Father, We Adore Thee!", number: 5 }
  ],
  crucifixion: [
    { id: 147, title: "When I Survey the Wondrous Cross", number: 147 },
    { id: 144, title: "Alas! and Did My Savior Bleed?", number: 144 },
    { id: 149, title: "'Tis Midnight; and on Olive's Brow", number: 149 }
  ],
  easter: [
    { id: 159, title: "Christ the Lord Is Risen Today", number: 159 },
    { id: 160, title: "Low in the Grave He Lay", number: 160 },
    { id: 161, title: "Crown Him with Many Crowns", number: 161 }
  ],
  christmas: [
    { id: 85, title: "O Come, All Ye Faithful", number: 85 },
    { id: 86, title: "Joy to the World", number: 86 },
    { id: 87, title: "Hark! The Herald Angels Sing", number: 87 }
  ],
  general: [
    { id: 1, title: "Holy, Holy, Holy", number: 1 },
    { id: 2, title: "Love Divine, All Loves Excelling", number: 2 },
    { id: 3, title: "All Creatures of Our God and King", number: 3 },
    { id: 4, title: "Mighty God, While Angels Bless Thee", number: 4 },
    { id: 5, title: "God, Our Father, We Adore Thee!", number: 5 },
    { id: 6, title: "Praise to the Lord, the Almighty", number: 6 },
    { id: 7, title: "Let All on Earth Their Voices Raise", number: 7 },
    { id: 8, title: "All Things Bright and Beautiful", number: 8 }
  ]
};

// Function to check if it's currently a special season
export const getCurrentSeason = () => {
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  // Check for Christmas season (December)
  if (month === 11) {
    return 'christmas';
  }

  // Check for New Year (January 1st - 7th)
  if (month === 0 && date <= 7) {
    return 'newYear';
  }

  // Check for Easter and Crucifixion
  // Easter calculation
  const year = today.getFullYear();
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  const easter = new Date(year, easterMonth, easterDay);
  
  // Good Friday is 2 days before Easter
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  // Calculate diffs
  const timeDiffEaster = today.getTime() - easter.getTime();
  const daysDiffEaster = Math.floor(timeDiffEaster / (1000 * 60 * 60 * 24));

  const timeDiffGoodFriday = today.getTime() - goodFriday.getTime();
  const daysDiffGoodFriday = Math.floor(timeDiffGoodFriday / (1000 * 60 * 60 * 24));

  // Check for Crucifixion (Good Friday +/- 1 day)
  if (daysDiffGoodFriday >= -1 && daysDiffGoodFriday <= 1) {
    return 'crucifixion';
  }
  
  // Check if current date is within Easter season (Easter Sunday + 50 days)
  if (daysDiffEaster >= 0 && daysDiffEaster <= 50) {
    return 'easter';
  }

  return 'general';
};

// Function to get the hymn of the day based on season and date
export const getHymnOfTheDay = () => {
  const season = getCurrentSeason();
  const seasonalHymns = hymnsData[season];
  
  const today = new Date();
  const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple pseudo-random function
  const pseudoRandom = (input) => {
    const x = Math.sin(input) * 10000;
    return x - Math.floor(x);
  };

  const randomIndex = Math.floor(pseudoRandom(seed) * seasonalHymns.length);
  
  return seasonalHymns[randomIndex];
};
