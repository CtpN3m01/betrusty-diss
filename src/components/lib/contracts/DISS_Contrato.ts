import { getEthUsdPrice } from "@/components/lib/contracts/PriceETH";

import { getContract, prepareContractCall, sendTransaction, readContract, sendAndConfirmTransaction} from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";


// Obtener info de un contrato de depósito --------------------------------------------------------------
export async function obtenerInfoContratoDeposito(address: string) {
    const contractContratoSeleccionado = getContract({
        client,
        address,
        chain: zkSyncSepolia,
    });

    const result = await readContract({
        contract: contractContratoSeleccionado,
        method:
        "function getContratoInfo() public view returns (string memory _nombreDelContrato, address _propietario, address _inquilino, uint8 _estado, uint256 _fechaInicio, uint256 _fechaFinal, uint256 _montoDepositoWei, uint256 _totalDepositadoWei, bool _aprobadoPorPropietario, bool _aprobadoPorInquilino, uint256 _porcentajePropietario, uint256 _porcentajeInquilino)",
        params: [],
    });
    // Mapear el estado numérico a string
    const ESTADO_LABELS = [
        "Activo", // 0
        "Inactivo",    // 1
        "Finalizado" // 2
    ];
    const estadoIndex = Number(result[3]);
    const estadoLabel = ESTADO_LABELS[estadoIndex] ?? `Desconocido (${estadoIndex})`;

    // Obtener el precio actual de ETH en USD
    const ethPriceUsd = await getEthUsdPrice();

    if (ethPriceUsd === null) {
        throw new Error("No se pudo obtener el precio de ETH en USD.");
    }

    // Convertir montoDepositoWei a ETH y de ahí a USD
    const montoDepositoEth = Number(result[6]) / 1e18;
    const montoDepositoUsd = montoDepositoEth * ethPriceUsd;

    // Convertir totalDepositadoWei a ETH y de ahí a USD
    const totalDepositadoEth = Number(result[7]) / 1e18;
    const totalDepositadoUsd = totalDepositadoEth * ethPriceUsd;

    // Crear un objeto con la información del contrato
    const contratoInfo = {
        nombreDelContrato: result[0],
        propietario: result[1],
        inquilino: result[2],
        estado: estadoLabel,
        fechaInicio: new Date(Number(result[4]) * 1000).toLocaleString(),
        fechaFinal: new Date(Number(result[5]) * 1000).toLocaleString(),
        montoDepositoUsd: montoDepositoUsd.toFixed(2),
        totalDepositadoUsd: totalDepositadoUsd.toFixed(2),
        aprobadoPorPropietario: result[8],
        aprobadoPorInquilino: result[9],
        porcentajePropietario: Number(result[10]),
        porcentajeInquilino: Number(result[11]),
    };
    return contratoInfo;
}

export async function depositarEnContrato({
    account,
    address, 
    cantidadEnUsd,
}: {
    account: any;
    address: string;
    cantidadEnUsd: string;
}) {
  try {
    const contratoDeposito = getContract({
      client,
      address,
      chain: zkSyncSepolia,
    });

    // Obtener el precio actual de ETH en USD
    const ethPriceUsd = await getEthUsdPrice();
    if (ethPriceUsd === null) {
      throw new Error("No se pudo obtener el precio de ETH en USD.");
    }

    // Convertir cantidadEnUsd a ETH
    const cantidadEth = Number(cantidadEnUsd) / ethPriceUsd;

    // Convertir la cantidad de ETH a wei
    const cantidadWei = BigInt(Math.floor(cantidadEth * 1e18));

    // Prepara la llamada al método `depositar`
    const tx = prepareContractCall({
      contract: contratoDeposito,
      method: "function depositar() external payable",
      params: [],
      value: cantidadWei,
    });

    // Envía y confirma la transacción
    const receipt = await sendAndConfirmTransaction({
      account,
      transaction: tx,
    });

    console.log("Depósito realizado:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("Error al depositar:", error);
    throw error;
  }
}


export async function aprobarFinalizacion({
    account,
    address, 
}: {
    account: any;
    address: string;
}) {
    try {
        const contratoDeposito = getContract({
            client,
            address,
            chain: zkSyncSepolia,
        });

        // Prepara la llamada al método `depositar`
        const tx = prepareContractCall({
            contract: contratoDeposito,
            method: "function aprobarFinalizacion() external",
            params: [],
        });

        // Envía y confirma la transacción
        const receipt = await sendAndConfirmTransaction({
            account,
            transaction: tx,
        });

        console.log("Aprobacion Realizada por:", receipt.from);
        console.log("Hash de Tx:", receipt.transactionHash);
        return receipt;
  } catch (error) {
    console.error("Error realizar aprobación:", error);
    throw error;
  }
}


export async function retirarFondos({
    account,
    address, 
}: {
    account: any;
    address: string;
}) {
    try {
        const contratoDeposito = getContract({
            client,
            address,
            chain: zkSyncSepolia,
        });

        // Prepara la llamada al método `depositar`
        const tx = prepareContractCall({
            contract: contratoDeposito,
            method: "function retirarFondos() external",
            params: [],
        });

        // Envía y confirma la transacción
        const receipt = await sendAndConfirmTransaction({
            account,
            transaction: tx,
        });
        console.log("Hash de Tx:", receipt.transactionHash); 
        return receipt;
    } catch (error) {
        console.error("Error al retirar fondos:", error);
        throw error;
    }
}