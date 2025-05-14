import React, { useEffect, useState, useRef } from "react";
import InfoKamar from "./InfoKamar3";
import Pembayaran from "./pembayaran3";
import JadwalKebersihan from "./JadwalKebersihan3";
import FAQ from "./FAQ3";
import {
  Calendar,
  CreditCard,
  HelpCircle,
  Key,
  User,
  Camera,
  Home as HomeIcon,
  Bell,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import backbutton from "../image/chevron-right.svg";
import Notification from "../PeraturanKost";
import { useNavigate } from "react-router-dom";
import { fetchProfileImage } from "../../utils/imageUpload"; // Import the new function

const Home3 = () => {
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

  // Load profile picture from Supabase instead of localStorage
  useEffect(() => {
    async function loadProfileImage() {
      try {
        const imageUrl = await fetchProfileImage("3"); // For Kamar 3
        if (imageUrl) {
          setProfilePicture(imageUrl);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    }

    loadProfileImage();
  }, []);

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
            ? "bg-gradient-to-br from-[#FF7A00] to-[#FF9500] text-white shadow-lg"
            : "bg-gradient-to-br from-[#FFCC00] to-[#FFDD33] text-gray-800 hover:from-[#FFDD33] hover:to-[#FFCC00]"
        } rounded-xl p-4 shadow-md transition-all hover:shadow-lg w-full max-w-[150px] h-[150px] font-bold transform hover:scale-105 duration-200`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center mb-2 ${
            isActive ? "bg-white/20" : "bg-white/40"
          } rounded-full p-2`}
        >
          {icon}
        </div>
        <span className="mt-1 text-sm text-center">{text}</span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF8E7] min-h-screen pt-16">
      {/* Header */}
      <div className="w-full text-center bg-gradient-to-br from-[#FFCC00] to-[#FF9500] p-6 shadow-lg rounded-b-[30px] relative">
        {/* Navigation bar */}
        <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6">
          <button
            onClick={() => navigate("/")}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <Bell size={22} />
            </button>
            <button
              onClick={() => navigate("/profile3")}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <User size={22} />
            </button>
            <button className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>

        {/* Profile section */}
        <div className="relative flex flex-col items-center mb-4 mt-8">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  e.currentTarget.onerror = null; // Prevent infinite error loop
                  e.currentTarget.src = "/placeholder.svg"; // Fall back to placeholder
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User size={50} className="text-gray-300" />
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <h1 className="mt-4 text-white font-bold text-2xl">Selamat datang!</h1>
        <h2 className="mt-1 text-white font-medium text-base bg-white/20 inline-block px-4 py-1 rounded-full">
          Kamar 3
        </h2>
      </div>

      {/* Menu Buttons */}
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
          className="bg-[#FEBF00] border border-gray-300 text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-transform hover:scale-105 font-bold w-full mt-6"
        >
          Peraturan & Pengumuman
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full mt-10 p-6 bg-white rounded-lg shadow-md max-w-4xl min-h-[400px] mb-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
            {activeContent === "infoKamar" && "Info Kamar"}
            {activeContent === "pembayaran" && "Pembayaran Sewa"}
            {activeContent === "jadwalKebersihan" && "Jadwal Kebersihan"}
            {activeContent === "faq" && "FAQ & Bantuan"}
            {activeContent === "notification" && "Peraturan & Pengumuman"}
          </h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Home3;
