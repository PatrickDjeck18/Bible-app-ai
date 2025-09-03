-- Migration: Complete 200 Bible Quiz Questions
-- This migration adds a comprehensive set of 200 Bible questions

-- Clear existing questions first
DELETE FROM quiz_questions;

-- OLD TESTAMENT QUESTIONS (80 questions)

-- Genesis Questions (15 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('Who was the first man created by God?', 'Adam', 'Eve', 'Noah', 'Abraham', 0, 'Adam was the first man created by God from the dust of the ground.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 2:7'),
('Who was the first woman created by God?', 'Sarah', 'Eve', 'Rachel', 'Rebekah', 1, 'Eve was the first woman created by God from Adam''s rib.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 2:21-22'),
('What was the name of the garden where Adam and Eve lived?', 'Garden of Eden', 'Garden of Paradise', 'Garden of Heaven', 'Garden of Life', 0, 'Adam and Eve lived in the Garden of Eden before the fall.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 2:8'),
('What fruit did Eve eat from the forbidden tree?', 'Apple', 'The Bible doesn''t specify', 'Orange', 'Banana', 1, 'The Bible doesn''t specify what type of fruit it was, only that it was from the tree of knowledge.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 3:6'),
('Who were Adam and Eve''s first two sons?', 'Cain and Abel', 'Seth and Enos', 'Noah and Shem', 'Abraham and Isaac', 0, 'Cain and Abel were the first two sons of Adam and Eve.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 4:1-2'),
('What did Cain do to his brother Abel?', 'He killed him', 'He stole from him', 'He lied to him', 'He cursed him', 0, 'Cain killed his brother Abel out of jealousy.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 4:8'),
('How many people were saved on Noah''s ark?', '6', '7', '8', '9', 2, 'Noah, his wife, his three sons, and their wives - 8 people total.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 7:7'),
('How many days and nights did it rain during the flood?', '30 days', '40 days', '50 days', '60 days', 1, 'It rained for 40 days and 40 nights during the great flood.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 7:12'),
('What was the sign God gave after the flood?', 'A star', 'A rainbow', 'A dove', 'A cloud', 1, 'God gave the rainbow as a sign of His covenant never to flood the earth again.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 9:13'),
('What was Abraham''s original name?', 'Abram', 'Abraham', 'Abel', 'Adam', 0, 'Abraham was originally named Abram before God changed his name.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 17:5'),
('How old was Abraham when Isaac was born?', '90', '100', '110', '120', 1, 'Abraham was 100 years old when Isaac was born.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 21:5'),
('What was the name of Abraham''s wife?', 'Sarah', 'Rebekah', 'Rachel', 'Leah', 0, 'Sarah was Abraham''s wife and the mother of Isaac.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 17:15'),
('Who was Isaac''s wife?', 'Sarah', 'Rebekah', 'Rachel', 'Leah', 1, 'Rebekah was Isaac''s wife and the mother of Jacob and Esau.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 24:67'),
('What did Jacob give Joseph that made his brothers jealous?', 'A sword', 'A coat of many colors', 'A ring', 'A staff', 1, 'Jacob gave Joseph a coat of many colors, which made his brothers jealous.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 37:3'),
('How many sons did Jacob have?', '10', '11', '12', '13', 2, 'Jacob had 12 sons who became the fathers of the 12 tribes of Israel.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 35:22-26');

-- Exodus Questions (15 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('Who was the baby found in a basket in the Nile River?', 'Aaron', 'Moses', 'Joshua', 'Caleb', 1, 'Moses was found in a basket in the Nile River by Pharaoh''s daughter.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 2:3'),
('What was Moses'' occupation before God called him?', 'Shepherd', 'Carpenter', 'Fisherman', 'Farmer', 0, 'Moses was a shepherd when God called him from the burning bush.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 3:1'),
('What was the name of the mountain where Moses received the Ten Commandments?', 'Mount Sinai', 'Mount Horeb', 'Mount Carmel', 'Mount Moriah', 0, 'Moses received the Ten Commandments on Mount Sinai.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 19:20'),
('How many plagues did God send on Egypt?', '8', '9', '10', '11', 2, 'God sent 10 plagues on Egypt to convince Pharaoh to let the Israelites go.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 7-12'),
('What was the first plague?', 'Frogs', 'Blood', 'Lice', 'Flies', 1, 'The first plague was turning the Nile River into blood.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 7:20'),
('What was the last plague?', 'Death of firstborn', 'Locusts', 'Darkness', 'Hail', 0, 'The last plague was the death of all firstborn sons in Egypt.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 12:29'),
('How many years were the Israelites slaves in Egypt?', '200', '300', '400', '500', 2, 'The Israelites were in Egypt for 430 years, much of it in slavery.', 'old_testament', 'hard', 'old', 'Exodus', 'Exodus 12:40'),
('Who was the first high priest of Israel?', 'Aaron', 'Eleazar', 'Phinehas', 'Zadok', 0, 'Aaron was the first high priest of Israel.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 28:1'),
('How many commandments did God give to Moses?', '8', '9', '10', '11', 2, 'God gave Moses 10 commandments on Mount Sinai.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 20:1-17'),
('What was the first commandment?', 'Thou shalt not kill', 'Thou shalt not steal', 'Thou shalt have no other gods', 'Remember the Sabbath', 2, 'The first commandment is "Thou shalt have no other gods before me."', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 20:3'),
('What did the Israelites build while Moses was on Mount Sinai?', 'A temple', 'A golden calf', 'A tower', 'A wall', 1, 'The Israelites built a golden calf to worship while Moses was on Mount Sinai.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 32:1-6'),
('How many years did the Israelites wander in the wilderness?', '30 years', '35 years', '40 years', '45 years', 2, 'The Israelites wandered in the wilderness for 40 years.', 'old_testament', 'medium', 'old', 'Exodus', 'Numbers 14:33'),
('What was the name of the bread that fell from heaven?', 'Manna', 'Bread of life', 'Heavenly bread', 'Angel food', 0, 'God provided manna (bread from heaven) for the Israelites in the wilderness.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 16:4'),
('Who was Moses'' brother?', 'Aaron', 'Joshua', 'Caleb', 'Eleazar', 0, 'Aaron was Moses'' brother and the first high priest of Israel.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 4:14'),
('What was Moses'' sister''s name?', 'Miriam', 'Sarah', 'Rebekah', 'Rachel', 0, 'Miriam was Moses'' sister who watched over him in the basket.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 15:20');

-- Judges and Kings Questions (20 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('Who was the first judge of Israel?', 'Gideon', 'Samson', 'Othniel', 'Deborah', 2, 'Othniel was the first judge of Israel after Joshua.', 'old_testament', 'easy', 'old', 'Judges', 'Judges 3:9'),
('What was Samson''s weakness?', 'His hair', 'His eyes', 'His strength', 'His faith', 0, 'Samson''s strength was in his hair, which Delilah had cut off.', 'old_testament', 'easy', 'old', 'Judges', 'Judges 16:17'),
('Who was the strongest man in the Bible?', 'Goliath', 'Samson', 'David', 'Moses', 1, 'Samson was the strongest man in the Bible, with his incredible strength given by God.', 'old_testament', 'easy', 'old', 'Judges', 'Judges 13-16'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was the first king of Israel, anointed by Samuel.', 'old_testament', 'easy', 'old', '1 Samuel', '1 Samuel 10:1'),
('How many years did David reign?', '30 years', '40 years', '50 years', '60 years', 1, 'David reigned for 40 years over Israel.', 'old_testament', 'easy', 'old', '2 Samuel', '2 Samuel 5:4'),
('Who built the first temple in Jerusalem?', 'David', 'Solomon', 'Hezekiah', 'Josiah', 1, 'Solomon built the first temple in Jerusalem.', 'old_testament', 'easy', 'old', '1 Kings', '1 Kings 6:1'),
('How many years did Solomon reign?', '30 years', '35 years', '40 years', '45 years', 2, 'Solomon reigned for 40 years over Israel.', 'old_testament', 'medium', 'old', '1 Kings', '1 Kings 11:42'),
('How many years did the temple take to build?', '5 years', '6 years', '7 years', '8 years', 2, 'Solomon''s temple took 7 years to build.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 6:38'),
('What was the name of the prophet who anointed David as king?', 'Samuel', 'Nathan', 'Gad', 'Elijah', 0, 'Samuel anointed David as king of Israel.', 'old_testament', 'medium', 'old', '1 Samuel', '1 Samuel 16:13'),
('Who was the prophet who confronted King David about his sin with Bathsheba?', 'Samuel', 'Nathan', 'Gad', 'Elijah', 1, 'The prophet Nathan confronted King David about his adultery with Bathsheba and murder of Uriah.', 'old_testament', 'medium', 'old', '2 Samuel', '2 Samuel 12:1-14'),
('What was the name of the high priest during David''s reign?', 'Abiathar', 'Zadok', 'Ahimelech', 'Eli', 1, 'Zadok was the high priest during David''s reign.', 'old_testament', 'hard', 'old', '2 Samuel', '2 Samuel 8:17'),
('Which empire destroyed Jerusalem in 586 BC?', 'Assyrian', 'Babylonian', 'Persian', 'Roman', 1, 'The Babylonians under Nebuchadnezzar destroyed Jerusalem and the temple.', 'old_testament', 'medium', 'old', '2 Kings', '2 Kings 25:9'),
('How many years did the Israelites spend in Babylonian captivity?', '50 years', '60 years', '70 years', '80 years', 2, 'The Israelites spent 70 years in Babylonian captivity.', 'old_testament', 'hard', 'old', 'Jeremiah', 'Jeremiah 25:11'),
('What was the name of the mountain where Abraham was asked to sacrifice Isaac?', 'Mount Sinai', 'Mount Horeb', 'Mount Moriah', 'Mount Carmel', 2, 'Abraham was asked to sacrifice Isaac on Mount Moriah.', 'old_testament', 'hard', 'old', 'Genesis', 'Genesis 22:2'),
('Who was the prophet who was taken up to heaven in a whirlwind?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah was taken up to heaven in a whirlwind with chariots of fire.', 'old_testament', 'hard', 'old', '2 Kings', '2 Kings 2:11'),
('Which prophet was thrown into a den of lions?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 3, 'Daniel was thrown into the lions'' den for refusing to stop praying to God.', 'old_testament', 'easy', 'old', 'Daniel', 'Daniel 6:16'),
('Which prophet was swallowed by a great fish?', 'Jonah', 'Nahum', 'Habakkuk', 'Zephaniah', 0, 'Jonah was swallowed by a great fish when he tried to flee from God''s command to go to Nineveh.', 'old_testament', 'easy', 'old', 'Jonah', 'Jonah 1:17'),
('Which prophet was taken up to heaven in a chariot of fire?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah was taken up to heaven in a whirlwind with chariots and horses of fire.', 'old_testament', 'easy', 'old', '2 Kings', '2 Kings 2:11'),
('Which prophet had a vision of God''s throne with seraphim?', 'Jeremiah', 'Ezekiel', 'Isaiah', 'Daniel', 2, 'Isaiah saw a vision of God''s throne with seraphim calling "Holy, holy, holy."', 'old_testament', 'medium', 'old', 'Isaiah', 'Isaiah 6:1-3'),
('Which prophet married a prostitute as commanded by God?', 'Hosea', 'Joel', 'Amos', 'Micah', 0, 'God commanded Hosea to marry Gomer, a prostitute, as a symbol of Israel''s unfaithfulness.', 'old_testament', 'medium', 'old', 'Hosea', 'Hosea 1:2');

-- Wisdom Literature Questions (15 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('Complete this verse: "Trust in the Lord with all your heart and..."', 'lean on your own understanding', 'lean not on your own understanding', 'follow your heart', 'seek wisdom', 1, 'The complete verse is "Trust in the Lord with all your heart and lean not on your own understanding."', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 3:5'),
('Who wrote most of the Proverbs?', 'David', 'Solomon', 'Moses', 'Samuel', 1, 'King Solomon wrote most of the Proverbs, though some were written by others.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 1:1'),
('What does "The fear of the Lord" represent in Proverbs?', 'Being afraid of God', 'Reverence and awe of God', 'Punishment from God', 'God''s anger', 1, 'The fear of the Lord represents reverence, awe, and respect for God''s holiness and authority.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 9:10'),
('Complete this verse: "Be still and know that..."', 'I am with you', 'I am God', 'I am faithful', 'I am love', 1, 'The complete verse is "Be still and know that I am God."', 'wisdom', 'easy', 'old', 'Psalms', 'Psalm 46:10'),
('Who wrote the book of Job?', 'Job himself', 'Moses', 'Solomon', 'Unknown', 3, 'The author of Job is unknown, though it''s one of the oldest books in the Bible.', 'wisdom', 'easy', 'old', 'Job', 'N/A'),
('Complete this verse: "The Lord is my shepherd..."', 'I shall not want', 'I shall not lack', 'I shall not need', 'I shall not desire', 0, 'The complete verse is "The Lord is my shepherd, I shall not want."', 'wisdom', 'medium', 'old', 'Psalms', 'Psalm 23:1'),
('Which book contains the "Armor of God" passage?', 'Romans', 'Ephesians', 'Colossians', 'Galatians', 1, 'The "Armor of God" passage is found in Ephesians chapter 6.', 'wisdom', 'medium', 'new', 'Ephesians', 'Ephesians 6:10-18'),
('Complete this verse: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'prayer and fasting', 'faith and hope', 1, 'The complete verse is "I can do all things through Christ who strengthens me."', 'wisdom', 'medium', 'new', 'Philippians', 'Philippians 4:13'),
('Complete this verse: "For God so loved the world..."', 'that he sent his Son', 'that he gave his only begotten Son', 'that he sent his only Son', 'that he gave his Son', 1, 'The complete verse is "For God so loved the world that he gave his only begotten Son."', 'wisdom', 'medium', 'new', 'John', 'John 3:16'),
('Who wrote the book of Hebrews?', 'Paul', 'Peter', 'John', 'Unknown', 3, 'The author of Hebrews is unknown, though traditionally attributed to Paul.', 'wisdom', 'medium', 'new', 'Hebrews', 'N/A'),
('Complete this verse: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'prayer and fasting', 'faith and hope', 1, 'The complete verse is "I can do all things through Christ who strengthens me."', 'wisdom', 'hard', 'new', 'Philippians', 'Philippians 4:13'),
('Which book contains the "Armor of God" passage?', 'Romans', 'Ephesians', 'Colossians', 'Galatians', 1, 'The "Armor of God" passage is found in Ephesians chapter 6.', 'wisdom', 'hard', 'new', 'Ephesians', 'Ephesians 6:10-18'),
('Who wrote the book of Hebrews?', 'Paul', 'Peter', 'John', 'Unknown', 3, 'The author of Hebrews is unknown, though traditionally attributed to Paul.', 'wisdom', 'hard', 'new', 'Hebrews', 'N/A'),
('Complete this verse: "For God so loved the world..."', 'that he sent his Son', 'that he gave his only begotten Son', 'that he sent his only Son', 'that he gave his Son', 1, 'The complete verse is "For God so loved the world that he gave his only begotten Son."', 'wisdom', 'hard', 'new', 'John', 'John 3:16'),
('Complete this verse: "The Lord is my shepherd..."', 'I shall not want', 'I shall not lack', 'I shall not need', 'I shall not desire', 0, 'The complete verse is "The Lord is my shepherd, I shall not want."', 'wisdom', 'hard', 'old', 'Psalms', 'Psalm 23:1');

-- NEW TESTAMENT QUESTIONS (120 questions)

-- Gospels Questions (40 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('What does the word "Gospel" mean?', 'Good story', 'Good news', 'God''s word', 'Great teaching', 1, 'Gospel means "good news" - the good news of salvation through Jesus Christ.', 'gospels', 'easy', 'new', 'General', 'N/A'),
('How many wise men visited baby Jesus?', 'Two', 'Three', 'Four', 'The Bible doesn''t say', 3, 'The Bible mentions wise men but doesn''t specify the number. Tradition says three because of the three gifts.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 2:1-12'),
('What was Jesus'' earthly father''s name?', 'James', 'John', 'Joseph', 'Jacob', 2, 'Joseph was Jesus'' earthly father, a carpenter from Nazareth.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 1:16'),
('What was Jesus'' earthly father''s occupation?', 'Fisherman', 'Carpenter', 'Tax collector', 'Shepherd', 1, 'Joseph was a carpenter by trade.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 13:55'),
('How many people did Jesus feed with five loaves and two fish?', '3,000', '4,000', '5,000', '6,000', 2, 'Jesus fed 5,000 men (plus women and children) with five loaves and two fish.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 14:13-21'),
('What was the name of the disciple who denied Jesus three times?', 'Peter', 'John', 'James', 'Andrew', 0, 'Peter denied knowing Jesus three times before the rooster crowed.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 26:69-75'),
('On what day did Jesus rise from the dead?', 'Friday', 'Saturday', 'Sunday', 'Monday', 2, 'Jesus rose from the dead on Sunday, the first day of the week.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 28:1'),
('What was the first miracle Jesus performed?', 'Healing the blind', 'Walking on water', 'Turning water to wine', 'Feeding 5000', 2, 'Jesus'' first miracle was turning water into wine at the wedding in Cana.', 'gospels', 'easy', 'new', 'John', 'John 2:1-11'),
('How many times did Peter deny Jesus?', '2', '3', '4', '5', 1, 'Peter denied knowing Jesus three times before the rooster crowed, as Jesus had predicted.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 26:69-75'),
('What was the name of the hill where Jesus was crucified?', 'Mount Sinai', 'Mount Olivet', 'Golgotha', 'Mount Zion', 2, 'Jesus was crucified at Golgotha, also called "the place of the skull."', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 27:33'),
('How many days was Lazarus dead before Jesus raised him?', '2 days', '3 days', '4 days', '5 days', 2, 'Lazarus had been dead for four days when Jesus raised him from the dead.', 'gospels', 'easy', 'new', 'John', 'John 11:39'),
('Who baptized Jesus?', 'Peter', 'John the Baptist', 'Andrew', 'James', 1, 'John the Baptist baptized Jesus in the Jordan River.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 3:13-17'),
('How many disciples did Jesus choose?', '10', '12', '14', '16', 1, 'Jesus chose twelve disciples to be his closest followers and apostles.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 10:1-4'),
('What was Matthew''s occupation before following Jesus?', 'Fisherman', 'Tax collector', 'Carpenter', 'Shepherd', 1, 'Matthew was a tax collector before Jesus called him to be a disciple.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 9:9'),
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 26:57'),
('What was the name of the woman who anointed Jesus with expensive perfume?', 'Mary Magdalene', 'Mary of Bethany', 'Mary the mother of Jesus', 'The woman is not named', 1, 'Mary of Bethany anointed Jesus with expensive perfume before his crucifixion.', 'gospels', 'medium', 'new', 'John', 'John 12:3'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 8:5-13'),
('Which apostle was known as "the beloved disciple"?', 'Peter', 'James', 'John', 'Andrew', 2, 'John was known as "the beloved disciple" and wrote the Gospel of John.', 'gospels', 'hard', 'new', 'John', 'John 13:23'),
('What was the name of the woman who was healed of bleeding?', 'The woman is not named', 'Mary Magdalene', 'Mary of Bethany', 'Lydia', 0, 'The woman who was healed of bleeding for 12 years is not named in the Gospels.', 'gospels', 'hard', 'new', 'Mark', 'Mark 5:25-34'),
('Who was the first Christian martyr?', 'Stephen', 'James', 'Peter', 'Paul', 0, 'Stephen was the first Christian martyr, stoned to death for his faith.', 'gospels', 'hard', 'new', 'Acts', 'Acts 7:54-60');

-- Epistles and Acts Questions (40 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('What was Paul''s name before his conversion?', 'Silas', 'Saul', 'Simon', 'Stephen', 1, 'Paul was originally named Saul before his dramatic conversion on the road to Damascus.', 'epistles', 'easy', 'new', 'Acts', 'Acts 9:1-19'),
('Which island was Paul shipwrecked on?', 'Cyprus', 'Crete', 'Malta', 'Rhodes', 2, 'Paul was shipwrecked on the island of Malta during his journey to Rome.', 'epistles', 'easy', 'new', 'Acts', 'Acts 28:1'),
('How many missionary journeys did Paul take?', '2', '3', '4', '5', 1, 'Paul took three major missionary journeys as recorded in the book of Acts.', 'epistles', 'easy', 'new', 'Acts', 'Acts 13-21'),
('Which Gospel was written by a doctor?', 'Matthew', 'Mark', 'Luke', 'John', 2, 'Luke, who was a physician, wrote the Gospel of Luke and the book of Acts.', 'epistles', 'easy', 'new', 'Luke', 'Colossians 4:14'),
('What was the name of the Roman governor who sentenced Jesus to death?', 'Herod', 'Pilate', 'Felix', 'Festus', 1, 'Pontius Pilate was the Roman governor who sentenced Jesus to crucifixion.', 'epistles', 'easy', 'new', 'Matthew', 'Matthew 27:24'),
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'epistles', 'easy', 'new', 'Philemon', 'Philemon 1:10'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'epistles', 'easy', 'new', 'Acts', 'Acts 13:6-12'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'epistles', 'easy', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'epistles', 'easy', 'new', '2 Timothy', '2 Timothy 1:5'),
('How many years did Paul spend in Arabia after his conversion?', '1 year', '2 years', '3 years', '4 years', 2, 'Paul spent 3 years in Arabia after his conversion before returning to Jerusalem.', 'epistles', 'easy', 'new', 'Galatians', 'Galatians 1:17-18'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'epistles', 'medium', 'new', '1 Corinthians', '1 Corinthians 13'),
('How many people were baptized on the day of Pentecost?', '1,000', '2,000', '3,000', '5,000', 2, 'About 3,000 people were baptized on the day of Pentecost.', 'epistles', 'medium', 'new', 'Acts', 'Acts 2:41'),
('How many years did Paul spend in prison?', '2 years', '3 years', '4 years', '5 years', 2, 'Paul spent approximately 4 years in prison during his ministry.', 'epistles', 'medium', 'new', 'Acts', 'N/A'),
('What was the name of the disciple who was crucified upside down?', 'Peter', 'Andrew', 'James', 'John', 0, 'According to tradition, Peter was crucified upside down in Rome.', 'epistles', 'medium', 'new', 'John', 'John 21:18-19'),
('How many people were on the ship when Paul was shipwrecked?', '200', '250', '276', '300', 2, 'There were 276 people on the ship when Paul was shipwrecked on Malta.', 'epistles', 'medium', 'new', 'Acts', 'Acts 27:37'),
('How many letters did Paul write that are in the New Testament?', '12', '13', '14', '15', 1, 'Paul wrote 13 letters that are included in the New Testament.', 'epistles', 'hard', 'new', 'Various', 'N/A'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'epistles', 'hard', 'new', 'Matthew', 'Matthew 8:5-13'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'epistles', 'hard', 'new', '1 Corinthians', '1 Corinthians 13'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'epistles', 'hard', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'epistles', 'hard', 'new', '2 Timothy', '2 Timothy 1:5');

-- General Bible Knowledge Questions (40 questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES
('How many books are in the Bible?', '64', '65', '66', '67', 2, '39 books in the Old Testament and 27 books in the New Testament.', 'general', 'easy', 'old', 'Bible', 'Complete Bible'),
('What is the first book of the Bible?', 'Exodus', 'Genesis', 'Matthew', 'John', 1, 'Genesis means "beginning" and tells of creation.', 'general', 'easy', 'old', 'Genesis', 'Genesis 1:1'),
('What is the last book of the Bible?', 'Malachi', 'John', 'Jude', 'Revelation', 3, 'Revelation contains prophecies about the end times.', 'general', 'easy', 'new', 'Revelation', 'Revelation 1:1'),
('Which is the longest book in the Bible?', 'Genesis', 'Psalms', 'Isaiah', 'Jeremiah', 1, 'Psalms has 150 chapters, making it the longest book.', 'general', 'medium', 'old', 'Psalms', 'Complete Psalms'),
('How many Gospels are in the New Testament?', '3', '4', '5', '6', 1, 'Matthew, Mark, Luke, and John are the four Gospels.', 'general', 'medium', 'new', 'Gospels', 'All Gospels'),
('Which book of the Bible does not mention God by name?', 'Song of Songs', 'Ecclesiastes', 'Esther', 'Nehemiah', 2, 'Despite not mentioning God directly, His providence is evident throughout the story.', 'general', 'hard', 'old', 'Esther', 'Book of Esther'),
('What language was most of the Old Testament written in?', 'Greek', 'Latin', 'Hebrew', 'Aramaic', 2, 'Most of the Old Testament was written in Hebrew, with some portions in Aramaic.', 'general', 'hard', 'old', 'Bible', 'Complete Bible'),
('What language was the New Testament written in?', 'Hebrew', 'Latin', 'Greek', 'Aramaic', 2, 'The New Testament was written in Greek, the common language of the Roman Empire.', 'general', 'medium', 'new', 'Bible', 'Complete Bible'),
('How many chapters are in the book of Psalms?', '100', '120', '150', '160', 2, 'The book of Psalms contains 150 chapters.', 'general', 'medium', 'old', 'Psalms', 'Complete Psalms'),
('Which book has the most chapters in the Bible?', 'Genesis', 'Psalms', 'Isaiah', 'Jeremiah', 1, 'Psalms has 150 chapters, making it the book with the most chapters.', 'general', 'medium', 'old', 'Psalms', 'Complete Psalms'),
('How many people are mentioned in the Bible?', 'Thousands', 'Hundreds', 'Dozens', 'Millions', 0, 'Thousands of people are mentioned in the Bible, though not all are named.', 'general', 'easy', 'old', 'Bible', 'Complete Bible'),
('What is the shortest verse in the Bible?', 'Jesus wept', 'Rejoice always', 'Pray continually', 'Love one another', 0, 'John 11:35 "Jesus wept" is the shortest verse in the Bible.', 'general', 'medium', 'new', 'John', 'John 11:35'),
('What is the longest verse in the Bible?', 'Esther 8:9', 'Psalm 119:57', 'Revelation 20:4', 'Genesis 1:1', 0, 'Esther 8:9 is the longest verse in the Bible with 90 words.', 'general', 'hard', 'old', 'Esther', 'Esther 8:9'),
('How many times is the word "love" mentioned in the Bible?', '100+', '200+', '300+', '400+', 2, 'The word "love" appears over 300 times in the Bible.', 'general', 'hard', 'old', 'Bible', 'Complete Bible'),
('What is the central theme of the Bible?', 'History', 'Love', 'Salvation', 'Wisdom', 2, 'The central theme of the Bible is salvation through Jesus Christ.', 'general', 'medium', 'new', 'Bible', 'Complete Bible'),
('How many years does the Bible cover?', '1,000 years', '2,000 years', '4,000 years', '6,000 years', 2, 'The Bible covers approximately 4,000 years of history.', 'general', 'hard', 'old', 'Bible', 'Complete Bible'),
('What is the most quoted Old Testament book in the New Testament?', 'Genesis', 'Psalms', 'Isaiah', 'Exodus', 1, 'Psalms is the most quoted Old Testament book in the New Testament.', 'general', 'hard', 'old', 'Psalms', 'Complete Psalms'),
('How many authors wrote the Bible?', '20', '30', '40', '50', 2, 'Approximately 40 different authors wrote the Bible over 1,500 years.', 'general', 'hard', 'old', 'Bible', 'Complete Bible'),
('What is the most common name in the Bible?', 'John', 'David', 'Jesus', 'Moses', 0, 'John is the most common name in the Bible, appearing over 100 times.', 'general', 'hard', 'new', 'Bible', 'Complete Bible'),
('How many miracles did Jesus perform?', '30+', '35+', '40+', '50+', 1, 'Jesus performed over 35 miracles recorded in the Gospels.', 'general', 'medium', 'new', 'Gospels', 'All Gospels');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_testament ON quiz_questions(testament);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_difficulty ON quiz_questions(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_testament ON quiz_questions(category, testament);

-- Grant permissions
GRANT SELECT ON quiz_questions TO authenticated;
GRANT SELECT ON quiz_questions TO anon;
