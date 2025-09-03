import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>Tap the + button to add your first task.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 48 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#666' },
});
