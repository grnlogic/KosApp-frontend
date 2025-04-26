import { Atom, FourSquare } from "react-loading-indicators";
import { Login } from "../data/Login"; // path relatif benar
import logoKuning from "./image/logo kuning.svg"; // Logo kuning
import logoPutih from "./image/logo putih.svg"; // Logo putih
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Gunakan navigasi React Router
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2"; // Tambahkan import Swal

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
  // Replace undefined with a fallback URL
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL ||
    "https://manage-kost-production.up.railway.app";
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
        }, 300); // Faster animation for smoother experience
      }, 700); // Slightly longer for logo movement to complete
    }, 2000); // Reduced loading time for better UX
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
    setError(""); // Reset error message

    try {
      // Simulasikan durasi animasi loading selama 2 detik
      await new Promise((resolve) => setTimeout(resolve, 2000));


      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: window.location.origin,
        },
        credentials: "include", // Include cookies in the request
        mode: "cors", // Explicitly specify CORS mode
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Simpan token dengan kunci 'authToken'
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
        const errorText = await response.text();
        console.error("Login failed:", errorText);

        // Gunakan SweetAlert2 untuk menampilkan pesan kesalahan password
        if (
          response.status === 401 ||
          errorText.toLowerCase().includes("password") ||
          errorText.toLowerCase().includes("credentials")
        ) {
          Swal.fire({
            title: "Login Gagal",
            text: "Username atau password yang Anda masukkan salah",
            icon: "error",
            confirmButtonText: "Coba Lagi",
            confirmButtonColor: "#FEBF00",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        } else {
          setError(`Login gagal: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Terjadi kesalahan saat login. Kemungkinan masalah CORS. Silakan hubungi admin."
      );

      // Display more helpful error with SweetAlert2
      Swal.fire({
        title: "Error Koneksi",
        text: "Tidak dapat terhubung ke server. Ini mungkin masalah CORS atau server sedang down.",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        showCancelButton: true,
        cancelButtonText: "Hubungi Admin",
        confirmButtonColor: "#FEBF00",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "Try Again"
          handleLogin();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User clicked "Contact Admin"
          window.open("https://wa.me/0895352281010", "_blank");
        }
      });
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setRoomId("");
    localStorage.removeItem("token");
    Cookies.remove("authToken"); // Hapus token dari cookies
    navigate("/"); // Arahkan ke halaman login
  };

  return (
    <div
      className={`h-screen w-full flex items-center justify-center transition-all duration-1000 relative overflow-hidden ${
        showLoginForm || showRegisterForm
          ? "bg-gradient-to-br from-[#FEBF00] to-[#FEA700]"
          : "bg-white"
      }`}
    >
      {/* Improved Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="flex flex-col items-center bg-white/10 p-8 rounded-xl shadow-2xl">
            <Atom color="#FEBF00" size="medium" text="" textColor="" />
            <p className="text-white mt-4 font-medium">Memuat...</p>
          </div>
        </div>
      )}

      {/* Enhanced Yellow Circles Background */}
      {!showLoginForm && !showRegisterForm && (
        <div className="relative w-full h-screen">
          {/* Main Yellow Circles with improved positioning and animations */}
          <div
            className={`absolute top-[-100px] right-[-150px] lg:top-[-200px] lg:right-[-400px] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#FEBF00] rounded-full transition-all duration-1000 ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } shadow-lg`}
          ></div>

          <div
            className={`absolute bottom-[-150px] left-[-200px] lg:bottom-[-300px] lg:left-[-450px] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#FEBF00] rounded-full transition-all duration-1000 ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } shadow-lg`}
          ></div>

          {/* Additional circles with staggered animations */}
          <div className="hidden lg:block">
            <div
              className={`absolute top-[100px] left-[200px] w-40 h-40 bg-[#FEBF00] rounded-full transition-all duration-1200 ${
                animate ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } shadow-lg`}
            ></div>
            <div
              className={`absolute top-[300px] right-[150px] w-60 h-60 bg-[#FEBF00] rounded-full transition-all duration-1400 ${
                animate ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } shadow-lg`}
            ></div>
            <div
              className={`absolute bottom-[100px] right-[300px] w-48 h-48 bg-[#FEBF00] rounded-full transition-all duration-1600 ${
                animate ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } shadow-lg`}
            ></div>

            {/* Small decorative circles for added visual interest */}
            <div
              className={`absolute top-[200px] left-[400px] w-16 h-16 bg-[#FEBF00] rounded-full transition-all duration-1800 ${
                animate ? "scale-100 opacity-80" : "scale-0 opacity-0"
              } shadow-lg`}
            ></div>
            <div
              className={`absolute bottom-[200px] left-[200px] w-24 h-24 bg-[#FEBF00] rounded-full transition-all duration-2000 ${
                animate ? "scale-100 opacity-70" : "scale-0 opacity-0"
              } shadow-lg`}
            ></div>
          </div>
        </div>
      )}

      {/* Enhanced Logo Animation */}
      <div
        className={`flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 transition-all duration-1000 ${
          logoMove ? "translate-y-[-40px]" : "translate-y-0"
        }`}
      >
        <img
          src={logoKuning}
          alt="Logo Kuning"
          className={`w-40 h-40 lg:w-60 lg:h-60 transition-all duration-1000 ${
            logoColorChange
              ? "opacity-0 scale-90 rotate-6"
              : "opacity-100 scale-100 rotate-0"
          } drop-shadow-xl`}
        />

        <img
          src={logoPutih}
          alt="Logo Putih"
          className={`w-40 h-40 lg:w-60 lg:h-60 absolute transition-all duration-1000 ${
            logoColorChange
              ? "opacity-100 translate-y-[-200px] scale-100"
              : "opacity-0 scale-90"
          } drop-shadow-xl`}
        />
      </div>

      {/* Welcome Content with improved styling */}
      {showWelcome && !showLoginForm && !showRegisterForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-gradient-to-br from-[#FEBF00] to-[#FEA700] p-8 lg:p-12 rounded-2xl shadow-2xl transition-all duration-1000 ${
            fadeOutWelcome
              ? "opacity-0 translate-y-20"
              : contentMove
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } max-w-md mx-4 lg:mx-0`}
        >
          <h1
            className="text-[49.312px] lg:text-[60px] font-bold leading-normal text-black text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome
          </h1>

          <p className="mt-4 text-sm lg:text-base text-gray-800 leading-relaxed">
            Kelola kos lebih mudah dan praktis dalam satu aplikasi. Masuk ke
            akun Anda untuk memantau pembayaran, tugas, dan informasi kos dengan
            cepat dan aman.
          </p>
          <button
            onClick={() => {
              handleWelcomeLogin();
              handleLogoChange();
            }}
            className="mt-6 px-12 py-4 bg-black text-white rounded-xl w-full max-w-xs font-bold lg:max-w-sm transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg"
          >
            MASUK
          </button>
        </div>
      )}

      {/* Login Form with improved styling */}
      {showLoginForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-white p-0 lg:p-0 rounded-t-3xl lg:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showFormLoginAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full max-w-md lg:max-w-lg mx-4 lg:mx-0 overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-8 lg:p-10 rounded-t-3xl lg:rounded-3xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800">
                Login
              </h2>
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPressLogin}
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPressLogin}
                  />
                </div>
              </div>

              <button
                className={`mt-8 px-12 py-4 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white rounded-xl w-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log In"}
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border-2 border-black rounded-xl w-full transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                onClick={handleShowRegister}
              >
                Register
              </button>

              {error && (
                <p className="text-center mt-4 text-red-600 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <p
                className="text-center mt-6 text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-300 underline"
                onClick={() =>
                  Swal.fire({
                    title: "Anda lupa password?",
                    icon: "info",
                    html: `
                      Klik <a href="https://wa.me/0895352281010" style="font-weight: bold; color: #FEBF00;" target="_blank" rel="noopener noreferrer">Link ini</a> untuk menghubungi admin.
                    `,
                    showCloseButton: true,
                    showCancelButton: false,
                    background: "#fff",
                    confirmButtonColor: "#FEBF00",
                  })
                }
              >
                Lupa Password?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Form with improved styling */}
      {showRegisterForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-white p-0 lg:p-0 rounded-t-3xl lg:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showFormRegisterAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full max-w-md lg:max-w-lg mx-4 lg:mx-0 overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-8 lg:p-10 rounded-t-3xl lg:rounded-3xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-800">
                Register
              </h2>
              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />
              </div>

              <button
                className="mt-8 px-12 py-4 bg-black text-white rounded-xl w-full font-bold transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg"
                onClick={handleRegister}
              >
                Register
              </button>

              <button
                className="mt-4 px-12 py-4 bg-white text-black border-2 border-black rounded-xl w-full transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
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
