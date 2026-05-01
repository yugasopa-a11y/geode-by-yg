import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Code,
  Eye,
  Copy,
  Check,
  Download,
  Play,
  Maximize2,
  Terminal,
  Cpu,
  Layers,
  Box,
  Monitor,
  Share2,
  ArrowUpRight
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
  const [view, setView] = useState<'code' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newArtifacts: Artifact[] = [];
    const codeRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      const language = match[1];
      const code = match[2];
      let type: Artifact['type'] = 'code';

      if (language === 'mermaid') type = 'mermaid';
      else if (language === 'html' || code.includes('export default') || code.includes('function Component')) type = 'react';

      newArtifacts.push({
        id: `art-${newArtifacts.length}`,
        type,
        language,
        content: code,
        title: `Component Segment ${newArtifacts.length + 1}`
      });
    }

    const mathRegex = /\$\$([\s\S]*?)\$\$/g;
    while ((match = mathRegex.exec(content)) !== null) {
      newArtifacts.push({
        id: `math-${newArtifacts.length}`,
        type: 'code',
        language: 'latex',
        content: match[1].trim(),
        title: `Mathematical Logic ${newArtifacts.length + 1}`
      });
    }

    setArtifacts(newArtifacts);
    if (newArtifacts.length > 0 && !activeId) {
      setActiveId(newArtifacts[0].id);
      // Auto-switch to code for non-previewable
      if (newArtifacts[0].type === 'code') setView('code');
    }
  }, [content]);

  useEffect(() => {
    const activeArtifact = artifacts.find(a => a.id === activeId);
    if (view === 'preview' && activeArtifact?.type === 'mermaid' && mermaidRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'serif'
      });
      mermaid.render(`mermaid-${activeId}`, activeArtifact.content).then((res) => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = res.svg;
      }).catch(err => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = `<div class="text-red-500 p-8 text-xs font-mono">Render Fault: ${err.message}</div>`;
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
      initial={{ x: '100%', opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isFullscreen ? '100%' : '50%'
      }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 right-0 h-full bg-surface-2 border-l border-white/5 z-[70] flex flex-col shadow-[-40px_0_120px_rgba(0,0,0,0.9)] backdrop-blur-[60px]",
        isFullscreen && "z-[100]"
      )}
    >
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <Layers size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-serif italic text-white leading-none mb-1.5">Intelligence Workspace</h3>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
               <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Segment Render Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 rounded-2xl hover:bg-white/5 text-text-tertiary hover:text-text-secondary transition-all"
          >
            <Maximize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-white/5 text-text-tertiary hover:text-text-secondary transition-all"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex bg-black/40 px-6 gap-2 overflow-x-auto custom-scrollbar border-b border-white/5 py-4">
          {artifacts.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                setActiveId(art.id);
                if (art.type === 'code') setView('code');
              }}
              className={cn(
                "group flex items-center gap-3 px-5 py-2.5 rounded-[18px] transition-all duration-500 whitespace-nowrap border",
                activeId === art.id
                  ? "bg-white/5 border-white/10 text-accent shadow-xl"
                  : "bg-transparent border-transparent text-text-tertiary hover:text-text-secondary hover:bg-white/[0.02]"
              )}
            >
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                activeId === art.id ? "bg-accent scale-110 shadow-[0_0_10px_rgba(212,184,138,0.5)]" : "bg-white/10"
              )} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">{art.title}</span>
            </button>
          ))}
        </div>

        {activeArtifact && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* View Controls */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/20">
              <div className="flex p-1 rounded-[16px] bg-black/40 border border-white/5">
                <button
                  onClick={() => setView('code')}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all duration-500",
                    view === 'code' ? "bg-white/10 text-white shadow-lg" : "text-text-tertiary hover:text-text-secondary"
                  )}
                >
                  <Code size={14} /> Logic
                </button>
                {(activeArtifact.type === 'react' || activeArtifact.type === 'mermaid' || activeArtifact.language === 'html') && (
                  <button
                    onClick={() => setView('preview')}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all duration-500",
                      view === 'preview' ? "bg-white/10 text-white shadow-lg" : "text-text-tertiary hover:text-text-secondary"
                    )}
                  >
                    <Monitor size={14} /> Output
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-text-secondary transition-all"
                >
                  {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                  {copied ? "Segment Stored" : "Store Logic"}
                </button>
                <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all">
                   <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Display Area */}
            <div className="flex-1 overflow-auto p-10 custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {view === 'code' ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="h-full"
                  >
                    <div className="premium-card h-full p-8 bg-black/40 border-white/10">
                      <pre className="text-sm font-mono text-white/80 leading-loose selection:bg-accent/30 whitespace-pre-wrap">
                        <code>{activeArtifact.content}</code>
                      </pre>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="h-full flex flex-col gap-8"
                  >
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(212,184,138,0.4)]" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-tertiary">Real-time Visualization Active</span>
                       </div>
                       <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">
                          Inspect Node <ArrowUpRight size={12} />
                       </button>
                    </div>

                    <div className="flex-1 rounded-[32px] overflow-hidden glass-panel flex items-center justify-center p-12 border-white/10 bg-black/60 relative group">
                       {/* Subtle depth shadow for the preview content */}
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,184,138,0.02),transparent_70%)] pointer-events-none" />

                       {activeArtifact.type === 'mermaid' ? (
                         <div ref={mermaidRef} className="w-full h-full flex justify-center items-center overflow-auto scale-[1.1] transition-transform duration-700" />
                       ) : (
                         <iframe
                           title="Segment Output"
                           srcDoc={`
                             <!DOCTYPE html>
                             <html>
                               <head>
                                 <meta charset="utf-8">
                                 <meta name="viewport" content="width=device-width, initial-scale=1">
                                 <script src="https://cdn.tailwindcss.com"></script>
                                 <style>
                                   body {
                                     background: transparent;
                                     color: #f5f5f5;
                                     margin: 0;
                                     padding: 0;
                                     font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                                     overflow-x: hidden;
                                   }
                                   ::-webkit-scrollbar { width: 4px; }
                                   ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                                 </style>
                               </head>
                               <body>
                                 <div class="render-root">
                                   ${activeArtifact.language === 'html' ? activeArtifact.content : `<div class="p-8"><pre class="font-mono text-sm leading-relaxed">${activeArtifact.content}</pre></div>`}
                                 </div>
                               </body>
                             </html>
                           `}
                           className="w-full h-full border-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
                           sandbox="allow-scripts"
                         />
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Workspace Footer */}
      <div className="px-10 py-8 border-t border-white/5 bg-black/40 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
               <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">Protocol</span>
               <span className="text-[10px] font-mono text-white/60">G-SYNTH/0.2.1</span>
            </div>
            <div className="w-[1px] h-6 bg-white/5" />
            <div className="flex flex-col gap-1">
               <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">Latency</span>
               <span className="text-[10px] font-mono text-accent">14ms</span>
            </div>
         </div>
         <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Cpu size={12} className="text-accent/60" />
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-[0.2em]">Neural Render Engine</span>
         </div>
      </div>
    </motion.div>
  );
};

export default ArtifactsPanel;
