import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import {
  Kebersihan,
  getKebersihanByRoom,
  getAreaNames,
  getReadableTime,
} from "../../services/kebersihanService";

const JadwalKebersihan = () => {
  const [visibleDays, setVisibleDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [schedules, setSchedules] = useState<Kebersihan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const roomNumber = "Kamar 3"; // Room identifier

  const toggleContent = (day: string) => {
    setVisibleDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  useEffect(() => {
    fetchRoomSchedules();
  }, []);

  const fetchRoomSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await getKebersihanByRoom(roomNumber);
      setSchedules(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError("Gagal memuat jadwal. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const schedule: { [key: string]: string } = {
    Senin: "Menyapu halaman.",
    Selasa: "Mengepel lantai.",
    Rabu: "Membersihkan kamar mandi.",
    Kamis: "Merapikan ruang tamu.",
    Jumat: "Mencuci pakaian.",
    Sabtu: "Membuang sampah.",
    Minggu: "Membersihkan dapur.",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <RefreshCw size={24} className="text-[#FFCC00] animate-spin mr-2" />
        <p className="text-gray-600">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={fetchRoomSchedules}
          className="mt-3 py-2 px-6 bg-[#FFCC00] text-white rounded-xl shadow transition-all hover:bg-[#FFA500] hover:shadow-md flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#FFCC00] rounded-2xl p-6 mb-6 shadow-lg transform transition-all hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h4 className="text-white font-bold text-2xl">Jadwal Tugas Anda</h4>
            <Calendar className="text-white" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-inner">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsContentVisible(!isContentVisible)}
          >
            <h1 className="font-bold text-gray-800">Minggu Ini</h1>
            <div
              className={`p-2 rounded-full bg-[#FFF8E7] transform transition-transform duration-300 ${
                isContentVisible ? "rotate-90" : ""
              }`}
            >
              <ChevronRight size={20} className="text-[#FFCC00]" />
            </div>
          </div>

          {isContentVisible && (
            <div className="mt-5 space-y-4">
              {schedules.length > 0 ? (
                schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 rounded-xl bg-[#FFF8E7] hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <ClipboardList size={18} className="text-[#FFCC00]" />
                      Tugas Kebersihan
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#FFCC00]" />
                        Area:{" "}
                        {getAreaNames(schedule).join(", ") || "Tidak ada area"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock size={16} className="text-[#FFCC00]" />
                        Waktu: {getReadableTime(schedule.executionTime)}
                      </p>
                      {schedule.notes && (
                        <p className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                          <span className="text-[#FFCC00] font-medium">
                            Catatan:
                          </span>{" "}
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-[#FFF8E7] rounded-xl">
                  <Calendar
                    size={36}
                    className="text-[#FFCC00] mx-auto mb-3 opacity-50"
                  />
                  <p className="text-gray-500">
                    Belum ada jadwal kebersihan untuk kamar Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#FFCC00] rounded-2xl p-6 mb-6 shadow-lg transform transition-all hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h4 className="text-white font-bold text-2xl">Hari dan Tugas</h4>
            <Calendar className="text-white" size={24} />
          </div>
        </div>

        <div className="space-y-3">
          {Object.keys(schedule).map((day) => (
            <div
              className="bg-white rounded-xl p-5 shadow-inner transition-all hover:shadow-md"
              key={day}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleContent(day)}
              >
                <h1 className="font-bold text-gray-800">{day}</h1>
                <div
                  className={`p-2 rounded-full bg-[#FFF8E7] transform transition-transform duration-300 ${
                    visibleDays[day] ? "rotate-90" : ""
                  }`}
                >
                  <ChevronRight size={18} className="text-[#FFCC00]" />
                </div>
              </div>

              {visibleDays[day] && (
                <div className="mt-4 p-3 bg-[#FFF8E7] rounded-lg text-gray-700">
                  <p>{schedule[day]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalKebersihan;

// Note: Make sure to also update the kebersihanService.ts file to use
// https://manage-kost-production.up.railway.app instead of localhost:8080
