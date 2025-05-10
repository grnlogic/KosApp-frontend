import { Atom, FourSquare } from "react-loading-indicators";
import { Login } from "../data/Login"; // path relatif benar
import logoKuning from "./image/logo kuning.svg"; // Logo kuning
import logoPutih from "./image/logo putih.svg"; // Logo putih
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Gunakan navigasi React Router
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2"; // Tambahkan import Swal
import { API_BASE_URL } from "../data/Config";
import axios from "axios";

// Remove these useState hooks that were incorrectly placed outside a component
// const [username, setUsername] = useState("");
// const [password, setPassword] = useState("");
// const [email, setEmail] = useState("");
// const [loginAttempts, setLoginAttempts] = useState(0);

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
  // Add the loginAttempts state inside the component
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Add new states for OTP verification
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showOtpFormAnimated, setShowOtpFormAnimated] = useState(false);
  const [otp, setOtp] = useState("");
  interface RegistrationData {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
  }

  //implementasi cookie
  const handleLoginWithAxios = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true, // Pastikan untuk mengirim cookie
        }
      );

      setIsLoggedIn(true);
      navigate("/Beranda");
    } catch (error) {
      console.error(
        "Login gagal. Periksa kembali username dan password:",
        error
      );
    }
  }; // Add this closing brace to properly close the handleLogin function

  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

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

  // Add timer for OTP resend cooldown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpTimer > 0 && isResendDisabled) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpTimer, isResendDisabled]);

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
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true, // Penting untuk menerima cookies
        }
      );

      //mereset percobaan login jika berhasil
      setLoginAttempts(0);

      // Pastikan cookie non-HTTP-only "isLoggedIn" disimpan dengan benar
      Cookies.set("isLoggedIn", "true", {
        expires: 7,
        path: "/",
        sameSite: "Strict",
      });

      const data = response.data;
      setIsLoggedIn(true);

      // Set roomId if available
      if (data.roomId) {
        setRoomId(data.roomId);
        // Save roomId to localStorage for persistent access
        localStorage.setItem("roomId", data.roomId);
      }

      // Handle role-based navigation
      if (data.role === "ADMIN") {
        setIsAdmin(true);
        // Show success notification for admin
        Swal.fire({
          title: "Login Berhasil!",
          text: "Anda berhasil masuk sebagai Admin",
          icon: "success",
          confirmButtonColor: "#FEBF00",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          navigate("/Beranda"); // Admin goes to dashboard
        });
      } else {
        // Regular user - check if they have a roomId
        if (data.roomId) {
          // Periksa apakah roomId adalah "Belum memilih kamar"
          if (data.roomId === "Belum memilih kamar") {
            // Pengguna belum memilih kamar - arahkan ke LandingPage
            Swal.fire({
              title: "Login Berhasil!",
              text: "Silakan pilih kamar Anda terlebih dahulu",
              icon: "success",
              confirmButtonColor: "#FEBF00",
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              navigate("/LandingPage");
            });
          } else {
            // Show success notification
            Swal.fire({
              title: "Login Berhasil!",
              text: "Selamat datang kembali!",
              icon: "success",
              confirmButtonColor: "#FEBF00",
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              // Navigate to the appropriate room page based on roomId
              if (data.roomId === "1") {
                navigate("/Home"); // Kamar 1 uses /Home route
              } else {
                navigate(`/Home${data.roomId}`); // Other rooms use /Home2, /Home3, etc.
              }
            });
          }
        } else {
          // ...existing code for users without roomId...
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Username atau password salah");

      // Tambah hitungan percobaan login gagal
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Jika gagal login 4 kali atau lebih, tampilkan alert lupa password
      if (newAttempts >= 4) {
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
        });
      } else {
        // Tampilkan pesan error login biasa jika belum 4 kali
        Swal.fire({
          title: "Login Gagal",
          text: "Username atau password salah",
          icon: "error",
          confirmButtonColor: "#FEBF00",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Add validation for form fields
    if (!username || !email || !password || !confirmPassword || !phoneNumber) {
      Swal.fire({
        title: "Form Tidak Lengkap",
        text: "Silakan isi semua field yang diperlukan",
        icon: "warning",
        confirmButtonColor: "#FEBF00",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: "Email Tidak Valid",
        text: "Silakan masukkan alamat email yang valid",
        icon: "warning",
        confirmButtonColor: "#FEBF00",
      });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Swal.fire({
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama",
        icon: "warning",
        confirmButtonColor: "#FEBF00",
      });
      return;
    }

    // Validate phone number format (at least 10 digits)
    if (!/^\d{10,}$/.test(phoneNumber.replace(/\D/g, ""))) {
      Swal.fire({
        title: "Nomor Telepon Tidak Valid",
        text: "Silakan masukkan nomor telepon yang valid (minimal 10 digit)",
        icon: "warning",
        confirmButtonColor: "#FEBF00",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Cek apakah nomor telepon sudah terdaftar menggunakan endpoint yang tersedia
      const usersResponse = await axios.get(`${API_BASE_URL}/api/users`);
      const users = usersResponse.data || [];

      // Cari user dengan nomor telepon yang sesuai
      const matchingUser = users.find(
        (user: { phoneNumber: string }) => user.phoneNumber === phoneNumber
      );

      if (matchingUser) {
        Swal.fire({
          title: "Nomor Telepon Sudah Terdaftar",
          text: "Nomor telepon ini sudah pernah didaftarkan. Silakan gunakan nomor telepon lain atau login dengan nomor ini.",
          icon: "warning",
          confirmButtonText: "Login",
          showCancelButton: true,
          cancelButtonText: "Ganti Nomor",
          confirmButtonColor: "#FEBF00",
        }).then((result) => {
          if (result.isConfirmed) {
            // Kembali ke halaman login
            handleBackToLogin();
          }
        });
        setIsLoading(false);
        return;
      }

      // Show a toast notification
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "info",
        title: "Mengirim kode OTP ke email Anda...",
      });

      // Ganti dengan endpoint yang meminta OTP
      const registerResponse = await fetch(
        `${backendUrl}/api/auth/request-otp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(errorText || "Gagal mengirim OTP");
      }

      // Simpan data registrasi sementara
      setRegistrationData({ username, email, password, phoneNumber });

      // Improved animation sequence - fully fade out register form before showing OTP form
      setShowFormRegisterAnimated(false);
      setTimeout(() => {
        setShowRegisterForm(false);
        setShowOtpForm(true);
        setTimeout(() => {
          setShowOtpFormAnimated(true);
          // Set timer OTP
          setOtpTimer(120);
          setIsResendDisabled(true);
          // Clear OTP field for better UX
          setOtp("");
        }, 300);
      }, 500); // Increased delay for smoother transition
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Registrasi Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat registrasi",
        icon: "error",
        confirmButtonColor: "#FEBF00",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Swal.fire({
        title: "OTP Tidak Valid",
        text: "Silakan masukkan kode OTP yang valid (6 digit)",
        icon: "warning",
        confirmButtonColor: "#FEBF00",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Show a progress indicator
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "info",
        title: "Memverifikasi OTP...",
      });

      // Gunakan axios sebagai alternatif fetch
      const verifyResponse = await axios.post(
        `${backendUrl}/api/auth/verify-otp`,
        {
          email: registrationData?.email,
          otp: otp,
          username: registrationData?.username,
          password: registrationData?.password,
          phoneNumber: registrationData?.phoneNumber,
          role: "USER",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Response handling untuk axios
      const responseData = verifyResponse.data;

      // Sisa dari fungsi tetap sama
      setShowOtpFormAnimated(false);

      setTimeout(() => {
        setShowOtpForm(false);
        // Clear registration data and OTP for security
        setRegistrationData(null);
        setOtp("");

        // Show success message
        Swal.fire({
          title: "Registrasi Berhasil!",
          text: "Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.",
          icon: "success",
          confirmButtonColor: "#FEBF00",
        });

        // Then show login form
        setShowLoginForm(true);
        setTimeout(() => {
          setShowFormLoginAnimated(true);
          // Clear registration form fields
          setUsername("");
          setPassword("");
          setEmail("");
          setConfirmPassword("");
          setPhoneNumber("");
        }, 300);
      }, 500);
    } catch (error) {
      console.error("OTP Verification error:", error);
      Swal.fire({
        title: "Verifikasi Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat verifikasi OTP",
        icon: "error",
        confirmButtonColor: "#FEBF00",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    setIsLoading(true);
    try {
      const resendResponse = await fetch(`${backendUrl}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registrationData?.email || "" }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(errorText || "Gagal mengirim ulang OTP");
      }

      // Reset timer
      setOtpTimer(120);
      setIsResendDisabled(true);

      Swal.fire({
        title: "OTP Terkirim Ulang!",
        text: "Kami telah mengirimkan kode OTP baru ke email Anda",
        icon: "success",
        confirmButtonColor: "#FEBF00",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      Swal.fire({
        title: "Gagal Mengirim Ulang",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim ulang OTP",
        icon: "error",
        confirmButtonColor: "#FEBF00",
      });
    } finally {
      setIsLoading(false);
    }
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

  // Improve back button handling from OTP to register
  const handleBackFromOtp = () => {
    setShowOtpFormAnimated(false);
    setTimeout(() => {
      setShowOtpForm(false);
      setShowRegisterForm(true);
      setTimeout(() => {
        setShowFormRegisterAnimated(true);
        // No need to clear registration data here
      }, 300);
    }, 500); // Increased delay for smoother transition
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

    // Hapus cookie isLoggedIn
    Cookies.remove("isLoggedIn", { path: "/" });

    // Hapus cookie auth dari server dengan API logout
    axios
      .post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .finally(() => {
        navigate("/");
      });
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
          logoMove
            ? "md:translate-y-[-100px] translate-y-[-40px]"
            : "translate-y-0"
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

      {/* OTP Form with Yellow Theme */}
      {showOtpForm && (
        <div
          className={`absolute bottom-0 lg:bottom-10 text-center bg-white p-0 lg:p-0 rounded-t-3xl lg:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showOtpFormAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full max-w-md lg:max-w-lg mx-4 lg:mx-0 overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-8 lg:p-10 rounded-t-3xl lg:rounded-3xl">
              {/* Yellow accent bar at top */}
              <div className="h-2 w-20 bg-[#FEBF00] rounded-full mx-auto mb-6"></div>

              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
                Verifikasi OTP
              </h2>
              <p className="text-gray-600 mb-6">
                Kode OTP telah dikirim ke{" "}
                <span className="font-semibold text-[#FEBF00]">
                  {registrationData?.email}
                </span>
              </p>

              {/* OTP input with yellow accents */}
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan 6 digit kode OTP"
                    className="w-full p-4 pl-5 text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50 text-center tracking-wider font-bold"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    maxLength={6}
                  />
                  <div className="mt-3 text-sm text-gray-500">
                    Kode berlaku selama {otpTimer > 0 ? otpTimer : 0} detik
                  </div>
                </div>
              </div>

              {/* Main action button with yellow theme */}
              <button
                className="mt-8 px-12 py-4 bg-[#FEBF00] text-white rounded-xl w-full font-bold transition-all duration-300 hover:bg-[#FEA700] hover:scale-105 active:scale-95 shadow-lg"
                onClick={handleVerifyOtp}
              >
                Verifikasi & Daftar
              </button>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-black border-2 border-black rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95 text-sm sm:text-base"
                  onClick={handleBackFromOtp}
                >
                  Kembali
                </button>

                <button
                  className={`w-full sm:w-auto px-4 sm:px-6 py-3 ${
                    isResendDisabled
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#FEBF00] text-white hover:bg-[#FEA700]"
                  } rounded-xl transition-all duration-300 ${
                    !isResendDisabled && "hover:scale-105 active:scale-95"
                  } text-sm sm:text-base whitespace-nowrap`}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled
                    ? `Kirim ulang (${otpTimer}s)`
                    : "Kirim ulang OTP"}
                </button>
              </div>

              {/* Information text */}
              <p className="mt-6 text-sm text-gray-500">
                Tidak menerima kode? Periksa folder spam atau coba kirim ulang
                setelah timer berakhir.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
