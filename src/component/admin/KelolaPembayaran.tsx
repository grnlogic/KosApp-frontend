import React, { useState } from "react";
import {
  Check,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
  CreditCard,
  DollarSign,
  Calendar,
} from "lucide-react";
import { JSX } from "react/jsx-runtime";

export default function KelolaPembayaran() {
  const [pembayaran, setPembayaran] = useState([
    {
      id: 1,
      kamar: "A-101",
      penghuni: "John Doe",
      tanggal: "1 Mar 2024",
      nominal: "Rp 1.500.000",
      status: "Lunas",
    },
    {
      id: 2,
      kamar: "A-102",
      penghuni: "Jane Smith",
      tanggal: "5 Mar 2024",
      nominal: "Rp 1.200.000",
      status: "Belum Bayar",
    },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    kamar: "",
    penghuni: "",
    tanggal: "",
    totalTagihan: "",
    jatuhTempo: "",
    status: "Belum Bayar",
  });

  const resetForm = () => {
    setSelectedId(null);
    setFormData({
      kamar: "",
      penghuni: "",
      tanggal: "",
      totalTagihan: "",
      jatuhTempo: "",
      status: "Belum Bayar",
    });
    setShowForm(true); // Tampilkan form saat tombol ditekan
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    const data = pembayaran.find((item) => item.id === id);
    if (data) {
      setFormData({
        kamar: data.kamar,
        penghuni: data.penghuni,
        tanggal: data.tanggal,
        totalTagihan: data.nominal.replace("Rp ", "").replace(/\./g, ""),
        jatuhTempo: "2025-01-25", // dummy value
        status: data.status,
      });
    }
    setShowForm(true); // Tampilkan form juga saat mengedit
  };

  const handleDelete = (id: number) => {
    setPembayaran(pembayaran.filter((item) => item.id !== id));
    if (selectedId === id) {
      resetForm();
      setShowForm(false);
    }
  };

  const handleSave = () => {
    const formattedNominal = `Rp ${Number(formData.totalTagihan).toLocaleString(
      "id-ID"
    )}`;

    if (selectedId) {
      // Update existing
      setPembayaran(
        pembayaran.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                kamar: formData.kamar,
                penghuni: formData.penghuni,
                tanggal: formData.tanggal,
                nominal: formattedNominal,
                status: formData.status,
              }
            : item
        )
      );
    } else {
      // Tambah baru
      const newItem = {
        id: Date.now(),
        kamar: formData.kamar,
        penghuni: formData.penghuni,
        tanggal: formData.tanggal,
        nominal: formattedNominal,
        status: formData.status,
      };
      setPembayaran([...pembayaran, newItem]);
    }
    resetForm();
    setShowForm(false); // Sembunyikan form setelah simpan
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Kelola Pembayaran
          </h1>
          <p className="text-gray-500 mt-2">
            Pantau dan kelola pembayaran penghuni kos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lunas</p>
                  <p className="text-xl font-bold">Rp 1.500.000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Menunggu</p>
                  <p className="text-xl font-bold">Rp 800.000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Belum Bayar</p>
                  <p className="text-xl font-bold">Rp 1.200.000</p>
                </div>
              </div>
            </div>
          </div>
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
              placeholder="Cari kamar atau penghuni..."
            />
          </div>
          <button
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center sm:justify-start"
            onClick={resetForm}
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Pembayaran
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Kamar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Penghuni
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Nominal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pembayaran.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.kamar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.penghuni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {item.nominal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Lunas"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
              <h2 className="text-white font-bold">
                {selectedId ? "Edit Tagihan" : "Tambah Tagihan Baru"}
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kamar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                    value={formData.kamar}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penghuni
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-100"
                    value={formData.penghuni}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="1 Mar 2024"
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tagihan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.totalTagihan}
                    onChange={(e) =>
                      setFormData({ ...formData, totalTagihan: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jatuh Tempo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.jatuhTempo}
                    onChange={(e) =>
                      setFormData({ ...formData, jatuhTempo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Belum Bayar</option>
                    <option>Menunggu</option>
                    <option>Lunas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Simpan Perubahan
              </button>
              {selectedId && (
                <button
                  onClick={() => handleDelete(selectedId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Hapus Tagihan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Adding missing component
function User(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Bed(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}
