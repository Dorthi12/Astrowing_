/**
 * BookingModalWrapper
 * 
 * A standalone wrapper that re-exposes the PlanetProfileModal's booking flow,
 * so that both MapView and Explore can use the same booking experience
 * without circular imports.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Activity, Ticket, CheckCircle, Wallet, Rocket, MapPin } from 'lucide-react';

const CLASS_CONFIGS = {
    'Economy':     { multiplier: 1.0, fee: 150,  desc: 'Standard Pod',  color: 'text-gray-300'  },
    'First Class': { multiplier: 1.8, fee: 500,  desc: 'View Port',     color: 'text-neon-cyan' },
    'Cryo-Sleep':  { multiplier: 1.2, fee: 300,  desc: 'Long Haul',     color: 'text-blue-400'  },
    'VIP':         { multiplier: 3.5, fee: 1200, desc: 'Command Deck',  color: 'text-amber-400' }
};

const CURRENCIES = {
    'USD': { symbol: '$',  rate: 1.0   },
    'INR': { symbol: '₹', rate: 83.5  },
    'JPY': { symbol: '¥', rate: 155.0 }
};

const fmt = (amount, currency) => {
    const { symbol, rate } = CURRENCIES[currency];
    return `${symbol}${(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const generateTicketId = () => `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// ─── Journey Animation ────────────────────────────────────────────────────────
const JourneyAnimation = ({ planet, onComplete }) => {
    const [progress, setProgress]       = React.useState(0);
    const [lyTravelled, setLyTravelled] = React.useState(0);
    const [velocity, setVelocity]       = React.useState(0);
    const totalLY    = 4.24;
    const DURATION   = 7000;

    React.useEffect(() => {
        const interval = 60;
        const steps    = DURATION / interval;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const p     = Math.min((step / steps) * 100, 100);
            const eased = (-Math.cos(Math.PI * p / 100) + 1) / 2;
            setProgress(p);
            setLyTravelled(parseFloat((eased * totalLY).toFixed(4)));
            setVelocity(parseFloat((0.12 * Math.sin((p / 100) * Math.PI)).toFixed(4)));
            if (p >= 100) { clearInterval(timer); setTimeout(onComplete, 1200); }
        }, interval);
        return () => clearInterval(timer);
    }, [onComplete]);

    const stars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5, delay: Math.random() * 2
    })), []);

    return (
        <div className="w-full space-y-6 py-4">
            {/* Warp starfield */}
            <div className="relative w-full h-12 overflow-hidden rounded-xl bg-black/40">
                <svg className="absolute inset-0 w-full h-full">
                    {stars.map(s => (
                        <motion.line key={s.id}
                            x1={`${s.x}%`} y1={`${s.y}%`} x2={`${s.x + 10}%`} y2={`${s.y}%`}
                            stroke="rgba(0,240,255,0.6)" strokeWidth={s.size * 0.5}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.45, delay: s.delay, ease: 'linear' }}
                        />
                    ))}
                </svg>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-[9px] text-gray-500 uppercase font-mono">
                    <span>Sol System</span><span>{planet.name}</span>
                </div>
                <div className="relative w-full h-2 bg-white/5 rounded-full overflow-visible">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-neon-cyan shadow-[0_0_12px_#0ff0fc]"
                        style={{ width: `${progress}%`, transition: 'width 0.06s linear' }} />
                    <div className="absolute top-1/2 -translate-y-1/2 z-10"
                        style={{ left: `calc(${progress}% - 12px)`, transition: 'left 0.06s linear' }}>
                        <Rocket size={18} className="text-neon-cyan -rotate-90" />
                    </div>
                </div>
                <p className="text-center text-2xl font-mono font-bold text-neon-cyan">{progress.toFixed(1)}%</p>
            </div>

            {/* Telemetry */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    ['Velocity', `${velocity.toFixed(4)}c`, 'text-neon-purple'],
                    ['Travelled', `${lyTravelled.toFixed(4)} LY`, 'text-neon-cyan'],
                    ['ETA', progress < 100 ? `${((1 - progress / 100) * (DURATION / 1000)).toFixed(1)}s` : 'Arrived', 'text-white']
                ].map(([label, val, cls]) => (
                    <div key={label} className="glass-panel p-3 bg-white/5 border-white/10 text-center">
                        <span className="text-[8px] text-gray-500 uppercase block mb-1 font-bold">{label}</span>
                        <span className={`text-sm font-mono font-bold ${cls}`}>{val}</span>
                    </div>
                ))}
            </div>

            <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
                className="text-[9px] text-center text-gray-500 uppercase tracking-widest">
                {progress < 100 ? 'Warp Drive Active — Synchronizing Neural Grid' : 'Engaging Docking Protocol...'}
            </motion.p>
        </div>
    );
};

