import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { bookingService } from '../services';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status from localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch user bookings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
  }, [isAuthenticated]);

  // Fetch all user bookings
  const fetchUserBookings = useCallback(async (limit = 50, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const { bookings: fetchedBookings } = await bookingService.getUserBookings(limit, offset);
      setBookings(fetchedBookings);
      return fetchedBookings;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Failed to fetch bookings';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new booking
  const createBooking = useCallback(async (flightId, passengers, seatSelectedIndices) => {
    setIsLoading(true);
    setError(null);
    try {
      const { booking } = await bookingService.createBooking({
        flightId,
        passengers,
        seatSelectedIndices,
      });
      
      // Add new booking to list
      setBookings((prevBookings) => [booking, ...prevBookings]);
      setCurrentBooking(booking);
      
      return booking;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Failed to create booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get single booking details
  const getBookingDetails = useCallback(async (bookingId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { booking } = await bookingService.getBooking(bookingId);
      setCurrentBooking(booking);
      return booking;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Failed to fetch booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { booking } = await bookingService.cancelBooking(bookingId);
      
      // Update booking in list
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === bookingId ? booking : b))
      );
      
      // Clear current booking if it was the one cancelled
      if (currentBooking?.id === bookingId) {
        setCurrentBooking(booking);
      }
      
      return booking;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Failed to cancel booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentBooking]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current booking
  const clearCurrentBooking = useCallback(() => {
    setCurrentBooking(null);
  }, []);

  const value = {
    bookings,
    currentBooking,
    isLoading,
    error,
    createBooking,
    fetchUserBookings,
    getBookingDetails,
    cancelBooking,
    clearError,
    clearCurrentBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

// Hook to use BookingContext
export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within BookingProvider');
  }
  return context;
};

export default BookingContext;
