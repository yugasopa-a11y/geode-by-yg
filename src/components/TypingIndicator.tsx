import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex space-x-1 p-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            delay: i * 0.15,
            repeatType: 'reverse',
          }}
          className="w-1.5 h-1.5 bg-[#c9a96e] rounded-full"
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
