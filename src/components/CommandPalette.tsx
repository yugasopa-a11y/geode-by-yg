import React from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Sun,
  Moon,
  Zap,
  Settings,
  ListChecks,
  Download,
  Share2,
  Trash2
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: string) => void;
}

const CommandPalette = ({ isOpen, onClose, onSelect }: CommandPaletteProps) => {
  React.useEffect(() => {
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
        <div className="fixed inset-0 z-[200] p-4 pt-[15vh] flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-[640px] h-fit"
          >
            <Command label="Command Palette">
              <div className="flex items-center border-b border-white/5 px-4">
                <Search className="w-5 h-5 text-text-secondary" />
                <Command.Input placeholder="Type a command or search..." />
              </div>
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading="General">
                  <Command.Item onSelect={() => onSelect('new-chat')}>
                    <Plus className="w-4 h-4" />
                    <span>New Chat</span>
                  </Command.Item>
                  <Command.Item onSelect={() => onSelect('toggle-theme')}>
                    <Sun className="w-4 h-4" />
                    <span>Toggle Theme</span>
                  </Command.Item>
                  <Command.Item onSelect={() => onSelect('settings')}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Tools & AI">
                  <Command.Item onSelect={() => onSelect('skills')}>
                    <Zap className="w-4 h-4" />
                    <span>Skills Panel</span>
                  </Command.Item>
                  <Command.Item onSelect={() => onSelect('plan')}>
                    <ListChecks className="w-4 h-4" />
                    <span>Toggle Plan View</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Conversation">
                  <Command.Item onSelect={() => onSelect('export-md')}>
                    <Download className="w-4 h-4" />
                    <span>Export as Markdown</span>
                  </Command.Item>
                  <Command.Item onSelect={() => onSelect('share')}>
                    <Share2 className="w-4 h-4" />
                    <span>Share Conversation</span>
                  </Command.Item>
                  <Command.Item onSelect={() => onSelect('clear')}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Clear Current Chat</span>
                  </Command.Item>
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
