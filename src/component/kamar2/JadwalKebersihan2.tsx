import React, { useState, useEffect } from "react";
import BackButtonOrange from "../image/chevron-right.svg";
import WhiteCalendar from "../image/white-calendar.svg";
import {
  Kebersihan,
  getKebersihanByRoom,
  getAreaNames,
  getReadableTime,
} from "../../services/kebersihanService";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const JadwalKebersihan = () => {
  const [visibleDays, setVisibleDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [schedules, setSchedules] = useState<Kebersihan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const roomNumber = "Kamar 2"; // Room identifier

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
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#FFCC00] animate-spin" />
          <p className="text-gray-600 font-medium">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-red-500 font-medium text-center mb-4">{error}</p>
        <button
          onClick={fetchRoomSchedules}
          className="py-2.5 px-5 bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-white w-6 h-6" />
            <h4 className="text-white font-bold text-xl">Jadwal Anda</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-gray-800">Minggu Ini</h1>
            <button
              className="bg-[#FFCC00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
              onClick={() => setIsContentVisible(!isContentVisible)}
            >
              <ChevronRight
                className={`w-5 h-5 text-white transition-transform duration-300 ${
                  isContentVisible ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          {isContentVisible && (
            <div className="mt-4 space-y-3">
              {schedules.length > 0 ? (
                schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-[#FFCC00]/20 rounded-xl bg-[#FFF8E7] hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-[#FF7A00] mb-2">
                      Tugas Kebersihan
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-[#FFCC00] mt-0.5" />
                        <p className="text-gray-700">
                          <span className="font-medium">Area:</span>{" "}
                          {getAreaNames(schedule).join(", ") ||
                            "Tidak ada area"}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-[#FFCC00] mt-0.5" />
                        <p className="text-gray-700">
                          <span className="font-medium">Waktu:</span>{" "}
                          {getReadableTime(schedule.executionTime)}
                        </p>
                      </div>
                      {schedule.notes && (
                        <p className="text-gray-600 bg-[#FFCC00]/10 p-2 rounded-lg mt-2">
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-[#FFF8E7] rounded-xl">
                  <Calendar className="w-12 h-12 text-[#FFCC00]/50 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Belum ada jadwal kebersihan untuk kamar Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#FFCC00] to-[#FF9500] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-white w-6 h-6" />
            <h4 className="text-white font-bold text-xl">Hari dan Tugas</h4>
          </div>
        </div>
        <div className="space-y-3">
          {Object.keys(schedule).map((day) => (
            <div className="bg-white rounded-xl p-5 shadow-inner" key={day}>
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-gray-800">{day}</h1>
                <button
                  className="bg-[#FFCC00] hover:bg-[#FF9500] p-2 rounded-full transition-colors"
                  onClick={() => toggleContent(day)}
                >
                  <ChevronRight
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      visibleDays[day] ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>

              {visibleDays[day] && (
                <div className="mt-4 p-3 bg-[#FFF8E7] rounded-lg border border-[#FFCC00]/20">
                  <p className="text-gray-700">{schedule[day]}</p>
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
