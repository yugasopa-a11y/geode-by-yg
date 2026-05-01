import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings as SettingsIcon,
  Cpu,
  Shield,
  Zap,
  Database,
  Globe,
  Eye,
  Volume2,
  Waves,
  Sparkles,
  Command,
  Save,
  Trash2,
  Lock,
  Workflow
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onSystemPromptChange: (val: string) => void;
  onClearAll: () => void;
}

const SettingsPanel = ({ isOpen, onClose, systemPrompt, onSystemPromptChange, onClearAll }: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'neural' | 'appearance' | 'memory' | 'security'>('neural');

  const tabs = [
    { id: 'neural', label: 'Neural Protocols', icon: <Cpu size={16} /> },
    { id: 'appearance', label: 'Synthetic Visage', icon: <Sparkles size={16} /> },
    { id: 'memory', label: 'Cognitive Memory', icon: <Database size={16} /> },
    { id: 'security', label: 'Security Sector', icon: <Shield size={16} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
            className="w-full max-w-5xl h-[80vh] relative z-[201] glass-panel rounded-[40px] overflow-hidden flex flex-col shadow-[0_60px_120px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="px-12 py-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-[20px] bg-accent/10 flex items-center justify-center border border-accent/20">
                    <SettingsIcon size={24} className="text-accent" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-serif italic text-white leading-none mb-2">System Parameters</h2>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-tertiary">Geode Engine Configuration Sector</p>
                 </div>
              </div>
              <button
                onClick={onClose}
                className="p-4 rounded-2xl hover:bg-white/5 text-text-tertiary hover:text-text-secondary transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-72 border-r border-white/5 p-8 space-y-2 bg-black/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-500",
                      activeTab === tab.id
                        ? "bg-accent text-black shadow-lg shadow-accent/20"
                        : "text-text-tertiary hover:text-text-secondary hover:bg-white/5"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}

                <div className="pt-10">
                   <button
                     onClick={onClearAll}
                     className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-mono uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
                   >
                     <Trash2 size={16} />
                     <span>Purge All Memory</span>
                   </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-black/40">
                <AnimatePresence mode="wait">
                  {activeTab === 'neural' && (
                    <motion.div
                      key="neural"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Workflow size={18} className="text-accent/60" />
                           <h3 className="text-lg font-serif italic text-white">Base Directives</h3>
                        </div>
                        <div className="premium-card p-8 bg-black/60 border-white/10">
                           <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-4">System Identity Sequence</p>
                           <textarea
                             value={systemPrompt}
                             onChange={(e) => onSystemPromptChange(e.target.value)}
                             className="w-full h-40 bg-transparent border-none focus:ring-0 text-white/80 font-mono text-sm leading-loose resize-none"
                             placeholder="Define the neural persona..."
                           />
                           <div className="flex justify-end mt-4">
                              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-[10px] font-mono text-accent uppercase tracking-widest hover:bg-accent/20 transition-all">
                                 <Save size={14} /> Commit Changes
                              </button>
                           </div>
                        </div>
                      </section>

                      <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Zap size={18} className="text-accent/60" />
                           <h3 className="text-lg font-serif italic text-white">Cognitive Optimization</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           {[
                             { label: 'Creative Entropy', value: '0.7', icon: <Sparkles size={14} /> },
                             { label: 'contextual bias', value: 'Precision', icon: <Target size={14} /> },
                           ].map((item, i) => (
                             <div key={i} className="premium-card p-6 flex items-center justify-between border-white/5">
                                <div className="flex items-center gap-4">
                                   <div className="p-2 rounded-lg bg-white/5 text-text-tertiary">{item.icon}</div>
                                   <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">{item.label}</span>
                                </div>
                                <span className="text-sm font-mono text-white">{item.value}</span>
                             </div>
                           ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {activeTab === 'appearance' && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-12"
                    >
                      <section className="space-y-6">
                        <h3 className="text-lg font-serif italic text-white">Visual Synthesis</h3>
                        <div className="grid grid-cols-2 gap-8">
                           {[
                             { label: 'Cinematic Shadows', active: true },
                             { label: 'Glass Refraction', active: true },
                             { label: 'Haptic Feedback', active: false },
                             { label: 'Neural Particles', active: true },
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-6 glass-panel rounded-3xl border-white/5">
                                <span className="text-xs font-medium text-white/80">{item.label}</span>
                                <div className={cn(
                                  "w-10 h-5 rounded-full relative transition-all duration-500 cursor-pointer",
                                  item.active ? "bg-accent" : "bg-white/10"
                                )}>
                                   <div className={cn(
                                     "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-500",
                                     item.active ? "left-6" : "left-1"
                                   )} />
                                </div>
                             </div>
                           ))}
                        </div>
                      </section>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-12 py-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Lock size={14} className="text-text-tertiary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Encrypted Local Cluster</span>
               </div>
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-mono text-text-tertiary uppercase">GEODE-CORE-0.2.1</span>
                  <div className="w-[1px] h-4 bg-white/5" />
                  <span className="text-[10px] font-mono text-text-tertiary uppercase">UPTIME: 99.98%</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Target = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default SettingsPanel;
