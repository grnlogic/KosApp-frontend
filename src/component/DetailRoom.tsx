import React, { useState } from "react";
import { card } from "./App/Api/card"; // Import the correct card type

interface DetailRoomProps {
  card: card; // Use the imported card type
  onClose: () => void;
}

const DetailRoom: React.FC<DetailRoomProps> = ({ card, onClose }) => {
  const [activeTab, setActiveTab] = useState("Detail Kamar");

  const isRoomAvailable = card.status === "available";

  const renderRoomDetails = () => {
    switch (card.id) {
      case "1":
        return (
          <>
            <p>Ukuran Kamar: 18 m²</p>
            <p>Lantai: Lantai 2</p>
            <p>Tipe Kasur: Kasur Single (120x200cm)</p>
            <p>Kapasitas Maksimal: 1 orang</p>
            <h3 className="text-lg font-bold mt-4">Fasilitas</h3>
            <ul className="list-disc list-inside">
              <li>AC</li>
              <li>Kamar Mandi Dalam</li>
              <li>Meja Belajar</li>
              <li>Lemari Pakaian</li>
              <li>WiFi Kecepatan Tinggi</li>
              <li>TV LED</li>
              <li>Kulkas Mini</li>
              <li>Layanan Pembersihan Harian</li>
            </ul>
            <h3 className="text-lg font-bold mt-4">Harga Sewa Bulanan</h3>
            <p>Rp 1.500.000</p>
          </>
        );
      case "2":
        return (
          <>
            <p>Ukuran Kamar: 24 m²</p>
            <p>Lantai: Lantai 3</p>
            <p>Tipe Kasur: Kasur Queen (160x200cm)</p>
            <p>Kapasitas Maksimal: 2 orang</p>
            <h3 className="text-lg font-bold mt-4">Fasilitas</h3>
            <ul className="list-disc list-inside">
              <li>AC</li>
              <li>Kamar Mandi Dalam dengan Shower</li>
              <li>Meja Kerja</li>
              <li>Lemari Besar</li>
              <li>WiFi Kecepatan Tinggi</li>
              <li>Smart TV</li>
              <li>Kulkas Mini</li>
              <li>Mesin Kopi</li>
              <li>Layanan Pembersihan Harian</li>
              <li>Balkon dengan Pemandangan Kota</li>
            </ul>
            <h3 className="text-lg font-bold mt-4">Harga Sewa Bulanan</h3>
            <p>Rp 2.200.000</p>
          </>
        );
      case "3":
        return (
          <>
            <p>Ukuran Kamar: 30 m²</p>
            <p>Lantai: Lantai 4</p>
            <p>Tipe Kasur: Kasur King (180x200cm)</p>
            <p>Kapasitas Maksimal: 3 orang</p>
            <h3 className="text-lg font-bold mt-4">Fasilitas</h3>
            <ul className="list-disc list-inside">
              <li>AC</li>
              <li>Kamar Mandi Dalam dengan Bathtub</li>
              <li>Meja Kerja dan Sofa</li>
              <li>Lemari Besar</li>
              <li>WiFi Kecepatan Tinggi</li>
              <li>Smart TV</li>
              <li>Kulkas Besar</li>
              <li>Mesin Kopi</li>
              <li>Layanan Pembersihan Harian</li>
              <li>Balkon dengan Pemandangan Laut</li>
            </ul>
            <h3 className="text-lg font-bold mt-4">Harga Sewa Bulanan</h3>
            <p>Rp 3.500.000</p>
          </>
        );
      default:
        return <p>Detail kamar tidak tersedia.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-[600px] max-h-[80vh] overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">{card.title}</h1>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="flex justify-around border-b mb-4">
          {["Detail Kamar", "Pemesanan", "Chat Ibu Kost"].map((tab) => (
            <button
              key={tab}
              onClick={() => isRoomAvailable && setActiveTab(tab)}
              className={`px-4 py-2 font-bold ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              } ${
                tab === "Pemesanan" && !isRoomAvailable
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={tab === "Pemesanan" && !isRoomAvailable}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-gray-700">
          {activeTab === "Detail Kamar" && (
            <div>
              <h2 className="text-lg font-bold mb-2">Detail Kamar</h2>
              {renderRoomDetails()}
              {isRoomAvailable && (
                <button
                  onClick={() => alert("Pesanan Anda telah diterima!")}
                  className="mt-4 px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Pesan Sekarang
                </button>
              )}
            </div>
          )}
          {activeTab === "Pemesanan" && isRoomAvailable && (
            <div>
              <h2 className="text-lg font-bold mb-4">Detail Pemesanan</h2>
              <p className="mb-4">
                Lengkapi informasi berikut untuk memesan kamar ini
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Durasi Sewa</label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option>1 Bulan</option>
                    <option>3 Bulan</option>
                    <option>6 Bulan</option>
                    <option>12 Bulan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    KTP/Kartu Identitas
                  </label>
                  <input
                    type="file"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    Catatan Tambahan
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan khusus jika ada"
                    className="w-full border rounded-lg px-3 py-2"
                  ></textarea>
                </div>
              </form>
              <h3 className="text-lg font-bold mt-6">Rincian Pembayaran</h3>
              <ul className="list-none space-y-2 mt-2">
                <li>
                  <span>Harga Sewa (Kamar Single Deluxe):</span>{" "}
                  <span className="font-bold">Rp 1.500.000</span>
                </li>
                <li>
                  <span>Deposit (1x Sewa):</span>{" "}
                  <span className="font-bold">Rp 1.500.000</span>
                </li>
                <li>
                  <span>Biaya Administrasi:</span>{" "}
                  <span className="font-bold">Rp 100.000</span>
                </li>
                <li className="font-bold border-t pt-2">
                  Total Pembayaran Awal: Rp 3.100.000
                </li>
              </ul>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab("Detail Kamar")}
                  className="px-4 py-2 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700"
                >
                  Kembali ke Detail
                </button>
                <button
                  onClick={() => alert("Lanjutkan ke pembayaran!")}
                  className="px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Lanjutkan Pembayaran
                </button>
              </div>
            </div>
          )}
          {activeTab === "Chat Ibu Kost" && (
            <div>
              <p>
                Hubungi pemilik kos untuk informasi lebih lanjut mengenai kamar
                ini.
              </p>
              <p className="mt-2">Nama Pemilik: Ibu Kost</p>
              <p>Telepon: 0812-9876-5432</p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default DetailRoom;
