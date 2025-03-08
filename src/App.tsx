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
import Home from "./component/user/Home";
import UserNavbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import LoginScreen from "./component/LoginScreen";
import FAQ from "./component/user/FAQ";
import Notification from "./component/notification";
import InfoKamar from "./component/user/InfoKamar";
import JadwalKebersihan from "./component/user/JadwalKebersihan";
import Pembayaran from "./component/user/pembayaran";
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

  if (!isLoggedIn && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {location.pathname !== "/" &&
        (isAdmin ? (
          <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <UserNavbar setIsLoggedIn={setIsLoggedIn} />
        ))}
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
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/infoKamar" element={<InfoKamar />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/jadwal-kebersihan" element={<JadwalKebersihan />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/register" element={<Register />} />
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
