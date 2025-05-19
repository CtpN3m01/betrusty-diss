import { useState, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getDeposito, crearDeposito, aceptarDeposito, finalizarDeposito } from '../depositoContract';
import { Deposito, ESTADO_DEPOSITO } from '../config';

interface UseDepositosProps {
  refetchInterval?: number; // Intervalo de refresco en ms
}

interface UseDepositosReturn {
  depositosPropietario: Deposito[];
  depositosInquilino: Deposito[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  crear: (params: {
    inquilino: string;
    token: string;
    monto: string;
    fecha: number;
  }) => Promise<{ success: boolean; depositoId?: number; error?: any }>;
  aceptar: (depositoId: number) => Promise<{ success: boolean; error?: any }>;
  finalizar: (params: {
    depositoId: number;
    exitoso: boolean;
    razon: string;
  }) => Promise<{ success: boolean; error?: any }>;
}

/**
 * Hook personalizado para gestionar los depósitos
 * @param props Propiedades del hook
 * @returns Métodos y estado para gestionar depósitos
 */
export function useDepositos({ refetchInterval = 30000 }: UseDepositosProps = {}): UseDepositosReturn {
  const account = useActiveAccount();
  const [depositosPropietario, setDepositosPropietario] = useState<Deposito[]>([]);
  const [depositosInquilino, setDepositosInquilino] = useState<Deposito[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [depositoIds, setDepositoIds] = useState<number[]>([]);

  // Función para obtener los depósitos
  const fetchDepositos = useCallback(async () => {
    if (!account) {
      setDepositosPropietario([]);
      setDepositosInquilino([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // En una implementación real, aquí obtendrías la lista de IDs de depósitos
      // relacionados con el usuario desde un evento o una llamada al contrato
      
      // Por ahora, usamos una lista de prueba
      // En producción, deberías obtener esta lista de eventos o de una API
      const mockDepositoIds = [1, 2, 3]; // Ejemplo
      setDepositoIds(mockDepositoIds);

      // Obtener detalles de cada depósito
      const depositos = await Promise.all(
        mockDepositoIds.map(async (id) => {
          const deposito = await getDeposito(id);
          return deposito;
        })
      );

      // Filtrar depósitos válidos y clasificarlos
      const depositosValidos = depositos.filter((d): d is Deposito => d !== null);
      
      setDepositosPropietario(
        depositosValidos.filter(d => 
          d.propietario.toLowerCase() === account.address.toLowerCase()
        )
      );
      
      setDepositosInquilino(
        depositosValidos.filter(d => 
          d.inquilino.toLowerCase() === account.address.toLowerCase()
        )
      );
    } catch (err) {
      console.error("Error al cargar depósitos:", err);
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar depósitos"));
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Función para crear un depósito
  const crear = useCallback(async (params: {
    inquilino: string;
    token: string;
    monto: string;
    fecha: number;
  }) => {
    if (!account) {
      return { success: false, error: new Error("No hay cuenta conectada") };
    }

    try {
      const result = await crearDeposito({
        ...params,
        account
      });

      if (result.success) {
        // Refrescar la lista de depósitos
        fetchDepositos();
      }

      return result;
    } catch (error) {
      console.error("Error al crear depósito:", error);
      return { success: false, error };
    }
  }, [account, fetchDepositos]);

  // Función para aceptar un depósito
  const aceptar = useCallback(async (depositoId: number) => {
    if (!account) {
      return { success: false, error: new Error("No hay cuenta conectada") };
    }

    try {
      const result = await aceptarDeposito({
        depositoId,
        account
      });

      if (result.success) {
        // Refrescar la lista de depósitos
        fetchDepositos();
      }

      return result;
    } catch (error) {
      console.error("Error al aceptar depósito:", error);
      return { success: false, error };
    }
  }, [account, fetchDepositos]);

  // Función para finalizar un depósito
  const finalizar = useCallback(async (params: {
    depositoId: number;
    exitoso: boolean;
    razon: string;
  }) => {
    if (!account) {
      return { success: false, error: new Error("No hay cuenta conectada") };
    }

    try {
      const result = await finalizarDeposito({
        ...params,
        account
      });

      if (result.success) {
        // Refrescar la lista de depósitos
        fetchDepositos();
      }

      return result;
    } catch (error) {
      console.error("Error al finalizar depósito:", error);
      return { success: false, error };
    }
  }, [account, fetchDepositos]);

  // Efecto para cargar depósitos inicialmente
  useEffect(() => {
    fetchDepositos();
  }, [fetchDepositos]);

  // Efecto para refrescar periódicamente
  useEffect(() => {
    if (refetchInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchDepositos();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [fetchDepositos, refetchInterval]);

  return {
    depositosPropietario,
    depositosInquilino,
    isLoading,
    error,
    refetch: fetchDepositos,
    crear,
    aceptar,
    finalizar
  };
} 