import { ethers } from "ethers";

export async function getGasPrice(): Promise<bigint> {
  // zkSync Sepolia RPC endpoint (puedes cambiarlo si tienes uno propio)
  const rpcUrl = "https://sepolia.era.zksync.dev";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const feeData = await provider.getFeeData();
  return feeData.gasPrice!;
}

export async function getEthUsdPrice(): Promise<number> {
  // CoinGecko simple price API
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!res.ok) throw new Error("No se pudo obtener el precio de ETH");
    const data = await res.json();
    if (!data.ethereum || !data.ethereum.usd) throw new Error("Respuesta inválida de CoinGecko");
    return data.ethereum.usd;
  } catch (e) {
    // Fallback: retorna -1 si hay error
    return -1;
  }
}
