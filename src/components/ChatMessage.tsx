import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RotateCcw, User, Pin, Share2, Edit2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { GeodeLogo } from './HeroPage';
import { cn } from '../utils/cn';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  isLast?: boolean;
}

const ChatMessage = ({ message, onRegenerate, isLast }: ChatMessageProps) => {
  const [copied, setCopied] = React.useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout="position"
      layoutId={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex w-full mb-10 group/msg",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[90%] md:max-w-[80%]",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 mt-2",
          isAssistant ? "mr-6" : "ml-6"
        )}>
          {isAssistant ? (
            <div className="w-10 h-10 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center relative group-hover/msg:shadow-[0_0_20px_rgba(201,169,110,0.15)] transition-all duration-500">
              <GeodeLogo size={20} />
              {isLast && (
                 <div className="absolute inset-0 rounded-2xl border border-accent/40 animate-ping opacity-20" />
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <User size={20} className="text-white/40" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <div className={cn(
            "p-6 rounded-3xl relative transition-all duration-500",
            isAssistant
              ? "backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] rounded-tl-none group-hover/msg:bg-white/[0.04]"
              : "bg-accent/10 border border-accent/20 rounded-tr-none shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          )}>
            <div className="markdown-content">
               {isAssistant && message.id === 'streaming' ? (
                  message.content.split('').map((char, i) => (
                    <span key={i} className="char-fade" style={{ animationDelay: `${i * 10}ms` }}>
                       {char}
                    </span>
                  ))
               ) : (
                 <MarkdownRenderer content={message.content} />
               )}
            </div>

            {isAssistant && message.id !== 'streaming' && (
              <div className={cn(
                "absolute -bottom-8 flex gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/msg:translate-y-0",
                isAssistant ? "left-2" : "right-2"
              )}>
                <div className="flex bg-surface-2 border border-white/5 rounded-xl p-1 gap-1 shadow-2xl">
                   <button onClick={handleCopy} className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                   </button>
                   <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors">
                      <Pin size={14} />
                   </button>
                   <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors">
                      <Share2 size={14} />
                   </button>
                   <div className="w-[1px] h-4 bg-white/10 my-auto mx-1" />
                   {isLast && onRegenerate && (
                      <button onClick={onRegenerate} className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors">
                         <RotateCcw size={14} />
                      </button>
                   )}
                   <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors">
                      <ThumbsUp size={14} />
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "text-[9px] font-mono text-text-secondary/30 uppercase tracking-widest px-2 opacity-0 group-hover/msg:opacity-100 transition-opacity",
            !isAssistant && "text-right"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
