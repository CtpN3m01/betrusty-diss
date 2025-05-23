
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getContract, readContract } from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";
import { useReadContract } from "thirdweb/react";




interface DepositosListProps {
  addresses: readonly string[];
}

const DepositosList: React.FC<DepositosListProps> = ({ addresses }) => {
  // Handler para click en una fila
  const handleRowClick = async (address: string) => {
    try {
      const contractContratoSeleccionado = getContract({
        client,
        address,
        chain: zkSyncSepolia,
      });
      // Llamada directa usando thirdweb readContract
      const result = await readContract({
        contract: contractContratoSeleccionado,
        method:
          "function getContratoInfo() public view returns (string memory _nombreDelContrato, address _propietario, address _inquilino, uint8 _estado, uint256 _fechaInicio, uint256 _fechaFinal, uint256 _montoDepositoWei, uint256 _totalDepositadoWei, bool _aprobadoPorPropietario, bool _aprobadoPorInquilino, uint256 _porcentajePropietario, uint256 _porcentajeInquilino)",
        params: [],
      });
      // Mapear el estado numérico a string
      const ESTADO_LABELS = [
        "Pendiente", // 0
        "Activo",    // 1
        "Finalizado" // 2
      ];
      const estadoIndex = Number(result[3]);
      const estadoLabel = ESTADO_LABELS[estadoIndex] ?? `Desconocido (${estadoIndex})`;
      console.log("Info del contrato seleccionado:", { ...result, estadoLabel });
    } catch (error) {
      console.error("Error al obtener info del contrato:", error);
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
    </>
  );
};

export default DepositosList;