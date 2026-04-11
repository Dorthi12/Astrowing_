import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Map, Rocket, User, CalendarDays, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Rocket size={18} /> },
    { name: 'Galactic Map', path: '/map', icon: <Map size={18} /> },
    { name: 'Destinations', path: '/explore', icon: <Compass size={18} /> },
    { name: 'My Trips', path: '/trips', icon: <CalendarDays size={18} /> },
    { name: 'Holo-Net', path: '/community', icon: <Users size={18} /> }
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-b-white/10 rounded-none rounded-b-xl border-x-0 border-t-0 shadow-none bg-space-900/60 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-full border border-neon-cyan flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-neon-cyan/20 group-hover:bg-neon-cyan/40 transition-colors"></div>
            <div className="w-4 h-4 bg-neon-cyan rounded-full animate-pulse-slow shadow-[0_0_10px_#0ff0fc]"></div>
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white group-hover:neon-text-cyan transition-all">
            STARPORT <span className="text-neon-cyan font-light">NEXUS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-all duration-300 relative py-2 ${
                  isActive ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-neon-cyan shadow-[0_0_8px_#0ff0fc]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          <Link to="/book" className="ml-4 px-6 py-2 rounded-full border border-neon-purple text-neon-purple font-medium text-sm tracking-wider uppercase hover:bg-neon-purple hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)]">
            Book Travel
          </Link>
          <Link to="/auth" className="w-9 h-9 flex-shrink-0 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_#22c55e] transition-all duration-300" title="Entity Recognition">
            <User size={16} />
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-panel rounded-none border-x-0 border-b-0 absolute top-full left-0 w-full bg-space-900/95 py-4 flex flex-col"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="px-6 py-4 border-b border-white/5 flex items-center gap-3 text-sm tracking-widest uppercase hover:bg-white/5"
            >
              <span className={location.pathname === link.path ? 'text-neon-cyan' : 'text-gray-400'}>{link.icon}</span>
              <span className={location.pathname === link.path ? 'text-neon-cyan' : 'text-white'}>{link.name}</span>
            </Link>
          ))}
          <div className="mx-6 mt-6 flex gap-4">
            <Link to="/book" onClick={() => setIsOpen(false)} className="flex-[3] py-3 rounded-full bg-neon-purple/20 border border-neon-purple text-center text-white tracking-wider font-medium uppercase shadow-[0_0_15px_rgba(176,38,255,0.3)]">
              Book Travel
            </Link>
            <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-[1] flex items-center justify-center py-3 rounded-full bg-green-500/20 border border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <User size={20} />
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
