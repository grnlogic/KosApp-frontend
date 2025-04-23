import React, { useState } from "react";
import { useEffect } from "react";
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
import PeraturanKost from "./component/PeraturanKost";
import NotFound from "./component/NotFound";
import LandingPage from "./component/Landingpage";


// Halaman Penghuni 1
import Profile1 from "./component/kamar1/profile1";
import Pengumuman1 from "./component/kamar1/Pengumuman1";
import FAQ from "./component/kamar1/FAQ";
import Home from "./component/kamar1/Home";
import InfoKamar from "./component/kamar1/InfoKamar";
import JadwalKebersihan from "./component/kamar1/JadwalKebersihan";
import Pembayaran from "./component/kamar1/pembayaran";
import Notification1 from "./component/kamar1/notification1";

// Halaman Penghuni 2
import Profile2 from "./component/kamar2/profile2";
import Pengumuman2 from "./component/kamar2/Pengumuman2";
import FAQ2 from "./component/kamar2/FAQ2";
import InfoKamar2 from "./component/kamar2/InfoKamar2";
import Home2 from "./component/kamar2/Home2";
import JadwalKebersihan2 from "./component/kamar2/JadwalKebersihan2";
import Pembayaran2 from "./component/kamar2/pembayaran2";
import Notification2 from "./component/kamar2/notification2";

// Halaman Penghuni 3
import Profile3 from "./component/kamar3/profile3";
import FAQ3 from "./component/kamar3/FAQ3";
import Pengumuman3 from "./component/kamar3/Pengumuman3";
import InfoKamar3 from "./component/kamar3/InfoKamar3";
import Home3 from "./component/kamar3/Home3";
import JadwalKebersihan3 from "./component/kamar3/JadwalKebersihan3";
import Pembayaran3 from "./component/kamar3/pembayaran3";
import Notification3 from "./component/kamar3/notification3";

// Halaman Penghuni 4
import Pengumuman4 from "./component/kamar4/Pengumuman4";
import Profile4 from "./component/kamar4/profile4";
import FAQ4 from "./component/kamar4/FAQ4";
import InfoKamar4 from "./component/kamar4/InfoKamar4";
import Home4 from "./component/kamar4/Home4";
import JadwalKebersihan4 from "./component/kamar4/JadwalKebersihan4";
import Pembayaran4 from "./component/kamar4/pembayaran4";
import Notification4 from "./component/kamar4/notification4";

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
import DynamicProfile from "./DynamicProfile";
import { Home as HomeIcon } from "lucide-react"; // Import the house icon from Lucid React
import Cookies from "js-cookie"; // Import js-cookie

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void; // Make this property optional
  }
}

export function App() {
  return (
    <>
      {/* Main routing / other layout */}
      {/* ...existing code... */}
    </>
  );
}

