import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Rocket, ArrowRight, ShieldCheck } from 'lucide-react';
import DepartureBoard from '../components/departure/DepartureBoard';
import { useUserContext } from '../context/UserContext';

const Home = () => {
  const { isAuthenticated, user } = useUserContext();
  
  React.useEffect(() => {
    console.log('[Home] 📍 Component mounted, isAuthenticated:', isAuthenticated, 'user:', user?.email);
  }, []);

  React.useEffect(() => {
    console.log('[Home] isAuthenticated changed to:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pb-20">
      {/* Central glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 glass-panel mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest text-gray-300">Wormhole Network Fully Operational</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              JOURNEY BEYOND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-white">
                THE STARS
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
              Experience seamless interstellar travel with next-generation ships, instant wormhole routing, and five-star cryogenic amenities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/explore">
                <Button variant="primary" size="lg" className="gap-2">
                  <Rocket size={18} />
                  Explore Destinations
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="ghost" size="lg" className="border border-white/10 gap-2">
                  <span className="relative flex h-3 w-3 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-purple"></span>
                  </span>
                  Open Galactic Map
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, mt: 50 }}
            animate={{ opacity: 1, mt: 80 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          >
            {[
              { title: "Wormhole Express", desc: "Instantaneous travel to Andromeda and beyond.", icon: "🌌", link: "/book" },
              { title: "Safe Cryo-Sleep", desc: "Wake up refreshed without side effects.", icon: "❄️", link: "/book" },
              { title: "Alien Host Friendly", desc: "Join our intergalactic community! Share images, thoughts, and alien experiences.", icon: "👽", link: "/community" }
            ].map((feature, idx) => (
              <Link to={feature.link} key={idx} className="glass-panel p-6 text-left glass-panel-hover flex flex-col gap-3 group block cursor-pointer">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h3 className="font-display font-medium text-lg text-white group-hover:text-neon-cyan transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 w-full"
          >
            <DepartureBoard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
