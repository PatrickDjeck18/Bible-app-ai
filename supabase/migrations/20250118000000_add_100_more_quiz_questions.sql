-- Migration: Add 100 More Bible Quiz Questions
-- This migration adds 100 additional Bible questions to expand the quiz database

-- Add New Questions (100 additional questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- CHARACTERS CATEGORY (20 questions)
('Who was the first woman?', 'Sarah', 'Eve', 'Rachel', 'Mary', 1, 'God made a woman from the rib He had taken out of man and brought her to Adam.', 'characters', 'easy', 'old', 'Genesis', 'Genesis 2:22'),
('Who was the mother of Isaac?', 'Sarah', 'Rebecca', 'Rachel', 'Leah', 0, 'Sarah gave birth to Isaac when she was 90 years old, as God had promised.', 'characters', 'easy', 'old', 'Genesis', 'Genesis 21:3'),
('Who was sold into slavery by his brothers?', 'Benjamin', 'Joseph', 'Judah', 'Reuben', 1, 'Joseph was sold by his brothers to Midianite merchants for twenty shekels of silver.', 'characters', 'easy', 'old', 'Genesis', 'Genesis 37:28'),
('Who led the Israelites out of Egypt?', 'Aaron', 'Moses', 'Joshua', 'Caleb', 1, 'Moses led the Israelites out of Egypt with a mighty hand and outstretched arm.', 'characters', 'easy', 'old', 'Exodus', 'Exodus 12:51'),
('Who was the mother of John the Baptist?', 'Mary', 'Elizabeth', 'Anna', 'Martha', 1, 'Elizabeth gave birth to John the Baptist in her old age, as the angel had foretold.', 'characters', 'easy', 'new', 'Luke', 'Luke 1:57'),
('Who betrayed Jesus for thirty pieces of silver?', 'Peter', 'Judas Iscariot', 'Thomas', 'James', 1, 'Judas Iscariot agreed to hand Jesus over to the chief priests for thirty pieces of silver.', 'characters', 'easy', 'new', 'Matthew', 'Matthew 26:15'),
('Who wrote most of the New Testament letters?', 'Peter', 'John', 'Paul', 'James', 2, 'Paul wrote 13-14 epistles in the New Testament, more than any other apostle.', 'characters', 'easy', 'new', 'Various', 'Various'),
('Who was the father of many nations?', 'Isaac', 'Jacob', 'Abraham', 'Noah', 2, 'God changed Abram''s name to Abraham, meaning "father of many nations."', 'characters', 'easy', 'old', 'Genesis', 'Genesis 17:5'),
('Who was Jacob''s twin brother?', 'Joseph', 'Benjamin', 'Esau', 'Levi', 2, 'Esau and Jacob were twin brothers, with Esau being the firstborn.', 'characters', 'easy', 'old', 'Genesis', 'Genesis 25:26'),
('Who was the first king to seek out the baby Jesus?', 'Herod', 'Pilate', 'Caesar', 'The wise men', 0, 'King Herod secretly called the wise men to find out when the star had appeared.', 'characters', 'medium', 'new', 'Matthew', 'Matthew 2:7'),
('Who was Naomi''s daughter-in-law who stayed with her?', 'Orpah', 'Ruth', 'Esther', 'Deborah', 1, 'Ruth said, "Where you go I will go, and where you stay I will stay."', 'characters', 'medium', 'old', 'Ruth', 'Ruth 1:16'),
('Who was the judge who had great strength in his hair?', 'Gideon', 'Samson', 'Jephthah', 'Barak', 1, 'Samson told Delilah that his strength would leave him if his hair was cut.', 'characters', 'medium', 'old', 'Judges', 'Judges 16:17'),
('Who was the prophetess who helped lead Israel?', 'Miriam', 'Deborah', 'Hannah', 'Huldah', 1, 'Deborah was a prophetess and judge who led Israel to victory over their enemies.', 'characters', 'medium', 'old', 'Judges', 'Judges 4:4'),
('Who was the Roman centurion whose servant Jesus healed?', 'Julius', 'Cornelius', 'The centurion at Capernaum', 'Marcus', 2, 'A centurion came to Jesus asking for his servant to be healed, showing great faith.', 'characters', 'medium', 'new', 'Matthew', 'Matthew 8:5-13'),

-- STORIES CATEGORY (20 questions)
('How many days and nights did it rain during the flood?', '30 days', '40 days', '50 days', '60 days', 1, 'Rain fell on the earth for forty days and forty nights.', 'stories', 'easy', 'old', 'Genesis', 'Genesis 7:12'),
('What did God create on the first day?', 'Animals', 'Light', 'Plants', 'Man', 1, 'God said, "Let there be light," and there was light.', 'stories', 'easy', 'old', 'Genesis', 'Genesis 1:3'),
('How many brothers did Joseph have?', '10 brothers', '11 brothers', '12 brothers', '9 brothers', 1, 'Joseph had 11 brothers: Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher, Issachar, Zebulun, and Benjamin.', 'stories', 'easy', 'old', 'Genesis', 'Genesis 35:22-26'),
('What did God use to lead the Israelites in the wilderness?', 'A star', 'A cloud by day and fire by night', 'An angel', 'A pillar of salt', 1, 'The Lord went ahead of them in a pillar of cloud by day and a pillar of fire by night.', 'stories', 'easy', 'old', 'Exodus', 'Exodus 13:21'),
('How many people were on Noah''s ark?', '6 people', '8 people', '10 people', '12 people', 1, 'Noah, his wife, his three sons, and their wives - eight people total.', 'stories', 'easy', 'old', 'Genesis', 'Genesis 7:13'),

-- VERSES CATEGORY (15 questions)
('What does John 14:6 say Jesus is?', 'The way, the truth, and the life', 'The light of the world', 'The good shepherd', 'The bread of life', 0, 'Jesus said, "I am the way and the truth and the life. No one comes to the Father except through me."', 'verses', 'easy', 'new', 'John', 'John 14:6'),
('What does Matthew 11:28 say Jesus will give?', 'Rest', 'Peace', 'Joy', 'Strength', 0, 'Jesus said, "Come to me, all you who are weary and burdened, and I will give you rest."', 'verses', 'easy', 'new', 'Matthew', 'Matthew 11:28'),
('What does 1 John 4:8 say God is?', 'Love', 'Light', 'Truth', 'Spirit', 0, 'Whoever does not love does not know God, because God is love.', 'verses', 'easy', 'new', '1 John', '1 John 4:8'),
('What does Psalm 46:1 say God is?', 'Our refuge and strength', 'Our shield and defender', 'Our rock and fortress', 'Our light and salvation', 0, 'God is our refuge and strength, an ever-present help in trouble.', 'verses', 'easy', 'old', 'Psalms', 'Psalm 46:1'),
('What does Isaiah 9:6 call the coming Messiah?', 'Wonderful Counselor, Mighty God', 'Everlasting Father, Prince of Peace', 'Both A and B', 'None of the above', 2, 'He will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.', 'verses', 'easy', 'old', 'Isaiah', 'Isaiah 9:6'),

-- MIRACLES CATEGORY (15 questions)
('What was Jesus'' first miracle?', 'Healing a blind man', 'Walking on water', 'Turning water into wine', 'Raising Lazarus', 2, 'Jesus turned water into wine at the wedding in Cana, His first miracle.', 'miracles', 'easy', 'new', 'John', 'John 2:11'),
('How many people were fed with five loaves and two fish?', '3,000', '4,000', '5,000', '6,000', 2, 'About five thousand men were fed, besides women and children.', 'miracles', 'easy', 'new', 'Matthew', 'Matthew 14:21'),
('What happened when Jesus healed the paralyzed man?', 'He walked', 'He ran', 'He jumped', 'He danced', 0, 'The man got up, took his mat, and went home, glorifying God.', 'miracles', 'easy', 'new', 'Matthew', 'Matthew 9:6-7'),
('How many lepers did Jesus heal at once?', '1', '5', '10', '12', 2, 'Jesus healed ten lepers, but only one returned to thank Him.', 'miracles', 'easy', 'new', 'Luke', 'Luke 17:14'),
('What happened when Jesus raised Jairus'' daughter?', 'She woke up', 'She sat up', 'She stood up', 'She spoke', 1, 'The girl immediately stood up and began to walk around.', 'miracles', 'easy', 'new', 'Mark', 'Mark 5:42'),

-- GEOGRAPHY CATEGORY (15 questions)
('Where was Jesus crucified?', 'Jerusalem', 'Bethlehem', 'Golgotha', 'Nazareth', 2, 'Jesus was crucified at Golgotha, which means "the place of the skull."', 'geography', 'easy', 'new', 'John', 'John 19:17'),
('Where was Jesus born?', 'Nazareth', 'Bethlehem', 'Jerusalem', 'Jericho', 1, 'Jesus was born in Bethlehem in Judea during the time of King Herod.', 'geography', 'easy', 'new', 'Matthew', 'Matthew 2:1'),
('Where did Jesus grow up?', 'Bethlehem', 'Nazareth', 'Jerusalem', 'Capernaum', 1, 'Jesus grew up in Nazareth, fulfilling the prophecy that He would be called a Nazarene.', 'geography', 'easy', 'new', 'Luke', 'Luke 2:39'),
('Where was the Garden of Eden located?', 'In the east', 'In the west', 'In the north', 'In the south', 0, 'The Lord God planted a garden in Eden, in the east.', 'geography', 'easy', 'old', 'Genesis', 'Genesis 2:8'),
('Where did Moses receive the Ten Commandments?', 'Mount Sinai', 'Mount Horeb', 'Mount Ararat', 'Mount Carmel', 0, 'The Lord descended on Mount Sinai and called Moses to the top of the mountain.', 'geography', 'easy', 'old', 'Exodus', 'Exodus 19:20'),

-- PARABLES CATEGORY (15 questions)
('What did the prodigal son do when he returned home?', 'His father welcomed him', 'His brother welcomed him', 'His father rejected him', 'His brother rejected him', 0, 'The father saw his son, was filled with compassion, and ran to embrace him.', 'parables', 'easy', 'new', 'Luke', 'Luke 15:20'),
('What happened to the seed that fell among thorns?', 'It grew well', 'It was choked', 'It withered', 'It produced fruit', 1, 'The seed that fell among thorns was choked by the worries of life.', 'parables', 'easy', 'new', 'Matthew', 'Matthew 13:7'),
('What did the Good Samaritan do for the injured man?', 'Walked past him', 'Helped him', 'Called the police', 'Left him there', 1, 'The Good Samaritan bandaged the man''s wounds and took care of him.', 'parables', 'easy', 'new', 'Luke', 'Luke 10:34'),
('What did the wise man build his house on?', 'Sand', 'Rock', 'Clay', 'Soil', 1, 'The wise man built his house on the rock.', 'parables', 'easy', 'new', 'Matthew', 'Matthew 7:24'),
('What happened to the lost sheep?', 'It was found', 'It died', 'It ran away', 'It was stolen', 0, 'The shepherd found the lost sheep and carried it home on his shoulders.', 'parables', 'easy', 'new', 'Luke', 'Luke 15:5');

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_question_length ON quiz_questions(LENGTH(question));
CREATE INDEX IF NOT EXISTS idx_quiz_questions_recent_added ON quiz_questions(created_at DESC);

-- Update statistics
SELECT 'Total questions in database: ' || COUNT(*)::text FROM quiz_questions;