const Layout = ({
  setIsLoggedIn,
  isLoggedIn,
  isAdmin,
  setIsAdmin,
  roomId,
  setRoomId,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const location = useLocation();

  const profileRoutes = ["/profile1", "/profile2", "/profile3", "/profile4"];

  const profileComponents = {
    profile1: Profile1,
    profile2: Profile2,
    profile3: Profile3,
    profile4: Profile4,
  };

  <Route
    path="/room/:roomId/profile"
    element={<DynamicProfile profileComponents={profileComponents} />}
  />;
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

  console.log("Current roomId:", roomId);
  console.log("Current Path:", location.pathname);
  console.log("isAdminRoute:", isAdminRoute);
  console.log("isLandingPage:", isLandingPage);
  console.log(
    "Should Navbar Render:",
    !isAdminRoute && !isLandingPage && location.pathname !== "/"
  );

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
              <ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
            }
          >
            <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
            <Route path="/room/:roomId/notification" element={<Home />} />
            <Route path="LandingPage" element={<LandingPage />} />

            {/* Rute penghuni 1 */}
            <Route path="/profile1" element={<Profile1 />} />
            <Route path = "/pengumuman1" element={<Pengumuman1 />} />
            <Route path="/home1" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/infoKamar" element={<InfoKamar />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/jadwal-kebersihan" element={<JadwalKebersihan />} />
            <Route path="/notification" element={<PeraturanKost />} />
            <Route path="/notification1" element={<Notification1 />} />
            {/* Rute penghuni 2 */}
            <Route path="/profile2" element={<Profile2 />} />
            <Route path="/pengumuman2" element={<Pengumuman2 />} />
            <Route path="/home2" element={<Home2 />} />
            <Route path="/faq2" element={<FAQ2 />} />
            <Route path="/infoKamar2" element={<InfoKamar2 />} />
            <Route path="/pembayaran2" element={<Pembayaran2 />} />
            <Route path="/jadwal-kebersihan2" element={<JadwalKebersihan2 />} />
            <Route path="/notification2" element={<Notification2 />} />
            {/* Rute penghuni 3 */}
            <Route path="/profile3" element={<Profile3 />} />
            <Route path="/pengumuman3" element={<Pengumuman3 />} />
            <Route path="/home3" element={<Home3 />} />
            <Route path="/faq3" element={<FAQ3 />} />
            <Route path="/infoKamar3" element={<InfoKamar3 />} />
            <Route path="/pembayaran3" element={<Pembayaran3 />} />
            <Route path="/jadwal-kebersihan3" element={<JadwalKebersihan3 />} />
            <Route path="/notification3" element={<Notification3 />} />
            {/* Rute penghuni 4 */}
            <Route path="/profile4" element={<Profile4 />} />
            <Route path="/pengumuman4" element={<Pengumuman4 />} />
            <Route path="/home4" element={<Home4 />} />
            <Route path="/faq4" element={<FAQ4 />} />
            <Route path="/infoKamar4" element={<InfoKamar4 />} />
            <Route path="/pembayaran4" element={<Pembayaran4 />} />
            <Route path="/jadwal-kebersihan4" element={<JadwalKebersihan4 />} />
            <Route path="/notification4" element={<Notification4 />} />
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

  console.log("setRoomId di App", roomId);

  useEffect(() => {
    const token = Cookies.get("authToken"); // Ambil token dari cookies
    if (token) {
      setIsLoggedIn(true); // Set login status
      const isAdminToken = token ? JSON.parse(atob(token.split('.')[1])).isAdmin : false; // Replace with actual logic to check admin status
      setIsAdmin(isAdminToken);
      const roomIdFromToken = token ? JSON.parse(atob(token.split('.')[1])).roomId : ""; // Extract roomId from token or set default
      setRoomId(roomIdFromToken);
    }
  }, []);

  return (
    <Router>
      <Layout
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        roomId={roomId} // Berikan roomId ke Layout
        setRoomId={setRoomId}
      />
    </Router>
  );
};

const DropdownNavbar = ({
  setIsLoggedIn,
  roomId,
}: {
  setIsLoggedIn: (value: boolean) => void;
  roomId: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("roomId");
    window.location.href = "/";
  };

  useEffect(() => {
    // const googleTranslateElementInit = () => {
    //   new window.google.translate.TranslateElement(
    //     {
    //       pageLanguage: "id",
    //       includedLanguages: "en,id", // Adjust languages as needed
    //       layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    //       autoDisplay: false,
    //     },
    //     "google_translate_element"
    //   );
    // };
    // // Attach the initialization function to the global window object
    // window.googleTranslateElementInit = googleTranslateElementInit;
    // // Dynamically load the Google Translate script
    // const script = document.createElement("script");
    // script.src =
    //   "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    // script.async = true;
    // document.body.appendChild(script);
    // // Cleanup script on component unmount
    // return () => {
    //   document.body.removeChild(script);
    //   delete window.googleTranslateElementInit; // Safe to delete now
    // };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <HomeIcon className="w-6 h-6 mr-2" /> {/* Add the house icon */}
        <span className="text-lg font-bold">KosApp</span>
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Menu
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
            <a
              href={`/home${roomId}`}
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Home
            </a>
            <a href="/profile" className="block px-4 py-2 hover:bg-gray-200">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </button>
            <div id="google_translate_element" className="block px-4 py-2" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppWrapper;
