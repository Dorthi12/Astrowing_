import React from 'react';
import { useAppContext } from '../context/AppContext';
import planetsData from '../data/planets.json';
import { Link } from 'react-router-dom';
import { CalendarDays, Rocket, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Trips = () => {
  const { bookings } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-white">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Warp Log & Itineraries</h1>
        <p className="text-gray-400">Review your past and upcoming stellar excursions.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl bg-space-900/50">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
            <Rocket size={32} />
          </div>
          <h3 className="text-xl font-medium mb-2">No active manifests</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">Your travel log is empty. The universe is waiting for you to discover it.</p>
          <Link to="/explore" className="inline-block px-6 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded-full font-medium tracking-wider uppercase hover:bg-neon-cyan hover:text-black transition-all">
            Find Recommendations
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {[...bookings].reverse().map((booking, idx) => {
            // Support legacy bookings which used {origin, destination} instead of route array
            const routeArray = booking.route || [booking.origin, booking.destination];
            const routeNodes = routeArray.map(
                nodeId => planetsData.planets.find(p => p.id === nodeId) || { name: 'Unknown', galaxy: 'Unknown' }
            );
            
            const orig = routeNodes[0];
            const dest = routeNodes[routeNodes.length - 1];
            const hasMultipleStops = routeNodes.length > 2;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={booking.id} 
                className="glass-panel rounded-2xl overflow-hidden relative"
              >
                {/* Boarding pass accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${booking.usedWormhole ? 'bg-neon-purple' : 'bg-neon-cyan'}`}></div>
                
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center bg-white/5">
                  <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6 whitespace-nowrap">
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Ticketholder</span>
                    <span className="text-xl font-display font-medium block">{booking.name}</span>
                    <div className="mt-4 inline-block bg-space-900 border border-white/10 px-3 py-1 rounded text-xs text-gray-400 font-mono">
                      ID: {booking.id.toString().slice(-8)}
                    </div>
                  </div>
                  
                  <div className="flex-[2] w-full flex items-center justify-between gap-4">
                    <div className="text-center shrink-0 max-w-[100px]">
                      <span className="block text-xl md:text-2xl font-bold font-display truncate" title={orig.name}>{orig.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{orig.galaxy}</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-2 py-4 relative group">
                      <span className="text-[10px] text-gray-400 mb-2 uppercase">
                        {booking.usedWormhole ? 'Wormhole Jump' : hasMultipleStops ? `${routeNodes.length - 2} Connects` : 'Direct Cruise'}
                      </span>
                      
                      <div className={`w-full h-0.5 relative ${booking.usedWormhole ? 'bg-neon-purple/50' : 'bg-white/20'} flex items-center justify-evenly`}>
                        {hasMultipleStops && routeNodes.slice(1, -1).map((node, i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-cyan shrink-0 z-10 shadow-[0_0_5px_#0ff0fc]" title={`Stop: ${node.name}`}></div>
                        ))}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full ${booking.usedWormhole ? 'bg-neon-purple text-white shadow-[0_0_15px_#b026ff]' : 'bg-space-800 border border-white/20'}`}>
                          <Rocket size={16} className={booking.usedWormhole ? 'animate-pulse' : ''} />
                        </div>
                      </div>
                      
                      <span className="text-[10px] text-gray-400 mt-6 md:mt-2 uppercase tracking-wide truncate max-w-full" title={hasMultipleStops ? `Via ${routeNodes.slice(1, -1).map(n => n.name).join(', ')}` : booking.travelClass}>
                        {hasMultipleStops ? `Via ${routeNodes.slice(1, -1).map(n => n.name).join(', ')}` : booking.travelClass}
                      </span>
                    </div>
                    
                    <div className="text-center shrink-0 max-w-[100px]">
                      <span className="block text-xl md:text-2xl font-bold font-display text-white truncate" title={dest.name}>{dest.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{dest.galaxy}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Departure</span>
                    <span className="block text-lg mb-4">{booking.date}</span>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Fare</span>
                    <span className="text-xl font-mono text-white">{booking.price === 0 ? 'Complimentary' : `₡${booking.price.toLocaleString()}`}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trips;
