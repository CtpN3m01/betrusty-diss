'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', email);
    // Handle login logic here
  };
  
  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-indigo-900 to-blue-500 flex items-center justify-center overflow-hidden">
      {/* Background animated shapes */}
      <motion.div 
        className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full opacity-30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400 rounded-full opacity-30 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/20 rounded-xl p-8 w-full max-w-md shadow-2xl border border-white/20"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.2)"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-white/80">Enter your email to continue</p>
        </motion.div>
        
        <form onSubmit={handleSubmit}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mb-6"
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <FiMail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-4 px-12 bg-white/10 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </motion.div>
          
          <motion.button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <span>Continue</span>
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FiArrowRight />
            </motion.span>
          </motion.button>
        </form>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-6 text-white/70 text-sm"
        >
          Don&apos;t have an account? <a href="#" className="text-white font-medium hover:text-purple-200 transition-colors">Sign up</a>
        </motion.p>
      </motion.div>
    </div>
  );
}
