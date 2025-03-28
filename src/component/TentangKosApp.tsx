import React, { useState } from "react";
import { Star } from "lucide-react";

interface TentangKosAppProps {
  onClose: () => void;
}

const TentangKosApp: React.FC<TentangKosAppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("Tentang");

  const renderContent = () => {
    switch (activeTab) {
      case "Tentang":
        return (
          <div className="text-gray-700">
            <h2 className="text-lg font-bold mb-2">Apa itu Kos-App?</h2>
            <p className="mb-4">
              Kos-App adalah platform manajemen kos yang komprehensif, dirancang
              khusus untuk membantu pemilik dan pengelola kos di Indonesia.
              Aplikasi ini menyediakan solusi lengkap untuk mengelola properti
              kos, mulai dari manajemen kamar, penghuni, pembayaran, hingga
              pelaporan keuangan.
            </p>
            <h2 className="text-lg font-bold mb-2">Fitur Utama</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>Manajemen kamar dan penghuni yang komprehensif</li>
              <li>Sistem pembayaran dan keuangan terintegrasi</li>
              <li>Komunikasi langsung dengan penghuni</li>
              <li>Laporan dan analitik real-time</li>
              <li>Manajemen fasilitas dan pemeliharaan</li>
            </ul>
            <h2 className="text-lg font-bold mb-2">Mengapa Memilih Kos-App?</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>Dirancang khusus untuk pasar Indonesia</li>
              <li>Antarmuka yang mudah digunakan</li>
              <li>Dukungan pelanggan 24/7</li>
              <li>Pembaruan fitur secara berkala</li>
              <li>Keamanan data yang terjamin</li>
            </ul>
            <h2 className="text-lg font-bold mb-2">Cara Kerja Kos-App</h2>
            <ol className="list-decimal pl-5">
              <li className="mb-2">
                <strong>Daftar & Setup:</strong> Daftar akun dan masukkan data
                properti kos Anda.
              </li>
              <li className="mb-2">
                <strong>Kelola Kamar:</strong> Tambahkan kamar, atur harga, dan
                kelola penghuni.
              </li>
              <li>
                <strong>Monitor & Analisis:</strong> Pantau pendapatan dan
                kelola bisnis kos dengan efisien.
              </li>
            </ol>
          </div>
        );
      case "Manfaat":
        return (
          <div className="text-gray-700">
            <h2 className="text-lg font-bold mb-2">
              Manfaat Menggunakan Kos-App
            </h2>
            <p className="mb-4">
              Kos-App memberikan berbagai manfaat yang akan membantu Anda
              mengelola bisnis kos dengan lebih efisien dan menguntungkan.
            </p>
            <h3 className="text-md font-bold mb-2">Hemat Waktu</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Otomatisasi tugas administratif rutin</li>
              <li>Pengingat pembayaran otomatis</li>
              <li>Laporan yang dihasilkan secara instan</li>
            </ul>
            <h3 className="text-md font-bold mb-2">Tingkatkan Okupansi</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Sistem booking yang efisien</li>
              <li>Manajemen daftar tunggu</li>
              <li>Promosi kamar kosong</li>
            </ul>
            <h3 className="text-md font-bold mb-2">
              Tingkatkan Kepuasan Penghuni
            </h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Komunikasi yang lebih baik</li>
              <li>Penanganan keluhan yang cepat</li>
              <li>Pembayaran yang mudah</li>
            </ul>
            <h3 className="text-md font-bold mb-2">Profesionalitas</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Pengelolaan yang lebih profesional</li>
              <li>Dokumentasi yang terorganisir</li>
              <li>Citra bisnis yang lebih baik</li>
            </ul>
            <h3 className="text-md font-bold mb-2">
              Hasil yang Dapat Diharapkan
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <strong>30%</strong> Pengurangan waktu administrasi
              </li>
              <li>
                <strong>25%</strong> Peningkatan tingkat hunian
              </li>
              <li>
                <strong>40%</strong> Peningkatan kepuasan penghuni
              </li>
            </ul>
          </div>
        );
      case "Testimoni":
        return (
          <div className="text-gray-700">
            <h2 className="text-lg font-bold mb-4">Apa Kata Pengguna Kami</h2>
            <p className="mb-6">
              Dengarkan pengalaman dari pemilik dan pengelola kos yang telah
              menggunakan Kos-App.
            </p>
            <div className="mb-6">
              <blockquote className="italic text-gray-600">
                "Kos-App benar-benar mengubah cara saya mengelola kos. Dulu saya
                harus mencatat semuanya secara manual, sekarang semuanya
                terotomatisasi. Pembayaran sewa jadi lebih tepat waktu dan
                komunikasi dengan penghuni jadi lebih mudah. Sangat
                direkomendasikan!"
              </blockquote>
              <p className="mt-2 font-bold">BP</p>
              <p className="text-sm text-gray-500">
                Bapak Purnomo, Pemilik Kos Bahagia, Jakarta
              </p>
            </div>
            <div className="mb-6">
              <blockquote className="italic text-gray-600">
                "Sebagai pengelola 3 kos dengan total 45 kamar, Kos-App sangat
                membantu saya mengorganisir semuanya. Fitur laporan keuangan
                sangat detail dan memudahkan saya melacak pendapatan. Tingkat
                hunian kos saya juga meningkat berkat sistem booking yang
                efisien."
              </blockquote>
              <p className="mt-2 font-bold">IA</p>
              <p className="text-sm text-gray-500">
                Ibu Anita, Pengelola Kos Cemara, Bandung
              </p>
            </div>
            <div className="mb-6">
              <blockquote className="italic text-gray-600">
                "Saya baru memulai bisnis kos tahun lalu dan Kos-App sangat
                membantu saya yang masih pemula. Fitur-fiturnya lengkap tapi
                tidak membingungkan. Dukungan pelanggan mereka juga sangat
                responsif ketika saya membutuhkan bantuan. Investasi yang sangat
                berharga untuk bisnis kos saya."
              </blockquote>
              <p className="mt-2 font-bold">BR</p>
              <p className="text-sm text-gray-500">
                Bapak Rudi, Pemilik Kos Baru Jaya, Surabaya
              </p>
            </div>
            <div className="text-center mt-8">
              <h3 className="text-lg font-bold mb-2">Kepuasan Pengguna</h3>
              <div className="flex justify-center items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={`${
                      index < 4 ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">4.8/5.0</p>
              <p className="text-sm text-gray-500">
                Berdasarkan 500+ ulasan pengguna
              </p>
            </div>
          </div>
        );
      case "Harga":
        return (
          <div className="text-gray-700">
            <p>Paket Basic: Rp 100.000/bulan</p>
            <p>Paket Premium: Rp 200.000/bulan</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg h-5/6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Kos-App</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black font-bold"
          >
            ✕
          </button>
        </div>
        <div className="flex border-b mb-4">
          {["Tentang", "Manfaat", "Testimoni", "Harga"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-black font-bold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div>{renderContent()}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg font-bold"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default TentangKosApp;
