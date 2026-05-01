import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  Activity,
  Network,
  Radio,
  Unplug
} from 'lucide-react';
import { AgentState } from '../types';
import { cn } from '../utils/cn';

interface StatusBarProps {
  state: AgentState;
}

const StatusBar = ({ state }: StatusBarProps) => {
  const getStatusDetails = () => {
    switch (state) {
      case 'PLANNING':
        return {
          icon: <Network size={14} className="text-blue-400" />,
          text: 'Architecting Logical Pathways',
          color: 'bg-blue-400',
          code: 'PROC_INIT'
        };
      case 'SEARCHING':
        return {
          icon: <Globe size={14} className="text-amber-400" />,
          text: 'Infiltrating Web Context',
          color: 'bg-amber-400',
          code: 'NET_EXTRACT'
        };
      case 'STREAMING':
        return {
          icon: <Radio size={14} className="text-accent" />,
          text: 'Transmitting Synthetic Cognition',
          color: 'bg-accent',
          code: 'DATA_STREAM'
        };
      case 'TOOL USE':
        return {
          icon: <Cpu size={14} className="text-purple-400" />,
          text: 'Executing Sub-system Routine',
          color: 'bg-purple-400',
          code: 'SYS_EXEC'
        };
      default:
        return {
          icon: <ShieldCheck size={14} className="text-green-500" />,
          text: 'Core Systems Stable',
          color: 'bg-green-500',
          code: 'G_SYNC_IDLE'
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
       {state !== 'IDLE' && (
         <motion.div
           layoutId="status-bar"
           className={cn("h-full transition-all duration-1000", details.color)}
           initial={{ width: 0 }}
           animate={{ width: '100%' }}
           transition={{ duration: 15, ease: "linear" }}
         />
       )}

       <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-3xl">
                <div className="relative">
                   {details.icon}
                   {state !== 'IDLE' && (
                     <motion.div
                       className={cn("absolute -inset-1 rounded-full opacity-40 blur-sm", details.color)}
                       animate={{ opacity: [0.2, 0.6, 0.2] }}
                       transition={{ repeat: Infinity, duration: 2 }}
                     />
                   )}
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-white tracking-wide uppercase">{details.text}</span>
                </div>
             </div>

             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xl">
                <Activity size={10} className="text-text-tertiary" />
                <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">{details.code}</span>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-[0.2em]">Neural Load</span>
                <div className="flex gap-1 mt-1">
                   {[...Array(6)].map((_, i) => (
                     <div
                       key={i}
                       className={cn(
                         "w-2 h-1 rounded-full transition-all duration-500",
                         i < (state === 'IDLE' ? 1 : 4) ? "bg-accent/60 shadow-[0_0_8px_rgba(212,184,138,0.4)]" : "bg-white/5"
                       )}
                     />
                   ))}
                </div>
             </div>

             <div className="h-8 w-[1px] bg-white/5" />

             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-[0.2em]">Transmission Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full animate-pulse",
                     state === 'IDLE' ? "bg-green-500" : "bg-accent"
                   )} />
                   <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Live Link</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StatusBar;
