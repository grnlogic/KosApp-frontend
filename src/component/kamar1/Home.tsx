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
import { fetchProfileImage } from "../../utils/imageUpload"; // Import the new function

const Home1 = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>("notification");
  const [editProfile, setEditProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

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

  // Load profile picture from Supabase
  useEffect(() => {
    async function loadProfileImage() {
      setIsLoadingImage(true);
      try {
        const imageUrl = await fetchProfileImage("1"); // Hard-coded for Kamar 1
        if (imageUrl) {
          setProfilePicture(imageUrl);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      } finally {
        setIsLoadingImage(false);
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
      <div className="w-full text-center bg-gradient-to-br from-[#FFCC00] to-[#FF9500] p-6 shadow-lg rounded-b-[30px]">
        {/* back button to notification */}
        <button
          onClick={() => setActiveContent("notification")}
          className="absolute left-[35px] bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
        >
          <img src={backbutton} alt="notification" className="w-6 h-6" />
        </button>

        {/* main content header */}
        <div className="relative flex flex-col items-center mb-4">
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
          Kamar 1
        </h2>
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
          className="bg-[#FEBF00] border border-gray-300 text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-transform hover:scale-105 font-bold w-full mt-6"
        >
          Notification
        </button>
      </div>

      {/* Area Konten Dinamis */}
      <div className="w-full mt-10 p-6 bg-white rounded-lg shadow-md max-w-4xl min-h-[400px] mb-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home1;
