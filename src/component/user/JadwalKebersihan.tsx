import React, { useState } from "react";
import BackButtonOrange from "../image/chevron-right.svg";
import WhiteCalendar from "../image/white-calendar.svg";

const JadwalKebersihan = () => {
  const [visibleDays, setVisibleDays] = useState<{ [key: string]: boolean }>({});
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContent = (day: string) => {
    setVisibleDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  const schedule: { [key: string]: string } = {
    Senin: "Menyapu halaman.",
    Selasa: "Mengepel lantai.",
    Rabu: "Membersihkan kamar mandi.",
    Kamis: "Merapikan ruang tamu.",
    Jumat: "Mencuci pakaian.",
    Sabtu: "Membuang sampah.",
    Minggu: "Membersihkan dapur."
  };

  return (
    <div>
    <div className="bg-[#FFA500] rounded-md p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h4 className="text-white font-bold text-2xl">Jadwal Anda</h4>
          <img
            src={WhiteCalendar}
            alt="WhiteCalendar"
            className="w-10 h-10"
          />
        </div>
      </div>
      <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">Minggu Ini</h1>
          <img
            src={BackButtonOrange}
            className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
              isContentVisible ? "rotate-90" : ""
            }`}
            onClick={() => setIsContentVisible(!isContentVisible)}
          />
        </div>
        {isContentVisible && (
          <div className="mt-4">
            <p>Membersihkan Teras.</p>
            {/* Tambahkan konten notifikasi lainnya di sini */}
          </div>
        )}
      </div>
    </div>

      <div className="bg-[#FFA500] rounded-md p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-white font-bold text-2xl">Hari dan Tugas</h4>
            <img src={WhiteCalendar} alt="WhiteCalendar" className="w-10 h-10" />
          </div>
        </div>
        {Object.keys(schedule).map((day) => (
          <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto mb-4" key={day}>
            <div className="flex items-center justify-between">
              <h1 className="font-bold">{day}</h1>
              <img
                src={BackButtonOrange}
                alt="BackButton"
                className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
                  visibleDays[day] ? "rotate-90" : ""
                }`}
                onClick={() => toggleContent(day)}
              />
            </div>
            {visibleDays[day] && (
              <div className="mt-4">
                <p>{schedule[day]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalKebersihan;