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
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {!isLaunched ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
          >
            <HeroPage onLaunch={handleLaunch} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
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
  );
}

export default App;
