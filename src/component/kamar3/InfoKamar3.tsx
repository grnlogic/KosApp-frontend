import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { DoorOpen, CheckCircle, ChevronRight } from "lucide-react";

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

const InfoKamar3 = ({ roomId = 3 }: { roomId?: number }) => {
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

  const facilitiesList = kamar?.fasilitas
    ? kamar.fasilitas.split(",").map((item) => item.trim())
    : [];

  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-[#FFCC00] rounded-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-6 bg-red-50 rounded-xl border border-red-200">
        <div className="text-red-500 font-medium">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-[#FFCC00] text-white rounded-lg hover:bg-[#FF9900] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );

  if (!kamar)
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <div className="text-gray-500">No room data available</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center p-5">
          <DoorOpen className="text-white mr-3" size={24} />
          <h1 className="text-2xl text-white font-bold">Detail Kamar</h1>
        </div>
        <div className="bg-white p-5 space-y-4">
          <div className="flex justify-between items-center p-3 bg-[#FFF8E7] rounded-lg">
            <p className="text-gray-700 font-medium">Nomor Kamar</p>
            <p className="text-[#FF9900] font-bold text-lg">
              {kamar.nomorKamar}
            </p>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#FFF8E7] rounded-lg">
            <p className="text-gray-700 font-medium">Status Pembayaran</p>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-green-500 font-medium">Lunas</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#FFF8E7] rounded-lg">
            <p className="text-gray-700 font-medium">Harga Sewa</p>
            <p className="text-[#FF9900] font-bold text-lg">
              Rp {kamar.hargaBulanan.toLocaleString()}/Bulan
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center p-5">
          <CheckCircle className="text-white mr-3" size={24} />
          <h1 className="text-2xl text-white font-bold">Fasilitas</h1>
        </div>
        <div className="bg-white p-5">
          {facilitiesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {facilitiesList.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-[#FFF8E7] rounded-lg"
                >
                  <CheckCircleIcon className="w-5 h-5 text-[#FF9900] mr-2 flex-shrink-0" />
                  <p className="text-gray-700">{facility}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center bg-[#FFF8E7] rounded-lg text-gray-500">
              No facilities listed
            </div>
          )}
        </div>
      </div>

      {kamar.description && (
        <div className="p-4 rounded-lg bg-[#FFF8E7] border border-[#FFE180] shadow-md">
          <div className="flex justify-between items-center">
            <p className="text-[#FF9900] font-medium">Deskripsi Kamar</p>
            <ChevronRight className="text-[#FF9900]" size={20} />
          </div>
          <p className="mt-2 text-gray-700">{kamar.description}</p>
        </div>
      )}
    </div>
  );
};

export default InfoKamar3;
