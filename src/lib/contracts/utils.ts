import { ethers } from "ethers";
import { NETWORK_CONFIG } from "./config";

/**
 * Obtiene el precio actual del gas en la red
 * @returns Precio del gas en wei
 */
export async function getGasPrice(): Promise<bigint> {
  const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.RPC_URL);
  const feeData = await provider.getFeeData();
  return feeData.gasPrice!;
}

/**
 * Obtiene el precio actual de ETH en USD
 * @returns Precio de ETH en USD
 */
export async function getEthUsdPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!res.ok) throw new Error("No se pudo obtener el precio de ETH");
    const data = await res.json();
    if (!data.ethereum || !data.ethereum.usd) throw new Error("Respuesta inválida de CoinGecko");
    return data.ethereum.usd;
  } catch (e) {
    console.error("Error al obtener precio de ETH:", e);
    return -1;
  }
}

/**
 * Estima el costo de gas de una transacción en USD
 * @param gasLimit Límite de gas estimado
 * @returns Costo estimado en USD
 */
export async function estimateGasCostInUsd(gasLimit: bigint): Promise<number> {
  try {
    const gasPrice = await getGasPrice();
    const ethPrice = await getEthUsdPrice();
    
    if (ethPrice <= 0) return -1;
    
    // Costo en wei = gasLimit * gasPrice
    const costInWei = gasLimit * gasPrice;
    
    // Convertir de wei a ether
    const costInEth = Number(ethers.formatEther(costInWei));
    
    // Convertir de ether a USD
    return costInEth * ethPrice;
  } catch (e) {
    console.error("Error al estimar costo de gas:", e);
    return -1;
  }
}

/**
 * Formatea una dirección Ethereum para mostrarla acortada
 * @param address Dirección completa
 * @returns Dirección formateada (ej: 0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formatea una cantidad de tokens con el símbolo
 * @param amount Cantidad en formato bigint
 * @param decimals Decimales del token
 * @param symbol Símbolo del token
 * @returns Cantidad formateada con símbolo
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18, symbol: string = "ETH"): string {
  const formatted = ethers.formatUnits(amount, decimals);
  return `${formatted} ${symbol}`;
}

/**
 * Convierte una fecha Unix timestamp a formato legible
 * @param timestamp Timestamp en segundos
 * @returns Fecha formateada
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Verifica si una dirección Ethereum es válida
 * @param address Dirección a verificar
 * @returns true si es válida, false si no
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
} 