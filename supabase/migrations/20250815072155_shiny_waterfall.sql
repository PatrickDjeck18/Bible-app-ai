/*
  # Create Bible Quiz System

  1. New Tables
    - `quiz_questions` - Store Bible quiz questions with multiple choice answers
    - `quiz_sessions` - Track user quiz sessions and scores
    - `user_quiz_stats` - Store user quiz statistics and achievements

  2. Features
    - Random question selection
    - Score tracking and persistence
    - Multiple difficulty levels
    - Category-based questions
    - User statistics and achievements

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer integer NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'old_testament', 'new_testament', 'gospels', 'psalms', 'prophets', 'history', 'wisdom', 'epistles')),
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  testament text CHECK (testament IN ('old', 'new')),
  book_reference text,
  verse_reference text,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_answered integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  wrong_answers integer DEFAULT 0,
  total_score integer DEFAULT 0,
  category text,
  difficulty text,
  time_taken_seconds integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create user_quiz_stats table
CREATE TABLE IF NOT EXISTS user_quiz_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_sessions integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  total_correct_answers integer DEFAULT 0,
  best_score integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  favorite_category text,
  total_time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_stats ENABLE ROW LEVEL SECURITY;

-- Quiz questions policies (public read for all authenticated users)
CREATE POLICY "Anyone can read quiz questions"
  ON quiz_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Quiz sessions policies
CREATE POLICY "Users can manage own quiz sessions"
  ON quiz_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User quiz stats policies
CREATE POLICY "Users can manage own quiz stats"
  ON user_quiz_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger for user_quiz_stats
CREATE TRIGGER update_user_quiz_stats_updated_at 
  BEFORE UPDATE ON user_quiz_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert comprehensive Bible quiz questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, testament, book_reference, verse_reference) VALUES

-- Easy Old Testament Questions
('Who was the first man created by God?', 'Abraham', 'Moses', 'Adam', 'Noah', 2, 'Adam was the first man created by God in the Garden of Eden.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 2:7'),
('How many days did it rain during Noah''s flood?', '30 days', '40 days', '50 days', '60 days', 1, 'It rained for 40 days and 40 nights during the great flood.', 'old_testament', 'easy', 'old', 'Genesis', 'Genesis 7:12'),
('What did God give Moses on Mount Sinai?', 'A staff', 'The Ten Commandments', 'A crown', 'Gold tablets', 1, 'God gave Moses the Ten Commandments written on stone tablets.', 'old_testament', 'easy', 'old', 'Exodus', 'Exodus 20:1-17'),
('Who was swallowed by a great fish?', 'Jonah', 'Daniel', 'Elijah', 'Samuel', 0, 'Jonah was swallowed by a great fish when he tried to flee from God''s command.', 'old_testament', 'easy', 'old', 'Jonah', 'Jonah 1:17'),
('What did David use to defeat Goliath?', 'A sword', 'A spear', 'A sling and stone', 'An arrow', 2, 'David defeated the giant Goliath with a sling and a stone, trusting in God''s power.', 'old_testament', 'easy', 'old', '1 Samuel', '1 Samuel 17:49'),

-- Easy New Testament Questions
('Where was Jesus born?', 'Jerusalem', 'Nazareth', 'Bethlehem', 'Capernaum', 2, 'Jesus was born in Bethlehem, fulfilling Old Testament prophecy.', 'new_testament', 'easy', 'new', 'Matthew', 'Matthew 2:1'),
('How many disciples did Jesus choose?', '10', '12', '14', '16', 1, 'Jesus chose twelve disciples to be his closest followers and apostles.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 10:1-4'),
('What did Jesus turn water into at the wedding?', 'Bread', 'Fish', 'Wine', 'Oil', 2, 'Jesus performed his first miracle by turning water into wine at a wedding in Cana.', 'gospels', 'easy', 'new', 'John', 'John 2:1-11'),
('Who baptized Jesus?', 'Peter', 'John the Baptist', 'Andrew', 'James', 1, 'John the Baptist baptized Jesus in the Jordan River.', 'gospels', 'easy', 'new', 'Matthew', 'Matthew 3:13-17'),
('How many books are in the New Testament?', '25', '26', '27', '28', 2, 'The New Testament contains 27 books, from Matthew to Revelation.', 'new_testament', 'easy', 'new', 'General', 'N/A'),

-- Medium Old Testament Questions
('How many years did the Israelites wander in the wilderness?', '30 years', '40 years', '50 years', '60 years', 1, 'The Israelites wandered in the wilderness for 40 years before entering the Promised Land.', 'old_testament', 'medium', 'old', 'Numbers', 'Numbers 14:33'),
('What was the name of Abraham''s wife?', 'Rachel', 'Leah', 'Sarah', 'Rebecca', 2, 'Sarah was Abraham''s wife, originally named Sarai before God changed her name.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 17:15'),
('Which king built the first temple in Jerusalem?', 'David', 'Solomon', 'Saul', 'Hezekiah', 1, 'King Solomon built the first temple in Jerusalem, fulfilling his father David''s desire.', 'old_testament', 'medium', 'old', '1 Kings', '1 Kings 6:1'),
('What did Esau sell to Jacob?', 'His coat', 'His birthright', 'His sheep', 'His land', 1, 'Esau sold his birthright to Jacob for a bowl of stew when he was hungry.', 'old_testament', 'medium', 'old', 'Genesis', 'Genesis 25:29-34'),
('How many plagues did God send upon Egypt?', '8', '10', '12', '14', 1, 'God sent ten plagues upon Egypt to convince Pharaoh to let the Israelites go.', 'old_testament', 'medium', 'old', 'Exodus', 'Exodus 7-12'),

-- Medium New Testament Questions
('What was Matthew''s occupation before following Jesus?', 'Fisherman', 'Tax collector', 'Carpenter', 'Shepherd', 1, 'Matthew was a tax collector before Jesus called him to be a disciple.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 9:9'),
('On which day did Jesus rise from the dead?', 'Friday', 'Saturday', 'Sunday', 'Monday', 2, 'Jesus rose from the dead on Sunday, the first day of the week.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 28:1'),
('How many people did Jesus feed with five loaves and two fish?', '3,000', '4,000', '5,000', '6,000', 2, 'Jesus fed 5,000 men (plus women and children) with five loaves and two fish.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 14:13-21'),
('What was Paul''s name before his conversion?', 'Silas', 'Saul', 'Simon', 'Stephen', 1, 'Paul was originally named Saul before his dramatic conversion on the road to Damascus.', 'epistles', 'medium', 'new', 'Acts', 'Acts 9:1-19'),
('Which island was Paul shipwrecked on?', 'Cyprus', 'Crete', 'Malta', 'Rhodes', 2, 'Paul was shipwrecked on the island of Malta during his journey to Rome.', 'epistles', 'medium', 'new', 'Acts', 'Acts 28:1'),

-- Hard Old Testament Questions
('How old was Methuselah when he died?', '900 years', '950 years', '969 years', '1000 years', 2, 'Methuselah lived 969 years, making him the longest-lived person recorded in the Bible.', 'old_testament', 'hard', 'old', 'Genesis', 'Genesis 5:27'),
('What was the name of the mountain where Abraham was asked to sacrifice Isaac?', 'Mount Sinai', 'Mount Horeb', 'Mount Moriah', 'Mount Carmel', 2, 'Abraham was asked to sacrifice Isaac on Mount Moriah, which later became the site of Solomon''s temple.', 'old_testament', 'hard', 'old', 'Genesis', 'Genesis 22:2'),
('How many sons did Jacob have?', '10', '11', '12', '13', 2, 'Jacob had twelve sons, who became the fathers of the twelve tribes of Israel.', 'old_testament', 'hard', 'old', 'Genesis', 'Genesis 35:22-26'),
('What was the name of the Babylonian king who conquered Jerusalem?', 'Cyrus', 'Darius', 'Nebuchadnezzar', 'Belshazzar', 2, 'King Nebuchadnezzar of Babylon conquered Jerusalem and took the Israelites into exile.', 'old_testament', 'hard', 'old', '2 Kings', '2 Kings 25:1-21'),
('How many chapters are in the book of Psalms?', '140', '145', '150', '155', 2, 'The book of Psalms contains 150 chapters, making it the longest book in the Bible.', 'psalms', 'hard', 'old', 'Psalms', 'N/A'),

-- Hard New Testament Questions
('What was the name of the high priest who questioned Jesus?', 'Annas', 'Caiaphas', 'Nicodemus', 'Gamaliel', 1, 'Caiaphas was the high priest who questioned Jesus during his trial.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 26:57'),
('How many missionary journeys did Paul take?', '2', '3', '4', '5', 1, 'Paul took three major missionary journeys as recorded in the book of Acts.', 'epistles', 'hard', 'new', 'Acts', 'Acts 13-21'),
('What was the name of the runaway slave Paul wrote about?', 'Onesimus', 'Epaphras', 'Tychicus', 'Archippus', 0, 'Onesimus was the runaway slave whom Paul wrote about in his letter to Philemon.', 'epistles', 'hard', 'new', 'Philemon', 'Philemon 1:10'),
('How many churches are mentioned in Revelation?', '5', '6', '7', '8', 2, 'Seven churches are mentioned in Revelation: Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and Laodicea.', 'new_testament', 'hard', 'new', 'Revelation', 'Revelation 2-3'),
('What was the name of the sorcerer Paul encountered in Cyprus?', 'Simon', 'Bar-Jesus', 'Apollos', 'Demetrius', 1, 'Bar-Jesus (also called Elymas) was the sorcerer Paul encountered in Cyprus.', 'epistles', 'hard', 'new', 'Acts', 'Acts 13:6-12'),

-- Wisdom Literature Questions
('Complete this verse: "Trust in the Lord with all your heart and..."', 'lean on your own understanding', 'lean not on your own understanding', 'follow your heart', 'seek wisdom', 1, 'The complete verse is "Trust in the Lord with all your heart and lean not on your own understanding."', 'wisdom', 'medium', 'old', 'Proverbs', 'Proverbs 3:5'),
('Who wrote most of the Proverbs?', 'David', 'Solomon', 'Moses', 'Samuel', 1, 'King Solomon wrote most of the Proverbs, though some were written by others.', 'wisdom', 'medium', 'old', 'Proverbs', 'Proverbs 1:1'),
('What does "The fear of the Lord" represent in Proverbs?', 'Being afraid of God', 'Reverence and awe of God', 'Punishment from God', 'God''s anger', 1, 'The fear of the Lord represents reverence, awe, and respect for God''s holiness and authority.', 'wisdom', 'medium', 'old', 'Proverbs', 'Proverbs 9:10'),

-- Prophets Questions
('Which prophet was taken up to heaven in a whirlwind?', 'Elijah', 'Elisha', 'Isaiah', 'Jeremiah', 0, 'Elijah was taken up to heaven in a whirlwind, witnessed by Elisha.', 'prophets', 'medium', 'old', '2 Kings', '2 Kings 2:11'),
('Which prophet had a vision of dry bones coming to life?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 2, 'Ezekiel had the famous vision of the valley of dry bones coming to life.', 'prophets', 'medium', 'old', 'Ezekiel', 'Ezekiel 37:1-14'),
('Which prophet was thrown into a den of lions?', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 3, 'Daniel was thrown into the lions'' den for refusing to stop praying to God.', 'prophets', 'medium', 'old', 'Daniel', 'Daniel 6:16'),

-- Gospels Specific Questions
('In which Gospel do we find the Sermon on the Mount?', 'Matthew', 'Mark', 'Luke', 'John', 0, 'The Sermon on the Mount is found in the Gospel of Matthew, chapters 5-7.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 5-7'),
('Which Gospel was written by a doctor?', 'Matthew', 'Mark', 'Luke', 'John', 2, 'Luke, who was a physician, wrote the Gospel of Luke and the book of Acts.', 'gospels', 'medium', 'new', 'Luke', 'Colossians 4:14'),
('Which Gospel begins with "In the beginning was the Word"?', 'Matthew', 'Mark', 'Luke', 'John', 3, 'The Gospel of John begins with the famous prologue about the Word.', 'gospels', 'medium', 'new', 'John', 'John 1:1'),

-- Epistles Questions
('How many letters did Paul write that are in the New Testament?', '12', '13', '14', '15', 1, 'Paul wrote 13 letters that are included in the New Testament.', 'epistles', 'medium', 'new', 'Various', 'N/A'),
('Which book is known as the "Love Chapter"?', 'Romans 8', '1 Corinthians 13', 'Ephesians 3', 'Philippians 2', 1, '1 Corinthians 13 is known as the Love Chapter for its beautiful description of love.', 'epistles', 'medium', 'new', '1 Corinthians', '1 Corinthians 13'),
('Complete this verse: "I can do all things through..."', 'my own strength', 'Christ who strengthens me', 'prayer and fasting', 'faith and hope', 1, 'The complete verse is "I can do all things through Christ who strengthens me."', 'epistles', 'easy', 'new', 'Philippians', 'Philippians 4:13'),

-- History Questions
('How many years did Solomon reign as king?', '30 years', '40 years', '50 years', '60 years', 1, 'King Solomon reigned for 40 years over Israel.', 'history', 'medium', 'old', '1 Kings', '1 Kings 11:42'),
('Which judge had great strength but was betrayed by Delilah?', 'Gideon', 'Samson', 'Jephthah', 'Deborah', 1, 'Samson was the judge with great strength who was betrayed by Delilah.', 'history', 'medium', 'old', 'Judges', 'Judges 16'),
('Who was the first king of Israel?', 'David', 'Solomon', 'Saul', 'Samuel', 2, 'Saul was anointed as the first king of Israel by the prophet Samuel.', 'history', 'medium', 'old', '1 Samuel', '1 Samuel 10:1'),

-- Psalms Questions
('Who wrote Psalm 23 ("The Lord is my shepherd")?', 'Solomon', 'David', 'Moses', 'Asaph', 1, 'Psalm 23 was written by King David and is one of the most beloved psalms.', 'psalms', 'easy', 'old', 'Psalms', 'Psalm 23:1'),
('What is the longest chapter in the Bible?', 'Psalm 118', 'Psalm 119', 'Psalm 120', 'Psalm 121', 1, 'Psalm 119 is the longest chapter in the Bible with 176 verses.', 'psalms', 'hard', 'old', 'Psalms', 'Psalm 119'),
('Complete this verse: "Be still and know that..."', 'I am with you', 'I am God', 'I am faithful', 'I am love', 1, 'The complete verse is "Be still and know that I am God."', 'psalms', 'medium', 'old', 'Psalms', 'Psalm 46:10'),

-- General Bible Knowledge
('How many books are in the entire Bible?', '64', '65', '66', '67', 2, 'The Bible contains 66 books total: 39 in the Old Testament and 27 in the New Testament.', 'general', 'easy', 'old', 'General', 'N/A'),
('What does "Gospel" mean?', 'Good story', 'Good news', 'God''s word', 'Great teaching', 1, 'Gospel means "good news" - the good news of salvation through Jesus Christ.', 'general', 'easy', 'new', 'General', 'N/A'),
('In what language was most of the New Testament originally written?', 'Hebrew', 'Aramaic', 'Greek', 'Latin', 2, 'Most of the New Testament was originally written in Greek.', 'general', 'medium', 'new', 'General', 'N/A'),

-- More challenging questions
('What was the name of the garden where Jesus prayed before his crucifixion?', 'Garden of Eden', 'Garden of Gethsemane', 'Garden of Olives', 'Garden of Joseph', 1, 'Jesus prayed in the Garden of Gethsemane before his arrest and crucifixion.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 26:36'),
('How many times did Peter deny Jesus?', '2', '3', '4', '5', 1, 'Peter denied knowing Jesus three times before the rooster crowed, as Jesus had predicted.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 26:69-75'),
('What was the name of the hill where Jesus was crucified?', 'Mount Sinai', 'Mount Olivet', 'Golgotha', 'Mount Zion', 2, 'Jesus was crucified at Golgotha, also called "the place of the skull."', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 27:33'),
('How many days was Lazarus dead before Jesus raised him?', '2 days', '3 days', '4 days', '5 days', 2, 'Lazarus had been dead for four days when Jesus raised him from the dead.', 'gospels', 'medium', 'new', 'John', 'John 11:39'),
('What was the name of the Roman governor who sentenced Jesus to death?', 'Herod', 'Pilate', 'Felix', 'Festus', 1, 'Pontius Pilate was the Roman governor who sentenced Jesus to crucifixion.', 'gospels', 'medium', 'new', 'Matthew', 'Matthew 27:24'),

-- Advanced Questions
('Which prophet saw a vision of God''s throne with seraphim?', 'Jeremiah', 'Ezekiel', 'Isaiah', 'Daniel', 2, 'Isaiah saw a vision of God''s throne with seraphim calling "Holy, holy, holy."', 'prophets', 'hard', 'old', 'Isaiah', 'Isaiah 6:1-3'),
('What was the name of Naomi''s daughter-in-law who stayed with her?', 'Ruth', 'Orpah', 'Rachel', 'Tamar', 0, 'Ruth was the daughter-in-law who stayed with Naomi, saying "Where you go I will go."', 'old_testament', 'hard', 'old', 'Ruth', 'Ruth 1:16'),
('How many years did Job live after his trials?', '120 years', '140 years', '160 years', '180 years', 1, 'After his trials, Job lived 140 more years and saw four generations of his descendants.', 'wisdom', 'hard', 'old', 'Job', 'Job 42:16'),
('Which apostle was known as "the beloved disciple"?', 'Peter', 'James', 'John', 'Andrew', 2, 'John was known as "the beloved disciple" and wrote the Gospel of John.', 'gospels', 'hard', 'new', 'John', 'John 13:23'),
('What was the name of the centurion whose servant Jesus healed?', 'Cornelius', 'Julius', 'The centurion is not named', 'Marcus', 2, 'The centurion whose servant Jesus healed is not named in the Gospel accounts.', 'gospels', 'hard', 'new', 'Matthew', 'Matthew 8:5-13');

-- Create function to get random questions
CREATE OR REPLACE FUNCTION get_random_quiz_questions(
  question_count integer DEFAULT 10,
  quiz_category text DEFAULT 'all',
  quiz_difficulty text DEFAULT 'all'
)
RETURNS SETOF quiz_questions AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM quiz_questions
  WHERE 
    (quiz_category = 'all' OR category = quiz_category) AND
    (quiz_difficulty = 'all' OR difficulty = quiz_difficulty)
  ORDER BY RANDOM()
  LIMIT question_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to save quiz session
CREATE OR REPLACE FUNCTION save_quiz_session(
  p_questions_answered integer,
  p_correct_answers integer,
  p_wrong_answers integer,
  p_total_score integer,
  p_category text DEFAULT 'general',
  p_difficulty text DEFAULT 'medium',
  p_time_taken_seconds integer DEFAULT 0
)
RETURNS uuid AS $$
DECLARE
  session_id uuid;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Insert quiz session
  INSERT INTO quiz_sessions (
    user_id,
    questions_answered,
    correct_answers,
    wrong_answers,
    total_score,
    category,
    difficulty,
    time_taken_seconds,
    completed_at
  ) VALUES (
    current_user_id,
    p_questions_answered,
    p_correct_answers,
    p_wrong_answers,
    p_total_score,
    p_category,
    p_difficulty,
    p_time_taken_seconds,
    NOW()
  ) RETURNING id INTO session_id;

  -- Update or insert user quiz stats
  INSERT INTO user_quiz_stats (
    user_id,
    total_sessions,
    total_questions_answered,
    total_correct_answers,
    best_score,
    current_streak,
    longest_streak,
    total_time_spent_seconds
  ) VALUES (
    current_user_id,
    1,
    p_questions_answered,
    p_correct_answers,
    p_total_score,
    CASE WHEN p_correct_answers = p_questions_answered THEN 1 ELSE 0 END,
    CASE WHEN p_correct_answers = p_questions_answered THEN 1 ELSE 0 END,
    p_time_taken_seconds
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_quiz_stats.total_sessions + 1,
    total_questions_answered = user_quiz_stats.total_questions_answered + p_questions_answered,
    total_correct_answers = user_quiz_stats.total_correct_answers + p_correct_answers,
    best_score = GREATEST(user_quiz_stats.best_score, p_total_score),
    current_streak = CASE 
      WHEN p_correct_answers = p_questions_answered THEN user_quiz_stats.current_streak + 1 
      ELSE 0 
    END,
    longest_streak = GREATEST(
      user_quiz_stats.longest_streak, 
      CASE 
        WHEN p_correct_answers = p_questions_answered THEN user_quiz_stats.current_streak + 1 
        ELSE user_quiz_stats.current_streak 
      END
    ),
    total_time_spent_seconds = user_quiz_stats.total_time_spent_seconds + p_time_taken_seconds,
    updated_at = NOW();

  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user quiz stats
CREATE OR REPLACE FUNCTION get_user_quiz_stats()
RETURNS TABLE(
  total_sessions integer,
  total_questions_answered integer,
  total_correct_answers integer,
  accuracy_percentage numeric,
  best_score integer,
  current_streak integer,
  longest_streak integer,
  average_score numeric,
  total_time_spent_seconds integer,
  favorite_category text
) AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(uqs.total_sessions, 0),
    COALESCE(uqs.total_questions_answered, 0),
    COALESCE(uqs.total_correct_answers, 0),
    CASE 
      WHEN COALESCE(uqs.total_questions_answered, 0) > 0 
      THEN ROUND((COALESCE(uqs.total_correct_answers, 0)::numeric / uqs.total_questions_answered::numeric) * 100, 1)
      ELSE 0::numeric
    END,
    COALESCE(uqs.best_score, 0),
    COALESCE(uqs.current_streak, 0),
    COALESCE(uqs.longest_streak, 0),
    CASE 
      WHEN COALESCE(uqs.total_sessions, 0) > 0 
      THEN ROUND(AVG(qs.total_score), 1)
      ELSE 0::numeric
    END,
    COALESCE(uqs.total_time_spent_seconds, 0),
    COALESCE(uqs.favorite_category, 'general')
  FROM user_quiz_stats uqs
  LEFT JOIN quiz_sessions qs ON qs.user_id = uqs.user_id
  WHERE uqs.user_id = current_user_id
  GROUP BY uqs.user_id, uqs.total_sessions, uqs.total_questions_answered, 
           uqs.total_correct_answers, uqs.best_score, uqs.current_streak, 
           uqs.longest_streak, uqs.total_time_spent_seconds, uqs.favorite_category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_testament ON quiz_questions(testament);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_quiz_stats_user_id ON user_quiz_stats(user_id);

-- Grant necessary permissions
GRANT SELECT ON quiz_questions TO authenticated;
GRANT ALL ON quiz_sessions TO authenticated;
GRANT ALL ON user_quiz_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_random_quiz_questions(integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION save_quiz_session(integer, integer, integer, integer, text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_quiz_stats() TO authenticated;