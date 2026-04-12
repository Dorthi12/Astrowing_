import React, { useEffect, useState } from 'react';
import { useBookingContext } from '../context/BookingContext';
import planetsData from '../data/planets.json';
import { Link } from 'react-router-dom';
import { CalendarDays, Rocket, MapPin, AlertCircle, History } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';

const Trips = () => {
  const { bookings, isLoading, error, fetchUserBookings } = useBookingContext();
  const [localSessions, setLocalSessions] = useState([]);

  useEffect(() => {
    fetchUserBookings();
    // Load local (hardcoded) sessions from localStorage
    const saved = localStorage.getItem('starport_sessions');
    if (saved) {
      try { setLocalSessions(JSON.parse(saved)); } catch (e) {}
    }
  }, [fetchUserBookings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const hasAnyTrips = bookings.length > 0 || localSessions.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-white">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Warp Log &amp; Itineraries</h1>
        <p className="text-gray-400">Review your past and upcoming stellar excursions.</p>
      </div>

      {error && (
        <div className="glass-panel p-4 border-red-500/30 bg-red-500/10 rounded-lg mb-6 flex gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {!hasAnyTrips ? (
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
        <div className="space-y-8">
          {/* Local Sessions from booking system */}
          {localSessions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-neon-cyan">
                <History size={16} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Confirmed Manifests (Hardcoded Sessions)</h2>
              </div>
              <div className="space-y-4">
                {localSessions.map((session, idx) => {
                  const planet = planetsData.planets.find(p => p.id === session.planetId);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={session.id}
                      className="glass-panel rounded-2xl overflow-hidden relative p-6 border-neon-cyan/20 bg-neon-cyan/5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${planet?.color || 'from-gray-500 to-gray-700'} flex items-center justify-center`}>
                              <Rocket size={16} className="text-white" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-white">{session.planetName}</div>
                              <div className="text-xs text-gray-400 uppercase tracking-widest">{session.classType}</div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-500/20 text-green-400">
                              Confirmed
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-gray-500" />
                              <span>Booked: {new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-500" />
                              <span>Sol System → {session.planetName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-2xl font-bold text-neon-cyan">{session.passengers}</div>
                            <div className="text-xs text-gray-400 mt-1">Passengers</div>
                          </div>
                          <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-xl font-bold text-neon-purple">₡{session.total?.toLocaleString()}</div>
                            <div className="text-xs text-gray-400 mt-1">Total Cost</div>
                          </div>
                          <div className="col-span-2 bg-black/40 rounded-lg p-3">
                            <div className="text-[10px] text-gray-500 uppercase mb-1">Ticket ID</div>
                            <div className="text-xs font-mono text-neon-cyan">{session.id}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* API Bookings */}
          {bookings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-neon-purple">
                <Rocket size={16} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Registered Flights</h2>
              </div>
              <div className="space-y-4">
                {[...bookings].reverse().map((booking, idx) => {
                  const originId = booking.fromPlanetId || booking.flightId;
                  const originPlanet = planetsData.planets.find(p => p.id === originId) || { name: 'Unknown', galaxy: 'Unknown' };
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
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-2xl font-bold text-neon-cyan">{booking.passengers}</div>
                            <div className="text-xs text-gray-400 mt-1">Passengers</div>
                          </div>
                          <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-2xl font-bold text-neon-purple">${booking.totalPrice?.toFixed(2)}</div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;
