import React, { useState } from "react";
import BackButtonOrange from "./image/chevron-right.svg";

const Announcement = () => {
  const [isContentVisible, setContentVisible] = useState(false);

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
  };

  return (
    <div className="bg-[#FFA500] rounded-md p-5 mb-4">
      <h4 className="text-white font-bold text-2xl mb-4">PENGUMUMAN</h4>
      <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">Notifikasi</h1>
          <img
            src={BackButtonOrange}
            alt="BackButton"
            className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
              isContentVisible ? "rotate-90" : ""
            }`}
            onClick={toggleContent}
          />
        </div>
      </div>
    </div>
  );
};

const Rules = () => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  const toggleContent = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  const rules = [
    {
      title: "Jam Malam",
      content:
        "Jam malam dimulai pukul 22:00 WIB. Penghuni diharapkan berada di dalam kos pada jam tersebut.",
    },
    {
      title: "Tamu",
      content:
        "Tamu hanya diperbolehkan berkunjung hingga pukul 21:00 WIB dan harus melapor kepada pengelola.",
    },
    {
      title: "Kebersihan",
      content:
        "Setiap penghuni wajib menjaga kebersihan kamar dan area bersama.",
    },
    {
      title: "Keamanan",
      content:
        "Penghuni wajib mengunci pintu saat keluar dan tidak boleh memberikan akses kepada orang asing.",
    },
    {
      title: "Pembayaran",
      content: "Biaya sewa harus dibayarkan sebelum tanggal 5 setiap bulan.",
    },
    {
      title: "Hewan Peliharaan",
      content: "Tidak diperbolehkan membawa hewan peliharaan ke dalam kos.",
    },
    {
      title: "Barang Berbahaya",
      content:
        "Dilarang menyimpan barang-barang yang mudah terbakar atau berbahaya di dalam kos.",
    },
  ];

  return (
    <div className="bg-[#008080] rounded-md p-5">
      <h4 className="text-white font-bold text-2xl mb-4">PERATURAN KOS</h4>
      <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
        {rules.map((rule, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between">
              <h1 className="font-bold">{rule.title}</h1>
              <img
                src={BackButtonOrange}
                alt="BackButton"
                className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
                  visibleIndex === index ? "rotate-90" : ""
                }`}
                onClick={() => toggleContent(index)}
              />
            </div>
            {visibleIndex === index && (
              <div className="mt-4">
                <p>{rule.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div>
      <Announcement />
      <Rules />
    </div>
  );
};

export default Contact;
