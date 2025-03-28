export type card = {
id: string;
  title: string;
  description: string;
  status: string;
  price: number;
  image: string;
};

export const card: card[] = [
  {
    id: "1",
    title: "Kamar 1",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 1000000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
  },
  {
    id: "2",
    title: "Kamar 2",
    description: "Kamar dengan pemandangan indah",
    status: "unavailable",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
  },
  {
    id: "3",
    title: "Kamar 3",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 2000000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
  },
  {
    id: "4",
    title: "Kamar 4",
    description: "Kamar dengan pemandangan indah",
    status: "available",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
  },
];
