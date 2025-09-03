import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { RootStackParamList } from '../../app';
import { useTasks } from '../context/TaskContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export default function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState(''); // YYYY-MM-DD

  const onSave = () => {
    const t = title.trim();
    if (!t) {
      Alert.alert('Title required', 'Please enter a task title.');
      return;
    }
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
      Alert.alert('Invalid date', 'Use format YYYY-MM-DD (e.g., 2025-09-01).');
      return;
    }
    addTask({ title: t, description: desc.trim() || undefined, dueDate: due || null });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Buy groceries"
          returnKeyType="done"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={desc}
          onChangeText={setDesc}
          placeholder="optional details"
          multiline
        />

        <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={due}
          onChangeText={setDue}
          placeholder="e.g., 2025-09-05"
          keyboardType="numbers-and-punctuation"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Save Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  label: { fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff'
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  saveBtn: {
    marginTop: 8, backgroundColor: '#111', borderRadius: 12, paddingVertical: 14, alignItems: 'center'
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
