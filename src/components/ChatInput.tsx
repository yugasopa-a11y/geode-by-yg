import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, FileText, Mic, X, Terminal } from 'lucide-react';
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
      rec.continuous = false; // Set to false to stop automatically after a sentence, or true for long dictation
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

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

  const toggleRecording = () => {
    if (!recognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition start failed", err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-24 z-20">
      <div className={cn(
        "relative glass-panel rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500",
        "focus-within:border-accent/40 focus-within:shadow-[0_0_80px_rgba(201,169,110,0.1)]",
        isRecording && "border-accent animate-pulse shadow-[0_0_40px_rgba(201,169,110,0.2)]"
      )}>
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dfonotyfb/image/upload/v1775585556/grain_nz7z9q.png')] opacity-[0.03] pointer-events-none" />

        {isRecording && (
          <div className="absolute inset-0 bg-accent/5 flex items-center justify-center gap-1 pointer-events-none">
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={i}
                 className="w-1 bg-accent/50 rounded-full"
                 animate={{ height: [8, 24, 12, 32, 8] }}
                 transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
               />
             ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Geode anything..."
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent border-none focus:ring-0 resize-none px-6 py-6 pr-16 text-text-primary placeholder:text-text-secondary/50 min-h-[72px] max-h-[300px] text-base leading-relaxed"
        />

        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex gap-4">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-all"
            >
              <ImageIcon size={18} />
              <span className="text-[10px] font-mono uppercase tracking-widest hidden md:block">Vision</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2 text-text-secondary hover:text-accent transition-all"
            >
              <FileText size={18} />
              <span className="text-[10px] font-mono uppercase tracking-widest hidden md:block">Data</span>
            </button>
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.pdf" onChange={handleFileChange} />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleRecording}
              className={cn(
                "p-2 rounded-xl transition-all",
                isRecording ? "text-accent bg-accent/10" : "text-text-secondary hover:text-text-primary"
              )}
              title="Voice Input"
            >
              <Mic size={18} />
            </button>
            <div className="h-6 w-[1px] bg-white/10" />
            <span className="text-[9px] font-mono text-text-secondary/50 uppercase">
              {input.length} <span className="hidden md:inline">Chars</span>
            </span>
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className={cn(
                "p-3 rounded-2xl transition-all duration-300 transform",
                input.trim() && !disabled
                  ? "bg-accent text-black scale-100 shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                  : "bg-white/5 text-text-secondary scale-95 opacity-50 cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-6">
         <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Enter</kbd> to Send
         </div>
         <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Shift</kbd> New Line
         </div>
         <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">⌘K</kbd> Command Palette
         </div>
      </div>
    </div>
  );
};

export default ChatInput;
