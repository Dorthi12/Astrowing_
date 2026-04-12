import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService, bookingService, planetService } from '../services';
import { useBookingContext } from '../context/BookingContext';
import { useUserContext } from '../context/UserContext';
import Loader from '../components/ui/Loader';
import { Plane, Calendar, Users, AlertCircle, CheckCircle, MapPin, ArrowRight } from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();
  const { createBooking, isLoading: bookingLoading } = useBookingContext();
  // Flight search state
  const [flights, setFlights] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Booking state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState('search'); // search, select, confirm, success

  // Search form
  const [searchForm, setSearchForm] = useState({
    fromPlanetId: '',
    toPlanetId: '',
    departureDate: new Date().toISOString().split('T')[0],
  });

  // Fetch planets for dropdowns
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await planetService.getAllPlanets();
        setPlanets(response.planets || []);
      } catch (err) {
        console.error('Failed to fetch planets:', err);
      }
    };
    fetchPlanets();
  }, []);

  // Fetch flights based on search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchForm.fromPlanetId || !searchForm.toPlanetId) {
      setError('Please select departure and arrival planets');
      return;
    }
    if (searchForm.fromPlanetId === searchForm.toPlanetId) {
      setError('Departure and arrival planets cannot be the same');
      return;
    }

    setIsLoadingFlights(true);
    setError(null);
    try {
      const response = await flightService.searchFlights({
        fromPlanetId: parseInt(searchForm.fromPlanetId),
        toPlanetId: parseInt(searchForm.toPlanetId),
        departureDate: searchForm.departureDate,
      });
      setFlights(response.flights || []);
      setSearchPerformed(true);
      if (!response.flights || response.flights.length === 0) {
        setError('No flights found for the selected route and date');
      }
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to search flights');
      setFlights([]);
    } finally {
      setIsLoadingFlights(false);
    }
  };

  // Proceed to seat selection
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setSelectedSeats([]);
    setStep('select');
  };

  // Handle seat selection
  const handleSeatToggle = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  // Proceed to confirmation
  const handleProceedToConfirm = () => {
    if (selectedSeats.length !== passengers) {
      setError(`Please select ${passengers} seat(s)`);
      return;
    }
    setError(null);
    setStep('confirm');
  };

  // Create booking
  const handleConfirmBooking = async () => {
    if (!selectedFlight) return;

    try {
      setError(null);
      await createBooking(
        selectedFlight.id,
        passengers,
        selectedSeats
      );
      setStep('success');
      setTimeout(() => navigate('/trips'), 2000);
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to create booking');
    }
  };

  const getPlanetName = (id) => {
    const planet = planets.find(p => p.id === parseInt(id));
    return planet?.name || `Planet ${id}`;
  };

  // Render search step
  if (step === 'search') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book Your Journey</h1>
          <p className="text-gray-400">Search and book flights to your next destination</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 border-red-500/30 bg-red-500/10 rounded-lg mb-6 flex gap-3"
          >
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSearch} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure Planet */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} /> From
              </label>
              <select
                required
                value={searchForm.fromPlanetId}
                onChange={(e) => setSearchForm({ ...searchForm, fromPlanetId: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-black/60 transition-all"
              >
                <option value="">Select departure planet...</option>
                {planets.map(planet => (
                  <option key={planet.id} value={planet.id}>{planet.name}</option>
                ))}
              </select>
            </div>

            {/* Arrival Planet */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} /> To
              </label>
              <select
                required
                value={searchForm.toPlanetId}
                onChange={(e) => setSearchForm({ ...searchForm, toPlanetId: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-black/60 transition-all"
              >
                <option value="">Select arrival planet...</option>
                {planets.map(planet => (
                  <option key={planet.id} value={planet.id}>{planet.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Departure Date & Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Departure Date
              </label>
              <input
                type="date"
                required
                value={searchForm.departureDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchForm({ ...searchForm, departureDate: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-black/60 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                <Users size={14} /> Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-black/60 transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoadingFlights}
            className="w-full py-4 bg-neon-cyan text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoadingFlights ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-r-transparent border-b-black border-l-black rounded-full animate-spin" />
                Searching Flights...
              </>
            ) : (
              <>
                <Plane size={18} />
                Search Flights
              </>
            )}
          </button>
        </form>

        {/* Search Results */}
        {searchPerformed && flights.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            <h2 className="text-2xl font-display font-bold mb-6">Available Flights ({flights.length})</h2>
            <div className="space-y-4">
              {flights.map((flight, idx) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectFlight(flight)}
                  className="glass-panel p-6 rounded-xl border border-white/10 cursor-pointer hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Plane size={18} className="text-neon-cyan group-hover:animate-pulse" />
                        <span className="text-xl font-bold">Flight #{flight.flightNumber || flight.id}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-500 text-xs">Departure</span>
                          <p className="font-mono">{new Date(flight.departureTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Arrival</span>
                          <p className="font-mono">{new Date(flight.arrivalTime).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:flex-col md:items-end">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Seats Available</p>
                        <p className="text-lg font-bold">{flight.availableSeats}/{flight.totalSeats}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">From</p>
                        <p className="text-2xl font-bold text-neon-cyan">${flight.basePrice}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {searchPerformed && flights.length === 0 && !isLoadingFlights && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-center py-12">
            <p className="text-gray-400 text-lg">No flights found for your search criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your dates or selecting different planets.</p>
          </motion.div>
        )}
      </div>
    );
  }

  // Render seat selection step
  if (step === 'select' && selectedFlight) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <button
            onClick={() => setStep('search')}
            className="text-neon-cyan hover:text-white transition-colors text-sm mb-4 flex items-center gap-1"
          >
            ← Back to Search
          </button>
          <h1 className="text-4xl font-display font-bold mb-2">Select Seats</h1>
          <p className="text-gray-400">Choose {passengers} seat{passengers > 1 ? 's' : ''} for Flight #{selectedFlight.flightNumber || selectedFlight.id}</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 border-red-500/30 bg-red-500/10 rounded-lg mb-6 flex gap-3"
          >
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-8 rounded-2xl border border-white/10 mb-6">
          <div className="mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Seat Map - Click to Select</p>
            <div className="grid grid-cols-6 gap-3 max-w-md">
              {Array.from({ length: selectedFlight.totalSeats }, (_, i) => i + 1).map(seatNumber => (
                <button
                  key={seatNumber}
                  onClick={() => handleSeatToggle(seatNumber)}
                  disabled={seatNumber > selectedFlight.availableSeats && !selectedSeats.includes(seatNumber)}
                  className={`p-3 rounded-lg font-mono text-sm font-bold transition-all ${
                    selectedSeats.includes(seatNumber)
                      ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-110'
                      : seatNumber > selectedFlight.availableSeats
                      ? 'bg-red-500/20 text-red-400 cursor-not-allowed opacity-50'
                      : 'bg-black/40 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                  }`}
                >
                  {seatNumber}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">Selected: {selectedSeats.length}/{passengers}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => setStep('search')}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-bold uppercase text-sm hover:bg-white/10 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleProceedToConfirm}
              disabled={selectedSeats.length !== passengers}
              className="flex-1 px-6 py-3 bg-neon-cyan text-black rounded-lg font-bold uppercase text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Confirm
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render confirm step
  if (step === 'confirm' && selectedFlight) {
    const departPlanet = planets.find(p => p.id === selectedFlight.fromPlanetId);
    const arrivalPlanet = planets.find(p => p.id === selectedFlight.toPlanetId);

    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-10">
          <button
            onClick={() => setStep('select')}
            className="text-neon-cyan hover:text-white transition-colors text-sm mb-4 flex items-center gap-1"
          >
            ← Back to Seats
          </button>
          <h1 className="text-4xl font-display font-bold mb-2">Confirm Booking</h1>
          <p className="text-gray-400">Review your booking details</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-4 border-red-500/30 bg-red-500/10 rounded-lg mb-6 flex gap-3"
          >
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 mb-6">
          <div className="pb-6 border-b border-white/10">
            <p className="text-sm text-gray-400 mb-2">Flight Details</p>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-500">Flight #{selectedFlight.flightNumber || selectedFlight.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-lg">{departPlanet?.name || 'Departure'}</span>
                  <ArrowRight size={16} className="text-neon-cyan" />
                  <span className="font-bold text-lg">{arrivalPlanet?.name || 'Arrival'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase">Departure</p>
              <p className="text-lg font-mono">{new Date(selectedFlight.departureTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase">Arrival</p>
              <p className="text-lg font-mono">{new Date(selectedFlight.arrivalTime).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase">Passengers</p>
              <p className="text-lg font-bold">{passengers}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase">Seats</p>
              <p className="text-lg font-mono font-bold text-neon-cyan">{selectedSeats.sort((a, b) => a - b).join(', ')}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-300 uppercase font-mono">Total Price</span>
              <span className="text-3xl font-bold text-neon-cyan">${(selectedFlight.basePrice * passengers).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setStep('select')}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-bold uppercase text-sm hover:bg-white/10 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={bookingLoading}
            className="flex-1 px-6 py-3 bg-neon-cyan text-black rounded-lg font-bold uppercase text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {bookingLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-r-transparent border-b-black border-l-black rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Render success step
  if (step === 'success') {
    const departPlanet = planets.find(p => p.id === selectedFlight.fromPlanetId);
    const arrivalPlanet = planets.find(p => p.id === selectedFlight.toPlanetId);

    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-neon-cyan" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-gray-300 mb-6">Your flight from <span className="font-bold">{departPlanet?.name}</span> to <span className="font-bold">{arrivalPlanet?.name}</span> has been successfully booked.</p>
          <div className="glass-panel p-6 rounded-xl border border-white/10 inline-block mb-8">
            <p className="text-sm text-gray-400 mb-2">Confirmation #</p>
            <p className="text-2xl font-mono font-bold text-neon-cyan">{selectedFlight.id}-{selectedSeats[0]}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to your trips in a moment...</p>
        </motion.div>
      </div>
    );
  }

  return <Loader />;
};

export default Booking;
