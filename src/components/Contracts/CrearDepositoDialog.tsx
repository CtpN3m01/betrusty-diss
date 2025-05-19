'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { useDepositos } from "@/lib/contracts"
import { formatAddress, isValidAddress } from "@/lib/contracts"
import { useToast } from "@/components/ui/use-toast"

export function CrearDepositoDialog({ onCrear, propietarioAddress }: { onCrear: (data: any) => void; propietarioAddress?: string }) {
  const [inquilino, setInquilino] = useState("");
  const [token, setToken] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar el hook de depósitos
  const { crear } = useDepositos();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (validarDatos()) {
      setIsLoading(true);
      
      try {
        // Llamar a la función de crear depósito
        const result = await crear({
          inquilino,
          token,
          monto,
          fecha: parseInt(fecha)
        });
        
        if (result.success) {
          // Notificar al componente padre
          onCrear({ 
            Propietario: propietarioAddress, 
            inquilino, 
            token, 
            monto, 
            fecha,
            id: result.depositoId
          });
          
          setIsOpen(false);
          setIsSuccessOpen(true);
          
          // Mostrar toast de éxito
          toast({
            title: "Depósito creado",
            description: `Depósito #${result.depositoId} creado correctamente`,
            variant: "default",
          });
          
          // Limpiar formulario
          limpiarFormulario();
        } else {
          // Mostrar toast de error
          toast({
            title: "Error al crear depósito",
            description: "Ha ocurrido un error al crear el depósito. Inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error al crear depósito:", error);
        toast({
          title: "Error al crear depósito",
          description: "Ha ocurrido un error al crear el depósito. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Datos inválidos",
        description: "Por favor, complete todos los campos correctamente.",
        variant: "destructive",
      });
    }
  };

  const validarDatos = () => {
    if (!propietarioAddress || !inquilino || !token || !monto || !fecha) {
      return false;
    }
    
    // Validar que las direcciones sean válidas
    if (!isValidAddress(inquilino) || !isValidAddress(token)) {
      return false;
    }
    
    // Validar que el monto sea un número positivo
    if (isNaN(Number(monto)) || Number(monto) <= 0) {
      return false;
    }
    
    return true;
  };

  const limpiarFormulario = () => {
    setInquilino("");
    setToken("");
    setMonto("");
    setFecha("");
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
              value={propietarioAddress}
              readOnly
            />
            <label className="text-sm font-medium text-gray-700">Dirección del inquilino</label>
            <Input
              placeholder="Dirección del inquilino"
              value={inquilino}
              onChange={(e) => setInquilino(e.target.value)}
            />
            {inquilino && !isValidAddress(inquilino) && (
              <p className="text-xs text-red-500">Dirección de inquilino inválida</p>
            )}
            <label className="text-sm font-medium text-gray-700">Token ERC20 (address)</label>
            <Input
              placeholder="Token ERC20 (address)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {token && !isValidAddress(token) && (
              <p className="text-xs text-red-500">Dirección de token inválida</p>
            )}
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
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? "Creando..." : "Crear contrato"}
            </Button>
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
