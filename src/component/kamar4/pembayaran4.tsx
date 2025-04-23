import BackButtonOrange from "../image/chevron-right.svg";
import React from "react";
import {
  CalendarClock,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";

const Contact = () => {
  return (
    <div>
      <div className="container mx-auto bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <CreditCard className="text-white" size={24} />
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-5 shadow-md border border-[#FFE180]">
          <div className="flex justify-between w-full">
            <h1 className="text-gray-700 font-semibold">Total Tagihan</h1>
            <span className="text-[#FF9900] font-bold">Rp 1.000.000</span>
          </div>
          <div className="flex justify-between w-full mt-5">
            <div className="flex items-center">
              <CalendarClock className="text-[#FF9900] mr-2" size={18} />
              <h1 className="text-gray-700 font-semibold">Jatuh Tempo</h1>
            </div>
            <span className="text-gray-700 font-medium">30 Oktober 2023</span>
          </div>
          <div className="flex justify-between w-full mt-5">
            <h1 className="text-gray-700 font-semibold">Status</h1>
            <div className="flex items-center">
              <AlertCircle className="text-orange-500 mr-1" size={16} />
              <span className="text-orange-500 font-medium">Belum Dibayar</span>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white rounded-lg py-4 mt-7 w-full text-lg font-bold hover:opacity-90 transition-opacity shadow-md"
            onClick={() => alert("Pembayaran berhasil!")}
          >
            BAYAR SEKARANG
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-white" size={24} />
          <h1 className="text-2xl text-white font-bold">Riwayat Pembayaran</h1>
        </div>
        <div className="bg-white rounded-xl p-5 mt-5 shadow-md border border-[#FFE180]">
          <div className="flex justify-between">
            <h1 className="text-gray-700 font-bold">Januari 2025</h1>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <h1 className="text-green-500 font-medium">Berhasil</h1>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-sm">10/01/2025</span>
            <span className="text-gray-700 font-medium">Rp 1.000.000</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 mt-4 shadow-md border border-[#FFE180]">
          <div className="flex justify-between">
            <h1 className="text-gray-700 font-bold">Desember 2024</h1>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <h1 className="text-green-500 font-medium">Berhasil</h1>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-sm">05/12/2024</span>
            <span className="text-gray-700 font-medium">Rp 1.000.000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
