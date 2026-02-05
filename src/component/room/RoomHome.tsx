import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomService, Room } from "../../services/roomService";
import Navbar from "../../Navbar";
import {
  Bell,
  CreditCard,
  Calendar,
  Info,
  HelpCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import Commet from "../admin/Commet";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tanggalBerlaku: string;
}

const RoomHome: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [pengumuman, setPengumuman] = useState<Pengumuman | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        if (roomId) {
          const roomData = await roomService.getRoomById(parseInt(roomId));
          setRoom(roomData);
        }

        // Fetch latest pengumuman
        try {
          const response = await fetch(
            "http://141.11.25.167:8080/api/pengumuman/1"
          );
          if (response.ok) {
            const data = await response.json();
            setPengumuman(data);
          }
        } catch (err) {
          console.error("Error fetching pengumuman:", err);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Gagal memuat data kamar. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat data kamar..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
            <p className="text-red-600 text-xl mb-4">
              {error || "Kamar tidak ditemukan"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 font-semibold shadow-md transition-all"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="container mx-auto px-4 py-6 lg:py-8 pt-20 lg:pt-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 lg:p-8 mb-6 lg:mb-8 text-white transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2 lg:gap-3">
                <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 animate-pulse" />
                <span>Selamat Datang di Kamar {room.nomorKamar}</span>
              </h1>
              <p className="text-yellow-50 text-base lg:text-lg">
                Kelola semua kebutuhan kost Anda dengan mudah
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Status Kamar</p>
                <p className="text-xl lg:text-2xl font-bold mt-1">
                  {room.status === "kosong"
                    ? "Tersedia"
                    : room.status === "terisi"
                    ? "Terisi"
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pengumuman Section */}
        {pengumuman && (
          <div className="bg-white rounded-2xl shadow-xl p-5 lg:p-6 mb-6 lg:mb-8 border-l-4 border-yellow-400 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">📢</span>
                    <span>{pengumuman.judul}</span>
                  </h3>
                  <span className="text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(pengumuman.tanggalBerlaku)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                  {pengumuman.isi}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Room Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 lg:mb-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-5 lg:px-6 py-4">
            <h2 className="text-white font-bold text-lg lg:text-xl">
              Informasi Kamar
            </h2>
          </div>
          <div className="p-5 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                <p className="text-gray-600 text-xs lg:text-sm mb-1">
                  Nomor Kamar
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">
                  {room.nomorKamar}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                <p className="text-gray-600 text-xs lg:text-sm mb-1">
                  Harga per Bulan
                </p>
                <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                  Rp {room.hargaBulanan.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <p className="text-gray-600 text-xs lg:text-sm mb-1">
                  Status Pembayaran
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    room.statusPembayaran === "Lunas"
                      ? "bg-green-100 text-green-800"
                      : room.statusPembayaran === "Menunggu"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.statusPembayaran || "Belum Bayar"}
                </span>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base lg:text-lg">
                Fasilitas Kamar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {room.fasilitas.split(",").map((fasilitas, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-br from-yellow-50 to-amber-50 p-3 rounded-lg border border-yellow-200 hover:shadow-md hover:scale-105 transition-all duration-300"
                  >
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 text-xs lg:text-sm font-medium">
                      {fasilitas.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <button
            onClick={() => navigate(`/room/${roomId}/info`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Info className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  Info Kamar
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Detail lengkap kamar Anda
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/room/${roomId}/pembayaran`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  Pembayaran
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Kelola tagihan kost
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/room/${roomId}/jadwal-kebersihan`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  Jadwal Kebersihan
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Lihat jadwal piket
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/room/${roomId}/peraturan`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  Peraturan Kost
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Aturan yang harus dipatuhi
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/room/${roomId}/faq`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <HelpCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  FAQ
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Pertanyaan umum
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/room/${roomId}/pengumuman`)}
            className="group bg-white rounded-2xl shadow-lg p-5 lg:p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                  Pengumuman
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Info penting dari admin
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 lg:mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-5 lg:p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-base lg:text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">📞</span>
                <span>Kontak Darurat</span>
              </h3>
              <ul className="space-y-2 text-yellow-50 text-sm">
                <li>• Pemilik Kost: 0812-xxxx-xxxx</li>
                <li>• Security: 0813-xxxx-xxxx</li>
                <li>• Darurat: 112</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base lg:text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <span>Jam Operasional</span>
              </h3>
              <ul className="space-y-2 text-yellow-50 text-sm">
                <li>• Senin - Jumat: 08.00 - 17.00</li>
                <li>• Sabtu: 08.00 - 12.00</li>
                <li>• Minggu: Tutup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHome;
