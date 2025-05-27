"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
              <Tabs defaultValue="Usuario DISS" className="w-full mt-8">
                <TabsList className="w-full flex mb-4">
                  <TabsTrigger value="Usuario DISS" className="flex-1">Usuario DISS</TabsTrigger>
                </TabsList>                <TabsContent value="Usuario DISS">
                  <div className="flex flex-col h-[500px] border rounded-lg bg-white/10 border-white/20 mt-4 relative">
                    {/* Título de la sección */}
                    <h3 className="absolute top-4 left-4 text-white font-semibold text-lg z-10">
                      Contratos Totales
                    </h3>
                    
                    <button
                      className={`absolute top-4 right-4 rounded-full p-2 transition-colors z-10 ${
                        isReloading 
                          ? 'bg-white/10 cursor-not-allowed' 
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      onClick={obtenerListaDeContratos}
                      disabled={isReloading}
                      title={isReloading ? "Cargando..." : "Actualizar contratos"}
                    >
                      <ReloadIcon className={`w-5 h-5 text-white ${isReloading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Lista de contratos con scroll */}
                    <div className="flex-1 p-4 pt-16">
                      {isReloading ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></span>
                          <span className="text-white">Cargando contratos...</span>
                        </div>
                      ) : (
                        <ScrollArea className="h-full">
                          <DepositosList addresses={listaDeContratos} />
                        </ScrollArea>
                      )}
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
