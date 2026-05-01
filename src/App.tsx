import React, { useState, useEffect } from 'react';
import HeroPage from './components/HeroPage';
import ChatView from './components/ChatView';
import GrainOverlay from './components/GrainOverlay';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isLaunched, setIsLaunched] = useState(() => {
    return localStorage.getItem('geode-launched') === 'true';
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('geode-dark');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('geode-dark', isDark.toString());
  }, [isDark]);

  const handleLaunch = () => {
    setIsLaunched(true);
    localStorage.setItem('geode-launched', 'true');
  };

  const handleGoHome = () => {
    setIsLaunched(false);
    localStorage.removeItem('geode-launched');
  };

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Background Cinematic Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 scale-[1.05]"
      >
        <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Overlays */}
      <div className="ambient-fog z-[1]" />
      <div className="cloud-overlay z-[2]" />
      <GrainOverlay />

      <div className="relative z-[10] h-full w-full">
        <AnimatePresence mode="wait">
          {!isLaunched ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
              transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
            >
              <HeroPage onLaunch={handleLaunch} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
              className="h-screen w-full"
            >
              <ChatView
                isDark={isDark}
                onToggleTheme={() => setIsDark(!isDark)}
                onGoHome={handleGoHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
