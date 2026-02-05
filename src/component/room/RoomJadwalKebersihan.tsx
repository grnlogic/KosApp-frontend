import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Commet from "../admin/Commet";
import {
  Kebersihan,
  getKebersihanByRoom,
  getReadableTime,
} from "../../services/kebersihanService";
import Swal from "sweetalert2";

interface ScheduleData {
  id: number;
  roomNumber: string;
  areaParking: boolean;
  areaTerrace: boolean;
  areaCorridor: boolean;
  areaGarden: boolean;
  notes?: string;
  executionTime?: string;
}

interface DailyTask {
  day: string;
  task: string;
}

const dailyTasksTemplate: DailyTask[] = [
  { day: "Senin", task: "Membersihkan area yang ditugaskan" },
  { day: "Selasa", task: "Membersihkan area yang ditugaskan" },
  { day: "Rabu", task: "Membersihkan area yang ditugaskan" },
  { day: "Kamis", task: "Membersihkan area yang ditugaskan" },
  { day: "Jumat", task: "Membersihkan area yang ditugaskan" },
  { day: "Sabtu", task: "Membersihkan area yang ditugaskan" },
  { day: "Minggu", task: "Membersihkan area yang ditugaskan" },
];

const RoomJadwalKebersihan: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [dailyTasks] = useState<DailyTask[]>(dailyTasksTemplate);
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch schedule from database using the service
        // roomId dari URL parameter (contoh: "1" atau "001")
        // Normalize to match database format (pad with zeros to 3 digits)
        const normalizedRoomId = roomId?.padStart(3, "0") || "";
        const schedules = await getKebersihanByRoom(normalizedRoomId);

        if (schedules && schedules.length > 0) {
          // Use the first schedule found for this room
          const schedule = schedules[0];
          setScheduleData({
            id: schedule.id || 0,
            roomNumber: schedule.roomNumber,
            areaParking: schedule.areaParking,
            areaTerrace: schedule.areaTerrace,
            areaCorridor: schedule.areaCorridor,
            areaGarden: schedule.areaGarden,
            notes: schedule.notes,
            executionTime: schedule.executionTime,
          });
        } else {
          // No schedule found for this room
          setScheduleData(null);
          setError("Belum ada jadwal kebersihan untuk kamar ini.");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setError("Gagal mengambil data jadwal kebersihan. Silakan coba lagi.");
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data jadwal kebersihan. Silakan coba lagi nanti.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [roomId]);

  const getDayColor = (day: string) => {
    const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });
    return day === today ? "bg-yellow-100 border-yellow-400" : "bg-white";
  };

  const getAreaName = (key: string) => {
    const areaNames: { [key: string]: string } = {
      areaParking: "Area Parkir",
      areaTerrace: "Teras",
      areaCorridor: "Koridor",
      areaGarden: "Taman",
    };
    return areaNames[key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="flex items-center justify-center h-screen">
          <Commet
            color="#f59e0b"
            size="large"
            text="Memuat jadwal kebersihan..."
            textColor="#92400e"
          />
        </div>
      </div>
    );
  }

  if (error && !scheduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId || ""} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Jadwal
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
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
              <Calendar className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Jadwal Kebersihan</h1>
              <p className="text-yellow-50 text-lg">
                Lihat dan kelola jadwal piket kebersihan Anda
              </p>
            </div>
          </div>
        </div>

        {/* Tugas Harian */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Tugas Harian
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-2">Minggu Ini</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyTasks.map((task, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    getDayColor(task.day) + " border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{task.day}</h3>
                        {task.day ===
                          new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                          }) && (
                          <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Hari Ini
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{task.task}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Informasi Tugas
                  </h4>
                  <p className="text-sm text-gray-700">
                    Jadwal kebersihan diatur oleh admin. Pastikan untuk
                    membersihkan area yang telah ditugaskan setiap hari sesuai
                    jadwal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Areas */}
        {scheduleData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4">
              <h2 className="text-white font-bold text-xl">
                Area Tanggung Jawab
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(scheduleData).map(([key, value]) => {
                  if (
                    key === "areaParking" ||
                    key === "areaTerrace" ||
                    key === "areaCorridor" ||
                    key === "areaGarden"
                  ) {
                    return (
                      <div
                        key={key}
                        className={`rounded-xl p-4 border-2 ${
                          value
                            ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300"
                            : "bg-gray-50 border-gray-200 opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {value ? (
                              <CheckCircle className="w-6 h-6 text-yellow-600" />
                            ) : (
                              <Clock className="w-6 h-6 text-gray-400" />
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {getAreaName(key)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {value ? "Ditugaskan" : "Tidak ditugaskan"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {scheduleData.notes && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Catatan:</h4>
                  <p className="text-gray-700">{scheduleData.notes}</p>
                </div>
              )}

              {scheduleData.executionTime && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span>
                    Waktu Pelaksanaan:{" "}
                    <strong>
                      {getReadableTime(scheduleData.executionTime as any)}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips & Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cleaning Tips */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-4">
              <h2 className="text-white font-bold text-xl">Tips Kebersihan</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Bersihkan area secara rutin setiap hari</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Gunakan alat kebersihan yang tersedia</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Buang sampah pada tempatnya</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Laporkan jika ada kerusakan atau masalah</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-400 to-pink-500 px-6 py-4">
              <h2 className="text-white font-bold text-xl">
                Perhatian Penting
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Jadwal piket wajib dilaksanakan</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Keterlambatan dapat dikenakan sanksi</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Hubungi admin jika berhalangan</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Jaga kebersihan area bersama</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-4">Informasi Kontak</h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/30 p-3 rounded-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  Butuh Bantuan atau Informasi?
                </p>
                <p className="text-yellow-50 text-sm">
                  Jangan ragu untuk menghubungi admin
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>Telepon: 0812-xxxx-xxxx</span>
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span>
                <span>Email: admin@kosapp.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomJadwalKebersihan;
