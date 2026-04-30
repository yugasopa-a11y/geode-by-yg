import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, FileText, ChevronUp, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(prev => prev + (prev ? '\n' : '') + `File Content (${file.name}):\n${content}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onSend("Uploaded an image", base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-20">
      <div className="relative glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 focus-within:border-[#c9a96e]/40">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dfonotyfb/image/upload/v1775585556/grain_nz7z9q.png')] opacity-[0.03] pointer-events-none" />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 py-4 pr-12 text-text-primary placeholder-text-secondary min-h-[56px] max-h-[200px]"
        />

        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/2">
          <div className="flex gap-2">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <ImageIcon size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <FileText size={18} />
            </button>
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
              {input.length} CHR
            </span>
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                input.trim() && !disabled
                  ? "bg-[#c9a96e] text-black scale-100"
                  : "bg-white/5 text-text-secondary scale-95 opacity-50 cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
