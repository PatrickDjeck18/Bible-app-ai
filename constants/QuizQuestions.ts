/**
 * Modern Bible Quiz Questions Database
 * Comprehensive collection of engaging Bible questions across different categories and difficulty levels
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  category: QuizCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  verse?: string; // Optional Bible verse reference
  explanation?: string; // Optional explanation for learning
  testament: 'old' | 'new' | 'both';
}

export type QuizCategory = 
  | 'characters' 
  | 'stories' 
  | 'verses' 
  | 'geography' 
  | 'miracles' 
  | 'parables' 
  | 'prophecy' 
  | 'wisdom' 
  | 'history' 
  | 'general';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==================== CHARACTERS CATEGORY ====================
  // CHARACTERS - Easy
  {
    id: 'char_001',
    question: 'Who was the first man created by God?',
    options: ['Noah', 'Abraham', 'Adam', 'Moses'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 2:7',
    explanation: 'God formed man from the dust of the ground and breathed into his nostrils the breath of life.',
    testament: 'old'
  },
  {
    id: 'char_002',
    question: 'Who built the ark to survive the great flood?',
    options: ['Moses', 'Noah', 'Abraham', 'David'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 6:14',
    explanation: 'God commanded Noah to build an ark of gopher wood to save his family and the animals.',
    testament: 'old'
  },
  {
    id: 'char_003',
    question: 'Who was known as the "Father of Faith"?',
    options: ['Isaac', 'Jacob', 'Abraham', 'Moses'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Romans 4:16',
    explanation: 'Abraham believed God and it was counted to him as righteousness.',
    testament: 'both'
  },
  {
    id: 'char_004',
    question: 'Who was the strongest man in the Bible?',
    options: ['David', 'Goliath', 'Samson', 'Joshua'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Judges 16:17',
    explanation: 'Samson\'s strength came from his uncut hair, which was part of his Nazirite vow.',
    testament: 'old'
  },
  {
    id: 'char_005',
    question: 'Who was Jesus\' mother?',
    options: ['Martha', 'Mary', 'Elizabeth', 'Ruth'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Luke 1:27',
    explanation: 'Mary was a virgin betrothed to Joseph when the angel Gabriel announced she would bear Jesus.',
    testament: 'new'
  },
  {
    id: 'char_006',
    question: 'Who was swallowed by a great fish?',
    options: ['Peter', 'Jonah', 'Paul', 'Daniel'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Jonah 1:17',
    explanation: 'Jonah spent three days and three nights in the belly of a great fish after running from God.',
    testament: 'old'
  },
  {
    id: 'char_007',
    question: 'Who was the first king of Israel?',
    options: ['David', 'Saul', 'Solomon', 'Samuel'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: '1 Samuel 10:1',
    explanation: 'Saul was anointed as the first king of Israel by the prophet Samuel.',
    testament: 'old'
  },
  {
    id: 'char_008',
    question: 'Who was known as the "Man after God\'s own heart"?',
    options: ['Solomon', 'David', 'Moses', 'Abraham'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Acts 13:22',
    explanation: 'God testified that David was a man after His own heart who would do all His will.',
    testament: 'both'
  },
  {
    id: 'char_009',
    question: 'Who was the wisest man in the Bible?',
    options: ['Solomon', 'David', 'Moses', 'Daniel'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'easy',
    verse: '1 Kings 3:12',
    explanation: 'God gave Solomon wisdom and understanding beyond measure.',
    testament: 'old'
  },
  {
    id: 'char_010',
    question: 'Who was the first martyr of the Christian church?',
    options: ['Peter', 'Stephen', 'James', 'Paul'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Acts 7:59-60',
    explanation: 'Stephen was stoned to death for his faith, becoming the first Christian martyr.',
    testament: 'new'
  },
  // CHARACTERS - Medium
  {
    id: 'char_011',
    question: 'Who was the prophet who confronted King Ahab and Queen Jezebel?',
    options: ['Isaiah', 'Jeremiah', 'Elijah', 'Ezekiel'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'medium',
    verse: '1 Kings 17:1',
    explanation: 'Elijah was a prophet who boldly confronted the wicked rulers of Israel.',
    testament: 'old'
  },
  {
    id: 'char_012',
    question: 'Who was the disciple who denied Jesus three times?',
    options: ['John', 'Peter', 'Judas', 'Thomas'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 26:75',
    explanation: 'Peter denied knowing Jesus three times before the rooster crowed.',
    testament: 'new'
  },
  {
    id: 'char_013',
    question: 'Who was the first Gentile to be baptized?',
    options: ['Cornelius', 'Lydia', 'The Ethiopian eunuch', 'The Philippian jailer'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Acts 10:48',
    explanation: 'Cornelius and his household were the first Gentiles to receive the Holy Spirit and be baptized.',
    testament: 'new'
  },
  {
    id: 'char_014',
    question: 'Who was the prophet who married a prostitute to symbolize God\'s relationship with Israel?',
    options: ['Hosea', 'Amos', 'Micah', 'Zephaniah'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Hosea 1:2',
    explanation: 'Hosea married Gomer to illustrate God\'s faithful love for unfaithful Israel.',
    testament: 'old'
  },
  {
    id: 'char_015',
    question: 'Who was the disciple known as "the doubter"?',
    options: ['Peter', 'Thomas', 'Judas', 'Philip'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'John 20:25',
    explanation: 'Thomas doubted Jesus\' resurrection until he saw the nail marks in His hands.',
    testament: 'new'
  },
  // CHARACTERS - Hard
  {
    id: 'char_016',
    question: 'Who was the high priest who prophesied that Jesus would die for the nation?',
    options: ['Annas', 'Caiaphas', 'Zechariah', 'Eli'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'hard',
    verse: 'John 11:51',
    explanation: 'Caiaphas unknowingly prophesied that Jesus would die for the Jewish nation.',
    testament: 'new'
  },
  {
    id: 'char_017',
    question: 'Who was the prophet who was taken to heaven in a chariot of fire?',
    options: ['Elisha', 'Elijah', 'Enoch', 'Moses'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'hard',
    verse: '2 Kings 2:11',
    explanation: 'Elijah was taken up to heaven in a whirlwind with a chariot of fire and horses of fire.',
    testament: 'old'
  },
  {
    id: 'char_018',
    question: 'Who was the king who had the longest reign in Israel\'s history?',
    options: ['David', 'Solomon', 'Manasseh', 'Josiah'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'hard',
    verse: '2 Kings 21:1',
    explanation: 'Manasseh reigned for 55 years, the longest reign of any king of Judah.',
    testament: 'old'
  },
  {
    id: 'char_019',
    question: 'Who was the disciple who was a tax collector before following Jesus?',
    options: ['Matthew', 'Mark', 'Luke', 'John'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'hard',
    verse: 'Matthew 9:9',
    explanation: 'Matthew (also called Levi) was a tax collector before Jesus called him to be a disciple.',
    testament: 'new'
  },
  {
    id: 'char_020',
    question: 'Who was the prophet who was thrown into a lion\'s den?',
    options: ['Daniel', 'Jeremiah', 'Ezekiel', 'Isaiah'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'hard',
    verse: 'Daniel 6:16',
    explanation: 'Daniel was thrown into a lion\'s den for praying to God instead of the king.',
    testament: 'old'
  },
  {
    id: 'char_021',
    question: 'Who was the disciple who was a fisherman before following Jesus?',
    options: ['Peter', 'Andrew', 'James', 'John'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 4:18',
    explanation: 'Peter was a fisherman when Jesus called him to be a disciple.',
    testament: 'new'
  },
  {
    id: 'char_022',
    question: 'Who was the first person to see Jesus after His resurrection?',
    options: ['Peter', 'Mary Magdalene', 'John', 'Thomas'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Mark 16:9',
    explanation: 'Mary Magdalene was the first person to see Jesus after His resurrection.',
    testament: 'new'
  },
  {
    id: 'char_023',
    question: 'Who was the king who had the most wives?',
    options: ['David', 'Solomon', 'Ahab', 'Hezekiah'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'hard',
    verse: '1 Kings 11:3',
    explanation: 'Solomon had 700 wives and 300 concubines, which led to his downfall.',
    testament: 'old'
  },
  {
    id: 'char_024',
    question: 'Who was the prophet who was fed by ravens?',
    options: ['Elisha', 'Elijah', 'Isaiah', 'Jeremiah'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: '1 Kings 17:6',
    explanation: 'Elijah was fed by ravens during the drought in Israel.',
    testament: 'old'
  },
  {
    id: 'char_025',
    question: 'Who was the disciple who was a doctor?',
    options: ['Luke', 'Mark', 'John', 'Matthew'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'hard',
    verse: 'Colossians 4:14',
    explanation: 'Luke was a physician (doctor) before becoming a follower of Jesus.',
    testament: 'new'
  },
  {
    id: 'char_026',
    question: 'Who was the disciple who was a tax collector?',
    options: ['Matthew', 'Mark', 'Luke', 'John'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 9:9',
    explanation: 'Matthew (also called Levi) was a tax collector before Jesus called him.',
    testament: 'new'
  },
  {
    id: 'char_027',
    question: 'Who was the disciple who was a fisherman?',
    options: ['Peter', 'Andrew', 'James', 'John'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 4:18',
    explanation: 'Peter was a fisherman when Jesus called him to be a disciple.',
    testament: 'new'
  },
  {
    id: 'char_028',
    question: 'Who was the first person to see Jesus after His resurrection?',
    options: ['Peter', 'Mary Magdalene', 'John', 'Thomas'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Mark 16:9',
    explanation: 'Mary Magdalene was the first person to see Jesus after His resurrection.',
    testament: 'new'
  },
  {
    id: 'char_029',
    question: 'Who was the disciple who was a zealot?',
    options: ['Simon', 'Judas', 'Philip', 'Bartholomew'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'hard',
    verse: 'Luke 6:15',
    explanation: 'Simon was called a zealot, indicating he was part of a Jewish revolutionary group.',
    testament: 'new'
  },
  {
    id: 'char_030',
    question: 'Who was the disciple who was a twin?',
    options: ['Thomas', 'James', 'John', 'Andrew'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'John 11:16',
    explanation: 'Thomas was called "Didymus" which means "twin" in Greek.',
    testament: 'new'
  },

  // ==================== STORIES CATEGORY ====================
  // STORIES - Easy
  {
    id: 'story_001',
    question: 'What happened to the walls of Jericho?',
    options: ['They were destroyed by fire', 'They fell down flat', 'They were torn down by soldiers', 'They crumbled from age'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Joshua 6:20',
    explanation: 'The walls of Jericho fell down flat when the people shouted and the trumpets blew.',
    testament: 'old'
  },
  {
    id: 'story_002',
    question: 'How many days and nights did Jesus fast in the wilderness?',
    options: ['30 days', '40 days', '50 days', '60 days'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Matthew 4:2',
    explanation: 'Jesus fasted for forty days and forty nights in the wilderness.',
    testament: 'new'
  },
  {
    id: 'story_003',
    question: 'How many people were saved on Noah\'s ark?',
    options: ['6 people', '8 people', '10 people', '12 people'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: '1 Peter 3:20',
    explanation: 'Eight people were saved on Noah\'s ark: Noah, his wife, his three sons, and their wives.',
    testament: 'both'
  },
  {
    id: 'story_004',
    question: 'How many disciples did Jesus have?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Matthew 10:1',
    explanation: 'Jesus chose twelve disciples to be with Him and to send out to preach.',
    testament: 'new'
  },
  {
    id: 'story_005',
    question: 'How many days was Lazarus dead before Jesus raised him?',
    options: ['2 days', '3 days', '4 days', '5 days'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'easy',
    verse: 'John 11:17',
    explanation: 'Lazarus had been dead for four days when Jesus arrived and raised him from the dead.',
    testament: 'new'
  },
  // STORIES - Medium
  {
    id: 'story_006',
    question: 'What was the first miracle Jesus performed?',
    options: ['Healing a leper', 'Raising Lazarus', 'Turning water into wine', 'Walking on water'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: 'John 2:11',
    explanation: 'Jesus turned water into wine at the wedding in Cana, which was His first miracle.',
    testament: 'new'
  },
  {
    id: 'story_007',
    question: 'How many years did the Israelites wander in the wilderness?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Numbers 14:33',
    explanation: 'The Israelites wandered in the wilderness for forty years due to their unbelief.',
    testament: 'old'
  },
  {
    id: 'story_008',
    question: 'What happened to the Red Sea when Moses stretched out his hand?',
    options: ['It dried up', 'It parted', 'It turned to blood', 'It froze'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Exodus 14:21',
    explanation: 'The Lord caused the sea to go back by a strong east wind, creating a path through the sea.',
    testament: 'old'
  },
  {
    id: 'story_009',
    question: 'How many people were fed with five loaves and two fish?',
    options: ['3,000 people', '4,000 people', '5,000 people', '6,000 people'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Matthew 14:21',
    explanation: 'About five thousand men were fed, besides women and children.',
    testament: 'new'
  },
  {
    id: 'story_010',
    question: 'What happened to Sodom and Gomorrah?',
    options: ['They were flooded', 'They were burned with fire', 'They were destroyed by earthquake', 'They were conquered by enemies'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Genesis 19:24',
    explanation: 'The Lord rained down burning sulfur on Sodom and Gomorrah from the heavens.',
    testament: 'old'
  },
  // STORIES - Hard
  {
    id: 'story_011',
    question: 'How many years did Joseph spend in prison?',
    options: ['5 years', '7 years', '10 years', '13 years'],
    correctAnswer: 3,
    category: 'stories',
    difficulty: 'hard',
    verse: 'Genesis 37:2, 41:46',
    explanation: 'Joseph spent 13 years in Egypt, including time in prison, before becoming second in command.',
    testament: 'old'
  },
  {
    id: 'story_012',
    question: 'How many years did the Israelites spend in Babylonian captivity?',
    options: ['50 years', '60 years', '70 years', '80 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'hard',
    verse: 'Jeremiah 25:11',
    explanation: 'The Israelites spent 70 years in Babylonian captivity as prophesied by Jeremiah.',
    testament: 'old'
  },
  {
    id: 'story_013',
    question: 'How many people were fed with seven loaves and a few fish?',
    options: ['3,000 people', '4,000 people', '5,000 people', '6,000 people'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Mark 8:9',
    explanation: 'About four thousand people were fed with seven loaves and a few small fish.',
    testament: 'new'
  },
  {
    id: 'story_014',
    question: 'How many days did Jesus stay with His disciples after His resurrection?',
    options: ['30 days', '40 days', '50 days', '60 days'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Acts 1:3',
    explanation: 'Jesus appeared to His disciples over a period of forty days after His resurrection.',
    testament: 'new'
  },
  {
    id: 'story_015',
    question: 'How many years did the temple take to build?',
    options: ['3 years', '5 years', '7 years', '10 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'hard',
    verse: '1 Kings 6:38',
    explanation: 'Solomon\'s temple took seven years to build.',
    testament: 'old'
  },
  {
    id: 'story_016',
    question: 'How many days did Jesus stay in the tomb?',
    options: ['1 day', '2 days', '3 days', '4 days'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Matthew 12:40',
    explanation: 'Jesus was in the tomb for three days and three nights, as He prophesied.',
    testament: 'new'
  },
  {
    id: 'story_017',
    question: 'How many people were baptized on the day of Pentecost?',
    options: ['1,000 people', '2,000 people', '3,000 people', '4,000 people'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Acts 2:41',
    explanation: 'About three thousand people were baptized on the day of Pentecost.',
    testament: 'new'
  },
  {
    id: 'story_018',
    question: 'How many years did Paul spend in Arabia?',
    options: ['1 year', '2 years', '3 years', '4 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'hard',
    verse: 'Galatians 1:17-18',
    explanation: 'Paul spent three years in Arabia after his conversion.',
    testament: 'new'
  },
  {
    id: 'story_019',
    question: 'How many years did the Israelites spend in the wilderness?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: 'Numbers 14:33',
    explanation: 'The Israelites wandered in the wilderness for forty years due to their unbelief.',
    testament: 'old'
  },
  {
    id: 'story_020',
    question: 'How many years did David reign as king?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'stories',
    difficulty: 'medium',
    verse: '2 Samuel 5:4',
    explanation: 'David was thirty years old when he became king, and he reigned forty years.',
    testament: 'old'
  },

  // ==================== VERSES CATEGORY ====================
  // VERSES - Easy
  {
    id: 'verse_001',
    question: 'What does John 3:16 say God gave?',
    options: ['His only Son', 'His law', 'His prophets', 'His angels'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'John 3:16',
    explanation: 'For God so loved the world that he gave his one and only Son.',
    testament: 'new'
  },
  {
    id: 'verse_002',
    question: 'What does Psalm 23:1 say the Lord is?',
    options: ['My shepherd', 'My king', 'My father', 'My friend'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Psalm 23:1',
    explanation: 'The Lord is my shepherd, I shall not want.',
    testament: 'old'
  },
  {
    id: 'verse_003',
    question: 'What does Philippians 4:13 say we can do through Christ?',
    options: ['Everything', 'All things', 'Anything', 'Whatever we want'],
    correctAnswer: 1,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Philippians 4:13',
    explanation: 'I can do all things through Christ who strengthens me.',
    testament: 'new'
  },
  {
    id: 'verse_004',
    question: 'What does Genesis 1:1 say God created?',
    options: ['The earth', 'The heavens and the earth', 'The universe', 'Everything'],
    correctAnswer: 1,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Genesis 1:1',
    explanation: 'In the beginning God created the heavens and the earth.',
    testament: 'old'
  },
  {
    id: 'verse_005',
    question: 'What does Romans 3:23 say all have?',
    options: ['Sinned', 'Failed', 'Disobeyed', 'Rebelled'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Romans 3:23',
    explanation: 'For all have sinned and fall short of the glory of God.',
    testament: 'new'
  },
  // VERSES - Medium
  {
    id: 'verse_006',
    question: 'What does Jeremiah 29:11 say God has for us?',
    options: ['Plans to prosper', 'Plans for good', 'Plans for peace', 'Plans for success'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Jeremiah 29:11',
    explanation: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.',
    testament: 'old'
  },
  {
    id: 'verse_007',
    question: 'What does Isaiah 40:31 say those who hope in the Lord will do?',
    options: ['Soar on wings like eagles', 'Run and not grow weary', 'Walk and not be faint', 'All of the above'],
    correctAnswer: 3,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Isaiah 40:31',
    explanation: 'Those who hope in the Lord will soar on wings like eagles, run and not grow weary, walk and not be faint.',
    testament: 'old'
  },
  {
    id: 'verse_008',
    question: 'What does 1 Corinthians 13:4 say love is?',
    options: ['Patient and kind', 'Jealous and proud', 'Selfish and rude', 'Angry and unforgiving'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: '1 Corinthians 13:4',
    explanation: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    testament: 'new'
  },
  {
    id: 'verse_009',
    question: 'What does Joshua 1:9 say we should not be?',
    options: ['Afraid or discouraged', 'Weak or tired', 'Sad or lonely', 'Poor or hungry'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Joshua 1:9',
    explanation: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged.',
    testament: 'old'
  },
  {
    id: 'verse_010',
    question: 'What does Galatians 5:22-23 list as the fruit of the Spirit?',
    options: ['Love, joy, peace', 'Patience, kindness, goodness', 'Faithfulness, gentleness, self-control', 'All of the above'],
    correctAnswer: 3,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Galatians 5:22-23',
    explanation: 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.',
    testament: 'new'
  },
  {
    id: 'verse_011',
    question: 'What does Matthew 28:19 say to do?',
    options: ['Go and make disciples', 'Pray without ceasing', 'Love your neighbor', 'Give to the poor'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Matthew 28:19',
    explanation: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
    testament: 'new'
  },
  {
    id: 'verse_012',
    question: 'What does 1 Thessalonians 5:17 say to do?',
    options: ['Pray without ceasing', 'Rejoice always', 'Give thanks', 'All of the above'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: '1 Thessalonians 5:17',
    explanation: 'Pray without ceasing.',
    testament: 'new'
  },
  {
    id: 'verse_013',
    question: 'What does Proverbs 3:6 say will happen if we acknowledge God?',
    options: ['He will direct our paths', 'He will give us wealth', 'He will protect us', 'He will heal us'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Proverbs 3:6',
    explanation: 'In all your ways acknowledge him, and he will make straight your paths.',
    testament: 'old'
  },
  {
    id: 'verse_014',
    question: 'What does Psalm 119:105 say God\'s word is?',
    options: ['A lamp to our feet', 'A light to our path', 'Both A and B', 'None of the above'],
    correctAnswer: 2,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Psalm 119:105',
    explanation: 'Your word is a lamp to my feet and a light to my path.',
    testament: 'old'
  },
  {
    id: 'verse_015',
    question: 'What does Romans 8:28 say works for good?',
    options: ['All things', 'Good things', 'Some things', 'Nothing'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'medium',
    verse: 'Romans 8:28',
    explanation: 'And we know that for those who love God all things work together for good.',
    testament: 'new'
  },

  // ==================== MIRACLES CATEGORY ====================
  // MIRACLES - Easy
  {
    id: 'miracle_001',
    question: 'What did Jesus do to feed the 5,000?',
    options: ['Bought food', 'Multiplied loaves and fish', 'Asked people to share', 'Made food appear'],
    correctAnswer: 1,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Matthew 14:19',
    explanation: 'Jesus took the five loaves and two fish, blessed them, and they multiplied to feed thousands.',
    testament: 'new'
  },
  {
    id: 'miracle_002',
    question: 'How did Jesus walk on water?',
    options: ['He used a boat', 'He walked on ice', 'He walked on the water', 'He swam'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Matthew 14:25',
    explanation: 'Jesus walked on the water toward the disciples in the boat.',
    testament: 'new'
  },
  {
    id: 'miracle_003',
    question: 'What happened when Jesus raised Lazarus?',
    options: ['He came out of the tomb', 'He appeared as a ghost', 'He was reincarnated', 'He became an angel'],
    correctAnswer: 0,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'John 11:44',
    explanation: 'Lazarus came out of the tomb, still wrapped in burial cloths.',
    testament: 'new'
  },
  {
    id: 'miracle_004',
    question: 'What did Jesus do to heal the blind man?',
    options: ['He prayed', 'He touched his eyes', 'He made mud and put it on his eyes', 'He spoke words'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'John 9:6',
    explanation: 'Jesus made mud with His saliva and put it on the man\'s eyes.',
    testament: 'new'
  },
  {
    id: 'miracle_005',
    question: 'What happened when Jesus calmed the storm?',
    options: ['The wind stopped', 'The waves stopped', 'The wind and waves stopped', 'The boat stopped rocking'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Mark 4:39',
    explanation: 'Jesus rebuked the wind and said to the waves, "Quiet! Be still!" and they obeyed.',
    testament: 'new'
  },

  // ==================== GEOGRAPHY CATEGORY ====================
  // GEOGRAPHY - Easy
  {
    id: 'geo_001',
    question: 'Where was Jesus born?',
    options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Jericho'],
    correctAnswer: 2,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Matthew 2:1',
    explanation: 'Jesus was born in Bethlehem in Judea during the time of King Herod.',
    testament: 'new'
  },
  {
    id: 'geo_002',
    question: 'Where did Jesus grow up?',
    options: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Jericho'],
    correctAnswer: 2,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Luke 2:39',
    explanation: 'Jesus grew up in Nazareth, which is why He was called a Nazarene.',
    testament: 'new'
  },
  {
    id: 'geo_003',
    question: 'Where was the Garden of Eden located?',
    options: ['In the east', 'In the west', 'In the north', 'In the south'],
    correctAnswer: 0,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Genesis 2:8',
    explanation: 'The Lord God planted a garden in Eden, in the east.',
    testament: 'old'
  },
  {
    id: 'geo_004',
    question: 'Where did Moses receive the Ten Commandments?',
    options: ['Mount Sinai', 'Mount Horeb', 'Mount Ararat', 'Mount Carmel'],
    correctAnswer: 0,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Exodus 19:20',
    explanation: 'The Lord descended on Mount Sinai and called Moses to the top of the mountain.',
    testament: 'old'
  },
  {
    id: 'geo_005',
    question: 'Where was Jesus crucified?',
    options: ['Mount of Olives', 'Golgotha', 'Mount Sinai', 'Mount Moriah'],
    correctAnswer: 1,
    category: 'geography',
    difficulty: 'easy',
    verse: 'John 19:17',
    explanation: 'Jesus was crucified at a place called Golgotha, which means "the place of the skull."',
    testament: 'new'
  },

  // ==================== PARABLES CATEGORY ====================
  // PARABLES - Easy
  {
    id: 'parable_001',
    question: 'What did the Good Samaritan do for the injured man?',
    options: ['Walked past him', 'Helped him', 'Called the police', 'Left him there'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 10:34',
    explanation: 'The Good Samaritan bandaged the man\'s wounds and took care of him.',
    testament: 'new'
  },
  {
    id: 'parable_002',
    question: 'What happened to the seed that fell on rocky ground?',
    options: ['It grew well', 'It withered quickly', 'It was eaten by birds', 'It produced fruit'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Matthew 13:5-6',
    explanation: 'The seed that fell on rocky ground sprang up quickly but withered because it had no root.',
    testament: 'new'
  },
  {
    id: 'parable_003',
    question: 'What did the prodigal son do with his inheritance?',
    options: ['Saved it', 'Invested it', 'Squandered it', 'Gave it away'],
    correctAnswer: 2,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 15:13',
    explanation: 'The prodigal son squandered his wealth in wild living.',
    testament: 'new'
  },
  {
    id: 'parable_004',
    question: 'What did the wise man build his house on?',
    options: ['Sand', 'Rock', 'Clay', 'Soil'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Matthew 7:24',
    explanation: 'The wise man built his house on the rock.',
    testament: 'new'
  },
  {
    id: 'parable_005',
    question: 'What happened to the lost sheep?',
    options: ['It was found', 'It died', 'It ran away', 'It was stolen'],
    correctAnswer: 0,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 15:5',
    explanation: 'The shepherd found the lost sheep and carried it home on his shoulders.',
    testament: 'new'
  },

  // ==================== PROPHECY CATEGORY ====================
  // PROPHECY - Easy
  {
    id: 'prophecy_001',
    question: 'Who prophesied that a virgin would give birth to a son?',
    options: ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Isaiah 7:14',
    explanation: 'Isaiah prophesied that a virgin would conceive and give birth to a son named Immanuel.',
    testament: 'old'
  },
  {
    id: 'prophecy_002',
    question: 'Where was Jesus prophesied to be born?',
    options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Jericho'],
    correctAnswer: 2,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Micah 5:2',
    explanation: 'Micah prophesied that the Messiah would be born in Bethlehem Ephrathah.',
    testament: 'old'
  },
  {
    id: 'prophecy_003',
    question: 'What did John the Baptist prophesy about Jesus?',
    options: ['He would be king', 'He would baptize with fire', 'He would be a prophet', 'He would be a priest'],
    correctAnswer: 1,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Matthew 3:11',
    explanation: 'John prophesied that Jesus would baptize with the Holy Spirit and fire.',
    testament: 'new'
  },
  {
    id: 'prophecy_004',
    question: 'What did Jesus prophesy about Peter?',
    options: ['He would be a leader', 'He would deny Him', 'He would betray Him', 'He would follow Him'],
    correctAnswer: 1,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Matthew 26:34',
    explanation: 'Jesus prophesied that Peter would deny Him three times before the rooster crowed.',
    testament: 'new'
  },
  {
    id: 'prophecy_005',
    question: 'What did Jesus prophesy about His death?',
    options: ['He would be stoned', 'He would be crucified', 'He would be poisoned', 'He would be drowned'],
    correctAnswer: 1,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Matthew 20:19',
    explanation: 'Jesus prophesied that He would be crucified and raised on the third day.',
    testament: 'new'
  },

  // ==================== WISDOM CATEGORY ====================
  // WISDOM - Easy
  {
    id: 'wisdom_001',
    question: 'What does Proverbs 1:7 say is the beginning of knowledge?',
    options: ['Education', 'The fear of the Lord', 'Reading', 'Experience'],
    correctAnswer: 1,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Proverbs 1:7',
    explanation: 'The fear of the Lord is the beginning of knowledge.',
    testament: 'old'
  },
  {
    id: 'wisdom_002',
    question: 'What does Ecclesiastes 3:1 say there is a time for?',
    options: ['Everything', 'Nothing', 'Something', 'Anything'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Ecclesiastes 3:1',
    explanation: 'There is a time for everything, and a season for every activity under the heavens.',
    testament: 'old'
  },
  {
    id: 'wisdom_003',
    question: 'What does James 1:5 say God gives?',
    options: ['Money', 'Wisdom', 'Strength', 'Health'],
    correctAnswer: 1,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'James 1:5',
    explanation: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.',
    testament: 'new'
  },
  {
    id: 'wisdom_004',
    question: 'What does Proverbs 3:5 say we should not lean on?',
    options: ['Our own understanding', 'Our friends', 'Our family', 'Our teachers'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Proverbs 3:5',
    explanation: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    testament: 'old'
  },
  {
    id: 'wisdom_005',
    question: 'What does Matthew 6:33 say we should seek first?',
    options: ['Money', 'The kingdom of God', 'Fame', 'Power'],
    correctAnswer: 1,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Matthew 6:33',
    explanation: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    testament: 'new'
  },

  // ==================== HISTORY CATEGORY ====================
  // HISTORY - Easy
  {
    id: 'history_001',
    question: 'How many years did the Israelites spend in Egypt?',
    options: ['200 years', '300 years', '400 years', '500 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: 'Genesis 15:13',
    explanation: 'God told Abraham that his descendants would be strangers in a foreign land for 400 years.',
    testament: 'old'
  },
  {
    id: 'history_002',
    question: 'How many years did David reign as king?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: '2 Samuel 5:4',
    explanation: 'David was thirty years old when he became king, and he reigned forty years.',
    testament: 'old'
  },
  {
    id: 'history_003',
    question: 'How many years did Solomon reign as king?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: '1 Kings 11:42',
    explanation: 'Solomon reigned in Jerusalem over all Israel forty years.',
    testament: 'old'
  },
  {
    id: 'history_004',
    question: 'How many years was the temple in Jerusalem destroyed before it was rebuilt?',
    options: ['50 years', '60 years', '70 years', '80 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: 'Jeremiah 25:11',
    explanation: 'The land would be desolate and the nations would serve the king of Babylon for seventy years.',
    testament: 'old'
  },
  {
    id: 'history_005',
    question: 'How many years did Jesus minister on earth?',
    options: ['2 years', '3 years', '4 years', '5 years'],
    correctAnswer: 1,
    category: 'history',
    difficulty: 'easy',
    verse: 'John 2:13, 6:4, 11:55',
    explanation: 'Jesus\' ministry lasted approximately three years, from His baptism to His crucifixion.',
    testament: 'new'
  },

  // ==================== GENERAL CATEGORY ====================
  // GENERAL - Easy
  {
    id: 'general_001',
    question: 'How many books are in the Bible?',
    options: ['60 books', '66 books', '70 books', '73 books'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'The Protestant Bible contains 66 books: 39 in the Old Testament and 27 in the New Testament.',
    testament: 'both'
  },
  {
    id: 'general_002',
    question: 'How many books are in the Old Testament?',
    options: ['35 books', '37 books', '39 books', '41 books'],
    correctAnswer: 2,
    category: 'general',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'The Old Testament contains 39 books in the Protestant Bible.',
    testament: 'old'
  },
  {
    id: 'general_003',
    question: 'How many books are in the New Testament?',
    options: ['25 books', '27 books', '29 books', '31 books'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'The New Testament contains 27 books in the Protestant Bible.',
    testament: 'new'
  },
  {
    id: 'general_004',
    question: 'What are the first four books of the New Testament called?',
    options: ['The Letters', 'The Gospels', 'The Epistles', 'The Acts'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'The first four books of the New Testament are called the Gospels: Matthew, Mark, Luke, and John.',
    testament: 'new'
  },
  {
    id: 'general_005',
    question: 'What language was most of the Old Testament written in?',
    options: ['Greek', 'Hebrew', 'Aramaic', 'Latin'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'Most of the Old Testament was written in Hebrew, with some portions in Aramaic.',
    testament: 'old'
  },
  // GENERAL - Medium
  {
    id: 'general_006',
    question: 'What language was most of the New Testament written in?',
    options: ['Hebrew', 'Greek', 'Aramaic', 'Latin'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'medium',
    verse: 'Various',
    explanation: 'Most of the New Testament was written in Greek, the common language of the Roman Empire.',
    testament: 'new'
  },
  {
    id: 'general_007',
    question: 'What is the shortest verse in the Bible?',
    options: ['Jesus wept', 'Rejoice always', 'Pray continually', 'Love one another'],
    correctAnswer: 0,
    category: 'general',
    difficulty: 'medium',
    verse: 'John 11:35',
    explanation: 'The shortest verse in the Bible is "Jesus wept" (John 11:35).',
    testament: 'new'
  },
  {
    id: 'general_008',
    question: 'What is the longest book in the Bible?',
    options: ['Genesis', 'Psalms', 'Isaiah', 'Revelation'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'medium',
    verse: 'Various',
    explanation: 'Psalms is the longest book in the Bible with 150 chapters.',
    testament: 'old'
  },
  {
    id: 'general_009',
    question: 'What is the shortest book in the Bible?',
    options: ['2 John', '3 John', 'Philemon', 'Jude'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'medium',
    verse: 'Various',
    explanation: '3 John is the shortest book in the Bible with only 14 verses.',
    testament: 'new'
  },
  {
    id: 'general_010',
    question: 'How many authors wrote the Bible?',
    options: ['About 20', 'About 30', 'About 40', 'About 50'],
    correctAnswer: 2,
    category: 'general',
    difficulty: 'medium',
    verse: 'Various',
    explanation: 'The Bible was written by approximately 40 different authors over 1,500 years.',
    testament: 'both'
  },
  // GENERAL - Hard
  {
    id: 'general_011',
    question: 'What is the central theme of the Bible?',
    options: ['God\'s love for humanity', 'The story of Israel', 'Jesus Christ', 'Salvation through faith'],
    correctAnswer: 2,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'Jesus Christ is the central theme of the entire Bible, from Genesis to Revelation.',
    testament: 'both'
  },
  {
    id: 'general_012',
    question: 'What does "Bible" mean?',
    options: ['Holy Book', 'The Books', 'God\'s Word', 'Sacred Text'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'The word "Bible" comes from the Greek "biblia" meaning "the books."',
    testament: 'both'
  },
  {
    id: 'general_013',
    question: 'What is the oldest book in the Bible?',
    options: ['Genesis', 'Job', 'Psalms', 'Exodus'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'Job is considered the oldest book in the Bible, written around 2000-1800 BC.',
    testament: 'old'
  },
  {
    id: 'general_014',
    question: 'What is the newest book in the Bible?',
    options: ['Revelation', 'Jude', '2 Peter', '1 John'],
    correctAnswer: 0,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'Revelation is the newest book in the Bible, written around 95-96 AD.',
    testament: 'new'
  },
  {
    id: 'general_015',
    question: 'How many years does the Bible span?',
    options: ['1,000 years', '1,500 years', '2,000 years', '2,500 years'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'The Bible spans approximately 1,500 years from the time of Moses to the time of John.',
    testament: 'both'
  },
  // GENERAL - Additional Questions
  {
    id: 'general_016',
    question: 'What is the longest chapter in the Bible?',
    options: ['Psalm 119', 'Psalm 23', 'Psalm 1', 'Psalm 51'],
    correctAnswer: 0,
    category: 'general',
    difficulty: 'medium',
    verse: 'Psalm 119',
    explanation: 'Psalm 119 is the longest chapter in the Bible with 176 verses.',
    testament: 'old'
  },
  {
    id: 'general_017',
    question: 'What is the shortest chapter in the Bible?',
    options: ['Psalm 117', 'Psalm 23', 'Psalm 1', 'Psalm 51'],
    correctAnswer: 0,
    category: 'general',
    difficulty: 'medium',
    verse: 'Psalm 117',
    explanation: 'Psalm 117 is the shortest chapter in the Bible with only 2 verses.',
    testament: 'old'
  },
  {
    id: 'general_018',
    question: 'How many languages was the Bible originally written in?',
    options: ['1 language', '2 languages', '3 languages', '4 languages'],
    correctAnswer: 2,
    category: 'general',
    difficulty: 'medium',
    verse: 'Various',
    explanation: 'The Bible was originally written in three languages: Hebrew, Aramaic, and Greek.',
    testament: 'both'
  },
  {
    id: 'general_019',
    question: 'What is the most quoted Old Testament book in the New Testament?',
    options: ['Genesis', 'Psalms', 'Isaiah', 'Exodus'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'Psalms is the most quoted Old Testament book in the New Testament.',
    testament: 'both'
  },
  {
    id: 'general_020',
    question: 'What is the most quoted prophet in the New Testament?',
    options: ['Jeremiah', 'Isaiah', 'Ezekiel', 'Daniel'],
    correctAnswer: 1,
    category: 'general',
    difficulty: 'hard',
    verse: 'Various',
    explanation: 'Isaiah is the most quoted prophet in the New Testament.',
    testament: 'both'
  },
  
  // ==================== NEW EXPANDED QUESTIONS ====================
  
  // MORE CHARACTERS - Easy
  {
    id: 'char_031',
    question: 'Who was the first woman?',
    options: ['Sarah', 'Eve', 'Rachel', 'Mary'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 2:22',
    explanation: 'God made a woman from the rib He had taken out of man and brought her to Adam.',
    testament: 'old'
  },
  {
    id: 'char_032',
    question: 'Who was the mother of Isaac?',
    options: ['Sarah', 'Rebecca', 'Rachel', 'Leah'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 21:3',
    explanation: 'Sarah gave birth to Isaac when she was 90 years old, as God had promised.',
    testament: 'old'
  },
  {
    id: 'char_033',
    question: 'Who was sold into slavery by his brothers?',
    options: ['Benjamin', 'Joseph', 'Judah', 'Reuben'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 37:28',
    explanation: 'Joseph was sold by his brothers to Midianite merchants for twenty shekels of silver.',
    testament: 'old'
  },
  {
    id: 'char_034',
    question: 'Who led the Israelites out of Egypt?',
    options: ['Aaron', 'Moses', 'Joshua', 'Caleb'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Exodus 12:51',
    explanation: 'Moses led the Israelites out of Egypt with a mighty hand and outstretched arm.',
    testament: 'old'
  },
  {
    id: 'char_035',
    question: 'Who was the mother of John the Baptist?',
    options: ['Mary', 'Elizabeth', 'Anna', 'Martha'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Luke 1:57',
    explanation: 'Elizabeth gave birth to John the Baptist in her old age, as the angel had foretold.',
    testament: 'new'
  },
  {
    id: 'char_036',
    question: 'Who betrayed Jesus for thirty pieces of silver?',
    options: ['Peter', 'Judas Iscariot', 'Thomas', 'James'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Matthew 26:15',
    explanation: 'Judas Iscariot agreed to hand Jesus over to the chief priests for thirty pieces of silver.',
    testament: 'new'
  },
  {
    id: 'char_037',
    question: 'Who wrote most of the New Testament letters?',
    options: ['Peter', 'John', 'Paul', 'James'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Various',
    explanation: 'Paul wrote 13-14 epistles in the New Testament, more than any other apostle.',
    testament: 'new'
  },
  {
    id: 'char_038',
    question: 'Who was the father of many nations?',
    options: ['Isaac', 'Jacob', 'Abraham', 'Noah'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 17:5',
    explanation: 'God changed Abram\'s name to Abraham, meaning "father of many nations."',
    testament: 'old'
  },
  {
    id: 'char_039',
    question: 'Who was the mother of Jesus?',
    options: ['Mary', 'Martha', 'Elizabeth', 'Anna'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Luke 1:31',
    explanation: 'The angel told Mary she would conceive and give birth to a son, Jesus.',
    testament: 'new'
  },
  {
    id: 'char_040',
    question: 'Who was Jacob\'s twin brother?',
    options: ['Joseph', 'Benjamin', 'Esau', 'Levi'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'easy',
    verse: 'Genesis 25:26',
    explanation: 'Esau and Jacob were twin brothers, with Esau being the firstborn.',
    testament: 'old'
  },

  // MORE CHARACTERS - Medium
  {
    id: 'char_041',
    question: 'Who was the first king to seek out the baby Jesus?',
    options: ['Herod', 'Pilate', 'Caesar', 'The wise men'],
    correctAnswer: 0,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 2:7',
    explanation: 'King Herod secretly called the wise men to find out when the star had appeared.',
    testament: 'new'
  },
  {
    id: 'char_042',
    question: 'Who was Naomi\'s daughter-in-law who stayed with her?',
    options: ['Orpah', 'Ruth', 'Esther', 'Deborah'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Ruth 1:16',
    explanation: 'Ruth said, "Where you go I will go, and where you stay I will stay."',
    testament: 'old'
  },
  {
    id: 'char_043',
    question: 'Who was the judge who had great strength in his hair?',
    options: ['Gideon', 'Samson', 'Jephthah', 'Barak'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Judges 16:17',
    explanation: 'Samson told Delilah that his strength would leave him if his hair was cut.',
    testament: 'old'
  },
  {
    id: 'char_044',
    question: 'Who was the prophetess who helped lead Israel?',
    options: ['Miriam', 'Deborah', 'Hannah', 'Huldah'],
    correctAnswer: 1,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Judges 4:4',
    explanation: 'Deborah was a prophetess and judge who led Israel to victory over their enemies.',
    testament: 'old'
  },
  {
    id: 'char_045',
    question: 'Who was the Roman centurion whose servant Jesus healed?',
    options: ['Julius', 'Cornelius', 'The centurion at Capernaum', 'Marcus'],
    correctAnswer: 2,
    category: 'characters',
    difficulty: 'medium',
    verse: 'Matthew 8:5-13',
    explanation: 'A centurion came to Jesus asking for his servant to be healed, showing great faith.',
    testament: 'new'
  },

  // MORE STORIES - Easy
  {
    id: 'story_021',
    question: 'How many days and nights did it rain during the flood?',
    options: ['30 days', '40 days', '50 days', '60 days'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Genesis 7:12',
    explanation: 'Rain fell on the earth for forty days and forty nights.',
    testament: 'old'
  },
  {
    id: 'story_022',
    question: 'What did God create on the first day?',
    options: ['Animals', 'Light', 'Plants', 'Man'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Genesis 1:3',
    explanation: 'God said, "Let there be light," and there was light.',
    testament: 'old'
  },
  {
    id: 'story_023',
    question: 'How many brothers did Joseph have?',
    options: ['10 brothers', '11 brothers', '12 brothers', '9 brothers'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Genesis 35:22-26',
    explanation: 'Joseph had 11 brothers: Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher, Issachar, Zebulun, and Benjamin.',
    testament: 'old'
  },
  {
    id: 'story_024',
    question: 'What did God use to lead the Israelites in the wilderness?',
    options: ['A star', 'A cloud by day and fire by night', 'An angel', 'A pillar of salt'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Exodus 13:21',
    explanation: 'The Lord went ahead of them in a pillar of cloud by day and a pillar of fire by night.',
    testament: 'old'
  },
  {
    id: 'story_025',
    question: 'How many people were on Noah\'s ark?',
    options: ['6 people', '8 people', '10 people', '12 people'],
    correctAnswer: 1,
    category: 'stories',
    difficulty: 'easy',
    verse: 'Genesis 7:13',
    explanation: 'Noah, his wife, his three sons, and their wives - eight people total.',
    testament: 'old'
  },

  // MORE VERSES - Easy
  {
    id: 'verse_016',
    question: 'What does John 14:6 say Jesus is?',
    options: ['The way, the truth, and the life', 'The light of the world', 'The good shepherd', 'The bread of life'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'John 14:6',
    explanation: 'Jesus said, "I am the way and the truth and the life. No one comes to the Father except through me."',
    testament: 'new'
  },
  {
    id: 'verse_017',
    question: 'What does Matthew 11:28 say Jesus will give?',
    options: ['Rest', 'Peace', 'Joy', 'Strength'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Matthew 11:28',
    explanation: 'Jesus said, "Come to me, all you who are weary and burdened, and I will give you rest."',
    testament: 'new'
  },
  {
    id: 'verse_018',
    question: 'What does 1 John 4:8 say God is?',
    options: ['Love', 'Light', 'Truth', 'Spirit'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: '1 John 4:8',
    explanation: 'Whoever does not love does not know God, because God is love.',
    testament: 'new'
  },
  {
    id: 'verse_019',
    question: 'What does Psalm 46:1 say God is?',
    options: ['Our refuge and strength', 'Our shield and defender', 'Our rock and fortress', 'Our light and salvation'],
    correctAnswer: 0,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Psalm 46:1',
    explanation: 'God is our refuge and strength, an ever-present help in trouble.',
    testament: 'old'
  },
  {
    id: 'verse_020',
    question: 'What does Isaiah 9:6 call the coming Messiah?',
    options: ['Wonderful Counselor, Mighty God', 'Everlasting Father, Prince of Peace', 'Both A and B', 'None of the above'],
    correctAnswer: 2,
    category: 'verses',
    difficulty: 'easy',
    verse: 'Isaiah 9:6',
    explanation: 'He will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.',
    testament: 'old'
  },

  // MORE MIRACLES - Easy
  {
    id: 'miracle_006',
    question: 'What was Jesus\' first miracle?',
    options: ['Healing a blind man', 'Walking on water', 'Turning water into wine', 'Raising Lazarus'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'John 2:11',
    explanation: 'Jesus turned water into wine at the wedding in Cana, His first miracle.',
    testament: 'new'
  },
  {
    id: 'miracle_007',
    question: 'How many people were fed with five loaves and two fish?',
    options: ['3,000', '4,000', '5,000', '6,000'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Matthew 14:21',
    explanation: 'About five thousand men were fed, besides women and children.',
    testament: 'new'
  },
  {
    id: 'miracle_008',
    question: 'What happened when Jesus healed the paralyzed man?',
    options: ['He walked', 'He ran', 'He jumped', 'He danced'],
    correctAnswer: 0,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Matthew 9:6-7',
    explanation: 'The man got up, took his mat, and went home, glorifying God.',
    testament: 'new'
  },
  {
    id: 'miracle_009',
    question: 'How many lepers did Jesus heal at once?',
    options: ['1', '5', '10', '12'],
    correctAnswer: 2,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Luke 17:14',
    explanation: 'Jesus healed ten lepers, but only one returned to thank Him.',
    testament: 'new'
  },
  {
    id: 'miracle_010',
    question: 'What happened when Jesus raised Jairus\' daughter?',
    options: ['She woke up', 'She sat up', 'She stood up', 'She spoke'],
    correctAnswer: 1,
    category: 'miracles',
    difficulty: 'easy',
    verse: 'Mark 5:42',
    explanation: 'The girl immediately stood up and began to walk around.',
    testament: 'new'
  },

  // MORE GEOGRAPHY - Easy
  {
    id: 'geo_006',
    question: 'Where was Jesus crucified?',
    options: ['Jerusalem', 'Bethlehem', 'Golgotha', 'Nazareth'],
    correctAnswer: 2,
    category: 'geography',
    difficulty: 'easy',
    verse: 'John 19:17',
    explanation: 'Jesus was crucified at Golgotha, which means "the place of the skull."',
    testament: 'new'
  },
  {
    id: 'geo_007',
    question: 'Where was Jesus born?',
    options: ['Nazareth', 'Bethlehem', 'Jerusalem', 'Jericho'],
    correctAnswer: 1,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Matthew 2:1',
    explanation: 'Jesus was born in Bethlehem in Judea during the time of King Herod.',
    testament: 'new'
  },
  {
    id: 'geo_008',
    question: 'Where did Jesus grow up?',
    options: ['Bethlehem', 'Nazareth', 'Jerusalem', 'Capernaum'],
    correctAnswer: 1,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Luke 2:39',
    explanation: 'Jesus grew up in Nazareth, fulfilling the prophecy that He would be called a Nazarene.',
    testament: 'new'
  },
  {
    id: 'geo_009',
    question: 'Where was the Garden of Eden located?',
    options: ['In the east', 'In the west', 'In the north', 'In the south'],
    correctAnswer: 0,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Genesis 2:8',
    explanation: 'The Lord God planted a garden in Eden, in the east.',
    testament: 'old'
  },
  {
    id: 'geo_010',
    question: 'Where did Moses receive the Ten Commandments?',
    options: ['Mount Sinai', 'Mount Horeb', 'Mount Ararat', 'Mount Carmel'],
    correctAnswer: 0,
    category: 'geography',
    difficulty: 'easy',
    verse: 'Exodus 19:20',
    explanation: 'The Lord descended on Mount Sinai and called Moses to the top of the mountain.',
    testament: 'old'
  },

  // ==================== EVEN MORE QUESTIONS ====================
  
  // MORE PARABLES - Easy
  {
    id: 'parable_006',
    question: 'What did the prodigal son do when he returned home?',
    options: ['His father welcomed him', 'His brother welcomed him', 'His father rejected him', 'His brother rejected him'],
    correctAnswer: 0,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 15:20',
    explanation: 'The father saw his son, was filled with compassion, and ran to embrace him.',
    testament: 'new'
  },
  {
    id: 'parable_007',
    question: 'What happened to the seed that fell among thorns?',
    options: ['It grew well', 'It was choked', 'It withered', 'It produced fruit'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Matthew 13:7',
    explanation: 'The seed that fell among thorns was choked by the worries of life.',
    testament: 'new'
  },
  {
    id: 'parable_008',
    question: 'What did the Good Samaritan do for the injured man?',
    options: ['Walked past him', 'Helped him', 'Called the police', 'Left him there'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 10:34',
    explanation: 'The Good Samaritan bandaged the man\'s wounds and took care of him.',
    testament: 'new'
  },
  {
    id: 'parable_009',
    question: 'What did the wise man build his house on?',
    options: ['Sand', 'Rock', 'Clay', 'Soil'],
    correctAnswer: 1,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Matthew 7:24',
    explanation: 'The wise man built his house on the rock.',
    testament: 'new'
  },
  {
    id: 'parable_010',
    question: 'What happened to the lost sheep?',
    options: ['It was found', 'It died', 'It ran away', 'It was stolen'],
    correctAnswer: 0,
    category: 'parables',
    difficulty: 'easy',
    verse: 'Luke 15:5',
    explanation: 'The shepherd found the lost sheep and carried it home on his shoulders.',
    testament: 'new'
  },

  // MORE PROPHECY - Easy
  {
    id: 'prophecy_006',
    question: 'Who prophesied about the suffering servant?',
    options: ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Isaiah 53:3-5',
    explanation: 'Isaiah prophesied about the suffering servant who would bear our sins.',
    testament: 'old'
  },
  {
    id: 'prophecy_007',
    question: 'What did Micah prophesy about Bethlehem?',
    options: ['A ruler would come from there', 'It would be destroyed', 'It would be a great city', 'Nothing'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Micah 5:2',
    explanation: 'Micah prophesied that a ruler would come from Bethlehem.',
    testament: 'old'
  },
  {
    id: 'prophecy_008',
    question: 'What did Zechariah prophesy about Jesus\' entry?',
    options: ['He would ride a donkey', 'He would walk', 'He would ride a horse', 'He would be carried'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Zechariah 9:9',
    explanation: 'Zechariah prophesied that the king would come riding on a donkey.',
    testament: 'old'
  },
  {
    id: 'prophecy_009',
    question: 'What did Isaiah prophesy about Jesus\' birth?',
    options: ['A virgin would conceive', 'A queen would give birth', 'A prophet would be born', 'A king would be born'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Isaiah 7:14',
    explanation: 'Isaiah prophesied that a virgin would conceive and bear a son.',
    testament: 'old'
  },
  {
    id: 'prophecy_010',
    question: 'What did Malachi prophesy about Elijah?',
    options: ['He would return', 'He would die', 'He would be forgotten', 'He would be king'],
    correctAnswer: 0,
    category: 'prophecy',
    difficulty: 'easy',
    verse: 'Malachi 4:5',
    explanation: 'Malachi prophesied that Elijah would return before the great day of the Lord.',
    testament: 'old'
  },

  // MORE WISDOM - Easy
  {
    id: 'wisdom_006',
    question: 'What does Proverbs 16:18 say comes before a fall?',
    options: ['Pride', 'Wealth', 'Power', 'Fame'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Proverbs 16:18',
    explanation: 'Pride goes before destruction, a haughty spirit before a fall.',
    testament: 'old'
  },
  {
    id: 'wisdom_007',
    question: 'What does Ecclesiastes 12:13 say is the whole duty of man?',
    options: ['To fear God and keep His commandments', 'To be successful', 'To be happy', 'To be wealthy'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Ecclesiastes 12:13',
    explanation: 'Fear God and keep his commandments, for this is the whole duty of man.',
    testament: 'old'
  },
  {
    id: 'wisdom_008',
    question: 'What does Proverbs 22:6 say to train up?',
    options: ['A child', 'A soldier', 'A disciple', 'A leader'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Proverbs 22:6',
    explanation: 'Train up a child in the way he should go, and when he is old he will not depart from it.',
    testament: 'old'
  },
  {
    id: 'wisdom_009',
    question: 'What does James 1:19 say we should be?',
    options: ['Quick to listen, slow to speak, slow to become angry', 'Quick to speak, slow to listen', 'Quick to act, slow to think', 'Quick to judge, slow to forgive'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'James 1:19',
    explanation: 'Everyone should be quick to listen, slow to speak and slow to become angry.',
    testament: 'new'
  },
  {
    id: 'wisdom_010',
    question: 'What does Proverbs 3:5-6 say we should do?',
    options: ['Trust in the Lord with all our heart', 'Lean on our own understanding', 'Follow our own path', 'Make our own decisions'],
    correctAnswer: 0,
    category: 'wisdom',
    difficulty: 'easy',
    verse: 'Proverbs 3:5-6',
    explanation: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    testament: 'old'
  },

  // MORE HISTORY - Easy
  {
    id: 'history_006',
    question: 'How many years did the Israelites wander in the wilderness?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: 'Numbers 14:33',
    explanation: 'The Israelites wandered in the wilderness for forty years due to their unbelief.',
    testament: 'old'
  },
  {
    id: 'history_007',
    question: 'How many years was Joseph in Egypt before his family joined him?',
    options: ['10 years', '15 years', '20 years', '25 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: 'Genesis 37:2, 45:6',
    explanation: 'Joseph was 17 when sold into slavery and 30 when he became ruler, then 7 years of plenty and 2 of famine = 22 years total.',
    testament: 'old'
  },
  {
    id: 'history_008',
    question: 'How many years did Solomon reign?',
    options: ['30 years', '35 years', '40 years', '45 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: '1 Kings 11:42',
    explanation: 'Solomon reigned in Jerusalem over all Israel forty years.',
    testament: 'old'
  },
  {
    id: 'history_009',
    question: 'How many years was the Babylonian captivity?',
    options: ['50 years', '60 years', '70 years', '80 years'],
    correctAnswer: 2,
    category: 'history',
    difficulty: 'easy',
    verse: 'Jeremiah 25:11',
    explanation: 'The land would be desolate and the nations would serve the king of Babylon for seventy years.',
    testament: 'old'
  },
  {
    id: 'history_010',
    question: 'How many years did Jesus minister on earth?',
    options: ['2 years', '3 years', '4 years', '5 years'],
    correctAnswer: 1,
    category: 'history',
    difficulty: 'easy',
    verse: 'John 2:13, 6:4, 11:55',
    explanation: 'Jesus\' ministry lasted approximately three years, from His baptism to His crucifixion.',
    testament: 'new'
  }
];

// Quiz Categories with metadata
export const QUIZ_CATEGORIES = {
  characters: {
    name: 'Bible Characters',
    description: 'Test your knowledge of biblical figures',
    icon: '👥',
    color: '#8B5CF6'
  },
  stories: {
    name: 'Bible Stories',
    description: 'Famous events and narratives',
    icon: '📖',
    color: '#06B6D4'
  },
  verses: {
    name: 'Scripture Verses',
    description: 'Memorable Bible passages',
    icon: '✨',
    color: '#10B981'
  },
  geography: {
    name: 'Biblical Geography',
    description: 'Places and locations in the Bible',
    icon: '🗺️',
    color: '#F59E0B'
  },
  miracles: {
    name: 'Miracles',
    description: 'Divine interventions and wonders',
    icon: '⚡',
    color: '#EF4444'
  },
  parables: {
    name: 'Parables',
    description: 'Jesus\' teaching stories',
    icon: '🌱',
    color: '#84CC16'
  },
  prophecy: {
    name: 'Prophecy',
    description: 'Prophetic books and messages',
    icon: '🔮',
    color: '#A855F7'
  },
  wisdom: {
    name: 'Wisdom Literature',
    description: 'Proverbs, Psalms, and wise sayings',
    icon: '🦉',
    color: '#0EA5E9'
  },
  history: {
    name: 'Biblical History',
    description: 'Historical events and timelines',
    icon: '⏳',
    color: '#F97316'
  },
  general: {
    name: 'General Knowledge',
    description: 'Mixed Bible trivia',
    icon: '🎯',
    color: '#6366F1'
  }
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Beginner',
    description: 'Perfect for new Bible readers',
    points: 10,
    color: '#10B981'
  },
  medium: {
    name: 'Intermediate',
    description: 'For regular Bible students',
    points: 20,
    color: '#F59E0B'
  },
  hard: {
    name: 'Expert',
    description: 'Challenge for Bible scholars',
    points: 30,
    color: '#EF4444'
  }
};

// Helper functions
export const getQuestionsByCategory = (category: QuizCategory): QuizQuestion[] => {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByTestament = (testament: 'old' | 'new' | 'both'): QuizQuestion[] => {
  return QUIZ_QUESTIONS.filter(q => q.testament === testament || q.testament === 'both');
};

export const getRandomQuestions = (
  count: number,
  filters?: {
    category?: QuizCategory;
    difficulty?: 'easy' | 'medium' | 'hard';
    testament?: 'old' | 'new' | 'both';
  }
): QuizQuestion[] => {
  let questions = [...QUIZ_QUESTIONS];
  
  if (filters) {
    if (filters.category) {
      questions = questions.filter(q => q.category === filters.category);
    }
    if (filters.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.testament) {
      questions = questions.filter(q => q.testament === filters.testament || q.testament === 'both');
    }
  }
  
  // Shuffle and return requested count
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Level System Configuration
export interface LevelConfig {
  level: number;
  name: string;
  description: string;
  requiredScore: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionsCount: number;
  timePerQuestion: number;
  badge: string;
  color: string;
  unlockMessage: string;
}

export const LEVEL_SYSTEM: LevelConfig[] = [
  {
    level: 1,
    name: 'Seeker',
    description: 'Beginning your Bible journey',
    requiredScore: 0,
    difficulty: 'easy',
    questionsCount: 10,
    timePerQuestion: 45,
    badge: '🌱',
    color: '#10B981',
    unlockMessage: 'Welcome to your Bible learning journey!'
  },
  {
    level: 2,
    name: 'Student',
    description: 'Learning the fundamentals',
    requiredScore: 150,
    difficulty: 'easy',
    questionsCount: 15,
    timePerQuestion: 40,
    badge: '📖',
    color: '#06B6D4',
    unlockMessage: 'You\'re growing in knowledge!'
  },
  {
    level: 3,
    name: 'Disciple',
    description: 'Following the teachings',
    requiredScore: 350,
    difficulty: 'medium',
    questionsCount: 20,
    timePerQuestion: 35,
    badge: '🎓',
    color: '#8B5CF6',
    unlockMessage: 'Your dedication is showing!'
  },
  {
    level: 4,
    name: 'Teacher',
    description: 'Ready to share knowledge',
    requiredScore: 600,
    difficulty: 'medium',
    questionsCount: 25,
    timePerQuestion: 30,
    badge: '👨‍🏫',
    color: '#F59E0B',
    unlockMessage: 'You can now teach others!'
  },
  {
    level: 5,
    name: 'Scholar',
    description: 'Deep understanding achieved',
    requiredScore: 1000,
    difficulty: 'hard',
    questionsCount: 30,
    timePerQuestion: 25,
    badge: '🦉',
    color: '#EF4444',
    unlockMessage: 'You\'ve become a Bible Scholar!'
  },
  {
    level: 6,
    name: 'Master',
    description: 'Mastery of Scripture',
    requiredScore: 1500,
    difficulty: 'hard',
    questionsCount: 35,
    timePerQuestion: 20,
    badge: '👑',
    color: '#A855F7',
    unlockMessage: 'You\'ve mastered the Word!'
  }
];

export const getCurrentLevel = (totalScore: number): LevelConfig => {
  let currentLevel = LEVEL_SYSTEM[0];
  for (const level of LEVEL_SYSTEM) {
    if (totalScore >= level.requiredScore) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

export const getNextLevel = (totalScore: number): LevelConfig | null => {
  const currentLevel = getCurrentLevel(totalScore);
  const nextIndex = currentLevel.level;
  return nextIndex < LEVEL_SYSTEM.length ? LEVEL_SYSTEM[nextIndex] : null;
};

export const getProgressToNextLevel = (totalScore: number): number => {
  const currentLevel = getCurrentLevel(totalScore);
  const nextLevel = getNextLevel(totalScore);
  
  if (!nextLevel) return 100;
  
  const currentLevelScore = currentLevel.requiredScore;
  const nextLevelScore = nextLevel.requiredScore;
  const progress = ((totalScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
  
  return Math.min(100, Math.max(0, progress));
};

export const getQuestionsForLevel = (
  level: LevelConfig,
  filters?: {
    category?: QuizCategory;
    testament?: 'old' | 'new' | 'both';
  }
): QuizQuestion[] => {
  const difficultyFilter = level.difficulty === 'mixed' ? undefined : level.difficulty;
  
  return getRandomQuestions(level.questionsCount, {
    difficulty: difficultyFilter,
    ...filters
  });
};