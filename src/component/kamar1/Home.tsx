import React, { useEffect, useState } from "react";
import InfoKamar from "./InfoKamar"; // Konten default
import Pembayaran from "./pembayaran";
import JadwalKebersihan from "./JadwalKebersihan";
import FAQ from "./FAQ";
import { Calendar, CreditCard, HelpCircle, Key } from "lucide-react";
import backbutton from "../image/chevron-right.svg";
import Notification from "../notification";
import { useNavigate } from "react-router-dom";

const Home1 = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>("notification");

  useEffect(() => {
    const storedRoomId = localStorage.getItem("roomId");

    // Jika belum memilih kamar, arahkan ke halaman pemilihan
    if (!storedRoomId || storedRoomId === "Belum memilih kamar") {
      navigate("/choose-room");
    } else {
      setRoomId(storedRoomId);

      // ✅ Redirect user ke halaman kamar yang sesuai
      if (storedRoomId !== "1") {
        navigate(`/home${storedRoomId}`); // Misal user di Home1 tapi roomId = 2, redirect ke Home2
      }
    }
  }, [navigate]);

  // Fungsi untuk memilih konten yang akan dirender
  const renderContent = () => {
    switch (activeContent) {
      case "notification":
        return <Notification />;
      case "infoKamar":
        return <InfoKamar />; // Memuat komponen InfoKamar
      case "pembayaran":
        return <Pembayaran />; // Memuat komponen Pembayaran
      case "jadwalKebersihan":
        return <JadwalKebersihan />; // Memuat komponen JadwalKebersihan
      case "faq":
        return <FAQ />; // Memuat komponen FAQ
      default:
        return <InfoKamar />; // Default jika tidak ada yang dipilih
    }
  };

  const MenuButton = ({ icon, text }: { icon: React.JSX.Element; text: string }) => {
    return (
      <button className="flex flex-col items-center justify-center bg-[#FEBF00] border border-gray-300 rounded-lg p-4 shadow-md transition-transform hover:scale-105 hover:shadow-lg w-full max-w-[150px] h-[150px] font-bold">
        {/* Ikon dengan warna kuning dan ukuran seragam */}
        <div className="text-[#FEBF00] w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        {/* Teks dengan font bold dan warna putih */}
        <span className="mt-2 text-white font-bold text-sm text-center">
          {text}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF8E7] min-h-screen pt-16 ">
      {/* Header */}
      <div className="w-full text-center bg-[#FEBF00] p-6 shadow-lg rounded-b-[30px]  ">
        {/* back button to notification */}
        <button onClick={() => setActiveContent("notification")}>
          <img
            src={backbutton}
            alt="notification"
            className="w-8 h-8 absolute left-[35px]"
          />
        </button>
        {/* main content header */}
        <div className="mx-auto mt-4 w-24 h-24 bg-gray-400 rounded-full"></div>
        <h1 className="mt-4 text-white font-bold text-2xl">Selamat datang!</h1>
        <h2 className="mt-1 text-white font-bold text-base">Kamar 1</h2>
      </div>

      {/* Tombol Menu */}
      <div className="text-center px-6 mt-6 grid grid-cols-2 gap-4 place-items-center">
        <button
          onClick={() => setActiveContent("infoKamar")}
          className="bg-[#FEBF00] border border-gray-300 text-white rounded-lg p-4 shadow-md w-full max-w-[150px] h-[150px] font-bold"
        >
          Info Kamar
        </button>
        <button
          onClick={() => setActiveContent("pembayaran")}
          className="bg-[#FEBF00] border border-gray-300 text-white rounded-lg p-4 shadow-md w-full max-w-[150px] h-[150px] font-bold"
        >
          Pembayaran
        </button>
        <button
          onClick={() => setActiveContent("jadwalKebersihan")}
          className="bg-[#FEBF00] border border-gray-300 rounded-lg text-white p-4 shadow-md w-full max-w-[150px] h-[150px] font-bold"
        >
          Jadwal Kebersihan
        </button>
        <button
          onClick={() => setActiveContent("faq")}
          className="bg-[#FEBF00] border border-gray-300 rounded-lg text-white p-4 shadow-md w-full max-w-[150px] h-[150px] font-bold"
        >
          FAQ
        </button>
      </div>

      {/* Area Konten Dinamis */}
      <div className="w-full mt-6 p-4  rounded-lg max-w-2xl min-h-[300px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home1;