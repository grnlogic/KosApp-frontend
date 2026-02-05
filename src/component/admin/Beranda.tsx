import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bed,
  Brush,
  HelpCircle,
  FileText,
  Megaphone,
  DollarSign,
  User,
  LogOut,
  Home,
} from "lucide-react"; // Import icons from lucide-react
import KelolaPembayaran from "./KelolaPembayaran";
import JadwalKebersihan from "./Jadwal Kebersihan";
import FAQ from "./FAQ Admin";
import EditPeraturan from "./Edit Peraturan";
import EditInfoKamar from "./Edit Info Kamar";
import Pengumuman from "./pengumuman";
import AkunPenghuni from "./AkunPenghuni";
import AdminHome from "./AdminHome";
import {
  checkAuthenticationStatus,
  verifyTokenWithBackend,
  clearAuthData,
} from "../../utils/authLogger"; // Import helper untuk pengecekan token
import { API_BASE_URL } from "../../data/Config"; // Import untuk API base URL

// Expose function ke window object untuk debugging di console
declare global {
  interface Window {
    checkAuth: () => any;
    verifyToken: () => Promise<any>;
    clearAuth: () => void;
  }
}

const Beranda = () => {
  const [activeMenu, setActiveMenu] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const welcomeText = "ADMIN PORTAL";
  const typingText = welcomeText;

  // === PENGUJIAN: Cek status autentikasi saat halaman dimuat ===
  useEffect(() => {
    console.log("\n");
    console.log(
      "╔════════════════════════════════════════════════════════════════"
    );
    console.log("║ 🔐 ADMIN PORTAL - AUTOMATIC TOKEN VERIFICATION");
    console.log(
      "╠════════════════════════════════════════════════════════════════"
    );
    console.log("║ Page: Beranda Admin");
    console.log("║ Loading Time:", new Date().toISOString());
    console.log(
      "╚════════════════════════════════════════════════════════════════"
    );
    console.log("\n");

    // Setup global functions untuk debugging di console
    window.checkAuth = checkAuthenticationStatus;
    window.verifyToken = () => verifyTokenWithBackend(API_BASE_URL);
    window.clearAuth = clearAuthData;

    console.log("🛠️ DEBUG TOOLS: Gunakan function berikut di console:");
    console.log(
      "   - window.checkAuth()      → Cek status autentikasi lengkap"
    );
    console.log(
      "   - window.verifyToken()    → Verifikasi token dengan backend"
    );
    console.log("   - window.clearAuth()      → Hapus semua data autentikasi");
    console.log("\n");

    // Jalankan pengecekan autentikasi lengkap
    const authStatus = checkAuthenticationStatus();

    console.log("\n");
    console.log(
      "╔════════════════════════════════════════════════════════════════"
    );
    console.log("║ 🔍 VALIDATION RESULT");
    console.log(
      "╠════════════════════════════════════════════════════════════════"
    );

    // Validasi apakah user adalah admin
    if (!authStatus.isAuthenticated) {
      console.log("║ Status: ❌ FAILED - User tidak terautentikasi");
      console.log("║ Action: Redirect ke halaman login");
      console.log(
        "╚════════════════════════════════════════════════════════════════"
      );
      console.warn("⚠️ REDIRECT: User akan diarahkan ke login page");
      navigate("/");
    } else if (authStatus.localStorage.userData?.role !== "ADMIN") {
      console.log("║ Status: ⚠️ WARNING - User bukan admin");
      console.log("║ Current Role:", authStatus.localStorage.userData?.role);
      console.log("║ Expected Role: ADMIN");
      console.log("║ Action: Akses ditolak atau perlu redirect");
      console.log(
        "╚════════════════════════════════════════════════════════════════"
      );
      console.warn(
        "⚠️ UNAUTHORIZED: User role tidak sesuai untuk admin portal"
      );
      // Uncomment untuk redirect non-admin
      // navigate("/");
    } else {
      console.log("║ Status: ✅ SUCCESS - Admin terautentikasi dengan benar");
      console.log("║ Username:", authStatus.localStorage.userData?.username);
      console.log("║ Email:", authStatus.localStorage.userData?.email);
      console.log("║ Role:", authStatus.localStorage.userData?.role);
      console.log("║ Login Time:", authStatus.localStorage.userData?.loginTime);
      console.log("║");
      console.log("║ 📊 Token & Session Info:");
      console.log(
        "║  - HTTP-Only Cookie: Set by backend (tidak bisa dibaca JS)"
      );
      console.log(
        "║  - Client Cookies: isLoggedIn =",
        authStatus.cookies.isLoggedIn
      );
      console.log("║  - LocalStorage: Data tersimpan dengan benar");
      console.log(
        "║  - Data Consistency:",
        authStatus.consistency.roleMatches &&
          authStatus.consistency.roomIdMatches
          ? "✅ MATCH"
          : "⚠️ MISMATCH"
      );
      console.log(
        "╚════════════════════════════════════════════════════════════════"
      );
      console.log("\n");
      console.log(
        "💡 TIP: Gunakan fungsi checkAuthenticationStatus() di console untuk mengecek ulang kapan saja"
      );
      console.log(
        "   Contoh: window.checkAuth = () => checkAuthenticationStatus();"
      );
      console.log("\n");
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <AdminHome />;
      case "kamar":
        return <EditInfoKamar />;
      case "kebersihan":
        return <JadwalKebersihan />;
      case "faq":
        return <FAQ />;
      case "peraturan":
        return <EditPeraturan />;
      case "pengumuman":
        return <Pengumuman />;
      case "pembayaran":
        return <KelolaPembayaran />;
      case "edit-akun":
        return <AkunPenghuni />;
      case "logout":
        handleLogout();
        return null;
      default:
        return <div>Selamat datang di Beranda Admin</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Navbar */}
      <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <img src="/logo.svg" alt="KosApp Logo" className="w-10 h-10 mr-3" />
          <h1 className="text-white text-2xl font-bold tracking-wide">
            {typingText}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-white text-xl md:hidden mr-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
            <User className="w-8 h-8 text-white" />
            <span className="ml-2 text-white font-medium">Admin</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Overlay for closing sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full bg-white shadow-lg p-4 z-20 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-1/5 rounded-tr-xl rounded-br-xl`}
          style={{
            overflowY: "auto",
            scrollbarWidth: "thin",
            msOverflowStyle: "auto",
          }}
        >
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Menu Navigasi
            </h2>
            <p className="text-sm text-gray-500">Kelola Semua Fitur</p>
          </div>
          <ul className="flex flex-col h-full space-y-2">
            {/* Menu Items */}
            <div className="space-y-2 flex-1">
              <li>
                <button
                  onClick={() => setActiveMenu("home")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "home"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <Home
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "home" ? "text-white" : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("kamar")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "kamar"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <Bed
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "kamar" ? "text-white" : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Kamar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("kebersihan")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "kebersihan"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <Brush
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "kebersihan"
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Kebersihan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("faq")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "faq"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <HelpCircle
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "faq" ? "text-white" : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">FAQ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("peraturan")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "peraturan"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "peraturan"
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Peraturan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("pengumuman")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "pengumuman"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <Megaphone
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "pengumuman"
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Pengumuman</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("pembayaran")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "pembayaran"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <DollarSign
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "pembayaran"
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Pembayaran</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu("edit-akun")}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 hover:bg-yellow-50 ${
                    activeMenu === "edit-akun"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  <User
                    className={`w-5 h-5 mr-3 ${
                      activeMenu === "edit-akun"
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  />
                  <span className="font-medium">Edit Akun</span>
                </button>
              </li>
            </div>

            {/* Log Out Button */}
            <li className="mt-auto pt-6 border-t">
              <button
                onClick={() => {
                  setActiveMenu("logout");
                  setIsSidebarOpen(false);
                }}
                className="flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                <span className="font-medium">Log Out</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 p-6 bg-white shadow-sm rounded-lg my-4 mx-4 overflow-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 mb-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {activeMenu === "home"
                ? "Dashboard"
                : activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </h2>
            <p className="text-gray-600">
              Mengelola {activeMenu === "home" ? "Panel Utama" : activeMenu}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
