import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomService, Room } from "../../services/roomService";
import Navbar from "../../Navbar";
import { Info, DollarSign, CheckCircle, Phone, Clock } from "lucide-react";
import Commet from "../admin/Commet";

const RoomInfo: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        if (roomId) {
          const roomData = await roomService.getRoomById(parseInt(roomId));
          setRoom(roomData);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Gagal memuat data kamar");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
              onClick={() => navigate(`/room/${roomId}`)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg hover:from-yellow-500 hover:to-amber-600 font-semibold shadow-md transition-all"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="pt-20 px-4 pb-6 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 lg:p-8 mb-6 lg:mb-8 text-white">
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className="flex items-center text-white hover:text-yellow-100 mb-4 transition-colors duration-300 hover:translate-x-1"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl">
                <Info className="w-10 h-10 lg:w-12 lg:h-12" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Informasi Kamar {room.nomorKamar}
                </h1>
                <p className="text-yellow-50 text-sm lg:text-lg">
                  Detail lengkap kamar Anda
                </p>
              </div>
            </div>
          </div>

          {/* Room Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Nomor Kamar Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-5 lg:px-6 py-3 lg:py-4">
                <h3 className="text-white font-bold text-sm lg:text-base">Nomor Kamar</h3>
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-yellow-100 p-2 lg:p-3 rounded-xl">
                    <Info className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">Kamar</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {room.nomorKamar}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-5 lg:px-6 py-3 lg:py-4">
                <h3 className="text-white font-bold text-sm lg:text-base">Status Kamar</h3>
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-yellow-100 p-2 lg:p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-2">Status</p>
                    <span
                      className={`inline-block px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-bold ${
                        room.status === "kosong"
                          ? "bg-green-100 text-green-800"
                          : room.status === "terisi"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.status === "kosong"
                        ? "Tersedia"
                        : room.status === "terisi"
                        ? "Terisi"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Harga Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-5 lg:px-6 py-3 lg:py-4">
                <h3 className="text-white font-bold text-sm lg:text-base">Harga Sewa</h3>
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-yellow-100 p-2 lg:p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">Per Bulan</p>
                    <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                      Rp {room.hargaBulanan.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Facilities */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
                  <h2 className="text-white font-bold text-xl">
                    Fasilitas Kamar
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {room.fasilitas.split(",").map((fasilitas, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg hover:shadow-md transition-shadow border border-yellow-200"
                      >
                        <div className="flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium text-lg">
                          {fasilitas.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              {room.statusPembayaran && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
                    <h2 className="text-white font-bold text-xl">
                      Status Pembayaran
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                      <span className="text-gray-700 font-medium">
                        Status Saat Ini
                      </span>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          room.statusPembayaran === "Lunas"
                            ? "bg-green-100 text-green-800"
                            : room.statusPembayaran === "Menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.statusPembayaran}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Description & Additional Info */}
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
                  <h2 className="text-white font-bold text-xl">
                    Deskripsi Kamar
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {room.description ||
                        "Kamar nyaman dengan berbagai fasilitas lengkap untuk kenyamanan Anda selama menghuni kost ini."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Peraturan Ringkas */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-400 to-pink-500 px-6 py-4">
                  <h2 className="text-white font-bold text-xl">
                    Peraturan Penting
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Dilarang membawa tamu menginap tanpa izin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Menjaga kebersihan kamar dan area bersama</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Dilarang membuat keributan setelah jam 22.00</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Pembayaran dilakukan tepat waktu</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate(`/room/${roomId}/peraturan`)}
                    className="mt-4 w-full bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 rounded-lg hover:from-red-500 hover:to-pink-600 font-semibold transition-all"
                  >
                    Lihat Semua Peraturan
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6" />
                  <h3 className="font-bold text-xl">Kontak Penting</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-yellow-50">Pemilik Kost</p>
                    <p className="font-semibold">📞 0812-xxxx-xxxx</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-yellow-50">Security</p>
                    <p className="font-semibold">📞 0813-xxxx-xxxx</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-yellow-50">Darurat</p>
                    <p className="font-semibold">🚨 112</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-white" />
                <h2 className="text-white font-bold text-xl">
                  Jam Operasional
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-600 text-sm mb-1">Senin - Jumat</p>
                  <p className="text-gray-800 font-bold text-lg">
                    08.00 - 17.00
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-600 text-sm mb-1">Sabtu</p>
                  <p className="text-gray-800 font-bold text-lg">
                    08.00 - 12.00
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-600 text-sm mb-1">Minggu</p>
                  <p className="text-red-600 font-bold text-lg">Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
