import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Eye, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

interface Artifact {
  id: string;
  language: string;
  code: string;
  title: string;
}

interface ArtifactsPanelProps {
  content: string;
  onClose: () => void;
}

const ArtifactsPanel = ({ content, onClose }: ArtifactsPanelProps) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [view, setView] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Extract code blocks from content
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
    const found: Artifact[] = [];
    let match;
    let count = 1;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      found.push({
        id: `artifact-${count}`,
        language: match[1],
        code: match[2],
        title: `Artifact ${count} (${match[1]})`
      });
      count++;
    }

    setArtifacts(found);
    if (found.length > 0 && !activeArtifact) {
      setActiveArtifact(found[0]);
    }
  }, [content]);

  const handleCopy = () => {
    if (activeArtifact) {
      navigator.clipboard.writeText(activeArtifact.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isHTML = activeArtifact?.language === 'html' ||
                 activeArtifact?.language === 'javascript' ||
                 activeArtifact?.language === 'css';

  if (artifacts.length === 0) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 w-full md:w-[50%] h-full bg-surface-2 border-l border-white/10 z-40 flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center border border-[#c9a96e]/20">
            <Code size={18} className="text-[#c9a96e]" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Artifacts</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">{artifacts.length} detected</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for multiple artifacts */}
        {artifacts.length > 1 && (
          <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-black/20">
            {artifacts.map((art) => (
              <button
                key={art.id}
                onClick={() => setActiveArtifact(art)}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  activeArtifact?.id === art.id
                    ? "bg-[#c9a96e] text-black"
                    : "bg-white/5 text-text-secondary hover:bg-white/10"
                )}
              >
                <span className="text-xs font-bold">{art.id.split('-')[1]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
          {activeArtifact && (
            <>
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/2">
                <div className="flex gap-1">
                  <button
                    onClick={() => setView('code')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all",
                      view === 'code' ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                    )}
                  >
                    <Code size={14} /> Code
                  </button>
                  {isHTML && (
                    <button
                      onClick={() => setView('preview')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all",
                        view === 'preview' ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                      )}
                    >
                      <Eye size={14} /> Preview
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check size={16} className="text-[#c9a96e]" /> : <Copy size={16} />}
                  </button>
                  <button
                    className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"
                    title="Download File"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-0">
                {view === 'code' ? (
                  <pre className="p-6 text-sm font-mono text-text-primary leading-relaxed h-full overflow-auto selection:bg-[#c9a96e]/30">
                    <code>{activeArtifact.code}</code>
                  </pre>
                ) : (
                  <iframe
                    title="Artifact Preview"
                    srcDoc={activeArtifact.code}
                    className="w-full h-full bg-white"
                    sandbox="allow-scripts"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ArtifactsPanel;
