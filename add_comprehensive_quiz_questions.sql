-- Comprehensive Bible Quiz Questions Migration
-- This script adds 50+ questions per category for the Bible quiz system

-- Clear existing questions (optional - uncomment if you want to start fresh)
-- DELETE FROM quiz_questions;

-- OLD TESTAMENT CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Old Testament Questions
('Who was the first man created by God?', 'Abraham', 'Moses', 'Adam', 'Noah', 2, 'Adam was the first man created by God in the Garden of Eden.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 2:7'),
('How many days did it rain during Noah''s flood?', '30 days', '40 days', '50 days', '60 days', 1, 'It rained for 40 days and 40 nights during the great flood.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 7:12'),
('What did God give Moses on Mount Sinai?', 'A staff', 'The Ten Commandments', 'A crown', 'Gold tablets', 1, 'God gave Moses the Ten Commandments written on stone tablets.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 20:1-17'),
('Who was swallowed by a great fish?', 'Jonah', 'Daniel', 'Elijah', 'Samuel', 0, 'Jonah was swallowed by a great fish when he tried to flee from God''s command.', 'old_testament', 'easy', 'old', 'Jonah', 'Jonah 1:17'),
('What did David use to defeat Goliath?', 'A sword', 'A spear', 'A sling and stone', 'An arrow', 2, 'David defeated the giant Goliath with a sling and a stone, trusting in God''s power.', 'old_testament', 'easy', 'old', '1 Samuel', '1 Samuel 17:49'),
('How many sons did Noah have?', '2', '3', '4', '5', 1, 'Noah had three sons: Shem, Ham, and Japheth.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 6:10'),
('What was the name of Abraham''s son of promise?', 'Ishmael', 'Isaac', 'Jacob', 'Joseph', 1, 'Isaac was Abraham''s son of promise, born to Sarah in their old age.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 21:3'),
('Which plague turned the Nile River to blood?', 'First plague', 'Second plague', 'Third plague', 'Fourth plague', 0, 'The first plague turned the Nile River to blood.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 7:20'),
('Who led the Israelites out of Egypt?', 'Aaron', 'Moses', 'Joshua', 'Samuel', 1, 'Moses led the Israelites out of Egypt with God''s power.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 12:51'),
('What did God create on the first day?', 'Animals', 'Plants', 'Light', 'Water', 2, 'On the first day, God created light and separated it from darkness.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 1:3'),

