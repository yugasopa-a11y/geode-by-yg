import React from 'react';
import { motion } from 'framer-motion';
import { GeodeLogo } from './HeroPage';
import { cn } from '../utils/cn';

interface EmptyStateProps {
  onSuggest: (text: string) => void;
}

const suggestions = [
  "Write me a short story",
  "Explain quantum computing",
  "Debug my React code",
  "Create an HTML landing page",
  "Summarize a topic",
  "Help me brainstorm ideas"
];

const EmptyState = ({ onSuggest }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-[#c9a96e]/5 border border-[#c9a96e]/20 flex items-center justify-center shadow-[0_0_50px_rgba(201,169,110,0.1)]">
          <GeodeLogo size={64} />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-serif text-white mb-2"
      >
        Geode by YG
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-text-secondary mb-12 font-mono text-sm tracking-widest uppercase"
      >
        Intelligence, crystallized.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
        {suggestions.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(201,169,110,0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggest(text)}
            className="glass-panel rounded-xl px-4 py-4 text-sm text-left text-[rgba(200,190,170,0.75)] hover:text-white transition-all group"
          >
            {text}
            <div className="mt-2 h-0.5 w-0 bg-[#c9a96e]/50 group-hover:w-full transition-all duration-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
