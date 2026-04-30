import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentState } from '../types';
import { cn } from '../utils/cn';

interface StatusBarProps {
  state: AgentState;
}

const StatusBar = ({ state }: StatusBarProps) => {
  const isIdle = state === 'IDLE';

  return (
    <AnimatePresence>
      {!isIdle && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 8, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] overflow-hidden status-bar-blur"
        >
          <div className="flex items-center justify-center h-full gap-4 px-4 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                state === 'STREAMING' ? "bg-accent animate-pulse" :
                state === 'TOOL USE' ? "bg-blue-400" :
                "bg-amber-500"
              )} />
              <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-accent/80 font-bold whitespace-nowrap">
                {state === 'STREAMING' ? '● STREAMING' :
                 state === 'TOOL USE' ? '◈ TOOL USE' :
                 '⟳ PLANNING'}
              </span>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-accent/30"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusBar;