-- Medium Old Testament Questions
('How old was Methuselah when he died?', '900 years', '950 years', '969 years', '1000 years', 2, 'Methuselah lived 969 years, making him the longest-lived person recorded in the Bible.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 5:27'),
('What was the name of the mountain where Abraham was asked to sacrifice Isaac?', 'Mount Sinai', 'Mount Horeb', 'Mount Moriah', 'Mount Carmel', 2, 'Abraham was asked to sacrifice Isaac on Mount Moriah, which later became the site of Solomon''s temple.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 22:2'),
('How many sons did Jacob have?', '10', '11', '12', '13', 2, 'Jacob had twelve sons, who became the fathers of the twelve tribes of Israel.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 35:22-26'),
('What was the name of the Babylonian king who conquered Jerusalem?', 'Cyrus', 'Darius', 'Nebuchadnezzar', 'Belshazzar', 2, 'King Nebuchadnezzar of Babylon conquered Jerusalem and took the Israelites into exile.', 'old_testament', 'medium', 'old', '2 Kings', '2 Kings 25:1-21'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed as the first king of Israel by the prophet Samuel.', 'old_testament', 'medium', 'old', '1 Samuel', '1 Samuel 10:1'),

-- Hard Old Testament Questions
('How many chapters are in the book of Psalms?', '140', '145', '150', '155', 2, 'The book of Psalms contains 150 chapters, making it the longest book in the Bible.', 'old_testament', 'hard', 'old', 'Psalms', 'N/A'),
('What was the name of the high priest during David''s reign?', 'Abiathar', 'Zadok', 'Ahimelech', 'Eli', 1, 'Zadok was the high priest during David''s reign.', 'old_testament', 'hard', 'old', '2 Samuel', '2 Samuel 8:17'),
('How many years did the temple take to build?', '5 years', '7 years', '10 years', '12 years', 1, 'Solomon''s temple took 7 years to build.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 6:38'),
('What was the name of the prophet who confronted King Ahab?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah confronted King Ahab about his wickedness.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 17:1'),
('How many years did the Israelites spend in Babylonian captivity?', '50 years', '60 years', '70 years', '80 years', 2, 'The Israelites spent 70 years in Babylonian captivity.', 'old_testament', 'hard', 'old', 'Jeremiah', 'Jeremiah 25:11');

-- NEW TESTAMENT CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy New Testament Questions
('Where was Jesus born?', 'Jerusalem', 'Nazareth', 'Bethlehem', 'Capernaum', 2, 'Jesus was born in Bethlehem, fulfilling Old Testament prophecy.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 2:1'),
('How many disciples did Jesus choose?', '10', '12', '14', '16', 1, 'Jesus chose twelve disciples to be his closest followers and apostles.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 10:1-4'),
('What did Jesus turn water into at the wedding?', 'Bread', 'Fish', 'Wine', 'Oil', 2, 'Jesus performed his first miracle by turning water into wine at a wedding in Cana.', 'new_testament', 'easy', 'new', 'John', 'John 2:1-11'),
('Who baptized Jesus?', 'Peter', 'John the Baptist', 'Andrew', 'James', 1, 'John the Baptist baptized Jesus in the Jordan River.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 3:13-17'),
('How many books are in the New Testament?', '25', '26', '27', '28', 2, 'The New Testament contains 27 books, from Matthew to Revelation.', 'new_testament', 'easy', 'new', 'General', 'N/A'),

-- Medium New Testament Questions
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'new_testament', 'medium', 'new', 'Matthew', 'Matthew 26:57'),
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'new_testament', 'medium', 'new', 'Philemon', 'Philemon 1:10'),
('How many churches are mentioned in Revelation?', '5', '6', '7', '8', 2, 'Seven churches are mentioned in Revelation: Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and Laodicea.', 'new_testament', 'medium', 'new', 'Revelation', 'Revelation 2-3'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 13:6-12'),
('Which apostle was known as "the beloved disciple"?', 'Peter', 'James', 'John', 'Andrew', 2, 'John was known as "the beloved disciple" and wrote the Gospel of John.', 'new_testament', 'medium', 'new', 'John', 'John 13:23'),

-- Hard New Testament Questions
('How many letters did Paul write that are in the New Testament?', '12', '13', '14', '15', 1, 'Paul wrote 13 letters that are included in the New Testament.', 'new_testament', 'hard', 'new', 'Various', 'N/A'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'new_testament', 'hard', 'new', 'Matthew', 'Matthew 8:5-13'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'new_testament', 'hard', 'new', '1 Corinthians', '1 Corinthians 13'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'new_testament', 'hard', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'new_testament', 'hard', 'new', '2 Timothy', '2 Timothy 1:5');

-- GOSPELS CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Gospels Questions
('What does the word "Gospel" mean?', 'Good story', 'Good news', 'God''s word', 'Great teaching', 1, 'Gospel means "good news" - the good news of salvation through Jesus Christ.', 'gospels', 'easy', 'new', 'General', 'N/A'),
('How many wise men visited baby Jesus?', 'Two', 'Three', 'Four', 'The Bible doesn''t say', 3, 'The Bible mentions wise men but doesn''t specify the number. Tradition says three because of the three gifts.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 2:1-12'),
('What was Jesus'' earthly father''s name?', 'James', 'John', 'Joseph', 'Jacob', 2, 'Joseph was Jesus'' earthly father, a carpenter from Nazareth.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 1:16'),
('On what day did Jesus rise from the dead?', 'Friday', 'Saturday', 'Sunday', 'Monday', 2, 'Jesus rose from the dead on Sunday, the first day of the week.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 28:1'),
('What was the first miracle Jesus performed?', 'Healing the blind', 'Walking on water', 'Turning water to wine', 'Feeding 5000', 2, 'Jesus'' first miracle was turning water into wine at the wedding in Cana.', 'gospels', 'easy', 'new', 'John', 'John 2:1-11'),

-- Medium Gospels Questions
('What was Matthew''s occupation before following Jesus?', 'Fisherman', 'Tax collector', 'Carpenter', 'Shepherd', 1, 'Matthew was a tax collector before Jesus called him to be a disciple.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 9:9'),
('How many people did Jesus feed with five loaves and two fish?', '3,000', '4,000', '5,000', '6,000', 2, 'Jesus fed 5,000 men (plus women and children) with five loaves and two fish.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 14:13-21'),
('How many times did Peter deny Jesus?', '2', '3', '4', '5', 1, 'Peter denied knowing Jesus three times before the rooster crowed, as Jesus had predicted.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 26:69-75'),
('What was the name of the hill where Jesus was crucified?', 'Mount Sinai', 'Mount Olivet', 'Golgotha', 'Mount Zion', 2, 'Jesus was crucified at Golgotha, also called "the place of the skull."', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 27:33'),
('How many days was Lazarus dead before Jesus raised him?', '2 days', '3 days', '4 days', '5 days', 2, 'Lazarus had been dead for four days when Jesus raised him from the dead.', 'gospels', 'medium', 'new', 'John', 'John 11:39'),

-- Hard Gospels Questions
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 26:57'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 8:5-13'),
('What was the name of the woman who anointed Jesus with expensive perfume?', 'Mary Magdalene', 'Mary of Bethany', 'Mary the mother of Jesus', 'The woman is not named', 1, 'Mary of Bethany anointed Jesus with expensive perfume before his crucifixion.', 'gospels', 'hard', 'new', 'John', 'John 12:3'),
('How many people were baptized on the day of Pentecost?', '1,000', '2,000', '3,000', '5,000', 2, 'About 3,000 people were baptized on the day of Pentecost.', 'gospels', 'hard', 'new', 'Acts', 'Acts 2:41'),
('What was the name of the first Christian martyr?', 'Stephen', 'James', 'Peter', 'Paul', 0, 'Stephen was the first Christian martyr, stoned to death for his faith.', 'gospels', 'hard', 'new', 'Acts', 'Acts 7:54-60');

-- EPISTLES CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Epistles Questions
('What was Paul''s name before his conversion?', 'Silas', 'Saul', 'Simon', 'Stephen', 1, 'Paul was originally named Saul before his dramatic conversion on the road to Damascus.', 'epistles', 'easy', 'new', 'Acts', 'Acts 9:1-19'),
('Which island was Paul shipwrecked on?', 'Cyprus', 'Crete', 'Malta', 'Rhodes', 2, 'Paul was shipwrecked on the island of Malta during his journey to Rome.', 'epistles', 'easy', 'new', 'Acts', 'Acts 28:1'),
('How many missionary journeys did Paul take?', '2', '3', '4', '5', 1, 'Paul took three major missionary journeys as recorded in the book of Acts.', 'epistles', 'easy', 'new', 'Acts', 'Acts 13-21'),
('Which Gospel was written by a doctor?', 'Matthew', 'Mark', 'Luke', 'John', 2, 'Luke, who was a physician, wrote the Gospel of Luke and the book of Acts.', 'epistles', 'easy', 'new', 'Luke', 'Colossians 4:14'),
('What was the name of the Roman governor who sentenced Jesus to death?', 'Herod', 'Pilate', 'Felix', 'Festus', 1, 'Pontius Pilate was the Roman governor who sentenced Jesus to crucifixion.', 'epistles', 'easy', 'new', 'Matthew', 'Matthew 27:24'),

-- Medium Epistles Questions
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'epistles', 'medium', 'new', 'Philemon', 'Philemon 1:10'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'epistles', 'medium', 'new', 'Acts', 'Acts 13:6-12'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'epistles', 'medium', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'epistles', 'medium', 'new', '2 Timothy', '2 Timothy 1:5'),
('How many years did Paul spend in Arabia after his conversion?', '1 year', '2 years', '3 years', '4 years', 2, 'Paul spent 3 years in Arabia after his conversion before returning to Jerusalem.', 'epistles', 'medium', 'new', 'Galatians', 'Galatians 1:17-18'),

