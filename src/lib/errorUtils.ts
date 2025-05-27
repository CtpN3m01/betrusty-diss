/**
 * Utility functions for extracting and formatting blockchain error messages
 */

/**
 * Decodes hex-encoded error message from blockchain data
 * @param hexData - Hex string containing encoded error message
 * @returns Decoded error message or null if not decodable
 */
function decodeHexErrorMessage(hexData: string): string | null {
  try {
    // Remove 0x prefix if present
    const cleanHex = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
    
    // Check if it's a revert with reason (method signature: 0x08c379a0)
    if (cleanHex.startsWith('08c379a0')) {
      // Skip the method signature (8 chars) and offset (64 chars)
      const dataStart = 8 + 64;
      
      // Get the length of the string (next 64 chars)
      const lengthHex = cleanHex.slice(dataStart, dataStart + 64);
      const length = parseInt(lengthHex, 16);
      
      // Get the actual message data
      const messageStart = dataStart + 64;
      const messageHex = cleanHex.slice(messageStart, messageStart + length * 2);
      
      // Convert hex to bytes and then to string
      let message = '';
      for (let i = 0; i < messageHex.length; i += 2) {
        const byte = parseInt(messageHex.slice(i, i + 2), 16);
        if (byte !== 0) { // Skip null bytes
          message += String.fromCharCode(byte);
        }
      }
      
      return message.trim();
    }
  } catch (error) {
    console.log('Error decoding hex data:', error);
  }
  
  return null;
}

/**
 * Extracts the specific error message from a blockchain transaction error * @param error - The error object from the transaction
 * @returns A user-friendly error message
 */
export function extractBlockchainErrorMessage(error: unknown): string {
  // Handle different error formats that might contain the revert message
    // Type guard to check if error is an object with properties
  const isErrorObject = (err: unknown): err is Record<string, unknown> => {
    return typeof err === 'object' && err !== null;
  };
  
  // Check for direct message first
  if (isErrorObject(error) && typeof error.message === 'string') {
    // Look for revert messages in common formats
    const revertPatterns = [
      /execution reverted: (.+)/i,
      /revert (.+)/i,
      /Error: (.+)/i,
    ];
    
    for (const pattern of revertPatterns) {
      const match = error.message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  // Check for encoded error in data field
  if (isErrorObject(error) && typeof error.data === 'string') {
    const decodedMessage = decodeHexErrorMessage(error.data);
    if (decodedMessage) {
      return decodedMessage;
    }
  }
    // Check for nested error objects
  if (isErrorObject(error) && isErrorObject(error.cause) && typeof error.cause.message === 'string') {
    return extractBlockchainErrorMessage(error.cause);
  }
  
  if (isErrorObject(error) && typeof error.reason === 'string') {
    return error.reason;
  }
    // Check error.info or error.details
  if (isErrorObject(error) && isErrorObject(error.info) && isErrorObject(error.info.error) && typeof error.info.error.message === 'string') {
    return extractBlockchainErrorMessage(error.info.error);
  }
  
  // Check if it's a thirdweb specific error format
  if (isErrorObject(error) && isErrorObject(error.details)) {
    return extractBlockchainErrorMessage(error.details);
  }
  
  // Look for specific contract errors in the entire error string
  const errorString = JSON.stringify(error).toLowerCase();
  
  if (errorString.includes('porcentajes incorrectos')) {
    return 'Porcentajes incorrectos.';
  }
  
  if (errorString.includes('insufficient funds')) {
    return 'Fondos insuficientes.';
  }
  
  if (errorString.includes('unauthorized') || errorString.includes('not authorized')) {
    return 'No autorizado para realizar esta acción.';
  }
  
  if (errorString.includes('contract paused')) {
    return 'El contrato está pausado.';
  }
  
  if (errorString.includes('invalid amount')) {
    return 'Cantidad inválida.';
  }
  
  // Default error messages based on common scenarios
  if (isErrorObject(error) && typeof error.message === 'string' && error.message.includes('user rejected')) {
    return 'Transacción cancelada por el usuario.';
  }
  
  if (isErrorObject(error) && typeof error.message === 'string' && error.message.includes('network')) {
    return 'Error de conexión a la red.';
  }
  
  // Return the original message if we can't extract anything specific
  if (isErrorObject(error) && typeof error.message === 'string') {
    return error.message;
  }
  
  return 'Error desconocido en la transacción.';
}

/**
 * Maps common blockchain error codes to user-friendly messages
 */
export const ERROR_MESSAGES = {
  USER_REJECTED: 'Transacción cancelada por el usuario.',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes para realizar la transacción.',
  NETWORK_ERROR: 'Error de conexión a la red blockchain.',
  CONTRACT_ERROR: 'Error en el contrato inteligente.',
  INVALID_PARAMS: 'Parámetros inválidos.',
  UNAUTHORIZED: 'No autorizado para realizar esta acción.',
} as const;
