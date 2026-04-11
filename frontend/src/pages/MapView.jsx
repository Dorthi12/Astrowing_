import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import planetsData from '../data/planets.json';
import routesData from '../data/routes.json';
import { useNavigate } from 'react-router-dom';
import { Share2, MapPin, Navigation } from 'lucide-react';

const MapView = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);
  const [constellations, setConstellations] = useState([]);

  useEffect(() => {
    // Generate background stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setStars(newStars);

      // Generate a few constellation groupings
      const newConstellations = [];
      for (let i = 0; i < 5; i++) {
        const cx = Math.random() * 80 + 10;
        const cy = Math.random() * 80 + 10;
        const points = [];
        const numPoints = Math.floor(Math.random() * 4) + 3;
        for (let j = 0; j < numPoints; j++) {
            points.push({
                x: cx + (Math.random() * 15 - 7.5),
                y: cy + (Math.random() * 15 - 7.5)
            });
        }
        newConstellations.push(points);
      }
      setConstellations(newConstellations);
    };
    generateStars();
  }, []);

  const handleNodeClick = (planet) => {
    if (!origin) {
      setOrigin(planet);
    } else if (origin.id === planet.id) {
      setOrigin(null);
      setDestination(null);
    } else if (!destination) {
      setDestination(planet);
    } else if (destination.id === planet.id) {
      setDestination(null);
    } else {
      setOrigin(planet);
      setDestination(null);
    }
  };

  const calculateRouteDistance = () => {
    if (!origin || !destination) return 0;
    // Dijkstra could be here, but for display we just show absolute distance difference
    // or exact if it's a direct edge
    const directEdge = routesData.edges.find(e => 
        (e.source === origin.id && e.target === destination.id) || 
        (e.source === destination.id && e.target === origin.id)
    );
    if (directEdge) return directEdge.distanceLY;
    return parseFloat(Math.abs(origin.distance - destination.distance).toFixed(3)) || 1250;
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#02050a] flex items-center justify-center">
      
      {/* Background Deep Space Assets (Stars, Nebula, Constellations) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
          <defs>
              <radialGradient id="phoenix-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5500" stopOpacity="0.6"/>
                <stop offset="40%" stopColor="#ff2200" stopOpacity="0.3"/>
                <stop offset="80%" stopColor="#aa0055" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="phoenix-wing" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#ff4400" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
              </radialGradient>
          </defs>

          {/* Stars */}
          {stars.map(star => (
              <circle key={`star-${star.id}`} cx={`${star.x}%`} cy={`${star.y}%`} r={star.size} fill="#ffffff" opacity={star.opacity} />
          ))}

          {/* Constellations */}
          {constellations.map((group, idx) => (
             <g key={`const-${idx}`}>
                 {group.map((point, i) => {
                     const nextPoint = group[i + 1] || group[0];
                     return (
                         <line 
                            key={`line-${idx}-${i}`}
                            x1={`${point.x}%`} 
                            y1={`${point.y}%`} 
                            x2={`${nextPoint.x}%`} 
                            y2={`${nextPoint.y}%`}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                            strokeDasharray="2,3"
                         />
                     );
                 })}
                 {group.map((point, i) => (
                     <circle key={`np-${idx}-${i}`} cx={`${point.x}%`} cy={`${point.y}%`} r="1.5" fill="rgba(100, 200, 255, 0.8)">
                         <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + Math.random()*2}s`} repeatCount="indefinite"/>
                     </circle>
                 ))}
             </g>
          ))}

          {/* Phoenix Nebula Element */}
          <g transform="translate(600, 150) scale(0.6)" opacity="0.8">
              {/* Core Body */}
              <ellipse cx="200" cy="200" rx="60" ry="120" fill="url(#phoenix-core)" style={{filter: 'blur(20px)'}} transform="rotate(45 200 200)" />
              {/* Left Wing */}
              <ellipse cx="100" cy="150" rx="150" ry="40" fill="url(#phoenix-wing)" style={{filter: 'blur(25px)'}} transform="rotate(-20 100 150)" />
              {/* Right Wing */}
              <ellipse cx="300" cy="250" rx="150" ry="40" fill="url(#phoenix-wing)" style={{filter: 'blur(25px)'}} transform="rotate(-20 300 250)" />
              {/* Eye Glow */}
              <circle cx="250" cy="130" r="15" fill="#ffffff" style={{filter: 'blur(8px)'}} opacity="0.9" />
          </g>
          <g transform="translate(100, 500) scale(0.4)" opacity="0.6">
              <ellipse cx="200" cy="200" rx="80" ry="40" fill="url(#phoenix-core)" style={{filter: 'blur(30px)'}} />
          </g>
      </svg>

      <div className="absolute top-6 left-6 z-20 glass-panel p-5 max-w-sm bg-space-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
        <h2 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
          <Share2 size={18} className="text-neon-cyan" /> Galactic Map Grid
        </h2>
        <p className="text-xs text-gray-400 mb-4 tracking-wide leading-relaxed">
          Select origin and destination nodes to chart a plotted course through wormholes and deep-space lanes.
        </p>
        
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${origin ? 'bg-neon-cyan shadow-[0_0_8px_#0ff0fc]' : 'border border-gray-600'}`}></div>
            <div className="flex-1 border-b border-white/10 pb-1">
              <span className="text-gray-500 uppercase">Origin</span>
              <div className="text-white text-sm mt-1">{origin ? origin.name : 'Select Departure Node...'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${destination ? 'bg-neon-purple shadow-[0_0_8px_#b026ff]' : 'border border-gray-600'}`}></div>
            <div className="flex-1 pb-1">
              <span className="text-gray-500 uppercase">Destination</span>
              <div className="text-white text-sm mt-1">{destination ? destination.name : 'Select Arrival Node...'}</div>
            </div>
          </div>
        </div>

        {origin && destination && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t border-white/10 text-center">
             <div className="text-xs uppercase text-gray-500 mb-1">Total Distance (Est.)</div>
             <div className="text-2xl font-bold font-display text-white mb-4">
               {calculateRouteDistance()} LY
             </div>
             <button 
                onClick={() => navigate(`/book?orig=${origin.id}&dest=${destination.id}`)}
                className="w-full py-3 text-sm font-medium uppercase tracking-wider bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)] rounded transition-colors flex justify-center items-center gap-2"
              >
                <Navigation size={16} /> Init Travel Sequence
             </button>
          </motion.div>
        )}
      </div>

      {/* The Map visualization */}
      <div className="relative w-full h-full flex items-center justify-center scale-95 md:scale-100 mt-10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Background Network generated from routes.json */}
          {routesData.edges.map((edge, idx) => {
            const p1 = planetsData.planets.find(p => p.id === edge.source);
            const p2 = planetsData.planets.find(p => p.id === edge.target);
            
            if (!p1 || !p2) return null;

            return (
              <line 
                key={`route-${idx}`}
                x1={`${p1.coordinates.x}%`} 
                y1={`${p1.coordinates.y}%`} 
                x2={`${p2.coordinates.x}%`} 
                y2={`${p2.coordinates.y}%`} 
                stroke="#ffffff" 
                strokeWidth="1.5"
                strokeOpacity="0.1"
                strokeDasharray="4,6"
              />
            );
          })}

          {/* Active Navigation Path */}
          {origin && destination && (
             <motion.line 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                x1={`${origin.coordinates.x}%`} 
                y1={`${origin.coordinates.y}%`} 
                x2={`${destination.coordinates.x}%`} 
                y2={`${destination.coordinates.y}%`} 
                stroke="url(#route-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_rgba(176,38,255,0.9)]"
             />
          )}

          <defs>
             <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#0ff0fc" />
               <stop offset="50%" stopColor="#b026ff" />
               <stop offset="100%" stopColor="#ff2a7e" />
             </linearGradient>
          </defs>
        </svg>

        {planetsData.planets.map((planet) => {
          const isOrigin = origin?.id === planet.id;
          const isDest = destination?.id === planet.id;
          const isSelected = isOrigin || isDest;
          
          return (
            <div 
              key={planet.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10 hover:z-20'}`}
              style={{ left: `${planet.coordinates.x}%`, top: `${planet.coordinates.y}%` }}
              onClick={() => handleNodeClick(planet)}
            >
              <div className="relative group">
                {/* Orbit ring */}
                {isSelected && (
                  <div className={`absolute -inset-8 rounded-full border border-dashed ${isOrigin ? 'border-neon-cyan/50' : 'border-neon-purple/50'} animate-[spin_10s_linear_infinite]`} />
                )}
                {/* Ping effect */}
                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isOrigin ? 'bg-neon-cyan' : isDest ? 'bg-neon-purple' : 'bg-transparent group-hover:bg-white/30'}`}></div>
                
                {/* Planet Node indicator */}
                {isSelected && (
                  <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest ${isOrigin ? 'text-neon-cyan drop-shadow-[0_0_5px_#0ff0fc]' : 'text-neon-purple drop-shadow-[0_0_5px_#b026ff]'}`}>
                    {isOrigin ? 'Origin' : 'Dest'}
                  </div>
                )}
                
                {/* Planet Circle */}
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br border shadow-[0_0_10px_rgba(255,255,255,0.1)] 
                  ${planet.type === 'Moon' ? 'w-3 h-3' : planet.type === 'Dwarf Planet' ? 'w-4 h-4' : 'border-white/30'}
                  ${planet.color} 
                  ${isOrigin ? 'border-neon-cyan shadow-[0_0_20px_#0ff0fc] w-6 h-6' : isDest ? 'border-neon-purple shadow-[0_0_20px_#b026ff] w-6 h-6' : 'border-white/20'}`}
                ></div>
                
                {/* Label */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center transition-all ${isSelected ? 'opacity-100 mt-4' : 'opacity-60 group-hover:opacity-100'}`}>
                  <div className={`text-xs font-display font-medium px-2 py-0.5 bg-[#0a0f18]/80 backdrop-blur rounded border ${isSelected ? 'text-white border-white/30' : 'text-gray-300 border-white/5'}`}>
                      {planet.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapView;
