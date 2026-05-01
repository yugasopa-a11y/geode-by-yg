import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Target,
  Zap,
  Box,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { Task, Subtask } from '../types';
import { cn } from '../utils/cn';

interface PlanViewProps {
  tasks: Task[];
  onClose: () => void;
  depth: 'quick' | 'standard' | 'deep';
  onDepthChange: (depth: 'quick' | 'standard' | 'deep') => void;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={18} className="text-accent" />;
    case 'in-progress': return <CircleDotDashed size={18} className="text-accent animate-spin" />;
    case 'need-help': return <CircleAlert size={18} className="text-amber-500" />;
    case 'failed': return <CircleX size={18} className="text-red-500" />;
    default: return <Circle size={18} className="text-text-tertiary" />;
  }
};

const PlanView = ({ tasks, onClose, depth, onDepthChange }: PlanViewProps) => {
  const [expandedTasks, setExpandedTasks] = useState<string[]>([tasks[0]?.id]);

  const toggleExpand = (id: string) => {
    setExpandedTasks(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ x: '100%', filter: 'blur(10px)' }}
      animate={{ x: 0, filter: 'blur(0px)' }}
      exit={{ x: '100%', filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
      className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-surface-2 border-l border-white/5 z-[60] flex flex-col shadow-[-40px_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
    >
      {/* Premium Header */}
      <div className="px-8 py-8 border-b border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Target size={20} className="text-accent" />
             </div>
             <div>
                <h3 className="text-lg font-serif italic text-white leading-none mb-1.5">Reasoning Matrix</h3>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">Operational Strategy</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-white/5 text-text-tertiary hover:text-text-secondary transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Depth Selector */}
        <div className="flex p-1.5 rounded-2xl bg-black/40 border border-white/5">
          {(['quick', 'standard', 'deep'] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDepthChange(d)}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all duration-500",
                depth === d ? "bg-accent text-black font-bold shadow-lg shadow-accent/20" : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Task Matrix */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="space-y-6">
          {tasks.map((task, i) => (
            <div key={task.id} className="relative">
              <motion.div
                layout
                className={cn(
                  "premium-card transition-all duration-500",
                  task.status === 'in-progress' && "border-accent/30 shadow-[0_0_30px_rgba(212,184,138,0.1)]"
                )}
              >
                <div
                  onClick={() => toggleExpand(task.id)}
                  className="flex items-center gap-5 p-6 cursor-pointer group"
                >
                   <StatusIcon status={task.status} />
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className={cn(
                           "text-sm font-medium transition-colors duration-500",
                           task.status === 'completed' ? "text-text-tertiary" : "text-white"
                         )}>
                           {task.title}
                         </h4>
                         <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                            Node {i + 1}
                         </span>
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-1 group-hover:text-text-secondary transition-colors">
                        {task.description}
                      </p>
                   </div>
                   {task.subtasks?.length > 0 && (
                     <ChevronDown
                       size={16}
                       className={cn(
                         "text-text-tertiary transition-transform duration-700",
                         expandedTasks.includes(task.id) && "rotate-180"
                       )}
                     />
                   )}
                </div>

                <AnimatePresence>
                  {expandedTasks.includes(task.id) && task.subtasks?.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
                      className="overflow-hidden bg-white/[0.02] border-t border-white/5"
                    >
                      <div className="p-6 space-y-4">
                        {task.subtasks.map((sub) => (
                          <div key={sub.id} className="flex items-start gap-4">
                             <div className="mt-1">
                                <StatusIcon status={sub.status} />
                             </div>
                             <div className="flex-1">
                                <p className={cn(
                                  "text-xs mb-1 font-medium",
                                  sub.status === 'completed' ? "text-text-tertiary line-through" : "text-white/80"
                                )}>
                                  {sub.title}
                                </p>
                                {sub.tools && sub.tools.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                     {sub.tools.map(tool => (
                                       <span key={tool} className="px-2 py-0.5 rounded-md bg-accent/5 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-widest">
                                          {tool}
                                       </span>
                                     ))}
                                  </div>
                                )}
                             </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Connector line between cards */}
              {i < tasks.length - 1 && (
                 <div className="absolute left-[33px] top-[76px] w-[1px] h-[24px] bg-gradient-to-b from-white/10 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="p-8 border-t border-white/5 bg-black/20">
         <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
               <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Efficiency</span>
               <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div
                       className="h-full bg-accent"
                       initial={{ width: 0 }}
                       animate={{ width: '85%' }}
                       transition={{ duration: 2, delay: 1 }}
                     />
                  </div>
                  <span className="text-xs font-mono text-accent">85%</span>
               </div>
            </div>
            <div className="space-y-1">
               <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Cognitive Load</span>
               <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div
                       className="h-full bg-white/40"
                       initial={{ width: 0 }}
                       animate={{ width: '42%' }}
                       transition={{ duration: 2, delay: 1.2 }}
                     />
                  </div>
                  <span className="text-xs font-mono text-text-secondary">42%</span>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default PlanView;
