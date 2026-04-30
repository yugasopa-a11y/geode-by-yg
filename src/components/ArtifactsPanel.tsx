import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Code,
  Eye,
  Copy,
  Check,
  Download,
  FileJson,
  Table as TableIcon,
  Calculator,
  GitGraph,
  Play
} from 'lucide-react';
import mermaid from 'mermaid';
import { Artifact } from '../types';
import { cn } from '../utils/cn';

interface ArtifactsPanelProps {
  content: string;
  onClose: () => void;
}

const ArtifactsPanel = ({ content, onClose }: ArtifactsPanelProps) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newArtifacts: Artifact[] = [];

    // Code blocks
    const codeRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      const language = match[1];
      const code = match[2];
      let type: Artifact['type'] = 'code';

      if (language === 'mermaid') {
        type = 'mermaid';
      } else if (language === 'html' || code.includes('export default') || code.includes('function Component')) {
        type = 'react';
      } else if (language === 'json') {
        type = 'code';
      }

      newArtifacts.push({
        id: `art-${newArtifacts.length}`,
        type,
        language,
        content: code,
        title: `Artifact ${newArtifacts.length + 1}`
      });
    }

    // Math blocks extraction
    const mathRegex = /\$\$([\s\S]*?)\$\$/g;
    while ((match = mathRegex.exec(content)) !== null) {
      newArtifacts.push({
        id: `math-${newArtifacts.length}`,
        type: 'code',
        language: 'latex',
        content: match[1].trim(),
        title: `Equation ${newArtifacts.length + 1}`
      });
    }

    setArtifacts(newArtifacts);
    if (newArtifacts.length > 0 && !activeId) {
      setActiveId(newArtifacts[0].id);
    }
  }, [content]);

  useEffect(() => {
    const activeArtifact = artifacts.find(a => a.id === activeId);
    if (view === 'preview' && activeArtifact?.type === 'mermaid' && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
      mermaid.render(`mermaid-${activeId}`, activeArtifact.content).then((res) => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = res.svg;
      }).catch(err => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = `<div class="text-red-500 p-4">Mermaid Error: ${err.message}</div>`;
      });
    }
  }, [view, activeId, artifacts]);

  const activeArtifact = artifacts.find(a => a.id === activeId);

  const handleCopy = () => {
    if (activeArtifact) {
      navigator.clipboard.writeText(activeArtifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (artifacts.length === 0) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 w-full md:w-[50%] h-full bg-surface-2 border-l border-white/10 z-50 flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
            <Code size={18} className="text-accent" />
          </div>
          <h3 className="font-medium text-sm font-serif">Engine Artifacts</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-secondary transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex bg-black/20 px-4 gap-1 overflow-x-auto custom-scrollbar border-b border-white/5">
          {artifacts.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                setActiveId(art.id);
                setView('code');
              }}
              className={cn(
                "px-4 py-3 text-[10px] font-mono border-b-2 transition-all whitespace-nowrap uppercase tracking-widest",
                activeId === art.id
                  ? "border-accent text-accent bg-accent/5"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              {art.language || art.type}: {art.id.split('-')[1]}
            </button>
          ))}
        </div>

        {activeArtifact && (
          <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setView('code')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors",
                    view === 'code' ? "bg-white/10 text-white" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <Code size={14} /> Code
                </button>
                {(activeArtifact.type === 'react' || activeArtifact.type === 'mermaid' || activeArtifact.language === 'html') && (
                  <button
                    onClick={() => setView('preview')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors",
                      view === 'preview' ? "bg-white/10 text-white" : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Play size={14} /> Preview
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
                  title="Copy Code"
                >
                  {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary transition-colors" title="Download">
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
              {view === 'code' ? (
                <pre className="text-sm font-mono text-text-primary leading-relaxed selection:bg-accent/30 whitespace-pre-wrap">
                  <code>{activeArtifact.content}</code>
                </pre>
              ) : (
                <div className="w-full h-full rounded-lg overflow-hidden glass-panel flex items-center justify-center p-4">
                  {activeArtifact.type === 'mermaid' ? (
                    <div ref={mermaidRef} className="w-full h-full flex justify-center items-center overflow-auto" />
                  ) : (
                    <iframe
                      title="Artifact Preview"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              body { background: #0a0a0a; color: #fff; margin: 0; padding: 2rem; font-family: sans-serif; }
                              .artifact-container { max-width: 100%; overflow-x: auto; }
                            </style>
                          </head>
                          <body>
                            <div class="artifact-container">
                              ${activeArtifact.language === 'html' ? activeArtifact.content : `<pre>${activeArtifact.content}</pre>`}
                            </div>
                          </body>
                        </html>
                      `}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ArtifactsPanel;
