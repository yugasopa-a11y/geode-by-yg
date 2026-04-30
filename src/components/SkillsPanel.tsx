import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Search, Code, Image, FileText, GitBranch, Check } from 'lucide-react';
import { SKILLS } from '../SKILLS';
import { cn } from '../utils/cn';

interface SkillsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  enabledTools: string[];
  onToggleTool: (id: string) => void;
}

const iconMap: any = {
  Search,
  Code,
  Image,
  FileText,
  GitBranch
};

const SkillsPanel = ({ isOpen, onClose, enabledTools, onToggleTool }: SkillsPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-surface-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-accent">
                <Zap size={20} fill="currentColor" />
                <h2 className="text-xl font-serif">Skill Registry</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-secondary">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {SKILLS.map((skill) => {
                const Icon = iconMap[skill.icon];
                const isEnabled = enabledTools.includes(skill.id);

                return (
                  <button
                    key={skill.id}
                    onClick={() => onToggleTool(skill.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border transition-all text-left group",
                      isEnabled
                        ? "bg-accent/5 border-accent/20 shadow-[inset_0_0_20px_rgba(201,169,110,0.05)]"
                        : "bg-white/2 border-white/5 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-lg flex items-center justify-center transition-colors",
                      isEnabled ? "bg-accent/10 text-accent" : "bg-white/5 text-text-secondary"
                    )}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-text-primary">{skill.name}</span>
                        {isEnabled && <Check size={14} className="text-accent" />}
                      </div>
                      <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-2">
                        {skill.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                         <div className={cn(
                           "w-12 h-1.5 rounded-full overflow-hidden bg-white/5",
                         )}>
                            <div className="h-full bg-accent" style={{ width: isEnabled ? '100%' : '0%' }} />
                         </div>
                         <span className="text-[8px] font-mono text-text-secondary uppercase">
                           {isEnabled ? 'Enabled' : 'Disabled'}
                         </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-white/2 text-center">
               <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">
                 Select skills to expand Geode's cognitive capabilities.
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SkillsPanel;
