import { useActiveAccount } from "thirdweb/react";
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { obtenerInfoContratoDeposito, aprobarFinalizacion } from "@/components/lib/contracts/DISS_Contrato";
import { extractBlockchainErrorMessage } from "@/lib/errorUtils";
import ButtonDepositar from "./ButtonDepositar";

interface ContractInfo {
  nombreDelContrato: string;
  propietario: string;
  inquilino: string;
  estado: string;
  fechaInicio: string;
  fechaFinal: string;
  montoDepositoUsd: string;
  totalDepositadoUsd: string;
  aprobadoPorPropietario: boolean;
  porcentajePropietario: number;
  porcentajeInquilino: number;
}

interface DepositosListProps {
  addresses: readonly string[];
}

const DepositosList: React.FC<DepositosListProps> = ({ addresses }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<ContractInfo | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);  const [porcentajeInquilino, setPorcentajeInquilino] = useState(0);
  const [porcentajePropietario, setPorcentajePropietario] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);

  const account = useActiveAccount();

  // Función para actualizar la información del contrato
  const refreshContractInfo = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    try {
      const updatedInfo = await obtenerInfoContratoDeposito(selectedAddress);
      setSelectedInfo(updatedInfo);
    } catch (error) {
      console.error("Error al actualizar info del contrato:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para click en una fila y obtener info del contrato
  const handleRowClick = async (address: string) => {
    setLoading(true);
    setDialogOpen(true);
    setSelectedInfo(null);
    // Reset approval states when opening a new dialog
    setApprovalError(null);
    setApprovalSuccess(null);
    setPorcentajeInquilino(0);
    setPorcentajePropietario(0);
    try {
      const info = await obtenerInfoContratoDeposito(address!);
      setSelectedAddress(address);
      setSelectedInfo(info);
    } catch (error) {
      console.error("Error al obtener info del contrato:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para aprobar finalización con validación
  const handleAprobarFinalizacion = async () => {
    setApprovalError(null);
    setApprovalSuccess(null);
    setApprovalLoading(true);

    try {
      // Validar que los porcentajes sumen 100
      if (porcentajeInquilino + porcentajePropietario !== 100) {
        throw new Error("Los porcentajes deben sumar exactamente 100%");
      }

      if (porcentajeInquilino < 0 || porcentajePropietario < 0) {
        throw new Error("Los porcentajes no pueden ser negativos");
      }

      if (!account || !selectedAddress) {
        throw new Error("Falta información de la cuenta o dirección del contrato");
      }

      const receipt = await aprobarFinalizacion({ 
        account, 
        address: selectedAddress, 
        porcentajeInquilino, 
        porcentajePropietario 
      });

      setApprovalSuccess("Aprobación realizada con éxito");
      console.log("Aprobación exitosa:", receipt.transactionHash);
      
      // Actualizar la información del contrato
      refreshContractInfo();
        } catch (err: unknown) {
      const errorMessage = extractBlockchainErrorMessage(err);
      setApprovalError(errorMessage);
      console.error("Error completo en aprobación:", err);
    } finally {
      setApprovalLoading(false);
    }
  };
  if (!addresses.length) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white/70 text-center">Aún no hay contratos desplegados.</span>
      </div>
    );
  }
  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">#</TableHead>
              <TableHead className="text-white">Dirección del Contrato</TableHead>
              <TableHead className="text-right">
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address, idx) => (
              <TableRow key={address} className="cursor-pointer hover:bg-white/10 border-white/20" onClick={() => handleRowClick(address)}>
                <TableCell className="text-white">{idx + 1}</TableCell>
                <TableCell className="text-white font-mono text-sm">{address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información del Contrato</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only" />
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-2"></span>
              <span className="text-black">Cargando información...</span>
            </div>
          ) : selectedInfo && (
            <div className="space-y-2 text-sm">
              <div><b>Nombre:</b> {selectedInfo.nombreDelContrato}</div>
              <div><b>Propietario:</b> {selectedInfo.propietario}</div>
              <div><b>Inquilino:</b> {selectedInfo.inquilino}</div>
              <div><b>Estado:</b> {selectedInfo.estado}</div>
              <div><b>Fecha Inicio:</b> {selectedInfo.fechaInicio}</div>
              <div><b>Fecha Final:</b> {selectedInfo.fechaFinal}</div>
              <div><b>Monto Depósito (USD):</b> {selectedInfo.montoDepositoUsd}</div>
              <div><b>Total Depositado (USD):</b> {selectedInfo.totalDepositadoUsd}</div>
              <div><b>Aprobado por Propietario:</b> {selectedInfo.aprobadoPorPropietario ? "Sí" : "No"}</div>
              <div><b>% Propietario:</b> {selectedInfo.porcentajePropietario}</div>
              <div><b>% Inquilino:</b> {selectedInfo.porcentajeInquilino}</div>              {/* Mostrar el botón solo si el usuario es el inquilino */}
              {account?.address === selectedInfo.inquilino && (
                <ButtonDepositar 
                  address={selectedAddress ?? ""} 
                  onDepositoExitoso={refreshContractInfo}
                />
              )}
              {account?.address === selectedInfo.propietario && "Finalizado" === selectedInfo.fechaFinal && (
                <>
                  <div className="flex gap-2">
                    <div className="flex flex-col flex-1">
                      <label htmlFor="porcentajeInquilino" className="text-xs font-medium mb-1">Porcentaje Inquilino</label>
                      <input
                        id="porcentajeInquilino"
                        type="number"
                        className="border rounded px-2 py-1"
                        max={100}
                        value={porcentajeInquilino}
                        onChange={e =>
                          setPorcentajeInquilino(Number(e.target.value))
                        }
                        disabled={approvalLoading}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label htmlFor="porcentajePropietario" className="text-xs font-medium mb-1">Porcentaje Propietario</label>
                      <input
                        id="porcentajePropietario"
                        type="number"
                        max={100}
                        className="border rounded px-2 py-1"
                        value={porcentajePropietario}
                        onChange={e =>
                          setPorcentajePropietario(Number(e.target.value))
                        }
                        disabled={approvalLoading}
                      />
                    </div>
                  </div>
                  
                  {/* Mensaje de validación de porcentajes */}
                  {(porcentajeInquilino + porcentajePropietario) > 0 && (porcentajeInquilino + porcentajePropietario) !== 100 && (
                    <div className="text-yellow-600 text-xs">
                      Total: {porcentajeInquilino + porcentajePropietario}% (debe ser 100%)
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleAprobarFinalizacion}
                    disabled={approvalLoading || (porcentajeInquilino + porcentajePropietario) !== 100}
                  >
                    {approvalLoading ? "Procesando..." : "Aprobar Finalización"}
                  </Button>
                  
                  {/* Mostrar mensajes de error y éxito */}
                  {approvalError && (
                    <div className="text-red-500 text-xs bg-red-50 p-2 rounded border">
                      {approvalError}
                    </div>
                  )}
                  {approvalSuccess && (
                    <div className="text-green-600 text-xs bg-green-50 p-2 rounded border">
                      {approvalSuccess}
                    </div>
                  )}
                </>
              )}
            </div>
            )}
            <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full">Cerrar</Button>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositosList;