import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RotateCcw, User } from 'lucide-react';
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
        "flex w-full mb-8",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%]",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 mt-1",
          isAssistant ? "mr-4" : "ml-4"
        )}>
          {isAssistant ? (
            <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
              <GeodeLogo size={16} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <User size={16} className="text-white/70" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className={cn(
            "p-4 rounded-2xl relative group",
            isAssistant
              ? "backdrop-blur-xl bg-white/3 border border-white/7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-tl-none"
              : "bg-[#c9a96e]/10 border border-[#c9a96e]/20 rounded-tr-none"
          )}>
            <MarkdownRenderer content={message.content} />

            <div className={cn(
              "absolute -bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
              isAssistant ? "left-0" : "right-0"
            )}>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 text-[10px]"
              >
                {copied ? <Check size={12} className="text-[#c9a96e]" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              {isAssistant && isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 text-[10px]"
                >
                  <RotateCcw size={12} />
                  Regenerate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
