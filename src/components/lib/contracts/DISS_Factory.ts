import { getContract, prepareContractCall, sendTransaction, readContract} from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";

// Smart Contract DISS Factory 
const contract = getContract({
    address: "0xC50F0855692bebB833A2e272520fcAb2a2728A1d",
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
export async function crearContratoDeDepositoEnFactory({
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