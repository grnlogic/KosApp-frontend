import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./data/ProtectedRoute";
import Profile from "./component/Profile";
import Navbar from "./Navbar"; // Menggunakan Navbar.tsx
import LoginScreen from "./component/LoginScreen";
import Notification from "./component/notification";

// Halaman Penghuni 1
import FAQ from "./component/kamar1/FAQ";
import Home from "./component/kamar1/Home";
import InfoKamar from "./component/kamar1/InfoKamar";
import JadwalKebersihan from "./component/kamar1/JadwalKebersihan";
import Pembayaran from "./component/kamar1/pembayaran";

// Halaman Penghuni 2
import FAQ2 from "./component/kamar2/FAQ2";
import InfoKamar2 from "./component/kamar2/InfoKamar2";
import Home2 from "./component/kamar2/Home2";
import JadwalKebersihan2 from "./component/kamar2/JadwalKebersihan2";
import Pembayaran2 from "./component/kamar2/pembayaran2";

// Halaman Penghuni 3
import FAQ3 from "./component/kamar3/FAQ3";
import InfoKamar3 from "./component/kamar3/InfoKamar3";
import Home3 from "./component/kamar3/Home3";
import JadwalKebersihan3 from "./component/kamar3/JadwalKebersihan3";
import Pembayaran3 from "./component/kamar3/pembayaran3";

// Halaman Penghuni 4
import FAQ4 from "./component/kamar4/FAQ4";
import InfoKamar4 from "./component/kamar4/InfoKamar4";
import Home4 from "./component/kamar4/Home4";
import JadwalKebersihan4 from "./component/kamar4/JadwalKebersihan4";
import Pembayaran4 from "./component/kamar4/pembayaran4";

// Halaman Registrasi
import Register from "./component/Registration";

// Halaman Admin
import Beranda from "./component/admin/Beranda";
import EditInfoKamar from "./component/admin/Edit Info Kamar";
import EditJadwalKebersihan from "./component/admin/Jadwal Kebersihan";
import EditPembayaran from "./component/admin/KelolaPembayaran";
import FAQAdmin from "./component/admin/FAQ Admin";
import EditPeraturan from "./component/admin/Edit Peraturan";
import EditAkunPenghuni from "./component/admin/AkunPenghuni";

const Layout = ({
  setIsLoggedIn,
  isLoggedIn,
  isAdmin,
  setIsAdmin,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();

  // Daftar rute admin
  const adminRoutes = [
    "/Beranda",
    "/admin/edit-info-kamar",
    "/admin/edit-jadwal-kebersihan",
    "/admin/edit-pembayaran",
    "/admin/faq",
    "/admin/edit-peraturan",
    "/admin/edit-akun-penghuni",
  ];

  // Periksa apakah rute saat ini adalah rute admin
  const isAdminRoute = adminRoutes.includes(location.pathname);

  if (!isLoggedIn && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Tampilkan Navbar hanya jika bukan di rute admin */}
      {!isAdminRoute && location.pathname !== "/" && (
        <Navbar setIsLoggedIn={setIsLoggedIn} />
      )}
      <div className="pt-0">
        <Routes>
          <Route
            path="/"
            element={
              <LoginScreen
                setIsLoggedIn={setIsLoggedIn}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
            }
          >
            {/* Rute penghuni */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/infoKamar" element={<InfoKamar />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/jadwal-kebersihan" element={<JadwalKebersihan />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/register" element={<Register />} />
            {/* Rute penghuni lainnya */}
            <Route path="/home2" element={<Home2 />} />
            <Route path="/faq2" element={<FAQ2 />} />
            <Route path="/infoKamar2" element={<InfoKamar2 />} />
            <Route path="/pembayaran2" element={<Pembayaran2 />} />
            <Route path="/jadwal-kebersihan2" element={<JadwalKebersihan2 />} />
            <Route path="/home3" element={<Home3 />} />
            <Route path="/faq3" element={<FAQ3 />} />
            <Route path="/infoKamar3" element={<InfoKamar3 />} />
            <Route path="/pembayaran3" element={<Pembayaran3 />} />
            <Route path="/jadwal-kebersihan3" element={<JadwalKebersihan3 />} />
            <Route path="/home4" element={<Home4 />} />
            <Route path="/faq4" element={<FAQ4 />} />
            <Route path="/infoKamar4" element={<InfoKamar4 />} />
            <Route path="/pembayaran4" element={<Pembayaran4 />} />
            <Route path="/jadwal-kebersihan4" element={<JadwalKebersihan4 />} />
          </Route>
          <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                adminOnly
              />
            }
          >
            {/* Rute admin */}
            <Route path="/Beranda" element={<Beranda />} />
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Cek environment variable
  console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

  return (
    <Router>
      <Layout
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
    </Router>
  );
};

export default App;
