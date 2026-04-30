import { Conversation } from './types';

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem('geode-conversations', JSON.stringify(conversations));
};

export const loadConversations = (): Conversation[] => {
  const data = localStorage.getItem('geode-conversations');
  return data ? JSON.parse(data) : [];
};

export const saveActiveId = (id: string | null) => {
  if (id) localStorage.setItem('geode-active', id);
  else localStorage.removeItem('geode-active');
};

export const loadActiveId = (): string | null => {
  return localStorage.getItem('geode-active');
};
