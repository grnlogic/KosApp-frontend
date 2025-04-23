import React, { useState } from "react";
import {
  Bell,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
  isRead: boolean;
}

const Notification1: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Tagihan Bulanan",
      message:
        "Pembayaran untuk bulan Oktober telah jatuh tempo. Silakan segera melakukan pembayaran.",
      time: "2 jam yang lalu",
      type: "warning",
      isRead: false,
    },
    {
      id: 2,
      title: "Pemeliharaan Air",
      message:
        "Akan ada pemeliharaan saluran air pada tanggal 15 Oktober 2023 pukul 08.00-12.00 WIB.",
      time: "Kemarin",
      type: "info",
      isRead: false,
    },
    {
      id: 3,
      title: "Pembayaran Berhasil",
      message: "Pembayaran untuk bulan September telah diterima. Terima kasih!",
      time: "5 hari yang lalu",
      type: "success",
      isRead: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="text-amber-500" size={20} />;
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="bg-[#FFF8E7] p-4 rounded-xl animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="text-[#FF7A00]" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
        </div>
        <button className="text-[#FF7A00] font-medium text-sm">
          Tandai semua dibaca
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
              !notification.isRead ? "border-l-4 border-[#FFCC00]" : ""
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                {getIcon(notification.type)}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <Bell className="text-gray-300" size={48} />
          <p className="text-gray-500 mt-4">Tidak ada notifikasi</p>
        </div>
      )}
    </div>
  );
};

export default Notification1;
