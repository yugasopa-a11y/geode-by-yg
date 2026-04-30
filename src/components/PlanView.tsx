import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
  ChevronDown,
  ChevronRight,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Task, Subtask } from '../types';
import { GeodeLogo } from './HeroPage';
import { cn } from '../utils/cn';

interface PlanViewProps {
  tasks: Task[];
  title?: string;
  onClose?: () => void;
  depth: 'quick' | 'standard' | 'deep';
  onDepthChange: (depth: 'quick' | 'standard' | 'deep') => void;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={18} className="text-green-500" />;
    case 'in-progress': return <CircleDotDashed size={18} className="text-accent animate-spin-slow" />;
    case 'need-help': return <CircleAlert size={18} className="text-yellow-500" />;
    case 'failed': return <CircleX size={18} className="text-red-500" />;
    default: return <Circle size={18} className="text-text-secondary" />;
  }
};

const PlanView = ({ tasks, title = "Live Intelligence Plan", onClose, depth, onDepthChange }: PlanViewProps) => {
  const [expandedTasks, setExpandedTasks] = useState<string[]>(tasks.length > 0 ? [tasks[0].id] : []);

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      className="w-[360px] h-full flex flex-col bg-surface border-l border-border-color overflow-hidden z-40"
    >
      <div className="p-4 border-b border-border-color flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GeodeLogo size={20} />
            <h3 className="font-serif text-lg">{title}</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-text-secondary transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
          {(['quick', 'standard', 'deep'] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDepthChange(d)}
              className={cn(
                "flex-1 py-1.5 text-[9px] font-mono uppercase tracking-widest rounded-lg transition-all",
                depth === d ? "bg-accent text-black" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <LayoutGroup>
          <div className="space-y-4">
            {tasks.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">Awaiting Plan...</p>
               </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="glass-panel rounded-xl overflow-hidden border-white/5">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-start gap-3 p-4 hover:bg-white/2 transition-colors text-left"
                  >
                    <div className="mt-1">
                      <StatusIcon status={task.status} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-xs block mb-1">{task.title}</span>
                      <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>
                    <div className="mt-1">
                      {expandedTasks.includes(task.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedTasks.includes(task.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="relative pl-6 space-y-3">
                          <div className="absolute left-[9px] top-0 bottom-2 border-l border-dashed border-border-color" />

                          {task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="relative group">
                              <div className="absolute -left-[22px] top-2 w-3 h-[1px] bg-border-color" />
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn(
                                  "text-[10px] flex-1",
                                  subtask.status === 'completed' ? "text-text-secondary line-through" : "text-text-primary"
                                )}>
                                  {subtask.title}
                                </span>
                                <StatusIcon status={subtask.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </LayoutGroup>
      </div>

      <div className="p-4 border-t border-border-color bg-black/20">
         <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary mb-2">
            <span>Progress</span>
            <span>{Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}%</span>
         </div>
         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100}%` }}
            />
         </div>
      </div>
    </motion.div>
  );
};

export default PlanView;
