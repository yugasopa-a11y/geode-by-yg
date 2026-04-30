import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export const GeodeLogo = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#c9a96e]"
  >
    <path
      d="M12 2L3 9L12 22L21 9L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 2L12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 9L21 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface HeroPageProps {
  onLaunch: () => void;
}

const GoldenParticles = () => {
  const [particles] = useState(() => [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 10
  })));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent opacity-20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const HeroPage = ({ onLaunch }: HeroPageProps) => {
  const words = "Intelligence, unbound".split(" ");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const bgY = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
         <motion.div
           className="absolute top-0 left-0 w-full h-full opacity-30"
           animate={{
             background: [
               'radial-gradient(circle at 0% 0%, #c9a96e22 0%, transparent 50%), radial-gradient(circle at 100% 100%, #8B5A0022 0%, transparent 50%)',
               'radial-gradient(circle at 100% 0%, #c9a96e22 0%, transparent 50%), radial-gradient(circle at 0% 100%, #8B5A0022 0%, transparent 50%)',
               'radial-gradient(circle at 0% 0%, #c9a96e22 0%, transparent 50%), radial-gradient(circle at 100% 100%, #8B5A0022 0%, transparent 50%)',
             ]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
         />
      </div>

      <GoldenParticles />

      <motion.div
        className="absolute inset-0 w-full h-full z-10 scale-105"
        style={{ x: bgX, y: bgY }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[15]" />

      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono tracking-[0.3em] uppercase">
            GEODE ENGINE • V2.0 PRO
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-[120px] font-serif text-white mb-12 tracking-tighter leading-none italic">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: i * 0.2 + 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-6 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(201,169,110,0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunch}
          className="liquid-glass px-12 py-5 rounded-full text-white font-medium text-xl relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-3">
             Initiate Link <span className="text-accent">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-mono tracking-[0.5em] flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20" />
        GEODE • AI BY YG • 2024
      </motion.div>

      {/* Ripped Paper Texture Overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 ripped-edge-top z-30 opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 ripped-edge-bottom z-30 opacity-40 pointer-events-none" />
    </div>
  );
};

export default HeroPage;
