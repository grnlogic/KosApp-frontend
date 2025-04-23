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
  Clock,
  ChevronRight,
  MapPin,
  ClipboardList,
} from "lucide-react";

const JadwalKebersihan = () => {
  const [visibleDays, setVisibleDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [schedules, setSchedules] = useState<Kebersihan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const roomNumber = "Kamar 4"; // Room identifier

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
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-[#FFCC00] rounded-full mb-3"></div>
          <p className="text-gray-500">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-red-500 mb-3">{error}</p>
        <button
          onClick={fetchRoomSchedules}
          className="mt-2 py-2 px-6 bg-gradient-to-r from-[#FFCC00] to-[#FF9900] text-white rounded-lg shadow-md hover:opacity-90 transition-opacity"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-white" size={24} />
            <h4 className="text-white font-bold text-2xl">Jadwal Minggu Ini</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-[#FFE180]">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-gray-700">Tugas Kebersihan</h1>
            <div
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#FFF8E7] ${
                isContentVisible ? "bg-[#FFF8E7]" : ""
              }`}
              onClick={() => setIsContentVisible(!isContentVisible)}
            >
              <ChevronRight
                className={`text-[#FF9900] transition-transform duration-300 ${
                  isContentVisible ? "rotate-90" : ""
                }`}
                size={24}
              />
            </div>
          </div>
          {isContentVisible && (
            <div className="mt-4 space-y-4">
              {schedules.length > 0 ? (
                schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#FFF8E7] rounded-lg border-l-4 border-[#FFCC00] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <ClipboardList
                        className="text-[#FF9900] mt-1 mr-3"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-700">
                          Tugas Kebersihan
                        </h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <MapPin size={16} className="mr-1 text-[#FF9900]" />
                          <p className="text-sm">
                            Area:{" "}
                            {getAreaNames(schedule).join(", ") ||
                              "Tidak ada area"}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <Clock size={16} className="mr-1 text-[#FF9900]" />
                          <p className="text-sm">
                            Waktu: {getReadableTime(schedule.executionTime)}
                          </p>
                        </div>
                        {schedule.notes && (
                          <p className="mt-2 text-gray-600 bg-white p-2 rounded-md text-sm">
                            {schedule.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-[#FFF8E7] rounded-lg">
                  <p className="text-gray-500">
                    Belum ada jadwal kebersihan untuk kamar Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9900] rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-white" size={24} />
          <h4 className="text-white font-bold text-2xl">Hari dan Tugas</h4>
        </div>
        <div className="space-y-3">
          {Object.keys(schedule).map((day) => (
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#FFE180]"
              key={day}
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FFF8E7] transition-colors"
                onClick={() => toggleContent(day)}
              >
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-[#FF9900] rounded-full mr-3"></div>
                  <h1 className="font-bold text-gray-700">{day}</h1>
                </div>
                <ChevronRight
                  className={`text-[#FF9900] transition-transform duration-300 ${
                    visibleDays[day] ? "rotate-90" : ""
                  }`}
                  size={20}
                />
              </div>
              {visibleDays[day] && (
                <div className="px-4 pb-4 pt-1">
                  <p className="text-gray-600 ml-5">{schedule[day]}</p>
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
