'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { abstractTestnet } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { client } from "../client"

export default function Login() {
  
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
        className="relative backdrop-blur-xl bg-white/20 rounded-xl p-8 w-full max-w-md shadow-2xl border border-white/20 flex flex-col items-center"
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
          <h2 className="text-3xl font-bold mb-2 text-white">BeTrusty Abstract DISS</h2>
        </motion.div>
        
        <ConnectButton client={client} chain={abstractTestnet} />
        
      </motion.div>
    </div>
  );
}
