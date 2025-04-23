"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/faqs")
      .then((response) => response.json())
      .then((data) => {
        setFaqs(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setIsLoading(false);
      });
  }, []);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col bg-[#FFF8E7] rounded-xl overflow-hidden shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] p-6 shadow-md">
        <div className="flex items-center space-x-3">
          <HelpCircle className="text-white" size={24} />
          <h2 className="text-white text-2xl font-bold">FAQ</h2>
        </div>
        <p className="text-white/90 mt-2">Pertanyaan yang Sering Ditanyakan</p>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-auto p-5 bg-white">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-xl mb-2"></div>
                <div className="h-20 bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-4">
              <HelpCircle className="text-gray-300" size={48} />
            </div>
            <p>Tidak ada pertanyaan yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-[#FFE180] transition-colors"
              >
                {/* Question */}
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer ${
                    expandedIndex === index
                      ? "bg-gradient-to-r from-[#FFCC00] to-[#FF9900]"
                      : "bg-[#FFF8E7]"
                  } transition-colors duration-300`}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3
                    className={`font-medium ${
                      expandedIndex === index ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {faq.question || faq.pertanyaan}
                  </h3>
                  {expandedIndex === index ? (
                    <ChevronUp
                      className={`${
                        expandedIndex === index
                          ? "text-white"
                          : "text-[#FF9900]"
                      }`}
                      size={20}
                    />
                  ) : (
                    <ChevronDown className="text-[#FF9900]" size={20} />
                  )}
                </div>

                {/* Answer */}
                {expandedIndex === index && (
                  <div className="bg-white p-5 border-t border-[#FFE180]">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer || faq.jawaban}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] p-4 shadow-md">
        <button className="w-full bg-white rounded-xl py-3 px-4 text-[#FF9900] font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">
          <MessageCircle className="mr-2" size={18} />
          <span>Hubungi Pengelola</span>
        </button>
      </div>
    </div>
  );
}
