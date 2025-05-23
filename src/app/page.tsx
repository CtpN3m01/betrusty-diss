"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import DepositosList from "@/components/Contracts/DepositosList";
import ButtonCrearContrato from "@/components/Contracts/ButtonCrearContrato";
import { obtenerTodosLosContratos } from '@/components/lib/contracts/DISS_Factory';
import { zkSyncSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client"
import { useActiveAccount } from "thirdweb/react";




const Page = () => {
  // Obtenemos la cuenta activa del usuario
  const account = useActiveAccount();
  const [listaDeContratos, setListaDeContratos] = useState<readonly string[]>([]);

  // Handler para obtener la lista de contratos
  const [isReloading, setIsReloading] = useState(false);

  const obtenerListaDeContratos = async () => {
    setIsReloading(true);
    try {
      const data = await obtenerTodosLosContratos();
      setListaDeContratos(data);
    } catch (error) {
      console.error("Error al obtener la lista de contratos:", error);
    } finally {
      setIsReloading(false);
    }
  };

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
                <TabsContent value="inquilino">
                  <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white/10 border-white/20 mt-4 relative">
                    <span className="text-gray-300 text-center">Aún no tienes ningún contrato de depósito.<br/>Debes ser invitado a uno y aceptarlo.</span>
                  </div>
                </TabsContent>
                <TabsContent value="propietario">
                  <div className="flex flex-col items-center justify-center h-100 border rounded-lg bg-white/10 border-white/20 mt-4 relative">
                    <button
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
                      onClick={obtenerListaDeContratos}
                      title="Actualizar contratos"
                    >
                      <ReloadIcon className="w-5 h-5 text-white" />
                    </button>
                    {/* Lista de contratos modularizada */}
                    <div className="flex flex-col items-center justify-center w-full mt-5 h-full">
                      <DepositosList addresses={listaDeContratos} />
                    </div>

                    {/* Botón para crear contrato*/}
                    <div className="absolute bottom-4 right-4">
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
