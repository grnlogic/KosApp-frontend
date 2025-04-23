import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  AlertCircle,
  Check,
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
  const roomNumber = "Kamar 1"; // Room identifier

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
        <div className="h-8 w-8 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 rounded-xl">
        <AlertCircle className="text-red-500 mb-2" size={40} />
        <p className="text-red-500 font-medium text-center">{error}</p>
        <button
          onClick={fetchRoomSchedules}
          className="mt-4 py-2 px-6 bg-gradient-to-r from-[#FFCC00] to-[#FF9500] text-white rounded-xl font-medium shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-xl p-5 mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-white" size={24} />
            <h4 className="text-white font-bold text-2xl">
              Jadwal Kebersihan Anda
            </h4>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-inner">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsContentVisible(!isContentVisible)}
          >
            <h1 className="font-bold text-gray-800">Minggu Ini</h1>
            <ChevronRight
              className={`text-[#FF7A00] transition-transform duration-300 transform ${
                isContentVisible ? "rotate-90" : ""
              }`}
              size={24}
            />
          </div>

          {isContentVisible && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              {schedules.length > 0 ? (
                schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-[#FFCC00] p-2 rounded-lg">
                        <Check className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Tugas Kebersihan
                        </h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="mr-2 text-[#FF7A00]" size={16} />
                            <p>
                              Area:{" "}
                              {getAreaNames(schedule).join(", ") ||
                                "Tidak ada area"}
                            </p>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-2 text-[#FF7A00]" size={16} />
                            <p>
                              Waktu: {getReadableTime(schedule.executionTime)}
                            </p>
                          </div>
                          {schedule.notes && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded-lg border-l-4 border-[#FFCC00]">
                              <p className="text-gray-700">{schedule.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    Belum ada jadwal kebersihan untuk kamar Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFCC00] to-[#FF9500] rounded-xl p-5 mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-white" size={24} />
            <h4 className="text-white font-bold text-2xl">Hari dan Tugas</h4>
          </div>
        </div>

        {Object.keys(schedule).map((day) => (
          <div className="bg-white rounded-xl p-5 mb-4 shadow-inner" key={day}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleContent(day)}
            >
              <h1 className="font-bold text-gray-800">{day}</h1>
              <ChevronRight
                className={`text-[#FF7A00] transition-transform duration-300 transform ${
                  visibleDays[day] ? "rotate-90" : ""
                }`}
                size={24}
              />
            </div>

            {visibleDays[day] && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                <p className="text-gray-700">{schedule[day]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalKebersihan;
