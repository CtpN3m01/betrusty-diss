const ALCHEMY_PRICE_URL = process.env.NEXT_PUBLIC_ALCHEMY_PRICE_URL as string;

export async function getEthUsdPrice(): Promise<number | null> {
  const url = ALCHEMY_PRICE_URL;
  const body = {
    addresses: [
      {
        network: "eth-mainnet",
        address: "0x0000000000000000000000000000000000000000"
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) return null;

  const data = await res.json();
  // Navega hasta el valor del precio en USD
  const value = data?.data?.[0]?.prices?.find((p: any) => p.currency === "usd")?.value;
  return value ? Number(value) : null;
}