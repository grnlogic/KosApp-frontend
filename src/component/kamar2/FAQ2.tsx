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
    fetch("http://localhost:8080/api/faqs")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched FAQs:", data);
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
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] m-4 p-5 rounded-2xl shadow-lg">
        <h2 className="text-white text-2xl font-bold text-center">FAQ</h2>
        <p className="text-white text-center text-opacity-90">
          Pertanyaan yang Sering Ditanyakan
        </p>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl shadow-md">
            <ChevronDown className="mx-auto w-12 h-12 text-[#FFCC00]/50 mb-3" />
            <p className="text-gray-500">Tidak ada pertanyaan yang tersedia.</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="rounded-xl shadow-md overflow-hidden border border-[#FFCC00]/20 transition-all duration-200"
              style={{
                transform: expandedIndex === index ? "scale(1.02)" : "scale(1)",
              }}
            >
              {/* Pertanyaan */}
              <div
                className={`bg-gradient-to-r ${
                  expandedIndex === index
                    ? "from-[#FF9500] to-[#FFCC00]"
                    : "from-[#FFCC00] to-[#FF9500]"
                } p-4 flex justify-between items-center cursor-pointer transition-colors duration-300`}
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-medium text-white">
                  {faq.pertanyaan || faq.question}
                </h3>
                {expandedIndex === index ? (
                  <ChevronUp className="text-white w-5 h-5" />
                ) : (
                  <ChevronDown className="text-white w-5 h-5" />
                )}
              </div>

              {/* Jawaban */}
              {expandedIndex === index && (
                <div className="bg-white p-5 border-t border-yellow-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.jawaban || faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] p-5 m-4 rounded-2xl shadow-lg">
        <a
          href="#"
          className="block text-white text-center font-medium hover:underline"
        >
          Hubungi Pengelola
        </a>
      </div>
    </div>
  );
}
