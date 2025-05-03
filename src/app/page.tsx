'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { zkSyncSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";
import { toWei } from "thirdweb/utils";
import { client } from "./client"

// 1. Define the contract
const contract = getContract({
  client,
  address: "0x05bB90f25551b334a4Ac962612CcE3b4f08Fae8d",
  chain: zkSyncSepolia,
});


export default function DISS() {
  const account = useActiveAccount();
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);
  const [result, setResult] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

        <ConnectButton client={client} chain={zkSyncSepolia} />

        {/* Show sum inputs and result only if user is connected */}
        {account && (
          <div className="w-full flex flex-col items-center mt-8 gap-4">
            <input
              type="number"
              value={a}
              onChange={e => setA(Number(e.target.value))}
              className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              placeholder="Número A"
            />
            <input
              type="number"
              value={b}
              onChange={e => setB(Number(e.target.value))}
              className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              placeholder="Número B"
            />
            <button
              onClick={async () => {
                setLoading(true);
                setError(null);
                setResult(null);
                try {
                  
                  // 2. Prepare the contract call for suma(int256,int256)
                  const tx = prepareContractCall({
                    contract,
                    method: "function suma(int256 a, int256 b) returns (int256)",
                    params: [BigInt(a), BigInt(b)],
                  });

                  // 3. Send the transaction and wait for receipt
                  const result = await sendTransaction({ transaction: tx, account });
                  
                  // 4. Get the result from the receipt
                  console.log("Transaction hash:", result.transactionHash);


                } catch (err: any) {
                  setError("Error al llamar al contrato: " + (err?.message || err?.toString()));
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Calculando..." : "Sumar"}
            </button>
            <div className="text-lg text-white font-semibold w-full text-center min-h-[2rem]">
              {error && <span className="text-red-300">{error}</span>}
              {result !== null && !error && (
                <span>Resultado: {result}</span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
