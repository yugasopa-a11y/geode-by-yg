import { Message } from './types';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

export async function chatStream(
  messages: Message[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) {
  // Format messages for OpenRouter, handling potential images
  const formattedMessages = messages.map(msg => {
    // Check if content contains a base64 image (Markdown format: ![Image](data:image/...;base64,...))
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

    return {
      role: msg.role,
      content: msg.content
    };
  });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': 'https://geode-ai.yg',
      'X-Title': 'Geode AI Chat',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: formattedMessages,
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
          // Ignore parse errors for incomplete JSON
        }
      }
    }
  }
}
