import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./data/ProtectedRoute";
import Navbar from "./Navbar";
import LoginScreen from "./component/LoginScreen";
import NotFound from "./component/NotFound";
import LandingPage from "./component/Landingpage";

// Dynamic Room Components
import RoomHome from "./component/room/RoomHome";
import RoomProfile from "./component/room/RoomProfile";
import RoomInfo from "./component/room/RoomInfo";
import RoomFAQ from "./component/room/RoomFAQ";
import RoomPeraturan from "./component/room/RoomPeraturan";
import RoomPengumuman from "./component/room/RoomPengumuman";
import RoomPembayaran from "./component/room/RoomPembayaran";
import RoomJadwalKebersihan from "./component/room/RoomJadwalKebersihan";

// Halaman Registrasi
import Register from "./component/Registration";

// Halaman Admin
import Beranda from "./component/admin/Beranda";
import AdminHome from "./component/admin/AdminHome";
import Pengumuman from "./component/admin/pengumuman";
import EditInfoKamar from "./component/admin/Edit Info Kamar";
import EditJadwalKebersihan from "./component/admin/Jadwal Kebersihan";
import EditPembayaran from "./component/admin/KelolaPembayaran";
import FAQAdmin from "./component/admin/FAQ Admin";
import EditPeraturan from "./component/admin/Edit Peraturan";
import EditAkunPenghuni from "./component/admin/AkunPenghuni";
import Cookies from "js-cookie"; // Import js-cookie
import { API_BASE_URL } from "./data/Config";
import axios from "axios";
import { testSupabaseConnection } from "./utils/testSupabase";
import { runDiagnostic } from "./utils/testSupabase";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void; // Make this property optional
  }
}



