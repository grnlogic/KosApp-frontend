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

// Add fallback data in case the API fails - this ensures content always appears
const fallbackRooms = [
  {
    id: "fallback-1",
    nomorKamar: "101",
    status: "kosong",
    hargaBulanan: 850000,
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Lemari, Meja, Kursi",
    title: "Kamar 101",
    description: "Kamar nyaman dengan fasilitas lengkap",
    price: 850000,
  },
  {
    id: "fallback-2",
    nomorKamar: "102",
    status: "kosong",
    hargaBulanan: 950000,
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Lemari, Meja, Kursi, TV",
    title: "Kamar 102",
    description: "Kamar premium dengan TV",
    price: 950000,
  },
  {
    id: "fallback-3",
    nomorKamar: "103",
    status: "terisi",
    hargaBulanan: 800000,
    fasilitas: "WiFi, Kamar Mandi Dalam, Lemari, Meja",
    title: "Kamar 103",
    description: "Kamar standar yang nyaman",
    price: 800000,
  },
];

//card list
const CardList = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<number>(6);
  const [apiTimeoutReached, setApiTimeoutReached] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Improved mobile detection with additional handler for network conditions
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);

      // Set a shorter timeout for mobile devices
      return isMobileDevice;
    };

    const isMobileDevice = checkMobile();
    window.addEventListener("resize", checkMobile);

    // More robust API fetching with better error handling for mobile
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);

      // Set a shorter timeout for mobile devices
      const timeoutDuration = isMobileDevice ? 5000 : 10000;

      try {
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            setApiTimeoutReached(true);
            reject(new Error("Waktu habis saat memuat data kamar"));
          }, timeoutDuration);
        });

        // Define the actual fetch function
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://manage-kost-production.up.railway.app/api/kamar"
            );

            if (response.data && Array.isArray(response.data)) {
              return response.data;
            } else {
              throw new Error("Format data tidak valid");
            }
          } catch (err) {
            console.error("API Error:", err);
            throw new Error("Gagal memuat data dari server");
          }
        };

        // Race between timeout and data fetching
        const data = await Promise.race([fetchData(), timeoutPromise]);

        // Process received data
        const processedCards = data.map((item: any) => ({
          id:
            item.id ||
            `kamar-${
              item.nomorKamar || Math.random().toString(36).substring(7)
            }`,
          nomorKamar: item.nomorKamar || "???",
          status: item.status || "kosong",
          hargaBulanan: item.hargaBulanan || 0,
          fasilitas: (item.fasilitas || "").substring(0, 100),
          title: item.title || `Kamar ${item.nomorKamar || ""}`,
          description: item.description || item.fasilitas || "",
          price: item.price || item.hargaBulanan || 0,
        }));

        setCards(processedCards);
        setUsingFallbackData(false);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading rooms:", err);

        // On error, use fallback data to ensure content always appears
        setCards(fallbackRooms);
        setUsingFallbackData(true);
        setIsLoading(false);

        if (apiTimeoutReached) {
          setError("Koneksi lambat terdeteksi. Menampilkan contoh kamar.");
        } else {
          setError("Gagal memuat data kamar. Menampilkan contoh kamar.");
        }
      }
    };

    // Add a small delay before fetching on mobile to let the UI render first
    if (isMobileDevice) {
      setTimeout(fetchRooms, 300);
    } else {
      fetchRooms();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load more cards function
  const loadMoreCards = () => {
    setVisibleCards((prevCount) => prevCount + 6);
  };

  // Better loading state with skeleton cards - now more visible
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-4 text-center text-sm text-gray-500">
          Memuat data kamar...
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(isMobile ? 2 : 3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 animate-pulse"
            >
              <div className="h-56 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state - now shows fallback data instead of just an error message
  if (error) {
    return (
      <div>
        <div className="mb-4 px-6 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg">
          {error}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {fallbackRooms.map((item, index) => (
            <RoomCard
              key={item.id}
              item={item}
              index={index}
              isMobile={isMobile}
              onSelect={() => setSelectedCard(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  // No data state
  if (cards.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 px-4 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Tidak ada kamar tersedia saat ini. Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  // Main render with optimized approach - only show a subset initially
  const displayedCards = cards.slice(0, visibleCards);

  return (
    <div className="p-6">
      {usingFallbackData && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-lg">
          Menampilkan contoh kamar karena koneksi internet lambat
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedCards.map((item, index) => (
          <RoomCard
            key={item.id}
            item={item}
            index={index}
            isMobile={isMobile}
            onSelect={() => setSelectedCard(item)}
          />
        ))}
      </div>

      {/* Load more button - only shown if there are more cards to display */}
      {visibleCards < cards.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreCards}
            className="px-6 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            Lihat Lebih Banyak
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedCard && (
        <DetailRoom
          card={{
            ...selectedCard,
            image: roomImage,
          }}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

// Extract the card rendering to a separate component for better performance
const RoomCard = ({
  item,
  index,
  isMobile,
  onSelect,
}: {
  item: Card;
  index: number;
  isMobile: boolean;
  onSelect: () => void;
}) => {
  return (
    <motion.div
      key={item.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 border border-yellow-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: isMobile ? 0 : index * 0.05 }}
    >
      <div className="relative">
        <div className="w-full h-56 bg-gray-100 relative">
          <img
            src={roomImage}
            alt={`Kamar ${item.nomorKamar}`}
            className={`w-full h-full object-cover transition-all ${
              item.status !== "kosong" ? "blur-[4px]" : ""
            }`}
            loading="lazy"
          />
        </div>
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
            <span className="text-xs text-gray-500 font-normal">/bulan</span>
          </p>
          <button
            onClick={onSelect}
            className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-600 hover:text-white transition duration-300"
          >
            Detail <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
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

  // Detect mobile devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile detection
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Simple gradient background - no particles, patterns, or animations */}

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
            initial={!isMobile ? { opacity: 0, y: 30 } : { opacity: 1 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
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
            initial={!isMobile ? { opacity: 0, y: 30 } : { opacity: 1 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
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
