import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-neon-cyan border-r-neon-cyan animate-spin"
          style={{ animation: 'spin 1s linear infinite' }}
        ></div>
      </div>
      
      {/* Loading text */}
      <p className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
        Loading...
      </p>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
