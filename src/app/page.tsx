"use client";

import React, { useState } from 'react';
import DepositosList from "../components/Contracts/DepositosList";
import BuscarContratoInput from "../components/Contracts/BuscarContratoInput";
import ButtonCrearContrato from "../components/Contracts/ButtonCrearContrato";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Importamos la red de zkSync Sepolia y el sdk de ConnectButton de thirdweb
import { zkSyncSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

// Necesitamos importar el cliente de thirdweb para poder usarlo en el contrato
import { client } from "./client"
import { useActiveAccount } from "thirdweb/react";


const Page = () => {
  // Obtenemos la cuenta activa del usuario
  const account = useActiveAccount();
  const [busqueda, setBusqueda] = useState("");

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
                  <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white/10 border-white/20 mt-4 relative">
                    <span className="text-gray-300 text-center">Aún no tienes ningún contrato de depósito.<br/>Debes ser invitado a uno y aceptarlo.</span>
                  </div>
                </TabsContent>
                <TabsContent value="propietario">
                  <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white/10 border-white/20 mt-4 relative">
                    {/* Input de búsqueda modularizado */}
                    <div className="w-full px-4 mb-4 absolute top-2 left-1 flex items-center">
                      <BuscarContratoInput value={busqueda} onChange={setBusqueda} />
                    </div>

                    {/* Lista de contratos modularizada */}
                    <div className="flex flex-col items-center justify-center w-full mt-16 h-full">
                      <DepositosList  />
                    </div>

                    {/* Botón para crear contrato (aquí irá el dialog) */}
                    <div className="absolute bottom-4 right-4">
                      {/* Aquí puedes agregar el botón o dialog para crear contrato */}
                      <ButtonCrearContrato />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
