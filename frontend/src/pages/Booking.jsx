import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import planetsData from '../data/planets.json';
import routesData from '../data/routes.json';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { CheckCircle, AlertTriangle, Plus, X, Zap, Coffee, Snowflake, Activity } from 'lucide-react';

const calculateOptimalRoute = (startId, endId) => {
    if (startId === endId) return { path: [startId], cost: 0 };
    
    const graph = {};
    planetsData.planets.forEach(p => graph[p.id] = {});
    
    routesData.edges.forEach(edge => {
        graph[edge.source][edge.target] = edge.cost;
        graph[edge.target][edge.source] = edge.cost; // Undirected
    });
    
    const distances = {};
    const previous = {};
    const queue = [];
    
    planetsData.planets.forEach(p => {
        distances[p.id] = Infinity;
        previous[p.id] = null;
        queue.push(p.id);
    });
    distances[startId] = 0;
    
    while(queue.length > 0) {
        queue.sort((a,b) => distances[a] - distances[b]);
        const u = queue.shift();
        
        if (distances[u] === Infinity) break;
        if (u === endId) break;
        
        for (let v in graph[u]) {
            if (queue.includes(v)) {
                const alt = distances[u] + graph[u][v];
                if (alt < distances[v]) {
                    distances[v] = alt;
                    previous[v] = u;
                }
            }
        }
    }
    
    const path = [];
    let curr = endId;
    if (previous[curr] !== null || curr === startId) {
        while(curr !== null) {
            path.unshift(curr);
            curr = previous[curr];
        }
    }
    
    return { path, cost: distances[endId] };
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, addBooking, spaceWeather } = useAppContext();
  
  const defaultOrigin = searchParams.get('orig') || planetsData.planets[0].id;
  const defaultDest = searchParams.get('dest') || id || planetsData.planets[3].id; // Aethelgard

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Guest Explorer',
    route: [defaultOrigin, defaultDest],
    date: new Date().toISOString().split('T')[0],
    travelClass: 'Economy Pod',
    catering: 'None'
  });

  const [step, setStep] = useState(1); 
  const [wormholeRoute, setWormholeRoute] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasCharterLegs, setHasCharterLegs] = useState(false);

  // CRYO SYSTEM STATES
  const [isSimulatingCryo, setIsSimulatingCryo] = useState(false);
  const [cryoOptions, setCryoOptions] = useState({
      sleepMode: 'Adaptive Sleep',
      riskLevel: 'Safe Mode'
  });
  const [cryoSimulator, setCryoSimulator] = useState({
      stability: 95,
      actualTime: 18,
      perceivedTime: 2,
      outcome: '✅ Perfect wake-up'
  });

  useEffect(() => {
    let requiresWormhole = false;
    let priceSum = 0;
    let involvesCharter = false;
    
    const graph = {};
    planetsData.planets.forEach(p => graph[p.id] = {});
    routesData.edges.forEach(edge => {
        graph[edge.source][edge.target] = { cost: edge.cost, dist: edge.distanceLY };
        graph[edge.target][edge.source] = { cost: edge.cost, dist: edge.distanceLY };
    });

    for (let i = 0; i < formData.route.length - 1; i++) {
        const fromId = formData.route[i];
        const toId = formData.route[i+1];
        
        if (graph[fromId] && graph[fromId][toId]) {
            priceSum += graph[fromId][toId].cost;
            if (graph[fromId][toId].dist > 10000) requiresWormhole = true;
        } else {
            priceSum += 85000; 
            involvesCharter = true;
            const fromPlanet = planetsData.planets.find(p => p.id === fromId);
            const toPlanet = planetsData.planets.find(p => p.id === toId);
            if (fromPlanet && toPlanet) {
                const distance = Math.abs(fromPlanet.distance - toPlanet.distance) || 1250;
                if (distance > 10000) requiresWormhole = true;
            }
        }
    }
    setWormholeRoute(requiresWormhole);
    setTotalPrice(priceSum);
    setHasCharterLegs(involvesCharter);
  }, [formData.route]);

  // CRYO SIMULATION EFFECT
  useEffect(() => {
      if(formData.travelClass !== 'Cryo Sleep Chamber') return;
      
      let baseLength = Math.max(12, formData.route.length * 14);
      
      let pTime = cryoOptions.sleepMode === 'Deep Cryo' ? 0.5 : cryoOptions.sleepMode === 'Light Sleep' ? baseLength * 0.4 : 2.5;
      if (cryoOptions.riskLevel === 'Experimental Mode') {
          pTime = pTime * 0.2; // intense time compression
      }
      
      let stab = cryoOptions.riskLevel === 'Safe Mode' ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 40) + 40;
      
      let out = '✅ Perfect wake-up projected';
      if (stab < 60) out = '❌ Delayed revival hazards active!';
      else if (stab < 80) out = '⚠️ Potential memory distortion';
      
      setCryoSimulator({
          stability: stab,
          actualTime: baseLength,
          perceivedTime: Math.max(0.1, pTime).toFixed(1),
          outcome: out
      });
  }, [formData.route, formData.travelClass, cryoOptions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRouteChange = (index, value) => {
    const newRoute = [...formData.route];
    newRoute[index] = value;
    setFormData({ ...formData, route: newRoute });
  };

  const addStop = () => {
    const newRoute = [...formData.route];
    newRoute.splice(newRoute.length - 1, 0, planetsData.planets[2].id);
    setFormData({ ...formData, route: newRoute });
  };

  const removeStop = (index) => {
    const newRoute = formData.route.filter((_, i) => i !== index);
    setFormData({ ...formData, route: newRoute });
  };

  const handleAutoRoute = () => {
    const startId = formData.route[0];
    const endId = formData.route[formData.route.length - 1];
    if (!startId || !endId) return;
    const result = calculateOptimalRoute(startId, endId);
    if (result.path && result.path.length > 0 && result.cost !== Infinity) setFormData({ ...formData, route: result.path });
    else alert("No mathematical route possible on public wormhole networks.");
  };



  const handleBooking = (e) => {
    e.preventDefault();
    for (let i = 0; i < formData.route.length - 1; i++) {
        if (formData.route[i] === formData.route[i+1]) {
            alert("Adjacent route nodes cannot be the same. Please remove the duplicate node.");
            return;
        }
    }
    
    if (formData.travelClass === 'Cryo Sleep Chamber') {
        setIsSimulatingCryo(true);
        setTimeout(() => {
            setIsSimulatingCryo(false);
            processBooking();
        }, 4000); // 4 sec simulation
    } else {
        processBooking();
    }
  };

  const processBooking = () => {
      setStep(2);
      setTimeout(() => {
        const id = Date.now();
        const ticket = {
          id: id,
          name: formData.name,
          route: formData.route,
          date: formData.date,
          travelClass: formData.travelClass,
          catering: formData.catering,
          bookingDate: new Date().toISOString(),
          price: finalPrice,
          usedWormhole: wormholeRoute
        };
        addBooking(ticket);
        
        // Redirect to tracking page
        setTimeout(() => {
            navigate(`/tracking/${id}`);
        }, 1500);
      }, 2000);
  };

  const finalPrice = Math.floor(((totalPrice * (formData.travelClass === 'Cryo Sleep Chamber' ? 3 : formData.travelClass === 'Business Orbit Seat' ? 2 : 1)) + (formData.catering === 'Luxury' ? 850 : formData.catering === 'Premium' ? 150 : formData.catering === 'Standard' ? 15 : 0)) * (spaceWeather?.condition !== 'Stable' ? 1.15 : 1));

  const finalDest = planetsData.planets.find(p => p.id === formData.route[formData.route.length - 1]);
  const origin = planetsData.planets.find(p => p.id === formData.route[0]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl relative z-10">
      <h1 className="text-4xl font-display font-bold text-center mb-10">Configure Travel Manifest</h1>
      
      {/* PREDICTIVE ASSISTANT UI */}
      <div className="mb-6 flex items-center justify-between p-4 glass-panel border-neon-cyan/30 rounded-xl bg-neon-cyan/5">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-neon-cyan animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold text-neon-cyan tracking-widest block">Predictive Travel Assistant</span>
            <p className="text-xs text-gray-300">
              {spaceWeather.condition === 'Stable' 
                ? "Recommended departure in 3 hours – current wormhole stability is 99%." 
                : `${spaceWeather.condition} detected in the sector. Routing with 15% safety buffer advised.`}
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">System Suggestion</span>
          <span className="text-xs font-mono text-white">DEPARTURE: T+03:00</span>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        
        {/* CRYO SUB-STEP SIMULATION OVERLAY */}
        {isSimulatingCryo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center bg-black/80 backdrop-blur-md border border-cyan-500/20"
          >
            {/* Frost edges & deep blue glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(59,130,246,0.3)] pointer-events-none mix-blend-screen opacity-50"></div>
            
            <Snowflake className="text-cyan-300 animate-[spin_4s_linear_infinite] mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" size={60} strokeWidth={1} />
            <h3 className="text-3xl font-display text-white tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Simulating Cryo-Cycle...</h3>
            
            {/* Heartbeat pulse line UI */}
            <div className="w-56 h-12 mt-8 relative flex items-center justify-center overflow-hidden opacity-90">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                    <polyline points="0,10 30,10 40,2 50,18 60,10 100,10" fill="none" stroke="#22d3ee" strokeWidth="1.5">
                        <animate attributeName="points" dur="1s" values="0,10 30,10 40,2 50,18 60,10 100,10; 0,10 30,10 40,10 50,10 60,10 100,10; 0,10 30,10 40,2 50,18 60,10 100,10" repeatCount="indefinite" />
                    </polyline>
                </svg>
            </div>
            
            <p className="text-cyan-400 mt-4 text-xs font-mono tracking-widest animate-pulse">INITIATING BIOLOGICAL SUSPENSION...</p>
          </motion.div>
        )}

        {step === 1 && !isSimulatingCryo && (
          <motion.form 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onSubmit={handleBooking} className="space-y-6"
          >
             {/* Space Weather Warning */}
             {spaceWeather.condition !== 'Stable' && (
               <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                 <AlertTriangle className="text-red-400" size={16} />
                 <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider">
                   {spaceWeather.condition} Surcharge (+15%) Applied due to atmospheric shielding requirements.
                 </span>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Passenger Manifest Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-space-800 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all" />
               </div>
               <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Departure Date (Earth Std)</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-space-800 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all" />
               </div>
             </div>

             <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4 relative">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-400">Route Configuration</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={handleAutoRoute} className="text-green-400 text-xs flex items-center gap-1 hover:text-green-300 transition-colors" title="Find the cheapest valid route avoiding charter fees">
                            <Zap size={14} /> Auto-Find Cheapest
                        </button>
                        <button type="button" onClick={addStop} className="text-neon-cyan text-xs flex items-center gap-1 hover:text-white transition-colors">
                            <Plus size={14} /> Add Connection
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3 relative">
                    {formData.route.map((nodeId, idx) => (
                        <div key={idx} className="flex items-center gap-3 relative z-10 bg-space-900/40 p-2 rounded border border-white/5">
                            <div className="flex flex-col items-center justify-center shrink-0 w-6 h-full absolute -left-1">
                                <div className={`w-3 h-3 rounded-full relative z-20 ${idx === 0 ? 'bg-neon-cyan shadow-[0_0_8px_#0ff0fc]' : idx === formData.route.length - 1 ? 'bg-neon-purple shadow-[0_0_8px_#b026ff]' : 'bg-gray-400'}`}></div>
                                {idx < formData.route.length - 1 && <div className="w-0.5 h-16 bg-white/20 absolute top-3 z-10"></div>}
                            </div>
                            <div className="flex-1 flex gap-2 items-center ml-8">
                                <div className="flex-1">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 mb-1 block">
                                        {idx === 0 ? 'Origin Node' : idx === formData.route.length - 1 ? 'Destination Node' : `Hop ${idx}`}
                                    </span>
                                    <select 
                                        value={nodeId} 
                                        onChange={(e) => handleRouteChange(idx, e.target.value)} 
                                        className="w-full bg-space-800 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-neon-cyan transition-all text-sm"
                                    >
                                        {planetsData.planets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.galaxy})</option>)}
                                    </select>
                                </div>
                                {idx !== 0 && idx !== formData.route.length - 1 && (
                                    <button type="button" onClick={() => removeStop(idx)} className="mt-4 p-2 text-gray-500 hover:text-red-400 transition-colors">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             <div className="bg-black/20 rounded p-4 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Calculated Subtotal</span>
                    <span className="text-2xl font-mono text-neon-purple font-bold">
                        ₡{finalPrice.toLocaleString()}
                    </span>
                </div>
                {hasCharterLegs && (
                    <div className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <AlertTriangle size={14} /> Contains Off-Network Charter Fees
                    </div>
                )}
             </div>

             {wormholeRoute && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                   <div className="bg-neon-purple/20 border border-neon-purple/50 rounded p-4 flex items-start gap-3">
                     <Zap className="text-neon-purple shrink-0 mt-0.5" size={18} />
                     <div>
                       <h4 className="text-neon-purple font-medium text-sm">Wormhole Express Authorized</h4>
                       <p className="text-xs text-gray-300 mt-1">Legs spanning over 10,000 LY detected. Ultra-fast wormhole jumps will be enabled for this journey.</p>
                     </div>
                   </div>

                   <div className="bg-space-800/50 border border-neon-cyan/30 rounded-xl p-5 relative overflow-hidden mt-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                      <div className="absolute top-[-20px] right-[-10px] p-2 opacity-5 pointer-events-none text-neon-cyan">
                          <Coffee size={140} />
                      </div>
                      <h3 className="text-neon-cyan font-display font-medium text-lg mb-2 flex items-center gap-2">
                          <Coffee size={18} /> Exclusive In-Flight Catering
                      </h3>
                      <p className="text-xs text-gray-400 mb-5 tracking-wide w-[90%] leading-relaxed">
                          Extended wormhole traverses can be disorienting. Pre-order our chef-prepared stasis meals to restore energy mid-journey.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                        {[
                            { id: 'None', name: 'No Meal', price: 0 },
                            { id: 'Standard', name: 'Vacuum Rations', price: 15 },
                            { id: 'Premium', name: 'Synth-Steak & Veg', price: 150 },
                            { id: 'Luxury', name: 'Centaurian Caviar', price: 850 }
                        ].map(meal => (
                            <div 
                              key={meal.id}
                              onClick={() => setFormData({...formData, catering: meal.id})}
                              className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all group ${formData.catering === meal.id ? 'bg-neon-cyan/20 border-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                            >
                              <span className={`text-xs font-bold mb-2 transition-colors ${formData.catering === meal.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{meal.name}</span>
                              <span className="text-[10px] text-neon-cyan font-mono">+ ₡{meal.price}</span>
                            </div>
                        ))}
                      </div>
                   </div>
               </motion.div>
             )}

             <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 mt-2">Spaceship Class Multiplier</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Economy Pod', 'Business Orbit Seat', 'Cryo Sleep Chamber'].map(cls => (
                    <div 
                      key={cls}
                      onClick={() => setFormData({...formData, travelClass: cls})}
                      className={`cursor-pointer p-4 rounded border text-center transition-all ${formData.travelClass === cls ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-space-800 border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <span className="text-sm font-medium">{cls}</span>
                    </div>
                  ))}
                </div>
             </div>

             {/* DEEP CRYO SLEEP UI - TIME OPTIMIZATION SYSTEM */}
             <AnimatePresence>
             {formData.travelClass === 'Cryo Sleep Chamber' && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-6"
                 >
                    <div className="bg-[#051020] border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                        {/* Glow/Frost overlay effect */}
                        <div className="absolute inset-0 bg-blue-900/10 pointer-events-none mix-blend-overlay border-[3px] border-transparent rounded-xl shadow-[inset_0_0_30px_rgba(34,211,238,0.1)]"></div>
                        <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-cyan-300 font-display font-medium text-lg flex items-center gap-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                                    <Snowflake className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={20} />
                                    Time & Condition Management
                                </h3>
                                <p className="text-xs text-cyan-100/60 mt-1 tracking-wide">Optimize biological state & temporal perception.</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full border border-cyan-500/30">
                                <Activity size={14} className="text-cyan-400 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-mono">Bio-Link Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
                            {/* Sleep Mode Select */}
                            <div>
                                <label className="block text-[10px] text-cyan-200 uppercase tracking-widest mb-2 font-bold">🧬 Sleep Mode</label>
                                <div className="flex flex-col gap-2">
                                    {['Light Sleep', 'Deep Cryo', 'Adaptive Sleep'].map(mode => (
                                        <button 
                                            key={mode} 
                                            type="button"
                                            onClick={() => setCryoOptions({...cryoOptions, sleepMode: mode})}
                                            className={`text-xs px-3 py-2.5 rounded transition-all text-left font-medium ${cryoOptions.sleepMode === mode ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/60 border border-cyan-900/50 text-cyan-300/50 hover:bg-cyan-900/30'}`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Risk Level Select */}
                            <div>
                                <label className="block text-[10px] text-cyan-200 uppercase tracking-widest mb-2 font-bold">🧪 Risk Level Protocol</label>
                                <div className="flex flex-col gap-2">
                                    {['Safe Mode', 'Experimental Mode'].map(risk => (
                                        <button 
                                            key={risk} 
                                            type="button"
                                            onClick={() => setCryoOptions({...cryoOptions, riskLevel: risk})}
                                            className={`text-xs px-3 py-2.5 rounded transition-all text-left font-medium ${cryoOptions.riskLevel === risk ? (risk === 'Safe Mode' ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-100 shadow-[0_0_10px_rgba(52,211,153,0.2)]' : 'bg-red-500/20 border border-red-400 text-red-100 shadow-[0_0_10px_rgba(248,113,113,0.2)]') : 'bg-black/60 border border-cyan-900/50 text-gray-500 hover:border-cyan-400/50 hover:text-white'}`}
                                        >
                                            {risk}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Smart Info Deck */}
                        <div className="bg-black/60 border border-cyan-400/20 rounded-lg p-5 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                            <div className="flex-1">
                                <span className="block text-[10px] text-cyan-400 uppercase tracking-widest mb-2">⏳ Time Effect Simulation</span>
                                <p className="text-sm font-mono text-cyan-100">
                                    You will experience <span className="text-cyan-300 font-bold drop-shadow-[0_0_5px_#22d3ee]">{cryoSimulator.perceivedTime} hrs</span> instead of <span className="text-gray-400">{cryoSimulator.actualTime} hrs</span>
                                </p>
                            </div>
                            
                            <div className="w-px h-10 bg-cyan-700/50 hidden md:block"></div>
                            
                            <div className="flex-1 md:text-right">
                                <span className="block text-[10px] text-cyan-400 uppercase tracking-widest mb-2">🧠 Cryo Compatibility Score</span>
                                <div className="flex items-center md:justify-end gap-3">
                                    <span className="text-[11px] text-gray-300 font-mono text-right max-w-[120px] leading-tight">{cryoSimulator.outcome}</span>
                                    <span className={`text-2xl font-black tracking-tighter ${cryoSimulator.stability > 80 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : cryoSimulator.stability > 55 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'}`}>
                                        {cryoSimulator.stability}%
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                 </motion.div>
             )}
             </AnimatePresence>

             <div className="pt-6 border-t border-white/10">
               <Button type="submit" variant="primary" className="w-full py-4 text-lg items-center gap-2">Authorize Booking Sequence</Button>
             </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-neon-cyan rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-display text-white">Synthesizing Travel Directives...</h3>
            <p className="text-gray-400 mt-2 text-sm">Calculating orbital trajectories and securing your clearances.</p>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <div className="w-20 h-20 bg-neon-cyan/20 text-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Booking Confirmed</h2>
            <p className="text-gray-400 mb-2">Passage bound for {finalDest?.name} is secure.</p>
            {formData.catering !== 'None' && <p className="text-sm font-medium text-amber-400 mb-2">Exclusive Catering Included: {formData.catering}</p>}
            <p className="text-xs text-neon-cyan mb-8 font-mono">Total Transacted: ₡{finalPrice.toLocaleString()}</p>
            
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/trips')} variant="secondary">View My Trips</Button>
              <Button onClick={() => navigate('/book')} variant="ghost">Book Another</Button>
            </div>
          </motion.div>
        )}
        
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center relative z-10">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple via-black to-black opacity-30 animate-[spin_5s_linear_infinite] -z-10 rounded-2xl scale-150 blur-xl pointer-events-none"></div>
             
             <h2 className="text-4xl font-display font-bold text-white mb-2 neon-text-purple">WORMHOLE LINK ESTABLISHED</h2>
             <p className="text-neon-purple/80 mb-2 tracking-widest text-sm uppercase">Coordinates locked for {finalDest?.name}</p>
             {formData.catering !== 'None' && <p className="text-sm font-medium text-amber-400 mt-4 mb-2">Wormhole Catering Loaded: {formData.catering}</p>}
             <p className="text-xs text-white mb-8 mt-2 font-mono">Deducted ₡{finalPrice.toLocaleString()}</p>
             
             <div className="flex justify-center gap-4 mt-12">
              <Button onClick={() => navigate('/trips')} variant="secondary">View Tickets</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Booking;
