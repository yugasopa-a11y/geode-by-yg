import { Tool } from './types';

export const SKILLS: Tool[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Browse the web for real-time information and latest news.',
    icon: 'Search',
    usageCount: 0,
    isEnabled: true
  },
  {
    id: 'code-sandbox',
    name: 'Code Sandbox',
    description: 'Execute HTML, CSS, and JS in a live preview environment.',
    icon: 'Code',
    usageCount: 0,
    isEnabled: true
  },
  {
    id: 'image-vision',
    name: 'Image Analysis',
    description: 'Understand and analyze images using vision models.',
    icon: 'Image',
    usageCount: 0,
    isEnabled: true
  },
  {
    id: 'doc-reader',
    name: 'Document Reader',
    description: 'Process and analyze text, markdown, and PDF documents.',
    icon: 'FileText',
    usageCount: 0,
    isEnabled: true
  },
  {
    id: 'mermaid-render',
    name: 'Diagram Maker',
    description: 'Visualize complex ideas using Mermaid diagrams.',
    icon: 'GitBranch',
    usageCount: 0,
    isEnabled: true
  }
];
