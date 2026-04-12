import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { planetService } from '../services';
import Loader from '../components/ui/Loader';
import { ArrowLeft, Ticket, AlertTriangle, Clock, Activity, ShieldAlert, Star, Users } from 'lucide-react';

const RiskMeter = ({ label, value }) => {
    // value is 0-100
    const isHigh = value > 75;
    const isMed = value > 40 && value <= 75;
    const colorClass = isHigh ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : (isMed ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]');
    
    return (
        <div className="mb-3">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                <span>{label}</span>
                <span className={isHigh ? 'text-red-400' : isMed ? 'text-yellow-400' : 'text-green-400'}>{value}%</span>
            </div>
            <div className="w-full bg-space-900 border border-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${colorClass}`}
                ></motion.div>
            </div>
        </div>
    );
};

const PlanetPage = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        setIsLoading(true);
        const response = await planetService.getPlanetById(parseInt(id));
        setPlanet(response.planet || response);
        setError(null);
      } catch (err) {
        setError(err?.error || err?.message || 'Failed to load planet');
        setPlanet(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlanet();
    }
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !planet) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-display text-white mb-4">Destination Not Found</h2>
        <p className="text-gray-400 mb-6">{error || 'Unable to load planet data'}</p>
        <Link to="/explore" className="text-neon-cyan hover:text-white transition-colors underline">Return to Directory</Link>
      </div>
    );
  }

  const overallRisk = planet.riskLevel || 0;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft size={16} /> Back to Destinations
      </Link>
      
      {overallRisk > 75 && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-4 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="animate-pulse flex-shrink-0" size={24} />
              <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">Warning: High Risk Environment Detected</h4>
                  <p className="text-xs text-red-300/80">This sector breaches Level 5 safety protocols. Travel guarantees are voided.</p>
              </div>
          </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-4">
        
        {/* Planet Visual & Interactions Core */}
        <div className="sticky top-24">
            <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex justify-center items-center aspect-square mb-8"
            >
              {/* Main Glow */}
            <div className={`absolute inset-10 rounded-full blur-[100px] opacity-30 bg-gradient-to-br from-blue-500 to-purple-600`}></div>
            {/* The planet visual sphere */}
            <div className={`w-3/4 h-3/4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.5),0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden relative ${overallRisk > 75 ? 'animate-[pulse_4s_linear_infinite]' : ''}`}>
                {planet.imageUrl && (
                    <img src={planet.imageUrl} alt={planet.name} className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80" />
                )}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 30% 30%, transparent 20%, rgba(0,0,0,0.4) 80%)' }}></div>
            </div>
            </motion.div>

            <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="block text-sm text-gray-500 font-mono mb-1">Base Fare</span>
                        <span className="text-3xl font-mono text-neon-cyan font-bold">
                            ${planet.basePrice ? planet.basePrice.toFixed(2) : 'N/A'}
                        </span>
                    </div>
                    <Link to="/book">
                        <button className="bg-neon-cyan text-black py-3 px-6 rounded-lg font-bold uppercase text-sm hover:scale-[1.05] transition-all">
                            <Ticket size={16} className="inline mr-2" />
                            Book Flight
                        </button>
                    </Link>
                </div>
                
                {planet.description && (
                    <div className="bg-white/5 rounded border border-white/10 p-3 flex items-start gap-3 mt-4">
                        <Activity className="text-neon-cyan mt-1" size={16} />
                        <div>
                            <span className="text-xs uppercase text-neon-cyan font-bold block mb-1">Planet Info</span>
                            <span className="text-xs text-gray-300">{planet.description}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        
        {/* Planet Details Metrics */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-2">
            <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest bg-white/10 rounded-full text-gray-300 border border-white/5">
              Type: {planet.type || 'Unknown'}
            </span>
            <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest bg-white/10 rounded-full text-gray-300 border border-white/5 ml-2">
              Distance: {planet.distanceFromEarth ? planet.distanceFromEarth.toLocaleString() : 'Unknown'} LY
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2">
            {planet.name}
          </h1>

          <p className="text-lg text-neon-cyan/70 font-mono mb-8 lowercase tracking-widest text-sm">
            SECTOR: {planet.galaxy || 'Unknown'} [Risk: {Math.round(planet.riskLevel || 0)}%]
          </p>

          {/* Lore Section */}
          <div className="mb-10 text-gray-300 leading-relaxed space-y-4">
              <p>{planet.description || 'No description available'}</p>
              {planet.lore && <p className="text-gray-400 italic font-serif opacity-80 border-l-2 border-neon-cyan/30 pl-4">{planet.lore}</p>}
          </div>
          
          {/* Dashboard Metrics Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              
              {/* Risk Engine */}
              <div className="glass-panel p-6 rounded-xl">
                 <h3 className="text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                     <AlertTriangle size={16} className={overallRisk > 75 ? "text-red-500" : overallRisk > 40 ? "text-yellow-500" : "text-green-500"} /> 
                     Planet Risk Assessment
                 </h3>
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Overall Risk</span>
                        <span>{Math.round(overallRisk)}%</span>
                      </div>
                      <div className="bg-black/40 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(overallRisk, 100)}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full ${overallRisk > 75 ? 'bg-red-500' : overallRisk > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      {overallRisk > 75 ? 'High-risk destination. Recommended for experienced travelers only.' : overallRisk > 40 ? 'Moderate risk level. Standard precautions advised.' : 'Low-risk destination. Suitable for all travelers.'}
                    </p>
                 </div>
              </div>

              {/* Bio-Ecosystem Info */}
              <div className="glass-panel p-6 rounded-xl">
                 <h3 className="text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                     <Activity size={16} className="text-neon-cyan" />
                     Environmental Data
                 </h3>
                 <p className="text-xs text-gray-400 mb-5 leading-relaxed">Key characteristics and environmental conditions.</p>
                 
                 <div className="space-y-3">
                     <div className="flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded-lg">
                        <span className="text-xs uppercase text-gray-300 font-bold">Temperature</span>
                        <span className="text-sm font-mono text-neon-cyan">{planet.temperature || 'N/A'}</span>
                     </div>
                     <div className="flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded-lg">
                        <span className="text-xs uppercase text-gray-300 font-bold">Gravity</span>
                        <span className="text-sm font-mono text-neon-cyan">{planet.gravity || 'N/A'}</span>
                     </div>
                     <div className="flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded-lg">
                        <span className="text-xs uppercase text-gray-300 font-bold">Atmosphere</span>
                        <span className="text-sm font-mono text-neon-cyan">{planet.atmosphere || 'Unknown'}</span>
                     </div>
                 </div>
              </div>
          </div>

          {/* Reviews / Community Section */}
          <div className="mb-10">
              <h3 className="text-xl font-display text-white mb-6 flex items-center gap-3">
                  <Users className="text-neon-cyan" /> Traveler Reviews
              </h3>
              
              <div className="space-y-4">
                  {planet.reviews && planet.reviews.length > 0 ? (
                      planet.reviews.map((review, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-neon-cyan/30 transition-all"
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <span className="text-white font-bold block">{review.userName || 'Anonymous'}</span>
                                      <span className="text-xs text-gray-400">{review.date && new Date(review.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={14} className={i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                                      ))}
                                  </div>
                              </div>
                              <p className="text-sm text-gray-200">{review.comment || review.text}</p>
                          </motion.div>
                      ))
                  ) : (
                      <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl">
                          <p className="text-gray-500 text-sm">No reviews yet for this destination.</p>
                      </div>
                  )}
              </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};

export default PlanetPage;
