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
  Bell,
} from "lucide-react";
import backbutton from "../image/chevron-right.svg";
import Notification from "../PeraturanKost";
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

      // Redirect user ke halaman kamar yang sesuai
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
    isActive,
    onClick,
  }: {
    icon: React.JSX.Element;
    text: string;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center ${
          isActive
            ? "bg-gradient-to-r from-[#FF7A00] to-[#FF9500] text-white"
            : "bg-gradient-to-r from-[#FFCC00] to-[#FEBF00] text-gray-800"
        } rounded-xl p-4 shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover:translate-y-[-2px] w-full max-w-[150px] h-[150px] font-bold`}
      >
        <div className={`w-10 h-10 flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <span className="text-sm text-center">{text}</span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF8E7] min-h-screen pt-16 animate-fadeIn">
      {/* Header */}
      <div className="w-full text-center bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-8 shadow-lg rounded-b-[30px] relative">
        {/* back button to notification */}
        <button
          onClick={() => setActiveContent("notification")}
          className="absolute left-6 top-6 bg-white/20 p-2 rounded-full transition-all duration-200 hover:bg-white/30"
        >
          <img src={backbutton} alt="notification" className="w-6 h-6" />
        </button>

        {/* main content header */}
        <div className="relative flex flex-col items-center mt-2">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={triggerInputClick}
            className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-md transform translate-x-4 translate-y-4 hover:bg-gray-100 transition-all duration-200"
          >
            <Camera size={18} className="text-[#FF7A00]" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <h1 className="mt-6 text-white font-bold text-3xl">Selamat datang!</h1>
        <h2 className="mt-2 text-white font-bold text-xl">Kamar 1</h2>
      </div>

      {/* Tombol Menu */}
      <div className="text-center px-6 mt-10 max-w-4xl w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <MenuButton
            icon={<Key size={28} />}
            text="Info Kamar"
            isActive={activeContent === "infoKamar"}
            onClick={() => setActiveContent("infoKamar")}
          />
          <MenuButton
            icon={<CreditCard size={28} />}
            text="Pembayaran"
            isActive={activeContent === "pembayaran"}
            onClick={() => setActiveContent("pembayaran")}
          />
          <MenuButton
            icon={<Calendar size={28} />}
            text="Jadwal Kebersihan"
            isActive={activeContent === "jadwalKebersihan"}
            onClick={() => setActiveContent("jadwalKebersihan")}
          />
          <MenuButton
            icon={<HelpCircle size={28} />}
            text="FAQ"
            isActive={activeContent === "faq"}
            onClick={() => setActiveContent("faq")}
          />
        </div>
        <button
          onClick={() => setActiveContent("notification")}
          className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] font-bold w-full mt-8 flex items-center justify-center"
        >
          <Bell className="mr-2" size={20} />
          Notification
        </button>
      </div>

      {/* Area Konten Dinamis */}
      <div className="w-full mt-10 p-6 bg-white rounded-xl shadow-md max-w-4xl min-h-[400px] mb-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home1;
