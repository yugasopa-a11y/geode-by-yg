export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
  id: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string; // 'completed' | 'in-progress' | 'need-help' | 'failed' | 'pending'
  priority: string;
  tools?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}