// ─── Booking Modal Wrapper ────────────────────────────────────────────────────
const BookingModalWrapper = ({ planet, dijkstraCost = null, onClose }) => {
    const [step, setStep]             = useState('profile');
    const [classType, setClassType]   = useState('Economy');
    const [passengers, setPassengers] = useState(1);
    const [ticketId]                  = useState(generateTicketId);

    const cfg       = CLASS_CONFIGS[classType];
    const basePrice = dijkstraCost ?? planet.price;
    const subtotal  = basePrice * cfg.multiplier * passengers;
    const total     = subtotal + cfg.fee;

    const handleInitiateBooking = useCallback(() => {
        const session = {
            id: ticketId, planetId: planet.id, planetName: planet.name,
            classType, passengers, total, date: new Date().toISOString()
        };
        const prev = JSON.parse(localStorage.getItem('starport_sessions') || '[]');
        localStorage.setItem('starport_sessions', JSON.stringify([session, ...prev].slice(0, 20)));
        setStep('success');
        setTimeout(() => setStep('traveling'), 3000);
    }, [classType, passengers, planet, ticketId, total]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-white/10 relative"
                onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10">
                    <X size={18} className="text-gray-400" />
                </button>

                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        {/* PROFILE */}
                        {step === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="mb-6">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Sector: {planet.galaxy}</span>
                                    <h2 className="text-3xl font-display font-bold text-white mb-2">{planet.name}</h2>
                                    <p className="text-sm text-gray-400 italic border-l-2 border-neon-cyan/30 pl-3">"{planet.shortDesc}"</p>
                                </div>
                                <div className="my-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-[9px] text-gray-500 uppercase block mb-1">
                                                {dijkstraCost ? 'Cheapest Fare (Dijkstra)' : 'Base Price'}
                                            </span>
                                            <span className="text-3xl font-mono font-bold text-neon-purple">₡{basePrice?.toLocaleString()}</span>
                                            {dijkstraCost && <span className="text-[9px] text-green-400 block mt-1">✓ Optimal Route Calculated</span>}
                                        </div>
                                        <div className="text-right text-[10px] space-y-1 text-gray-400">
                                            <div>{fmt(basePrice, 'USD')} USD</div>
                                            <div>{fmt(basePrice, 'INR')} INR</div>
                                            <div>{fmt(basePrice, 'JPY')} JPY</div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setStep('booking')}
                                    className="w-full py-4 bg-neon-cyan text-black rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2">
                                    <Ticket size={18} /> Book This Journey
                                </button>
                            </motion.div>
                        )}

                        {/* BOOKING */}
                        {step === 'booking' && (
                            <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <button onClick={() => setStep('profile')} className="text-[10px] text-neon-cyan uppercase font-bold mb-4 hover:underline">← Back</button>
                                <h2 className="text-2xl font-display font-bold text-white mb-1">Reserve Transit</h2>
                                <p className="text-xs text-gray-500 font-mono mb-6 uppercase tracking-wider">Route: Sol System → {planet.name}</p>

                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    {Object.entries(CLASS_CONFIGS).map(([name, c]) => (
                                        <button key={name} onClick={() => setClassType(name)}
                                            className={`p-3 rounded-xl border text-left transition-all ${classType === name ? 'bg-neon-cyan/10 border-neon-cyan' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                            <span className={`block text-xs font-bold uppercase mb-1 ${classType === name ? 'text-neon-cyan' : c.color}`}>{name}</span>
                                            <span className="text-[10px] text-gray-500 block">{c.desc}</span>
                                            <span className="text-[10px] text-gray-400">×{c.multiplier} | Fee ₡{c.fee}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex h-10 bg-white/5 rounded-xl border border-white/10 p-1 mb-5">
                                    {[1,2,3,4,5].map(n => (
                                        <button key={n} onClick={() => setPassengers(n)}
                                            className={`flex-grow rounded-lg text-xs font-bold transition-all ${passengers === n ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:text-white'}`}>
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 bg-black/40 border border-dashed border-white/10 rounded-xl space-y-3 mb-6">
                                    {[['Subtotal', subtotal], ['Service Fee', cfg.fee]].map(([label, val]) => (
                                        <div key={label} className="flex justify-between text-xs font-mono border-b border-white/5 pb-2">
                                            <span className="text-gray-500">{label}</span>
                                            <div className="text-right">
                                                <div className="text-white">₡{val.toLocaleString()}</div>
                                                <div className="text-[9px] text-gray-500">{fmt(val,'USD')} | {fmt(val,'INR')} | {fmt(val,'JPY')}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-start font-mono">
                                        <span className="text-xs font-bold text-neon-cyan flex items-center gap-1"><Wallet size={11}/> Total</span>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-neon-cyan">₡{total.toLocaleString()}</div>
                                            <div className="text-[10px] mt-1 space-y-0.5">
                                                <div className="text-blue-400">{fmt(total,'USD')} USD</div>
                                                <div className="text-amber-400">{fmt(total,'INR')} INR</div>
                                                <div className="text-rose-400">{fmt(total,'JPY')} JPY</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleInitiateBooking}
                                    className="w-full py-4 bg-neon-purple text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center">
                                    Initiate Transaction
                                </button>
                            </motion.div>
                        )}

                        {/* SUCCESS */}
                        {step === 'success' && (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center text-center space-y-5 py-10">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center relative">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                        <CheckCircle size={48} className="text-green-500" />
                                    </motion.div>
                                    <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping opacity-20" />
                                </div>
                                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Manifest Confirmed</h2>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    Reservation for <strong>{planet.name}</strong> synchronized. Added to My Trips.
                                </p>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] space-y-1">
                                    <p className="text-gray-500 uppercase">Ticket ID</p>
                                    <p className="text-neon-cyan uppercase">{ticketId}</p>
                                </div>
                                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="text-[10px] text-neon-purple uppercase tracking-widest">Preparing Warp Drive...</motion.p>
                            </motion.div>
                        )}

                        {/* TRAVELING */}
                        {step === 'traveling' && (
                            <motion.div key="traveling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h2 className="text-2xl font-display font-bold text-white text-center mb-1 uppercase tracking-widest">In Transit</h2>
                                <p className="text-[9px] text-gray-500 text-center mb-6 uppercase tracking-[0.3em]">Sol System → {planet.name}</p>
                                <JourneyAnimation planet={planet} onComplete={() => setStep('completed')} />
                            </motion.div>
                        )}

                        {/* COMPLETED */}
                        {step === 'completed' && (
                            <motion.div key="completed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-5 py-10">
                                <div className="w-24 h-24 bg-neon-cyan/20 rounded-full flex items-center justify-center border-2 border-neon-cyan/50">
                                    <MapPin size={40} className="text-neon-cyan" />
                                </div>
                                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Arrival Successful</h2>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    Journey to <strong>{planet.name}</strong> complete. Trip logged in My Trips.
                                </p>
                                <button onClick={onClose}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                    Close Manifest
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BookingModalWrapper;
