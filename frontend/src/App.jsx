import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { BookingProvider } from './context/BookingContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CinematicBackground from './components/layout/CinematicBackground';

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <CinematicBackground />
      <Navbar />
      <main className="flex-grow relative z-10 pt-20">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
