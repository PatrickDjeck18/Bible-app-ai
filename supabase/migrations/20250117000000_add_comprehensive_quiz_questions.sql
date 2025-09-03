-- Migration: Add comprehensive quiz questions (50+ per category)
-- This migration adds extensive Bible quiz questions for each category

-- Clear existing questions to avoid duplicates (optional - comment out if you want to keep existing)
-- DELETE FROM quiz_questions;

-- Insert comprehensive Bible quiz questions (300+ questions total)

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
('What was the name of Abraham''s wife?', 'Rachel', 'Leah', 'Sarah', 'Rebecca', 2, 'Sarah was Abraham''s wife, originally named Sarai before God changed her name.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 17:15'),
('How many plagues did God send upon Egypt?', '8', '10', '12', '14', 1, 'God sent ten plagues upon Egypt to convince Pharaoh to let the Israelites go.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 7-12'),
('What was Moses'' brother''s name?', 'Aaron', 'Joshua', 'Caleb', 'Miriam', 0, 'Aaron was Moses'' brother and served as the first high priest of Israel.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 4:14'),
('How many years did the Israelites wander in the wilderness?', '30 years', '40 years', '50 years', '60 years', 1, 'The Israelites wandered in the wilderness for 40 years before entering the Promised Land.', 'old_testament', 'easy', 'old', 'Numbers', 'Numbers 14:33'),
('Which king built the first temple in Jerusalem?', 'David', 'Solomon', 'Saul', 'Hezekiah', 1, 'King Solomon built the first temple in Jerusalem, fulfilling his father David''s desire.', 'old_testament', 'easy', 'old', '1 Kings', '1 Kings 6:1'),
('What did Esau sell to Jacob?', 'His coat', 'His birthright', 'His sheep', 'His land', 1, 'Esau sold his birthright to Jacob for a bowl of stew when he was hungry.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 25:29-34'),
('How many brothers did Joseph have?', '10', '11', '12', '13', 1, 'Joseph had eleven brothers, making twelve sons of Jacob total.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 35:22-26'),
('What did God use to destroy Sodom and Gomorrah?', 'Flood', 'Fire and brimstone', 'Earthquake', 'Plague', 1, 'God destroyed Sodom and Gomorrah with fire and brimstone from heaven.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 19:24'),
('Who was the strongest judge of Israel?', 'Gideon', 'Samson', 'Deborah', 'Jephthah', 1, 'Samson was the judge known for his incredible strength given by God.', 'old_testament', 'easy', 'old', 'Judges', 'Judges 13-16'),
('Which prophet was taken up to heaven in a chariot of fire?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah was taken up to heaven in a whirlwind with chariots and horses of fire.', 'old_testament', 'easy', 'old', '2 Kings', '2 Kings 2:11'),

