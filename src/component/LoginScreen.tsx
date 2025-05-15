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
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      // Simpan data pengguna ke localStorage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
        })
      );

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

      // Replace simple toast with detailed modal
      Swal.fire({
        title: "Kode OTP Terkirim!",
        icon: "success",
        html: `
          <div class="text-left">
            <p class="mb-2">Kode OTP telah dikirim ke: <strong>${email}</strong></p>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-3">
              <p class="font-medium">Tips Menemukan Kode OTP:</p>
              <ul class="list-disc pl-5 mt-1 text-sm">
                <li>Periksa folder <strong>Spam</strong> atau <strong>Junk</strong> jika tidak ada di Kotak Masuk</li>
                <li>Kode OTP berlaku selama 2 menit</li>
                <li>Kirim ulang kode jika belum menerima</li>
              </ul>
            </div>
          </div>
        `,
        confirmButtonColor: "#FEBF00",
        confirmButtonText: "Lanjutkan",
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

  // Add auto-reminder function
  useEffect(() => {
    let reminderTimeout: ReturnType<typeof setTimeout>;

    if (showOtpForm && otpTimer === 60) {
      // Half the initial time passed
      reminderTimeout = setTimeout(() => {
        // Show reminder toast if OTP form is still shown
        if (showOtpForm) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 8000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "info",
            title: "Belum menerima kode OTP?",
            html: "Cek folder <b>Spam</b> atau <b>Junk</b> di email Anda",
          });
        }
      }, 1000);
    }

    return () => clearTimeout(reminderTimeout);
  }, [otpTimer, showOtpForm]);

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
            ? "sm:translate-y-[-60px] md:translate-y-[-80px] lg:translate-y-[-100px] xl:translate-y-[-120px] translate-y-[-40px]"
            : "translate-y-0"
        }`}
      >
        <img
          src={logoKuning}
          alt="Logo Kuning"
          className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-60 xl:h-60 transition-all duration-1000 ${
            logoColorChange
              ? "opacity-0 scale-90 rotate-6"
              : "opacity-100 scale-100 rotate-0"
          } drop-shadow-xl`}
        />

        <img
          src={logoPutih}
          alt="Logo Putih"
          className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-60 xl:h-60 absolute transition-all duration-1000 ${
            logoColorChange
              ? "opacity-100 translate-y-[-150px] sm:translate-y-[-170px] md:translate-y-[-180px] lg:translate-y-[-200px] scale-100"
              : "opacity-0 scale-90"
          } drop-shadow-xl`}
        />
      </div>

      {/* Welcome Content with improved styling */}
      {showWelcome && !showLoginForm && !showRegisterForm && (
        <div
          className={`absolute bottom-0 sm:bottom-4 md:bottom-6 lg:bottom-10 text-center bg-gradient-to-br from-[#FEBF00] to-[#FEA700] p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 rounded-2xl shadow-2xl transition-all duration-1000 ${
            fadeOutWelcome
              ? "opacity-0 translate-y-20"
              : contentMove
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-[90%] sm:w-[70%] md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto`}
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold leading-normal text-black text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
            Kelola kos lebih mudah dan praktis dalam satu aplikasi. Masuk ke
            akun Anda untuk memantau pembayaran, tugas, dan informasi kos dengan
            cepat dan aman.
          </p>
          <button
            onClick={() => {
              handleWelcomeLogin();
              handleLogoChange();
            }}
            className="mt-4 sm:mt-5 md:mt-6 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-black text-white rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md font-bold transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg"
          >
            MASUK
          </button>
        </div>
      )}

      {/* Login Form with improved styling */}
      {showLoginForm && (
        <div
          className={`absolute bottom-0 sm:bottom-4 md:bottom-6 lg:bottom-10 text-center bg-white p-0 rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showFormLoginAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full sm:w-[90%] md:w-[80%] max-w-sm sm:max-w-md md:max-w-lg mx-auto overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-6 sm:p-7 md:p-8 lg:p-10 rounded-t-3xl sm:rounded-3xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">
                Login
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPressLogin}
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 pr-12 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPressLogin}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                className={`mt-6 sm:mt-7 md:mt-8 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white rounded-xl w-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Memuat..." : "Masuk"}
              </button>

              <button
                className="mt-3 sm:mt-4 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-white text-black border-2 border-black rounded-xl w-full transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                onClick={handleShowRegister}
              >
                Daftar
              </button>

              {error && (
                <p className="text-center mt-4 text-red-600 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <p
                className="text-center mt-4 sm:mt-5 md:mt-6 text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-300 underline"
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
          className={`absolute bottom-0 sm:bottom-4 md:bottom-6 lg:bottom-10 text-center bg-white p-0 rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showFormRegisterAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full sm:w-[90%] md:w-[80%] max-w-sm sm:max-w-md md:max-w-lg mx-auto overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-6 sm:p-7 md:p-8 lg:p-10 rounded-t-3xl sm:rounded-3xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">
                Daftar
              </h2>
              <div className="space-y-4 md:space-y-5">
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />

                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 pr-12 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPressRegister}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    aria-label={
                      showRegisterPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showRegisterPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 pr-12 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPressRegister}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6 w-5 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPressRegister}
                />
              </div>

              <button
                className="mt-6 sm:mt-7 md:mt-8 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-black text-white rounded-xl w-full font-bold transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg"
                onClick={handleRegister}
              >
                Daftar
              </button>

              <button
                className="mt-3 sm:mt-4 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-white text-black border-2 border-black rounded-xl w-full transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95"
                onClick={handleBackToLogin}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Form with improved styling */}
      {showOtpForm && (
        <div
          className={`absolute bottom-0 sm:bottom-4 md:bottom-6 lg:bottom-10 text-center bg-white p-0 rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-1000 ${
            showOtpFormAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          } w-full sm:w-[90%] md:w-[80%] max-w-sm sm:max-w-md md:max-w-lg mx-auto overflow-hidden`}
        >
          <div className="space-y-4">
            <div className="bg-white p-6 sm:p-7 md:p-8 lg:p-10 rounded-t-3xl sm:rounded-3xl">
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#FEBF00] flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base">
                  1
                </div>
                <div className="h-1 w-6 sm:w-7 md:w-8 bg-[#FEBF00]"></div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#FEBF00] flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base">
                  2
                </div>
                <div className="h-1 w-6 sm:w-7 md:w-8 bg-gray-300"></div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm md:text-base">
                  3
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                Verifikasi OTP
              </h2>

              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#FEBF00]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="text-sm sm:text-base text-gray-600">
                  Kode dikirim ke{" "}
                  <span className="font-semibold text-[#FEBF00]">
                    {registrationData?.email}
                  </span>
                </p>
              </div>

              {/* Alert box for spam folder reminder */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6 text-left text-sm sm:text-base">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-yellow-700">
                      Jika email tidak ditemukan di Kotak Masuk, silakan periksa
                      folder <strong>Spam</strong> atau <strong>Junk</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced OTP input with digit-like display */}
              <div className="space-y-4 sm:space-y-5">
                <div className="relative">
                  <label className="block text-left text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Masukkan 6 digit kode OTP
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 text-base sm:text-lg border-2 border-orange-200 rounded-xl focus:border-[#FEBF00] focus:outline-none transition-all duration-300 bg-gray-50 text-center tracking-[0.3em] sm:tracking-[0.5em] font-bold"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    maxLength={6}
                  />

                  {/* Visual representation of digits */}
                  <div className="flex justify-center gap-1 sm:gap-2 mt-2">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-6 sm:w-8 h-1 rounded-full ${
                          index < otp.length ? "bg-[#FEBF00]" : "bg-gray-300"
                        } transition-all duration-300`}
                      ></div>
                    ))}
                  </div>

                  {/* Timer with visual indicator */}
                  <div className="mt-3 sm:mt-4 flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-[#FEBF00]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Kode berlaku selama{" "}
                      <span className="font-bold text-[#FEBF00]">
                        {otpTimer > 0 ? otpTimer : 0}
                      </span>{" "}
                      detik
                    </div>
                  </div>
                </div>
              </div>

              {/* Main action button with yellow theme */}
              <button
                className="mt-6 sm:mt-7 md:mt-8 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-[#FEBF00] text-white rounded-xl w-full font-bold transition-all duration-300 hover:bg-[#FEA700] hover:scale-105 active:scale-95 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
              >
                {otp.length !== 6
                  ? "Masukkan 6 digit kode"
                  : "Verifikasi & Daftar"}
              </button>

              <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <button
                  className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-black border-2 border-black rounded-xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base"
                  onClick={handleBackFromOtp}
                >
                  Kembali
                </button>

                <button
                  className={`w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center justify-center gap-1 sm:gap-2 ${
                    isResendDisabled
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#FEBF00] text-white hover:bg-[#FEA700]"
                  } rounded-xl transition-all duration-300 ${
                    !isResendDisabled && "hover:scale-105 active:scale-95"
                  } text-xs sm:text-sm md:text-base whitespace-nowrap`}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled ? (
                    <>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>{otpTimer}d</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>Kirim ulang OTP</span>
                    </>
                  )}
                </button>
              </div>

              {/* Improved help text */}
              <div className="mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg">
                <p className="font-medium mb-1 text-left">Bantuan:</p>
                <ul className="list-disc text-left pl-4 sm:pl-5">
                  <li>Pastikan email yang dimasukkan benar</li>
                  <li>
                    Periksa folder Spam/Junk jika tidak ada di Kotak Masuk
                  </li>
                  <li>Gunakan fitur kirim ulang jika tidak menerima kode</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
