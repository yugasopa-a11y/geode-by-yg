import { Message, Task } from './types';
import { SKILLS } from './SKILLS';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const IS_STATIC = !!API_KEY;
const BASE_URL = IS_STATIC ? 'https://openrouter.ai/api/v1' : '';

export async function chatStream(
  messages: any[],
  model: string = 'openrouter/auto',
  onChunk: (chunk: string) => void,
  options?: {
    signal?: AbortSignal,
    tools?: any[],
    systemPrompt?: string
  }
) {
  const formattedMessages = options?.systemPrompt
    ? [{ role: 'system', content: options.systemPrompt }, ...messages]
    : messages;

  const endpoint = IS_STATIC ? `${BASE_URL}/chat/completions` : '/api/chat';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (IS_STATIC) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Geode AI Chat';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages: formattedMessages,
      model: 'openrouter/auto', // Override with auto as requested
      stream: true,
      tools: options?.tools || SKILLS.map(s => ({
        type: 'function',
        function: {
          name: s.id,
          description: s.description,
          parameters: { type: 'object', properties: {}, required: [] }
        }
      }))
    }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch');
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    accumulated += decoder.decode(value, { stream: true });

    const lines = accumulated.split('\n');
    accumulated = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === '') continue;
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const content = json.choices[0]?.delta?.content || '';

          const toolCall = json.choices[0]?.delta?.tool_calls?.[0];
          if (toolCall) {
            onChunk(`[TOOL_CALL:${JSON.stringify(toolCall)}]`);
          }

          if (content) onChunk(content);
        } catch (e) {
          // Partial JSON
        }
      }
    }
  }
}

export async function generateTitle(message: string): Promise<string> {
  try {
    const endpoint = IS_STATIC ? `${BASE_URL}/chat/completions` : '/api/complete';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (IS_STATIC) headers['Authorization'] = `Bearer ${API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: 'Title the conversation based on the first message in 3-5 words. Return ONLY the title text, no quotes or punctuation.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Untitled Chat';
  } catch (e) {
    return 'Untitled Chat';
  }
}

export async function generatePlan(message: string): Promise<Task[]> {
  try {
    const endpoint = IS_STATIC ? `${BASE_URL}/chat/completions` : '/api/complete';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (IS_STATIC) headers['Authorization'] = `Bearer ${API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a task planner. Break down the users request into a JSON array of tasks. Each task has: id, title, description, status ("pending"), priority ("low", "medium", "high"), level (1), dependencies (array of ids), and subtasks (array). Return JSON as { "tasks": [...] }.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{ "tasks": [] }';
    return JSON.parse(content).tasks;
  } catch (e) {
    return [];
  }
}

export function formatMessagesForAI(messages: Message[], pinnedMessages: Message[]) {
  return [
    ...pinnedMessages.map(m => ({
      role: 'system',
      content: `Pinned Context from previous message:\n${m.content}`
    })),
    ...messages.map(msg => {
      const imageMatch = msg.content.match(/!\[Image\]\((data:image\/[^;]+;base64,[^)]+)\)/);
      if (imageMatch && msg.role === 'user') {
        const imageUrl = imageMatch[1];
        const textContent = msg.content.replace(/!\[Image\]\([^)]+\)/, '').trim();
        return {
          role: msg.role,
          content: [
            { type: 'text', text: textContent || "What is in this image?" },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        };
      }
      return { role: msg.role, content: msg.content };
    })
  ];
}
