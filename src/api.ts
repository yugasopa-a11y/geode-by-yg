import { Message } from './types';

const OPENROUTER_API_KEY = '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';

export async function chatStream(
  messages: Message[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://geode-ai.yg',
      'X-Title': 'Geode AI Chat',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    }),
    signal,
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
          if (content) onChunk(content);
        } catch (e) {
          // Some chunks might be partial or invalid JSON
        }
      }
    }
  }
}
