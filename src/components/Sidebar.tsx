import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Search,
  Pin,
  Clock,
  History,
  Zap,
  MoreVertical,
  Share2,
  Sun,
  Moon
} from 'lucide-react';
import { Conversation, Message } from '../types';
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
  pinnedMessages: Message[];
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
  pinnedMessages
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

    return { Today: today, Yesterday: yesterday, 'Last 7 Days': thisWeek, Older: older };
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-80 bg-surface-2 border-r border-white/5 z-[70] flex flex-col shadow-2xl"
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <GeodeLogo size={20} />
              </div>
              <h1 className="text-xl font-serif text-white tracking-tight">Geode <span className="text-accent text-xs font-mono ml-1">V2</span></h1>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/5 rounded-full text-text-secondary">
              <X size={20} />
            </button>
          </div>

          <button
            onClick={onNew}
            className="w-full flex items-center justify-between gap-2 bg-accent hover:bg-accent/90 text-black font-medium px-4 py-3 rounded-xl transition-all shadow-[0_0_30px_rgba(201,169,110,0.15)] group active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Plus size={18} />
              <span className="text-sm">New Intelligence</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center text-[10px] font-bold">⌘N</div>
          </button>

          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search memory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-8 custom-scrollbar">
          {pinnedMessages.length > 0 && (
            <div className="space-y-2">
               <h3 className="px-4 text-[10px] font-mono uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                 <Pin size={10} fill="currentColor" /> Pinned Context
               </h3>
               <div className="space-y-1">
                 {pinnedMessages.map(m => (
                    <div key={m.id} className="mx-2 p-3 rounded-xl bg-accent/5 border border-accent/10 text-[10px] text-text-secondary line-clamp-2">
                       {m.content}
                    </div>
                 ))}
               </div>
            </div>
          )}

          {Object.entries(groups).map(([name, items]) => items.length > 0 && (
            <div key={name} className="space-y-2">
              <h3 className="px-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                <History size={10} /> {name}
              </h3>
              <div className="space-y-1">
                {items.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => onSelect(c.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden",
                        activeId === c.id
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent"
                      )}
                    >
                      {activeId === c.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-accent rounded-full" />
                      )}
                      <MessageSquare size={16} className={cn("flex-shrink-0", activeId === c.id ? "text-accent" : "text-text-secondary")} />
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-xs font-medium truncate mb-0.5">{c.title}</div>
                        <div className="text-[10px] text-text-secondary/60 font-mono truncate">
                           {c.messages.length > 0 ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Empty'}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreVertical size={14} className="text-text-secondary" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 transition-all z-10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 mt-auto bg-black/20">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all flex-1 flex items-center justify-center gap-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-xs font-mono uppercase">V2 PRO</span>
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all group">
              <Share2 size={18} className="group-hover:text-accent" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
