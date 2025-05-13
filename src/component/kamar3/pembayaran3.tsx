import BackButtonOrange from "../image/chevron-right.svg";
import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, AlertCircle, Check, Clock } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

// Define room data interface
interface RoomData {
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

const Contact = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Fetch room data for kamar 3
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://manage-kost-production.up.railway.app/api/kamar/3"
        );
        setRoomData(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  const handlePayment = async () => {
    if (!roomData) return;

    setIsPaymentProcessing(true);

    try {
      // Update room payment status
      const updatedRoom = { ...roomData, statusPembayaran: "Menunggu" };
      await axios.put(
        `https://manage-kost-production.up.railway.app/api/kamar/${roomData.id}`,
        updatedRoom
      );
      setRoomData(updatedRoom);
      Swal.fire({
        title: "Pembayaran Sedang Diproses",
        text: "Mohon tunggu konfirmasi dari admin. Status pembayaran Anda akan diperbarui segera.",
        icon: "info",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#FEBF00",
      });
    } catch (err) {
      console.error("Error processing payment:", err);
      Swal.fire({
        title: "Pembayaran Gagal",
        text: "Terjadi kesalahan. Silakan coba lagi nanti.",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#FEBF00",
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleAdminPayment = () => {
    if (!roomData) return;

    const message = encodeURIComponent(
      `Halo Admin KosApp, saya ingin melakukan pembayaran untuk:\n\n` +
        `Kamar: ${roomData.nomorKamar}\n` +
        `Total Tagihan: Rp ${
          roomData.hargaBulanan?.toLocaleString("id-ID") || "0"
        }\n` +
        `Status Pembayaran: ${roomData.statusPembayaran || "Belum Dibayar"}`
    );

    const whatsappLink = `https://wa.me/62895352281010?text=${message}`;

    Swal.fire({
      title: "Pembayaran Admin",
      html:
        `<p>Hubungi admin untuk melakukan pembayaran:</p>` +
        `<p><strong>Total Tagihan:</strong> Rp ${
          roomData.hargaBulanan?.toLocaleString("id-ID") || "0"
        }</p>` +
        `<p><strong>Status:</strong> ${
          roomData.statusPembayaran || "Belum Dibayar"
        }</p>` +
        `<p>Silahkan <a href="${whatsappLink}" target="_blank" style="color: #FFCC00; font-weight: bold; text-decoration: underline;">klik disini</a> untuk menghubungi admin via WhatsApp</p>`,
      icon: "info",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#FFCC00",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });
  };

  const getStatusBadge = (status: string | undefined) => {
    if (status === "Lunas") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <Check className="mr-1" size={14} />
          Lunas
        </span>
      );
    } else if (status === "Menunggu") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="mr-1" size={14} />
          Menunggu
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle className="mr-1" size={14} />
          Belum Dibayar
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFCC00]"></div>
        <span className="ml-2 text-[#FFCC00] font-medium">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!roomData) {
    return <div className="text-center p-4">No room data available</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="container mx-auto bg-gradient-to-r from-[#FFCC00] to-[#FFB700] rounded-2xl p-6 mb-9 shadow-lg transform transition-all hover:shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
          <DollarSign className="text-white" size={24} />
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-4 shadow-inner">
          <div className="flex justify-between w-full items-center border-b border-gray-100 pb-4 mb-4">
            <h1 className="text-lg text-gray-800 font-medium">Total Tagihan</h1>
            <span className="text-xl text-[#FFCC00] font-bold">
              Rp {roomData.hargaBulanan?.toLocaleString("id-ID") || "0"}
            </span>
          </div>
          <div className="flex justify-between w-full items-center mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-[#FFCC00]" />
              <h1 className="text-gray-700 font-medium">Status</h1>
            </div>
            {getStatusBadge(roomData.statusPembayaran)}
          </div>
          <button
            className="bg-gradient-to-r from-[#FFCC00] to-[#FFB700] text-white rounded-xl py-4 mt-2 w-full text-lg font-bold shadow-md transform transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handlePayment}
            disabled={
              isPaymentProcessing || roomData.statusPembayaran === "Lunas"
            }
          >
            {isPaymentProcessing ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                MEMPROSES...
              </div>
            ) : roomData.statusPembayaran === "Lunas" ? (
              "SUDAH DIBAYAR"
            ) : (
              "BAYAR SEKARANG"
            )}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FFB700] rounded-2xl p-6 mt-6 shadow-lg transform transition-all hover:shadow-xl">
        <div className="mb-4">
          <h1 className="text-2xl text-white font-bold mb-1 flex items-center">
            <Calendar className="mr-2" size={20} />
            Pembayaran Admin
          </h1>
          <p className="text-white text-opacity-80 text-sm">
            Hubungi admin untuk pembayaran langsung
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-inner hover:shadow-md transition-all">
          <p className="text-gray-700 mb-4">
            Tidak dapat melakukan pembayaran online? Hubungi admin untuk
            melakukan pembayaran langsung.
          </p>
          <button
            onClick={handleAdminPayment}
            className="w-full bg-gradient-to-r from-[#FFCC00] to-[#FFB700] text-white rounded-xl py-4 font-bold shadow-md transform transition-transform hover:scale-[1.02]"
          >
            HUBUNGI ADMIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
