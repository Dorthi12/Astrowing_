import React, { useState, useEffect, useMemo } from 'react';
import PlanetCard from '../components/planet/PlanetCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Trophy, AlertCircle } from 'lucide-react';
import { planetService } from '../services';
import Loader from '../components/ui/Loader';

const Explore = () => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Terrestrial', 'Terraformed', 'Super-Earth', 'Oceanic', 'Volcanic', 'Ice'];
  
  // Fetch planets on component mount
  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await planetService.getAllPlanets(100, 0);
      setPlanets(response.planets || []);
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to fetch planets');
      // Fallback to empty array
      setPlanets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlanets = useMemo(() => {
    if (filter === 'All') {
      return planets;
    }
    return planets.filter(p => p.type === filter);
  }, [planets, filter]);

  // Find a recommendation (highest rated)
  const recommendation = useMemo(() => {
    if (planets.length === 0) return null;
    return [...planets].sort((a, b) => 
      (b.averageRating || 0) - (a.averageRating || 0)
    )[0];
  }, [planets]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

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
                    className="glass-panel p-4 border-neon-purple/30 bg-neon-purple/5 flex gap-4 items-center max-w-sm rounded-lg"
                >
                    <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0 animate-pulse">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-neon-purple tracking-widest block">Trending Now</span>
                        <p className="text-xs text-white font-medium">Popular: <span className="text-neon-cyan">{recommendation.name}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">Rating: {recommendation.averageRating}/5.0 ⭐</p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="glass-panel p-4 flex items-center gap-3 rounded-lg">
                <Trophy size={20} className="text-amber-400" />
                <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Total Planets</span>
                    <span className="text-lg font-mono text-white">{planets.length}</span>
                </div>
            </div>
            {error && (
              <div className="md:col-span-3 glass-panel p-4 flex items-center gap-3 rounded-lg border-red-500/30 bg-red-500/10">
                <AlertCircle size={20} className="text-red-400" />
                <div>
                  <span className="text-[10px] text-red-400 uppercase block">Connection Issue</span>
                  <span className="text-sm text-red-300">{error}</span>
                </div>
              </div>
            )}
        </div>
        
        {/* Filters */}
        {planets.length > 0 && (
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
        )}
        
        {/* Planet Grid */}
        {planets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanets.map((planet) => (
              <motion.div 
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PlanetCard planet={planet} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p>No destinations available. Please try again later.</p>
          </div>
        )}
        
        {filteredPlanets.length === 0 && planets.length > 0 && (
          <div className="py-20 text-center text-gray-500">
            <p>No destinations found matching the "{filter}" classification.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
