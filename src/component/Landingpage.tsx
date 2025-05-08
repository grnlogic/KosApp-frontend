import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinHouse,
  Phone,
  Mail,
  UserCircle,
  House,
  CreditCard,
  MessageCircleMore,
  CalendarCheck,
  Key,
  Shield,
  ArrowRight,
  X,
  Clock,
  Info,
  Check,
  Star,
  Award,
  ChevronRight,
  Building,
  Home,
  Bed,
} from "lucide-react";
import { owner } from "./App/Api/owner";
import { fitur as fiturData } from "./App/Api/fitur";
import TentangKosApp from "./TentangKosApp";
import DetailRoom from "./DetailRoom";
import Particles from "react-tsparticles";
import axios from "axios"; // Import axios for API calls

// Import the room image that will be used for all cards
import roomImage from "../component/image2/20250415_113110.jpg";
// Import location background image from the same folder
import locationImage from "../component/image2/20250415_113202.jpg";

interface Card {
  id: string; // Change id type to string
  nomorKamar: string;
  status: string;
  hargaBulanan: number;
  fasilitas: string;
  image?: string; // Optional field for image
  title: string; // Add title
  description: string; // Add description
  price: number; // Add price
}

//card list
const CardList = () => {
  const [cards, setCards] = useState<Card[]>([]); // Define the type for cards
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // Define the type for selectedCard

  useEffect(() => {
    // Fetch room data from the backend
    axios
      .get("https://manage-kost-production.up.railway.app/api/kamar")
      .then((response) =>
        setCards(
          response.data.map((item: Card) => ({
            ...item,
            // We'll override the image in the rendering
          }))
        )
      )
      .catch((error) => console.error("Error fetching room data:", error));
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-yellow-100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={roomImage}
                alt={`Kamar ${item.nomorKamar}`}
                className={`w-full h-56 object-cover transition-all duration-300 ${
                  item.status !== "kosong" ? "blur-[4px]" : ""
                }`}
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === "kosong"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.status === "kosong" ? "Tersedia" : "Tidak Tersedia"}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Kamar {item.nomorKamar}
              </h1>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {item.fasilitas}
              </p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-bold text-yellow-600">
                  Rp {item.hargaBulanan.toLocaleString("id-ID")}
                  <span className="text-xs text-gray-500 font-normal">
                    /bulan
                  </span>
                </p>
                <button
                  onClick={() => setSelectedCard(item)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-600 hover:text-white transition duration-300"
                >
                  Detail <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedCard && (
        <DetailRoom
          card={{
            ...selectedCard,
            image: roomImage, // Use the imported image for detail view too
          }}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

//fitur
const Fitur = () => {
  const iconMap = {
    1: <House className="w-12 h-12 text-yellow-600" />,
    2: <CreditCard className="w-12 h-12 text-yellow-600" />,
    3: <MessageCircleMore className="w-12 h-12 text-yellow-600" />,
    4: <CalendarCheck className="w-12 h-12 text-yellow-600" />,
    5: <Key className="w-12 h-12 text-yellow-600" />,
    6: <Shield className="w-12 h-12 text-yellow-600" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {fiturData.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-yellow-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-4 rounded-full bg-yellow-50 mb-4">
            {iconMap[item.id as unknown as keyof typeof iconMap] || (
              <House className="w-12 h-12 text-yellow-600" />
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h1>
          <p className="text-sm text-gray-600 text-center">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

//owner
const Owner = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {owner.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <img
              src={item.image}
              alt={
                typeof item.name === "string"
                  ? item.name
                  : String(item.name || "No name available")
              }
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
              <h1 className="text-xl font-bold text-white">{item.name}</h1>
            </div>
          </div>
          <div className="p-5 space-y-2">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-yellow-600" />
              {item.email}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-yellow-600" />
              {item.phone}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <MapPinHouse size={16} className="text-yellow-600" />
              {item.address}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const words = ["Tempat nyaman", "Pilihan tepat", "Harga pas"];

const LandingPage: React.FC = () => {
  const [showTentangKosApp, setShowTentangKosApp] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(words[0]);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Create a computed state to track if any popup is open
  const isAnyPopupOpen = showTentangKosApp || showComingSoon;

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % words.length;
        setDisplayedText(words[nextIndex]);
        return nextIndex;
      });
    }, 2000); // Changed to 2 seconds for better readability

    return () => clearInterval(typingInterval);
  }, []);

  // Animation properties for floating elements
  const floatingAnimation = {
    y: ["-10px", "10px", "-10px"],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  };

  const rotatingAnimation = {
    rotate: [0, 10, 0, -10, 0],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Enhanced Particle Background */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          particles: {
            number: { value: 40, density: { enable: true, value_area: 1200 } },
            size: {
              value: 4,
              random: true,
              anim: { enable: true, speed: 2, size_min: 1, sync: false },
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
            },
            move: {
              speed: 1.2,
              direction: "none",
              random: true,
              out_mode: "out",
              bounce: false,
              attract: { enable: true, rotateX: 600, rotateY: 1200 },
            },
            color: { value: ["#FFD700", "#FFA500", "#FFCC00", "#FF8C00"] },
            line_linked: {
              enable: true,
              color: "#FFD700",
              opacity: 0.3,
              width: 1,
              shadow: { enable: true, color: "#FFD700", blur: 5 },
            },
            shape: {
              type: ["circle", "triangle", "polygon"],
              polygon: { nb_sides: 6 },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "bubble" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 200,
                size: 6,
                duration: 2,
                opacity: 0.8,
                speed: 3,
              },
              push: { particles_nb: 4 },
            },
          },
          retina_detect: true,
        }}
      />

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 bg-repeat opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Abstract Circles */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-300/5 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.15, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[10%] w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-500/10 to-amber-300/5 blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.2, 0.15],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Gradient Beams */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute -right-1/4 top-1/4 w-1/2 h-[30rem] bg-gradient-to-l from-yellow-400/10 to-transparent blur-2xl"
            animate={{
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -left-1/4 bottom-1/4 w-1/2 h-[25rem] bg-gradient-to-r from-yellow-400/10 to-transparent blur-2xl"
            animate={{
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 5,
            }}
          />
        </div>

        {/* Geometric Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-[35%] right-[15%] w-48 h-48 border border-yellow-400/20 rounded-lg rotate-12"
            animate={{
              rotate: [12, 15, 12],
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-[25%] left-[10%] w-64 h-32 border border-yellow-400/20 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
          />
        </div>

        {/* Light Rays */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-400/5 to-transparent"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-transparent via-yellow-400/5 to-transparent"
            animate={{
              backgroundPosition: ["100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
              delay: 5,
            }}
          />
        </div>

        {/* Subtle Wave Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 overflow-hidden">
          <motion.div
            className="w-[200%] h-32 absolute"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMHYyNWM0OCAzMyA4MCAxNyAxNDQgNyAxNTQuMDIgLTI0LjQ5IDMxOCA1MyA1MDAgMCA3OC0yMiAxNDIgMCAyMTggMjAgODYuNDggMjMgMTczLTEwIDI0MC0yMCAzMi0zLjQyIDgzLjY5IDE3LjY0IDEyOS45NiA3LjYyQzEyODAgMjkgMTM1MCA2NCAxNDQwIDQwVjBoLTE0NDB6IiBmaWxsPSIjRkZENzAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=')",
              backgroundSize: "1440px 100px",
              backgroundRepeat: "repeat-x",
            }}
            animate={{
              x: [0, -1440],
            }}
            transition={{
              repeat: Infinity,
              duration: 45,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* Header - Modified to completely hide when popups are open */}
      <div
        className={` top-0 w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg transition-all duration-200 ${
          isAnyPopupOpen
            ? "opacity-0 pointer-events-none transform -translate-y-full z-0"
            : "opacity-100 z-40"
        }`}
      >
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="font-extrabold text-3xl md:text-4xl text-white drop-shadow-md">
            MIMIN KOST
          </h1>
          <div className="h-8 flex items-center justify-center">
            <motion.h2
              key={displayedText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="font-medium text-xl md:text-2xl text-white"
            >
              {displayedText}
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Main content */}
      <article className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-xl mb-16">
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
          <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-yellow-300 opacity-30"></div>

          <div className="relative py-16 px-6 md:px-12 lg:px-20">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Mudahkan Pengelolaan Kos Anda
              </h2>
              <p className="text-lg md:text-xl text-white mb-8 opacity-90">
                Kos-App membantu Anda mengelola kamar, memantau hunian, dan
                menangani pembayaran dalam satu platform. Sempurna untuk pemilik
                dan pengelola properti kos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-yellow-600 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-50 transition duration-300"
                  onClick={() => setShowComingSoon(true)}
                >
                  Daftar Sekarang
                </motion.button>
                <motion.button
                  onClick={() => setShowTentangKosApp(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-white text-white rounded-full font-bold text-lg shadow-lg hover:bg-white hover:text-yellow-600 transition duration-300"
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Available Rooms Section */}
        <section className="mb-16">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
              Kamar Tersedia
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Lihat pilihan kamar kami dan temukan yang sesuai dengan kebutuhan
              Anda.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardList />
          </motion.div>
        </section>

        {/* Location Section */}
        <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-3xl shadow-lg p-8 md:p-12 mb-16 overflow-hidden relative">
          <div className="absolute inset-0 z-0">
            <img
              src={locationImage}
              alt="Location background"
              className="w-full h-full object-cover rounded-3xl opacity-20"
            />
          </div>
          <div className="absolute -right-16 bottom-0 w-64 h-64 rounded-full bg-yellow-200 opacity-40"></div>

          <motion.div
            className="text-center mb-10 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
              Lokasi Kos
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Lokasi strategis dengan akses mudah ke berbagai fasilitas
            </p>
          </motion.div>
          <motion.div
            className="mt-8 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h5 className="font-bold text-2xl mb-3 text-gray-800">
                Kos Nyaman Sejahtera
              </h5>
              <div className="flex items-start gap-3 text-gray-700 mb-6">
                <MapPinHouse
                  size={24}
                  className="text-yellow-600 mt-1 flex-shrink-0"
                />
                <span className="text-lg">
                  Jl. Merdeka No. 123, Kelurahan Sukamaju, Kecamatan Setiabudi,
                  Jakarta Selatan, 12345
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-full font-medium shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Lihat Lokasi <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Owner Section */}
        <section className="mb-16">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
              Pemilik Kost
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Kenali pemilik kos dan cara menghubunginya.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Owner />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-3xl shadow-lg p-8 md:p-12 mb-16 overflow-hidden relative">
          <div className="absolute -left-16 top-0 w-64 h-64 rounded-full bg-yellow-200 opacity-40"></div>
          <div className="absolute -right-16 bottom-0 w-48 h-48 rounded-full bg-yellow-200 opacity-40"></div>

          <motion.div
            className="text-center mb-10 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
              Fitur Kos-App
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Temukan fitur-fitur canggih yang membuat Kos-App menjadi solusi
              sempurna untuk manajemen kos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <Fitur />
          </motion.div>
        </section>

        {/* Footer CTA Section */}
        <section className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl shadow-xl p-8 md:p-12 mb-8 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>

          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Bergabung dengan Kos-App?
            </h2>
            <p className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Mulai perjalanan Anda dengan Kos-App hari ini dan rasakan
              kemudahan dalam mengelola properti kos Anda.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-yellow-600 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-50 transition duration-300"
              onClick={() => setShowComingSoon(true)}
            >
              Daftar Sekarang
            </motion.button>
          </motion.div>
        </section>

        <AnimatePresence>
          {showTentangKosApp && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTentangKosApp(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative overflow-auto my-4 max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative elements */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30"></div>

                {/* Top header section */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 relative z-10">
                  <button
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5 text-white"
                    onClick={() => setShowTentangKosApp(false)}
                  >
                    <X size={24} />
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white rounded-full p-3">
                      <Info className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Tentang Kos-App
                    </h2>
                  </div>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Aplikasi manajemen kos modern untuk memudahkan pemilik dan
                    pengelola kos.
                  </p>
                </div>

                {/* Main content */}
                <div className="p-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-6">
                      <motion.div
                        className="bg-yellow-50 rounded-xl p-6 border border-yellow-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
                          <Award className="w-6 h-6" /> Visi Kami
                        </h3>
                        <p className="text-gray-700">
                          Menjadi solusi terdepan dalam pengelolaan properti kos
                          yang efisien, transparan, dan menguntungkan bagi semua
                          pihak.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Star className="w-6 h-6" /> Keunggulan Kami
                        </h3>
                        <ul className="space-y-2">
                          {[
                            "Antarmuka yang intuitif",
                            "Pengelolaan pembayaran otomatis",
                            "Notifikasi real-time",
                            "Laporan keuangan komprehensif",
                          ].map((item, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <Check
                                size={18}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                      <motion.div
                        className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Cerita Kami
                        </h3>
                        <p className="text-gray-700">
                          Kos-App lahir dari pemahaman mendalam tentang
                          tantangan yang dihadapi oleh pemilik dan pengelola
                          kos. Kami menciptakan solusi yang memudahkan
                          pengelolaan properti dan meningkatkan pengalaman
                          penghuni.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-blue-50 rounded-xl p-6 border border-blue-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-xl font-bold text-blue-700 mb-3">
                          Testimoni Pengguna
                        </h3>
                        <div className="italic text-gray-700 border-l-4 border-blue-200 pl-4 py-2">
                          "Kos-App sangat membantu saya mengelola 3 properti kos
                          sekaligus. Pembayaran jadi tepat waktu dan komunikasi
                          dengan penghuni jadi lebih mudah."
                        </div>
                        <p className="text-right mt-2 text-sm font-medium">
                          — Budi Setiawan, Pemilik Kos
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Punya pertanyaan? Hubungi kami
                      </p>
                      <p className="text-yellow-600 font-medium">
                        support@kos-app.id
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center gap-2"
                      onClick={() => {
                        setShowTentangKosApp(false);
                        setShowComingSoon(true);
                      }}
                    >
                      Daftar Sekarang <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl shadow-2xl p-8 md:p-10 max-w-xl w-full relative overflow-hidden my-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>

              {/* Close button */}
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors z-10"
                onClick={() => setShowComingSoon(false)}
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                {/* Icon with pulse animation */}
                <motion.div
                  className="mx-auto bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(250, 204, 21, 0.7)",
                      "0 0 0 20px rgba(250, 204, 21, 0)",
                      "0 0 0 0 rgba(250, 204, 21, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <Clock className="w-14 h-14 text-white" />
                </motion.div>

                {/* Text content */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-yellow-600 mb-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Coming Soon!
                </motion.h2>

                <motion.p
                  className="text-lg text-gray-700 mb-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  We're working hard to bring you something amazing. The
                  registration feature will be available soon. Thank you for
                  your patience!
                </motion.p>

                {/* Stay updated button */}
                <motion.button
                  className="mx-auto block px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Get Notified When We Launch
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
