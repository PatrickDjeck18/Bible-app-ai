const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Replace with the path to your service account key file
const serviceAccount = require('./daily-bread-88f42-firebase-adminsdk-fbsvc-efad791929.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to convert CSV value to correct data type
const parseValue = (value) => {
  if (value === '' || value === 'NaN' || value === 'null') {
    return null;
  }
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return parseFloat(value);
  }
  return value;
};

// Helper function to check for valid date and return as Firestore Timestamp
const toFirestoreTimestamp = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return admin.firestore.Timestamp.fromDate(date);
  } catch (e) {
    console.error('Error converting date:', e);
    return null;
  }
};

const fileConfigs = {
  'profiles_rows.csv': {
  collection: 'users',
  transform: (row) => {
    // Remove the id from the data before writing
    const { id, ...data } = row;
    return {
      ...data,
      journey_start_date: toFirestoreTimestamp(data.journey_start_date),
      created_at: toFirestoreTimestamp(data.created_at),
      updated_at: toFirestoreTimestamp(data.updated_at),
      current_streak: parseValue(data.current_streak),
      total_prayers: parseValue(data.total_prayers),
      total_bible_readings: parseValue(data.total_bible_readings),
      avatar_url: data.avatar_url || null,
      is_premium: false,
    };
  },
  docIdFromRow: (row) => {
    // Return the id only if it is a non-empty string
    return row.id && row.id.trim() !== '' ? row.id : null;
  },
},
  'quiz_questions_rows.csv': {
    collection: 'quiz_questions',
    transform: (row) => ({
      ...row,
      id: parseValue(row.id),
      correct_answer: parseValue(row.correct_answer),
      created_at: toFirestoreTimestamp(row.created_at),
      updated_at: toFirestoreTimestamp(row.updated_at),
    }),
  },
  'prayers_rows.csv': {
    collection: 'prayers',
    transform: (row) => ({
      ...row,
      user_id: parseValue(row.user_id),
      prayed_at: toFirestoreTimestamp(row.prayed_at),
      created_at: toFirestoreTimestamp(row.created_at),
      updated_at: toFirestoreTimestamp(row.updated_at),
      answered_at: toFirestoreTimestamp(row.answered_at),
      is_shared: row.is_shared === 'true',
      is_community: row.is_community === 'true',
      prayer_count: parseValue(row.prayer_count),
      answered_prayer_count: parseValue(row.answered_prayer_count),
      body: row.body || null,
      description: row.description || null,
    }),
  },
  'notes_rows.csv': {
    collection: 'notes',
    transform: (row) => {
      let tags = [];
      try {
        tags = JSON.parse(row.tags);
      } catch (e) {
        console.warn(`Could not parse tags for note ${row.id}: ${row.tags}`);
      }
      return {
        ...row,
        user_id: parseValue(row.user_id),
        is_private: row.is_private === 'true',
        is_favorite: row.is_favorite === 'true',
        mood_rating: parseValue(row.mood_rating),
        created_at: toFirestoreTimestamp(row.created_at),
        updated_at: toFirestoreTimestamp(row.updated_at),
        tags: tags,
      };
    },
  },
  'mood_entries_rows.csv': {
    collection: 'mood_entries',
    transform: (row) => ({
      ...row,
      user_id: parseValue(row.user_id),
      entry_date: toFirestoreTimestamp(row.entry_date),
      intensity_rating: parseValue(row.intensity_rating),
      created_at: toFirestoreTimestamp(row.created_at),
      updated_at: toFirestoreTimestamp(row.updated_at),
      note: row.note || null,
    }),
  },
  'dreams_rows.csv': {
    collection: 'dreams',
    transform: (row) => ({
      ...row,
      user_id: parseValue(row.user_id),
      date: toFirestoreTimestamp(row.date),
      is_analyzed: row.is_analyzed === 'true',
      created_at: toFirestoreTimestamp(row.created_at),
      updated_at: toFirestoreTimestamp(row.updated_at),
    }),
  },
  'daily_activities_rows.csv': {
    collection: 'daily_activities',
    transform: (row) => ({
      ...row,
      user_id: parseValue(row.user_id),
      activity_date: toFirestoreTimestamp(row.activity_date),
      bible_reading_minutes: parseValue(row.bible_reading_minutes),
      prayer_minutes: parseValue(row.prayer_minutes),
      devotional_completed: row.devotional_completed === 'true',
      mood_rating: parseValue(row.mood_rating),
      activities_completed: parseValue(row.activities_completed),
      goal_percentage: parseValue(row.goal_percentage),
      created_at: toFirestoreTimestamp(row.created_at),
      updated_at: toFirestoreTimestamp(row.updated_at),
    }),
  },
};

const migrateCsvToFirestore = async (csvFilePath, config) => {
  console.log(`\nStarting migration for ${csvFilePath}...`);
  const results = [];
  const fullPath = path.join(__dirname, csvFilePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found at ${fullPath}`);
    return;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(fullPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const batch = db.batch();
        let documentCount = 0;

        for (const row of results) {
          try {
            const transformedData = config.transform(row);
            let docRef;
            if (config.docIdFromRow) {
              // Use specific ID for 'users' collection
              docRef = db.collection(config.collection).doc(config.docIdFromRow(row));
            } else {
              // Let Firestore generate a new ID
              docRef = db.collection(config.collection).doc();
            }
            batch.set(docRef, transformedData);
            documentCount++;
          } catch (error) {
            console.error(`Error processing row from ${csvFilePath}:`, error);
          }
        }

        try {
          await batch.commit();
          console.log(`✅ Successfully committed ${documentCount} documents to ${config.collection}.`);
          resolve();
        } catch (error) {
          console.error(`Failed to commit batch for ${csvFilePath}:`, error);
          reject(error);
        }
      });
  });
};

// Run the migration for all files
const runMigration = async () => {
  for (const [fileName, config] of Object.entries(fileConfigs)) {
    try {
      await migrateCsvToFirestore(fileName, config);
    } catch (error) {
      console.error(`Migration for ${fileName} failed:`, error);
      process.exit(1);
    }
  }
  console.log('\nAll migrations completed successfully! 🎉');
};

runMigration();