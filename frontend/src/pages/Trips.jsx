import React, { useEffect } from 'react';
import { useBookingContext } from '../context/BookingContext';
import planetsData from '../data/planets.json';
import { Link } from 'react-router-dom';
import { CalendarDays, Rocket, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';

const Trips = () => {
  const { bookings, isLoading, error, fetchUserBookings } = useBookingContext();

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-white">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Warp Log & Itineraries</h1>
        <p className="text-gray-400">Review your past and upcoming stellar excursions.</p>
      </div>

      {error && (
        <div className="glass-panel p-4 border-red-500/30 bg-red-500/10 rounded-lg mb-6 flex gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

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
            const originId = booking.fromPlanetId || booking.flightId;
            const originPlanet = planetsData.planets.find(p => p.id === originId) || { name: 'Unknown', galaxy: 'Unknown' };
            
            // Format booking details
            const bookingDate = new Date(booking.createdAt).toLocaleDateString();
            const departureDate = booking.departureTime ? new Date(booking.departureTime).toLocaleDateString() : 'TBD';
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={booking.id} 
                className="glass-panel rounded-2xl overflow-hidden relative p-6 border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Rocket size={20} className="text-neon-cyan" />
                      <span className="text-2xl font-bold text-white">Booking #{booking.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-500" />
                        <span>Booked: {bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-500" />
                        <span>Departure: {departureDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{originPlanet.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-black/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-neon-cyan">{booking.passengers}</div>
                      <div className="text-xs text-gray-400 mt-1">Passengers</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-neon-purple">${booking.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 mt-1">Total Price</div>
                    </div>
                    <Link
                      to={`/tracking/${booking.id}`}
                      className="bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black border border-neon-cyan text-neon-cyan rounded-lg p-3 flex items-center justify-center transition-all"
                    >
                      <span className="text-xs font-bold uppercase">Track</span>
                    </Link>
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
