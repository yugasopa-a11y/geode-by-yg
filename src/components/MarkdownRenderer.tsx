import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, useAnimate } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock = ({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [scope, animate] = useAnimate();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    // Flash animation
    animate(scope.current, { borderColor: 'rgba(201,169,110,0.7)' }, { duration: 0.2 });
    setTimeout(() => {
      animate(scope.current, { borderColor: 'rgba(255,255,255,0.1)' }, { duration: 0.3 });
      setCopied(false);
    }, 500);
  };

  return (
    <div ref={scope} className="relative group rounded-xl border border-white/10 bg-black/40 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-text-secondary">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-white/10 rounded transition-colors text-text-secondary hover:text-text-primary"
        >
          {copied ? <Check size={14} className="text-[#c9a96e]" /> : <Copy size={14} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus as any}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
