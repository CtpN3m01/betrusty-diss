import { zkSyncSepolia } from "thirdweb/chains";

// Configuración de contratos
export const CONTRACTS = {
  DEPOSITO: {
    ADDRESS: process.env.NEXT_PUBLIC_DEPOSITO_CONTRACT_ADDRESS || "0x...", // Dirección del contrato
    ABI: [
      // Define aquí el ABI de tu contrato
      "event DepositoCreado(address indexed propietario, address indexed inquilino, address indexed token, uint256 monto, uint256 fecha)",
      "event DepositoAceptado(uint256 indexed depositoId, address indexed inquilino)",
      "event DepositoFinalizado(uint256 indexed depositoId, bool indexed exitoso, string razon)",
      "function crearDeposito(address inquilino, address token, uint256 monto, uint256 fecha) returns (uint256)",
      "function aceptarDeposito(uint256 depositoId) returns (bool)",
      "function finalizarDeposito(uint256 depositoId, bool exitoso, string calldata razon) returns (bool)",
      "function getDeposito(uint256 depositoId) view returns (address propietario, address inquilino, address token, uint256 monto, uint256 fecha, uint8 estado)"
    ]
  }
};

// Configuración de la red
export const NETWORK_CONFIG = {
  DEFAULT_CHAIN: zkSyncSepolia,
  RPC_URL: "https://sepolia.era.zksync.dev"
};

// Tipos de eventos
export enum EVENTOS {
  DEPOSITO_CREADO = "DepositoCreado",
  DEPOSITO_ACEPTADO = "DepositoAceptado",
  DEPOSITO_FINALIZADO = "DepositoFinalizado"
}

// Estados del depósito
export enum ESTADO_DEPOSITO {
  PENDIENTE = 0,
  ACEPTADO = 1,
  FINALIZADO = 2,
  CANCELADO = 3
}

// Tipos para el depósito
export interface Deposito {
  id: number;
  propietario: string;
  inquilino: string;
  token: string;
  monto: bigint;
  fecha: number;
  estado: ESTADO_DEPOSITO;
} 