import React, { useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";

interface BuscarContratoInputProps {
  value: string;
  onChange: (value: string) => void;
}

const contract = getContract({
  client,
  address: "0x293dcF6364AfeACB74A4D1FdB2e1170DaF627a4F",
  chain: zkSyncSepolia,
});

const BuscarContratoInput: React.FC<BuscarContratoInputProps> = ({ value, onChange }) => {
  const { data, isLoading } = useReadContract({
    contract,
    method: "function obtenerTodosLosContratos() public view returns (address[] memory)",
    params: [],
  });

  return (
    <>
      <input
        type="text"
        placeholder="Buscar contratos..."
        className="flex-1 h-10 px-4 text-sm border rounded-lg bg-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="ml-2 h-10 w-10 flex items-center justify-center bg-blue-500 rounded-lg hover:bg-blue-600"
        type="button"
        onClick={() => {
          if (!isLoading) {
            console.log("Contratos obtenidos:", data);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
};

export default BuscarContratoInput;

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
