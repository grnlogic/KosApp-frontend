import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

interface KamarData {
  id: number;
  nomorKamar: string;
  status: string;
  hargaBulanan: number;
  fasilitas: string;
  title: string;
  description: string;
  price: number;
}

const InfoKamar2 = ({ roomId = 2 }: { roomId?: number }) => {
  const [kamar, setKamar] = useState<KamarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKamarData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://manage-kost-production.up.railway.app/api/kamar/${roomId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }

        const data = await response.json();
        setKamar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching room data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKamarData();
  }, [roomId]);

  // Parse facilities from string to array
  const facilitiesList = kamar?.fasilitas
    ? kamar.fasilitas.split(",").map((item) => item.trim())
    : [];

  if (loading)
    return <div className="text-center py-4">Loading room details...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!kamar)
    return <div className="text-center py-4">No room data available</div>;

  return (
    <div>
      <div className="bg-[#FEBF00] rounded shadow-custom">
        <div className="flex justify-start pl-4 pt-4">
          <h1 className="text-2xl text-white font-bold">Detail Kamar</h1>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">Nomor Kamar</p>
          <p className="text-1xl text-white font-medium ">{kamar.nomorKamar}</p>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8">
          <p className="text-1xl text-white font-medium">Status Pembayaran</p>
          <p className="text-1xl text-[#82DEA4] font-medium ">Bayar</p>
        </div>
        <div className="flex justify-between pl-8 pt-3 pr-8 pb-3">
          <p className="text-1xl text-white font-medium">Harga Sewa</p>
          <p className="text-1xl text-white font-bold">
            Rp {kamar.hargaBulanan.toLocaleString()}/Bulan
          </p>
        </div>
      </div>

      <div className="bg-[#FEBF00] rounded shadow-custom mt-4">
        <div className="flex justify-start pl-4 pt-4">
          <h1 className="text-2xl text-white font-bold">Fasilitas</h1>
        </div>
        {facilitiesList.length > 0 ? (
          facilitiesList.map((facility, index) => (
            <div key={index} className="flex justify-between pl-8 pt-3 pr-8">
              <p className="text-1xl text-white font-medium">{facility}</p>
              <CheckCircleIcon className="w-6 h-6 text-blue-500" />
            </div>
          ))
        ) : (
          <div className="pl-8 pt-3 pr-8 pb-3 text-white">
            No facilities listed
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoKamar2;
