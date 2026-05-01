import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  RotateCcw,
  Share2,
  MoreHorizontal,
  Bookmark,
  Sparkles,
  Command,
  PanelRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { Message } from '../types';
import { cn } from '../utils/cn';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
}

const ChatMessage = ({ message, isLast, onRegenerate }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
      className={cn(
        "group relative flex flex-col mb-16 max-w-4xl mx-auto w-full",
        isAssistant ? "items-start" : "items-end"
      )}
    >
      {/* Role Header */}
      <div className={cn(
        "flex items-center gap-4 mb-4 px-2",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-700",
          isAssistant
            ? "bg-accent/10 border-accent/30 text-accent group-hover:shadow-[0_0_20px_rgba(212,184,138,0.2)]"
            : "bg-white/5 border-white/10 text-text-secondary"
        )}>
          {isAssistant ? <Cpu size={16} /> : <div className="text-[10px] font-bold">YG</div>}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-tertiary">
          {isAssistant ? "Geode Synthesis" : "Protocol User"}
        </span>
        {isAssistant && (
           <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/5 border border-accent/10">
              <ShieldCheck size={10} className="text-accent/60" />
              <span className="text-[8px] font-mono text-accent/60 font-bold">VERIFIED COGNITION</span>
           </div>
        )}
      </div>

      {/* Message Bubble */}
      <div className={cn(
        "relative max-w-[90%] md:max-w-[85%] transition-all duration-700",
        isAssistant
          ? "rounded-[32px] rounded-tl-none glass-panel p-8"
          : "rounded-[32px] rounded-tr-none bg-surface border border-white/5 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-[32px]" />

        <div className="relative z-10">
          {message.content.includes('![Image]') ? (
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                 <img
                   src={message.content.match(/\((.*?)\)/)?.[1]}
                   alt="Telemetry View"
                   className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-1000"
                 />
              </div>
              <div className="px-2">
                <MarkdownRenderer content={message.content.split('![Image]')[0]} />
              </div>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>

      {/* Action Bar */}
      <AnimatePresence>
        {(isAssistant || isLast) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-3 mt-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              isAssistant ? "flex-row" : "flex-row-reverse"
            )}
          >
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all"
              title="Duplicate Segment"
            >
              {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
            </button>

            {isAssistant && (
              <>
                <button
                  onClick={onRegenerate}
                  className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all"
                  title="Resynthesize"
                >
                  <RotateCcw size={14} />
                </button>
                <div className="w-[1px] h-4 bg-white/5 mx-1" />
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all">
                  <Bookmark size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Library</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all">
                  <Share2 size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Transmit</span>
                </button>
              </>
            )}

            {!isAssistant && (
               <button className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-tertiary hover:text-text-secondary transition-all">
                  <MoreHorizontal size={14} />
               </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatMessage;
