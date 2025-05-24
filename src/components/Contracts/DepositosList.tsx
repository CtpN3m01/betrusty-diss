import { useActiveAccount } from "thirdweb/react";
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { obtenerInfoContratoDeposito, aprobarFinalizacion, retirarFondos } from "@/components/lib/contracts/DISS_Contrato";
import ButtonDepositar from "./ButtonDepositar";
interface DepositosListProps {
  addresses: readonly string[];
}

const DepositosList: React.FC<DepositosListProps> = ({ addresses }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const account = useActiveAccount();

  // Handler para click en una fila y obtener info del contrato
  const handleRowClick = async (address: string) => {
    setLoading(true);
    setDialogOpen(true);
    setSelectedInfo(null);
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

  if (!addresses.length) {
    return <span className="text-gray-300 text-center">Aún no hay contratos desplegados.</span>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Dirección del Contrato</TableHead>
            <TableHead className="text-right">
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address, idx) => (
            <TableRow key={address} className="cursor-pointer hover:bg-blue-100/10" onClick={() => handleRowClick(address)}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
              <div><b>Aprobado por Inquilino:</b> {selectedInfo.aprobadoPorInquilino ? "Sí" : "No"}</div>
              <div><b>% Propietario:</b> {selectedInfo.porcentajePropietario}</div>
              <div><b>% Inquilino:</b> {selectedInfo.porcentajeInquilino}</div>
              {/* Mostrar el botón solo si el usuario es el inquilino */}
              {account?.address === selectedInfo.inquilino && (
                <ButtonDepositar address={selectedAddress ?? ""} />
              )}
              <Button
                className="w-full"
                onClick={() => aprobarFinalizacion({ account, address: selectedAddress! })}
              >
                Aprobar Finalización
              </Button>
              <Button
                className="w-full"
                onClick={() => retirarFondos({ account, address: selectedAddress! })}
              >
                Retirar
              </Button>
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