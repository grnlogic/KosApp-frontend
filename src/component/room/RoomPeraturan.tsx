import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import Commet from "../admin/Commet";

interface Rule {
  id: number;
  title: string;
  description: string;
}

const RoomPeraturan: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://141.11.25.167:8080/api/peraturan");
        const data = await response.json();
        const formattedRules = data.map((item: any) => ({
          id: item.id,
          title: item.judul_peraturan,
          description: item.deskripsi_peraturan,
        }));
        setRules(formattedRules);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat peraturan..."
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
              <FileText className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Peraturan Kost</h1>
              <p className="text-yellow-50 text-lg">
                Harap dibaca dan dipatuhi oleh seluruh penghuni
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-800 text-lg mb-2">
                Penting untuk Diperhatikan
              </h3>
              <p className="text-red-700">
                Pelanggaran terhadap peraturan dapat mengakibatkan teguran,
                denda, atau bahkan pengakhiran kontrak sewa. Mohon untuk selalu
                mematuhi peraturan yang berlaku demi kenyamanan bersama.
              </p>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          {rules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ada peraturan yang tersedia
              </p>
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={rule.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <h2 className="text-white font-bold text-xl">
                      {rule.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sanksi Section */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            ⚠️ Sanksi Pelanggaran
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Pelanggaran Ringan</h4>
              <ul className="text-yellow-50 text-sm space-y-1">
                <li>• Teguran lisan</li>
                <li>• Surat peringatan pertama</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Pelanggaran Sedang</h4>
              <ul className="text-yellow-50 text-sm space-y-1">
                <li>• Surat peringatan kedua</li>
                <li>• Denda sesuai ketentuan</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Pelanggaran Berat</h4>
              <ul className="text-yellow-50 text-sm space-y-1">
                <li>• Denda berat</li>
                <li>• Pengakhiran kontrak</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            Pertanyaan Seputar Peraturan?
          </h3>
          <p className="text-gray-600 mb-4">
            Jika ada yang kurang jelas mengenai peraturan, silakan hubungi:
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-2">
              📞 Pengelola: 0812-xxxx-xxxx
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg px-4 py-2">
              📧 Email: info@kosapp.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPeraturan;
