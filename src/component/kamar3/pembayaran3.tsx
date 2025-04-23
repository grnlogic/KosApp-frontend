import BackButtonOrange from "../image/chevron-right.svg";
import React from "react";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";

const Contact = () => {
  return (
    <div>
      <div className="container mx-auto bg-[#FFCC00] rounded-2xl p-6 mb-9 shadow-lg transform transition-all hover:shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
          <DollarSign className="text-white" size={24} />
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-4 shadow-inner">
          <div className="flex justify-between w-full items-center border-b border-gray-100 pb-4 mb-4">
            <h1 className="text-lg text-gray-800 font-medium">Total Tagihan</h1>
            <span className="text-xl text-[#FFCC00] font-bold">
              Rp 1.000.000
            </span>
          </div>
          <div className="flex justify-between w-full items-center mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#FFCC00]" />
              <h1 className="text-gray-700 font-medium">Jatuh Tempo</h1>
            </div>
            <span className="text-gray-800 font-semibold px-3 py-1 bg-[#FFF8E7] rounded-lg">
              30 Oktober 2023
            </span>
          </div>
          <div className="flex justify-between w-full items-center mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-[#FFCC00]" />
              <h1 className="text-gray-700 font-medium">Status</h1>
            </div>
            <span className="text-white font-semibold px-3 py-1 bg-orange-500 rounded-lg">
              Belum Dibayar
            </span>
          </div>
          <button
            className="bg-[#FFCC00] text-white rounded-xl py-4 mt-2 w-full text-lg font-bold shadow-md transform transition-transform hover:scale-[1.02] hover:bg-[#FFA500]"
            onClick={() => alert("Pembayaran berhasil!")}
          >
            BAYAR SEKARANG
          </button>
        </div>
      </div>

      <div className="bg-[#FFCC00] rounded-2xl p-6 mt-6 shadow-lg transform transition-all hover:shadow-xl">
        <div className="mb-4">
          <h1 className="text-2xl text-white font-bold mb-1">
            Riwayat Pembayaran
          </h1>
          <p className="text-white text-opacity-80 text-sm">
            Histori pembayaran sewa kamar Anda
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-inner hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-gray-800 font-semibold">
                Januari 2025
              </h1>
              <span className="text-white bg-green-500 px-3 py-1 rounded-lg text-sm font-medium">
                Berhasil
              </span>
            </div>
            <div className="flex justify-between mt-3 text-sm text-gray-500">
              <span>Tanggal Bayar: 28 Des 2024</span>
              <span>Rp 1.000.000</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-inner hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-gray-800 font-semibold">
                Desember 2024
              </h1>
              <span className="text-white bg-green-500 px-3 py-1 rounded-lg text-sm font-medium">
                Berhasil
              </span>
            </div>
            <div className="flex justify-between mt-3 text-sm text-gray-500">
              <span>Tanggal Bayar: 28 Nov 2024</span>
              <span>Rp 1.000.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
