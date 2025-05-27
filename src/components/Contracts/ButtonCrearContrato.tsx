import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { crearContratoDeDepositoEnFactory} from "@/components/lib/contracts/DISS_Factory";
import { getEthUsdPrice } from "@/components/lib/contracts/PriceETH";
import { useActiveAccount } from "thirdweb/react";

interface ButtonCrearContratoProps {
  propietarioAddress?: string;
}


const ButtonCrearContrato: React.FC<ButtonCrearContratoProps> = ({  }) => {
    const [open, setOpen] = useState(false);
    const [nombreDelContrato, setNombreDelContrato] = useState("");
    const [propietario, setPropietario] = useState("");
    const [inquilino, setInquilino] = useState("");
    const [montoDolares, setMontoDolares] = useState("");
    const [duracionEnSegundos, setDuracionEnSegundos] = useState("");
    const [loading, setLoading] = useState(false);

    // Obtener el objeto account
    const account = useActiveAccount();

    // 1 ETH = 1e18 wei. Para convertir USD a wei, necesitas el precio actual de ETH/USD.
    // Aquí solo convierto USD a wei suponiendo 1 ETH = 3500 USD (ejemplo), deberías reemplazarlo por el precio real.
    const usdToWei = (usd: string, ethUsdPrice: number) => {
        const usdValue = parseFloat(usd);
        if (isNaN(usdValue) || ethUsdPrice <= 0) return "0";
        const ethValue = usdValue / ethUsdPrice;
        return BigInt(Math.floor(ethValue * 1e18)).toString();
    };
    const [ethUsdPrice, setEthUsdPrice] = useState<number>();
    React.useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const price = await getEthUsdPrice();
                setEthUsdPrice(price === null ? 0 : price);
                setPropietario(account?.address || "");
            } catch (error) {
                console.error("Error al obtener el precio de ETH/USD:", error);
                setEthUsdPrice(0);
            }        };
        fetchEthPrice();
    }, [account?.address]);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const montoDepositoWei = usdToWei(montoDolares, ethUsdPrice ?? 0);
        try {
            if (!account) throw new Error("No hay cuenta conectada");
            const tx = await crearContratoDeDepositoEnFactory({
                nombreDelContrato,
                propietario,
                inquilino,
                montoDepositoWei,
                duracionEnSegundos,
                account,
            });

            console.log("Transacción enviada:", tx);
            setOpen(false);
            // Dispara evento para refrescar la lista de contratos
            window.dispatchEvent(new Event("contrato-creado"));
            setNombreDelContrato("");
            setInquilino("");
            setMontoDolares("");
            setDuracionEnSegundos("");
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">+ Crear Contrato</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo contrato de depósito</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    {ethUsdPrice === 0 && (
                        <div className="text-red-500 text-sm">No se pudo obtener el precio de ETH/USD. Verifica tu API KEY de Alchemy.</div>
                    )}
                    <Input
                        placeholder="Nombre del contrato"
                        value={nombreDelContrato}
                        onChange={e => setNombreDelContrato(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Propietario (address)"
                        value={propietario}
                        onChange={e => setPropietario(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Inquilino (address)"
                        value={inquilino}
                        onChange={e => setInquilino(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Monto en USD"
                        type="number"
                        min="0"
                        value={montoDolares}
                        onChange={e => setMontoDolares(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Duración en segundos"
                        type="number"
                        min="1"
                        value={duracionEnSegundos}
                        onChange={e => setDuracionEnSegundos(e.target.value)}
                        required
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Crear"}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ButtonCrearContrato;
