import React, { useState, useMemo } from 'react';
import planetsData from '../data/planets.json';
import PlanetCard from '../components/planet/PlanetCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Sparkles, Lock, Trophy, X, Activity, AlertTriangle, ShieldAlert, Star, Ticket, CheckCircle } from 'lucide-react';

const PlanetProfileModal = ({ planet, onClose, onBook }) => {
    const [bookingStep, setBookingStep] = useState('profile'); // profile, booking, success
    const [classType, setClassType] = useState('Economy');
    const [passengers, setPassengers] = useState(1);

    const overallRisk = planet.risks?.Overall || 0;

    const handleBook = () => {
        setBookingStep('success');
        setTimeout(() => {
            onBook(planet);
        }, 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-white/10 relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <X size={20} className="text-gray-400" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side: Visuals */}
                    <div className="p-8 md:p-12 bg-gradient-to-br from-black/40 to-transparent">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square flex items-center justify-center mb-10"
                        >
                            <div className={`absolute inset-4 rounded-full blur-[80px] opacity-30 bg-gradient-to-br ${planet.color}`}></div>
                            <div className={`w-3/4 h-3/4 rounded-full bg-gradient-to-br ${planet.color} shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden relative shadow-2xl`}>
                                {planet.image && (
                                    <img src={planet.image} alt={planet.name} className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80" />
                                )}
                                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 30% 30%, transparent 20%, rgba(0,0,0,0.4) 80%)' }}></div>
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neon-cyan mb-2">Metrics Matrix</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Gravity</span>
                                        <span className="text-sm font-mono text-white">0.92G</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Temp</span>
                                        <span className="text-sm font-mono text-white">-14°C</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-neon-purple/5 border border-neon-purple/20 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <Activity size={16} className="text-neon-purple" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-neon-purple">Atmospheric Composition</span>
                                </div>
                                <div className="flex gap-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[70%] bg-neon-purple h-full"></div>
                                    <div className="w-[20%] bg-blue-400 h-full"></div>
                                    <div className="w-[10%] bg-gray-400 h-full"></div>
                                </div>
                                <div className="flex justify-between text-[8px] text-gray-500 mt-2 uppercase tracking-tighter">
                                    <span>Nitrogen 70%</span>
                                    <span>Oxygen 20%</span>
                                    <span>Other 10%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Info & Booking */}
                    <div className="p-8 md:p-12 bg-white/[0.02]">
                        <AnimatePresence mode="wait">
                            {bookingStep === 'profile' && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-8">
                                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">
                                            Sector: {planet.galaxy}
                                        </span>
                                        <h2 className="text-4xl font-display font-bold text-white mb-2">{planet.name}</h2>
                                        <p className="text-gray-400 leading-relaxed italic border-l-2 border-neon-cyan/30 pl-4 py-1">
                                            "{planet.shortDesc}"
                                        </p>
                                    </div>

                                    <div className="space-y-8 mb-10">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2">
                                                <AlertTriangle size={14} className={overallRisk > 60 ? "text-red-500" : "text-green-500"} />
                                                Hazard Assessment
                                            </h4>
                                            <div className="space-y-4">
                                                {Object.entries(planet.risks || {}).map(([key, value]) => (
                                                    key !== 'Overall' && (
                                                        <div key={key}>
                                                            <div className="flex justify-between text-[10px] text-gray-400 uppercase mb-1">
                                                                <span>{key}</span>
                                                                <span>{value}%</span>
                                                            </div>
                                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${value}%` }}
                                                                    className={`h-full ${value > 70 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4">Planetary Lore</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed font-sans">
                                                {planet.lore || "No historical records available for this celestial body."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-6">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase block font-bold mb-1">Base Price</span>
                                            <span className="text-3xl font-mono font-bold text-neon-purple">₡{planet.price?.toLocaleString()}</span>
                                        </div>
                                        <button 
                                            onClick={() => setBookingStep('booking')}
                                            className="flex-grow py-4 bg-neon-cyan text-black rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Ticket size={18} />
                                            Book Journey
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {bookingStep === 'booking' && (
                                <motion.div 
                                    key="booking"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-10">
                                        <button 
                                            onClick={() => setBookingStep('profile')}
                                            className="text-[10px] text-neon-cyan uppercase font-bold mb-4 hover:underline"
                                        >
                                            ← Back to Profile
                                        </button>
                                        <h2 className="text-3xl font-display font-bold text-white mb-2">Reserve Transit</h2>
                                        <p className="text-sm text-gray-500 font-mono uppercase tracking-[0.2em]">Route: Origin → {planet.name}</p>
                                    </div>

                                    <div className="space-y-8 mb-10">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Class Selection</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Economy', 'First Class', 'Cryo-Sleep', 'VIP'].map(c => (
                                                    <button 
                                                        key={c}
                                                        onClick={() => setClassType(c)}
                                                        className={`p-4 rounded-xl border text-left transition-all ${classType === c ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                                    >
                                                        <span className="block text-xs font-bold uppercase mb-1">{c}</span>
                                                        <span className="text-[10px] opacity-60">
                                                            {c === 'Economy' ? 'Standard Pod' : c === 'First Class' ? 'View Port' : c === 'Cryo-Sleep' ? 'Long Haul' : 'Command Deck'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">Passenger Group</h4>
                                            <div className="flex h-12 bg-white/5 rounded-xl border border-white/10 p-1">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button 
                                                        key={n}
                                                        onClick={() => setPassengers(n)}
                                                        className={`flex-grow rounded-lg text-xs font-bold transition-all ${passengers === n ? 'bg-neon-cyan text-black shadow-lg shadow-neon-cyan/20' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-black/40 border border-dashed border-white/10 rounded-xl space-y-2">
                                            <div className="flex justify-between text-xs font-mono">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="text-white">₡{(planet.price * passengers).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-mono">
                                                <span className="text-gray-500">Service Fee</span>
                                                <span className="text-white">₡150</span>
                                            </div>
                                            <div className="pt-2 border-t border-white/10 flex justify-between font-bold font-mono">
                                                <span className="text-xs uppercase text-neon-cyan">Total</span>
                                                <span className="text-lg text-neon-cyan">₡{(planet.price * passengers + 150).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleBook}
                                        className="w-full py-4 bg-neon-purple text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
                                    >
                                        Initiate Transaction
                                    </button>
                                </motion.div>
                            )}

                            {bookingStep === 'success' && (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                                >
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 relative">
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring" }}
                                        >
                                            <CheckCircle size={56} className="text-green-500" />
                                        </motion.div>
                                        <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                    <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">Manifest Confirmed</h2>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                        Your neural reservation for <strong>{planet.name}</strong> has been synchronized. Welcome aboard.
                                    </p>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] space-y-1">
                                        <p className="text-gray-500 uppercase tracking-widest">Digital Ticket ID</p>
                                        <p className="text-neon-cyan uppercase">SN-X92-QLL-0182</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Explore = () => {
  const { currentUser, unlockPlanet } = useAppContext();
  const [filter, setFilter] = useState('All');
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  
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
    if (items.length === 0) return planetsData.planets[0]; // Fallback
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
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Galactic Destinations</h1>
                <p className="text-gray-400">Scan the known sectors for your next warp destination. Our core database is synchronized with galactic hub telemetry.</p>
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
                        <span className="text-[10px] uppercase font-bold text-neon-purple tracking-widest block">Neural Recommendation</span>
                        <p className="text-xs text-white font-medium">Optimal Sync: <span className="text-neon-cyan">{recommendation.name}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">High compatibility with your biocore detected.</p>
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
                    <span className="text-lg font-mono text-white">{currentUser?.discoveryPoints || 0}</span>
                </div>
            </div>
            <div className="glass-panel p-4 flex items-center gap-3">
                <Lock size={20} className="text-neon-cyan" />
                <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Sectors Documented</span>
                    <span className="text-lg font-mono text-white">{currentUser?.unlockedPlanets?.length || 0} / {planetsData.planets.length}</span>
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
                    {!isUnlocked && currentUser && (
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
                                if (currentUser?.discoveryPoints >= 100 || (currentUser?.unlockedPlanets?.length || 0) < 10) {
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
                    <div onClick={() => setSelectedPlanet(planet)} className="cursor-pointer h-full">
                        <PlanetCard planet={planet} />
                    </div>
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

      <AnimatePresence>
        {selectedPlanet && (
            <PlanetProfileModal 
                planet={selectedPlanet} 
                onClose={() => setSelectedPlanet(null)} 
                onBook={(planet) => {
                    console.log("Booked:", planet.name);
                    // In a real app we would add this to context
                }}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
