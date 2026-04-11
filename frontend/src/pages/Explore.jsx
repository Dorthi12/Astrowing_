import React, { useState, useMemo } from 'react';
import planetsData from '../data/planets.json';
import PlanetCard from '../components/planet/PlanetCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Sparkles, Lock, Trophy } from 'lucide-react';

const Explore = () => {
  const { currentUser, unlockPlanet } = useAppContext();
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Terrestrial', 'Terraformed', 'Super-Earth', 'Oceanic', 'Volcanic', 'Ice'];
  
  const filteredPlanets = useMemo(() => {
    return filter === 'All' 
        ? planetsData.planets 
        : planetsData.planets.filter(p => p.type === filter);
  }, [filter]);

  // AI DECISION ENGINE: Recommend the best planet based on DNA
  const recommendation = useMemo(() => {
    if (!currentUser?.dna) return null;
    const items = planetsData.planets.filter(p => currentUser.unlockedPlanets?.includes(p.id));
    // Simple logic: pick the one with highest compatibility
    return items.sort((a, b) => {
        const aVal = a.compatibility?.[currentUser.dna.species] || 50;
        const bVal = b.compatibility?.[currentUser.dna.species] || 50;
        return bVal - aVal;
    })[0];
  }, [currentUser]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Explore Destinations</h1>
                <p className="text-gray-400">Browse the known sectors for your next adventure. Our database contains up-to-date atmospheric and societal planetary conditions.</p>
            </div>

            {/* AI DECISION ENGINE UI */}
            <AnimatePresence>
            {recommendation && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 border-neon-purple/30 bg-neon-purple/5 flex gap-4 items-center max-w-sm"
                >
                    <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0 animate-pulse">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-neon-purple tracking-widest block">AI Decision Engine</span>
                        <p className="text-xs text-white font-medium">Best choice for YOU: <span className="text-neon-cyan">{recommendation.name}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">High compatibility with {currentUser.dna.species} traits detected.</p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="glass-panel p-4 flex items-center gap-3">
                <Trophy size={20} className="text-amber-400" />
                <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Discovery Points</span>
                    <span className="text-lg font-mono text-white">{currentUser.discoveryPoints}</span>
                </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-3">
                <Lock size={20} className="text-neon-cyan" />
                <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Sectors Documented</span>
                    <span className="text-lg font-mono text-white">{currentUser.unlockedPlanets.length} / {planetsData.planets.length}</span>
                </div>
            </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                filter === cat 
                  ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Planet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlanets.map((planet, i) => {
            const isUnlocked = currentUser?.unlockedPlanets?.includes(planet.id);
            return (
                <div key={planet.id} className="relative group">
                    {!isUnlocked && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[4px] rounded-xl border border-neon-cyan/20 p-6 text-center"
                        >
                            <Lock size={32} className="text-neon-cyan mb-4 animate-pulse" />
                            <span className="text-xs text-white uppercase tracking-[0.2em] font-bold mb-1">Encrypted Sector</span>
                            <span className="text-[10px] text-gray-500 uppercase mb-4">Discovery Authorization Required</span>
                            
                            <button 
                              onClick={() => {
                                if (currentUser?.discoveryPoints >= 100 || currentUser?.unlockedPlanets?.length < 10) {
                                  unlockPlanet(planet.id);
                                } else {
                                  alert("Insufficient Discovery Points. Complete journeys to earn more.");
                                }
                              }}
                              className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded text-[10px] font-bold uppercase hover:bg-neon-cyan hover:text-black transition-all"
                            >
                              Decrypt ₡100
                            </button>
                        </motion.div>
                    )}
                    <PlanetCard planet={planet} />
                </div>
            );
          })}
        </div>
        
        {filteredPlanets.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <p>No destinations found matching this classification.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
