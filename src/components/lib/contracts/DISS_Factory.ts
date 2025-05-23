import { getContract, prepareContractCall, sendTransaction, readContract} from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";
import { getEthUsdPrice } from "@/components/lib/contracts/PriceETH";

// Smart Contract DISS Factory 
const contract = getContract({
    address: "0x2da14037e48d6d6db339da60466678748a63b955",
    chain: zkSyncSepolia,
    client,
});


// ABI del Factory  
export const abiFactory = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "contrato", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "propietario", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "inquilino", "type": "address" }
    ],
    "name": "ContratoCreado",
    "type": "event"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "name": "contratoPorId",
    "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_nombreDelContrato", "type": "string" },
      { "internalType": "address", "name": "_propietario", "type": "address" },
      { "internalType": "address", "name": "_inquilino", "type": "address" },
      { "internalType": "uint256", "name": "_montoDepositoWei", "type": "uint256" },
      { "internalType": "uint256", "name": "_duracionEnSegundos", "type": "uint256" }
    ],
    "name": "crearContratoDeDeposito",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "name": "deployedContracts",
    "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ],
    "name": "obtenerContrato",
    "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "obtenerTodosLosContratos",
    "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalContratos",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Crear Contrato de Deposito ----------------------------------------------------------------------------
export async function crearDepositoEnFactory({
  nombreDelContrato,
  propietario,
  inquilino,
  montoDepositoWei,
  duracionEnSegundos,
  account,
}: {
  nombreDelContrato: string;
  propietario: string;
  inquilino: string;
  montoDepositoWei: string;
  duracionEnSegundos: string;
  account: any;
}) {

  const transaction = prepareContractCall({
  contract,
  method: "function crearContratoDeDeposito(string memory _nombreDelContrato, address _propietario, address _inquilino, uint256 _montoDepositoWei, uint256 _duracionEnSegundos)",
  params: [
    nombreDelContrato,
    propietario,
    inquilino,
    BigInt(montoDepositoWei),
    BigInt(duracionEnSegundos)
  ],
  });

  const { transactionHash } = await sendTransaction({
    account,
    transaction,
  });
  
  return transactionHash;
}

// Obtener todos los contratos -------------------------------------------------------------------------
export async function obtenerTodosLosContratos() {
  const result = await readContract({
    contract,
    method: "function obtenerTodosLosContratos() public view returns (address[] memory)",
    params: [],
  });
  return result;
}

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