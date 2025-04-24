import BackButtonOrange from "../image/chevron-right.svg";
import React, { useState, useEffect } from "react";
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

  // Fetch room data for kamar 2
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://manage-kost-production.up.railway.app/api/kamar/2"
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
        `<p>Silahkan <a href="${whatsappLink}" target="_blank" style="color: #FEBF00; font-weight: bold; text-decoration: underline;">klik disini</a> untuk menghubungi admin via WhatsApp</p>`,
      icon: "info",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#FEBF00",
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
      <div className="container mx-auto bg-[#FEBF00] rounded-md p-5 mb-9">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-extrabold text-2xl">Jadwal Anda</h3>
        </div>
        <div className="flex flex-col items-start bg-white rounded-md p-5 mt-4">
          <div className="flex justify-between w-full">
            <h1 className="text-1xl text-black font-medium">Total Tagihan</h1>
            <span className="text-1xl text-[black] font-medium">
              Rp {roomData.hargaBulanan?.toLocaleString("id-ID") || "0"}
            </span>
          </div>
          <div className="flex justify-between w-full mt-7">
            <h1 className="text-1xl text-black font-medium">Status</h1>
            <span className="text-1xl text-black font-medium">
              {roomData.statusPembayaran || "Belum Dibayar"}
            </span>
          </div>
          <button
            className="bg-[#FEBF00] text-white rounded-lg py-4 mt-7 w-full text-lg font-bold"
            onClick={handlePayment}
            disabled={
              isPaymentProcessing || roomData.statusPembayaran === "Lunas"
            }
          >
            {isPaymentProcessing
              ? "MEMPROSES..."
              : roomData.statusPembayaran === "Lunas"
              ? "SUDAH DIBAYAR"
              : "BAYAR SEKARANG"}
          </button>
        </div>
      </div>

      <div className="bg-[#FEBF00] rounded-md p-5 mt-4">
        <div className="">
          <h1 className="text-2xl text-white font-extrabold mb-7 mt-3">
            Pembayaran Admin
          </h1>
        </div>
        <div className="bg-white rounded-md p-5">
          <p className="text-black font-medium mb-4">
            Tidak dapat melakukan pembayaran online? Hubungi admin untuk
            melakukan pembayaran langsung.
          </p>
          <button
            onClick={handleAdminPayment}
            className="w-full bg-[#FEBF00] text-white rounded-lg py-4 font-bold"
          >
            HUBUNGI ADMIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
