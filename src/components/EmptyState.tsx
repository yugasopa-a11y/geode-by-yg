import React from 'react';
import { motion } from 'framer-motion';
import { GeodeLogo } from './HeroPage';
import {
  Search,
  Code,
  PenTool,
  LineChart,
  ListChecks,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface EmptyStateProps {
  onSuggest: (text: string) => void;
}

const promptCards = [
  { icon: Search, label: 'Research', text: 'Analyze the current state of room-temperature superconductors.' },
  { icon: Code, label: 'Code', text: 'Refactor this React component to use the new useActionState hook.' },
  { icon: PenTool, label: 'Creative', text: 'Write a cinematic opening for a sci-fi noir set in a flooded Tokyo.' },
  { icon: LineChart, label: 'Analysis', text: 'Explain the psychological impact of social media algorithms on teenagers.' },
  { icon: ListChecks, label: 'Planning', text: 'Create a 4-week training plan for a sub-2 hour half marathon.' },
  { icon: BookOpen, label: 'Learning', text: 'Teach me quantum entanglement using a simple library analogy.' }
];

const EmptyState = ({ onSuggest }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12 relative"
      >
        <div className="w-24 h-24 rounded-[32px] bg-accent/5 border border-accent/20 flex items-center justify-center shadow-[0_0_80px_rgba(201,169,110,0.1)] relative z-10">
          <GeodeLogo size={80} />
        </div>
        <div className="absolute inset-0 bg-accent/20 blur-[60px] -z-0 animate-pulse-slow" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-serif text-white mb-4 tracking-tight italic">
          Intelligence, crystallized.
        </h2>
        <p className="text-text-secondary font-mono text-[10px] tracking-[0.4em] uppercase">
          GEODE V2 • MULTI-MODAL ENGINE
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
        {promptCards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggest(card.text)}
            className="glass-panel group p-6 rounded-2xl text-left transition-all border-white/5 hover:border-accent/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 rounded-lg bg-white/5 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                    <card.icon size={16} />
                 </div>
                 <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">{card.label}</span>
              </div>
              <p className="text-sm text-text-primary/70 group-hover:text-white leading-relaxed transition-colors">
                {card.text}
              </p>
              <div className="mt-6 flex items-center gap-2 text-accent/0 group-hover:text-accent transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                 <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Launch Engine</span>
                 <Sparkles size={12} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
