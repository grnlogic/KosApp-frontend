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
        console.log("Navigating to:", `/home${data.roomId}`); // Log rute yang akan digunakan
        setIsLoggedIn(true);
        setRoomId(data.roomId); // Setel roomId dari respons backend
        localStorage.setItem("roomId", data.roomId); // Simpan roomId di local storage

        if (data.role === "ADMIN") {
          setIsAdmin(true);
          navigate("/Beranda"); // Arahkan ke halaman admin
        } else if (
          data.role === "USER" &&
          data.roomId &&
          data.roomId !== "Belum memilih kamar"
        ) {
          setIsAdmin(false);
          navigate(`/home${data.roomId}`); // Arahkan ke halaman user biasa
        } else {
          navigate("/Landingpage"); // Arahkan ke halaman Landingpage jika roomId tidak valid
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

  const handleKeyPressLogin = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleKeyPressRegister = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
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
      {/* Lingkaran Kuning */}
      {!showLoginForm && !showRegisterForm && (
        <div className="relative w-full h-screen">
          {/* Lingkaran Kuning di Kanan Atas */}
          <div
            className={`absolute top-[-100px] right-[-150px] lg:top-[-200px] lg:right-[-400px] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#FEBF00] rounded-full transition-opacity duration-1000 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Lingkaran Kuning di Bawah Kiri */}
          <div
            className={`absolute bottom-[-150px] left-[-200px] lg:bottom-[-300px] lg:left-[-450px] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#FEBF00] rounded-full transition-opacity duration-1000 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Lingkaran Tambahan untuk Tampilan Desktop */}
          <div className="hidden lg:block">
            <div
              className={`absolute top-[100px] left-[200px] w-40 h-40 bg-[#FEBF00] rounded-full transition-transform duration-1000 ${
                animate ? "scale-100" : "scale-0"
              }`}
            ></div>
            <div
              className={`absolute top-[300px] right-[150px] w-60 h-60 bg-[#FEBF00] rounded-full transition-transform duration-1000 ${
                animate ? "scale-100" : "scale-0"
              }`}
            ></div>
            <div
              className={`absolute bottom-[100px] right-[300px] w-48 h-48 bg-[#FEBF00] rounded-full transition-transform duration-1000 ${
                animate ? "scale-100" : "scale-0"
              }`}
            ></div>
          </div>
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
          className={`w-40 h-40 lg:w-60 lg:h-60 transition-all duration-1000 ${
            logoColorChange ? "opacity-0" : "opacity-100"
          }`}
        />

        <img
          src={logoPutih}
          alt="Logo Putih"
          className={`w-40 h-40 lg:w-60 lg:h-60 absolute transition-all duration-1000 ${
            logoColorChange ? "opacity-100 translate-y-[-200px]" : "opacity-0"
          }`}
        />
      </div>

      {/* Konten Welcome */}
      {showWelcome && !showLoginForm && !showRegisterForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-[#FEBF00] p-6 lg:p-10 rounded-lg shadow-lg transition-all duration-1000 ${
            fadeOutWelcome
              ? "opacity-0 translate-y-20"
              : contentMove
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h1
            className="text-[49.312px] lg:text-[60px] font-bold leading-normal text-black text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome
          </h1>

          <p className="mt-2 text-sm lg:text-base text-gray-800">
            Kelola kos lebih mudah dan praktis dalam satu aplikasi. Masuk ke
            akun Anda untuk memantau pembayaran, tugas, dan informasi kos dengan
            cepat dan aman.
          </p>
          <button
            onClick={() => {
              handleWelcomeLogin();
              handleLogoChange();
            }}
            className="mt-4 px-12 py-4 bg-black text-white rounded-lg w-full max-w-xs font-bold lg:max-w-sm"
          >
            MASUK
          </button>
        </div>
      )}

      {/* Form Login */}
      {showLoginForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-white p-6 lg:p-10 rounded-lg shadow-lg transition-all duration-1000 ${
            showFormLoginAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="space-y-4 mt-8">
            <div className="bg-white p-6 lg:p-10 rounded-xl shadow pb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">
                Login
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                />
              </div>

              <button
                className={`mt-6 px-12 py-4 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
                } text-white rounded-lg w-full lg:w-[400px] font-bold`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log In"}
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border border-black rounded-lg w-full lg:w-[400px]"
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
          className={`absolute bottom-0 lg:bottom-10 text-center bg-white p-6 lg:p-10 rounded-lg shadow-lg transition-all duration-1000 ${
            showFormRegisterAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="space-y-4 mt-8">
            <div className="bg-white p-6 lg:p-10 rounded-xl shadow pb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">
                Register
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  className="w-full lg:w-[400px] p-4 text-lg border border-orange-200 rounded-lg"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />
              </div>

              <button
                className="mt-6 px-12 py-4 bg-black text-white rounded-lg w-full lg:w-[400px] font-bold"
                onClick={handleRegister}
              >
                Register
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border border-black rounded-lg w-full lg:w-[400px]"
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
