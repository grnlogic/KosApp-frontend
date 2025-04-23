import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Search,
  HelpCircle,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

interface FAQItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FAQItem | null>(null);
  const [editedPertanyaan, setEditedPertanyaan] = useState("");
  const [editedJawaban, setEditedJawaban] = useState("");
  const [newPertanyaan, setNewPertanyaan] = useState("");
  const [newJawaban, setNewJawaban] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/faqs");
      // Pastikan properti yang diterima sesuai dengan struktur FAQItem
      const formattedFaqs = response.data.map((faq: any) => ({
        id: faq.id,
        pertanyaan: faq.question,
        jawaban: faq.answer,
      }));
      setFaqs(formattedFaqs);
      updateLastModified();
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setCurrentFaq(faq);
    setEditedPertanyaan(faq.pertanyaan);
    setEditedJawaban(faq.jawaban);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (faq: FAQItem) => {
    setCurrentFaq(faq);
    setIsDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setNewPertanyaan("");
    setNewJawaban("");
    setIsAddDialogOpen(true);
  };

  const saveEdit = async () => {
    if (!currentFaq) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/faqs/${currentFaq.id}`,
        {
          pertanyaan: editedPertanyaan,
          jawaban: editedJawaban,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Berhasil!",
          text: "FAQ berhasil diperbarui!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui FAQ.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      fetchFaqs();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui FAQ.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const saveNewFaq = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/faqs", {
        pertanyaan: newPertanyaan,
        jawaban: newJawaban,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Berhasil!",
          text: "FAQ berhasil ditambahkan!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menambahkan FAQ.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      fetchFaqs();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding FAQ:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan FAQ.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const confirmDelete = async (faq: FAQItem) => {
    if (!faq.id || isNaN(faq.id)) {
      console.error("ID FAQ tidak valid:", faq.id);
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "FAQ ini akan dihapus dan tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/faqs/${faq.id}`);
          Swal.fire("Berhasil!", "FAQ berhasil dihapus!", "success");
          fetchFaqs();
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus FAQ.", "error");
        }
      }
    });
  };

  const updateLastModified = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("id-ID", { month: "short" });
    const year = now.getFullYear();
    setLastUpdated(`${day} ${month} ${year}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola pertanyaan umum untuk penghuni kos
          </p>
        </div>

        {/* Search & Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Cari FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center sm:justify-start"
            onClick={handleAdd}
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah FAQ
          </button>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq: FAQItem) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                        <HelpCircle className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {faq.pertanyaan}
                      </h3>
                      <p className="text-gray-600 mt-2">{faq.jawaban}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded-full"
                      onClick={() => handleEdit(faq)}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-full"
                      onClick={() => handleDelete(faq)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 px-6 py-4">
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Total FAQ: {faqs.length}
            </div>
            <div>Terakhir diperbarui: {lastUpdated}</div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit FAQ</h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="pertanyaan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pertanyaan
                </label>
                <input
                  id="pertanyaan"
                  value={editedPertanyaan}
                  onChange={(e) => setEditedPertanyaan(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Masukkan pertanyaan"
                />
              </div>
              <div>
                <label
                  htmlFor="jawaban"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jawaban
                </label>
                <textarea
                  id="jawaban"
                  value={editedJawaban}
                  onChange={(e) => setEditedJawaban(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Masukkan jawaban"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                onClick={saveEdit}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Tambah FAQ</h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setIsAddDialogOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="newPertanyaan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pertanyaan
                </label>
                <input
                  id="newPertanyaan"
                  value={newPertanyaan}
                  onChange={(e) => setNewPertanyaan(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Masukkan pertanyaan"
                />
              </div>
              <div>
                <label
                  htmlFor="newJawaban"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jawaban
                </label>
                <textarea
                  id="newJawaban"
                  value={newJawaban}
                  onChange={(e) => setNewJawaban(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Masukkan jawaban"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                onClick={saveNewFaq}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-center text-gray-800">
                Hapus FAQ
              </h2>
              <p className="mt-2 text-center text-gray-600">
                Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={() => confirmDelete(currentFaq!)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
