import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Code,
  Sparkles,
  MessageSquare,
  Zap,
  Globe,
  Brain,
  Palette,
  Rocket
} from 'lucide-react';
import { GeodeLogo } from './HeroPage';

interface EmptyStateProps {
  onSuggest: (text: string) => void;
}

const EmptyState = ({ onSuggest }: EmptyStateProps) => {
  const suggestions = [
    { title: "Resynthesis", text: "Explain quantum computing using cinematic metaphors", icon: <Brain size={18} /> },
    { title: "Neural Logic", text: "Refactor this React component for maximum performance", icon: <Code size={18} /> },
    { title: "Synthesis", text: "Create a cinematic opening for a sci-fi noir set in Tokyo", icon: <Palette size={18} /> },
    { title: "Global Context", text: "What is the current state of global synthetic intelligence?", icon: <Globe size={18} /> },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.2, 0, 0.2, 1] } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-[32px] bg-accent/10 border border-accent/20 flex items-center justify-center mb-10 shadow-[0_40px_100px_rgba(212,184,138,0.2)]">
           <GeodeLogo size={48} />
        </div>
        <h1 className="text-display text-white mb-6 italic">Intelligence, crystallized.</h1>
        <p className="text-[12px] font-mono text-text-tertiary uppercase tracking-[0.5em]">Geode Synthesis • Multimodal Engine V2.0</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4"
      >
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            variants={item}
            onClick={() => onSuggest(s.text)}
            className="group premium-card p-8 cursor-pointer hover:bg-white/[0.03] transition-all duration-700"
          >
             <div className="flex items-center gap-5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-accent/60 group-hover:text-accent group-hover:border-accent/20 transition-all duration-700">
                   {s.icon}
                </div>
                <div>
                   <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-tertiary group-hover:text-text-secondary transition-colors">{s.title}</h3>
                   <div className="h-0.5 w-8 bg-accent/20 mt-1 group-hover:w-16 transition-all duration-700" />
                </div>
             </div>
             <p className="text-lg font-serif italic text-white/40 group-hover:text-white/90 leading-relaxed transition-all duration-700">
                "{s.text}"
             </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 2 }}
        className="mt-24 flex items-center gap-10"
      >
         <div className="flex items-center gap-3">
            <Rocket size={14} className="text-accent/60" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Zero Latency Synthesis</span>
         </div>
         <div className="w-[1px] h-4 bg-white/5" />
         <div className="flex items-center gap-3">
            <Zap size={14} className="text-accent/60" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">GPU-Accelerated Reasoning</span>
         </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;
