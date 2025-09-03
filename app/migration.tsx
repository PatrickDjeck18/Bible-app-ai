import React from 'react';
import { View, StyleSheet } from 'react-native';
import DatabaseMigration from '../components/DatabaseMigration';

export default function MigrationScreen() {
  return (
    <View style={styles.container}>
      <DatabaseMigration />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
