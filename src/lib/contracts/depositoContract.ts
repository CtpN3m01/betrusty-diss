import { 
  getContract, 
  prepareContractCall, 
  sendTransaction,
  prepareEvent,
  parseEventLogs,
  waitForReceipt
} from "thirdweb";
import { client } from "./client";
import { CONTRACTS, EVENTOS, ESTADO_DEPOSITO, Deposito, NETWORK_CONFIG } from "./config";
import { ethers } from "ethers";

// Obtener el contrato
export const getDepositoContract = () => {
  return getContract({
    client,
    chain: NETWORK_CONFIG.DEFAULT_CHAIN,
    address: CONTRACTS.DEPOSITO.ADDRESS as `0x${string}`,
    abi: CONTRACTS.DEPOSITO.ABI
  });
};

// Crear un depósito
export const crearDeposito = async ({
  inquilino,
  token,
  monto,
  fecha,
  account
}: {
  inquilino: string;
  token: string;
  monto: string;
  fecha: number;
  account: any;
}) => {
  try {
    const contract = getDepositoContract();
    
    // Preparar la transacción
    const transaction = prepareContractCall({
      contract,
      method: "crearDeposito",
      params: [inquilino, token, monto, fecha]
    } as any);
    
    // Enviar la transacción
    const tx = await sendTransaction({
      transaction,
      account
    });
    
    // Esperar por el recibo
    const receipt = await waitForReceipt(tx);
    
    // Preparar el evento para escuchar
    const depositoCreadoEvent = prepareEvent({
      contract: contract as any,
      eventName: EVENTOS.DEPOSITO_CREADO
    });
    
    // Parsear los logs para obtener el ID del depósito
    const logs = parseEventLogs({
      logs: receipt.logs,
      events: [depositoCreadoEvent]
    } as any);
    
    // Obtener el ID del depósito del evento
    // Asumimos que el primer argumento es el depositoId
    const depositoId = logs[0]?.args ? Number(logs[0].args[0]) : 0;
    
    return {
      success: true,
      depositoId,
      receipt
    };
  } catch (error) {
    console.error("Error al crear depósito:", error);
    return {
      success: false,
      error
    };
  }
};

// Aceptar un depósito
export const aceptarDeposito = async ({
  depositoId,
  account
}: {
  depositoId: number;
  account: any;
}) => {
  try {
    const contract = getDepositoContract();
    
    // Preparar la transacción
    const transaction = prepareContractCall({
      contract,
      method: "aceptarDeposito",
      params: [depositoId]
    } as any);
    
    // Enviar la transacción
    const tx = await sendTransaction({
      transaction,
      account
    });
    
    // Esperar por el recibo
    const receipt = await waitForReceipt(tx);
    
    return {
      success: true,
      receipt
    };
  } catch (error) {
    console.error("Error al aceptar depósito:", error);
    return {
      success: false,
      error
    };
  }
};

// Finalizar un depósito
export const finalizarDeposito = async ({
  depositoId,
  exitoso,
  razon,
  account
}: {
  depositoId: number;
  exitoso: boolean;
  razon: string;
  account: any;
}) => {
  try {
    const contract = getDepositoContract();
    
    // Preparar la transacción
    const transaction = prepareContractCall({
      contract,
      method: "finalizarDeposito",
      params: [depositoId, exitoso, razon]
    } as any);
    
    // Enviar la transacción
    const tx = await sendTransaction({
      transaction,
      account
    });
    
    // Esperar por el recibo
    const receipt = await waitForReceipt(tx);
    
    return {
      success: true,
      receipt
    };
  } catch (error) {
    console.error("Error al finalizar depósito:", error);
    return {
      success: false,
      error
    };
  }
};

// Obtener información de un depósito
export const getDeposito = async (depositoId: number): Promise<Deposito | null> => {
  try {
    const contract = getDepositoContract();
    
    // Llamar al método usando la API de bajo nivel
    const result = await contract.call("getDeposito", [depositoId]);
    
    // Formatear la respuesta
    return {
      id: depositoId,
      propietario: result[0] as string,
      inquilino: result[1] as string,
      token: result[2] as string,
      monto: result[3] as bigint,
      fecha: Number(result[4]),
      estado: result[5] as ESTADO_DEPOSITO
    };
  } catch (error) {
    console.error("Error al obtener depósito:", error);
    return null;
  }
}; 