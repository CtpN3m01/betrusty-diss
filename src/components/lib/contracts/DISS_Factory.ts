import { getContract, prepareContractCall, sendTransaction, readContract} from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { client } from "@/app/client";

// Smart Contract DISS Factory 
const contract = getContract({
    address: "0xD1efF26865f6D7190ac7a6d60F9fE76B898Cd277",
    chain: zkSyncSepolia,
    client,
});


// Crear Contrato de Deposito ----------------------------------------------------------------------------
export async function crearContratoDeDepositoEnFactory({
  nombreDelContrato,
  propietario,
  inquilino,
  montoDepositoWei,
  duracionEnSegundos,  account,
}: {
  nombreDelContrato: string;
  propietario: string;
  inquilino: string;
  montoDepositoWei: string;
  duracionEnSegundos: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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