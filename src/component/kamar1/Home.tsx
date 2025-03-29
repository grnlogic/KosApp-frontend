import React, { useEffect, useState, useRef } from "react";
import InfoKamar from "./InfoKamar"; // Konten default
import Pembayaran from "./pembayaran";
import JadwalKebersihan from "./JadwalKebersihan";
import FAQ from "./FAQ";
import {
  Calendar,
  Camera,
  CreditCard,
  HelpCircle,
  Key,
  User,
} from "lucide-react";
import backbutton from "../image/chevron-right.svg";
import Notification from "../notification";
import { useNavigate } from "react-router-dom";

const Home1 = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>("notification");
  const [editProfile, setEditProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  //handle picture
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //trigger input click
  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const storedRoomId = localStorage.getItem("roomId");

    // Jika belum memilih kamar, arahkan ke halaman pemilihan
    if (!storedRoomId || storedRoomId === "Belum memilih kamar") {
      navigate("/choose-room");
    } else {
      setRoomId(storedRoomId);

      // ✅ Redirect user ke halaman kamar yang sesuai
      if (storedRoomId !== "1" && storedRoomId !== "Belum memilih kamar") {
        navigate(`/Home${storedRoomId}`); // Misal user di Home1 tapi roomId = 2, redirect ke Home2
      }
    }
  }, [navigate]);

  if (!roomId) {
    return <p className="text-center mt-6">Loading...</p>; // ✅ Tambahkan loading state
  }

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

  const MenuButton = ({
    icon,
    text,
  }: {
    icon: React.JSX.Element;
    text: string;
  }) => {
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
        <div className="relative flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          {/* Move Camera Icon Closer */}
          <button
            onClick={triggerInputClick}
            className="absolute bottom-2 left-[180px] bg-white p-2 rounded-full shadow-md"
          >
            <Camera size={16} className="text-[#FF7A00]" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
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
        <button
          onClick={() => setActiveContent("notification")}
          className="bg-[#FEBF00] border border-gray-300 rounded-lg text-white p-3 shadow-md w-full col-span-2 h-[100px] font-bold"
        >
          Notification
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
