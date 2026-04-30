import { Conversation, Message } from './types';

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem('geode-conversations-v2', JSON.stringify(conversations));
};

export const loadConversations = (): Conversation[] => {
  const data = localStorage.getItem('geode-conversations-v2');
  if (data) return JSON.parse(data);

  // Migration from v1
  const v1Data = localStorage.getItem('geode-conversations');
  if (v1Data) {
    const v1: any[] = JSON.parse(v1Data);
    return v1.map(c => ({
      ...c,
      model: 'claude-3-5-sonnet-20241022',
      thinkingDepth: 'standard',
      pinnedContextIds: [],
      enabledTools: ['web-search', 'code-sandbox', 'image-vision', 'doc-reader', 'mermaid-render']
    }));
  }
  return [];
};

export const saveActiveId = (id: string | null) => {
  if (id) localStorage.setItem('geode-active', id);
  else localStorage.removeItem('geode-active');
};

export const loadActiveId = (): string | null => {
  return localStorage.getItem('geode-active');
};
