import React from 'react';
import { motion } from 'framer-motion';

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

const HeroPage = ({ onLaunch }: HeroPageProps) => {
  const words = "Intelligence, unbound".split(" ");

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/55 z-10" />

      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[#c9a96e] text-xs font-mono tracking-widest uppercase">
            AI-FIRST
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-serif text-white mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="inline-block mr-4 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunch}
          className="liquid-glass px-8 py-4 rounded-full text-white font-medium text-lg relative overflow-hidden group"
        >
          <span className="relative z-10">Launch App →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        GEODE BY YG • 2024
      </motion.div>
    </div>
  );
};

export default HeroPage;
