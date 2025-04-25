"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  id: number;
  pertanyaan?: string;
  jawaban?: string;
  question?: string;
  answer?: string;
}

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetch("https://manage-kost-production.up.railway.app/api/faqs")
      .then((response) => response.json())
      .then((data) => {
        setFaqs(data);
      })
      .catch((error) => console.error("Error fetching FAQs:", error));
  }, []);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF8E7]">
      {/* Header */}
      <div className="bg-[#FFCC00] m-4 p-4 rounded-xl shadow-md">
        <h2 className="text-white text-2xl font-bold text-center">FAQ</h2>
        <p className="text-white text-center">
          Pertanyaan yang Sering Ditanyakan
        </p>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {faqs.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada pertanyaan yang tersedia.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id || index} // Ensure a unique key
              className="rounded-xl shadow-md mb-3 overflow-hidden"
            >
              {/* Pertanyaan */}
              <div
                className="bg-[#FFCC00] p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-medium text-white">
                  {faq.question || faq.pertanyaan}
                </h3>
                {expandedIndex === index ? (
                  <ChevronUp className="text-white" size={20} />
                ) : (
                  <ChevronDown className="text-white" size={20} />
                )}
              </div>

              {/* Jawaban */}
              {expandedIndex === index && (
                <div className="bg-white p-4 border-t border-yellow-200">
                  <p className="text-gray-700">{faq.answer || faq.jawaban}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#FFCC00] p-4 m-4 rounded-xl shadow-md text-center">
        <p className="text-white">Hubungi Pengelola</p>
      </div>
    </div>
  );
}
