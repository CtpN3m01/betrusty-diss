'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export function CrearDepositoDialog({ onCrear, propietarioAddress }: { onCrear: (data: any) => void; propietarioAddress?: string }) {
  const [Propietario, setPropietario] = useState(propietarioAddress || "")
  const [inquilino, setInquilino] = useState("")
  const [token, setToken] = useState("")
  const [monto, setMonto] = useState("")
  const [fecha, setFecha] = useState("")

  const handleSubmit = () => {
    onCrear({ Propietario, inquilino, token, monto, fecha })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFecha(Math.floor(date.getTime() / 1000).toString())
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Crear Contrato de Depósito</DialogTitle>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700">Dirección del propietario</label>
          <Input placeholder="Dirección del propietario" value={Propietario} onChange={(e) => setPropietario(e.target.value)} />
          <label className="text-sm font-medium text-gray-700">Dirección del inquilino</label>
          <Input placeholder="Dirección del inquilino" value={inquilino} onChange={(e) => setInquilino(e.target.value)} />
          <label className="text-sm font-medium text-gray-700">Token ERC20 (address)</label>
          <Input placeholder="Token ERC20 (address)" value={token} onChange={(e) => setToken(e.target.value)} />
          <label className="text-sm font-medium text-gray-700">Monto requerido en USD</label>
          <Input placeholder="Monto requerido en USD" value={monto} onChange={(e) => setMonto(e.target.value)} />
          <label className="text-sm font-medium text-gray-700">Fecha final</label>
          <div className="border rounded-lg p-4 w-[300px]">
            <Calendar
              mode="single"
              selected={fecha ? new Date(parseInt(fecha) * 1000) : undefined}
              onSelect={(date) => {
                handleDateChange(date)
              }}
              className="border rounded p-2"
            />
          </div>
          <Button onClick={handleSubmit}>Crear contrato</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
