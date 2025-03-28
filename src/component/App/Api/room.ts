// room.ts
export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  image: string;
  size: number;
  floor: string;
  bedType: string;
  maxOccupancy: number;
  amenities: string[];
};

export const RoomList: Room[] = [
  {
    id: "1",
    name: "Kamar 1",
    description: "Kamar dengan pemandangan indah",
    price: 1000000,
    status: "available",
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    size: 20,
    floor: "1",
    bedType: "single",
    maxOccupancy: 1,
    amenities: ["AC", "TV", "Kamar Mandi Dalam", "Wifi"],
  },
  {
    id: "2",
    name: "Kamar 2",
    description: "Kamar dengan pemandangan indah",
    price: 1500000,
    status: "available",
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    size: 25,
    floor: "1",
    bedType: "double",
    maxOccupancy: 2,
    amenities: ["AC", "TV", "Kamar Mandi Dalam", "Wifi"],
  },
  {
    id: "3",
    name: "Kamar 3",
    description: "Kamar dengan pemandangan indah",
    price: 2000000,
    status: "available",
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    size: 30,
    floor: "1",
    bedType: "double",
    maxOccupancy: 2,
    amenities: ["AC", "TV", "Kamar Mandi Dalam", "Wifi"],
  },
  {
    id: "4",
    name: "Kamar 4",
    description: "Kamar dengan pemandangan indah",
    price: 2500000,
    status: "available",
    image: "https://images.unsplash.com/photo-1560185893-ae22c5d3e5f0",
    size: 35,
    floor: "1",
    bedType: "double",
    maxOccupancy: 2,
    amenities: ["AC", "TV", "Kamar Mandi Dalam", "Wifi"],
  },
];

export default RoomList;
