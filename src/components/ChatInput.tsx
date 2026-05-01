import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, FileText, Mic, X, Terminal, Sparkles, Plus, Command } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript);
      };

      rec.onend = () => setIsRecording(false);
      setRecognition(rec);
    }
  }, []);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
      setInput(prev => prev + (prev ? '\n' : '') + `[Document: ${file.name}]\n${content}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onSend("Uploaded an image", event.target?.result as string);
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

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-20 relative z-40">
      <motion.div
        layout
        className={cn(
          "relative liquid-glass rounded-[32px] overflow-hidden transition-all duration-700",
          "hover:border-white/20 hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)]",
          isRecording && "border-accent/40 shadow-[0_0_80px_rgba(212,184,138,0.2)]"
        )}
      >
        <div className="flex flex-col">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Deep intelligence awaits..."
              rows={1}
              disabled={disabled}
              className="w-full bg-transparent border-none focus:ring-0 resize-none px-8 pt-8 pb-4 text-text-primary placeholder:text-text-tertiary min-h-[80px] max-h-[300px] text-lg leading-relaxed custom-scrollbar"
            />

            {/* Pulsing Visualizer when recording */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-8 flex items-center gap-1.5"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-accent/60 rounded-full"
                      animate={{ height: [4, 16, 8, 20, 4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/5 backdrop-blur-3xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-2.5 rounded-2xl hover:bg-white/5 text-text-secondary hover:text-accent transition-all duration-300"
                title="Vision"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-2xl hover:bg-white/5 text-text-secondary hover:text-accent transition-all duration-300"
                title="Context Data"
              >
                <FileText size={20} />
              </button>
              <button
                onClick={toggleRecording}
                className={cn(
                  "p-2.5 rounded-2xl transition-all duration-500",
                  isRecording ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
                title="Voice Link"
              >
                <Mic size={20} />
              </button>

              <div className="w-[1px] h-6 bg-white/5 mx-1" />

              <button className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-white/5 text-text-tertiary hover:text-text-secondary transition-all duration-300">
                 <Sparkles size={16} className="text-accent/60" />
                 <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Intelligence Mode</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:block text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">
                {input.length} Tokens
              </span>

              <button
                onClick={handleSend}
                disabled={!input.trim() || disabled}
                className={cn(
                  "group relative p-4 rounded-2xl transition-all duration-500 transform active:scale-95",
                  input.trim() && !disabled
                    ? "bg-accent text-black shadow-[0_20px_40px_rgba(212,184,138,0.2)]"
                    : "bg-white/5 text-text-tertiary opacity-40 cursor-not-allowed"
                )}
              >
                <Send size={20} className={cn("transition-transform duration-500", input.trim() && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
      <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.pdf" onChange={handleFileChange} />

      <div className="mt-6 flex justify-center gap-10">
         <div className="flex items-center gap-3 group cursor-help">
            <div className="p-1.5 rounded-lg border border-white/5 bg-white/5 group-hover:border-accent/20 transition-all">
               <Command size={10} className="text-text-tertiary" />
            </div>
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">Command Palette</span>
         </div>
         <div className="flex items-center gap-3 group cursor-help">
            <div className="px-2 py-1.5 rounded-lg border border-white/5 bg-white/5 group-hover:border-accent/20 transition-all text-[8px] font-bold text-text-tertiary">
               SHIFT ↵
            </div>
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">New Thread</span>
         </div>
      </div>
    </div>
  );
};

export default ChatInput;
