import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Search,
  Clock,
  Calendar,
  Layers,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { Conversation } from '../types';
import { GeodeLogo } from './HeroPage';
import { cn } from '../utils/cn';

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
  onToggleTheme
}: SidebarProps) => {
  const [search, setSearch] = React.useState('');

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupConversations = () => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const thisWeek: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayDate = todayDate - 86400000;
    const thisWeekDate = todayDate - 86400000 * 7;

    filteredConversations.sort((a, b) => b.updatedAt - a.updatedAt).forEach(c => {
      if (c.updatedAt >= todayDate) today.push(c);
      else if (c.updatedAt >= yesterdayDate) yesterday.push(c);
      else if (c.updatedAt >= thisWeekDate) thisWeek.push(c);
      else older.push(c);
    });

    return { today, yesterday, thisWeek, older };
  };

  const groups = groupConversations();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        drag="x"
        dragConstraints={{ left: -288, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) onClose();
        }}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-surface-2 border-r border-white/5 z-50 flex flex-col shadow-2xl"
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GeodeLogo size={24} />
              <h1 className="text-xl font-serif text-white">Geode</h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/5 rounded-full text-text-secondary"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={onNew}
            className="w-full flex items-center justify-center gap-2 bg-[#c9a96e] hover:bg-[#b8985d] text-black font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(201,169,110,0.2)] active:scale-95"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
          {Object.entries(groups).map(([name, items]) => items.length > 0 && (
            <div key={name} className="space-y-1">
              <h3 className="px-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary mb-2">
                {name === 'thisWeek' ? 'This Week' : name}
              </h3>
              {items.map((c) => (
                <div key={c.id} className="relative group">
                  <button
                    onClick={() => onSelect(c.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group",
                      activeId === c.id
                        ? "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    {activeId !== c.id && (
                      <motion.div
                        className="absolute inset-0 bg-[#c9a96e]/5 -z-10"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ transformOrigin: 'left' }}
                      />
                    )}
                    <MessageSquare size={16} className={activeId === c.id ? "text-[#c9a96e]" : "text-text-secondary"} />
                    <span className="text-sm truncate pr-6">{c.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all flex-1 flex items-center justify-center gap-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-xs">{isDark ? 'Light' : 'Dark'}</span>
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all">
              <Settings size={18} />
            </button>
          </div>
          <div className="mt-4 px-2 text-[10px] text-text-secondary font-mono flex items-center justify-between">
            <span>v1.0.0</span>
            <span>GEODE AI</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
