import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


const DepositosList: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);


  // Permite refrescar la lista desde el exterior usando un evento personalizado
  useEffect(() => {
    const handler = () => setRefresh(r => r + 1);
    window.addEventListener("contrato-creado", handler);
    return () => window.removeEventListener("contrato-creado", handler);
  }, []);


  if (loading) return <div className="text-gray-300">Cargando contratos...</div>;
  if (!addresses.length) {
    return <span className="text-gray-300 text-center">Aún no hay contratos desplegados.</span>;
  }

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button variant="outline">Refrescar Contratos</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Dirección del Contrato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address, idx) => (
            <TableRow key={address}>
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