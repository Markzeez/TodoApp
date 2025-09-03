import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { RootStackParamList } from '../../App';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../context/TaskContext';
import { useThemeContext } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TaskListScreen({ navigation, route, navigation: { setOptions } }: Props) {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const { theme, toggleTheme } = useThemeContext();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortDue, setSortDue] = useState<boolean>(false);

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} accessibilityLabel="Toggle theme">
          <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} />
        </TouchableOpacity>
      ),
    });
  }, [setOptions, theme, toggleTheme]);

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter === 'active') list = list.filter(t => !t.completed);
    if (filter === 'completed') list = list.filter(t => t.completed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (sortDue) {
      list = [...list].sort((a, b) => {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return da - db;
      });
    } else {
      // default: newest first
      list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [tasks, filter, query, sortDue]);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} />
        <TextInput
          placeholder="Search tasks..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip label="Active" active={filter === 'active'} onPress={() => setFilter('active')} />
        <FilterChip label="Completed" active={filter === 'completed'} onPress={() => setFilter('completed')} />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setSortDue(s => !s)} style={styles.sortBtn}>
          <Ionicons name="calendar-outline" size={16} />
          <Text style={styles.sortText}>{sortDue ? 'Due date' : 'Recent'}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        accessibilityLabel="Add task"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchInput: { flex: 1, paddingVertical: 4 },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { fontSize: 12, color: '#333' },
  chipTextActive: { color: '#fff' },
  sortBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 },
  sortText: { fontSize: 12, color: '#333' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#111',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
