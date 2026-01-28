import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover brightness-50"
          alt="Hero background"
        />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Taste the Excellence
        </motion.h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Experience world-class cuisine delivered straight to your door or in our luxurious dining hall.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/menu" className="btn-primary text-lg px-8 py-3">Order Now</Link>
          <Link to="/reserve" className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition text-lg">Book a Table</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;