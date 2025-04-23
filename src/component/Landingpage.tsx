import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { owner } from "./App/Api/owner";
import { fitur as fiturData } from "./App/Api/fitur";
import TentangKosApp from "./TentangKosApp";
import DetailRoom from "./DetailRoom";
import Particles from "react-tsparticles";
import axios from "axios"; // Import axios for API calls

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
            image: item.image || "default-image.jpg", // Ensure image is always a string
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
                src={item.image}
                alt={item.nomorKamar}
                className="w-full h-56 object-cover"
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
            image: selectedCard.image || "default-image.jpg", // Ensure image is always a string
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
      {/* Particle Background */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2 } },
            opacity: { value: 0.4, random: true },
            move: {
              speed: 1,
              direction: "none",
              random: true,
              out_mode: "out",
            },
            color: { value: "#FFD700" },
            line_linked: {
              enable: true,
              color: "#FFD700",
              opacity: 0.2,
              width: 1,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
            },
          },
        }}
      />

      {/* Header */}
      <div className="sticky top-0 w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg z-50">
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
            >
              Daftar Sekarang
            </motion.button>
          </motion.div>
        </section>

        {showTentangKosApp && (
          <TentangKosApp onClose={() => setShowTentangKosApp(false)} />
        )}
      </article>
    </div>
  );
};

export default LandingPage;