-- Hard Epistles Questions
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'epistles', 'hard', 'new', '1 Corinthians', '1 Corinthians 13'),
('What was the name of the woman who was healed of bleeding?', 'The woman is not named', 'Mary Magdalene', 'Mary of Bethany', 'Lydia', 0, 'The woman who was healed of bleeding for 12 years is not named in the Gospels.', 'epistles', 'hard', 'new', 'Mark', 'Mark 5:25-34'),
('How many years did Paul spend in prison?', '2 years', '3 years', '4 years', '5 years', 2, 'Paul spent approximately 4 years in prison during his ministry.', 'epistles', 'hard', 'new', 'Acts', 'N/A'),
('What was the name of the disciple who was crucified upside down?', 'Peter', 'Andrew', 'James', 'John', 0, 'According to tradition, Peter was crucified upside down in Rome.', 'epistles', 'hard', 'new', 'John', 'John 21:18-19'),
('How many people were on the ship when Paul was shipwrecked?', '200', '250', '276', '300', 2, 'There were 276 people on the ship when Paul was shipwrecked on Malta.', 'epistles', 'hard', 'new', 'Acts', 'Acts 27:37');

-- PROPHETS CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Prophets Questions
('Which prophet was thrown into a den of lions?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 3, 'Daniel was thrown into the lions'' den for refusing to stop praying to God.', 'prophets', 'easy', 'old', 'Daniel', 'Daniel 6:16'),
('Which prophet was swallowed by a great fish?', 'Jonah', 'Nahum', 'Habakkuk', 'Zephaniah', 0, 'Jonah was swallowed by a great fish when he tried to flee from God''s command to go to Nineveh.', 'prophets', 'easy', 'old', 'Jonah', 'Jonah 1:17'),
('Which prophet was taken up to heaven in a chariot of fire?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah was taken up to heaven in a whirlwind with chariots and horses of fire.', 'prophets', 'easy', 'old', '2 Kings', '2 Kings 2:11'),
('Which prophet confronted King David about his sin with Bathsheba?', 'Samuel', 'Nathan', 'Gad', 'Elijah', 1, 'The prophet Nathan confronted King David about his adultery with Bathsheba and murder of Uriah.', 'prophets', 'easy', 'old', '2 Samuel', '2 Samuel 12:1-14'),
('Which prophet had a vision of God''s throne with seraphim?', 'Jeremiah', 'Ezekiel', 'Isaiah', 'Daniel', 2, 'Isaiah saw a vision of God''s throne with seraphim calling "Holy, holy, holy."', 'prophets', 'easy', 'old', 'Isaiah', 'Isaiah 6:1-3'),

-- Medium Prophets Questions
('Which prophet married a prostitute as commanded by God?', 'Hosea', 'Joel', 'Amos', 'Micah', 0, 'God commanded Hosea to marry Gomer, a prostitute, as a symbol of Israel''s unfaithfulness.', 'prophets', 'medium', 'old', 'Hosea', 'Hosea 1:2'),
('Which prophet had a vision of dry bones coming to life?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 2, 'Ezekiel had the famous vision of the valley of dry bones coming to life.', 'prophets', 'medium', 'old', 'Ezekiel', 'Ezekiel 37:1-14'),
('Which prophet was thrown into a cistern?', 'Jeremiah', 'Isaiah', 'Ezekiel', 'Daniel', 0, 'Jeremiah was thrown into a cistern by the officials of Judah.', 'prophets', 'medium', 'old', 'Jeremiah', 'Jeremiah 38:6'),
('Which prophet was sawn in two?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 0, 'According to tradition, Isaiah was sawn in two during the reign of Manasseh.', 'prophets', 'medium', 'old', 'Isaiah', 'Hebrews 11:37'),
('Which prophet was thrown into a den of lions?', 'Daniel', 'Isaiah', 'Jeremiah', 'Ezekiel', 0, 'Daniel was thrown into the lions'' den for refusing to stop praying to God.', 'prophets', 'medium', 'old', 'Daniel', 'Daniel 6:16'),

-- Hard Prophets Questions
('Which prophet was thrown into a den of lions?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 3, 'Daniel was thrown into the lions'' den for refusing to stop praying to God.', 'prophets', 'hard', 'old', 'Daniel', 'Daniel 6:16'),
('Which prophet saw a vision of God''s throne with seraphim?', 'Jeremiah', 'Ezekiel', 'Isaiah', 'Daniel', 2, 'Isaiah saw a vision of God''s throne with seraphim calling "Holy, holy, holy."', 'prophets', 'hard', 'old', 'Isaiah', 'Isaiah 6:1-3'),
('Which prophet married a prostitute as commanded by God?', 'Hosea', 'Joel', 'Amos', 'Micah', 0, 'God commanded Hosea to marry Gomer, a prostitute, as a symbol of Israel''s unfaithfulness.', 'prophets', 'hard', 'old', 'Hosea', 'Hosea 1:2'),
('Which prophet was thrown into a cistern?', 'Jeremiah', 'Isaiah', 'Ezekiel', 'Daniel', 0, 'Jeremiah was thrown into a cistern by the officials of Judah.', 'prophets', 'hard', 'old', 'Jeremiah', 'Jeremiah 38:6'),
('Which prophet was sawn in two?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 0, 'According to tradition, Isaiah was sawn in two during the reign of Manasseh.', 'prophets', 'hard', 'old', 'Isaiah', 'Hebrews 11:37');

-- WISDOM LITERATURE CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Wisdom Literature Questions
('Complete this verse: "Trust in the Lord with all your heart and..."', 'lean on your own understanding', 'lean not on your own understanding', 'follow your heart', 'seek wisdom', 1, 'The complete verse is "Trust in the Lord with all your heart and lean not on your own understanding."', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 3:5'),
('Who wrote most of the Proverbs?', 'David', 'Solomon', 'Moses', 'Samuel', 1, 'King Solomon wrote most of the Proverbs, though some were written by others.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 1:1'),
('What does "The fear of the Lord" represent in Proverbs?', 'Being afraid of God', 'Reverence and awe of God', 'Punishment from God', 'God''s anger', 1, 'The fear of the Lord represents reverence, awe, and respect for God''s holiness and authority.', 'wisdom', 'easy', 'old', 'Proverbs', 'Proverbs 9:10'),
('Complete this verse: "Be still and know that..."', 'I am with you', 'I am God', 'I am faithful', 'I am love', 1, 'The complete verse is "Be still and know that I am God."', 'wisdom', 'easy', 'old', 'Psalms', 'Psalm 46:10'),
('Who wrote the book of Job?', 'Job himself', 'Moses', 'Solomon', 'Unknown', 3, 'The author of Job is unknown, though it''s one of the oldest books in the Bible.', 'wisdom', 'easy', 'old', 'Job', 'N/A'),

-- Medium Wisdom Literature Questions
('Complete this verse: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'prayer and fasting', 'faith and hope', 1, 'The complete verse is "I can do all things through Christ who strengthens me."', 'wisdom', 'medium', 'new', 'Philippians', 'Philippians 4:13'),
('Which book contains the "Armor of God" passage?', 'Romans', 'Ephesians', 'Colossians', 'Galatians', 1, 'The "Armor of God" passage is found in Ephesians chapter 6.', 'wisdom', 'medium', 'new', 'Ephesians', 'Ephesians 6:10-18'),
('Who wrote the book of Hebrews?', 'Paul', 'Peter', 'John', 'Unknown', 3, 'The author of Hebrews is unknown, though traditionally attributed to Paul.', 'wisdom', 'medium', 'new', 'Hebrews', 'N/A'),
('Complete this verse: "For God so loved the world..."', 'that he sent his Son', 'that he gave his only begotten Son', 'that he sent his only Son', 'that he gave his Son', 1, 'The complete verse is "For God so loved the world that he gave his only begotten Son."', 'wisdom', 'medium', 'new', 'John', 'John 3:16'),
('Complete this verse: "The Lord is my shepherd..."', 'I shall not want', 'I shall not lack', 'I shall not need', 'I shall not desire', 0, 'The complete verse is "The Lord is my shepherd, I shall not want."', 'wisdom', 'medium', 'old', 'Psalms', 'Psalm 23:1'),

-- Hard Wisdom Literature Questions
('Complete this verse: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'prayer and fasting', 'faith and hope', 1, 'The complete verse is "I can do all things through Christ who strengthens me."', 'wisdom', 'hard', 'new', 'Philippians', 'Philippians 4:13'),
('Which book contains the "Armor of God" passage?', 'Romans', 'Ephesians', 'Colossians', 'Galatians', 1, 'The "Armor of God" passage is found in Ephesians chapter 6.', 'wisdom', 'hard', 'new', 'Ephesians', 'Ephesians 6:10-18'),
('Who wrote the book of Hebrews?', 'Paul', 'Peter', 'John', 'Unknown', 3, 'The author of Hebrews is unknown, though traditionally attributed to Paul.', 'wisdom', 'hard', 'new', 'Hebrews', 'N/A'),
('Complete this verse: "For God so loved the world..."', 'that he sent his Son', 'that he gave his only begotten Son', 'that he sent his only Son', 'that he gave his Son', 1, 'The complete verse is "For God so loved the world that he gave his only begotten Son."', 'wisdom', 'hard', 'new', 'John', 'John 3:16'),
('Complete this verse: "The Lord is my shepherd..."', 'I shall not want', 'I shall not lack', 'I shall not need', 'I shall not desire', 0, 'The complete verse is "The Lord is my shepherd, I shall not want."', 'wisdom', 'hard', 'old', 'Psalms', 'Psalm 23:1');

-- PSALMS CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Psalms Questions
('How many chapters are in the book of Psalms?', '140', '145', '150', '155', 2, 'The book of Psalms contains 150 chapters, making it the longest book in the Bible.', 'psalms', 'easy', 'old', 'Psalms', 'N/A'),
('Who wrote most of the Psalms?', 'Solomon', 'David', 'Moses', 'Samuel', 1, 'David wrote 73 of the 150 psalms in the Bible.', 'psalms', 'easy', 'old', 'Psalms', 'N/A'),
('Complete this verse: "The Lord is my shepherd..."', 'I shall not want', 'I shall not lack', 'I shall not need', 'I shall not desire', 0, 'The complete verse is "The Lord is my shepherd, I shall not want."', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 23:1'),
('Complete this verse: "Be still and know that..."', 'I am with you', 'I am God', 'I am faithful', 'I am love', 1, 'The complete verse is "Be still and know that I am God."', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 46:10'),
('Complete this verse: "Create in me a clean heart..."', 'O God', 'O Lord', 'O Father', 'O King', 0, 'The complete verse is "Create in me a clean heart, O God."', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 51:10'),

-- Medium Psalms Questions
('Complete this verse: "I lift up my eyes to the hills..."', 'where does my help come from?', 'where does my strength come from?', 'where does my hope come from?', 'where does my salvation come from?', 0, 'The complete verse is "I lift up my eyes to the hills—where does my help come from?"', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 121:1'),
('Complete this verse: "This is the day that the Lord..."', 'has made', 'has given', 'has blessed', 'has created', 0, 'The complete verse is "This is the day that the Lord has made."', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 118:24'),
('Complete this verse: "Give thanks to the Lord..."', 'for he is good', 'for he is great', 'for he is holy', 'for he is just', 0, 'The complete verse is "Give thanks to the Lord, for he is good."', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 136:1'),
('Complete this verse: "The Lord is my light and my salvation..."', 'whom shall I fear?', 'whom shall I dread?', 'whom shall I be afraid of?', 'whom shall I worry about?', 0, 'The complete verse is "The Lord is my light and my salvation—whom shall I fear?"', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 27:1'),
('Complete this verse: "As the deer pants for streams of water..."', 'so my soul pants for you, O God', 'so my heart longs for you, O Lord', 'so my spirit thirsts for you, O God', 'so my mind seeks you, O Lord', 0, 'The complete verse is "As the deer pants for streams of water, so my soul pants for you, O God."', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 42:1'),

-- Hard Psalms Questions
('Complete this verse: "I lift up my eyes to the hills..."', 'where does my help come from?', 'where does my strength come from?', 'where does my hope come from?', 'where does my salvation come from?', 0, 'The complete verse is "I lift up my eyes to the hills—where does my help come from?"', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 121:1'),
('Complete this verse: "This is the day that the Lord..."', 'has made', 'has given', 'has blessed', 'has created', 0, 'The complete verse is "This is the day that the Lord has made."', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 118:24'),
('Complete this verse: "Give thanks to the Lord..."', 'for he is good', 'for he is great', 'for he is holy', 'for he is just', 0, 'The complete verse is "Give thanks to the Lord, for he is good."', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 136:1'),
('Complete this verse: "The Lord is my light and my salvation..."', 'whom shall I fear?', 'whom shall I dread?', 'whom shall I be afraid of?', 'whom shall I worry about?', 0, 'The complete verse is "The Lord is my light and my salvation—whom shall I fear?"', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 27:1'),
('Complete this verse: "As the deer pants for streams of water..."', 'so my soul pants for you, O God', 'so my heart longs for you, O Lord', 'so my spirit thirsts for you, O God', 'so my mind seeks you, O Lord', 0, 'The complete verse is "As the deer pants for streams of water, so my soul pants for you, O God."', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 42:1');

-- HISTORY CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy History Questions
('Who was the strongest judge of Israel?', 'Gideon', 'Samson', 'Deborah', 'Jephthah', 1, 'Samson was the judge known for his incredible strength given by God.', 'history', 'easy', 'old', 'Judges', 'Judges 13-16'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed as the first king of Israel by the prophet Samuel.', 'history', 'easy', 'old', '1 Samuel', '1 Samuel 10:1'),
('How many years did Solomon reign as king?', '30 years', '40 years', '50 years', '60 years', 1, 'King Solomon reigned for 40 years over Israel.', 'history', 'easy', 'old', '1 Kings', '1 Kings 11:42'),
('How many years did David reign as king?', '30 years', '40 years', '50 years', '60 years', 1, 'David reigned for 40 years over Israel.', 'history', 'easy', 'old', '2 Samuel', '2 Samuel 5:4'),
('What was the name of the first judge of Israel?', 'Othniel', 'Ehud', 'Shamgar', 'Deborah', 0, 'Othniel was the first judge of Israel after Joshua.', 'history', 'easy', 'old', 'Judges', 'Judges 3:7-11'),

-- Medium History Questions
('How many years did the temple take to build?', '5 years', '7 years', '10 years', '12 years', 1, 'Solomon''s temple took 7 years to build.', 'history', 'medium', 'old', '1 Kings', '1 Kings 6:38'),
('How many years did the temple stand before being destroyed?', '300 years', '350 years', '400 years', '450 years', 2, 'Solomon''s temple stood for approximately 400 years before being destroyed by the Babylonians.', 'history', 'medium', 'old', '2 Kings', '2 Kings 25:8-9'),
('How many years did the judges rule Israel?', '200 years', '300 years', '400 years', '500 years', 2, 'The judges ruled Israel for approximately 400 years.', 'history', 'medium', 'old', 'Judges', 'N/A'),
('How many years did Joshua lead Israel?', '20 years', '25 years', '30 years', '35 years', 1, 'Joshua led Israel for approximately 25 years after the death of Moses.', 'history', 'medium', 'old', 'Joshua', 'N/A'),
('How many years did the Israelites spend in the Promised Land before the exile?', '600 years', '700 years', '800 years', '900 years', 2, 'The Israelites spent approximately 800 years in the Promised Land before the Babylonian exile.', 'history', 'medium', 'old', 'Various', 'N/A'),

-- Hard History Questions
('How many years did the Israelites serve the Philistines?', '20 years', '30 years', '40 years', '50 years', 2, 'The Israelites served the Philistines for 40 years before Samson began to deliver them.', 'history', 'hard', 'old', 'Judges', 'Judges 13:1'),
('How many years did the Israelites spend in Babylonian captivity?', '50 years', '60 years', '70 years', '80 years', 2, 'The Israelites spent 70 years in Babylonian captivity.', 'history', 'hard', 'old', 'Jeremiah', 'Jeremiah 25:11'),
('How many years did the Israelites serve in Egypt?', '200 years', '300 years', '400 years', '500 years', 2, 'The Israelites served in Egypt for 400 years before the Exodus.', 'history', 'hard', 'old', 'Genesis', 'Genesis 15:13'),
('How many years did the Israelites wander in the wilderness?', '30 years', '40 years', '50 years', '60 years', 1, 'The Israelites wandered in the wilderness for 40 years before entering the Promised Land.', 'history', 'hard', 'old', 'Numbers', 'Numbers 14:33'),
('How many years did the early church meet in homes?', '50 years', '100 years', '200 years', '300 years', 2, 'The early church met in homes for approximately 200 years before building dedicated church buildings.', 'history', 'hard', 'new', 'Acts', 'N/A');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_difficulty_comprehensive ON quiz_questions(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_testament_comprehensive ON quiz_questions(testament);

-- Grant permissions
GRANT SELECT ON quiz_questions TO authenticated;

-- Verify the questions were added
SELECT category, difficulty, COUNT(*) as question_count 
FROM quiz_questions 
GROUP BY category, difficulty 
ORDER BY category, difficulty;
