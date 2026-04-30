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
  X
} from 'lucide-react';
import { Task, Subtask } from '../types';
import { GeodeLogo } from './HeroPage';
import { cn } from '../utils/cn';

interface PlanViewProps {
  tasks: Task[];
  title?: string;
  onClose?: () => void;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={18} className="text-green-500" />;
    case 'in-progress': return <CircleDotDashed size={18} className="text-blue-500 animate-spin-slow" />;
    case 'need-help': return <CircleAlert size={18} className="text-yellow-500" />;
    case 'failed': return <CircleX size={18} className="text-red-500" />;
    default: return <Circle size={18} className="text-text-secondary" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'completed': 'bg-green-900/30 text-green-300 border-green-800/50',
    'in-progress': 'bg-blue-900/30 text-blue-300 border-blue-800/50',
    'need-help': 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50',
    'failed': 'bg-red-900/30 text-red-300 border-red-800/50',
    'pending': 'bg-white/5 text-text-secondary border-white/10',
  };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", styles[status] || styles.pending)}>
      {status.replace('-', ' ')}
    </span>
  );
};

const PlanView = ({ tasks, title = "Working on it...", onClose }: PlanViewProps) => {
  const [expandedTasks, setExpandedTasks] = useState<string[]>(tasks.length > 0 ? [tasks[0].id] : []);
  const [expandedSubtasks, setExpandedSubtasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleSubtask = (id: string) => {
    setExpandedSubtasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[360px] h-full flex flex-col bg-surface border-l border-border-color overflow-hidden"
    >
      <div className="p-4 border-b border-border-color flex items-center justify-between">
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

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <LayoutGroup>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-white/2 transition-colors text-left"
                >
                  <div className="mt-1">
                    <StatusIcon status={task.status} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{task.title}</span>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-1">{task.description}</p>
                  </div>
                  <div className="mt-1">
                    {expandedTasks.includes(task.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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
                        <div className="absolute left-[9px] top-0 bottom-2 border-l-2 border-dashed border-border-color" />

                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="relative">
                            <div className="absolute -left-[22px] top-2 w-3 h-0.5 bg-border-color" />
                            <button
                              onClick={() => toggleSubtask(subtask.id)}
                              className="w-full text-left group"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                  "text-xs font-medium",
                                  subtask.status === 'completed' ? "text-text-secondary line-through" : "text-text-primary"
                                )}>
                                  {subtask.title}
                                </span>
                                <StatusIcon status={subtask.status} />
                              </div>

                              <AnimatePresence>
                                {expandedSubtasks.includes(subtask.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-[10px] text-text-secondary mb-2 pr-2">{subtask.description}</p>
                                    {subtask.tools && subtask.tools.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {subtask.tools.map(tool => (
                                          <span key={tool} className="text-[9px] px-1.5 py-0.5 rounded bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20 font-mono">
                                            {tool}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </motion.div>
  );
};

export default PlanView;
