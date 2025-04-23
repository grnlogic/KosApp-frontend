import React, { useEffect, useState, useRef } from "react";
import InfoKamar from "./InfoKamar4";
import Pembayaran from "./pembayaran4";
import JadwalKebersihan from "./JadwalKebersihan4";
import FAQ from "./FAQ4";
import ProfilePage from "./profile4";
import {
  Calendar,
  CreditCard,
  HelpCircle,
  Key,
  User,
  Camera,
  Home,
  Bell,
  ChevronLeft,
} from "lucide-react";
import Notification from "../PeraturanKost";
import { useNavigate } from "react-router-dom";

const Home4 = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>("notification");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Handle picture upload
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

  // Trigger file input click
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

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF8E7] min-h-screen pt-10">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-[#FFCC00] to-[#FF9900] p-6 shadow-lg rounded-b-[30px] relative">
        {/* Back button */}
        {activeContent !== "notification" && (
          <button
            onClick={() => setActiveContent("notification")}
            className="absolute left-4 top-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
        )}

        {/* Main content header */}
        <div className="relative flex flex-col items-center mb-5">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={triggerInputClick}
            className="absolute bottom-2 right-[calc(50%-60px)] bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Camera size={18} className="text-[#FF9900]" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <h1 className="mt-3 text-white font-bold text-2xl text-center">
          Selamat datang!
        </h1>
        <h2 className="mt-1 text-white font-medium text-lg text-center">
          Kamar 4
        </h2>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white/20 text-white py-2 px-4 rounded-full flex items-center hover:bg-white/30 transition-colors"
          >
            <User size={16} className="mr-1" />
            <span>Lihat Profile</span>
          </button>
        </div>
      </div>

      {/* Tombol Menu */}
      <div className="text-center px-6 mt-8 max-w-4xl w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <MenuButton
            icon={<Key />}
            text="Info Kamar"
            isActive={activeContent === "infoKamar"}
            onClick={() => setActiveContent("infoKamar")}
          />
          <MenuButton
            icon={<CreditCard />}
            text="Pembayaran"
            isActive={activeContent === "pembayaran"}
            onClick={() => setActiveContent("pembayaran")}
          />
          <MenuButton
            icon={<Calendar />}
            text="Jadwal Kebersihan"
            isActive={activeContent === "jadwalKebersihan"}
            onClick={() => setActiveContent("jadwalKebersihan")}
          />
          <MenuButton
            icon={<HelpCircle />}
            text="FAQ"
            isActive={activeContent === "faq"}
            onClick={() => setActiveContent("faq")}
          />
        </div>
        <button
          onClick={() => setActiveContent("notification")}
          className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-bold w-full mt-6 flex items-center justify-center"
        >
          <Bell className="mr-2" size={20} />
          <span>Notifikasi & Pengumuman</span>
        </button>
      </div>

      {/* Area Konten Dinamis */}
      <div className="w-full mt-8 p-6 bg-white rounded-xl shadow-md max-w-4xl min-h-[400px] mb-10 border border-[#FFE180]">
        {renderContent()}
      </div>
    </div>
  );
};

// Update MenuButton component for better visual design
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
          ? "bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white"
          : "bg-white text-gray-700 border border-[#FFE180]"
      } rounded-xl p-5 shadow-md transition-all hover:shadow-lg ${
        isActive ? "scale-[1.05]" : "hover:scale-[1.03]"
      } w-full max-w-[150px] h-[150px] font-bold`}
    >
      <div className={`w-10 h-10 flex items-center justify-center mb-2`}>
        {React.cloneElement(
          icon as React.ReactElement,
          {
            className: isActive ? "text-white" : "text-[#FF9900]",
          } as React.HTMLAttributes<SVGElement> & { size?: number }
        )}
      </div>
      <span className="text-center">{text}</span>
    </button>
  );
};

export default Home4;
