import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = 'tasks:v1';
const THEME_KEY = 'theme:v1';

export async function loadTasks(): Promise<Task[]> {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  return json ? JSON.parse(json) as Task[] : [];
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function loadTheme(): Promise<'light' | 'dark' | null> {
  const v = await AsyncStorage.getItem(THEME_KEY);
  if (v === 'light' || v === 'dark') return v;
  return null;
}

export async function saveTheme(t: 'light' | 'dark') {
  await AsyncStorage.setItem(THEME_KEY, t);
}
