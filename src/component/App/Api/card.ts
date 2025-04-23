export type card = {
  id: string;
  title: string;
  description: string;
  status: string;
  price: number;
  image: string;
  hargaBulanan: number; // Add hargaBulanan
  fasilitas: string; // Add fasilitas
  nomorKamar: string; // Add nomorKamar
};

export const card: card[] = [
  {
    id: "1",
    title: "Kamar 1",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 1000000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    hargaBulanan: 1000000, // Add hargaBulanan
    fasilitas: "AC, WiFi, Kamar Mandi Dalam", // Add fasilitas
    nomorKamar: "101", // Add nomorKamar
  },
  {
    id: "2",
    title: "Kamar 2",
    description: "Kamar dengan pemandangan indah",
    status: "unavailable",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    hargaBulanan: 1500000, // Add hargaBulanan
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Balkon", // Add fasilitas
    nomorKamar: "102", // Add nomorKamar
  },
  {
    id: "3",
    title: "Kamar 3",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 2000000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    hargaBulanan: 2000000, // Add hargaBulanan
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, TV", // Add fasilitas
    nomorKamar: "103", // Add nomorKamar
  },
  {
    id: "4",
    title: "Kamar 4",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    hargaBulanan: 2500000, // Add hargaBulanan
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Lemari", // Add fasilitas
    nomorKamar: "104", // Add nomorKamar
  },
];
