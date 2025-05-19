import { createThirdwebClient } from "thirdweb";
import { NETWORK_CONFIG } from "./config";
import { ethers } from "ethers";

// Cliente de thirdweb
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided - Set NEXT_PUBLIC_TEMPLATE_CLIENT_ID in .env");
}

// Cliente principal de thirdweb
export const client = createThirdwebClient({
  clientId: clientId,
});

// Proveedor de ethers para operaciones adicionales
export const getProvider = () => {
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.RPC_URL);
};

// Función para obtener una instancia de wallet
export const getSigner = async (provider: ethers.Provider) => {
  // Esta función debe ser implementada según el método de autenticación
  // que estés utilizando (MetaMask, WalletConnect, etc.)
  throw new Error("getSigner not implemented");
}; 