import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Edit, Save } from "lucide-react";
import Swal from "sweetalert2";
import BlinkBlur from "./BlinkBlur";
import Commet from "./Commet";

const EditPengumuman: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [pengumumanId, setPengumumanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch pengumuman data by ID
  useEffect(() => {
    const fetchPengumuman = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://manage-kost-production.up.railway.app/api/pengumuman/1`
        ); // Replace `1` with dynamic ID
        const data = await response.json();
        setTitle(data.judul);
        setContent(data.isi);
        setDate(data.tanggalBerlaku);
        setPengumumanId(data.id);
      } catch (error) {
        console.error("Error fetching pengumuman:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, []);

  // Save pengumuman
  const handleSave = async () => {
    try {
      const method = pengumumanId ? "PUT" : "POST";
      const url = pengumumanId
        ? `https://manage-kost-production.up.railway.app/api/pengumuman/${pengumumanId}`
        : `https://manage-kost-production.up.railway.app/api/pengumuman`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul: title,
          isi: content,
          tanggalBerlaku: date,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Pengumuman berhasil disimpan!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menyimpan pengumuman.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan pengumuman.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Commet color="#32cd32" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Pengumuman</h1>
        <p className="text-gray-500 mt-2">
          Buat dan sesuaikan pengumuman untuk penghuni kos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
              <h2 className="text-white font-bold">Detail Pengumuman</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-gray-700 font-medium block">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Masukkan judul pengumuman..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium block">
                  Isi Pengumuman
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border rounded-lg p-3 w-full h-36 resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Masukkan detail pengumuman..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium block">
                  Tanggal Berlaku
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <Save size={18} className="mr-2" />
              Simpan Pengumuman
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 sticky top-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
              <h2 className="text-white font-bold">Pratinjau</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 shadow-inner min-h-[300px]">
                {title || content || date ? (
                  <>
                    <h3 className="font-bold text-lg text-gray-800">
                      {title || "Judul Pengumuman"}
                    </h3>
                    <div className="flex items-center text-gray-500 mt-2 text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>
                        Berlaku: {formatDate(date || new Date().toISOString())}
                      </span>
                    </div>
                    <div className="mt-4 text-gray-600 whitespace-pre-wrap">
                      {content || "Isi pengumuman akan muncul di sini..."}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p className="text-center">
                      Isi formulir untuk melihat pratinjau pengumuman
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPengumuman;