const Layout = ({
  setIsLoggedIn,
  isLoggedIn,
  isAdmin,
  setIsAdmin,
  roomId,
  setRoomId,
  authLoading,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string; // Added roomId to the type definition
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  authLoading: boolean;
}) => {
  const location = useLocation();

  // Daftar rute admin
  const adminRoutes = [
    "/Beranda",
    "/admin/HomeAdmin",
    "/admin/edit-info-kamar",
    "/admin/edit-jadwal-kebersihan",
    "/admin/edit-pembayaran",
    "/admin/faq",
    "/admin/edit-peraturan",
    "/admin/edit-akun-penghuni",
  ];

  // Periksa apakah rute saat ini adalah rute admin
  const isAdminRoute = adminRoutes.includes(location.pathname);

  // Periksa apakah rute saat ini adalah Landingpage
  const isLandingPage = location.pathname.toLowerCase() === "/landingpage";

  if (!isLoggedIn && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Tampilkan Navbar hanya jika bukan di rute admin, LandingPage, atau halaman login */}
      {!isAdminRoute && !isLandingPage && location.pathname !== "/" && (
        <Navbar setIsLoggedIn={setIsLoggedIn} roomId={roomId} />
      )}
      <div className="pt-0">
        <Routes>
          <Route
            path="/"
            element={
              <LoginScreen
                setRoomId={setRoomId}
                setIsAdmin={setIsAdmin}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                authLoading={authLoading} // Gunakan state authLoading yang asli
              />
            }
          >
            <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
            <Route path="LandingPage" element={<LandingPage />} />

            {/* Dynamic Room Routes */}
            <Route path="/room/:roomId" element={<RoomHome />} />
            <Route path="/room/:roomId/profile" element={<RoomProfile />} />
            <Route path="/room/:roomId/info" element={<RoomInfo />} />
            <Route path="/room/:roomId/faq" element={<RoomFAQ />} />
            <Route path="/room/:roomId/peraturan" element={<RoomPeraturan />} />
            <Route
              path="/room/:roomId/pengumuman"
              element={<RoomPengumuman />}
            />
            <Route
              path="/room/:roomId/pembayaran"
              element={<RoomPembayaran />}
            />
            <Route
              path="/room/:roomId/jadwal-kebersihan"
              element={<RoomJadwalKebersihan />}
            />
            {/* TODO: Add remaining room routes 
            <Route path="/room/:roomId/notification" element={<RoomNotification />} />
            */}
          </Route>
          <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                authLoading={authLoading} // Gunakan state authLoading yang asli
                adminOnly
              />
            }
          >
            {/* Rute admin */}
            <Route path="/Beranda" element={<Beranda />} />
            <Route path="/admin/HomeAdmin" element={<AdminHome />} />
            <Route path="/admin/pengumuman" element={<Pengumuman />} />
            <Route path="/admin/edit-info-kamar" element={<EditInfoKamar />} />
            <Route
              path="/admin/edit-jadwal-kebersihan"
              element={<EditJadwalKebersihan />}
            />
            <Route path="/admin/edit-pembayaran" element={<EditPembayaran />} />
            <Route path="/admin/faq" element={<FAQAdmin />} />
            <Route path="/admin/edit-peraturan" element={<EditPeraturan />} />
            <Route
              path="/admin/edit-akun-penghuni"
              element={<EditAkunPenghuni />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
};

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomId, setRoomId] = useState<string>(""); // Tambahkan state roomId
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);

        // Periksa cookie isLoggedIn
        const isLoggedInCookie = Cookies.get("isLoggedIn");
        const userRoleCookie = Cookies.get("userRole");
        const userRoomIdCookie = Cookies.get("userRoomId");

        // Debug: tampilkan info cookie saat load


        // Cek juga localStorage sebagai fallback
        const localStorageData = localStorage.getItem("userData");

        if (isLoggedInCookie === "true") {
          setIsLoggedIn(true);

          // Coba ambil dari cookie dulu (lebih cepat)
          if (userRoleCookie && userRoomIdCookie) {
            setIsAdmin(userRoleCookie === "ADMIN");
            setRoomId(userRoomIdCookie);
          } else if (localStorageData) {
            // Fallback ke localStorage jika cookie tidak ada
            try {
              const storedData = JSON.parse(localStorageData);
              setIsAdmin(storedData.role === "ADMIN");
              setRoomId(storedData.roomId || "");

              // Restore cookies dari localStorage
              if (storedData.role) {
                Cookies.set("userRole", storedData.role, {
                  expires: 7,
                  path: "/",
                  sameSite: "Lax",
                });
              }
              if (storedData.roomId) {
                Cookies.set("userRoomId", storedData.roomId, {
                  expires: 7,
                  path: "/",
                  sameSite: "Lax",
                });
              }
            } catch (e) {
              console.error("Error parsing localStorage:", e);
            }
          } else {
       
            // Jika tidak ada data sama sekali, logout
            Cookies.remove("isLoggedIn", { path: "/" });
            setIsLoggedIn(false);
            setIsAdmin(false);
            setRoomId("");
          }

          // PENTING: Jangan verifikasi ke backend saat refresh
          // Backend cookie authToken sepertinya tidak persist dengan baik
          // Cukup andalkan cookie isLoggedIn + userRole + userRoomId yang kita kelola sendiri

          // Optional: Verifikasi di background tanpa mempengaruhi sesi
          // Ini hanya untuk sinkronisasi jika backend available
          setTimeout(async () => {
            try {
              const response = await axios.get(
                `${API_BASE_URL}/api/auth/user-info`,
                {
                  withCredentials: true,
                  timeout: 3000,
                }
              );

              const userData = response.data;

              // Update jika ada perbedaan (tanpa logout)
              if (userData.role !== userRoleCookie) {
                setIsAdmin(userData.role === "ADMIN");
                Cookies.set("userRole", userData.role, {
                  expires: 7,
                  path: "/",
                  sameSite: "Lax",
                });
              }

              if (userData.roomId !== userRoomIdCookie) {
                setRoomId(userData.roomId || "");
                if (userData.roomId) {
                  Cookies.set("userRoomId", userData.roomId, {
                    expires: 7,
                    path: "/",
                    sameSite: "Lax",
                  });
                }
              }

              // Update localStorage
              const existingData = localStorageData
                ? JSON.parse(localStorageData)
                : {};
              localStorage.setItem(
                "userData",
                JSON.stringify({
                  ...existingData,
                  role: userData.role,
                  roomId: userData.roomId,
                  lastVerified: new Date().toISOString(),
                })
              );
            } catch (error) {
              // Jangan logout di sini, karena ini background sync
            }
          }, 1000); // Delay 1 detik agar UI sudah load
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setRoomId("");

          // Bersihkan localStorage juga
          localStorage.removeItem("userData");
          Cookies.remove("userRole", { path: "/" });
          Cookies.remove("userRoomId", { path: "/" });
        }
      } catch (error) {
        console.error("💥 Error dalam checkAuth:", error);
        // Jangan logout karena error, pertahankan sesi
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <Layout
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        authLoading={authLoading}
        setRoomId={setRoomId} // Gunakan fungsi state setter asli
        roomId={roomId} // Gunakan state roomId asli
      />
    </Router>
  );
};

export default AppWrapper;
