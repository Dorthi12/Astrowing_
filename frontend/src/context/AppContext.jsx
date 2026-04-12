import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Explorer-99',
    dna: {
      species: 'Humanoid',
      traits: ['Carbon-Based', 'Oxygen-Breather'],
      radiationTolerance: 40,
      gravityPreference: 1.0,
    },
    unlockedPlanets: ['p-001', 'p-002', 'p-003', 'p-004', 'p-005', 'p-006'], // Start with some known ones
    discoveryPoints: 0
  });
  
  const [spaceWeather, setSpaceWeather] = useState({
    condition: 'Stable',
    intensity: 0,
    activeZones: [],
    forecast: 'Clear skies across the sector.'
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('starport_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Booking parse error", e);
      return [];
    }
  });

  useEffect(() => {
    // Simulate Space Weather Cycle
    const conditions = ['Solar Storm', 'Asteroid Flux', 'Radiation Surge', 'Nebula Fog', 'Stable'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const zones = ['Andromeda', 'Milky Way', 'Cygnus', 'Triangulum'];
    const activeZones = zones.filter(() => Math.random() > 0.5);
    
    setSpaceWeather({
      condition: randomCondition,
      intensity: randomCondition === 'Stable' ? 0 : Math.floor(Math.random() * 80) + 20,
      activeZones: activeZones,
      forecast: randomCondition === 'Stable' 
        ? 'Optimal conditions for wormhole jumps.' 
        : `Caution: ${randomCondition} detected in ${activeZones.join(', ')} sectors.`
    });

    localStorage.setItem('starport_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking) => {
    setBookings(prev => [...prev, { id: Date.now(), ...booking }]);
  };

  const unlockPlanet = (planetId) => {
    if (!currentUser.unlockedPlanets.includes(planetId)) {
      setCurrentUser(prev => ({
        ...prev,
        unlockedPlanets: [...prev.unlockedPlanets, planetId],
        discoveryPoints: prev.discoveryPoints + 500
      }));
      return true;
    }
    return false;
  };

  const updateDNA = (newDna) => {
    setCurrentUser(prev => ({ ...prev, dna: { ...prev.dna, ...newDna } }));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      bookings, 
      addBooking, 
      spaceWeather, 
      unlockPlanet,
      updateDNA
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
