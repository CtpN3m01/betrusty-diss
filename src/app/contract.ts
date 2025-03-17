import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./client";


// connect to your contract
export const contract = getContract({
    client,
    chain: defineChain(1),
    address: "0x...",
  });