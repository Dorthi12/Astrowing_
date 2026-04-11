import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WarpJump = ({ isStarting, onComplete }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (isStarting) {
      const newStars = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 0.8 + Math.random() * 0.4,
      }));
      setStars(newStars);
      
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setStars([]);
    }
  }, [isStarting, onComplete]);

  return (
    <AnimatePresence>
      {isStarting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden pointer-events-none"
        >
          {/* Stretch background */}
          <motion.div 
            initial={{ scaleY: 0.1, scaleX: 1, opacity: 0 }}
            animate={{ scaleY: 10, scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "circIn" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
          />

          {/* Star streaks */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ 
                x: `${star.x}vw`, 
                y: '-10vh', 
                height: '0vh',
                opacity: 0 
              }}
              animate={{ 
                y: '110vh', 
                height: '60vh',
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: star.duration, 
                delay: star.delay,
                ease: "expoIn" 
              }}
              className="absolute w-[2px] bg-white shadow-[0_0_10px_#fff]"
            />
          ))}

          {/* Center Boom */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 20, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-[0_0_100px_#fff] blur-2xl"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="text-white font-display font-black text-4xl tracking-[1em] uppercase italic"
            >
              Warping...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarpJump;
