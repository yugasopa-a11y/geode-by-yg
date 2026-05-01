import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export const GeodeLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className || "text-accent"}
  >
    <path
      d="M12 2L3 9L12 22L21 9L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path
      d="M12 2L12 22"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M3 9L21 9"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

interface HeroPageProps {
  onLaunch: () => void;
}

const GoldenParticles = () => {
  const [particles] = useState(() => [...Array(40)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 15 + 15,
    delay: Math.random() * 10
  })));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent/30 blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const HeroPage = ({ onLaunch }: HeroPageProps) => {
  const words = "Intelligence, crystallized.".split(" ");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, window.innerWidth], [-30, 30]);
  const bgY = useTransform(mouseY, [0, window.innerHeight], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <GoldenParticles />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background via-transparent to-transparent opacity-40" />

      <motion.div
        className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        style={{ x: useTransform(bgX, v => v * 0.3), y: useTransform(bgY, v => v * 0.3) }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-white/10">
            <GeodeLogo size={16} />
            <span className="text-caption text-accent/80">
              Neural Engine V2
            </span>
          </div>
        </motion.div>

        <h1 className="text-display text-white mb-16 italic font-serif leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: i * 0.15 + 0.6,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
        >
          <button
            onClick={onLaunch}
            className="group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-accent transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

            <span className="relative z-10 flex items-center gap-4 text-black font-semibold text-lg tracking-tight">
               Launch Experience
               <motion.span
                 animate={{ x: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               >
                 →
               </motion.span>
            </span>
          </button>

          <p className="mt-8 text-caption opacity-40">
            Multimodal Intelligence • Synthetic Cognition
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-12 flex flex-col gap-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 2.5, duration: 1.5 }}
      >
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
           <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">System Active</span>
        </div>
        <div className="text-[10px] font-mono text-white/40 leading-relaxed">
           0x3F2A: SYNTHETIC NEURAL LINK<br />
           STABLE EMISSION: 120Hz
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 2.8, duration: 1.5 }}
      >
        <span className="text-caption text-white/60 mb-2 block">Crystallizing Knowledge</span>
        <div className="flex gap-1 justify-end">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="w-1.5 h-1.5 rounded-sm bg-accent/40"
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
             />
           ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPage;