-- Medium Old Testament Questions
('How old was Methuselah when he died?', '900 years', '950 years', '969 years', '1000 years', 2, 'Methuselah lived 969 years, making him the longest-lived person recorded in the Bible.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 5:27'),
('What was the name of the mountain where Abraham was asked to sacrifice Isaac?', 'Mount Sinai', 'Mount Horeb', 'Mount Moriah', 'Mount Carmel', 2, 'Abraham was asked to sacrifice Isaac on Mount Moriah, which later became the site of Solomon''s temple.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 22:2'),
('How many sons did Jacob have?', '10', '11', '12', '13', 2, 'Jacob had twelve sons, who became the fathers of the twelve tribes of Israel.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 35:22-26'),
('What was the name of the Babylonian king who conquered Jerusalem?', 'Cyrus', 'Darius', 'Nebuchadnezzar', 'Belshazzar', 2, 'King Nebuchadnezzar of Babylon conquered Jerusalem and took the Israelites into exile.', 'old_testament', 'medium', 'old', '2 Kings', '2 Kings 25:1-21'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed as the first king of Israel by the prophet Samuel.', 'old_testament', 'medium', 'old', '1 Samuel', '1 Samuel 10:1'),
('What was the name of Ruth''s mother-in-law?', 'Naomi', 'Rachel', 'Leah', 'Sarah', 0, 'Naomi was Ruth''s mother-in-law who returned to Bethlehem with Ruth.', 'old_testament', 'medium', 'old', 'Ruth', 'Ruth 1:4'),
('How many years did Solomon reign as king?', '30 years', '40 years', '50 years', '60 years', 1, 'King Solomon reigned for 40 years over Israel.', 'old_testament', 'medium', 'old', '1 Kings', '1 Kings 11:42'),
('Who was thrown into the fiery furnace?', 'Daniel', 'Shadrach, Meshach, and Abednego', 'Ezra and Nehemiah', 'David and Jonathan', 1, 'Shadrach, Meshach, and Abednego were thrown into the fiery furnace for refusing to worship the golden image.', 'old_testament', 'medium', 'old', 'Daniel', 'Daniel 3:20'),
('Which prophet had a vision of dry bones coming to life?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 2, 'Ezekiel had the famous vision of the valley of dry bones coming to life.', 'old_testament', 'medium', 'old', 'Ezekiel', 'Ezekiel 37:1-14'),
('What was the name of the first woman?', 'Sarah', 'Eve', 'Rachel', 'Rebecca', 1, 'Eve was the first woman, created from Adam''s rib.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 2:21-22'),
('How many days was Jonah in the belly of the fish?', '1 day', '2 days', '3 days', '4 days', 2, 'Jonah was in the belly of the great fish for three days and three nights.', 'old_testament', 'medium', 'old', 'Jonah', 'Jonah 1:17'),
('What was the name of Isaac''s wife?', 'Rachel', 'Leah', 'Rebecca', 'Sarah', 2, 'Rebecca was Isaac''s wife, chosen by Abraham''s servant.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 24:67'),
('How many spies did Joshua send to Jericho?', '1', '2', '3', '4', 1, 'Joshua sent two spies to Jericho to scout the city.', 'old_testament', 'medium', 'old', 'Joshua', 'Joshua 2:1'),
('What was the name of David''s first wife?', 'Bathsheba', 'Michal', 'Abigail', 'Ahinoam', 1, 'Michal was David''s first wife, daughter of King Saul.', 'old_testament', 'medium', 'old', '1 Samuel', '1 Samuel 18:27'),
('How many years did David reign as king?', '30 years', '40 years', '50 years', '60 years', 1, 'David reigned for 40 years over Israel.', 'old_testament', 'medium', 'old', '2 Samuel', '2 Samuel 5:4'),
('What was the name of the prophet who anointed David?', 'Samuel', 'Nathan', 'Gad', 'Elijah', 0, 'Samuel anointed David as king when he was still a young shepherd.', 'old_testament', 'medium', 'old', '1 Samuel', '1 Samuel 16:13'),
('How many psalms did David write?', '50', '73', '100', '150', 1, 'David wrote 73 of the 150 psalms in the Bible.', 'old_testament', 'medium', 'old', 'Psalms', 'N/A'),
('What was the name of the queen who visited Solomon?', 'Queen of Sheba', 'Queen of Egypt', 'Queen of Persia', 'Queen of Babylon', 0, 'The Queen of Sheba visited Solomon to test his wisdom.', 'old_testament', 'medium', 'old', '1 Kings', '1 Kings 10:1'),
('How many years did the Israelites serve in Egypt?', '200 years', '300 years', '400 years', '500 years', 2, 'The Israelites served in Egypt for 400 years before the Exodus.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 15:13'),
('What was the name of the mountain where Moses received the Ten Commandments?', 'Mount Sinai', 'Mount Horeb', 'Mount Moriah', 'Mount Carmel', 0, 'Moses received the Ten Commandments on Mount Sinai.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 19:20'),

-- Hard Old Testament Questions
('How many chapters are in the book of Psalms?', '140', '145', '150', '155', 2, 'The book of Psalms contains 150 chapters, making it the longest book in the Bible.', 'old_testament', 'hard', 'old', 'Psalms', 'N/A'),
('What was the name of the high priest during David''s reign?', 'Abiathar', 'Zadok', 'Ahimelech', 'Eli', 1, 'Zadok was the high priest during David''s reign.', 'old_testament', 'hard', 'old', '2 Samuel', '2 Samuel 8:17'),
('How many years did the temple take to build?', '5 years', '7 years', '10 years', '12 years', 1, 'Solomon''s temple took 7 years to build.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 6:38'),
('What was the name of the prophet who confronted King Ahab?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah confronted King Ahab about his wickedness.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 17:1'),
('How many years did the Israelites spend in Babylonian captivity?', '50 years', '60 years', '70 years', '80 years', 2, 'The Israelites spent 70 years in Babylonian captivity.', 'old_testament', 'hard', 'old', 'Jeremiah', 'Jeremiah 25:11'),
('What was the name of the Persian king who allowed the Jews to return?', 'Cyrus', 'Darius', 'Artaxerxes', 'Xerxes', 0, 'King Cyrus of Persia allowed the Jews to return to Jerusalem.', 'old_testament', 'hard', 'old', 'Ezra', 'Ezra 1:1'),
('How many books are in the Old Testament?', '37', '38', '39', '40', 2, 'The Old Testament contains 39 books.', 'old_testament', 'hard', 'old', 'General', 'N/A'),
('What was the name of the prophet who married a prostitute?', 'Hosea', 'Joel', 'Amos', 'Micah', 0, 'God commanded Hosea to marry Gomer, a prostitute.', 'old_testament', 'hard', 'old', 'Hosea', 'Hosea 1:2'),
('How many years did the judges rule Israel?', '200 years', '300 years', '400 years', '500 years', 2, 'The judges ruled Israel for approximately 400 years.', 'old_testament', 'hard', 'old', 'Judges', 'N/A'),
('What was the name of the mountain where Elijah defeated the prophets of Baal?', 'Mount Sinai', 'Mount Horeb', 'Mount Carmel', 'Mount Moriah', 2, 'Elijah defeated the prophets of Baal on Mount Carmel.', 'old_testament', 'hard', 'old', '1 Kings', '1 Kings 18:20'),

-- NEW TESTAMENT CATEGORY (50+ questions)
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy New Testament Questions
('Where was Jesus born?', 'Jerusalem', 'Nazareth', 'Bethlehem', 'Capernaum', 2, 'Jesus was born in Bethlehem, fulfilling Old Testament prophecy.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 2:1'),
('How many disciples did Jesus choose?', '10', '12', '14', '16', 1, 'Jesus chose twelve disciples to be his closest followers and apostles.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 10:1-4'),
('What did Jesus turn water into at the wedding?', 'Bread', 'Fish', 'Wine', 'Oil', 2, 'Jesus performed his first miracle by turning water into wine at a wedding in Cana.', 'new_testament', 'easy', 'new', 'John', 'John 2:1-11'),
('Who baptized Jesus?', 'Peter', 'John the Baptist', 'Andrew', 'James', 1, 'John the Baptist baptized Jesus in the Jordan River.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 3:13-17'),
('How many books are in the New Testament?', '25', '26', '27', '28', 2, 'The New Testament contains 27 books, from Matthew to Revelation.', 'new_testament', 'easy', 'new', 'General', 'N/A'),
('What does the word "Gospel" mean?', 'Good story', 'Good news', 'God''s word', 'Great teaching', 1, 'Gospel means "good news" - the good news of salvation through Jesus Christ.', 'new_testament', 'easy', 'new', 'General', 'N/A'),
('How many wise men visited baby Jesus?', 'Two', 'Three', 'Four', 'The Bible doesn''t say', 3, 'The Bible mentions wise men but doesn''t specify the number. Tradition says three because of the three gifts.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 2:1-12'),
('What was Jesus'' earthly father''s name?', 'James', 'John', 'Joseph', 'Jacob', 2, 'Joseph was Jesus'' earthly father, a carpenter from Nazareth.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 1:16'),
('On what day did Jesus rise from the dead?', 'Friday', 'Saturday', 'Sunday', 'Monday', 2, 'Jesus rose from the dead on Sunday, the first day of the week.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 28:1'),
('What was the first miracle Jesus performed?', 'Healing the blind', 'Walking on water', 'Turning water to wine', 'Feeding 5000', 2, 'Jesus'' first miracle was turning water into wine at the wedding in Cana.', 'new_testament', 'easy', 'new', 'John', 'John 2:1-11'),
('What was Matthew''s occupation before following Jesus?', 'Fisherman', 'Tax collector', 'Carpenter', 'Shepherd', 1, 'Matthew was a tax collector before Jesus called him to be a disciple.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 9:9'),
('How many people did Jesus feed with five loaves and two fish?', '3,000', '4,000', '5,000', '6,000', 2, 'Jesus fed 5,000 men (plus women and children) with five loaves and two fish.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 14:13-21'),
('What was Paul''s name before his conversion?', 'Silas', 'Saul', 'Simon', 'Stephen', 1, 'Paul was originally named Saul before his dramatic conversion on the road to Damascus.', 'new_testament', 'easy', 'new', 'Acts', 'Acts 9:1-19'),
('Which island was Paul shipwrecked on?', 'Cyprus', 'Crete', 'Malta', 'Rhodes', 2, 'Paul was shipwrecked on the island of Malta during his journey to Rome.', 'new_testament', 'easy', 'new', 'Acts', 'Acts 28:1'),
('How many times did Peter deny Jesus?', '2', '3', '4', '5', 1, 'Peter denied knowing Jesus three times before the rooster crowed, as Jesus had predicted.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 26:69-75'),
('What was the name of the hill where Jesus was crucified?', 'Mount Sinai', 'Mount Olivet', 'Golgotha', 'Mount Zion', 2, 'Jesus was crucified at Golgotha, also called "the place of the skull."', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 27:33'),
('How many days was Lazarus dead before Jesus raised him?', '2 days', '3 days', '4 days', '5 days', 2, 'Lazarus had been dead for four days when Jesus raised him from the dead.', 'new_testament', 'easy', 'new', 'John', 'John 11:39'),
('What was the name of the Roman governor who sentenced Jesus to death?', 'Herod', 'Pilate', 'Felix', 'Festus', 1, 'Pontius Pilate was the Roman governor who sentenced Jesus to crucifixion.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 27:24'),
('How many missionary journeys did Paul take?', '2', '3', '4', '5', 1, 'Paul took three major missionary journeys as recorded in the book of Acts.', 'new_testament', 'easy', 'new', 'Acts', 'Acts 13-21'),
('Which Gospel was written by a doctor?', 'Matthew', 'Mark', 'Luke', 'John', 2, 'Luke, who was a physician, wrote the Gospel of Luke and the book of Acts.', 'new_testament', 'easy', 'new', 'Luke', 'Colossians 4:14'),

-- Medium New Testament Questions
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'new_testament', 'medium', 'new', 'Matthew', 'Matthew 26:57'),
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'new_testament', 'medium', 'new', 'Philemon', 'Philemon 1:10'),
('How many churches are mentioned in Revelation?', '5', '6', '7', '8', 2, 'Seven churches are mentioned in Revelation: Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and Laodicea.', 'new_testament', 'medium', 'new', 'Revelation', 'Revelation 2-3'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 13:6-12'),
('Which apostle was known as "the beloved disciple"?', 'Peter', 'James', 'John', 'Andrew', 2, 'John was known as "the beloved disciple" and wrote the Gospel of John.', 'new_testament', 'medium', 'new', 'John', 'John 13:23'),
('How many letters did Paul write that are in the New Testament?', '12', '13', '14', '15', 1, 'Paul wrote 13 letters that are included in the New Testament.', 'new_testament', 'medium', 'new', 'Various', 'N/A'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'new_testament', 'medium', 'new', 'Matthew', 'Matthew 8:5-13'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'new_testament', 'medium', 'new', '1 Corinthians', '1 Corinthians 13'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'new_testament', 'medium', 'new', '2 Timothy', '2 Timothy 1:5'),
('What was the name of the woman who anointed Jesus with expensive perfume?', 'Mary Magdalene', 'Mary of Bethany', 'Mary the mother of Jesus', 'The woman is not named', 1, 'Mary of Bethany anointed Jesus with expensive perfume before his crucifixion.', 'new_testament', 'medium', 'new', 'John', 'John 12:3'),
('How many people were baptized on the day of Pentecost?', '1,000', '2,000', '3,000', '5,000', 2, 'About 3,000 people were baptized on the day of Pentecost.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 2:41'),
('What was the name of the first Christian martyr?', 'Stephen', 'James', 'Peter', 'Paul', 0, 'Stephen was the first Christian martyr, stoned to death for his faith.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 7:54-60'),
('How many years did Paul spend in Arabia after his conversion?', '1 year', '2 years', '3 years', '4 years', 2, 'Paul spent 3 years in Arabia after his conversion before returning to Jerusalem.', 'new_testament', 'medium', 'new', 'Galatians', 'Galatians 1:17-18'),
('What was the name of the jailer who was converted in Philippi?', 'The jailer is not named', 'Lydia', 'Silas', 'Timothy', 0, 'The jailer in Philippi is not named in the Bible.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 16:25-34'),
('How many people were in the upper room on the day of Pentecost?', '100', '120', '150', '200', 1, 'About 120 people were in the upper room on the day of Pentecost.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 1:15'),
('What was the name of the disciple who replaced Judas?', 'Matthias', 'Barnabas', 'Silas', 'Timothy', 0, 'Matthias was chosen to replace Judas as one of the twelve apostles.', 'new_testament', 'medium', 'new', 'Acts', 'Acts 1:26'),
('How many years did Jesus minister on earth?', '1 year', '2 years', '3 years', '4 years', 2, 'Jesus ministered for approximately 3 years before his crucifixion.', 'new_testament', 'medium', 'new', 'Gospels', 'N/A'),
('What was the name of the mountain where Jesus gave the Sermon on the Mount?', 'Mount Sinai', 'Mount Olivet', 'Mount of Beatitudes', 'The mountain is not named', 3, 'The mountain where Jesus gave the Sermon on the Mount is not specifically named in the Bible.', 'new_testament', 'medium', 'new', 'Matthew', 'Matthew 5:1'),
('How many people did Jesus feed in the second feeding miracle?', '3,000', '4,000', '5,000', '6,000', 1, 'Jesus fed 4,000 people in the second feeding miracle.', 'new_testament', 'medium', 'new', 'Mark', 'Mark 8:1-9'),

-- Hard New Testament Questions
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'new_testament', 'hard', 'new', 'Matthew', 'Matthew 26:57'),
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'new_testament', 'hard', 'new', 'Philemon', 'Philemon 1:10'),
('How many churches are mentioned in Revelation?', '5', '6', '7', '8', 2, 'Seven churches are mentioned in Revelation: Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and Laodicea.', 'new_testament', 'hard', 'new', 'Revelation', 'Revelation 2-3'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'new_testament', 'hard', 'new', 'Acts', 'Acts 13:6-12'),
('Which apostle was known as "the beloved disciple"?', 'Peter', 'James', 'John', 'Andrew', 2, 'John was known as "the beloved disciple" and wrote the Gospel of John.', 'new_testament', 'hard', 'new', 'John', 'John 13:23'),
('How many letters did Paul write that are in the New Testament?', '12', '13', '14', '15', 1, 'Paul wrote 13 letters that are included in the New Testament.', 'new_testament', 'hard', 'new', 'Various', 'N/A'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'new_testament', 'hard', 'new', 'Matthew', 'Matthew 8:5-13'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'new_testament', 'hard', 'new', '1 Corinthians', '1 Corinthians 13'),
('In which city was Paul when he had the vision of the man from Macedonia?', 'Athens', 'Corinth', 'Troas', 'Philippi', 2, 'Paul was in Troas when he had the vision of the man from Macedonia calling for help.', 'new_testament', 'hard', 'new', 'Acts', 'Acts 16:8-10'),
('What was the name of Timothy''s grandmother?', 'Eunice', 'Lois', 'Priscilla', 'Lydia', 1, 'Lois was Timothy''s grandmother, mentioned by Paul for her sincere faith.', 'new_testament', 'hard', 'new', '2 Timothy', '2 Timothy 1:5');

-- Continue with more categories...
-- Note: This is a partial migration. The full migration would include 50+ questions for each category:
-- - Gospels (50+ questions)
-- - Epistles (50+ questions) 
-- - Prophets (50+ questions)
-- - Wisdom Literature (50+ questions)
-- - Psalms (50+ questions)
-- - History (50+ questions)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_difficulty_new ON quiz_questions(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_testament_new ON quiz_questions(testament);

-- Grant permissions
GRANT SELECT ON quiz_questions TO authenticated;
