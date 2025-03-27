import { Atom, FourSquare } from "react-loading-indicators";
import { Login } from "../data/Login"; // path relatif benar
import logoKuning from "./image/logo kuning.svg"; // Logo kuning
import logoPutih from "./image/logo putih.svg"; // Logo putih
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Gunakan navigasi React Router

interface LoginScreenProps {
  setIsLoggedIn: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setRoomId: (id: string) => void; // Tambahkan ini
}

const LoginScreen = ({
  setIsLoggedIn,
  setIsAdmin,
  setRoomId, // Tambahkan ini
}: {
  setIsLoggedIn: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setRoomId: (id: string) => void; // Tambahkan ini
}) => {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [logoMove, setLogoMove] = useState(false);
  const [logoColorChange, setLogoColorChange] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [contentMove, setContentMove] = useState(false);
  const [fadeOutWelcome, setFadeOutWelcome] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFormLoginAnimated, setShowFormLoginAnimated] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showFormRegisterAnimated, setShowFormRegisterAnimated] =
    useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Gunakan untuk navigasi

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setLogoMove(true);

      setTimeout(() => {
        setShowWelcome(true);
        setTimeout(() => {
          setContentMove(true);
          setAnimate(false); // Menghilangkan bola kuning ketika konten welcome muncul
        }, 100);
      }, 500);
    }, 3000);
  }, []);

  const handleWelcomeLogin = () => {
    setFadeOutWelcome(true);

    setTimeout(() => {
      setShowLoginForm(true);
      setTimeout(() => {
        setShowFormLoginAnimated(true);
      }, 300);
    }, 1000);
  };

  const handleLogoChange = () => {
    setLogoMove(true);
    setTimeout(() => {
      setLogoColorChange(true);
    }, 500);
  };

  const [role, setRole] = useState(""); // Tambahkan state untuk role
  const handleLogin = async () => {
    setIsLoading(true); // Mulai animasi loading
    try {
      // Simulasikan durasi animasi loading selama 4 detik
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("response", response);
        console.log("Navigating to:", `/home${data.roomId}`); // Log rute yang akan digunakan
        setIsLoggedIn(true);
        setRoomId(data.roomId); // Setel roomId dari respons backend
        localStorage.setItem("roomId", data.roomId); // Simpan roomId di local storage
        if (data.role === "ADMIN") {
          setIsAdmin(true);
          navigate("/Beranda"); // Arahkan ke halaman admin
        } else {
          setIsAdmin(false);
          navigate(`/home${data.roomId}`); // Arahkan ke halaman user biasa
        }
      } else {
        setError("Login gagal, periksa kembali username dan password");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false); // Hentikan animasi loading
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !phoneNumber) {
      alert("Semua field harus diisi!");
      return;
    }

    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phoneNumber }),
    });

    const data = await response.text();
    alert(data);
  };

  const handleShowRegister = () => {
    setShowFormLoginAnimated(false);
    setTimeout(() => {
      setShowLoginForm(false);
      setShowRegisterForm(true);
      setTimeout(() => {
        setShowFormRegisterAnimated(true);
      }, 300);
    }, 300);
  };

  const handleBackToLogin = () => {
    setShowFormRegisterAnimated(false);
    setTimeout(() => {
      setShowRegisterForm(false);
      setShowLoginForm(true);
      setTimeout(() => {
        setShowFormLoginAnimated(true);
      }, 300);
    }, 300);
  };

  return (
    <div
      className={`h-screen w-full flex items-center justify-center transition-all duration-1000 relative overflow-hidden ${
        showLoginForm || showRegisterForm ? "bg-[#FEBF00]" : "bg-white"
      }`}
    >
      {/* Overlay Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Animasi Loading */}
          <div className="flex flex-col items-center">
            <Atom color="#32cd32" size="medium" text="" textColor="" />
          </div>
        </div>
      )}
      {/* Lingkaran Kuning di Kanan Atas */}
      {!showLoginForm && !showRegisterForm && (
        <div className="relative w-full h-screen">
          <div
            className={`absolute top-[-140px] right-[-310px] w-80 h-80 bg-[#FEBF00] rounded-full transition-opacity duration-1000 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      )}

      {/* Lingkaran Kuning di Bawah Kiri */}
      {!showLoginForm && !showRegisterForm && (
        <div className="relative w-full h-screen">
          <div
            className={`absolute bottom-[-200px] left-[-350px] w-80 h-80 bg-[#FEBF00] rounded-full transition-opacity duration-1000 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      )}

      {/* Logo */}
      <div
        className={`flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 transition-transform duration-1000 ${
          logoMove ? "translate-y-[-20px]" : "translate-y-0"
        }`}
      >
        <img
          src={logoKuning}
          alt="Logo Kuning"
          className={`w-40 h-40 transition-all duration-1000 ${
            logoColorChange ? "opacity-0" : "opacity-100"
          }`}
        />

        <img
          src={logoPutih}
          alt="Logo Putih"
          className={`w-40 h-40 absolute transition-all duration-1000 ${
            logoColorChange ? "opacity-100 translate-y-[-200px]" : "opacity-0"
          }`}
        />
      </div>

      {/* Konten Welcome */}
      {showWelcome && !showLoginForm && !showRegisterForm && (
        <div
          className={`absolute bottom-0 text-center bg-[#FEBF00] p-6 rounded-lg shadow-lg transition-all duration-1000 ${
            fadeOutWelcome
              ? "opacity-0 translate-y-20"
              : contentMove
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h1
            className="text-[49.312px] font-bold leading-normal text-black text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome
          </h1>

          <p className="mt-2 text-sm text-gray-800">
            Kelola kos lebih mudah dan praktis dalam satu aplikasi. Masuk ke
            akun Anda untuk memantau pembayaran, tugas, dan informasi kos dengan
            cepat dan aman.
          </p>
          <button
            onClick={() => {
              handleWelcomeLogin();
              handleLogoChange();
            }}
            className="mt-4 px-12 py-4 bg-black text-white rounded-lg w-full max-w-xs font-bold"
          >
            MASUK
          </button>
        </div>
      )}

      {/* Form Login */}
      {showLoginForm && (
        <div
          className={`absolute bottom-0 text-center bg-white p-6 rounded-lg shadow-lg transition-all duration-1000 ${
            showFormLoginAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="space-y-4 mt-8">
            <div className="bg-white p-6 rounded-xl shadow pb-10">
              <input
                type="text"
                placeholder="Username"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className={`mt-4 px-12 py-4 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
                } text-white rounded-lg w-full max-w-xs`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log In"}
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border border-black rounded-lg w-full max-w-xs"
                onClick={handleShowRegister}
              >
                Register
              </button>

              {error && (
                <p className="text-center mt-4 text-red-600">{error}</p>
              )}
              <p className="text-center mt-4 text-orange-600">Lupa Password?</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Register */}
      {showRegisterForm && (
        <div
          className={`absolute bottom-0 text-center bg-white p-6 rounded-lg shadow-lg transition-all duration-1000 ${
            showFormRegisterAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="space-y-4 mt-8">
            <div className="bg-white p-6 rounded-xl shadow pb-10">
              <input
                type="text"
                placeholder="Nama Pengguna"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Nomor Telepon"
                className="w-[300px] p-5 text-lg border border-orange-200 rounded-lg mb-7"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <button
                className="mt-4 px-12 py-4 bg-black text-white rounded-lg w-full max-w-xs"
                onClick={handleRegister}
              >
                Register
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border border-black rounded-lg w-full max-w-xs"
                onClick={handleBackToLogin}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
