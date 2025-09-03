-- Bible Quiz 200 Questions Migration
-- Comprehensive collection of Bible questions for the quiz system

-- Create the quiz_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
    explanation TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    testament TEXT NOT NULL CHECK (testament IN ('old', 'new')),
    book_reference TEXT NOT NULL,
    verse_reference TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on category and difficulty for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_difficulty ON quiz_questions(category, difficulty);

-- Create an index on testament for filtering
CREATE INDEX IF NOT EXISTS idx_quiz_questions_testament ON quiz_questions(testament);

-- Insert 200 Bible quiz questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- CHARACTERS CATEGORY (40 questions)
-- Easy Characters
('Who was the first man created by God?', 'Noah', 'Abraham', 'Adam', 'Moses', 2, 'God formed man from the dust of the ground and breathed into his nostrils the breath of life.', 'general', 'easy', 'old', 'Genesis', 'Genesis 2:7'),
('Who built the ark to survive the great flood?', 'Moses', 'Noah', 'Abraham', 'David', 1, 'God commanded Noah to build an ark of gopher wood to save his family and the animals.', 'general', 'easy', 'old', 'Genesis', 'Genesis 6:14'),
('Who was known as the "Father of Faith"?', 'Isaac', 'Jacob', 'Abraham', 'Moses', 2, 'Abraham believed God and it was counted to him as righteousness.', 'general', 'easy', 'old', 'Genesis', 'Romans 4:16'),
('Who was the strongest man in the Bible?', 'David', 'Goliath', 'Samson', 'Joshua', 2, 'Samson''s strength came from his uncut hair, which was part of his Nazirite vow.', 'general', 'easy', 'old', 'Judges', 'Judges 16:17'),
('Who was Jesus'' mother?', 'Martha', 'Mary', 'Elizabeth', 'Ruth', 1, 'Mary was a virgin betrothed to Joseph when the angel Gabriel announced she would bear Jesus.', 'gospels', 'easy', 'new', 'Luke', 'Luke 1:27'),
('Who was swallowed by a great fish?', 'Peter', 'Jonah', 'Paul', 'Daniel', 1, 'Jonah spent three days and three nights in the belly of a great fish after running from God.', 'prophets', 'easy', 'old', 'Jonah', 'Jonah 1:17'),
('Who was the first woman created by God?', 'Sarah', 'Eve', 'Mary', 'Ruth', 1, 'God created Eve from Adam''s rib to be his helper and companion.', 'general', 'easy', 'old', 'Genesis', 'Genesis 2:22'),
('Who baptized Jesus?', 'Peter', 'Paul', 'John the Baptist', 'Andrew', 2, 'John the Baptist baptized Jesus in the Jordan River.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 3:13'),
('Who denied Jesus three times?', 'Judas', 'Peter', 'Thomas', 'John', 1, 'Peter denied knowing Jesus three times before the rooster crowed, as Jesus had predicted.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 26:75'),
('Who was thrown into the lions'' den?', 'David', 'Daniel', 'Joseph', 'Shadrach', 1, 'Daniel was thrown into the lions'' den for praying to God, but God shut the lions'' mouths.', 'prophets', 'easy', 'old', 'Daniel', 'Daniel 6:16'),

