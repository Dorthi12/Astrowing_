import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, MapPin, Gauge, Shield, Clock, Zap, AlertCircle } from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { planetService } from '../services';
import Loader from '../components/ui/Loader';

const FlightTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookingContext();
  
  const booking = bookings.find(b => b.id.toString() === id);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('DOCKING');
  const [logs, setLogs] = useState(['Transmitting manifest to sector control...']);
  const [originPlanet, setOriginPlanet] = useState(null);
  const [destPlanet, setDestPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch planet data
  useEffect(() => {
    const fetchPlanets = async () => {
      if (!booking) return;
      try {
        const allPlanets = await planetService.getAllPlanets();
        const planets = allPlanets.planets || [];
        const origin = planets.find(p => p.id === booking.fromPlanetId);
        const dest = planets.find(p => p.id === booking.toPlanetId);
        setOriginPlanet(origin);
        setDestPlanet(dest);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch planets:', err);
        setIsLoading(false);
      }
    };
    fetchPlanets();
  }, [booking]);

  // Progress simulation
  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('ARRIVED');
          return 100;
        }
        
        const newProgress = prev + (Math.random() * 2 + 0.5);
        
        // Update status messages
        if (newProgress > 10 && status === 'DOCKING') {
          setStatus('ACCELERATING');
          setLogs(prevLogs => ['Main thrusters engaged. Exit orbit.', ...prevLogs]);
        }
        if (newProgress > 40 && status === 'ACCELERATING') {
          setStatus('WORMHOLE_TRANSIT');
          setLogs(prevLogs => ['Entering wormhole corridor. Temporal shifts detected.', ...prevLogs]);
        }
        if (newProgress > 80 && status === 'WORMHOLE_TRANSIT') {
          setStatus('DECELERATING');
          setLogs(prevLogs => ['Re-entering real space. Matching orbital speed.', ...prevLogs]);
        }

        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [booking, status]);

  if (isLoading) {
    return <Loader />;
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl text-white mb-4">Flight Link Severed</h2>
        <button
          onClick={() => navigate('/trips')}
          className="px-6 py-2 bg-neon-cyan text-black rounded-lg font-bold hover:scale-[1.05] transition-all"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Flight Track: #{booking.id}</h1>
          <p className="text-gray-400 font-mono text-sm">EN-ROUTE TO {destPlanet?.name?.toUpperCase() || 'DESTINATION'}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${status === 'ARRIVED' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan animate-pulse'}`}>
          <Rocket size={16} />
          <span className="text-xs font-bold font-mono uppercase tracking-[0.2em]">{status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time Map Visual */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden aspect-video bg-[#050510] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1e3a8a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="relative h-full flex items-center justify-between px-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <MapPin size={24} />
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-300 font-mono">{originPlanet?.name || 'ORIGIN'}</span>
              </div>

              <div className="flex-1 relative h-px bg-white/10 mx-4">
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 z-20"
                  animate={{ left: `${progress}%` }}
                  transition={{ type: "tween", ease: "linear" }}
                >
                  <Rocket className="text-neon-cyan rotate-90 drop-shadow-[0_0_10px_#0ff0fc]" size={24} />
                  <motion.div 
                    animate={{ width: [0, 40], opacity: [0, 1, 0], scale: [1, 1.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent to-neon-cyan"
                  />
                </motion.div>
                <div className="absolute inset-y-0 left-0 bg-neon-cyan/30" style={{ width: `${progress}%` }}></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-1000 ${progress === 100 ? 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-white/20 text-white/40'}`}>
                  <MapPin size={24} />
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">{destPlanet?.name || 'DESTINATION'}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/50 px-3 py-1 rounded-md text-neon-cyan text-[10px] font-bold uppercase">
              <Rocket size={12} />
              {progress.toFixed(0)}% Complete
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
              <Gauge size={20} className="text-neon-cyan mb-2" />
              <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Velocity</span>
              <span className="text-sm font-mono text-white">0.98c</span>
            </div>
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
              <Shield size={20} className="text-emerald-400 mb-2" />
              <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Hull Integrity</span>
              <span className="text-sm font-mono text-white">99.4%</span>
            </div>
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
              <Clock size={20} className="text-amber-400 mb-2" />
              <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Arrival Est.</span>
              <span className="text-sm font-mono text-white">{Math.max(0, 100 - Math.floor(progress))}s</span>
            </div>
          </div>
        </div>

        {/* Console Logs & DNA */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-white/10 h-64 overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={14} className="text-neon-cyan" /> Ship Logs
            </h3>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 text-neon-cyan/60">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Flight Details</h3>
            <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Flight ID</span>
                <span className="text-[10px] font-bold font-mono text-neon-cyan">#{booking.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Passengers</span>
                <span className="text-[10px] font-bold text-white">{booking.numberOfPassengers || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Booked Date</span>
                <span className="text-[10px] font-bold font-mono text-white">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {status === 'ARRIVED' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <button
                onClick={() => navigate('/trips')}
                className="w-full py-3 bg-neon-cyan text-black rounded-lg font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Finalize Landing
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FlightTracking;
