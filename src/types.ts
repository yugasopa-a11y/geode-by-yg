export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
  id: string;
  timestamp: number;
  isPinned?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
  thinkingDepth: 'quick' | 'standard' | 'deep';
  pinnedContextIds: string[];
  enabledTools: string[];
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'need-help' | 'failed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  tools?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'need-help' | 'failed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  usageCount: number;
  isEnabled: boolean;
}

export interface Artifact {
  id: string;
  type: 'code' | 'table' | 'math' | 'mermaid' | 'react';
  language: string;
  content: string;
  title: string;
}

export type AgentState = 'IDLE' | 'STREAMING' | 'TOOL USE' | 'PLANNING' | 'SEARCHING';
