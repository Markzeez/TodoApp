import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { tasksReducer } from '../state/taskReducer';
import { Task } from '../types';
import { loadTasks as loadFromStorage, saveTasks as saveToStorage } from '../utils/storage';

type AddInput = {
  title: string;
  description?: string;
  dueDate?: string | null;
};

type TasksContextValue = {
  tasks: Task[];
  addTask: (input: AddInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reload: () => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, [] as Task[]);

  const persist = useCallback((next: Task[]) => {
    saveToStorage(next).catch(() => {});
  }, []);

  // Load once
  useEffect(() => {
    (async () => {
      const stored = await loadFromStorage();
      dispatch({ type: 'LOAD', payload: stored });
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    persist(tasks);
  }, [persist, tasks]);

  const addTask = (input: AddInput) => {
    const id = Math.random().toString(36).slice(2);
    const newTask: Task = {
      id,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      completed: false,
      dueDate: input.dueDate || null,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD', payload: newTask });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const reload = async () => {
    const stored = await loadFromStorage();
    dispatch({ type: 'LOAD', payload: stored });
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, reload }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
