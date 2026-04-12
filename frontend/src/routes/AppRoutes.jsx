import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import ProtectedRoute from '../components/routing/ProtectedRoute';
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
import Loader from '../components/ui/Loader';

const AppRoutes = () => {
  const { isLoading } = useUserContext();

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/planet/:id" element={<Planet />} />
      
      {/* Protected Routes */}
      <Route path="/book/:id?" element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/book/custom" element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/trips" element={<Trips />} />
      <Route path="/tracking/:id" element={
        <ProtectedRoute>
          <FlightTracking />
        </ProtectedRoute>
      } />
      
      <Route path="/auth" element={<AlienAuth />} />
      <Route path="/community" element={<Community />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
