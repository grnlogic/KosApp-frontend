import BackButtonOrange from "../image/chevron-right.svg";
import React, { useState, useEffect } from "react";
import {
  CalendarClock,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
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

  // Fetch room data for kamar 4
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://manage-kost-production.up.railway.app/api/kamar/4"
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
        `<p>Silahkan <a href="${whatsappLink}" target="_blank" style="color: #FF9900; font-weight: bold; text-decoration: underline;">klik disini</a> untuk menghubungi admin via WhatsApp</p>`,
      icon: "info",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#FF9900",
      showCancelButton: true,
      cancelButtonText: "Batal",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!roomData) {
    return <div className="text-center p-4">No room data available</div>;
  }

  return (
    <div>
      <div className="container mx-auto bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <CreditCard className="text-white" size={24} />
          <h3 className="text-white font-bold text-2xl">Jadwal Pembayaran</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-xl p-6 mt-5 shadow-md border border-[#FFE180]">
          <div className="flex justify-between w-full">
            <h1 className="text-gray-700 font-semibold">Total Tagihan</h1>
            <span className="text-[#FF9900] font-bold">
              Rp {roomData.hargaBulanan?.toLocaleString("id-ID") || "0"}
            </span>
          </div>
          <div className="flex justify-between w-full mt-5">
            <h1 className="text-gray-700 font-semibold">Status</h1>
            <div className="flex items-center">
              {roomData.statusPembayaran === "Lunas" ? (
                <CheckCircle className="text-green-500 mr-1" size={16} />
              ) : (
                <AlertCircle className="text-orange-500 mr-1" size={16} />
              )}
              <span
                className={`font-medium ${
                  roomData.statusPembayaran === "Lunas"
                    ? "text-green-500"
                    : "text-orange-500"
                }`}
              >
                {roomData.statusPembayaran || "Belum Dibayar"}
              </span>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white rounded-lg py-4 mt-7 w-full text-lg font-bold hover:opacity-90 transition-opacity shadow-md"
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

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-white" size={24} />
          <h1 className="text-2xl text-white font-bold">Pembayaran Admin</h1>
        </div>
        <div className="bg-white rounded-xl p-5 mt-5 shadow-md border border-[#FFE180]">
          <p className="text-gray-700 mb-4">
            Tidak dapat melakukan pembayaran online? Hubungi admin untuk
            melakukan pembayaran langsung.
          </p>
          <button
            onClick={handleAdminPayment}
            className="w-full bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white rounded-lg py-4 font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            HUBUNGI ADMIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
