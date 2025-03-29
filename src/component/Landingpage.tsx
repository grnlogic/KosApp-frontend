import React, { use, useState } from "react";
import { Navigate } from "react-router-dom";
import { card } from "./App/Api/card";
import { motion } from "framer-motion";
import { useEffect } from "react";
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
} from "lucide-react";
import { owner } from "./App/Api/owner";
import { fitur as fiturData } from "./App/Api/fitur";
import TentangKosApp from "./TentangKosApp";
import DetailRoom from "./DetailRoom";
import Particles from "react-tsparticles";

//card list
const CardList = () => {
  const [selectedCard, setSelectedCard] = useState<card | null>(null);

  return (
    <div className="p-6">
      {/* Lingkaran kuning tanpa animasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {card.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="flex flex-col items-start mt-4">
              <h1 className="text-lg font-bold">{item.title}</h1>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <p
              className={`text-white p-2 mt-4 rounded-md text-center ${
                item.status === "available" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {item.status === "available" ? "Tersedia" : "Tidak Tersedia"}
            </p>
            <p className="mt-2 font-semibold text-lg">{item.price}</p>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => setSelectedCard(item)}
                className="px-4 py-2 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700"
              >
                Detail Kamar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedCard && (
        <DetailRoom card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
};

//fitur
const Fitur = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 text-center">
      {fiturData.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <h1 className="text-lg font-bold">{item.title}</h1>
          <p className="text-sm text-gray-500">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

//owner
const Owner = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {owner.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col"
        >
          <img
            src={item.image}
            alt={
              typeof item.name === "string"
                ? item.name
                : String(item.name || "No name available")
            }
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="flex flex-col items-start mt-4">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <UserCircle size={14} />
              {item.name}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Mail size={14} />
              {item.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Phone size={14} />
              {item.phone}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPinHouse size={14} />
              {item.address}
            </p>
          </div>
        </div>
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
    }, 1000); // Change sentence every 1 second

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="relative">
      {/* Particle Background */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { speed: 1 },
            color: { value: "#FFD700" },
            line_linked: { enable: true, color: "#FFD700" },
          },
        }}
      />

      {/* Fixed header for auto-typing */}
      <div className="absolute top-0 left-0 w-full text-center pt-4 px-4 sm:px-8 lg:px-16 bg-yellow-100 z-10">
        <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight pb-1 text-[30px] text-yellow-700">
          MIMIN KOST
        </h1>
        <h2
          className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight text-yellow-600"
          style={{ opacity: 100 }}
        >
          {displayedText}
        </h2>
      </div>

      {/* Main content */}
      <article className="text-left pt-32 px-6 sm:px-10 md:px-20 lg:px-32 xl:px-40 mb-20 z-10 relative">
        {/* Introduction Section */}
        <section className="bg-yellow-50 py-10 px-6 sm:px-10 md:px-20 lg:px-32 rounded-lg shadow-md">
          <p className="mt-0 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-yellow-800">
            Mudahkan Pengelolaan Kos Anda. Kos-App membantu Anda mengelola
            kamar, memantau hunian, dan menangani pembayaran dalam satu
            platform. Sempurna untuk pemilik dan pengelola properti kos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <motion.button
              onClick={() => {
                // Navigate logic will be implemented here
              }}
              className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-bold text-lg lg:text-xl shadow hover:bg-yellow-600 transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Daftar Sekarang
            </motion.button>
            <motion.button
              onClick={() => setShowTentangKosApp(true)}
              className="px-4 py-3 border border-yellow-500 text-yellow-500 rounded-lg font-bold text-lg lg:text-xl shadow hover:bg-yellow-500 hover:text-white transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </div>
        </section>

        {/* Image Section */}
        <section className="bg-yellow-600 flex flex-col items-center justify-center mt-10 py-20 text-white rounded-lg shadow-md">
          <h1 className="text-4xl lg:text-5xl font-bold">image</h1>
        </section>

        {/* Available Rooms Section */}
        <section className="bg-yellow-50 py-10 px-6 sm:px-10 md:px-20 lg:px-32 rounded-lg shadow-md mt-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-yellow-800">
              Kamar tersedia
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-700">
              Lihat pilihan kamar kami dan temukan yang sesuai dengan kebutuhan
              Anda.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardList />
          </motion.div>
        </section>

        {/* Location Section */}
        <section className="bg-yellow-100 py-10 px-6 sm:px-10 md:px-20 lg:px-32 rounded-lg shadow-md mt-10">
          <motion.div
            className="w-full text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-4 text-yellow-800">
              Lokasi Kos
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-700">
              Lokasi strategis dengan akses mudah ke berbagai fasilitas
            </p>
          </motion.div>
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h5 className="font-extrabold text-2xl lg:text-3xl mb-1 text-yellow-800">
              Kos Nyaman Sejahtera
            </h5>
            <div className="flex items-center gap-2 text-yellow-700">
              <MapPinHouse size={24} />
              <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                Jl. Merdeka No. 123, Kelurahan Sukamaju, Kecamatan Setiabudi,
                Jakarta Selatan, 12345
              </span>
            </div>
          </motion.div>
          <motion.button
            onClick={() => {
              // Navigate logic will be implemented here
            }}
            className="mt-4 px-4 py-3 bg-yellow-500 text-white rounded-lg font-bold text-lg lg:text-xl shadow hover:bg-yellow-600 transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Lihat Lokasi
          </motion.button>
        </section>

        {/* Owner Section */}
        <section className="bg-yellow-50 py-10 px-6 sm:px-10 md:px-20 lg:px-32 rounded-lg shadow-md mt-10">
          <motion.div
            className=""
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-center text-yellow-800">
              PEMILIK KOST
            </h1>
            <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-yellow-700">
              Kenali pemilik kos dan cara menghubunginya.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Owner />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-yellow-100 py-10 px-6 sm:px-10 md:px-20 lg:px-32 rounded-lg shadow-md mt-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-center text-yellow-800">
              Fitur Kos-App
            </h1>
            <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-yellow-700">
              Temukan fitur-fitur canggih yang membuat Kos-App menjadi solusi
              sempurna untuk manajemen kos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Fitur />
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
