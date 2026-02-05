import React, { useEffect, useState, lazy, Suspense } from "react";
import { card } from "./App/Api/card";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BedDouble,
  Wifi,
  CheckCircle,
  CalendarRange,
  Check,
  Star,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Clock,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { authApi } from "../utils/apiUtils";

// Extend jsPDF type to include autoTable
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Add proper type definition for lastAutoTable property
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
      margin: any;
      settings: any;
      pageCount: number;
    };
  }
}

// Interface for room registration request
interface RoomRegistrationRequest {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  requestedRoomId: string | number;
  roomNumber: string;
  durasiSewa: number;
  tanggalMulai: string;
  metodePembayaran: string;
  totalPembayaran: number;
  timestamp: number;
  status: "pending";
}

interface DetailRoomProps {
  card: card;
  onClose: () => void;
}

const DetailRoom: React.FC<DetailRoomProps> = ({ card, onClose }) => {
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    idNumber: "",
    moveInDate: "",
    duration: "1", // Default is 1 month
    additionalNotes: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Helper function to format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Parse facilities into array and trim each item
  const facilitiesList = card.fasilitas
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // Lock body scroll when modal is open and detect mobile
  useEffect(() => {
    // Save the current body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";

    // Detect mobile device
    setIsMobile(
      window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
    );

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Additional side effect to hide navbar when modal is open
  useEffect(() => {
    // Get the navbar element - targeting the fixed header with gradient background
    const navbar = document.querySelector(
      '[class*="fixed top-0 w-full px-4 py"][class*="from-yellow-400 to-yellow-500"]'
    );

    if (navbar) {
      // Save original style to restore later
      const originalStyle = navbar.getAttribute("style") || "";

      // Hide navbar with higher specificty than existing styles
      navbar.setAttribute(
        "style",
        "opacity: 0 !important; pointer-events: none !important; transform: translateY(-100%) !important;"
      );

      // Add body class to prevent scrolling
      document.body.classList.add("overflow-hidden");

      // Restore navbar visibility and body scrolling when component unmounts
      return () => {
        navbar.setAttribute("style", originalStyle);
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Nama lengkap wajib diisi";
    if (!formData.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.trim()))
      newErrors.phone = "Format nomor telepon tidak valid";

    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Format email tidak valid";

    if (!formData.idNumber.trim()) newErrors.idNumber = "Nomor KTP wajib diisi";
    else if (!/^\d{16}$/.test(formData.idNumber.trim()))
      newErrors.idNumber = "Nomor KTP harus 16 digit";

    if (!formData.moveInDate.trim())
      newErrors.moveInDate = "Tanggal masuk wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Optimize PDF generation to be asynchronous
  const generatePDF = async () => {
    try {
      // Create jsPDF instance directly
      const doc = new jsPDF();

      // Add margin
      const margin = 20;
      let y = margin;

      // Header with logo-like styling
      doc.setFillColor(255, 193, 7); // Yellow color
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(
        "FORMULIR PENDAFTARAN SEWA",
        doc.internal.pageSize.width / 2,
        20,
        {
          align: "center",
        }
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("MIMIN KOST", doc.internal.pageSize.width / 2, 30, {
        align: "center",
      });

      // Add date and reference number
      y = 50;
      const today = new Date();
      const formattedDate = today.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Registration number in a box for better visibility
      doc.setFillColor(245, 245, 245);
      doc.rect(130, y - 5, 65, 15, "F");
      doc.rect(130, y - 5, 65, 15, "S");

      doc.setFontSize(10);
      doc.text(`Tanggal: ${formattedDate}`, 14, y);

      doc.setFont("helvetica", "bold");
      doc.text("NO REGISTRASI:", 132, y);
      doc.setFont("helvetica", "normal");
      const regNumber = `REG-${card.nomorKamar}-${today.getFullYear()}${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
      doc.text(regNumber, 132, y + 5);
      y += 20;

      // Personal Information in table format
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("DATA PENYEWA", margin, y);
      y += 10;

      // Create personal info table - use autoTable directly instead of doc.autoTable
      const personalData = [
        ["Nama Lengkap", ":", formData.fullName],
        ["Nomor Telepon", ":", formData.phone],
        ["Email", ":", formData.email],
        ["Nomor KTP", ":", formData.idNumber],
      ];

      autoTable(doc, {
        startY: y,
        body: personalData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "normal" },
          1: { cellWidth: 5, fontStyle: "normal" },
          2: { fontStyle: "normal" },
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      // Room Information in table format
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INFORMASI KAMAR", margin, y);
      y += 10;

      const roomData = [
        ["Nomor Kamar", ":", card.nomorKamar],
        ["Ukuran Kamar", ":", "3x4 meter"],
        ["Fasilitas", ":", card.fasilitas],
      ];

      autoTable(doc, {
        startY: y,
        body: roomData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "normal" },
          1: { cellWidth: 5, fontStyle: "normal" },
          2: { fontStyle: "normal" },
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      // Rental Info in table format
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INFORMASI SEWA", margin, y);
      y += 10;

      const rentalData = [
        ["Tanggal Masuk", ":", formData.moveInDate],
        ["Durasi Sewa", ":", `${formData.duration} bulan`],
      ];

      autoTable(doc, {
        startY: y,
        body: rentalData,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "normal" },
          1: { cellWidth: 5, fontStyle: "normal" },
          2: { fontStyle: "normal" },
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      // Payment Info with formal table
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RINCIAN PEMBAYARAN", margin, y);
      y += 10;

      const paymentHeaders = [["KETERANGAN", "HARGA", "JUMLAH", "TOTAL"]];
      const paymentData = [
        [
          `Sewa Kamar ${card.nomorKamar} (${formData.duration} bulan)`,
          `Rp ${formatPrice(card.hargaBulanan)}`,
          formData.duration,
          `Rp ${formatPrice(card.hargaBulanan * parseInt(formData.duration))}`,
        ],
        ["Biaya Administrasi", "Rp 20.000", "1", "Rp 20.000"],
      ];

      autoTable(doc, {
        startY: y,
        head: paymentHeaders,
        body: paymentData,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 4,
          halign: "left",
          valign: "middle",
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [255, 193, 7],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 35, halign: "right" },
          2: { cellWidth: 15, halign: "center" },
          3: { cellWidth: 35, halign: "right" },
        },
      });

      y = doc.lastAutoTable.finalY + 5;

      // Total with highlighted box
      const totalData = [
        [
          {
            content: "TOTAL PEMBAYARAN",
            colSpan: 3,
            styles: { fontStyle: "bold" as const },
          },
          {
            content: `Rp ${formatPrice(
              card.hargaBulanan * parseInt(formData.duration) + 20000
            )}`,
            styles: { fontStyle: "bold" as const },
          },
        ],
      ];

      autoTable(doc, {
        startY: y,
        body: totalData,
        theme: "grid",
        styles: {
          fontSize: 12,
          cellPadding: 4,
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 130, halign: "right" },
          1: { cellWidth: 35, halign: "right" }, // Changed from 3 to 1 to match actual column index
        },
      });

      // Ensure y is a valid number before using it in rect calls
      y = doc.lastAutoTable.finalY + 10;
      if (isNaN(y)) y = margin + 350; // Fallback value if y becomes NaN

      // Note
      if (formData.additionalNotes) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Catatan Tambahan:", margin, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(formData.additionalNotes, 170);
        doc.text(splitNotes, margin, y);
        y += splitNotes.length * 7 + 10;
      } else {
        y += 10;
      }

      // Terms and conditions in a box
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, 170, 25, "F");
      doc.rect(margin, y, 170, 25, "S");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Syarat dan Ketentuan:", margin + 5, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      const terms = [
        "1. Formulir ini harus dibawa saat check-in.",
        "2. Pembayaran harus dilakukan maksimal 2x24 jam setelah konfirmasi diterima.",
        "3. Deposit akan dikembalikan di akhir masa sewa jika tidak ada kerusakan.",
        "4. Penyewa wajib mematuhi seluruh aturan yang berlaku di MIMIN KOST.",
      ];

      let termsY = y + 15;
      terms.forEach((term) => {
        doc.text(term, margin + 5, termsY);
        termsY += 5;
      });

      y += 35;

      // Signature area with lines and boxes
      doc.setFontSize(11);
      doc.setFillColor(255, 255, 255);

      // Left signature box (tenant)
      doc.rect(margin, y, 70, 40, "S");
      doc.setFont("helvetica", "bold");
      doc.text("Penyewa", margin + 25, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text("Tanggal: ________________", margin + 5, y + 35);

      // Right signature box (management)
      doc.rect(margin + 100, y, 70, 40, "S");
      doc.setFont("helvetica", "bold");
      doc.text("Pengelola", margin + 125, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text("Tanggal: ________________", margin + 105, y + 35);

      // Names under signature boxes
      y += 45;
      doc.text(`( ${formData.fullName} )`, margin + 20, y);
      doc.text("( Admin MIMIN KOST )", margin + 118, y);

      // Footer
      doc.setFillColor(255, 193, 7);
      doc.rect(
        0,
        doc.internal.pageSize.height - 20,
        doc.internal.pageSize.width,
        20,
        "F"
      );
      doc.setFontSize(10);
      doc.text(
        "Formulir ini merupakan bukti pendaftaran sewa kamar kos dan wajib dibawa saat check-in.",
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );

      // Page numbers
      doc.setFontSize(8);
      doc.text(
        `Halaman 1 dari 1 | Dicetak pada: ${formattedDate}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 25,
        { align: "right" }
      );

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Function to download PDF
  const downloadPDF = async () => {
    try {
      const doc = await generatePDF();
      const pdfName = `Formulir_Sewa_Kamar_${
        card.nomorKamar
      }_${formData.fullName.replace(/\s+/g, "_")}.pdf`;
      doc.save(pdfName);
      return pdfName;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Swal.fire({
        title: "Gagal Mengunduh PDF",
        text: "Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#000",
      });
      throw error;
    }
  };

  // Function to download PDF and open WhatsApp
  const downloadPDFAndSendWhatsApp = async () => {
    try {
      // First download the PDF
      const pdfName = await downloadPDF();

      // Then open WhatsApp with a modified message that instructs to attach the PDF
      const phoneNumber = "62895352281010"; // WhatsApp number without the + sign

      // Construct the message with instructions about attaching the PDF
      let message = `*PENGAJUAN SEWA KAMAR KOS*\n\n`;
      message += `*Informasi Kamar:*\n`;
      message += `- Nomor Kamar: ${card.nomorKamar}\n`;
      message += `- Harga: Rp ${formatPrice(card.hargaBulanan)}/bulan\n\n`;

      message += `*Data Penyewa:*\n`;
      message += `- Nama: ${formData.fullName}\n`;
      message += `- No. Telepon: ${formData.phone}\n`;
      message += `- Email: ${formData.email}\n`;
      message += `- No. KTP: ${formData.idNumber}\n\n`;

      message += `*Informasi Sewa:*\n`;
      message += `- Tanggal masuk: ${formData.moveInDate}\n`;
      message += `- Durasi sewa: ${formData.duration} bulan\n`;
      message += `- Total pembayaran awal: Rp ${formatPrice(
        card.hargaBulanan * parseInt(formData.duration) + 20000
      )}\n\n`;

      if (formData.additionalNotes) {
        message += `*Catatan:*\n${formData.additionalNotes}\n\n`;
      }

      message += `*PENTING: Saya telah mengunduh formulir pendaftaran dengan nama file "${pdfName}". Saya akan melampirkan file PDF tersebut dalam chat ini.*\n\n`;
      message += `Terima kasih telah mengajukan penyewaan kamar di MIMIN KOST.`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);

      // Open WhatsApp in a new tab
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank"
      );

      // Show tooltip to remind about attaching the PDF
      Swal.fire({
        title: "PDF Berhasil Diunduh!",
        html: `Silakan <b>lampirkan file PDF</b> yang baru saja diunduh ke chat WhatsApp.<br><br>Nama file: <b>${pdfName}</b>`,
        icon: "info",
        confirmButtonColor: "#000",
      });
    } catch (error) {
      console.error("Error in downloadPDFAndSendWhatsApp:", error);
      // Show fallback option if PDF fails
      openWhatsApp();
    }
  };

  // Function to open WhatsApp with form data
  const openWhatsApp = () => {
    const phoneNumber = "62895352281010"; // WhatsApp number without the + sign

    // Construct the message
    let message = `*PENGAJUAN SEWA KAMAR KOS*\n\n`;
    message += `*Informasi Kamar:*\n`;
    message += `- Nomor Kamar: ${card.nomorKamar}\n`;
    message += `- Harga: Rp ${formatPrice(card.hargaBulanan)}/bulan\n\n`;

    message += `*Data Penyewa:*\n`;
    message += `- Nama: ${formData.fullName}\n`;
    message += `- No. Telepon: ${formData.phone}\n`;
    message += `- Email: ${formData.email}\n`;
    message += `- No. KTP: ${formData.idNumber}\n\n`;

    message += `*Informasi Sewa:*\n`;
    message += `- Tanggal masuk: ${formData.moveInDate}\n`;
    message += `- Durasi sewa: ${formData.duration} bulan\n`;
    message += `- Total pembayaran awal: Rp ${formatPrice(
      card.hargaBulanan * (parseInt(formData.duration) + 1)
    )}\n\n`;

    if (formData.additionalNotes) {
      message += `*Catatan:*\n${formData.additionalNotes}\n\n`;
    }

    message += `Terima kasih telah mengajukan penyewaan kamar di MIMIN KOST.`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp in a new tab
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // Optimize form submission to be non-blocking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // 1. Cek dulu apakah user dengan nomor telepon atau email tersebut ada di sistem
        let userVerified = false;
        let verifiedUserId = null;

        try {
          // Gunakan endpoint users untuk mencari user berdasarkan nomor telepon atau email
          const usersResponse = await authApi.get("/users");
          const users = usersResponse.data || [];



          // Cari user dengan nomor telepon atau email yang sesuai
          const matchingUser = users.find(
            (user: { phone_number: any; email: string }) => {
              // Normalisasi nomor telepon (menghilangkan +62, 62, atau 0 di depan)
              const normalizedDBPhone = (user.phone_number || "").replace(
                /^(\+62|62|0)/,
                ""
              );
              const normalizedInputPhone = formData.phone.replace(
                /^(\+62|62|0)/,
                ""
              );

              // Pencocokan berdasarkan nomor telepon ATAU email
              const phoneMatch = normalizedDBPhone === normalizedInputPhone;
              const emailMatch =
                user.email &&
                user.email.toLowerCase() === formData.email.toLowerCase();

              // Log untuk debugging
                // Match found, no logging needed for production

              return phoneMatch || emailMatch;
            }
          );

          if (matchingUser) {
            userVerified = true;
            verifiedUserId = matchingUser.id;
          } else {

          }
        } catch (verifyError) {
          console.warn("Gagal memverifikasi data pengguna:", verifyError);
        }

        // 2. Jika user tidak terverifikasi, tampilkan pesan
        if (!userVerified || !verifiedUserId) {
          Swal.fire({
            icon: "warning",
            title: "Verifikasi Gagal",
            text: "Nomor telepon atau email tidak cocok dengan data yang terdaftar. Pastikan Anda menggunakan nomor telepon dan email yang sama seperti saat pendaftaran.",
            confirmButtonText: "Kirim dengan WhatsApp",
            showCancelButton: true,
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              // Jika user memilih kirim via WhatsApp saja
              openWhatsApp();
            }
          });
          setIsSubmitting(false);
          return;
        }

        // 3. Jika user terverifikasi, kirimkan pendaftaran sebagai pending request untuk di-review admin
        const requestData = {
          userId: verifiedUserId,
          roomId: card.id,
          durasiSewa: parseInt(formData.duration),
          tanggalMulai: formData.moveInDate,
          metodePembayaran: "transfer",
          status: "pending", // Tambahkan status pending secara eksplisit
        };

        // Gunakan endpoint yang lebih tepat untuk permintaan yang memerlukan review admin
        const response = await authApi.post(
          `/room-requests/request?userId=${verifiedUserId}`, // Gunakan endpoint khusus untuk permintaan pending
          requestData
        );


        // Simpan data tambahan untuk UI/notifikasi lokal
        try {
          // Simpan data lengkap untuk notifikasi lokal
          const fullRequestData = {
            id: `req-${Date.now()}`,
            userId: verifiedUserId,
            username: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phone,
            requestedRoomId: card.id.toString(),
            roomNumber: card.nomorKamar,
            durasiSewa: parseInt(formData.duration),
            tanggalMulai: formData.moveInDate,
            metodePembayaran: "transfer",
            totalPembayaran:
              card.hargaBulanan * (parseInt(formData.duration) + 1),
            timestamp: Date.now(),
            status: "pending",
          };

          const existingRequests = JSON.parse(
            localStorage.getItem("pendingRoomRequests") || "[]"
          );

          existingRequests.push(fullRequestData);

          localStorage.setItem(
            "pendingRoomRequests",
            JSON.stringify(existingRequests)
          );


        } catch (storageError) {
          console.error(
            "Gagal menyimpan data tambahan ke localStorage:",
            storageError
          );
        }

        // 4. Tampilkan pesan sukses yang menjelaskan bahwa permintaan menunggu persetujuan admin
        Swal.fire({
          title: "Permintaan Terkirim!",
          text: `Permintaan penyewaan kamar ${card.nomorKamar} berhasil dikirim. Admin akan mereview permintaan Anda, mohon tunggu konfirmasi selanjutnya.`,
          icon: "success",
          confirmButtonColor: "#000",
        });

        setShowSuccess(true);
      } catch (error) {
        console.error("Error sending room request:", error);

        // Enhance error handling to include PDF options
        Swal.fire({
          title: "Gagal Mengirim Permintaan",
          text: "Terjadi kesalahan saat mengirim permintaan sewa. Silakan coba lagi atau gunakan PDF dan WhatsApp.",
          icon: "error",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Coba Lagi",
          denyButtonText: "PDF & WhatsApp",
          cancelButtonText: "Batal",
        }).then((result) => {
          if (result.isDenied) {
            downloadPDFAndSendWhatsApp();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Do nothing, just close the dialog
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const openRentalForm = () => {
    setShowRentalForm(true);
  };

  // Enhance the return section for better mobile display
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[150]" // Increased z-index to ensure it's above everything
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-2 md:my-4"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={
          isMobile
            ? { type: "tween", duration: 0.2 }
            : { type: "spring", damping: 25, stiffness: 300 }
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - more visible on mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-white/90 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
        >
          <X size={22} className="text-gray-700" />
        </button>

        {/* Image section with gradient overlay - shorter on mobile */}
        <div className="relative h-56 md:h-80 w-full">
          <img
            src={card.image}
            alt={`Kamar ${card.nomorKamar}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  card.status === "kosong"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {card.status === "kosong" ? "Tersedia" : "Tidak Tersedia"}
              </span>
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                Kamar {card.nomorKamar}
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-sm">
              {card.title || `Kamar ${card.nomorKamar}`}
            </h1>
          </div>
        </div>

        {/* Content section - improve scrolling on mobile */}
        <div className="overflow-y-auto max-h-[calc(90vh-14rem)] md:max-h-[calc(90vh-20rem)]">
          <div className="p-4 md:p-6">
            {/* Price banner - more compact on mobile */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 md:p-4 rounded-xl mb-4 md:mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm font-medium opacity-90">
                  Harga Bulanan
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  Rp {formatPrice(card.hargaBulanan)}
                </p>
              </div>
              {card.status === "kosong" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-yellow-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-md hover:bg-yellow-50 transition-colors text-sm md:text-base"
                  onClick={openRentalForm}
                >
                  Sewa Sekarang
                </motion.button>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3">
                <BedDouble className="text-yellow-600" />
                Deskripsi Kamar
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {card.description || card.fasilitas}
              </p>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3">
                <Wifi className="text-yellow-600" />
                Fasilitas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {facilitiesList.map((facility, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check
                      size={18}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3">
                <CalendarRange className="text-yellow-600" />
                Informasi Tambahan
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Biaya Administrasi</span>
                  <span className="font-medium text-gray-800">Rp 20.000</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Minimal Sewa</span>
                  <span className="font-medium text-gray-800">1 Bulan</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Tanggal Tersedia</span>
                  <span className="font-medium text-gray-800">Sekarang</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ukuran Kamar</span>
                  <span className="font-medium text-gray-800">3x4 meter</span>
                </div>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3">
                <Star className="text-yellow-600" />
                Rating & Ulasan
              </h2>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={20}
                    className={
                      idx < 4
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-700 font-medium">4.0</span>
                <span className="text-gray-500 text-sm">(12 ulasan)</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="italic text-gray-700 text-sm">
                  "Kamar yang nyaman dan bersih. Fasilitas lengkap dan lokasi
                  strategis."
                </p>
                <p className="text-right text-gray-500 text-xs mt-2">
                  - Penghuni Sebelumnya
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action - more compact on mobile */}
        <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <p className="text-xs md:text-sm text-gray-500">Ada pertanyaan?</p>
            <p className="text-yellow-600 font-medium text-sm md:text-base">
              Hubungi kami
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: isMobile ? 1.0 : 1.05 }}
              whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
              onClick={onClose}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Tutup
            </motion.button>
            {card.status === "kosong" && (
              <motion.button
                whileHover={{ scale: isMobile ? 1.0 : 1.05 }}
                whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-colors text-sm md:text-base"
                onClick={openRentalForm}
              >
                Sewa Sekarang
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Rental Application Form Modal */}
      <AnimatePresence>
        {showRentalForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isMobile ? 0.2 : 0.3 }}
            onClick={() => setShowRentalForm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={
                isMobile
                  ? { type: "tween", duration: 0.2 }
                  : { type: "spring", damping: 25, stiffness: 300 }
              }
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowRentalForm(false)}
                className="absolute top-4 right-4 z-30 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5 text-white"
              >
                <X size={24} />
              </button>

              {/* Form Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  Form Penyewaan Kamar
                </h2>
                <p className="opacity-90">
                  Kamar {card.nomorKamar} - Rp {formatPrice(card.hargaBulanan)}
                  /bulan
                </p>
              </div>

              {/* Success Message */}
              {showSuccess ? (
                <div className="p-6 md:p-10 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Pengajuan Berhasil Dikirim!
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Kami akan menghubungi Anda secepatnya untuk konfirmasi
                    penyewaan. Pengajuan Anda telah masuk ke sistem dan menunggu
                    persetujuan admin.
                  </p>

                  <div className="flex flex-col md:flex-row gap-3 w-full max-w-md">
                    <motion.button
                      whileHover={{ scale: isMobile ? 1.0 : 1.05 }}
                      whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
                      onClick={downloadPDF}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      <span>Unduh Formulir PDF</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: isMobile ? 1.0 : 1.05 }}
                      whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
                      onClick={downloadPDFAndSendWhatsApp}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      <span>Kirim via WhatsApp</span>
                    </motion.button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Anda dapat mengunduh formulir PDF sebagai bukti pendaftaran
                    dan mengirimkannya melalui WhatsApp untuk koordinasi lebih
                    lanjut.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]"
                >
                  {/* Security Banner */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-blue-600"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">
                        Data Anda Aman Bersama Kami
                      </h3>
                      <p className="text-sm text-blue-700">
                        Seluruh informasi yang Anda berikan terenkripsi
                        end-to-end dan tidak akan dibagikan kepada pihak ketiga.
                        Kami menghargai privasi Anda.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Full name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                      >
                        <User size={16} />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 rounded-lg border ${
                          errors.fullName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-yellow-500"
                        } focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors`}
                        placeholder="Masukkan nama lengkap sesuai KTP"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Phone number */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                      >
                        <Phone size={16} />
                        Nomor WhatsApp Aktif
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 rounded-lg border ${
                          errors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-yellow-500"
                        } focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors`}
                        placeholder="Contoh: 081234567890"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                    >
                      <Mail size={16} />
                      Alamat Email Aktif
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 rounded-lg border ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-yellow-500"
                      } focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors`}
                      placeholder="Email untuk konfirmasi dan informasi penting"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div className="mb-4">
                    <label
                      htmlFor="idNumber"
                      className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                    >
                      <CreditCard size={16} />
                      Nomor KTP
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 rounded-lg border ${
                        errors.idNumber
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-yellow-500"
                      } focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors`}
                      placeholder="Masukkan 16 digit nomor KTP"
                      maxLength={16}
                    />
                    {errors.idNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.idNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Move-in Date */}
                    <div>
                      <label
                        htmlFor="moveInDate"
                        className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                      >
                        <Calendar size={16} />
                        Tanggal Rencana Check-in
                      </label>
                      <input
                        type="date"
                        id="moveInDate"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]} // Today or later
                        className={`w-full p-2.5 rounded-lg border ${
                          errors.moveInDate
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-yellow-500"
                        } focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors`}
                      />
                      {errors.moveInDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.moveInDate}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                      >
                        <Clock size={16} />
                        Durasi Sewa
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors"
                      >
                        <option value="1">1 bulan</option>
                        <option value="3">3 bulan</option>
                        <option value="6">6 bulan</option>
                        <option value="12">12 bulan</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="mb-6">
                    <label
                      htmlFor="additionalNotes"
                      className="block text-gray-700 font-medium mb-1 flex items-center gap-1"
                    >
                      <FileText size={16} />
                      Catatan Tambahan (opsional)
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors"
                      placeholder="Informasi tambahan atau pertanyaan untuk pengelola kos"
                      rows={3}
                    ></textarea>
                  </div>

                  {/* Summary and Total Price */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2">
                      Ringkasan Pembayaran
                    </h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Biaya Sewa ({formData.duration} bulan)
                        </span>
                        <span className="font-medium">
                          Rp{" "}
                          {formatPrice(
                            card.hargaBulanan * parseInt(formData.duration)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Biaya Administrasi
                        </span>
                        <span className="font-medium">Rp 20.000</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                        <span>Total Pembayaran Awal</span>
                        <span className="text-yellow-600">
                          Rp{" "}
                          {formatPrice(
                            card.hargaBulanan * parseInt(formData.duration) +
                              20000
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      *Pembayaran dilakukan setelah aplikasi Anda disetujui oleh
                      pengelola
                    </p>
                  </div>

                  {/* Privacy Reminder */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Dengan mengirim formulir ini, Anda menyetujui bahwa data
                      Anda akan diproses sesuai dengan kebijakan privasi kami.
                      Komunikasi melalui WhatsApp terenkripsi end-to-end demi
                      keamanan data Anda.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-colors flex items-center justify-center gap-2"
                    whileHover={isMobile ? {} : { scale: 1.02 }}
                    whileTap={isMobile ? {} : { scale: 0.98 }}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Kirim Pengajuan Sewa & Pendaftaran</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DetailRoom;
async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await axios.get("/api/health-check");
    return response.status === 200;
  } catch {
    return false;
  }
}

const getUserIdFromCookieOrStorage = () => {
  // Coba dari localStorage
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.id) {
        return userData.id.toString();
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  // Jika tidak berhasil, TIDAK menggunakan ID default
  // tapi kembalikan null untuk menandakan belum login
  return null;
};
