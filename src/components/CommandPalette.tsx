import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import {
  Search,
  MessageSquare,
  Sparkles,
  Settings,
  Trash2,
  Zap,
  Globe,
  Brain,
  Code,
  Palette,
  Layout,
  PanelRight,
  Database,
  Shield,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string) => void;
}

const CommandPalette = ({ isOpen, onClose, onSelect }: CommandPaletteProps) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSelect('toggle');
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onSelect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[640px] relative z-[501]"
          >
            <Command label="Intelligence Actions" className="premium-command-root">
              <div className="flex items-center px-6 py-4 border-b border-white/5">
                <Search size={20} className="text-text-tertiary mr-4" />
                <Command.Input placeholder="Initiate cognitive command..." className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-text-tertiary outline-none" />
                <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-text-tertiary">ESC</div>
              </div>

              <Command.List className="p-2 overflow-y-auto max-h-[450px] custom-scrollbar">
                <Command.Empty className="p-8 text-center text-sm text-text-tertiary italic">
                  No matching neural pathways found.
                </Command.Empty>

                <Command.Group heading="Core Protocols">
                  <Command.Item onSelect={() => { onSelect('new-chat'); onClose(); }} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles size={16} className="mr-4 text-accent" />
                      <span>New Intelligence Synthesis</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-40">⌘N</span>
                  </Command.Item>
                  <Command.Item onSelect={() => { onSelect('settings'); onClose(); }} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings size={16} className="mr-4" />
                      <span>System Parameters</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-40">⌘,</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Intelligence Tools">
                  <Command.Item onSelect={() => { onSelect('skills'); onClose(); }}>
                    <Zap size={16} className="mr-4 text-amber-400" />
                    <span>Neural Skills Registry</span>
                  </Command.Item>
                  <Command.Item onSelect={() => { onSelect('plan'); onClose(); }}>
                    <Brain size={16} className="mr-4 text-purple-400" />
                    <span>View Reasoning Matrix</span>
                  </Command.Item>
                  <Command.Item onSelect={() => { onSelect('artifacts'); onClose(); }}>
                    <Layout size={16} className="mr-4 text-blue-400" />
                    <span>Toggle Workspace Panel</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Memory Management">
                  <Command.Item onSelect={() => { onSelect('search-memory'); onClose(); }}>
                    <Database size={16} className="mr-4" />
                    <span>Deep Memory Search</span>
                  </Command.Item>
                  <Command.Item onSelect={() => { onSelect('clear'); onClose(); }} className="text-red-400">
                    <Trash2 size={16} className="mr-4" />
                    <span>Purge Cognitive Sector</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="System Status">
                   <div className="px-4 py-3 flex items-center justify-between border-t border-white/5 mt-2">
                      <div className="flex items-center gap-3">
                         <Shield size={14} className="text-green-500/60" />
                         <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Cognition Stable</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Cpu size={14} className="text-accent/60" />
                         <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">12.4 TFLOPS</span>
                      </div>
                   </div>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
