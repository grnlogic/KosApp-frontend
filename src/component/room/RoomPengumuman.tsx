import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { Bell, Calendar, Clock } from "lucide-react";
import Commet from "../admin/Commet";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tanggalBerlaku: string;
}

const RoomPengumuman: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchPengumuman = async () => {
      setLoading(true);
      try {
        // For now, fetch single pengumuman, you can modify to fetch all
        const response = await fetch(
          "http://141.11.25.167:8080/api/pengumuman/1"
        );
        if (response.ok) {
          const data = await response.json();
          setPengumumanList([data]);
        }
      } catch (error) {
        console.error("Error fetching pengumuman:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat pengumuman..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="flex items-center text-white hover:text-yellow-100 mb-4 transition-colors"
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
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Bell className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Pengumuman</h1>
              <p className="text-yellow-50 text-lg">
                Informasi penting dari pengelola kost
              </p>
            </div>
          </div>
        </div>

        {/* Pengumuman List */}
        <div className="space-y-6">
          {pengumumanList.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ada pengumuman saat ini
              </p>
            </div>
          ) : (
            pengumumanList.map((pengumuman) => (
              <div
                key={pengumuman.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 border-yellow-400 hover:shadow-2xl transition-shadow"
              >
                {/* Pengumuman Header */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 p-2 rounded-lg">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {pengumuman.judul}
                        </h2>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(pengumuman.tanggalBerlaku)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {getRelativeTime(pengumuman.tanggalBerlaku)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        📢 Penting
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pengumuman Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                      {pengumuman.isi}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        ✓ Sudah dibaca
                      </div>
                    </div>
                    <button className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-2">
                      <span>Tandai penting</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-3">📌 Catatan Penting</h3>
          <ul className="space-y-2 text-yellow-50">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                Selalu periksa pengumuman secara berkala untuk informasi terbaru
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>
                Pastikan Anda memahami setiap pengumuman yang dikeluarkan
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Hubungi pengelola jika ada yang kurang jelas</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm">
              Kontak: 📞 0812-xxxx-xxxx | 📧 info@kosapp.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPengumuman;