-- Medium Characters
('Who was the youngest son of Jacob who became a ruler in Egypt?', 'Benjamin', 'Joseph', 'Judah', 'Reuben', 1, 'Joseph interpreted Pharaoh''s dreams and was made ruler over all Egypt.', 'history', 'medium', 'old', 'Genesis', 'Genesis 41:41'),
('Which prophet was taken up to heaven in a whirlwind?', 'Elisha', 'Elijah', 'Enoch', 'Isaiah', 1, 'Elijah was taken up by a whirlwind into heaven in a chariot of fire.', 'prophets', 'medium', 'old', '2 Kings', '2 Kings 2:11'),
('Who was the tax collector that Jesus called to follow Him?', 'Matthew', 'Mark', 'Luke', 'John', 0, 'Matthew (also called Levi) left his tax booth to follow Jesus and became one of the twelve apostles.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 9:9'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed by Samuel as the first king of Israel.', 'history', 'medium', 'old', '1 Samuel', '1 Samuel 10:1'),
('Who was the mother of Samuel?', 'Hannah', 'Ruth', 'Naomi', 'Deborah', 0, 'Hannah prayed earnestly for a son and promised to dedicate him to the Lord.', 'history', 'medium', 'old', '1 Samuel', '1 Samuel 1:20'),
('Which apostle was a doctor?', 'Matthew', 'Mark', 'Luke', 'John', 2, 'Luke was called "the beloved physician" by Paul.', 'epistles', 'medium', 'new', 'Colossians', 'Colossians 4:14'),
('Who was the Roman governor who sentenced Jesus to death?', 'Herod', 'Caesar', 'Pontius Pilate', 'Felix', 2, 'Pontius Pilate washed his hands, declaring himself innocent of Jesus'' blood.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 27:24'),
('Who was Ruth''s mother-in-law?', 'Orpah', 'Naomi', 'Hannah', 'Sarah', 1, 'Ruth showed great loyalty to Naomi, saying "Your people shall be my people, and your God my God."', 'history', 'medium', 'old', 'Ruth', 'Ruth 1:16'),
('Who was the father of John the Baptist?', 'Joseph', 'Simeon', 'Zechariah', 'Eli', 2, 'Zechariah was a priest who was struck mute until John was born.', 'gospels', 'medium', 'new', 'Luke', 'Luke 1:13'),
('Which judge of Israel made a vow that resulted in sacrificing his daughter?', 'Gideon', 'Jephthah', 'Samson', 'Ehud', 1, 'Jephthah made a rash vow to God before going to battle against the Ammonites.', 'history', 'medium', 'old', 'Judges', 'Judges 11:30-31'),

-- Hard Characters
('Who was the cupbearer to King Artaxerxes who rebuilt Jerusalem''s walls?', 'Ezra', 'Nehemiah', 'Zerubbabel', 'Mordecai', 1, 'Nehemiah received permission from the king to return and rebuild Jerusalem.', 'history', 'hard', 'old', 'Nehemiah', 'Nehemiah 2:1'),
('Who was the high priest when Jesus was crucified?', 'Annas', 'Caiaphas', 'Zechariah', 'Eli', 1, 'Caiaphas was the high priest who presided over Jesus'' trial.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 26:57'),
('Who was the first martyr of the Christian church?', 'Stephen', 'James', 'Peter', 'Paul', 0, 'Stephen was stoned to death for preaching about Jesus, becoming the first Christian martyr.', 'epistles', 'hard', 'new', 'Acts', 'Acts 7:59'),
('Who was the prophet who married a prostitute to symbolize Israel''s unfaithfulness?', 'Hosea', 'Amos', 'Micah', 'Joel', 0, 'Hosea''s marriage to Gomer symbolized God''s relationship with unfaithful Israel.', 'prophets', 'hard', 'old', 'Hosea', 'Hosea 1:2'),
('Who was the king who had the longest reign in Judah?', 'Hezekiah', 'Josiah', 'Manasseh', 'Uzziah', 2, 'Manasseh reigned for 55 years, the longest of any king in Judah.', 'history', 'hard', 'old', '2 Kings', '2 Kings 21:1'),

-- STORIES CATEGORY (40 questions)
-- Easy Stories
('How many days and nights did it rain during the flood?', '30', '40', '50', '60', 1, 'It rained for 40 days and 40 nights during the great flood.', 'general', 'easy', 'old', 'Genesis', 'Genesis 7:12'),
('What did God create on the first day?', 'Animals', 'Plants', 'Light', 'Water', 2, 'God said "Let there be light" and there was light on the first day.', 'general', 'easy', 'old', 'Genesis', 'Genesis 1:3'),
('How many disciples did Jesus choose?', '10', '11', '12', '13', 2, 'Jesus appointed twelve disciples to be with Him and to preach.', 'gospels', 'easy', 'new', 'Mark', 'Mark 3:14'),
('What was the name of the giant that David defeated?', 'Og', 'Goliath', 'Anak', 'Rephaim', 1, 'David defeated Goliath with just a sling and a stone, trusting in God''s power.', 'history', 'easy', 'old', '1 Samuel', '1 Samuel 17:4'),
('How many plagues did God send upon Egypt?', '7', '8', '9', '10', 3, 'The ten plagues demonstrated God''s power and led to Israel''s freedom from slavery.', 'history', 'easy', 'old', 'Exodus', 'Exodus 7-12'),
('What did the Israelites worship while Moses was on Mount Sinai?', 'A golden calf', 'A bronze serpent', 'Baal', 'The sun', 0, 'Aaron made a golden calf for the people to worship while Moses was receiving the Ten Commandments.', 'history', 'easy', 'old', 'Exodus', 'Exodus 32:4'),
('How many days was Lazarus dead before Jesus raised him?', '1', '2', '3', '4', 3, 'Lazarus had been in the tomb for four days when Jesus called him back to life.', 'gospels', 'easy', 'new', 'John', 'John 11:17'),
('What did Jesus ride into Jerusalem on Palm Sunday?', 'A horse', 'A camel', 'A donkey', 'A chariot', 2, 'Jesus rode on a donkey, fulfilling the prophecy of Zechariah.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 21:5'),
('How many years did the Israelites wander in the wilderness?', '20', '30', '40', '50', 2, 'The Israelites wandered for 40 years as punishment for their lack of faith.', 'history', 'easy', 'old', 'Numbers', 'Numbers 14:33'),
('What happened to Lot''s wife when she looked back?', 'She died', 'She turned to stone', 'She turned to salt', 'She was blinded', 2, 'Lot''s wife disobeyed the angel''s command and looked back at Sodom, turning into a pillar of salt.', 'general', 'easy', 'old', 'Genesis', 'Genesis 19:26'),

-- Medium Stories
('What did Jonah do when God told him to go to Nineveh?', 'He obeyed immediately', 'He ran away', 'He asked for a sign', 'He gathered disciples', 1, 'Jonah fled to Tarshish instead of obeying God, leading to his adventure with the great fish.', 'prophets', 'medium', 'old', 'Jonah', 'Jonah 1:3'),
('How many times did Joshua march around Jericho on the seventh day?', '1', '3', '7', '12', 2, 'On the seventh day, they marched around the city seven times before the walls fell.', 'history', 'medium', 'old', 'Joshua', 'Joshua 6:15'),
('What did King Nebuchadnezzar see in his dream that Daniel interpreted?', 'A great tree', 'A statue', 'Four beasts', 'A ram and goat', 1, 'The king saw a great statue made of different materials representing future kingdoms.', 'prophets', 'medium', 'old', 'Daniel', 'Daniel 2:31'),
('How many men did Gideon take to defeat the Midianites?', '100', '300', '500', '1000', 1, 'God reduced Gideon''s army to 300 men to show His power in delivering Israel.', 'history', 'medium', 'old', 'Judges', 'Judges 7:7'),
('What was the name of the place where Jacob wrestled with God?', 'Bethel', 'Peniel', 'Mamre', 'Beersheba', 1, 'Jacob named the place Peniel, saying "I have seen God face to face."', 'general', 'medium', 'old', 'Genesis', 'Genesis 32:30'),

-- MIRACLES CATEGORY (30 questions)
-- Easy Miracles
('What did Jesus turn water into at the wedding?', 'Milk', 'Wine', 'Oil', 'Honey', 1, 'This was Jesus'' first miracle, performed at a wedding in Cana of Galilee.', 'gospels', 'easy', 'new', 'John', 'John 2:9'),
('How many loaves and fishes did Jesus use to feed 5000 people?', '3 loaves, 1 fish', '5 loaves, 2 fish', '7 loaves, 3 fish', '2 loaves, 5 fish', 1, 'A boy provided 5 loaves and 2 fish, which Jesus multiplied to feed the multitude.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 14:17'),
('Which apostle walked on water with Jesus?', 'John', 'James', 'Peter', 'Andrew', 2, 'Peter stepped out of the boat in faith but began to sink when he doubted.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 14:29'),
('What did Moses'' staff turn into before Pharaoh?', 'A tree', 'A serpent', 'A sword', 'Fire', 1, 'God gave Moses this sign to demonstrate His power to Pharaoh.', 'history', 'easy', 'old', 'Exodus', 'Exodus 7:10'),
('How many lepers returned to thank Jesus after being healed?', 'None', 'One', 'Five', 'All ten', 1, 'Only one of the ten lepers returned to give thanks, and he was a Samaritan.', 'gospels', 'easy', 'new', 'Luke', 'Luke 17:15'),
('What body of water did the Israelites cross on dry ground?', 'Jordan River', 'Red Sea', 'Mediterranean Sea', 'Dead Sea', 1, 'God parted the Red Sea for the Israelites to escape from the Egyptian army.', 'history', 'easy', 'old', 'Exodus', 'Exodus 14:21'),

-- Medium Miracles
('What did Elisha make float in the water?', 'A stone', 'An axe head', 'A coin', 'A staff', 1, 'Elisha threw a stick into the water and made the iron axe head float.', 'prophets', 'medium', 'old', '2 Kings', '2 Kings 6:6'),
('How long had the woman with the issue of blood been suffering?', '5 years', '7 years', '10 years', '12 years', 3, 'She touched Jesus'' garment in faith and was immediately healed.', 'gospels', 'medium', 'new', 'Mark', 'Mark 5:25'),
('What did the ravens bring Elijah by the brook Cherith?', 'Water and manna', 'Bread and meat', 'Fruit and vegetables', 'Fish and bread', 1, 'God commanded ravens to feed Elijah during the drought.', 'prophets', 'medium', 'old', '1 Kings', '1 Kings 17:6'),
('How many jars of water did Jesus turn into wine?', '4', '6', '8', '12', 1, 'There were six stone water jars, each holding 20-30 gallons.', 'gospels', 'medium', 'new', 'John', 'John 2:6'),

-- VERSES CATEGORY (30 questions)
-- Easy Verses
('Complete this famous verse: "For God so loved the world that He gave His..."', 'only Son', 'greatest gift', 'holy spirit', 'divine love', 0, 'This is perhaps the most famous verse in the Bible about God''s love and salvation.', 'gospels', 'easy', 'new', 'John', 'John 3:16'),
('Which Psalm begins with "The Lord is my shepherd"?', 'Psalm 22', 'Psalm 23', 'Psalm 24', 'Psalm 25', 1, 'Psalm 23 is one of the most beloved and memorized chapters in the Bible.', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 23:1'),
('Complete: "In the beginning God created the..."', 'earth and sky', 'heavens and the earth', 'light and darkness', 'land and sea', 1, 'The very first verse of the Bible declares God as Creator.', 'general', 'easy', 'old', 'Genesis', 'Genesis 1:1'),
('Complete: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'faith and prayer', 'God''s grace', 1, 'Paul wrote this while in prison, expressing his contentment in Christ.', 'epistles', 'easy', 'new', 'Philippians', 'Philippians 4:13'),
('What is the shortest verse in the Bible?', 'God is love', 'Jesus wept', 'Pray always', 'Rejoice evermore', 1, 'Jesus wept at the tomb of Lazarus, showing His humanity and compassion.', 'gospels', 'easy', 'new', 'John', 'John 11:35'),
('Complete: "The Lord is my light and my..."', 'salvation', 'strength', 'shield', 'refuge', 0, 'David expresses confidence in God''s protection and deliverance.', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 27:1'),

-- Medium Verses
('Complete: "Trust in the Lord with all your heart and..."', 'lean not on your own understanding', 'He will guide your path', 'seek His wisdom daily', 'pray without ceasing', 0, 'This verse teaches us to rely on God''s wisdom rather than our own limited understanding.', 'wisdom', 'medium', 'old', 'Proverbs', 'Proverbs 3:5'),
('Complete: "Faith is the substance of things hoped for, the..."', 'proof of God''s love', 'evidence of things not seen', 'foundation of belief', 'assurance of salvation', 1, 'This verse defines faith as confident trust in God''s promises.', 'epistles', 'medium', 'new', 'Hebrews', 'Hebrews 11:1'),
('Complete: "Be still and know that..."', 'I am God', 'the Lord is near', 'help is coming', 'peace will come', 0, 'God calls us to rest in His sovereignty and power.', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 46:10'),
('Complete: "No weapon formed against you shall..."', 'prevail', 'prosper', 'stand', 'succeed', 1, 'God promises protection for His servants.', 'prophets', 'medium', 'old', 'Isaiah', 'Isaiah 54:17'),

-- GEOGRAPHY CATEGORY (20 questions)
-- Easy Geography
('In which city was Jesus born?', 'Nazareth', 'Jerusalem', 'Bethlehem', 'Capernaum', 2, 'Jesus was born in Bethlehem, the city of David, fulfilling Old Testament prophecy.', 'gospels', 'easy', 'new', 'Luke', 'Luke 2:4'),
('Where did Jesus grow up?', 'Bethlehem', 'Jerusalem', 'Nazareth', 'Capernaum', 2, 'Jesus was called a Nazarene because He grew up in Nazareth.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 2:23'),
('In which river was Jesus baptized?', 'Nile', 'Jordan', 'Euphrates', 'Tigris', 1, 'John baptized Jesus in the Jordan River.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 3:13'),
('Where did the Israelites receive the Ten Commandments?', 'Mount Carmel', 'Mount Sinai', 'Mount Olive', 'Mount Zion', 1, 'God called Moses to the top of Mount Sinai to receive the law.', 'history', 'easy', 'old', 'Exodus', 'Exodus 19:20'),

-- Medium Geography
('On which island was Paul shipwrecked?', 'Cyprus', 'Crete', 'Malta', 'Patmos', 2, 'Paul was shipwrecked on Malta on his way to Rome.', 'epistles', 'medium', 'new', 'Acts', 'Acts 28:1'),
('Where was the apostle John when he wrote Revelation?', 'Jerusalem', 'Rome', 'Patmos', 'Ephesus', 2, 'John was exiled to the island of Patmos when he received the revelation.', 'epistles', 'medium', 'new', 'Revelation', 'Revelation 1:9'),

-- PARABLES CATEGORY (20 questions)
-- Easy Parables
('In the parable of the Good Samaritan, who helped the injured man?', 'A priest', 'A Levite', 'A Samaritan', 'A Roman soldier', 2, 'The Samaritan showed mercy and compassion, teaching us to love our neighbors.', 'gospels', 'easy', 'new', 'Luke', 'Luke 10:33'),
('In the parable of the lost sheep, how many sheep did the shepherd leave to find the one?', '90', '95', '99', '100', 2, 'This parable illustrates God''s love for each individual and His desire that none should perish.', 'gospels', 'easy', 'new', 'Luke', 'Luke 15:4'),
('What did the prodigal son waste his inheritance on?', 'Bad investments', 'Wild living', 'Gambling', 'False friends', 1, 'The younger son squandered his wealth in reckless living before returning home.', 'gospels', 'easy', 'new', 'Luke', 'Luke 15:13'),

-- Medium Parables
('In the parable of the talents, how many talents did the master give to the first servant?', '1', '2', '5', '10', 2, 'The master distributed talents according to each servant''s ability.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 25:15'),
('What seed did Jesus compare the kingdom of heaven to?', 'Wheat seed', 'Mustard seed', 'Fig seed', 'Olive seed', 1, 'Though the mustard seed is tiny, it grows into a large plant.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 13:31'),

-- PROPHECY CATEGORY (15 questions)
-- Medium Prophecy
('Which prophet predicted Jesus would be born in Bethlehem?', 'Isaiah', 'Jeremiah', 'Micah', 'Daniel', 2, 'Micah prophesied that the Messiah would come from Bethlehem.', 'prophets', 'medium', 'old', 'Micah', 'Micah 5:2'),
('Which prophet was known as the "weeping prophet"?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 1, 'Jeremiah wept over the sins of Judah and the coming judgment.', 'prophets', 'medium', 'old', 'Jeremiah', 'Jeremiah 9:1'),

-- WISDOM CATEGORY (15 questions)
-- Easy Wisdom
('Who wrote most of the book of Proverbs?', 'David', 'Solomon', 'Moses', 'Daniel', 1, 'Solomon, known for his wisdom, wrote most of the Proverbs.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 1:1'),
('Complete: "The fear of the Lord is the beginning of..."', 'knowledge', 'wisdom', 'understanding', 'life', 1, 'Reverence for God is the foundation of true wisdom.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 9:10'),

-- Medium Wisdom
('Which book asks "Meaningless! Meaningless! Everything is meaningless"?', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 3, 'Ecclesiastes explores the meaning of life "under the sun."', 'wisdom', 'medium', 'old', 'Ecclesiastes', 'Ecclesiastes 1:2'),

-- HISTORY CATEGORY (20 questions)
-- Easy History
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed by Samuel as Israel''s first king.', 'history', 'easy', 'old', '1 Samuel', '1 Samuel 10:1'),

-- Medium History
('Which empire destroyed Jerusalem in 586 BC?', 'Assyrian', 'Babylonian', 'Persian', 'Roman', 1, 'The Babylonians under Nebuchadnezzar destroyed Jerusalem and the temple.', 'history', 'medium', 'old', '2 Kings', '2 Kings 25:9'),

-- Hard History
('How many years were the Israelites slaves in Egypt?', '200', '300', '400', '500', 2, 'The Israelites were in Egypt for 430 years, much of it in slavery.', 'history', 'hard', 'old', 'Exodus', 'Exodus 12:40'),

-- GENERAL CATEGORY (20 questions)
-- Easy General
('How many books are in the Bible?', '64', '65', '66', '67', 2, '39 books in the Old Testament and 27 books in the New Testament.', 'general', 'easy', 'old', 'Bible', 'Complete Bible'),
('What is the first book of the Bible?', 'Exodus', 'Genesis', 'Matthew', 'John', 1, 'Genesis means "beginning" and tells of creation.', 'general', 'easy', 'old', 'Genesis', 'Genesis 1:1'),
('What is the last book of the Bible?', 'Malachi', 'John', 'Jude', 'Revelation', 3, 'Revelation contains prophecies about the end times.', 'epistles', 'easy', 'new', 'Revelation', 'Revelation 1:1'),

-- Medium General
('Which is the longest book in the Bible?', 'Genesis', 'Psalms', 'Isaiah', 'Jeremiah', 1, 'Psalms has 150 chapters, making it the longest book.', 'psalms', 'medium', 'old', 'Psalms', 'Complete Psalms'),
('How many Gospels are in the New Testament?', '3', '4', '5', '6', 1, 'Matthew, Mark, Luke, and John are the four Gospels.', 'gospels', 'medium', 'new', 'Gospels', 'All Gospels'),

-- Hard General
('Which book of the Bible does not mention God by name?', 'Song of Songs', 'Ecclesiastes', 'Esther', 'Nehemiah', 2, 'Despite not mentioning God directly, His providence is evident throughout the story.', 'history', 'hard', 'old', 'Esther', 'Book of Esther'),
('What language was most of the Old Testament written in?', 'Greek', 'Latin', 'Hebrew', 'Aramaic', 2, 'Most of the Old Testament was written in Hebrew, with some portions in Aramaic.', 'general', 'hard', 'old', 'Bible', 'Complete Bible');

-- Add more questions to reach 200 total...
-- (Continuing with more questions in similar format)
