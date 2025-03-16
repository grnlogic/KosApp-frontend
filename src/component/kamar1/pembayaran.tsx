import BackButtonOrange from "../image/chevron-right.svg";
import React from "react";

const Contact = () => {
  return (
    <div>
      <div className="container mx-auto bg-[#FEBF00] rounded-md p-5 mb-9">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-extrabold text-2xl">Jadwal Anda</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-md p-5 mt-4">
          <div className="flex justify-between w-full">
            <h1 className="text-1xl text-black font-medium">Total Tagihan</h1>
            <span className="text-1xl text-[black] font-medium">Rp 1.000.000</span>
          </div>
          <div className="flex justify-between w-full mt-7">
            <h1 className="text-1xl text-black font-medium">Jatuh Tempo</h1>
            <span className="text-1xl text-black font-medium">30 Oktober 2023</span>
          </div>
          <div className="flex justify-between w-full mt-7">
            <h1 className="text-1xl text-black font-medium">Status</h1>
            <span className="text-1xl text-black font-medium">Belum Dibayar</span>
          </div>
          <button
            className="bg-[#FEBF00] text-white rounded-lg py-4 mt-7 w-full text-lg font-bold"
            onClick={() => alert('Pembayaran berhasil!')}
          >
            BAYAR SEKARANG
          </button>
        </div>
      </div>

      <div className="bg-[#FEBF00] rounded-md p-5 mt-4">
        <div className="">
          <h1 className="text-2xl text-white font-extrabold mb-7 mt-3">Hubungi Kami</h1>
        </div>
        <div className="bg-white rounded-md p-5">
          <h1 className="text-1xl text-black font-bold">januari 2025</h1>
          <h1 className="text-1xl text-black font-medium mt-3">Berhasil</h1>
        </div>
        <div className="bg-white rounded-md p-5 mt-5">
          <h1 className="text-1xl text-black font-bold">Desember 2024</h1>
          <h1 className="text-1xl text-black font-medium mt-3">Berhasil</h1>
        </div>
      </div>
    </div>
  );
};

export default Contact;
