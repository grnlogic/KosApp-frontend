import React, { useState, useEffect } from "react";
import jspdf, { jsPDF } from "jspdf";
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
  Download,
} from "lucide-react";
import { JSX } from "react/jsx-runtime";
import axios, { AxiosResponse } from "axios";
import Commet from "./Commet";

const API_BASE_URL = "http://141.11.25.167:8080"; // production URL

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

// Interface for backend Pembayaran model
interface Pembayaran {
  id: number;
  kamarId: number;
  userId?: number;
  kamar: string;
  penghuni: string;
  nominal: number;
  status: string;
  tanggalJatuhTempo?: string;
  tanggalBayar?: string;
  bulanBayar?: string;
  tahunBayar?: number;
  catatan?: string;
  createdAt?: string;
  updatedAt?: string;
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

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh-token`,
      { refreshToken }
    );
    localStorage.setItem("token", response.data.token);
    return true;
  } catch (error) {
    console.error("Gagal memperbaharui token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return false;
  }
};

// Add a new interface for the API response type
interface ApiResponse<T> {
  data: T[];
}

// Function to handle PDF download and pdf content generation
const handleDownloadPDF = (item: PaymentItem) => {
  // Buat instance PDF baru
  const doc = new jsPDF();

  // Tambahkan margin
  const margin = 20;
  let y = margin;

  // Header Invoice
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", margin, y);

  // Logo/Nama Perusahaan
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("KOSAPP", 160, y);
  doc.setFontSize(8);
  doc.text("Manajemen Kos Terpercaya", 160, y + 5);

  // Garis pembatas header
  y += 15;
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);
  y += 10;

  // Informasi Kepada
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("KEPADA :", margin, y);

  // Informasi Tanggal
  doc.text("TANGGAL :", 130, y);
  y += 5;

  // Data Penerima
  doc.setFont("helvetica", "normal");
  doc.text(item.penghuni, margin, y);

  // Data Tanggal
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(formattedDate, 130, y);
  y += 5;

  // Email (jika tersedia)
  doc.text("penghuni@kosapp.com", margin, y);

  // Nomor Invoice
  doc.setFont("helvetica", "bold");
  doc.text("NO INVOICE :", 130, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(
    `KOS-${item.id}-${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`,
    130,
    y
  );

  // Tabel Header
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.rect(margin, y, 170, 10);
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 170, 10, "F");

  doc.text("KETERANGAN", margin + 5, y + 7);
  doc.text("HARGA", 90, y + 7);
  doc.text("JML", 140, y + 7);
  doc.text("TOTAL", 170, y + 7);
  y += 10;

  // Item Pembayaran
  doc.setFont("helvetica", "normal");
  doc.rect(margin, y, 170, 10);
  doc.text(`Sewa Kamar ${item.kamar}`, margin + 5, y + 7);

  // Extract numeric value from nominal string (removing "Rp " and thousand separators)
  const numericValue = item.nominal.replace(/[^\d]/g, "");
  const hargaSewa = parseInt(numericValue);

  doc.text(item.nominal, 90, y + 7);
  doc.text("1", 140, y + 7);
  doc.text(item.nominal, 170, y + 7);
  y += 10;

  // Garis untuk pembayaran
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("PEMBAYARAN :", margin, y);
  y += 5;

  // Detail Pembayaran
  doc.setFont("helvetica", "normal");
  doc.text(`Nama : KosApp`, margin, y);
  doc.text("SUB TOTAL :", 130, y);
  doc.text(item.nominal, 170, y);
  y += 5;

  doc.text(`No. Rek : 1234-567-890`, margin, y);

  // Pajak (10% asumsi)
  const pajak = Math.round(hargaSewa * 0.1);
  doc.text("PAJAK :", 130, y);
  doc.text(`Rp ${pajak.toLocaleString("id-ID")}`, 170, y);
  y += 5;

  // Total
  doc.setLineWidth(0.2);
  doc.line(130, y, 190, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL :", 130, y);
  const totalBayar = hargaSewa + pajak;
  doc.text(`Rp ${totalBayar.toLocaleString("id-ID")}`, 170, y);

  // Terima kasih
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.text("TERIMAKASIH ATAS", margin, y);
  y += 5;
  doc.text("PEMBAYARAN ANDA", margin, y);

  // Tanda tangan
  doc.text("Admin KosApp", 150, y);
  doc.setLineWidth(0.5);
  doc.line(140, y + 10, 180, y + 10);

  // Download PDF dengan nama yang sesuai
  doc.save(`Invoice_Kamar_${item.kamar}.pdf`);
};

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
        // 1. Fetch pembayaran data directly
        const pembayaranResponse = await axios.get<Pembayaran[]>(
          `${API_BASE_URL}/api/pembayaran`
        );

        // 2. Also fetch rooms data for create functionality
        const roomsResponse = await axios.get<KamarData[]>(
          `${API_BASE_URL}/api/kamar`
        );
        setRooms(roomsResponse.data);

        // 3. Transform pembayaran data to PaymentItem format
        const transformedData: PaymentItem[] = pembayaranResponse.data.map(
          (payment) => ({
            id: payment.id,
            kamar: payment.kamar || "N/A",
            penghuni: payment.penghuni || "N/A",
            nominal: `Rp ${payment.nominal?.toLocaleString("id-ID") || 0}`,
            status: payment.status || "Belum Bayar",
            roomId: payment.kamarId,
            userId: payment.userId,
          })
        );

        setPembayaran(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching pembayaran data:", err);

        // Fallback: Try to get data from kamar endpoint
        try {
          const roomsResponse = await axios.get<KamarData[]>(
            `${API_BASE_URL}/api/kamar`
          );
          setRooms(roomsResponse.data);

          const usersResponse = await axios.get<UserData[]>(
            `${API_BASE_URL}/api/users`
          );

          const combinedData: PaymentItem[] = roomsResponse.data.map((room) => {
            const user = usersResponse.data.find(
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
          setError(
            "Menggunakan data dari kamar (endpoint pembayaran tidak tersedia)"
          );
        } catch (fallbackErr) {
          console.error("Error fetching fallback data:", fallbackErr);

          // Final fallback: use dummy data
          const dummyPembayaran: PaymentItem[] = [
            {
              id: 1,
              kamar: "Kamar 101",
              penghuni: "Bambang S",
              nominal: "Rp 1.500.000",
              status: "Lunas",
              roomId: 101,
              userId: 1,
            },
            {
              id: 2,
              kamar: "Kamar 102",
              penghuni: "Dewi K",
              nominal: "Rp 1.200.000",
              status: "Menunggu",
              roomId: 102,
              userId: 2,
            },
            {
              id: 3,
              kamar: "Kamar 103",
              penghuni: "Rudi H",
              nominal: "Rp 1.300.000",
              status: "Belum Bayar",
              roomId: 103,
              userId: 3,
            },
          ];

          setPembayaran(dummyPembayaran);
          setError(
            "Menggunakan data dummy karena gagal mengambil data dari server"
          );
        }
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
    if (
      !window.confirm("Apakah Anda yakin ingin menghapus data pembayaran ini?")
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/pembayaran/${id}`);
      setPembayaran(pembayaran.filter((item) => item.id !== id));
      if (selectedId === id) {
        resetForm();
        setShowForm(false);
      }
      alert("Data pembayaran berhasil dihapus");
    } catch (err) {
      console.error("Error deleting payment:", err);
      alert("Gagal menghapus data pembayaran. Silakan coba lagi.");
    }
  };

  const handleSave = async () => {
    try {
      if (selectedId) {
        // Update existing payment status
        await axios.patch(
          `${API_BASE_URL}/api/pembayaran/${selectedId}/status?status=${formData.status}`
        );

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

        alert("Status pembayaran berhasil diupdate!");
      } else {
        // Create new payment - we need kamarId
        if (!formData.kamar) {
          alert("Silakan pilih kamar terlebih dahulu");
          return;
        }

        // Find the room by nomor kamar to get the kamarId
        const room = rooms.find((r) => r.nomorKamar === formData.kamar);
        if (!room) {
          alert("Kamar tidak ditemukan");
          return;
        }

        const newPembayaran = {
          kamarId: room.id,
          status: formData.status,
          nominal: parseFloat(formData.totalTagihan.replace(/[^\d]/g, "")),
          tanggalJatuhTempo: formData.jatuhTempo
            ? new Date(formData.jatuhTempo).toISOString()
            : null,
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/pembayaran`,
          newPembayaran
        );

        // Add to local state
        const savedPembayaran = response.data;
        setPembayaran([
          ...pembayaran,
          {
            id: savedPembayaran.id,
            kamar: savedPembayaran.kamar,
            penghuni: savedPembayaran.penghuni,
            nominal: `Rp ${savedPembayaran.nominal?.toLocaleString("id-ID")}`,
            status: savedPembayaran.status,
            roomId: savedPembayaran.kamarId,
            userId: savedPembayaran.userId,
          },
        ]);

        alert("Pembayaran baru berhasil ditambahkan!");
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving payment:", err);
      alert("Gagal menyimpan data pembayaran. Silakan coba lagi.");
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
        <Commet color="#32cd32" size="medium" text="" textColor="" />
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
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Hapus"
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
                  {selectedId ? (
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                      value={formData.kamar}
                      readOnly
                    />
                  ) : (
                    <select
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
                      value={formData.kamar}
                      onChange={(e) => {
                        const selectedRoom = rooms.find(
                          (r) => r.nomorKamar === e.target.value
                        );
                        if (selectedRoom) {
                          setFormData({
                            ...formData,
                            kamar: selectedRoom.nomorKamar,
                            totalTagihan: selectedRoom.hargaBulanan.toString(),
                          });
                        }
                      }}
                    >
                      <option value="">Pilih Kamar</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.nomorKamar}>
                          {room.nomorKamar} - {room.title || room.description}
                        </option>
                      ))}
                    </select>
                  )}
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
                    placeholder={selectedId ? "" : "Akan terisi otomatis"}
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
                    value={
                      formData.totalTagihan
                        ? `Rp ${parseInt(formData.totalTagihan).toLocaleString(
                            "id-ID"
                          )}`
                        : ""
                    }
                    placeholder="Akan terisi otomatis"
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

              {!selectedId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Jatuh Tempo (Opsional)
                  </label>
                  <input
                    type="date"
                    className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.jatuhTempo}
                    onChange={(e) =>
                      setFormData({ ...formData, jatuhTempo: e.target.value })
                    }
                  />
                </div>
              )}
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
