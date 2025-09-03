import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { DatabaseMigrationService, MigrationProgress } from '../lib/databaseMigration';
import { auth } from '../lib/firebase';
import { DatabaseService } from '../lib/services/databaseService';

interface MigrationStats {
  profiles: { supabase: number; firestore: number };
  daily_activities: { supabase: number; firestore: number };
  mood_entries: { supabase: number; firestore: number };
  prayers: { supabase: number; firestore: number };
  dreams: { supabase: number; firestore: number };
  quiz_sessions: { supabase: number; firestore: number };
  user_quiz_stats: { supabase: number; firestore: number };
}

export default function DatabaseMigration() {
  const [progress, setProgress] = useState<MigrationProgress>({
    totalRecords: 0,
    migratedRecords: 0,
    currentTable: '',
    status: 'idle'
  });
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress.status === 'migrating') {
        setProgress(DatabaseMigrationService.getProgress());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress.status]);

  const handleStartMigration = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please sign in to migrate your data.');
      return;
    }

    Alert.alert(
      'Start Migration',
      'This will migrate all your data from Supabase to Firebase Firestore. This process cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Migration',
          style: 'destructive',
          onPress: async () => {
            setIsMigrating(true);
            try {
              await DatabaseMigrationService.migrateAllData(user.uid);
              Alert.alert('Success', 'Data migration completed successfully!');
              await verifyMigration();
            } catch (error) {
              Alert.alert('Error', `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setIsMigrating(false);
            }
          }
        }
      ]
    );
  };

  const verifyMigration = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsVerifying(true);
    try {
      const result = await DatabaseMigrationService.verifyMigration(user.uid);
      setStats(result.details);
      
      if (result.success) {
        Alert.alert('Verification Complete', 'All data has been successfully migrated!');
      } else {
        Alert.alert('Verification Warning', 'Some data may not have been migrated completely. Please check the details below.');
      }
    } catch (error) {
      Alert.alert('Error', `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const testFirebaseConnection = async () => {
    try {
      // Test creating a simple document
      const testData = {
        user_id: auth.currentUser?.uid || 'test',
        test_field: 'test_value',
        timestamp: new Date().toISOString()
      };
      
      const testId = await DatabaseService.createMoodEntry(testData as any);
      await DatabaseService.deleteMoodEntry(testId);
      
      Alert.alert('Success', 'Firebase connection is working correctly!');
    } catch (error) {
      Alert.alert('Error', `Firebase connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getProgressPercentage = () => {
    if (progress.totalRecords === 0) return 0;
    return Math.round((progress.migratedRecords / progress.totalRecords) * 100);
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed': return '#10B981';
      case 'error': return '#EF4444';
      case 'migrating': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'completed': return 'Migration Completed';
      case 'error': return 'Migration Failed';
      case 'migrating': return 'Migrating...';
      default: return 'Ready to Migrate';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Migration</Text>
        <Text style={styles.subtitle}>
          Migrate your data from Supabase to Firebase Firestore
        </Text>
      </View>

      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Migration Status</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        {progress.status === 'migrating' && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {progress.currentTable ? `Migrating ${progress.currentTable}...` : 'Preparing migration...'}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressDetails}>
              {progress.migratedRecords} / {progress.totalRecords} records migrated ({getProgressPercentage()}%)
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleStartMigration}
          disabled={isMigrating || progress.status === 'migrating'}
        >
          <Text style={styles.buttonText}>
            {isMigrating ? 'Migrating...' : 'Start Migration'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={verifyMigration}
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? 'Verifying...' : 'Verify Migration'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={testFirebaseConnection}
        >
          <Text style={styles.buttonText}>Test Firebase Connection</Text>
        </TouchableOpacity>
      </View>

      {/* Migration Stats */}
      {stats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Migration Results</Text>
          
          {Object.entries(stats).map(([table, counts]) => (
            <View key={table} style={styles.statRow}>
              <Text style={styles.tableName}>{table.replace('_', ' ')}</Text>
              <View style={styles.counts}>
                <Text style={styles.countText}>
                  Supabase: {counts.supabase}
                </Text>
                <Text style={styles.countText}>
                  Firestore: {counts.firestore}
                </Text>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: counts.supabase === counts.firestore ? '#10B981' : '#F59E0B' }
                ]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Important Information</Text>
        <Text style={styles.infoText}>
          • This migration will copy all your data from Supabase to Firebase Firestore
        </Text>
        <Text style={styles.infoText}>
          • Your original data in Supabase will remain unchanged
        </Text>
        <Text style={styles.infoText}>
          • After successful migration, you can switch to using Firebase exclusively
        </Text>
        <Text style={styles.infoText}>
          • Make sure you have a stable internet connection during migration
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#10b981',
  },
  testButton: {
    backgroundColor: '#f59e0b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableName: {
    fontSize: 14,
    color: '#374151',
    textTransform: 'capitalize',
  },
  counts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});
