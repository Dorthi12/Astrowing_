import React, { useState, useMemo, useEffect, useCallback } from 'react';
import planetsData from '../data/planets.json';
import PlanetCard from '../components/planet/PlanetCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Sparkles, Lock, Trophy, X, Activity, AlertTriangle, Ticket, CheckCircle, Wallet, History, Rocket, MapPin } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CLASS_CONFIGS = {
    'Economy':     { multiplier: 1.0, fee: 150,  desc: 'Standard Pod',   color: 'text-gray-300' },
    'First Class': { multiplier: 1.8, fee: 500,  desc: 'View Port',      color: 'text-neon-cyan' },
    'Cryo-Sleep':  { multiplier: 1.2, fee: 300,  desc: 'Long Haul',      color: 'text-blue-400' },
    'VIP':         { multiplier: 3.5, fee: 1200, desc: 'Command Deck',   color: 'text-amber-400' }
};

const CURRENCIES = {
    'USD': { symbol: '$',  rate: 1.0 },
    'INR': { symbol: '₹', rate: 83.5 },
    'JPY': { symbol: '¥', rate: 155.0 }
};

const fmt = (amount, currency) => {
    const { symbol, rate } = CURRENCIES[currency];
    return `${symbol}${(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const generateTicketId = () => `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// ─── Spaceship Journey Animation ──────────────────────────────────────────────
const JourneyAnimation = ({ planet, onComplete }) => {
    const [progress, setProgress]         = useState(0);
    const [lyTravelled, setLyTravelled]   = useState(0);
    const [velocity, setVelocity]         = useState(0);
    const totalLY = 4.24; // approximate to Proxima Centauri
    const DURATION_MS = 7000;

    useEffect(() => {
        const interval = 60;
        const steps    = DURATION_MS / interval;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const p = Math.min((step / steps) * 100, 100);
            const eased = (-Math.cos(Math.PI * p / 100) + 1) / 2; // ease-in-out
            setProgress(p);
            setLyTravelled(parseFloat((eased * totalLY).toFixed(4)));
            setVelocity(parseFloat((0.12 * Math.sin((p / 100) * Math.PI)).toFixed(4)));
            if (p >= 100) {
                clearInterval(timer);
                setTimeout(onComplete, 1200);
            }
        }, interval);
        return () => clearInterval(timer);
    }, [onComplete]);

    const stars = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 2
        })), []);

    return (
        <div className="w-full space-y-8 py-4">
            {/* Warp-speed star field */}
            <div className="relative w-full h-16 overflow-hidden rounded-xl bg-black/40">
                <svg className="absolute inset-0 w-full h-full">
                    {stars.map(s => (
                        <motion.line
                            key={s.id}
                            x1={`${s.x}%`} y1={`${s.y}%`}
                            x2={`${s.x + 8}%`} y2={`${s.y}%`}
                            stroke="rgba(0,240,255,0.6)"
                            strokeWidth={s.size * 0.5}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: s.delay, ease: 'linear' }}
                        />
                    ))}
                </svg>
            </div>

            {/* Progress track */}
            <div className="space-y-3">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-mono">
                    <span>Sol System</span>
                    <span>{planet.name}</span>
                </div>
                <div className="relative w-full h-2 bg-white/5 rounded-full overflow-visible">
                    <motion.div
                        className="absolute top-0 left-0 h-full rounded-full bg-neon-cyan shadow-[0_0_12px_#0ff0fc]"
                        style={{ width: `${progress}%`, transition: 'width 0.06s linear' }}
                    />
                    {/* Rocket icon */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 z-10 drop-shadow-[0_0_6px_#0ff0fc]"
                        style={{ left: `calc(${progress}% - 12px)`, transition: 'left 0.06s linear' }}
                    >
                        <Rocket size={18} className="text-neon-cyan -rotate-90" />
                    </motion.div>
                </div>
                <div className="text-center text-2xl font-mono font-bold text-neon-cyan">
                    {progress.toFixed(1)}%
                </div>
            </div>

            {/* Live telemetry */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 bg-white/5 border-white/10 text-center">
                    <span className="text-[9px] text-gray-500 uppercase block mb-1 font-bold tracking-widest">Warp Velocity</span>
                    <span className="text-2xl font-mono text-neon-purple">{velocity.toFixed(4)}c</span>
                </div>
                <div className="glass-panel p-4 bg-white/5 border-white/10 text-center">
                    <span className="text-[9px] text-gray-500 uppercase block mb-1 font-bold tracking-widest">Travelled</span>
                    <span className="text-2xl font-mono text-neon-cyan">{lyTravelled.toFixed(4)} LY</span>
                </div>
                <div className="col-span-2 glass-panel p-3 bg-white/5 border-white/10 text-center">
                    <span className="text-[9px] text-gray-500 uppercase block mb-1 font-bold tracking-widest">ETA to {planet.name}</span>
                    <span className="text-lg font-mono text-white">
                        {progress < 100 ? `${((1 - progress / 100) * (DURATION_MS / 1000)).toFixed(1)}s` : 'Arrived'}
                    </span>
                </div>
            </div>

            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[10px] text-center text-gray-500 uppercase tracking-widest"
            >
                {progress < 100 ? 'Warp Drive Active — Synchronizing Neural Grid' : 'Engaging Docking Protocol...'}
            </motion.p>
        </div>
    );
};

// ─── Planet Profile Modal ─────────────────────────────────────────────────────
const PlanetProfileModal = ({ planet, onClose, onBook, dijkstraCost = null }) => {
    const [step, setStep]         = useState('profile');    // profile | booking | success | traveling | completed
    const [classType, setClassType] = useState('Economy');
    const [passengers, setPassengers] = useState(1);
    const [ticketId]              = useState(generateTicketId);

    const cfg       = CLASS_CONFIGS[classType];
    const basePrice = dijkstraCost ?? planet.price;
    const subtotal  = basePrice * cfg.multiplier * passengers;
    const total     = subtotal + cfg.fee;

    const handleInitiateBooking = useCallback(() => {
        const session = {
            id:          ticketId,
            planetId:    planet.id,
            planetName:  planet.name,
            classType,
            passengers,
            total,
            date:        new Date().toISOString()
        };
        // Save to localStorage immediately so "My Trips" sees it
        const prev = JSON.parse(localStorage.getItem('starport_sessions') || '[]');
        localStorage.setItem('starport_sessions', JSON.stringify([session, ...prev].slice(0, 20)));
        onBook(session);
        setStep('success');
        // Transition to journey after 3s
        setTimeout(() => setStep('traveling'), 3000);
    }, [classType, passengers, planet, ticketId, total, onBook]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-white/10 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <X size={20} className="text-gray-400" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* ── Left Panel ── */}
                    <div className="p-8 md:p-10 bg-gradient-to-br from-black/40 to-transparent">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square flex items-center justify-center mb-8">
                            <div className={`absolute inset-4 rounded-full blur-[80px] opacity-30 bg-gradient-to-br ${planet.color}`} />
                            <div className={`w-3/4 h-3/4 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center overflow-hidden relative`}>
                                {planet.image && <img src={planet.image} alt={planet.name} className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80" />}
                            </div>
                        </motion.div>

                        <div className="space-y-4">
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neon-cyan">Metrics Matrix</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <span className="text-[9px] text-gray-500 uppercase block mb-1">Gravity</span>
                                    <span className="text-sm font-mono text-white">0.92G</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <span className="text-[9px] text-gray-500 uppercase block mb-1">Temp</span>
                                    <span className="text-sm font-mono text-white">-14°C</span>
                                </div>
                            </div>
                            <div className="p-4 bg-neon-purple/5 border border-neon-purple/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={14} className="text-neon-purple" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neon-purple">Atmospheric Composition</span>
                                </div>
                                <div className="flex h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[70%] bg-neon-purple" />
                                    <div className="w-[20%] bg-blue-400" />
                                    <div className="w-[10%] bg-gray-400" />
                                </div>
                                <div className="flex justify-between text-[8px] text-gray-500 mt-1 uppercase">
                                    <span>N₂ 70%</span><span>O₂ 20%</span><span>Other 10%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="p-8 md:p-10 bg-white/[0.02] flex items-center justify-center min-h-[500px]">
                        <AnimatePresence mode="wait">

                            {/* PROFILE */}
                            {step === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                                    <div className="mb-6">
                                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                                            Sector: {planet.galaxy}
                                        </span>
                                        <h2 className="text-4xl font-display font-bold text-white mb-2">{planet.name}</h2>
                                        <p className="text-gray-400 leading-relaxed italic border-l-2 border-neon-cyan/30 pl-4 py-1 text-sm">
                                            "{planet.shortDesc}"
                                        </p>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3 flex items-center gap-2">
                                                <AlertTriangle size={12} className={planet.risks?.Overall > 60 ? 'text-red-500' : 'text-green-500'} />
                                                Hazard Assessment
                                            </h4>
                                            <div className="space-y-3">
                                                {Object.entries(planet.risks || {}).map(([k, v]) => k !== 'Overall' && (
                                                    <div key={k}>
                                                        <div className="flex justify-between text-[10px] text-gray-400 uppercase mb-1">
                                                            <span>{k}</span><span>{v}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }}
                                                                className={`h-full ${v > 70 ? 'bg-red-500' : 'bg-neon-cyan'}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Planetary Lore</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                {planet.lore || "No historical records available for this celestial body."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                                        <div>
                                            <span className="text-[9px] text-gray-500 uppercase block font-bold mb-1">
                                                {dijkstraCost ? 'Cheapest Fare (Dijkstra)' : 'Base Price'}
                                            </span>
                                            <span className="text-2xl font-mono font-bold text-neon-purple">₡{basePrice?.toLocaleString()}</span>
                                            {dijkstraCost && <span className="text-[9px] text-green-400 block">Optimal Route Found ✓</span>}
                                        </div>
                                        <button onClick={() => setStep('booking')}
                                            className="flex-grow py-4 bg-neon-cyan text-black rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2">
                                            <Ticket size={18} /> Book Journey
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* BOOKING */}
                            {step === 'booking' && (
                                <motion.div key="booking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                                    <div className="mb-6">
                                        <button onClick={() => setStep('profile')} className="text-[10px] text-neon-cyan uppercase font-bold mb-3 hover:underline">
                                            ← Back to Profile
                                        </button>
                                        <h2 className="text-3xl font-display font-bold text-white mb-1">Reserve Transit</h2>
                                        <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">Route: Sol System → {planet.name}</p>
                                    </div>

                                    {/* Class cards */}
                                    <div className="mb-4">
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Class Selection</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(CLASS_CONFIGS).map(([name, c]) => (
                                                <button key={name} onClick={() => setClassType(name)}
                                                    className={`p-3 rounded-xl border text-left transition-all ${classType === name ? 'bg-neon-cyan/10 border-neon-cyan' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                                    <span className={`block text-xs font-bold uppercase mb-1 ${classType === name ? 'text-neon-cyan' : c.color}`}>{name}</span>
                                                    <span className="text-[10px] text-gray-500 block">{c.desc}</span>
                                                    <span className="text-[10px] text-gray-400">×{c.multiplier} | Fee ₡{c.fee}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div className="mb-4">
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Passenger Group</h4>
                                        <div className="flex h-10 bg-white/5 rounded-xl border border-white/10 p-1">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <button key={n} onClick={() => setPassengers(n)}
                                                    className={`flex-grow rounded-lg text-xs font-bold transition-all ${passengers === n ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:text-white'}`}>
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price breakdown with multi-currency */}
                                    <div className="p-4 bg-black/40 border border-dashed border-white/10 rounded-xl space-y-3 mb-6">
                                        {[['Subtotal', subtotal], ['Service Fee', cfg.fee]].map(([label, val]) => (
                                            <div key={label} className="flex justify-between items-start text-xs font-mono border-b border-white/5 pb-2">
                                                <span className="text-gray-500">{label}</span>
                                                <div className="text-right">
                                                    <div className="text-white">₡{val.toLocaleString()}</div>
                                                    <div className="text-[9px] text-gray-500">
                                                        {fmt(val, 'USD')} | {fmt(val, 'INR')} | {fmt(val, 'JPY')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-start font-bold font-mono pt-1">
                                            <span className="text-xs uppercase text-neon-cyan flex items-center gap-1"><Wallet size={12} /> Total</span>
                                            <div className="text-right">
                                                <div className="text-xl text-neon-cyan">₡{total.toLocaleString()}</div>
                                                <div className="text-[10px] mt-1 space-y-0.5">
                                                    <div className="text-blue-400">{fmt(total, 'USD')} (USD)</div>
                                                    <div className="text-amber-400">{fmt(total, 'INR')} (INR)</div>
                                                    <div className="text-rose-400">{fmt(total, 'JPY')} (JPY)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleInitiateBooking}
                                        className="w-full py-4 bg-neon-purple text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2">
                                        Initiate Transaction
                                    </button>
                                </motion.div>
                            )}

                            {/* SUCCESS */}
                            {step === 'success' && (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="w-full flex flex-col items-center text-center space-y-5 py-10">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center relative">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                            <CheckCircle size={48} className="text-green-500" />
                                        </motion.div>
                                        <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping opacity-20" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Manifest Confirmed</h2>
                                    <p className="text-gray-400 text-sm max-w-xs">
                                        Reservation for <strong>{planet.name}</strong> synchronized. Boarding in progress.
                                    </p>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] space-y-1">
                                        <p className="text-gray-500 uppercase tracking-widest">Digital Ticket ID</p>
                                        <p className="text-neon-cyan uppercase">{ticketId}</p>
                                    </div>
                                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="text-[10px] text-neon-purple uppercase tracking-widest">
                                        Preparing Warp Drive...
                                    </motion.p>
                                </motion.div>
                            )}

                            {/* TRAVELING */}
                            {step === 'traveling' && (
                                <motion.div key="traveling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                                    <h2 className="text-2xl font-display font-bold text-white text-center mb-1 uppercase tracking-widest">In Transit</h2>
                                    <p className="text-[10px] text-gray-500 text-center mb-6 uppercase tracking-[0.3em]">
                                        Sol System → {planet.name}
                                    </p>
                                    <JourneyAnimation planet={planet} onComplete={() => setStep('completed')} />
                                </motion.div>
                            )}

                            {/* COMPLETED */}
                            {step === 'completed' && (
                                <motion.div key="completed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col items-center text-center space-y-5 py-10">
                                    <div className="w-24 h-24 bg-neon-cyan/20 rounded-full flex items-center justify-center border-2 border-neon-cyan/50">
                                        <MapPin size={40} className="text-neon-cyan" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Arrival Successful</h2>
                                    <p className="text-gray-400 text-sm max-w-xs">
                                        Journey to <strong>{planet.name}</strong> complete. All systems nominal. Your trip has been logged.
                                    </p>
                                    <button onClick={onClose}
                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                        Close Manifest
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Explore Page ─────────────────────────────────────────────────────────────
const Explore = () => {
    const { currentUser, unlockPlanet } = useAppContext();
    const [filter, setFilter]         = useState('All');
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);

    const categories = ['All', 'Terrestrial', 'Terraformed', 'Super-Earth', 'Oceanic', 'Volcanic', 'Ice'];

    useEffect(() => {
        const saved = localStorage.getItem('starport_sessions');
        if (saved) try { setRecentSessions(JSON.parse(saved)); } catch (e) {}
    }, []);

    const filteredPlanets = useMemo(() =>
        filter === 'All' ? planetsData.planets : planetsData.planets.filter(p => p.type === filter),
    [filter]);

    const recommendation = useMemo(() => {
        if (!currentUser?.dna) return null;
        const unlocked = planetsData.planets.filter(p => currentUser.unlockedPlanets?.includes(p.id));
        if (!unlocked.length) return planetsData.planets[0];
        return unlocked.sort((a, b) => (b.compatibility?.[currentUser.dna.species] || 50) - (a.compatibility?.[currentUser.dna.species] || 50))[0];
    }, [currentUser]);

    const handleNewBooking = useCallback((session) => {
        setRecentSessions(prev => {
            const updated = [session, ...prev].slice(0, 5);
            localStorage.setItem('starport_sessions', JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto px-4 lg:px-8">

                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Galactic Destinations</h1>
                        <p className="text-gray-400">Scan the known sectors for your next warp destination. Core database synchronized with galactic hub telemetry.</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[280px]">
                        <AnimatePresence>
                            {recommendation && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel p-4 border-neon-purple/30 bg-neon-purple/5 flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0 animate-pulse">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-neon-purple tracking-widest block">Neural Recommendation</span>
                                        <p className="text-xs text-white">Optimal: <span className="text-neon-cyan">{recommendation.name}</span></p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {recentSessions.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-4 border-white/10 bg-white/5">
                                <div className="flex items-center gap-2 mb-3 text-neon-cyan">
                                    <History size={13} />
                                    <span className="text-[9px] uppercase font-bold tracking-widest">Recent Reservations</span>
                                </div>
                                <div className="space-y-2">
                                    {recentSessions.map(s => (
                                        <div key={s.id} className="flex justify-between text-[10px] border-l border-neon-cyan/30 pl-2">
                                            <div>
                                                <span className="text-white font-bold block">{s.planetName}</span>
                                                <span className="text-gray-500">{s.classType}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-neon-cyan font-mono block">₡{s.total?.toLocaleString()}</span>
                                                <span className="text-gray-600">{s.id?.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
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
                        <button key={cat} onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                                filter === cat
                                    ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Planet Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlanets.map(planet => {
                        const isUnlocked     = currentUser?.unlockedPlanets?.includes(planet.id);
                        const hasSession     = recentSessions.some(s => s.planetId === planet.id);

                        return (
                            <div key={planet.id} className="relative group">
                                {!isUnlocked && currentUser && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[4px] rounded-xl border border-neon-cyan/20 p-6 text-center">
                                        <Lock size={32} className="text-neon-cyan mb-4 animate-pulse" />
                                        <span className="text-xs text-white uppercase tracking-[0.2em] font-bold mb-1">Encrypted Sector</span>
                                        <span className="text-[10px] text-gray-500 uppercase mb-4">Discovery Authorization Required</span>
                                        <button onClick={() => unlockPlanet(planet.id)}
                                            className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded text-[10px] font-bold uppercase hover:bg-neon-cyan hover:text-black transition-all">
                                            Decrypt ₡100
                                        </button>
                                    </motion.div>
                                )}

                                {hasSession && (
                                    <div className="absolute top-4 left-4 z-10 bg-neon-cyan/20 backdrop-blur-md border border-neon-cyan/50 text-neon-cyan text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                                        Session Active
                                    </div>
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
                        onBook={handleNewBooking}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Explore;
