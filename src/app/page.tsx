'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Importamos la red de zkSync Sepolia y el sdk de ConnectButton de thirdweb
import { zkSyncSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

// Necesitamos importar el cliente de thirdweb para poder usarlo en el contrato
import { client } from "./client"
import { useActiveAccount } from "thirdweb/react";

// importamos las funciones necesarias para enviar transacciones al contrato
import {
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";

// Importamos las funciones necesarias para preparar el evento y parsear los logs para poder interactuar con el evento resultadoCalculado
import { 
  prepareEvent, 
  waitForReceipt, 
  parseEventLogs,  

} from "thirdweb";


// Importamos las funciones necesarias para estimar el uso de GAS

import { useEstimateGas } from "thirdweb/react";
import { getGasPrice, getEthUsdPrice } from "./utils";

// 1. Define the contract
const contract = getContract({
  client,
  address: "0x05bB90f25551b334a4Ac962612CcE3b4f08Fae8d",
  chain: zkSyncSepolia,
});

const resultadoSuma = prepareEvent({
  signature: "event resultadoCalculado(int256 resultado)",
});

export default function DISS() {
  // Hook para estimar el gas, debe ir dentro del componente
  const { mutateAsync: estimateGas } = useEstimateGas();
  // Variables de estado para los números A y B, el resultado, el loading y el error
  // y la cuenta activa logeada en connectButton
  const account = useActiveAccount();
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);
  const [result, setResult] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [estimatedGas, setEstimatedGas] = React.useState<bigint | null>(null);
  const [estimatedUsd, setEstimatedUsd] = React.useState<number | null>(null);
  

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
          <h2 className="text-3xl font-bold mb-2 text-white">BeTrusty DISS</h2>
        </motion.div>

        <ConnectButton client={client} chain={zkSyncSepolia} />

        {/* Show sum inputs and result only if user is connected */}
        {account && (
          <div className="w-full flex flex-col items-center mt-8 gap-4">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={String(a)}
              onChange={e => {
                const val = e.target.value;
                if (/^-?\d*$/.test(val)) {
                  setA(val === '' ? 0 : parseInt(val, 10));
                }
              }}
              className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              placeholder="Número A"
              autoComplete="off"
            />
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={String(b)}
              onChange={e => {
                const val = e.target.value;
                if (/^-?\d*$/.test(val)) {
                  setB(val === '' ? 0 : parseInt(val, 10));
                }
              }}
              className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              placeholder="Número B"
              autoComplete="off"
            />
            <button
              onClick={async () => {
                setLoading(true);
                setError(null);
                setResult(null);
                setEstimatedGas(null);
                setEstimatedUsd(null);
                try {
                  
                  // 2. Prepare the contract call for suma(int256,int256)
                  const call = prepareContractCall({
                    contract,
                    method: "function suma(int256 a, int256 b) returns (int256)",
                    params: [BigInt(a), BigInt(b)],
                  });

                  // Estimar el gas de enviar la transacción

                  const gasResult = await estimateGas(call);
                  setEstimatedGas(gasResult as bigint);

                  // Calcular el costo estimado en USD
                  try {
                    const [gasPrice, ethUsd] = await Promise.all([
                      getGasPrice(),
                      getEthUsdPrice(),
                    ]);
                    // gasResult (bigint) * gasPrice (bigint) = total wei
                    const totalWei = (gasResult as bigint) * gasPrice;
                    // Convertir a ETH (1 ETH = 1e18 wei)
                    const totalEth = Number(totalWei) / 1e18;
                    const usd = totalEth * ethUsd;
                    setEstimatedUsd(usd);
                  } catch (e) {
                    setEstimatedUsd(null);
                  }

                  // 3. Send the transaction and wait for receipt
                  const txResult = await sendTransaction({ transaction: call, account });

                  // Muestra el hash de la transacción realizada para developer
                  console.log("Transaction hash:", txResult.transactionHash);

                  // 4. Espera a que la transacción sea confirmada
                  const receipt = await waitForReceipt(txResult);

                  const events = parseEventLogs({
                    logs: receipt.logs,
                    events: [resultadoSuma],
                  });

                  console.log("Eventos:", events);
                  
                  if (events.length) {
                    const valor = Number(events[0].args.resultado);
                    setResult(valor);
                  }                     

                } catch (err) {
                  const errorMsg = err && typeof err === 'object' && 'message' in err
                    ? (err as { message?: string }).message
                    : String(err);
                  setError("Error al llamar al contrato: " + (errorMsg || ''));
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Calculando..." : "Sumar"}
            </button>
            

            {estimatedUsd !== null && estimatedUsd && (
              <div className="text-sm text-white w-full text-center">
                Costo estimado: ${estimatedUsd.toFixed(6)} USD
              </div>
            )}

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
