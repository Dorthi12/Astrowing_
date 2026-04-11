import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DepartureRow = ({ flight }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className="grid grid-cols-5 md:grid-cols-6 gap-4 py-4 border-b border-white/5 text-sm md:text-base items-center hover:bg-white/5 transition-colors px-4"
    >
      <div className="font-mono text-neon-cyan">{flight.flightId}</div>
      <div className="col-span-2 font-display font-medium text-white truncate">{flight.destination}</div>
      <div className="hidden md:block text-gray-400">{flight.time}</div>
      <div className="font-mono">{flight.gate}</div>
      <div className={`text-right font-medium uppercase tracking-wider text-xs md:text-sm ${
        flight.status === 'BOARDING' ? 'text-green-400 animate-pulse' :
        flight.status === 'DELAYED' ? 'text-red-400' :
        flight.status === 'DEPARTED' ? 'text-gray-500' : 'text-neon-purple'
      }`}>
        {flight.status}
      </div>
    </motion.div>
  );
};

export default DepartureRow;
