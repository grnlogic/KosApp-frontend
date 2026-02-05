import React, { useState, useEffect } from "react";
import BackButtonOrange from "./image/chevron-right.svg";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState({
    id: null, // Tambahkan ID atau hash unik
    title: "",
    content: "",
    date: "",
  });
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(
          "http://141.11.25.167:8080/api/pengumuman/1"
        ); // Replace `1` with dynamic ID if needed
        const data = await response.json();
        setAnnouncement({
          id: data.id, // Gunakan ID dari API
          title: data.judul,
          content: data.isi,
          date: data.tanggalBerlaku,
        });

        // Check if the announcement is new
        const lastReadId = localStorage.getItem("lastReadAnnouncementId");
        if (!lastReadId || lastReadId !== String(data.id)) {
          setIsNew(true);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleMarkAsRead = () => {
    setIsNew(false);
    if (announcement.id) {
      localStorage.setItem("lastReadAnnouncementId", String(announcement.id));
    }
  };

  const [isContentVisible, setContentVisible] = useState(false);

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
    if (isNew) {
      handleMarkAsRead();
    }
  };

  return (
    <div className="bg-[#FFA500] rounded-md p-5 mb-4 relative">
      {/* Notification Badge */}
      {isNew && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full"></div>
      )}
      <h4 className="text-white font-bold text-2xl mb-4">PENGUMUMAN</h4>
      <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">{announcement.title || "Notifikasi"}</h1>
          <img
            src={BackButtonOrange}
            alt="BackButton"
            className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
              isContentVisible ? "rotate-90" : ""
            }`}
            onClick={toggleContent}
          />
        </div>
        {isContentVisible && (
          <div className="mt-4">
            <p>{announcement.content || "Tidak ada pengumuman saat ini."}</p>
            <p className="text-gray-500 text-sm mt-2">
              Berlaku mulai:{" "}
              {announcement.date
                ? new Date(announcement.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Rules = () => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [peraturanList, setPeraturanList] = useState<
    Array<{ id: number; judul_peraturan: string; deskripsi_peraturan: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeraturan = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://141.11.25.167:8080/api/peraturan");

        if (!response.ok) {
          throw new Error("Failed to fetch peraturan data");
        }

        const data = await response.json();
        setPeraturanList(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching peraturan:", error);
        setError("Gagal memuat data peraturan. Silahkan coba lagi nanti.");
        setIsLoading(false);
      }
    };

    fetchPeraturan();
  }, []);

  const toggleContent = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <div className="bg-[#008080] rounded-md p-5">
      <h4 className="text-white font-bold text-2xl mb-4">PERATURAN KOS</h4>
      <div className="bg-white rounded-md p-5 max-w-md w-full mx-auto">
        {isLoading ? (
          <p className="text-center">Memuat peraturan...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : peraturanList.length === 0 ? (
          <p className="text-center">Tidak ada peraturan saat ini.</p>
        ) : (
          peraturanList.map((rule, index) => (
            <div key={rule.id} className="mb-4">
              <div className="flex items-center justify-between">
                <h1 className="font-bold">{rule.judul_peraturan}</h1>
                <img
                  src={BackButtonOrange}
                  alt="BackButton"
                  className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${
                    visibleIndex === index ? "rotate-90" : ""
                  }`}
                  onClick={() => toggleContent(index)}
                />
              </div>
              {visibleIndex === index && (
                <div className="mt-4">
                  <p>{rule.deskripsi_peraturan}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div>
      <Announcement />
      <Rules />
    </div>
  );
};

export default Contact;
