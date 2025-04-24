import BackButtonOrange from "../image/chevron-right.svg";
import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Clock, Check, AlertCircle } from "lucide-react";
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch room data for kamar 1
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://manage-kost-production.up.railway.app/api/kamar/1"
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
      const updatedRoom = { ...roomData, statusPembayaran: "Lunas" };
      await axios.put(
        `https://manage-kost-production.up.railway.app/api/kamar/${roomData.id}`,
        updatedRoom
      );
      setRoomData(updatedRoom);
      alert("Pembayaran berhasil!");
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Pembayaran gagal. Silakan coba lagi.");
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
        `<p>Silahkan <a href="${whatsappLink}" target="_blank" style="color: #FF9500; font-weight: bold; text-decoration: underline;">klik disini</a> untuk menghubungi admin via WhatsApp</p>`,
      icon: "info",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#FF9500",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });
  };

  if (loading) {
    return (
      <div className="animate-fadeIn flex justify-center items-center h-40">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn text-red-500 text-center p-4">{error}</div>
    );
  }

  if (!roomData) {
    return (
      <div className="animate-fadeIn text-center p-4">
        No room data available
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="container mx-auto bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="text-white" size={24} />
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-4 shadow-inner">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg text-gray-800 font-medium">Total Tagihan</h1>
            <span className="text-xl text-[#FF7A00] font-bold">
              Rp {roomData.hargaBulanan?.toLocaleString("id-ID") || "0"}
            </span>
          </div>
          <div className="w-full h-px bg-gray-200 my-4"></div>
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center">
              <Clock className="text-[#FF7A00] mr-2" size={18} />
              <h1 className="text-lg text-gray-800 font-medium">Status</h1>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                roomData.statusPembayaran === "Lunas"
                  ? "bg-green-100 text-green-800"
                  : roomData.statusPembayaran === "Menunggu"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {roomData.statusPembayaran === "Lunas" ? (
                <Check className="mr-1" size={14} />
              ) : (
                <AlertCircle className="mr-1" size={14} />
              )}
              {roomData.statusPembayaran || "Belum Dibayar"}
            </span>
          </div>
          <button
            className={`bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-xl py-4 mt-6 w-full text-lg font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex justify-center items-center ${
              isPaymentProcessing || roomData.statusPembayaran === "Lunas"
                ? "opacity-75"
                : ""
            }`}
            onClick={handlePayment}
            disabled={
              isPaymentProcessing || roomData.statusPembayaran === "Lunas"
            }
          >
            {isPaymentProcessing ? (
              <>
                <div className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                MEMPROSES...
              </>
            ) : roomData.statusPembayaran === "Lunas" ? (
              "SUDAH DIBAYAR"
            ) : (
              "BAYAR SEKARANG"
            )}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-2xl p-6 mt-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-white" size={24} />
          <h1 className="text-2xl text-white font-bold">Pembayaran Admin</h1>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-inner">
          <p className="text-gray-600 mb-4">
            Tidak dapat melakukan pembayaran online? Hubungi admin untuk
            melakukan pembayaran langsung.
          </p>
          <button
            onClick={handleAdminPayment}
            className="w-full bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-xl py-4 font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
          >
            HUBUNGI ADMIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
