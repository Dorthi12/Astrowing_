import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 rounded-full focus:outline-none";
  
  const variants = {
    primary: "bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-space-900 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]",
    secondary: "bg-neon-purple/10 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white shadow-[0_0_15px_rgba(176,38,255,0.2)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)]",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5",
    solid: "bg-white text-space-900 hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
