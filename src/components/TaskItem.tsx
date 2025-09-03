import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }}>
        <Ionicons name={task.completed ? 'checkbox' : 'square-outline'} size={24} />
      </TouchableOpacity>

      <View style={styles.texts}>
        <Text style={[styles.title, task.completed && styles.completed]} numberOfLines={2}>
          {task.title}
        </Text>
        {(task.description || task.dueDate) && (
          <Text style={styles.meta} numberOfLines={2}>
            {task.description ? `${task.description}` : ''}{task.description && task.dueDate ? ' • ' : ''}{task.dueDate ? `Due ${task.dueDate}` : ''}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onDelete} accessibilityLabel="Delete task">
        <Ionicons name="trash-outline" size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
});
