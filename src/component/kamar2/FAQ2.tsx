"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Home, User, LogOut } from "lucide-react";

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Bagaimana cara melakukan pembayaran sewa kost?",
      answer:
        "Pembayaran sewa kost dapat dilakukan melalui menu 'Pembayaran' di aplikasi. Kami menerima pembayaran via transfer bank, e-wallet, atau tunai langsung ke pengelola.",
    },
    {
      question: "Kapan batas waktu pembayaran sewa bulanan?",
      answer:
        "Batas waktu pembayaran sewa adalah tanggal 5 setiap bulannya. Keterlambatan akan dikenakan denda sesuai dengan ketentuan yang berlaku.",
    },
    {
      question: "Bagaimana cara melaporkan kerusakan fasilitas kamar?",
      answer:
        "Anda dapat melaporkan kerusakan melalui menu 'Info Kamar' dengan mengklik tombol 'Laporkan Masalah'. Tim kami akan merespon dalam waktu 1x24 jam.",
    },
    {
      question: "Apakah saya bisa mengajukan perpanjangan masa sewa?",
      answer:
        "Ya, Anda dapat mengajukan perpanjangan masa sewa melalui aplikasi minimal 1 bulan sebelum masa sewa berakhir. Klik menu 'Info Kamar' dan pilih opsi 'Perpanjang Sewa'.",
    },
    {
      question: "Bagaimana jadwal pembersihan area umum kost?",
      answer:
        "Jadwal pembersihan area umum dapat dilihat di menu 'Jadwal Kebersihan'. Pembersihan dilakukan 3 kali seminggu yaitu Senin, Rabu, dan Jumat.",
    },
    {
      question: "Apakah tamu diperbolehkan menginap?",
      answer:
        "Tamu diperbolehkan berkunjung pada jam 08.00-21.00. Untuk menginap, diperlukan izin dari pengelola dan biaya tambahan sesuai ketentuan.",
    },
    {
      question: "Bagaimana cara menggunakan fasilitas laundry?",
      answer:
        "Fasilitas laundry tersedia setiap hari. Anda dapat menaruh pakaian kotor di tempat yang disediakan sebelum jam 09.00 dan akan dikembalikan H+1.",
    },
    {
      question: "Apa yang harus dilakukan jika lupa password aplikasi?",
      answer:
        "Jika lupa password, klik 'Lupa Password' pada halaman login. Kami akan mengirimkan link reset password ke email terdaftar Anda.",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#FFF8E7]">
      {/* Header */}
      {/* ...existing code... */}

      {/* Welcome Card */}
      <div className="bg-[#FFCC00] m-4 p-4 rounded-xl shadow-md">
        <h2 className="text-white text-2xl font-bold text-center">FAQ</h2>
        <p className="text-white text-center">
          Pertanyaan yang Sering Ditanyakan
        </p>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <p className="text-gray-600 mb-4">
            Berikut adalah jawaban untuk pertanyaan yang sering ditanyakan. Jika
            Anda memiliki pertanyaan lain, silakan hubungi pengelola kost.
          </p>
        </div>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#FFCC00] rounded-xl shadow-md mb-3 overflow-hidden"
          >
            <div
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-medium text-white">{faq.question}</h3>
              {expandedIndex === index ? (
                <ChevronUp className="text-white" size={20} />
              ) : (
                <ChevronDown className="text-white" size={20} />
              )}
            </div>
            {expandedIndex === index && (
              <div className="bg-white p-4 border-t border-yellow-200">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#FFCC00] p-4 m-4 rounded-xl shadow-md text-center">
        <p className="text-white">Hubungi Pengelola</p>
      </div>
    </div>
  );
}
