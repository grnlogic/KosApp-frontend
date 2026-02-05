import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";
import Commet from "../admin/Commet";

interface PaymentData {
  id: number;
  kamar: string;
  penghuni: string;
  nominal: string;
  status: string;
  tanggalJatuhTempo?: string;
  tanggalBayar?: string;
}

const RoomPembayaran: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Fetch payment data from backend
        const response = await fetch(
          "http://141.11.25.167:8080/api/pembayaran"
        );
        if (response.ok) {
          const data = await response.json();

          // Filter payments for this room
          const roomPayments = data.filter(
            (payment: any) =>
              payment.kamarId === parseInt(roomId || "0") ||
              payment.kamar === `Kamar ${roomId}` ||
              payment.kamar.includes(roomId || "")
          );

          // Transform data to match interface
          const transformedPayments = roomPayments.map((payment: any) => ({
            id: payment.id,
            kamar: payment.kamar,
            penghuni: payment.penghuni,
            nominal: `Rp ${payment.nominal?.toLocaleString("id-ID")}`,
            status: payment.status,
            tanggalJatuhTempo: payment.tanggalJatuhTempo,
            tanggalBayar: payment.tanggalBayar,
          }));

          setPayments(transformedPayments);

          // Set current payment (latest unpaid or latest)
          const unpaid = transformedPayments.find(
            (p: any) => p.status !== "Lunas"
          );
          setCurrentPayment(unpaid || transformedPayments[0] || null);
        } else {
          throw new Error("Failed to fetch payments");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        // Use dummy data for demo
        const dummyPayment: PaymentData = {
          id: 1,
          kamar: `Kamar ${roomId}`,
          penghuni: "Penghuni Kamar " + roomId,
          nominal: "Rp 1.500.000",
          status: "Belum Bayar",
          tanggalJatuhTempo: new Date().toISOString(),
        };
        setPayments([dummyPayment]);
        setCurrentPayment(dummyPayment);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [roomId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lunas":
        return "bg-green-100 text-green-800 border-green-300";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Lunas":
        return <CheckCircle className="w-5 h-5" />;
      case "Menunggu":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handlePayment = () => {
    alert(
      "Fitur pembayaran akan segera tersedia!\n\nAnda akan diarahkan ke halaman pembayaran."
    );
  };

  const handleDownloadInvoice = () => {
    alert("Invoice akan diunduh...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat data pembayaran..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="container mx-auto px-4 py-6 lg:py-8 pt-20 lg:pt-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 lg:p-8 mb-6 lg:mb-8 text-white">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="flex items-center text-white hover:text-yellow-100 mb-4 transition-all duration-300 hover:translate-x-1"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl flex-shrink-0">
              <CreditCard className="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Pembayaran
              </h1>
              <p className="text-yellow-50 text-sm lg:text-lg">
                Kelola tagihan dan riwayat pembayaran kost Anda
              </p>
            </div>
          </div>
        </div>

        {/* Current Payment Card */}
        {currentPayment && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
              <h2 className="text-white font-bold text-xl">Tagihan Aktif</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Payment Details */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 text-lg">
                        Detail Tagihan
                      </h3>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getStatusColor(
                          currentPayment.status
                        )}`}
                      >
                        {getStatusIcon(currentPayment.status)}
                        {currentPayment.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-yellow-200">
                        <span className="text-gray-600">Kamar</span>
                        <span className="font-semibold text-gray-800">
                          {currentPayment.kamar}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-yellow-200">
                        <span className="text-gray-600">Penghuni</span>
                        <span className="font-semibold text-gray-800">
                          {currentPayment.penghuni}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-yellow-200">
                        <span className="text-gray-600">Jatuh Tempo</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                          {formatDate(currentPayment.tanggalJatuhTempo)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600 text-lg">
                          Total Tagihan
                        </span>
                        <span className="font-bold text-3xl text-yellow-600">
                          {currentPayment.nominal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Informasi Pembayaran
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Bank:</strong> BCA / Mandiri / BNI
                      </p>
                      <p>
                        <strong>No. Rekening:</strong> 1234567890
                      </p>
                      <p>
                        <strong>Atas Nama:</strong> KosApp Management
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="space-y-4">
                  {currentPayment.status === "Belum Bayar" && (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-red-800 mb-2">
                            Perhatian!
                          </h4>
                          <p className="text-red-700 text-sm">
                            Tagihan Anda belum dibayar. Segera lakukan
                            pembayaran sebelum jatuh tempo untuk menghindari
                            denda keterlambatan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPayment.status === "Menunggu" && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-yellow-800 mb-2">
                            Menunggu Konfirmasi
                          </h4>
                          <p className="text-yellow-700 text-sm">
                            Pembayaran Anda sedang dalam proses verifikasi.
                            Mohon tunggu konfirmasi dari admin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPayment.status === "Lunas" && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-green-800 mb-2">
                            Pembayaran Lunas
                          </h4>
                          <p className="text-green-700 text-sm">
                            Terima kasih! Pembayaran Anda telah kami terima.
                          </p>
                          {currentPayment.tanggalBayar && (
                            <p className="text-green-600 text-xs mt-2">
                              Dibayar pada:{" "}
                              {formatDate(currentPayment.tanggalBayar)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {currentPayment.status !== "Lunas" && (
                      <button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-4 rounded-xl hover:from-yellow-500 hover:to-amber-600 font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
                      >
                        <CreditCard className="w-6 h-6" />
                        Bayar Sekarang
                      </button>
                    )}

                    <button
                      onClick={handleDownloadInvoice}
                      className="w-full bg-white border-2 border-yellow-400 text-yellow-600 py-4 rounded-xl hover:bg-yellow-50 font-bold shadow-md transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <Download className="w-6 h-6" />
                      Download Invoice
                    </button>
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-3">
                      Cara Pembayaran
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-yellow-600">1.</span>
                        <span>Transfer ke rekening yang tertera</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-yellow-600">2.</span>
                        <span>Simpan bukti transfer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-yellow-600">3.</span>
                        <span>Klik "Bayar Sekarang" untuk upload bukti</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-yellow-600">4.</span>
                        <span>Tunggu konfirmasi dari admin</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
            <h2 className="text-white font-bold text-xl">Riwayat Pembayaran</h2>
          </div>
          <div className="p-6">
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Belum ada riwayat pembayaran
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <CreditCard className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {payment.nominal}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(payment.tanggalJatuhTempo)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Help */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-3">Butuh Bantuan?</h3>
          <p className="text-yellow-50 mb-4">
            Jika ada pertanyaan seputar pembayaran, silakan hubungi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
              📞 Admin: 0812-xxxx-xxxx
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
              📧 finance@kosapp.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPembayaran;
