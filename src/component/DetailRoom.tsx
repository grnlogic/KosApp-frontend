import React from "react";
import { card } from "./App/Api/card"; // Import the correct card type

interface DetailRoomProps {
  card: card; // Use the imported card type
  onClose: () => void;
}

const DetailRoom: React.FC<DetailRoomProps> = ({ card, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-[600px] max-h-[80vh] overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">{card.title}</h1>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="text-gray-700">
          <h2 className="text-lg font-bold mb-2">Detail Kamar</h2>
          <p className="mb-2">
            <strong>Nomor Kamar:</strong> {card.nomorKamar}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            {card.status === "kosong" ? "Tersedia" : "Tidak Tersedia"}
          </p>
          <p className="mb-2">
            <strong>Harga Bulanan:</strong> Rp {card.hargaBulanan}
          </p>
          <p className="mb-2">
            <strong>Deskripsi:</strong> {card.description}
          </p>
          <h3 className="text-lg font-bold mt-4">Fasilitas</h3>
          <ul className="list-disc list-inside">
            {card.fasilitas
              .split(",")
              .map((fasilitas: string, index: React.Key | null | undefined) => (
                <li key={index}>{fasilitas.trim()}</li>
              ))}
          </ul>
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
