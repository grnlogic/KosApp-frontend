"use client";

import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "react-router-dom"; // Replace Next.js Link with React Router's Link

type Room = {
  id: number;
  roomNumber: string;
  status: "Tersedia" | "Terisi" | "Maintenance";
  price: number;
  facilities: string[];
};

type ModalType = "edit" | "add" | "delete" | null;

export default function InfoKamar() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      roomNumber: "A-101",
      status: "Tersedia",
      price: 1500000,
      facilities: ["AC", "Kamar mandi dalam", "Wifi"],
    },
    {
      id: 2,
      roomNumber: "B-202",
      status: "Terisi",
      price: 1200000,
      facilities: ["Kipas angin", "Kamar mandi dalam"],
    },
    {
      id: 3,
      roomNumber: "C-303",
      status: "Maintenance",
      price: 1800000,
      facilities: ["AC", "Kamar mandi dalam", "Wifi", "TV"],
    },
  ]);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    roomNumber: "",
    status: "Tersedia",
    price: 0,
    facilities: [],
  });
  const [facilityInput, setFacilityInput] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-800";
      case "Terisi":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openEditModal = (room: Room) => {
    setCurrentRoom(room);
    setNewRoom({
      roomNumber: room.roomNumber,
      status: room.status,
      price: room.price,
      facilities: [...room.facilities],
    });
    setModalType("edit");
  };

  const openDeleteModal = (room: Room) => {
    setCurrentRoom(room);
    setModalType("delete");
  };

  const openAddModal = () => {
    setNewRoom({
      roomNumber: "",
      status: "Tersedia",
      price: 0,
      facilities: [],
    });
    setModalType("add");
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentRoom(null);
  };

  const handleSaveEdit = () => {
    if (!currentRoom) return;

    const updatedRooms = rooms.map((room) =>
      room.id === currentRoom.id ? { ...room, ...newRoom } : room
    );

    setRooms(updatedRooms);
    closeModal();
  };

  const handleDelete = () => {
    if (!currentRoom) return;

    const updatedRooms = rooms.filter((room) => room.id !== currentRoom.id);
    setRooms(updatedRooms);
    closeModal();
  };

  const handleAddRoom = () => {
    const newId = Math.max(0, ...rooms.map((room) => room.id)) + 1;

    const roomToAdd: Room = {
      id: newId,
      roomNumber: newRoom.roomNumber || "",
      status: newRoom.status || "Tersedia",
      price: newRoom.price || 0,
      facilities: newRoom.facilities || [],
    };

    setRooms([...rooms, roomToAdd]);
    closeModal();
  };

  const addFacility = () => {
    if (!facilityInput.trim()) return;

    setNewRoom({
      ...newRoom,
      facilities: [...(newRoom.facilities || []), facilityInput.trim()],
    });

    setFacilityInput("");
  };

  const removeFacility = (index: number) => {
    const updatedFacilities = [...(newRoom.facilities || [])];
    updatedFacilities.splice(index, 1);

    setNewRoom({
      ...newRoom,
      facilities: updatedFacilities,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-400 rounded-b-[40px] p-4 pb-8">
        <Link to="/Beranda" className="flex items-center text-white">
          <ArrowLeft className="mr-2" />
          <h1 className="text-xl md:text-2xl font-bold">Edit Info Kamar</h1>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Daftar Info Kamar
        </h2>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-6 overflow-x-auto">
          {/* Desktop Table Header - Hidden on Mobile */}
          <div className="hidden md:grid md:grid-cols-5 bg-gray-100 p-4 rounded-md mb-2">
            <div className="font-semibold">Nomor Kamar</div>
            <div className="font-semibold">Status</div>
            <div className="font-semibold">Harga/Bulan</div>
            <div className="font-semibold">Fasilitas</div>
            <div className="font-semibold">Aksi</div>
          </div>

          {/* Mobile and Desktop Table Content */}
          {rooms.map((room) => (
            <div key={room.id} className="border-b py-4">
              {/* Mobile View - Card Layout */}
              <div className="md:hidden grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">{room.roomNumber}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Harga: </span>
                  Rp {room.price.toLocaleString()}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Fasilitas: </span>
                  {room.facilities.join(", ")}
                </div>
                <div className="flex space-x-3 mt-2">
                  <button
                    className="px-3 py-1 bg-blue-50 text-blue-500 rounded-md"
                    onClick={() => openEditModal(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-50 text-red-500 rounded-md"
                    onClick={() => openDeleteModal(room)}
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Desktop View - Table Layout */}
              <div className="hidden md:grid md:grid-cols-5 items-center">
                <div className="font-medium">{room.roomNumber}</div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>
                </div>
                <div>Rp {room.price.toLocaleString()}</div>
                <div>{room.facilities.join(", ")}</div>
                <div className="space-y-1">
                  <button
                    className="block text-blue-500"
                    onClick={() => openEditModal(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="block text-red-500"
                    onClick={() => openDeleteModal(room)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Room Button */}
        <button
          className="bg-black text-white px-4 py-2 rounded-md flex items-center"
          onClick={openAddModal}
        >
          <Plus className="w-4 h-4 mr-1" /> Tambah Kamar Baru
        </button>
      </div>

      {/* Modals */}
      {/* ...existing modal code... */}
    </div>
  );
}
