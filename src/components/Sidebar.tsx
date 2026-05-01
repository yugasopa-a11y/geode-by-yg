import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Settings,
  Trash2,
  X,
  Clock,
  Pin,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { Conversation, Message } from '../types';
import { cn } from '../utils/cn';
import { GeodeLogo } from './HeroPage';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  pinnedMessages?: Message[];
}

const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  pinnedMessages = []
}: SidebarProps) => {
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const groups = {
    today: filteredConversations.filter(c => {
      const date = new Date(c.updatedAt);
      const today = new Date();
      return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    }),
    older: filteredConversations.filter(c => {
      const date = new Date(c.updatedAt);
      const today = new Date();
      return (date.getDate() !== today.getDate() || date.getMonth() !== today.getMonth()) && (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000);
    })
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
          opacity: isOpen ? 1 : 0
        }}
        drag="x"
        dragConstraints={{ left: -320, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) onClose();
        }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-full w-[320px] bg-surface-2 border-r border-white/5 z-[90] flex flex-col shadow-[40px_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
      >
        {/* Sidebar Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 group cursor-pointer">
               <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:shadow-[0_0_20px_rgba(212,184,138,0.2)] transition-all duration-700">
                  <GeodeLogo size={20} />
               </div>
               <div>
                  <h2 className="text-lg font-serif italic text-white tracking-tight">Geode Memory</h2>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Sector Protocol</p>
               </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-text-tertiary transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={onNew}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-accent text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-[0_20px_40px_rgba(212,184,138,0.2)]"
          >
            <div className="flex items-center gap-3">
               <Sparkles size={16} />
               <span>New Synthesis</span>
            </div>
            <div className="p-1 rounded-lg bg-black/10 text-[9px] font-bold">⌘N</div>
          </button>
        </div>

        {/* Search & Intelligence Memory */}
        <div className="px-8 py-4 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
           <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search Cognition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:ring-0 transition-all"
              />
           </div>

           {pinnedMessages.length > 0 && (
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <Pin size={12} className="text-accent/60" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Pinned Context</span>
                   </div>
                </div>
                <div className="space-y-2">
                   {pinnedMessages.map((m) => (
                     <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                        <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed group-hover:text-text-primary transition-colors italic">
                           "{m.content}"
                        </p>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Conversation Feed */}
           <div className="space-y-8">
              {Object.entries(groups).map(([name, items]) => items.length > 0 && (
                <div key={name} className="space-y-4">
                   <div className="flex items-center gap-3 px-2">
                      <Clock size={12} className="text-text-tertiary" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">{name}</span>
                   </div>
                   <div className="space-y-1">
                      {items.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => onSelect(conv.id)}
                          className={cn(
                            "group relative flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-500",
                            activeId === conv.id
                              ? "bg-white/5 border border-white/10 shadow-lg"
                              : "hover:bg-white/[0.02] border border-transparent hover:border-white/5"
                          )}
                        >
                           {activeId === conv.id && (
                             <motion.div
                               layoutId="active-indicator"
                               className="absolute left-0 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_rgba(212,184,138,0.5)]"
                             />
                           )}
                           <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                "text-sm truncate transition-colors duration-500",
                                activeId === conv.id ? "text-accent font-medium" : "text-text-secondary group-hover:text-text-primary"
                              )}>
                                {conv.title}
                              </h4>
                           </div>
                           <button
                             onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                             className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-text-tertiary hover:text-red-400 transition-all"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-8 border-t border-white/5 bg-black/20">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all cursor-pointer">
                    <Settings size={18} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Advanced Settings</span>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">System Overrides</span>
                 </div>
              </div>
              <button
                onClick={onToggleTheme}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 text-text-secondary transition-all"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
           </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
