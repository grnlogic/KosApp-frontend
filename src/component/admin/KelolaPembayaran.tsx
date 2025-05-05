import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { JSX } from "react/jsx-runtime";
import axios from "axios";

const API_BASE_URL = "https://manage-kost-production.up.railway.app"; // production URL

// Define types for the data
interface PaymentItem {
  id: number;
  kamar: string;
  penghuni: string;
  nominal: string;
  status: string;
  roomId?: number;
  userId?: number;
}

// Updated interface to match the backend Kamar model
interface KamarData {
  id: number;
  nomorKamar: string;
  status: string;
  hargaBulanan: number;
  fasilitas: string;
  title: string;
  description: string;
  price: number;
  statusPembayaran: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  roomId?: number;
  role: string;
}

interface ProfileData {
  id: number;
  userId: number;
  status: string;
  createdAt?: string;
}

export default function KelolaPembayaran() {
  // State for storing data from backend with proper types
  const [pembayaran, setPembayaran] = useState<PaymentItem[]>([]);
  const [rooms, setRooms] = useState<KamarData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    kamar: "",
    penghuni: "",
    totalTagihan: "",
    jatuhTempo: "",
    status: "Belum Bayar",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch rooms data
        const roomsResponse = await axios.get<KamarData[]>(
          `${API_BASE_URL}/api/kamar`
        );
        setRooms(roomsResponse.data);

        // Fetch users data
        const token = localStorage.getItem("token");

        const usersResponse = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

        // Fetch profiles data
        const profilesResponse = await axios.get<ProfileData[]>(
          `${API_BASE_URL}/api/profiles`
        );
        setProfiles(profilesResponse.data);

        // Combine data to create payment list
        const combinedData: PaymentItem[] = roomsResponse.data.map((room) => {
          const user: UserData | undefined = usersResponse.data.find(
            (u: UserData) => u.roomId === room.id
          );

          return {
            id: room.id,
            kamar: room.nomorKamar || "N/A",
            penghuni: user?.username || "N/A",
            nominal: `Rp ${room.hargaBulanan?.toLocaleString("id-ID") || 0}`,
            status: room.statusPembayaran || "Belum Bayar",
            roomId: room.id,
            userId: user?.id,
          };
        });

        setPembayaran(combinedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary statistics
  const paymentSummary = {
    lunas: pembayaran
      .filter((item) => item.status === "Lunas")
      .reduce(
        (sum, item) => sum + parseFloat(item.nominal.replace(/[^\d]/g, "")),
        0
      ),
    menunggu: pembayaran
      .filter((item) => item.status === "Menunggu")
      .reduce(
        (sum, item) => sum + parseFloat(item.nominal.replace(/[^\d]/g, "")),
        0
      ),
    belumBayar: pembayaran
      .filter((item) => item.status === "Belum Bayar")
      .reduce(
        (sum, item) => sum + parseFloat(item.nominal.replace(/[^\d]/g, "")),
        0
      ),
  };

  // Handling form functions
  const resetForm = () => {
    setSelectedId(null);
    setFormData({
      kamar: "",
      penghuni: "",
      totalTagihan: "",
      jatuhTempo: "",
      status: "Belum Bayar",
    });
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    const data = pembayaran.find((item) => item.id === id);
    if (data) {
      setFormData({
        kamar: data.kamar,
        penghuni: data.penghuni,
        totalTagihan: data.nominal.replace("Rp ", "").replace(/\./g, ""),
        jatuhTempo: "",
        status: data.status,
      });
    }
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/kamar/${id}`);
      setPembayaran(pembayaran.filter((item) => item.id !== id));
      if (selectedId === id) {
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error deleting payment:", err);
      alert("Failed to delete payment. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      if (selectedId) {
        // Get the room data
        const roomResponse = await axios.get(
          `${API_BASE_URL}/api/kamar/${selectedId}`
        );
        const roomData = roomResponse.data;

        // Update status
        roomData.statusPembayaran = formData.status;

        // Update room data
        await axios.put(`${API_BASE_URL}/api/kamar/${selectedId}`, roomData);

        // Update local state
        setPembayaran(
          pembayaran.map((item) =>
            item.id === selectedId
              ? {
                  ...item,
                  status: formData.status,
                }
              : item
          )
        );
      } else {
        // For new payments, we would need additional APIs
        alert("Adding new payments is not implemented in this version");
      }

      setShowForm(false);
    } catch (err) {
      console.error("Error saving payment:", err);
      alert("Failed to save payment. Please try again.");
    }
  };

  // Filter payments based on search query
  const filteredPayments = pembayaran.filter(
    (payment) =>
      payment.kamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.penghuni.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Kelola Pembayaran
          </h1>
          <p className="text-gray-500 mt-2">
            Pantau dan kelola pembayaran penghuni kos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lunas</p>
                  <p className="text-xl font-bold">
                    Rp {paymentSummary.lunas.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Menunggu</p>
                  <p className="text-xl font-bold">
                    Rp {paymentSummary.menunggu.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Belum Bayar</p>
                  <p className="text-xl font-bold">
                    Rp {paymentSummary.belumBayar.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Cari kamar atau penghuni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center sm:justify-start"
            onClick={resetForm}
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Pembayaran
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Kamar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Nominal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.kamar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.nominal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Lunas"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
              <h2 className="text-white font-bold">
                {selectedId ? "Edit Tagihan" : "Tambah Tagihan Baru"}
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kamar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                    value={formData.kamar}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penghuni
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                    value={formData.penghuni}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tagihan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                    value={formData.totalTagihan}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Belum Bayar</option>
                    <option>Menunggu</option>
                    <option>Lunas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Simpan Perubahan
              </button>
              {selectedId && (
                <button
                  onClick={() => handleDelete(selectedId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Hapus Tagihan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Adding missing component
function User(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Bed(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}
