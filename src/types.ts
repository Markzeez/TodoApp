export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | null; // ISO string "YYYY-MM-DD"
  createdAt: number;       // timestamp
};
