export async function getEthUsdPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!res.ok) throw new Error("No se pudo obtener el precio de ETH");
    const data = await res.json();
    return data.ethereum.usd;
  } catch (e) {
    return -1;
  }
}