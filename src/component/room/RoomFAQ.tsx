import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import Commet from "../admin/Commet";

interface FAQItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

const RoomFAQ: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://141.11.25.167:8080/api/faqs");
        const data = await response.json();
        const formattedFaqs = data.map((faq: any) => ({
          id: faq.id,
          pertanyaan: faq.question,
          jawaban: faq.answer,
        }));
        setFaqs(formattedFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat FAQ..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="flex items-center text-white hover:text-yellow-100 mb-4 transition-colors"
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
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <HelpCircle className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Frequently Asked Questions
              </h1>
              <p className="text-yellow-50 text-lg">
                Temukan jawaban atas pertanyaan umum seputar kost
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ada FAQ yang ditemukan
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                      <HelpCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {faq.pertanyaan}
                      </h3>
                      {expandedId === faq.id && (
                        <p className="text-gray-600 mt-3 leading-relaxed">
                          {faq.jawaban}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Help */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-3">Masih ada pertanyaan?</h3>
          <p className="text-yellow-50 mb-4">
            Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk
            menghubungi kami
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              📞 0812-xxxx-xxxx
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              📧 info@kosapp.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFAQ;
