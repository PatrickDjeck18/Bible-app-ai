import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { firebaseConfig } from './firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  DAILY_ACTIVITIES: 'daily_activities',
  MOOD_ENTRIES: 'mood_entries',
  PRAYERS: 'prayers',
  DREAMS: 'dreams',
  QUIZ_SESSIONS: 'quiz_sessions',
  USER_QUIZ_STATS: 'user_quiz_stats',
  BIBLE_VERSES: 'bible_verses',
  DEVOTIONALS: 'devotionals',
  QUIZ_QUESTIONS: 'quiz_questions',
  MOOD_INFLUENCES: 'mood_influences'
} as const;

// Helper function to convert Firestore timestamp to string
export const timestampToString = (timestamp: Timestamp | null): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
};

// Helper function to convert string to Firestore timestamp
export const stringToTimestamp = (dateString: string): Timestamp => {
  return Timestamp.fromDate(new Date(dateString));
};

// Helper function to add server timestamp
export const addServerTimestamp = () => serverTimestamp();

// Generic CRUD operations
export class FirestoreService {
  // Create a new document
  static async create<T extends DocumentData>(
    collectionName: string, 
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    try {
      const docData = {
        ...data,
        created_at: addServerTimestamp(),
        updated_at: addServerTimestamp()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      console.log(`✅ Created document in ${collectionName} with ID:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a document by ID
  static async getById<T extends DocumentData>(
    collectionName: string, 
    id: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as T;
        return {
          id: docSnap.id,
          ...data,
          created_at: timestampToString(data.created_at),
          updated_at: timestampToString(data.updated_at)
        };
      } else {
        console.log(`📄 No document found in ${collectionName} with ID:`, id);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get documents by user ID
  static async getByUserId<T extends DocumentData>(
    collectionName: string, 
    userId: string,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    try {
      let q = query(
        collection(db, collectionName),
        where('user_id', '==', userId)
      );

      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as T;
        documents.push({
          id: doc.id,
          ...data,
          created_at: timestampToString(data.created_at),
          updated_at: timestampToString(data.updated_at)
        });
      });

      console.log(`✅ Retrieved ${documents.length} documents from ${collectionName} for user ${userId}`);
      return documents;
    } catch (error) {
      console.error(`❌ Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  static async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updated_at: addServerTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      console.log(`✅ Updated document in ${collectionName} with ID:`, id);
    } catch (error) {
      console.error(`❌ Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`✅ Deleted document in ${collectionName} with ID:`, id);
    } catch (error) {
      console.error(`❌ Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get all documents from a collection
  static async getAll<T extends DocumentData>(
    collectionName: string,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q = query(collection(db, collectionName));

      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as T;
        documents.push({
          id: doc.id,
          ...data,
          created_at: timestampToString(data.created_at),
          updated_at: timestampToString(data.updated_at)
        });
      });

      console.log(`✅ Retrieved ${documents.length} documents from ${collectionName}`);
      return documents;
    } catch (error) {
      console.error(`❌ Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Query documents with custom conditions
  static async query<T extends DocumentData>(
    collectionName: string,
    conditions: Array<{ field: string; operator: any; value: any }>,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q = query(collection(db, collectionName));

      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });

      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as T;
        documents.push({
          id: doc.id,
          ...data,
          created_at: timestampToString(data.created_at),
          updated_at: timestampToString(data.updated_at)
        });
      });

      console.log(`✅ Retrieved ${documents.length} documents from ${collectionName} with custom query`);
      return documents;
    } catch (error) {
      console.error(`❌ Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  }
}

export default FirestoreService;
