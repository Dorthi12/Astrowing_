import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, Sparkles } from 'lucide-react';

const PlanetCard = ({ planet }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-panel group overflow-hidden relative border hover:border-neon-cyan/50 transition-all duration-300 shadow-2xl"
    >
      {/* Smart Tooltip Overlay on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none translate-y-2 group-hover:translate-y-0">
        <div className="bg-black/90 border border-neon-cyan/30 rounded p-2 shadow-2xl backdrop-blur-md flex items-center gap-2">
            <Info size={12} className="text-neon-cyan" />
            <span className="text-[10px] text-white font-mono uppercase tracking-widest">{planet.type} sector</span>
        </div>
      </div>

      <div className="w-full h-40 relative overflow-hidden">
        {planet.image ? (
            <img src={planet.image} alt={planet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
            <div className={`w-full h-full bg-gradient-to-br ${planet.color}`}></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent"></div>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${planet.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}></div>
      </div>
      
      <div className="p-6 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors">{planet.name}</h3>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-mono italic">{planet.galaxy}</span>
          </div>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${planet.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden relative group-hover:rotate-[360deg] transition-transform duration-1000`}>
              {planet.image && <img src={planet.image} className="w-full h-full object-cover mix-blend-screen opacity-80" />}
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-6 h-10 line-clamp-2">
          {planet.shortDesc}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-y border-white/5 py-4">
          <div>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-1">Risk Index</span>
            <span className={`text-xs font-mono ${planet.risks?.Overall > 60 ? 'text-red-400' : 'text-green-400'}`}>
                {planet.risks?.Overall || 50}%
            </span>
          </div>
          <div>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-1">Time Flow</span>
            <span className="text-[10px] text-gray-300 truncate">Dilated</span>
          </div>
          <div>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-1">Distance</span>
            <span className="text-[10px] text-gray-300 font-mono">{(planet.distance ?? 0) === 0 ? '0' : (planet.distance || 0).toLocaleString()} LY</span>
          </div>
          <div>
            <span className="block text-[8px] text-gray-500 uppercase font-bold mb-1">Base Fare</span>
            <span className="text-neon-purple font-mono font-bold">
              {(planet.price ?? 0) === 0 ? 'FREE' : `₡${(planet.price || 0).toLocaleString()}`}
            </span>
          </div>
        </div>
        
        <div className="w-full block text-center py-2.5 text-xs font-bold uppercase tracking-[0.2em] bg-white/5 group-hover:bg-neon-cyan group-hover:text-black border border-white/10 group-hover:border-transparent rounded-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          Initiate Manifest
        </div>
      </div>
    </motion.div>
  );
};

export default PlanetCard;
