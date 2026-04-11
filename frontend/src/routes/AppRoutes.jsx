import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import MapView from '../pages/MapView';
import Planet from '../pages/Planet';
import Booking from '../pages/Booking';
import Trips from '../pages/Trips';
import NotFound from '../pages/NotFound';
import AlienAuth from '../pages/AlienAuth';
import Community from '../pages/Community';
import FlightTracking from '../pages/FlightTracking';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/planet/:id" element={<Planet />} />
      <Route path="/book/:id?" element={<Booking />} />
      <Route path="/book/custom" element={<Booking />} />
      <Route path="/auth" element={<AlienAuth />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/community" element={<Community />} />
      <Route path="/tracking/:id" element={<FlightTracking />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
