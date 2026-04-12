import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, ScanEye, Biohazard, Activity, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const AlienAuth = () => {
    const { login, register, isLoading, error, clearError } = useUserContext();
    const [authMode, setAuthMode] = useState('login');
    const [isAnimating, setIsAnimating] = useState(false);
    const [phase, setPhase] = useState('input'); // input, validating, flying
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        species: 'humanoid',
    });
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frameId;
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const numStars = 800;
        const stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * width,
                ox: 0, oy: 0,
                vx: 0, vy: 0 
            });
        }

        let planets = [
            { name: "Nebula Sector 7", color: 'rgba(176, 38, 255, 0.4)', y: -200, x: width * 0.3 },
            { name: "Event Horizon", color: 'rgba(0, 240, 255, 0.3)', y: -800, x: width * 0.7 },
        ];

        let ship = { x: width/2, y: height + 100, scale: 0.1 };
        let tick = 0;

        const render = () => {
            if (isAnimating) tick++;
            
            ctx.fillStyle = '#020205';
            ctx.fillRect(0, 0, width, height);

            let speedY = isAnimating ? 2 : 0.5;
            let blurTrails = false;
            let radialWarp = false;

            // ANIMATION PHASES - EXTENDED SHORT FILM
            if (isAnimating) {
                if (tick < 100) {
                    if (phase !== 'validating') setPhase('validating');
                    speedY = 1.5; 
                    ship.y -= (ship.y - (height - 300)) * 0.05;
                    ship.scale = Math.min(1.4, ship.scale + 0.01);
                } else if (tick < 250) {
                    if (phase !== 'nebula') setPhase('nebula');
                    speedY = 10 + (tick - 100) * 0.2;
                    blurTrails = true;
                    // Draw Nebula Clouds
                    const grad = ctx.createRadialGradient(width*0.2, (tick*5)%height, 0, width*0.2, (tick*5)%height, 600);
                    grad.addColorStop(0, 'rgba(176, 38, 255, 0.15)');
                    grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, width, height);
                } else if (tick < 450) {
                    // GALAXY CLUSTERS
                    speedY = 40;
                    blurTrails = true;
                    const drawGalaxy = (gx, gy, size, color) => {
                        ctx.save();
                        ctx.translate(gx, gy);
                        ctx.rotate(tick * 0.02);
                        for (let i = 0; i < 3; i++) {
                            ctx.rotate(Math.PI * 2 / 3);
                            const gGrad = ctx.createRadialGradient(0, 0, 0, size/2, 0, size);
                            gGrad.addColorStop(0, color);
                            gGrad.addColorStop(1, 'transparent');
                            ctx.fillStyle = gGrad;
                            ctx.beginPath();
                            ctx.ellipse(size/2, 0, size, size/4, 0, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    };
                    drawGalaxy(width * 0.7, (tick * 15) % (height * 2) - height, 200, 'rgba(0, 240, 255, 0.2)');
                    drawGalaxy(width * 0.3, ((tick+100) * 12) % (height * 2) - height, 150, 'rgba(255, 100, 200, 0.15)');
                } else if (tick < 650) {
                    // PLANETARY FLY-BY
                    speedY = 25;
                    blurTrails = false;
                    const p1Progress = (tick - 450) / 200;
                    const px = width * 0.5 + (width * 0.6 * Math.sin(p1Progress * Math.PI));
                    const py = -200 + (height + 400) * p1Progress;
                    const pr = 150 + 200 * p1Progress;
                    
                    const pGrad = ctx.createRadialGradient(px, py - pr*0.3, 0, px, py, pr);
                    pGrad.addColorStop(0, '#f97316');
                    pGrad.addColorStop(0.7, '#7c2d12');
                    pGrad.addColorStop(1, '#000');
                    ctx.beginPath();
                    ctx.arc(px, py, pr, 0, Math.PI * 2);
                    ctx.fillStyle = pGrad;
                    ctx.fill();
                    
                    // Planet Atmosphere glow
                    ctx.beginPath();
                    ctx.arc(px, py, pr + 5, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 150, 100, 0.3)';
                    ctx.lineWidth = 10;
                    ctx.stroke();
                } else if (tick < 850) {
                    // BLACK HOLE - SUPER DETAILED
                    radialWarp = true;
                    const bhProgress = Math.min(1, (tick - 650) / 200);
                    const cx = width/2, cy = height/2;
                    const scale = bhProgress * (Math.min(width, height) * 0.35);
                    
                    // Accretion Glow
                    const glow = ctx.createRadialGradient(cx, cy, scale, cx, cy, scale * 5);
                    glow.addColorStop(0, `rgba(255, 200, 100, ${0.4 * bhProgress})`);
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(cx, cy, scale * 5, 0, Math.PI * 2);
                    ctx.fill();

                    // Event Horizon
                    ctx.beginPath();
                    ctx.arc(cx, cy, scale, 0, Math.PI * 2);
                    ctx.fillStyle = '#000';
                    ctx.fill();
                    
                    // Photon Ring
                    ctx.beginPath();
                    ctx.arc(cx, cy, scale * 1.05, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${bhProgress})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Relativistic Jet / Distortion ring
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, scale * 4, scale * 0.3, -0.1 + tick*0.01, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 100, 0, ${0.3 * bhProgress})`;
                    ctx.lineWidth = scale * 0.2;
                    ctx.stroke();
                } else if (tick < 1000) {
                    // HYPERSPACE EXIT
                    speedY = Math.max(0.5, 50 - (tick - 850) * 0.4);
                    radialWarp = false;
                    blurTrails = true;
                } else if (tick < 1150) {
                    // FINAL APPROACH & LANDING
                    const landP = (tick - 1000) / 150;
                    const ly = height + 600 - (1000 * landP);
                    const grad = ctx.createRadialGradient(width/2, ly, 0, width/2, ly, 1200);
                    grad.addColorStop(0, '#0ea5e9'); // Beautiful blue home planet
                    grad.addColorStop(0.4, '#1e3a8a');
                    grad.addColorStop(0.8, '#020205');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(width/2, ly, 1200, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Cloud layer
                    ctx.globalAlpha = 0.2 * landP;
                    ctx.fillStyle = 'white';
                    for(let i=0; i<10; i++) {
                        ctx.beginPath();
                        ctx.ellipse(width/2 + Math.sin(i)*200, ly - 1100 + i*20, 300, 50, 0, 0, Math.PI*2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1;
                    
                    if (landP > 0.9) {
                        setFormError("ORBIT STABILIZED. WELCOME HOME.");
                        // Navigate after animation completes
                        setTimeout(() => navigate('/'), 500);
                    }
                } else {
                    navigate('/');
                    return;
                }
            }

            // STAR FIELD RENDERING
            if (radialWarp) {
                const cx = width/2, cy = height/2;
                stars.forEach(s => {
                    const dx = s.x - cx;
                    const dy = s.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist > 0) {
                        s.x += (dx/dist) * (20 + dist * 0.05);
                        s.y += (dy/dist) * (20 + dist * 0.05);
                    }
                    if (s.x < 0 || s.x > width || s.y < 0 || s.y > height) {
                        s.x = cx + (Math.random()-0.5)*100;
                        s.y = cy + (Math.random()-0.5)*100;
                    }
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(s.x - (s.x-cx)*0.1, s.y - (s.y-cy)*0.1);
                    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                    ctx.stroke();
                });
            } else {
                stars.forEach(s => {
                    s.y += speedY * (width/s.z) * 0.5;
                    if (s.y > height) {
                        s.y = 0; s.x = Math.random() * width;
                    }
                    
                    ctx.beginPath();
                    if (blurTrails) {
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s.x, s.y - speedY);
                        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    } else {
                        ctx.arc(s.x, s.y, s.z < width/4 ? 1.5 : 0.8, 0, Math.PI*2);
                        ctx.fillStyle = 'white';
                        ctx.fill();
                    }
                });
            }

            // SHIP DRAWING - HIGH DETAIL V2
            if (isAnimating && !radialWarp) {
                ctx.save();
                ctx.translate(ship.x, ship.y);
                ctx.scale(ship.scale, ship.scale);
                
                // Thruster Glow
                ctx.beginPath();
                const tGrad = ctx.createRadialGradient(0, 20, 0, 0, 20, 40 + Math.random()*20);
                tGrad.addColorStop(0, '#60a5fa');
                tGrad.addColorStop(0.5, '#2563eb');
                tGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = tGrad;
                ctx.arc(0, 20, 40 + Math.random()*20, 0, Math.PI*2);
                ctx.fill();

                // Rocket Body
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                ctx.moveTo(0, -50);
                ctx.quadraticCurveTo(25, 0, 15, 30);
                ctx.lineTo(-15, 30);
                ctx.quadraticCurveTo(-25, 0, 0, -50);
                ctx.fill();

                // Fins
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(15, 10); ctx.lineTo(35, 35); ctx.lineTo(15, 30); ctx.fill();
                ctx.beginPath();
                ctx.moveTo(-15, 10); ctx.lineTo(-35, 35); ctx.lineTo(-15, 30); ctx.fill();

                // Cockpit Window
                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath();
                ctx.arc(0, -15, 8, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isAnimating, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setFormError('');
        
        try {
            setPhase('validating');
            setIsAnimating(true);
            
            if (authMode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(
                    formData.email,
                    formData.password,
                    formData.firstName,
                    formData.lastName
                );
            }
            
            // Success - animation will complete and navigate
            // The animation timeline will handle the navigation
        } catch (err) {
            setIsAnimating(false);
            setPhase('input');
            setFormError(err?.error || err?.message || 'Authentication failed');
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            />
            
            {/* Scanned Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-1" style={{ 
                backgroundImage: 'linear-gradient(#0ff0fc 1px, transparent 1px), linear-gradient(90deg, #0ff0fc 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <AnimatePresence mode="wait">
                {!isAnimating ? (
                    <motion.div 
                        key="auth-card"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        className="relative z-20 w-full max-w-md p-1"
                    >
                        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <motion.div 
                                    className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/40 flex items-center justify-center mx-auto mb-6 relative"
                                    animate={{ 
                                        boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 20px rgba(34,197,94,0.3)', '0 0 0px rgba(34,197,94,0)']
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <ScanEye size={40} className="text-green-400" />
                                    <motion.div 
                                        className="absolute inset-0 border-2 border-green-400 rounded-full"
                                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                                <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-[0.1em]">STARPORT <span className="text-green-400">PASSPORT</span></h1>
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-mono">Terminal Authentication v2.84</p>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-8">
                                <button 
                                    onClick={() => setAuthMode('login')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${authMode === 'login' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => setAuthMode('register')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${authMode === 'register' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Identify
                                </button>
                            </div>

                            {/* Form */}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {(formError || error) && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
                                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                        <span className="text-sm text-red-300">{formError || error}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-400 font-mono flex items-center gap-2 uppercase">
                                        <Fingerprint size={12} className="text-green-500" /> Entity Identifier (Email)
                                    </label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="explorer@starport.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-400 font-mono flex items-center gap-2 uppercase">
                                        <Biohazard size={12} className="text-green-500" /> Neural Access Key (Password)
                                    </label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-green-400 font-mono text-sm focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all tracking-widest"
                                    />
                                </div>

                                {authMode === 'register' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4 pt-4 border-t border-white/5"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-2 uppercase">
                                                    <Activity size={12} className="text-green-500" /> First Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Explorer"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-xs focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-2 uppercase">
                                                    <Activity size={12} className="text-green-500" /> Last Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Cosmic"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-xs focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-400 font-mono flex items-center gap-2 uppercase">
                                                <Activity size={12} className="text-green-500" /> Biological Group
                                            </label>
                                            <select 
                                                value={formData.species}
                                                onChange={(e) => setFormData({...formData, species: e.target.value})}
                                                className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-white font-mono text-xs focus:outline-none focus:border-green-500 shadow-inner cursor-pointer"
                                            >
                                                <option value="humanoid">Humanoid</option>
                                                <option value="plasma">Plasma Entity</option>
                                                <option value="silicon">Silicon Lifeform</option>
                                                <option value="synthetic">Synthetic Intel</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-green-500 text-black rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} />
                                            {authMode === 'login' ? 'Initiate Scan' : 'Register Traits'}
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-8 text-[9px] text-center text-gray-600 uppercase tracking-widest leading-relaxed">
                                Terminal Security Protocol 44.<br/>
                                Unauthorized Access punishable by Orbit Exile.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'validating' ? 1 : 0 }}
                        className="text-center z-30 pointer-events-none"
                    >
                        <motion.div 
                            className="w-32 h-32 border-4 border-t-green-500 border-r-transparent border-b-green-500 border-l-transparent rounded-full mx-auto mb-8"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <h2 className="text-3xl font-display font-bold text-white mb-2 animate-pulse tracking-widest italic">NEURAL SYNC IN PROGRESS</h2>
                        <p className="text-green-500 font-mono text-xs tracking-[0.5em] uppercase">Securing Flight Corridor...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Phase Labels */}
            <AnimatePresence>
                {isAnimating && phase !== 'validating' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-12 left-12 z-40"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-green-500" />
                            <p className="text-white font-mono text-sm tracking-[0.4em] uppercase">
                                {phase === 'nebula' && 'Transiting: Veil Nebula Cluster'}
                                {phase === 'galaxy' && 'Entering: Andromeda Sector'}
                                {phase === 'planet' && 'Approaching: Xal Colony Hub'}
                                {phase === 'blackhole' && 'WARNING: Event Horizon Detected'}
                                {phase === 'landing' && 'Descend: Port Alpha'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlienAuth;
