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
  Eye,
  FileText,
} from "lucide-react";
import {
  Kebersihan,
  getAllKebersihan,
  createKebersihan,
  updateKebersihan,
  deleteKebersihan,
} from "../../services/kebersihanService";
import { roomService, Room } from "../../services/roomService";
import WaktuPelaksanaan from "../../model/WaktuPelaksanaan";
import Swal from "sweetalert2";
import { JSX } from "react/jsx-runtime";
import BlinkBlur from "./BlinkBlur";
import Commet from "./Commet";

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
  const [formData, setFormData] = useState<ScheduleData>({
    room: "",
    areas: [],
    notes: "",
  });
  const [savedData, setSavedData] = useState<ScheduleData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [taskSchedule, setTaskSchedule] = useState(
    dailyTasks.map((task) => ({ ...task, room: "" }))
  );
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [kebersihanList, setKebersihanList] = useState<Kebersihan[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const cleaningAreas = [
    { id: "parkingArea", label: "Area Parkir", backendField: "areaParking" },
    { id: "terrace", label: "Teras", backendField: "areaTerrace" },
    { id: "corridor", label: "Koridor", backendField: "areaCorridor" },
    { id: "garden", label: "Taman", backendField: "areaGarden" },
  ];

  useEffect(() => {
    fetchRoomsData();
    fetchKebersihanData();
  }, []);

  const fetchRoomsData = async () => {
    try {
      const roomsData = await roomService.getAllRooms();
      setRooms(roomsData);

      // Set default room if available and formData.room is empty
      if (roomsData.length > 0 && !formData.room) {
        setFormData((prev) => ({
          ...prev,
          room: roomsData[0].nomorKamar,
        }));
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data kamar. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

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
      room: rooms.length > 0 ? rooms[0].nomorKamar : "",
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
        roomNumber: formData.room, // Use room number directly (e.g., "001")
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
        successMessage = `Data berhasil diperbarui untuk kamar ${formData.room}!`;
      } else {
        // Create new record
        savedKebersihan = await createKebersihan(kebersihanData);
        successMessage = `Data berhasil disimpan untuk kamar ${formData.room}!`;
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
    return (
      <div className="w-full flex justify-center p-8">
        <Commet color="#32cd32" size="medium" text="" textColor="" />
      </div>
    );
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
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
          Jadwal Kebersihan
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Form */}
          <div className="lg:col-span-2">
            {/* Existing Schedules List */}
            {kebersihanList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
                <div className="bg-blue-600 px-6 py-4">
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gray-800 px-6 py-4">
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
                      className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={rooms.length === 0}
                    >
                      <span>
                        {rooms.length === 0
                          ? "Tidak ada kamar tersedia"
                          : formData.room || "Pilih Kamar"}
                      </span>
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
                            key={room.id}
                            className="p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                room: room.nomorKamar,
                              }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {room.nomorKamar}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  room.status === "kosong"
                                    ? "bg-green-100 text-green-700"
                                    : room.status === "terisi"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {room.status === "kosong"
                                  ? "Kosong"
                                  : room.status === "terisi"
                                  ? "Terisi"
                                  : "Pending"}
                              </span>
                            </div>
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
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
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
                          className="h-4 w-4 text-blue-500 focus:ring-blue-400 rounded"
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
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                    : "bg-blue-600 hover:bg-blue-700 text-white"
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

          {/* Right column: Preview Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 sticky top-6">
              <div className="bg-gray-800 px-6 py-4">
                <h2 className="text-white font-bold flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Preview Konten
                  </span>
                  <button
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                    className="bg-white bg-opacity-30 p-1 rounded hover:bg-opacity-40 transition-colors"
                  >
                    <Menu size={20} className="text-white" />
                  </button>
                </h2>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isPreviewOpen ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <div className="p-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      Detail Jadwal
                    </h3>

                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium">Kamar:</span>{" "}
                        {formData.room}
                      </p>
                      <p>
                        <span className="font-medium">Area:</span>{" "}
                        {formData.areas.length > 0
                          ? formData.areas
                              .map((area) => {
                                const areaLabel = cleaningAreas.find(
                                  (a) => a.id === area
                                )?.label;
                                return areaLabel;
                              })
                              .join(", ")
                          : "Belum ada area dipilih"}
                      </p>
                      <p>
                        <span className="font-medium">Catatan:</span>{" "}
                        {formData.notes ? formData.notes : "Tidak ada catatan"}
                      </p>
                    </div>
                  </div>

                  {kebersihanList.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Jadwal Terbaru
                      </h3>
                      <div className="max-h-60 overflow-y-auto">
                        {kebersihanList.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="border-b border-gray-200 py-2 last:border-b-0"
                          >
                            <p className="font-medium">{item.roomNumber}</p>
                            <p className="text-sm text-gray-600">
                              {[
                                item.areaParking ? "Area Parkir" : null,
                                item.areaCorridor ? "Koridor" : null,
                                item.areaTerrace ? "Teras" : null,
                                item.areaGarden ? "Taman" : null,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
