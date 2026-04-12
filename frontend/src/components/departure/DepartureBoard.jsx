import React, { useState, useEffect } from 'react';
import DepartureRow from './DepartureRow';
import planetsData from '../../data/planets.json';

const generateFlight = () => {
  const planet = planetsData.planets[Math.floor(Math.random() * planetsData.planets.length)];
  const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'DEPARTED'];
  
  const now = new Date();
  const offset = Math.floor(Math.random() * 60) - 10;
  now.setMinutes(now.getMinutes() + offset);
  
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    flightId: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
    destination: planet.name,
    time: timeString,
    gate: `Alpha-${Math.floor(1 + Math.random() * 9)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  };
};

const DepartureBoard = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Initial flights
    const initial = Array.from({ length: 6 }).map(generateFlight);
    setFlights(initial);

    // Simulate live updates
    const interval = setInterval(() => {
      setFlights(current => {
        const newFlights = [...current];
        // randomly update a status or replace a departed flight
        const indexToUpdate = Math.floor(Math.random() * newFlights.length);
        
        if (newFlights[indexToUpdate].status === 'DEPARTED') {
          newFlights[indexToUpdate] = generateFlight();
        } else if (newFlights[indexToUpdate].status === 'BOARDING') {
          newFlights[indexToUpdate].status = 'DEPARTED';
        } else if (newFlights[indexToUpdate].status === 'ON TIME') {
          newFlights[indexToUpdate].status = Math.random() > 0.8 ? 'DELAYED' : 'BOARDING';
        } else {
          newFlights[indexToUpdate].status = 'BOARDING';
        }
        
        return newFlights;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel overflow-hidden mt-20">
      <div className="bg-space-900/80 p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-display font-medium text-lg tracking-widest text-white uppercase inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Live Departures
        </h3>
        <span className="text-xs text-gray-500 font-mono">Terminal Nexus-1</span>
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-6 gap-4 p-4 text-xs tracking-wider uppercase text-gray-500 border-b border-white/5">
        <div>Flight</div>
        <div className="col-span-2">Destination</div>
        <div className="hidden md:block">Time</div>
        <div>Gate</div>
        <div className="text-right">Status</div>
      </div>
      
      <div className="flex flex-col">
        {flights.map(flight => (
          <DepartureRow key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
};

export default DepartureBoard;
