"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

// Importamos la red de zkSync Sepolia y el sdk de ConnectButton de thirdweb
import { zkSyncSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

// Necesitamos importar el cliente de thirdweb para poder usarlo en el contrato
import { client } from "./client"
import { useActiveAccount } from "thirdweb/react";

// importamos las funciones necesarias para enviar transacciones al contrato
import {
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";

// Importamos las funciones necesarias para preparar el evento y parsear los logs para poder interactuar con el evento resultadoCalculado
import { 
  prepareEvent, 
  waitForReceipt, 
  parseEventLogs,  
} from "thirdweb";

// Importamos las funciones necesarias para estimar el uso de GAS
import { useEstimateGas } from "thirdweb/react";
import { getGasPrice, getEthUsdPrice } from "./utils";

export default function DISS() {
  // Obtenemos la cuenta activa del usuario
  const account = useActiveAccount();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500">
      <Card className="w-full max-w-xl shadow-2xl border border-white/20 bg-white/20 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="text-3xl font-bold text-white text-center w-full">BeTrusty DISS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="w-full flex justify-center mb-2">
            <ConnectButton client={client} chain={zkSyncSepolia} />
          </div>
          {account && (
            <>
              <Tabs defaultValue="propietario" className="w-full mt-8">
                <TabsList className="w-full flex mb-4">
                  <TabsTrigger value="inquilino" className="flex-1">Inquilino</TabsTrigger>
                  <TabsTrigger value="propietario" className="flex-1">Propietario</TabsTrigger>
                </TabsList>
                <div className="text-center text-gray-400 text-xs mb-[0.5px]">Tus Contratos de Deposito</div>
                <TabsContent value="inquilino">
                  <div
                    className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white/10 border-white/20 mt-4 relative"
                  >
                    <span className="text-gray-300 text-center">Aún no tienes ningún contrato de depósito.<br/>Debes ser invitado a uno y aceptarlo.</span>
                  </div>
                </TabsContent>
                <TabsContent value="propietario">
                  <div
                    className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white/10 border-white/20 mt-4 relative"
                  >
                    <span className="text-gray-300 text-center">Aún no tienes ningún contrato de depósito.<br/>Puedes crear uno en el botón de "+"</span>
                    <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="absolute bottom-4 right-4 w-10 h-10 rounded-md text-2xl p-0 flex items-center justify-center"
                            variant="secondary"
                          >
                            <span className="flex items-center justify-center w-full h-full relative" style={{ top: '-1px' }}>+</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <div
                            className="max-w-4xl w-full bg-white/70 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-2xl px-10 py-8"
                            style={{ boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.18)' }}
                          >
                            <DialogHeader>
                              <DialogTitle className="text-center w-full text-2xl font-bold mb-6 text-gray-800">Complete la información del acuerdo de depósito</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-6">
                              <div className="flex flex-col gap-1">
                                <label className="font-semibold text-base text-gray-700">Nombre del Contrato de Depósito</label>
                                <Input placeholder="Test" className="bg-white/90 border border-gray-300 focus:border-blue-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-semibold text-base text-gray-700">Duración Contrato de Depósito</label>
                                <Input placeholder="2 años" className="bg-white/90 border border-gray-300 focus:border-blue-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-semibold text-base text-gray-700">Propietario (auto)</label>
                                <Input placeholder="0x..." className="bg-white/90 border border-gray-300 focus:border-blue-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-semibold text-base text-gray-700">URL Asociado a la Propiedad</label>
                                <textarea placeholder="https://app.betrusty.io/..." className="bg-white/90 border border-gray-300 focus:border-blue-400 rounded-md px-3 py-2 min-h-[60px] resize-none" />
                              </div>
                              <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="font-semibold text-base text-gray-700">Monto de depósito</label>
                                <Input placeholder="1000USD" className="bg-white/90 border border-gray-300 focus:border-blue-400" />
                              </div>
                            </div>
                            <DialogFooter className="flex flex-row gap-4 justify-center mt-4">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button variant="secondary">Aceptar</Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                  </div>
                </TabsContent>
              </Tabs>
              
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
