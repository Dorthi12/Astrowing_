import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <h1 className="text-9xl font-display font-bold text-white/5 opacity-80 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl font-display font-bold neon-text-cyan shadow-black">Signal Lost</h2>
        </div>
      </div>
      <p className="text-gray-400 mt-6 max-w-md mx-auto mb-8">
        The coordinates you entered do not exist in the known universe. You may have drifted into unmapped space.
      </p>
      <Link to="/">
        <Button variant="primary">Recalibrate Coordinates</Button>
      </Link>
    </div>
  );
};

export default NotFound;
