'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export function CrearDepositoDialog({ onCrear, propietarioAddress }: { onCrear: (data: any) => void; propietarioAddress?: string }) {
  const [Propietario, setPropietario] = useState(propietarioAddress || "");
  const [inquilino, setInquilino] = useState("");
  const [token, setToken] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el diálogo principal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // Estado para el diálogo de éxito

  const handleSubmit = () => {
    if (validarDatos()) {
      onCrear({ Propietario, inquilino, token, monto, fecha });
      setIsOpen(false); // Cierra el diálogo principal
      setIsSuccessOpen(true); // Abre el diálogo de éxito
    } else {
      alert("Por favor, complete todos los campos correctamente.");
    }
  };

  const validarDatos = () => {
    if (!Propietario || !inquilino || !token || !monto || !fecha) {
      return false;
    }
    if (isNaN(Number(monto)) || Number(monto) <= 0) {
      return false;
    }
    return true;
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFecha(Math.floor(date.getTime() / 1000).toString());
    }
  };

  return (
    <>
      {/* Diálogo principal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>+</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Crear Contrato de Depósito</DialogTitle>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Dirección del propietario</label>
            <Input
              placeholder="Dirección del propietario"
              value={Propietario}
              onChange={(e) => setPropietario(e.target.value)}
              readOnly
            />
            <label className="text-sm font-medium text-gray-700">Dirección del inquilino</label>
            <Input
              placeholder="Dirección del inquilino"
              value={inquilino}
              onChange={(e) => setInquilino(e.target.value)}
            />
            <label className="text-sm font-medium text-gray-700">Token ERC20 (address)</label>
            <Input
              placeholder="Token ERC20 (address)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <label className="text-sm font-medium text-gray-700">Monto requerido en USD</label>
            <Input
              type="text"
              placeholder="Monto requerido en USD"
              value={monto}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setMonto(value);
                }
              }}
            />
            <label className="text-sm font-medium text-gray-700">Fecha final</label>
            <div className="border rounded-lg p-4 w-[300px]">
              <Calendar
                mode="single"
                selected={fecha ? new Date(parseInt(fecha) * 1000) : undefined}
                onSelect={(date) => {
                  handleDateChange(date);
                }}
                className="border rounded p-1"
              />
            </div>
            <Button onClick={handleSubmit}>Crear contrato</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de éxito */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent>
          <DialogTitle>¡Contrato creado con éxito!</DialogTitle>
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-gray-700 text-center">El contrato se ha creado correctamente.</p>
            <Button className="mt-4" onClick={() => setIsSuccessOpen(false)}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
