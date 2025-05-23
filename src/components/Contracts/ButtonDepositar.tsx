
import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";

import { depositarEnContrato } from "../lib/contracts/DISS_Contrato";

interface ButtonDepositarProps {
  address: string;
  onDepositoExitoso?: (receipt: any) => void;
}

const ButtonDepositar: React.FC<ButtonDepositarProps> = ({ address, onDepositoExitoso }) => {
  const account = useActiveAccount();
  const [cantidadEnUsd, setCantidadEnUsd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDepositar = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!address) throw new Error("Dirección del contrato no válida");
      if (!account) throw new Error("Conecta tu wallet primero");
      if (!cantidadEnUsd || isNaN(Number(cantidadEnUsd)) || Number(cantidadEnUsd) <= 0) {
        throw new Error("Ingresa una cantidad válida de USD");
      }

      // Verificar si la cuenta es el inquilino
      const { obtenerInfoContratoDeposito } = await import("@/components/lib/contracts/DISS_Contrato");
      const info = await obtenerInfoContratoDeposito(address);
      if (info.inquilino.toLowerCase() !== account.address.toLowerCase()) {
        throw new Error("Solo el inquilino puede depositar en este contrato.");
      }

      const receipt = await depositarEnContrato({
        account,
        address,
        cantidadEnUsd,
      });
      setSuccess("Depósito realizado con éxito");
      if (onDepositoExitoso) onDepositoExitoso(receipt);
    } catch (err: any) {
      setError(err.message || "Error al depositar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        type="number"
        min="0"
        step="any"
        placeholder="Cantidad en USD"
        value={cantidadEnUsd}
        onChange={e => setCantidadEnUsd(e.target.value)}
        disabled={loading}
      />
      <Button onClick={handleDepositar} disabled={loading || !account} className="w-full">
        {loading ? "Depositando..." : "Depositar"}
      </Button>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      {success && <div className="text-green-600 text-xs">{success}</div>}
    </div>
  );
};

export default ButtonDepositar;




