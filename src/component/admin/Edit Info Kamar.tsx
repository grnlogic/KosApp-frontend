"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Commet from "./Commet";

axios.defaults.baseURL = "http://141.11.25.167:8080"; // Updated backend base URL

type Room = {
  id: number;
  nomorKamar: string; // Matches backend field
  status: "kosong" | "terisi" | "pending"; // Matches backend field
  hargaBulanan: number; // Matches backend field
  fasilitas: string[]; // Split from backend string
  title?: string; // Optional - backend will set default
  description?: string; // Optional - backend will set default
  price?: number; // Optional - backend will set default
  statusPembayaran?: string; // Optional
};

type ModalType = "edit" | "add" | "delete" | null;

export default function InfoKamar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    nomorKamar: "",
    status: "kosong",
    hargaBulanan: undefined,
    fasilitas: [],
    title: "",
    description: "",
    price: undefined,
  });
  const [facilityInput, setFacilityInput] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/kamar");
        const mappedRooms = response.data.map((room: any) => ({
          ...room,
          fasilitas: room.fasilitas ? room.fasilitas.split(",") : [],
        }));
        setRooms(mappedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        showNotification("Gagal terhubung ke database!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "kosong":
        return "bg-green-100 text-green-800";
      case "terisi":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openEditModal = (room: Room) => {
    setCurrentRoom(room);
    setNewRoom({ ...room });
    setModalType("edit");
  };

  const openDeleteModal = (room: Room) => {
    setCurrentRoom(room);
    setModalType("delete");
  };

  const openAddModal = () => {
    setNewRoom({
      nomorKamar: "",
      status: "kosong",
      hargaBulanan: undefined,
      fasilitas: [],
    });
    setModalType("add");
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentRoom(null);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveEdit = async () => {
    if (!currentRoom) return;

    try {
      const roomToUpdate = {
        ...newRoom,
        fasilitas: newRoom.fasilitas?.join(","),
      };

      const response = await axios.put(
        `/api/kamar/${currentRoom.id}`,
        roomToUpdate
      );

      if (response.status === 200) {
        const updatedRoom = {
          ...response.data,
          fasilitas: response.data.fasilitas
            ? response.data.fasilitas.split(",")
            : [],
        };

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === currentRoom.id ? updatedRoom : room
          )
        );
        closeModal();
        Swal.fire({
          title: "Berhasil!",
          text: "Kamar berhasil diperbarui!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui kamar.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Failed to update room:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui kamar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentRoom) return;

    try {
      const response = await axios.delete(`/api/kamar/${currentRoom.id}`);

      if (response.status === 200) {
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room.id !== currentRoom.id)
        );
        closeModal();
        Swal.fire({
          title: "Berhasil!",
          text: "Kamar berhasil dihapus!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus kamar.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Failed to delete room:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus kamar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddRoom = async () => {
    try {
      const roomToAdd = {
        ...newRoom,
        fasilitas: newRoom.fasilitas?.join(","),
      };

      const response = await axios.post("/api/kamar", roomToAdd);

      if (response.status === 201) {
        const addedRoom = {
          ...response.data,
          fasilitas: response.data.fasilitas
            ? response.data.fasilitas.split(",")
            : [],
        };

        setRooms((prevRooms) => [...prevRooms, addedRoom]);
        closeModal();
        Swal.fire({
          title: "Berhasil!",
          text: "Kamar berhasil ditambahkan!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menambahkan kamar.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Failed to add room:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan kamar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const addFacility = () => {
    if (!facilityInput.trim()) return;

    setNewRoom({
      ...newRoom,
      fasilitas: [...(newRoom.fasilitas || []), facilityInput.trim()],
    });

    setFacilityInput("");
  };

  const removeFacility = (index: number) => {
    const updatedFacilities = [...(newRoom.fasilitas || [])];
    updatedFacilities.splice(index, 1);

    setNewRoom({
      ...newRoom,
      fasilitas: updatedFacilities,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50">
          {notification}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Commet color="#32cd32" size="medium" text="" textColor="" />
        </div>
      ) : (
        /* Content */
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
                    <div className="font-medium text-lg">{room.nomorKamar}</div>
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
                    Rp {room.hargaBulanan.toLocaleString()}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Fasilitas: </span>
                    {room.fasilitas.join(", ")}
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
                  <div className="font-medium">{room.nomorKamar}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <div>Rp {room.hargaBulanan.toLocaleString()}</div>
                  <div>{room.fasilitas.join(", ")}</div>
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
      )}

      {/* Add Room Modal */}
      {modalType === "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Tambah Kamar Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={newRoom.nomorKamar}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, nomorKamar: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newRoom.status}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      status: e.target.value as Room["status"],
                    })
                  }
                >
                  <option value="kosong">kosong</option>
                  <option value="terisi">terisi</option>
                  <option value="pending">pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  value={
                    newRoom.hargaBulanan !== undefined
                      ? newRoom.hargaBulanan
                      : ""
                  } // Show empty if undefined
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      hargaBulanan: e.target.value
                        ? parseInt(e.target.value)
                        : undefined, // Allow empty value
                      price: e.target.value
                        ? parseInt(e.target.value)
                        : undefined, // Auto-sync price with hargaBulanan
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Judul Kamar (Opsional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Akan otomatis diisi jika kosong"
                  value={newRoom.title || ""}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={3}
                  placeholder="Akan otomatis diisi jika kosong"
                  value={newRoom.description || ""}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fasilitas
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-2"
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    onClick={addFacility}
                  >
                    Tambah
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {newRoom.fasilitas?.map((facility, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                    >
                      {facility}
                      <button
                        className="text-red-500"
                        onClick={() => removeFacility(index)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleAddRoom}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {modalType === "edit" && currentRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Kamar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={newRoom.nomorKamar}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, nomorKamar: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newRoom.status}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      status: e.target.value as Room["status"],
                    })
                  }
                >
                  <option value="kosong">kosong</option>
                  <option value="terisi">terisi</option>
                  <option value="pending">pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  value={
                    newRoom.hargaBulanan !== undefined
                      ? newRoom.hargaBulanan
                      : ""
                  }
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      hargaBulanan: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fasilitas
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-2"
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    onClick={addFacility}
                  >
                    Tambah
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {newRoom.fasilitas?.map((facility, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                    >
                      {facility}
                      <button
                        className="text-red-500"
                        onClick={() => removeFacility(index)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSaveEdit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Modal */}
      {modalType === "delete" && currentRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Hapus Kamar</h3>
            <p>
              Apakah Anda yakin ingin menghapus kamar {currentRoom.nomorKamar}?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
