import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../admin/ui/card";
import { Button } from "../admin/ui/button";
import { ArrowUpRight, ArrowDownRight, Home, Brush, Bell, CreditCard, FileText, HelpCircle } from "lucide-react";

const HomePanel: React.FC = () => {
  // Dummy data untuk ringkasan
  const summaryData = {
    totalRooms: 50,
    occupiedRooms: 35,
    occupancyRate: 70,
    pendingCleanings: 12,
    totalAnnouncements: 8,
    activeAnnouncements: 5,
    totalPayments: 9500000,
    pendingPayments: 1800000,
    totalFaqs: 25,
    totalRules: 15,
  }

  // Data untuk grafik okupansi kamar (bulanan)
  const roomOccupancyData = [
    { month: "Jan", occupancy: 65 },
    { month: "Feb", occupancy: 68 },
    { month: "Mar", occupancy: 75 },
    { month: "Apr", occupancy: 80 },
    { month: "Mei", occupancy: 70 },
    { month: "Jun", occupancy: 72 },
  ]

  // Data untuk grafik pendapatan (bulanan)
  const revenueData = [
    { month: "Jan", amount: 8500000 },
    { month: "Feb", amount: 9200000 },
    { month: "Mar", amount: 10500000 },
    { month: "Apr", amount: 11800000 },
    { month: "Mei", amount: 9500000 },
    { month: "Jun", amount: 9800000 },
  ]

  // Data untuk aktivitas terbaru
  const recentActivities = [
    { id: 1, type: "room", description: "Kamar 101 check-in oleh John Doe", time: "10 menit yang lalu" },
    { id: 2, type: "cleaning", description: "Pembersihan kamar 203 selesai", time: "25 menit yang lalu" },
    { id: 3, type: "payment", description: "Pembayaran INV-2023-006 diterima", time: "1 jam yang lalu" },
    {
      id: 4,
      type: "announcement",
      description: "Pengumuman baru ditambahkan: Pemeliharaan Lift",
      time: "2 jam yang lalu",
    },
    { id: 5, type: "room", description: "Kamar 305 check-out", time: "3 jam yang lalu" },
  ]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Mendapatkan ikon berdasarkan tipe aktivitas
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "room":
        return <Home className="h-4 w-4" />
      case "cleaning":
        return <Brush className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "announcement":
        return <Bell className="h-4 w-4" />
      case "rule":
        return <FileText className="h-4 w-4" />
      case "faq":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Utama</h2>
        <div className="text-sm text-gray-500">
          Data terakhir diperbarui:{" "}
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Ringkasan Metrik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tingkat Okupansi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.occupancyRate}%</div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+5%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {summaryData.occupiedRooms} dari {summaryData.totalRooms} kamar terisi
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pembersihan Tertunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.pendingCleanings}</div>
              <div className="flex items-center text-red-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+2</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Perlu diselesaikan hari ini</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pengumuman Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.activeAnnouncements}</div>
              <div className="flex items-center text-green-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">-2</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Dari total {summaryData.totalAnnouncements} pengumuman</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pembayaran Tertunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{formatCurrency(summaryData.pendingPayments).split(",")[0]}</div>
              <div className="flex items-center text-yellow-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+15%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Perlu diproses</div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Okupansi Kamar */}
        <Card>
          <CardHeader>
            <CardTitle>Tingkat Okupansi Kamar</CardTitle>
            <CardDescription>6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="h-full flex items-end justify-between px-2">
                {roomOccupancyData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 bg-blue-600 rounded-t-md" style={{ height: `${data.occupancy * 0.7}%` }}></div>
                    <div className="mt-2 text-xs">{data.month}</div>
                    <div className="text-xs font-medium">{data.occupancy}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grafik Pendapatan */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Bulanan</CardTitle>
            <CardDescription>6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="h-full flex items-end justify-between px-2">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-green-600 rounded-t-md"
                      style={{ height: `${(data.amount / 12000000) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs">{data.month}</div>
                    <div className="text-xs font-medium">{formatCurrency(data.amount).split(",")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribusi Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Kamar */}
        <Card>
          <CardHeader>
            <CardTitle>Status Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: "70%" }}></div>
                </div>
                <div className="mt-2 text-sm">Terisi (70%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full" style={{ width: "20%" }}></div>
                </div>
                <div className="mt-2 text-sm">Tersedia (20%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-yellow-600 h-full" style={{ width: "10%" }}></div>
                </div>
                <div className="mt-2 text-sm">Pemeliharaan (10%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pembersihan */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pembersihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full" style={{ width: "60%" }}></div>
                </div>
                <div className="mt-2 text-sm">Selesai (60%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: "15%" }}></div>
                </div>
                <div className="mt-2 text-sm">Proses (15%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-yellow-600 h-full" style={{ width: "25%" }}></div>
                </div>
                <div className="mt-2 text-sm">Tertunda (25%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full" style={{ width: "75%" }}></div>
                </div>
                <div className="mt-2 text-sm">Lunas (75%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-yellow-600 h-full" style={{ width: "20%" }}></div>
                </div>
                <div className="mt-2 text-sm">Tertunda (20%)</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full" style={{ width: "5%" }}></div>
                </div>
                <div className="mt-2 text-sm">Dibatalkan (5%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Distribusi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Kategori FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-purple-600"
                      style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 50%)" }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-blue-600"
                      style={{ clipPath: "polygon(50% 50%, 0 50%, 0 100%, 100% 100%, 100% 50%)" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                    <span className="text-sm">Fasilitas (50%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm">Prosedur (50%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Metode Pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-indigo-600"
                      style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 0, 50% 0)" }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-green-600"
                      style={{ clipPath: "polygon(50% 50%, 50% 0, 0 0, 0 50%)" }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-yellow-600"
                      style={{ clipPath: "polygon(50% 50%, 0 50%, 0 100%, 100% 100%, 100% 50%)" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                    <span className="text-sm">Kartu Kredit (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm">Transfer Bank (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                    <span className="text-sm">Tunai (50%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 border rounded-lg">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    activity.type === "room"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "cleaning"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "payment"
                          ? "bg-purple-100 text-purple-600"
                          : activity.type === "announcement"
                            ? "bg-yellow-100 text-yellow-600"
                            : activity.type === "rule"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.description}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">Lihat Semua Aktivitas</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePanel;