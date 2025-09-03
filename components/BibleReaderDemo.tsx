import React from 'react';
import { BibleReader } from './BibleReader';

const sampleVerses = [
  {
    number: 32,
    text: "Show respect for old people and honour them. Reverently obey me; I am the LORD."
  },
  {
    number: 33,
    text: "Do not ill-treat foreigners who are living in your land. Treat them as you would a fellow-Israelite, and love them as you love yourselves. Remember that you were once foreigners in the land of Egypt. I am the LORD your God."
  },
  {
    number: 34,
    text: "Do not cheat anyone by using false measures of length, weight, or quantity. Use honest scales, honest weights, and honest measures. I am the LORD your God, and I brought you out of Egypt."
  },
  {
    number: 35,
    text: "Keep all my laws and all my rules, and obey them. I am the LORD."
  },
  {
    number: 36,
    text: "I am the LORD your God, who brought you out of Egypt to be your God. I am the LORD."
  }
];

export const BibleReaderDemo: React.FC = () => {
  return (
    <BibleReader
      bookName="Leviticus"
      chapterNumber={19}
      verses={sampleVerses}
      bibleVersion="GNBUK"
      onBack={() => console.log('Back pressed')}
      onSearch={() => console.log('Search pressed')}
      onMenu={() => console.log('Menu pressed')}
      onPrevChapter={() => console.log('Prev chapter')}
      onNextChapter={() => console.log('Next chapter')}
      canGoPrev={true}
      canGoNext={true}
    />
  );
};

