import { Task } from '../types';

export type TasksAction =
  | { type: 'LOAD'; payload: Task[] }
  | { type: 'ADD'; payload: Task }
  | { type: 'TOGGLE'; payload: string }   // id
  | { type: 'DELETE'; payload: string }   // id
  | { type: 'UPDATE'; payload: Task };    // (optional future use)

export function tasksReducer(state: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD':
      return [action.payload, ...state];
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    case 'UPDATE':
      return state.map(t => (t.id === action.payload.id ? { ...action.payload } : t));
    default:
      return state;
  }
}
