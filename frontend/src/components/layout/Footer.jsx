import React from 'react';
import { Rocket, Github, Twitter, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 glass-panel rounded-none border-b-0 border-x-0 relative z-10 bg-space-900/80">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="text-neon-cyan" size={20} />
            <span className="font-display font-medium text-lg tracking-wider">STARPORT <span className="text-gray-500 font-light">NEXUS</span></span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-neon-cyan transition-colors">Safety Protocols</a>
            <a href="#" className="hover:text-neon-purple transition-colors">Wormhole Tolls</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Intergalactic Customs</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-cyan hover:shadow-[0_0_10px_#0ff0fc] transition-all">
              <Github size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-cyan hover:shadow-[0_0_10px_#0ff0fc] transition-all">
              <Twitter size={16} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-600 border-t border-white/5 pt-6">
          <p>Standard Earth Year 2142 • Authorized under United Galaxies Treaty 7-B</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
