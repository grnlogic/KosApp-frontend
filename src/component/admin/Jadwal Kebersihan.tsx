import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Menu,
  Trash2,
  Calendar,
  CheckCircle,
  Save,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  Kebersihan,
  getAllKebersihan,
  createKebersihan,
  updateKebersihan,
  deleteKebersihan,
} from "../../services/kebersihanService";
import WaktuPelaksanaan from "../../model/WaktuPelaksanaan";
import Swal from "sweetalert2";
import { JSX } from "react/jsx-runtime";

// Change TimeOfDay to use the enum type
type CleaningArea = "parkingArea" | "terrace" | "corridor" | "garden";
type TimeOfDay = WaktuPelaksanaan;

interface ScheduleData {
  id?: number;
  room: string;
  areas: CleaningArea[];
  notes: string;
}

const dailyTasks = [
  { day: "Senin", task: "Mencuci pakaian" },
  { day: "Selasa", task: "Membuang sampah" },
  { day: "Rabu", task: "Membersihkan dapur" },
  { day: "Kamis", task: "Mencuci pakaian" },
  { day: "Jumat", task: "Membuang sampah" },
  { day: "Sabtu", task: "Membersihkan dapur" },
  { day: "Minggu", task: "Mencuci pakaian" },
];

const JadwalKebersihan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "perRoom">("all");
  const [selectedDate, setSelectedDate] = useState(14);
  const [formData, setFormData] = useState<ScheduleData>({
    room: "Kamar 101",
    areas: [],
    notes: "",
  });
  const [savedData, setSavedData] = useState<ScheduleData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [taskSchedule, setTaskSchedule] = useState(
    dailyTasks.map((task) => ({ ...task, room: "Kamar 101" }))
  );
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [kebersihanList, setKebersihanList] = useState<Kebersihan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = [1, 2, 3, 4];
  const rooms = ["Kamar 1", "Kamar 2", "Kamar 3", "Kamar 4"];
  const cleaningAreas = [
    { id: "parkingArea", label: "Area Parkir", backendField: "areaParking" },
    { id: "terrace", label: "Teras", backendField: "areaTerrace" },
    { id: "corridor", label: "Koridor", backendField: "areaCorridor" },
    { id: "garden", label: "Taman", backendField: "areaGarden" },
  ];

  useEffect(() => {
    fetchKebersihanData();
  }, []);

  const fetchKebersihanData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllKebersihan();
      setKebersihanList(data);

      // If there's data, populate the form with the first item
      if (data.length > 0) {
        const firstItem = data[0];
        const areas: CleaningArea[] = [];

        if (firstItem.areaParking) areas.push("parkingArea");
        if (firstItem.areaTerrace) areas.push("terrace");
        if (firstItem.areaCorridor) areas.push("corridor");
        if (firstItem.areaGarden) areas.push("garden");

        setFormData({
          id: firstItem.id,
          room: firstItem.roomNumber,
          areas: areas,
          notes: firstItem.notes || "",
        });
      }

      setError(null);
    } catch (err) {
      setError("Error fetching data. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaChange = (area: CleaningArea) => {
    setFormData((prev) => {
      if (prev.areas.includes(area)) {
        return { ...prev, areas: prev.areas.filter((a) => a !== area) };
      } else {
        return { ...prev, areas: [...prev.areas, area] };
      }
    });
  };

  const handleReset = () => {
    setFormData({
      room: "Kamar 101",
      areas: [],
      notes: "",
    });
  };

  const handleDelete = async (id: number, roomNumber: string) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Anda yakin?",
        text: `Jadwal kebersihan untuk ${roomNumber} akan dihapus permanen!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        await deleteKebersihan(id);

        // Refresh the list
        await fetchKebersihanData();

        Swal.fire(
          "Terhapus!",
          `Jadwal kebersihan untuk ${roomNumber} telah dihapus.`,
          "success"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error!",
        "Gagal menghapus jadwal. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Convert frontend model to backend model
      const kebersihanData: Kebersihan = {
        roomNumber: formData.room,
        areaParking: formData.areas.includes("parkingArea"),
        areaTerrace: formData.areas.includes("terrace"),
        areaCorridor: formData.areas.includes("corridor"),
        areaGarden: formData.areas.includes("garden"),
        executionTime: WaktuPelaksanaan.MORNING, // Set a default value since we're not collecting it
        notes: formData.notes,
      };

      let savedKebersihan;
      let successMessage;

      if (formData.id) {
        // Update existing record
        savedKebersihan = await updateKebersihan(formData.id, kebersihanData);
        successMessage = `Data berhasil diperbarui untuk ${formData.room}!`;
      } else {
        // Create new record
        savedKebersihan = await createKebersihan(kebersihanData);
        successMessage = `Data berhasil disimpan untuk ${formData.room}!`;
      }

      // Convert back to frontend model for state
      const areas: CleaningArea[] = [];
      if (savedKebersihan.areaParking) areas.push("parkingArea");
      if (savedKebersihan.areaTerrace) areas.push("terrace");
      if (savedKebersihan.areaCorridor) areas.push("corridor");
      if (savedKebersihan.areaGarden) areas.push("garden");

      setSavedData({
        id: savedKebersihan.id,
        room: savedKebersihan.roomNumber,
        areas: areas,
        notes: savedKebersihan.notes || "",
      });

      // Refresh the list
      await fetchKebersihanData();

      // Show success alert
      Swal.fire({
        title: "Berhasil!",
        text: successMessage,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTasks = () => {
    Swal.fire({
      title: "Berhasil!",
      text: "Tugas harian berhasil disimpan!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    // Note: Task functionality would need its own backend implementation
  };

  if (isLoading && kebersihanList.length === 0) {
    return <div className="w-full flex justify-center p-8">Loading...</div>;
  }

  if (error && kebersihanList.length === 0) {
    return (
      <div className="w-full flex flex-col items-center p-8">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={fetchKebersihanData}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Jadwal Kebersihan
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola jadwal dan penugasan kebersihan kos
          </p>
        </div>

        {/* Tabs with enhanced UI */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
          <div className="flex rounded-t-xl overflow-hidden">
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Semua Kamar
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "perRoom"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("perRoom")}
            >
              Per Kamar
            </button>
          </div>
        </div>

        {/* Week picker */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-medium text-gray-700">Pilih Tanggal:</h2>
            <div className="flex space-x-3">
              {dates.map((date) => (
                <button
                  key={date}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                    activeTab === "all" || selectedDate === date
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md transform hover:scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    if (activeTab === "perRoom") {
                      setSelectedDate(date);
                    }
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Form */}
          <div className="lg:col-span-2">
            {/* Existing Schedules List */}
            {activeTab === "all" && kebersihanList.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
                  <h2 className="text-white font-bold flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Jadwal Tersimpan
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kamar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kebersihanList.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {item.roomNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {[
                              item.areaParking ? (
                                <span
                                  key="parking"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                                >
                                  Area Parkir
                                </span>
                              ) : null,
                              item.areaCorridor ? (
                                <span
                                  key="corridor"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2"
                                >
                                  Koridor
                                </span>
                              ) : null,
                              item.areaTerrace ? (
                                <span
                                  key="terrace"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2"
                                >
                                  Teras
                                </span>
                              ) : null,
                              item.areaGarden ? (
                                <span
                                  key="garden"
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2"
                                >
                                  Taman
                                </span>
                              ) : null,
                            ]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <button
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                onClick={() => {
                                  const areas: CleaningArea[] = [];
                                  if (item.areaParking)
                                    areas.push("parkingArea");
                                  if (item.areaTerrace) areas.push("terrace");
                                  if (item.areaCorridor) areas.push("corridor");
                                  if (item.areaGarden) areas.push("garden");

                                  setFormData({
                                    id: item.id,
                                    room: item.roomNumber,
                                    areas: areas,
                                    notes: item.notes || "",
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 transition-colors"
                                onClick={() =>
                                  handleDelete(item.id!, item.roomNumber)
                                }
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
                <h2 className="text-white font-bold flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Detail Penugasan
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Kamar
                  </label>
                  <div className="relative">
                    <button
                      className="w-full p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>{formData.room}</span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {rooms.map((room) => (
                          <div
                            key={room}
                            className="p-3 hover:bg-yellow-50 cursor-pointer"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, room }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            {room}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cleaning Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Kebersihan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {cleaningAreas.map((area) => (
                      <div
                        key={area.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.areas.includes(area.id as CleaningArea)
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-yellow-300"
                        }`}
                        onClick={() =>
                          handleAreaChange(area.id as CleaningArea)
                        }
                      >
                        <input
                          type="checkbox"
                          id={area.id}
                          checked={formData.areas.includes(
                            area.id as CleaningArea
                          )}
                          onChange={() => {}}
                          className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 rounded"
                        />
                        <label
                          htmlFor={area.id}
                          className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {area.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan khusus tentang penugasan..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RefreshCw size={18} className="mr-2" />
                Reset
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all ${
                  isLoading
                    ? "bg-gray-400 text-white"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white"
                }`}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column: Daily Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 sticky top-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4">
                <button
                  className="text-white font-bold flex items-center w-full justify-between"
                  onClick={() => setIsTaskMenuOpen(!isTaskMenuOpen)}
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Pengaturan Tugas Harian
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isTaskMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isTaskMenuOpen ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <div className="p-6 space-y-6">
                  {taskSchedule.map((task, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
                        {task.day}
                      </label>
                      <input
                        type="text"
                        value={task.task}
                        onChange={(e) => {
                          const updatedTasks = [...taskSchedule];
                          updatedTasks[index].task = e.target.value;
                          setTaskSchedule(updatedTasks);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                  ))}
                  <button
                    className="w-full py-3 rounded-lg font-medium flex items-center justify-center bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={handleSaveTasks}
                  >
                    <Save size={18} className="mr-2" />
                    Simpan Tugas Harian
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JadwalKebersihan;

// Missing component
function Edit(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
