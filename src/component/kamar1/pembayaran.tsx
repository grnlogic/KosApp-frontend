import BackButtonOrange from "../image/chevron-right.svg";
import React, { useState } from "react";
import { CreditCard, Calendar, Clock, Check, AlertCircle } from "lucide-react";

const Contact = () => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      alert("Pembayaran berhasil!");
    }, 1500);
  };

  return (
    <div className="animate-fadeIn">
      <div className="container mx-auto bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="text-white" size={24} />
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-4 shadow-inner">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg text-gray-800 font-medium">Total Tagihan</h1>
            <span className="text-xl text-[#FF7A00] font-bold">
              Rp 1.000.000
            </span>
          </div>
          <div className="w-full h-px bg-gray-200 my-4"></div>
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center">
              <Calendar className="text-[#FF7A00] mr-2" size={18} />
              <h1 className="text-lg text-gray-800 font-medium">Jatuh Tempo</h1>
            </div>
            <span className="text-lg text-gray-800 font-medium">
              30 Oktober 2023
            </span>
          </div>
          <div className="w-full h-px bg-gray-200 my-4"></div>
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center">
              <Clock className="text-[#FF7A00] mr-2" size={18} />
              <h1 className="text-lg text-gray-800 font-medium">Status</h1>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <AlertCircle className="mr-1" size={14} />
              Belum Dibayar
            </span>
          </div>
          <button
            className={`bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-xl py-4 mt-6 w-full text-lg font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex justify-center items-center ${
              isPaymentProcessing ? "opacity-75" : ""
            }`}
            onClick={handlePayment}
            disabled={isPaymentProcessing}
          >
            {isPaymentProcessing ? (
              <>
                <div className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                MEMPROSES...
              </>
            ) : (
              "BAYAR SEKARANG"
            )}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-2xl p-6 mt-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-white" size={24} />
          <h1 className="text-2xl text-white font-bold">Riwayat Pembayaran</h1>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-inner transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-gray-800 font-bold">Januari 2025</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Check className="mr-1" size={14} />
                Berhasil
              </span>
            </div>
            <p className="text-gray-500 mt-2">Pembayaran: Rp 1.000.000</p>
            <p className="text-gray-500">Tanggal: 28 Desember 2024</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-inner transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
            <div className="flex justify-between items-center">
              <h1 className="text-lg text-gray-800 font-bold">Desember 2024</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Check className="mr-1" size={14} />
                Berhasil
              </span>
            </div>
            <p className="text-gray-500 mt-2">Pembayaran: Rp 1.000.000</p>
            <p className="text-gray-500">Tanggal: 27 November 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
