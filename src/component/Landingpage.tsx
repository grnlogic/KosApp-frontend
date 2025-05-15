import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinHouse,
  Phone,
  Mail,
  UserCircle,
  House,
  CreditCard,
  MessageCircleMore,
  CalendarCheck,
  Key,
  Shield,
  ArrowRight,
  X,
  Clock,
  Info,
  Check,
  Star,
  Award,
  ChevronRight,
  Building,
  Home,
  Bed,
} from "lucide-react";
import { owner } from "./App/Api/owner";
import { fitur as fiturData } from "./App/Api/fitur";
import TentangKosApp from "./TentangKosApp";
import DetailRoom from "./DetailRoom";
import axios from "axios"; // Import axios for API calls
import {
  authApi,
  getAuthToken,
  getUserIdFromCookieOrStorage,
} from "../utils/apiUtils";

// Import the room image that will be used for all cards
import roomImage from "../component/image2/20250415_113110.jpg";
// Import location background image from the same folder
import locationImage from "../component/image2/20250415_113202.jpg";
import Swal, { SweetAlertResult } from "sweetalert2";

interface Card {
  id: string; // Change id type to string
  nomorKamar: string;
  status: string;
  hargaBulanan: number;
  fasilitas: string;
  image?: string; // Optional field for image
  title: string; // Add title
  description: string; // Add description
  price: number; // Add price
}

// Add this type definition after the Card interface
interface RoomRegistrationRequest {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string; // Add phoneNumber field
  requestedRoomId: string | number;
  roomNumber: string; // Add roomNumber field
  durasiSewa: number; // dalam bulan
  tanggalMulai: string;
  metodePembayaran: string;
  totalPembayaran: number;
  timestamp: number;
  status: "pending";
}

// Add fallback data in case the API fails - this ensures content always appears
const fallbackRooms = [
  {
    id: "fallback-1",
    nomorKamar: "101",
    status: "kosong",
    hargaBulanan: 850000,
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Lemari, Meja, Kursi",
    title: "Kamar 101",
    description: "Kamar nyaman dengan fasilitas lengkap",
    price: 850000,
  },
  {
    id: "fallback-2",
    nomorKamar: "102",
    status: "kosong",
    hargaBulanan: 950000,
    fasilitas: "AC, WiFi, Kamar Mandi Dalam, Lemari, Meja, Kursi, TV",
    title: "Kamar 102",
    description: "Kamar premium dengan TV",
    price: 950000,
  },
  {
    id: "fallback-3",
    nomorKamar: "103",
    status: "terisi",
    hargaBulanan: 800000,
    fasilitas: "WiFi, Kamar Mandi Dalam, Lemari, Meja",
    title: "Kamar 103",
    description: "Kamar standar yang nyaman",
    price: 800000,
  },
];

// Add this function before saveRoomRegistrationRequest
const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(
      "https://manage-kost-production.up.railway.app/api/debug/ping",
      { timeout: 5000 }
    );
    return response.status === 200;
  } catch (error) {
    console.warn("API connection check failed:", error);
    return false;
  }
};

// Helper function to get user ID from cookie or storage
const getLocalUserId = (): number | null => {
  // Try to get from localStorage first
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.userId) return userData.userId;
    } catch (e) {
      console.error("Error parsing userData from localStorage:", e);
    }
  }

  // Try to extract from JWT if available
  const token = getAuthToken();

  if (token) {
    try {
      // Simple JWT payload extraction - not for production
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || null;
    } catch (e) {
      console.error("Error extracting userId from token:", e);
    }
  }

  return null;
};

// Tambahkan fungsi helper untuk mengelola scroll
const scrollHelper = {
  disable: () => {
    document.body.classList.add("overflow-hidden");
  },
  enable: () => {
    document.body.classList.remove("overflow-hidden");
    // Reset jika ada style inline yang ditambahkan oleh SweetAlert
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  },
  reset: () => {
    // Fungsi ini memastikan scroll selalu dikembalikan
    setTimeout(() => {
      document.body.classList.remove("overflow-hidden");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 100);
  },
};

// Update the saveRoomRegistrationRequest function to include room rental information
const saveRoomRegistrationRequest = async (
  roomId: string | number,
  roomNumber: string,
  hargaBulanan: number
) => {
  // Check if user is logged in - this is a simplified example
  // In a real app, you might check from your auth context or global state
  const isLoggedIn = document.cookie.includes("isLoggedIn=true");

  if (!isLoggedIn) {
    // Show login required modal
    Swal.fire({
      title: "Login Diperlukan",
      text: "Silakan login terlebih dahulu untuk mendaftar kamar",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Batal",
      confirmButtonColor: "#000",
      didOpen: () => {
        // Disable scroll when modal opens
        scrollHelper.disable();
      },
      willClose: () => {
        // Enable scroll when modal closes
        scrollHelper.enable();
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page or show login modal
        window.location.href = "/login";
      }
      // Pastikan scroll kembali normal
      scrollHelper.reset();
    });
    return;
  }

  // Get today's date formatted as yyyy-mm-dd
  const today = new Date().toISOString().split("T")[0];

  // Show registration and rental form modal
  Swal.fire({
    title: `Daftar & Sewa Kamar ${roomNumber}`,
    html: `
      <div class="text-left mb-4">
        <h3 class="font-bold text-lg mb-2">Data Penyewa</h3>
        <input id="name" class="swal2-input w-full" placeholder="Nama Lengkap">
        <input id="email" class="swal2-input w-full" placeholder="Email">
        <input id="phone" class="swal2-input w-full" placeholder="Nomor Telepon (Opsional)">
      </div>
      <div class="text-left">
        <h3 class="font-bold text-lg mb-2">Informasi Sewa</h3>
        <div class="mb-2">
          <label class="block text-sm text-gray-700">Durasi Sewa (Bulan)</label>
          <select id="duration" class="swal2-input w-full">
            <option value="1">1 Bulan</option>
            <option value="3">3 Bulan</option>
            <option value="6">6 Bulan</option>
            <option value="12">12 Bulan</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-700">Tanggal Mulai</label>
          <input type="date" id="startDate" class="swal2-input w-full" value="${today}" min="${today}">
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-700">Metode Pembayaran</label>
          <select id="paymentMethod" class="swal2-input w-full">
            <option value="transfer">Transfer Bank</option>
            <option value="cash">Tunai</option>
          </select>
        </div>
        <div class="mt-3 p-3 bg-yellow-50 rounded">
          <p class="font-semibold">Harga per bulan: Rp ${hargaBulanan.toLocaleString()}</p>
          <p id="totalPayment" class="font-bold text-lg">Total: Rp ${hargaBulanan.toLocaleString()}</p>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Daftar & Sewa",
    cancelButtonText: "Batal",
    confirmButtonColor: "#000",
    width: 600,
    didOpen: () => {
      // Disable scroll when modal opens
      scrollHelper.disable();

      // Update total payment when duration changes
      const durationSelect = document.getElementById(
        "duration"
      ) as HTMLSelectElement;
      const updateTotal = () => {
        const duration = parseInt(durationSelect.value);
        const total = hargaBulanan * duration;
        const totalElement = document.getElementById("totalPayment");
        if (totalElement) {
          totalElement.textContent = `Total: Rp ${total.toLocaleString()}`;
        }
      };

      durationSelect.addEventListener("change", updateTotal);
    },
    willClose: () => {
      // Enable scroll when modal closes
      scrollHelper.enable();
    },
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement)
        .value;
      const phone = (document.getElementById("phone") as HTMLInputElement)
        .value;
      const duration = parseInt(
        (document.getElementById("duration") as HTMLSelectElement).value
      );
      const startDate = (
        document.getElementById("startDate") as HTMLInputElement
      ).value;
      const paymentMethod = (
        document.getElementById("paymentMethod") as HTMLSelectElement
      ).value;

      if (!name || !email) {
        Swal.showValidationMessage("Harap isi nama dan email");
        return false;
      }

      return {
        name,
        email,
        phone,
        duration,
        startDate,
        paymentMethod,
        totalPayment: hargaBulanan * duration,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      // Show loading indicator
      Swal.fire({
        title: "Memproses...",
        html: "Memeriksa koneksi dan mengirim permintaan",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          scrollHelper.disable();
        },
        willClose: () => {
          scrollHelper.enable();
        },
      });

      // First check if API is reachable
      const isApiReachable = await checkApiConnection();

      // Create registration request
      const request: RoomRegistrationRequest = {
        id: `req-${Date.now()}`,
        username: result.value.name,
        email: result.value.email,
        phoneNumber: result.value.phone || "",
        requestedRoomId: roomId,
        roomNumber: roomNumber,
        durasiSewa: result.value.duration,
        tanggalMulai: result.value.startDate,
        metodePembayaran: result.value.paymentMethod,
        totalPembayaran: result.value.totalPayment,
        timestamp: Date.now(),
        status: "pending",
      };

      if (!isApiReachable) {
        // If API is not reachable, store locally and inform user
        const existingRequests = JSON.parse(
          localStorage.getItem("pendingRoomRequests") || "[]"
        );
        existingRequests.push(request);
        localStorage.setItem(
          "pendingRoomRequests",
          JSON.stringify(existingRequests)
        );

        Swal.fire({
          title: "Koneksi Server Gagal",
          text: "Server tidak dapat dijangkau. Permintaan Anda telah disimpan secara lokal dan akan dikirim ke admin saat koneksi kembali normal.",
          icon: "warning",
          confirmButtonColor: "#000",
          didOpen: () => {
            scrollHelper.disable();
          },
          willClose: () => {
            scrollHelper.enable();
          },
        });
        return;
      }

      // Get token from cookies or localStorage if needed
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      const userId = getLocalUserId();

      if (!userId) {
        // Close loading indicator if no userId found
        Swal.close();
        scrollHelper.reset();

        Swal.fire({
          title: "Error",
          text: "User ID tidak ditemukan. Silakan login ulang.",
          icon: "error",
          confirmButtonColor: "#000",
          didOpen: () => {
            scrollHelper.disable();
          },
          willClose: () => {
            scrollHelper.enable();
          },
        });
        return;
      }

      // Add timeout and better error handling for the request
      authApi
        .post(
          "/room-requests/request",
          {
            roomId: roomId,
            durasiSewa: result.value.duration,
            tanggalMulai: result.value.startDate,
            metodePembayaran: result.value.paymentMethod,
          },
          {
            headers: {
              userId: userId,
            },
          }
        )
        .then((response) => {
          console.log("Room request response:", response.data);
          // Always close the loading indicator
          Swal.close();
          scrollHelper.reset();

          Swal.fire({
            title: "Permintaan Terkirim!",
            text: `Permintaan pendaftaran dan penyewaan kamar ${roomNumber} Anda telah dikirim. Admin akan memprosesnya segera.`,
            icon: "success",
            confirmButtonColor: "#000",
            didOpen: () => {
              scrollHelper.disable();
            },
            willClose: () => {
              scrollHelper.enable();
            },
          });
        })
        .catch((error) => {
          // Always close the loading indicator
          Swal.close();
          scrollHelper.reset();

          console.error("Error sending room request:", error);

          let errorMessage = "Koneksi gagal";

          if (error.response) {
            // The server responded with a status code outside of 2xx range
            errorMessage =
              error.response.data?.message ||
              `Error ${error.response.status}: Permintaan tidak dapat diproses`;
          } else if (error.request) {
            // The request was made but no response was received
            errorMessage = "Server tidak merespon, silakan coba lagi nanti";
            if (error.code === "ECONNABORTED") {
              errorMessage = "Koneksi timeout, silakan coba lagi nanti";
            }
          } else {
            // Something happened in setting up the request
            errorMessage = error.message || "Terjadi kesalahan";
          }

          Swal.fire({
            title: "Gagal Mengirim Permintaan",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#000",
            didOpen: () => {
              scrollHelper.disable();
            },
            willClose: () => {
              scrollHelper.enable();
            },
          });

          // For debugging - store the failed request in localStorage
          const failedRequests = JSON.parse(
            localStorage.getItem("failedRoomRequests") || "[]"
          );
          failedRequests.push({
            request,
            error: {
              message: errorMessage,
              detail: error.toString(),
              timestamp: new Date().toISOString(),
            },
          });
          localStorage.setItem(
            "failedRoomRequests",
            JSON.stringify(failedRequests)
          );
        });

      // Add a safety timeout to ensure loading state never gets stuck
      setTimeout(() => {
        if (Swal.isLoading()) {
          Swal.close();
          scrollHelper.reset();

          Swal.fire({
            title: "Timeout",
            text: "Permintaan membutuhkan waktu terlalu lama. Silakan coba lagi nanti.",
            icon: "warning",
            confirmButtonColor: "#000",
            didOpen: () => {
              scrollHelper.disable();
            },
            willClose: () => {
              scrollHelper.enable();
            },
          });
        }
      }, 15000); // 15 seconds safety timeout
    } else {
      // Jika pengguna cancel atau tutup dialog
      scrollHelper.reset();
    }
  });
};

//card list
const CardList = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<number>(6);
  const [apiTimeoutReached, setApiTimeoutReached] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Improved mobile detection with additional handler for network conditions
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);

      return isMobileDevice;
    };

    const isMobileDevice = checkMobile();
    window.addEventListener("resize", checkMobile);

    // More robust API fetching with better error handling for mobile
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);

      // Set a shorter timeout for mobile devices
      const timeoutDuration = isMobileDevice ? 5000 : 10000;

      try {
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            setApiTimeoutReached(true);
            reject(new Error("Waktu habis saat memuat data kamar"));
          }, timeoutDuration);
        });

        // Define the actual fetch function
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://manage-kost-production.up.railway.app/api/kamar"
            );

            if (response.data && Array.isArray(response.data)) {
              return response.data;
            } else {
              throw new Error("Format data tidak valid");
            }
          } catch (err) {
            console.error("API Error:", err);
            throw new Error("Gagal memuat data dari server");
          }
        };

        // Race between timeout and data fetching
        const data = await Promise.race([fetchData(), timeoutPromise]);

        // Process received data
        const processedCards = data.map((item: any) => ({
          id:
            item.id ||
            `kamar-${
              item.nomorKamar || Math.random().toString(36).substring(7)
            }`,
          nomorKamar: item.nomorKamar || "???",
          status: item.status || "kosong",
          hargaBulanan: item.hargaBulanan || 0,
          fasilitas: (item.fasilitas || "").substring(0, 100),
          title: item.title || `Kamar ${item.nomorKamar || ""}`,
          description: item.description || item.fasilitas || "",
          price: item.price || item.hargaBulanan || 0,
        }));

        setCards(processedCards);
        setUsingFallbackData(false);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading rooms:", err);

        // On error, use fallback data to ensure content always appears
        setCards(fallbackRooms);
        setUsingFallbackData(true);
        setIsLoading(false);

        if (apiTimeoutReached) {
          setError("Koneksi lambat terdeteksi. Menampilkan contoh kamar.");
        } else {
          setError("Gagal memuat data kamar. Menampilkan contoh kamar.");
        }
      }
    };

    // Add a small delay before fetching on mobile to let the UI render first
    if (isMobileDevice) {
      setTimeout(fetchRooms, 300);
    } else {
      fetchRooms();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load more cards function
  const loadMoreCards = () => {
    setVisibleCards((prevCount) => prevCount + 6);
  };

  // Add function to handle card selection with nav hiding
  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    // Gunakan fungsi helper
    scrollHelper.disable();
  };

  // Add function to handle closing with nav restoration
  const handleCloseModal = () => {
    setSelectedCard(null);
    // Gunakan fungsi helper
    scrollHelper.enable();
  };

  // Better loading state with skeleton cards - now more visible
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-4 text-center">
          <motion.div
            className="inline-flex items-center gap-2 py-2 px-4 bg-yellow-100 rounded-full text-yellow-700 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Clock size={18} className="text-yellow-600" />
            </motion.div>
            <span>Memuat data kamar...</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(isMobile ? 2 : 3)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-56 bg-gradient-to-r from-gray-100 to-gray-200 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      delay: 0.2,
                    }}
                  />
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      delay: 0.3,
                    }}
                  />
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                      delay: 0.4,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                        delay: 0.5,
                      }}
                    />
                  </div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/4 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                        delay: 0.6,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Error state - now shows fallback data instead of just an error message
  if (error) {
    return (
      <div>
        <div className="mb-4 px-6 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg">
          {error}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {fallbackRooms.map((item, index) => (
            <RoomCard
              key={item.id}
              item={item}
              index={index}
              isMobile={isMobile}
              onSelect={() => setSelectedCard(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  // No data state
  if (cards.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 px-4 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Tidak ada kamar tersedia saat ini. Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  // Main render with optimized approach - only show a subset initially
  const displayedCards = cards.slice(0, visibleCards);

  return (
    <div className="p-3 md:p-6">
      {usingFallbackData && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-lg">
          Menampilkan contoh kamar karena koneksi internet lambat
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {displayedCards.map((item, index) => (
          <RoomCard
            key={item.id}
            item={item}
            index={index}
            isMobile={isMobile}
            onSelect={() => handleCardSelect(item)} // Use the new handler
          />
        ))}
      </div>

      {/* Load more button - only shown if there are more cards to display */}
      {visibleCards < cards.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreCards}
            className="px-6 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            Lihat Lebih Banyak
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedCard && (
        <DetailRoom
          card={{
            ...selectedCard,
            image: roomImage,
          }}
          onClose={handleCloseModal} // Use the new close handler
        />
      )}
    </div>
  );
};

// Extract the card rendering to a separate component for better performance
const RoomCard = ({
  item,
  index,
  isMobile,
  onSelect,
}: {
  item: Card;
  index: number;
  isMobile: boolean;
  onSelect: () => void;
}) => {
  return (
    <motion.div
      key={item.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 border border-yellow-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: isMobile ? 0 : index * 0.05 }}
    >
      <div className="relative">
        <div className="w-full h-56 bg-gray-100 relative">
          <img
            src={roomImage}
            alt={`Kamar ${item.nomorKamar}`}
            className={`w-full h-full object-cover transition-all ${
              item.status !== "kosong" ? "blur-[4px]" : ""
            }`}
            loading="lazy"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              item.status === "kosong"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {item.status === "kosong" ? "Tersedia" : "Tidak Tersedia"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Kamar {item.nomorKamar}
        </h1>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {item.fasilitas}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-yellow-600">
            Rp {item.hargaBulanan.toLocaleString("id-ID")}
            <span className="text-xs text-gray-500 font-normal">/bulan</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onSelect}
              className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-600 hover:text-white transition duration-300"
            >
              Detail <ArrowRight size={16} />
            </button>
            {/* Hapus tombol "Daftar & Sewa" karena fungsionalitasnya akan digabung ke dalam form di DetailRoom */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

//fitur
const Fitur = () => {
  const iconMap = {
    1: <House className="w-12 h-12 text-yellow-600" />,
    2: <CreditCard className="w-12 h-12 text-yellow-600" />,
    3: <MessageCircleMore className="w-12 h-12 text-yellow-600" />,
    4: <CalendarCheck className="w-12 h-12 text-yellow-600" />,
    5: <Key className="w-12 h-12 text-yellow-600" />,
    6: <Shield className="w-12 h-12 text-yellow-600" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {fiturData.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-yellow-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-4 rounded-full bg-yellow-50 mb-4">
            {iconMap[item.id as unknown as keyof typeof iconMap] || (
              <House className="w-12 h-12 text-yellow-600" />
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h1>
          <p className="text-sm text-gray-600 text-center">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

//owner
const Owner = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {owner.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <img
              src={item.image}
              alt={
                typeof item.name === "string"
                  ? item.name
                  : String(item.name || "No name available")
              }
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
              <h1 className="text-xl font-bold text-white">{item.name}</h1>
            </div>
          </div>
          <div className="p-5 space-y-2">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-yellow-600" />
              {item.email}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-yellow-600" />
              {item.phone}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <MapPinHouse size={16} className="text-yellow-600" />
              {item.address}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const words = ["Tempat nyaman", "Pilihan tepat", "Harga terjangkau"];

const LandingPage: React.FC = () => {
  const [showTentangKosApp, setShowTentangKosApp] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(words[0]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); // Add loading state for the entire page
  const [detailRoomOpen, setDetailRoomOpen] = useState(false);

  // Create a computed state to track if any popup is open
  const isAnyPopupOpen = showTentangKosApp || showComingSoon || detailRoomOpen;

  // Detect mobile devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile detection
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);

      // Apply specific mobile fixes when on mobile
      if (isMobileDevice) {
        // Fix viewport height issues on mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        // Ensure body fills entire screen on mobile
        document.body.style.minHeight = "100vh";
        document.body.style.minHeight = "calc(var(--vh, 1vh) * 100)";
        document.body.style.overflowX = "hidden"; // Prevent horizontal scroll on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    // Simulate loading time - shorter on mobile for better UX
    const loadingTimer = setTimeout(
      () => {
        setIsPageLoading(false);
      },
      isMobile ? 1000 : 1500
    ); // Shorter loading time on mobile

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % words.length;
        setDisplayedText(words[nextIndex]);
        return nextIndex;
      });
    }, 2000); // Changed to 2 seconds for better readability

    return () => clearInterval(typingInterval);
  }, []);

  // Show attractive loading screen - enhanced for mobile
  if (isPageLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center justify-center z-50 px-4">
        <div className="w-20 h-20 relative mb-6">
          {/* Animated circles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-4 border-yellow-400"
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3],
                borderWidth: ["4px", "2px", "4px"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Center icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Building className="w-10 h-10 text-yellow-600" />
          </motion.div>
        </div>

        <motion.h2
          className="text-xl font-bold text-yellow-600 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          MIMIN KOST
        </motion.h2>

        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-gray-600">Memuat halaman</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-yellow-50 to-white overflow-x-hidden">
      {/* Header - Modified for better mobile display */}
      <div
        className={`fixed top-0 w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg transition-all duration-200 ${
          isAnyPopupOpen
            ? "opacity-0 pointer-events-none transform -translate-y-full z-0"
            : "opacity-100 z-40"
        }`}
      >
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="font-extrabold text-2xl md:text-4xl text-white drop-shadow-md">
            MIMIN KOST
          </h1>
          <div className="h-6 md:h-8 flex items-center justify-center">
            <motion.h2
              key={displayedText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="font-medium text-lg md:text-2xl text-white"
            >
              {displayedText}
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Main content - adjusted padding for mobile */}
      <article className="relative z-10 container mx-auto px-3 pt-20 pb-6 md:px-4 md:py-16">
        {/* SECTION 1: Sambutan untuk pengguna baru */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl md:rounded-3xl shadow-lg md:shadow-xl mb-8 md:mb-16 mt-8 md:mt-10">
          <div className="absolute -right-24 -top-24 w-48 h-48 md:w-64 md:h-64 rounded-full bg-yellow-300 opacity-30"></div>
          <div className="absolute -left-24 -bottom-24 w-64 h-64 md:w-80 md:h-80 rounded-full bg-yellow-300 opacity-30"></div>
          <div className="relative py-12 md:py-26 px-4 md:px-6 lg:px-20">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Selamat Datang di Portal Kost Terbaik
              </h2>
              <p className="text-base md:text-xl text-white mb-6 md:mb-8 opacity-90">
                Temukan hunian nyaman dan terjangkau untuk kebutuhan Anda. Kami
                menyediakan berbagai pilihan kamar sesuai dengan keinginan dan
                anggaran Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-yellow-600 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-50 transition duration-300"
                  onClick={() => setShowComingSoon(true)}
                >
                  Cari Kamar Sekarang
                </motion.button>
                <motion.button
                  onClick={() => setShowTentangKosApp(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-white text-white rounded-full font-bold text-lg shadow-lg hover:bg-white hover:text-yellow-600 transition duration-300"
                >
                  Pelajari Layanan Kami
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Mimin Kost - Mitra Unggulan with Owner information combined */}
        <section className="mb-8 md:mb-16">
          <motion.div
            className="text-center mb-6 md:mb-10"
            initial={!isMobile ? { opacity: 0, y: 30 } : { opacity: 1 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 relative">
              Mimin Kost - Mitra Unggulan
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto px-2">
              Mimin Kost adalah hunian eksklusif yang dikelola dengan penuh
              dedikasi oleh keluarga yang ramah dan profesional
            </p>
          </motion.div>

          {/* Keluarga Mimin Kost (Owner) Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-700">
              Keluarga Pengelola
            </h3>
            <Owner />
          </motion.div>

          {/* Highlight Mimin Kost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 p-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Home className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold">Fasilitas Terbaik</h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>WiFi kecepatan tinggi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Keamanan 24 jam</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Area parkir luas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Ruang komunal nyaman</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MapPinHouse className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold">Lokasi Strategis</h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>5 menit ke pusat kota</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Dekat dengan kampus dan perkantoran</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Akses transportasi mudah</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Lingkungan tenang dan nyaman</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Room List Heading */}
          <motion.div
            className="text-center mb-6 md:mb-10"
            initial={!isMobile ? { opacity: 0, y: 30 } : { opacity: 1 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 relative">
              Kamar Tersedia di Mimin Kost
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto px-2">
              Pilih kamar sesuai kebutuhan dan anggaran Anda.
            </p>
          </motion.div>

          {/* This is where we render the CardList component */}
          <motion.div
            initial={!isMobile ? { opacity: 0, y: 30 } : { opacity: 1 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardList />
          </motion.div>
        </section>

        {/* SECTION 4: Promosi KosApp Coming Soon */}
        <section className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl shadow-xl p-8 md:p-12 mb-8 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-300 rounded-full text-yellow-800 font-medium mb-4">
              <Clock size={16} />
              <span>Segera Hadir</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              KosApp - Revolusi Pengelolaan Kost Modern
            </h2>
            <p className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
              KosApp adalah aplikasi inovatif yang menghubungkan pemilik kost
              dengan penyewa potensial. Nikmati kemudahan pencarian, pembayaran,
              dan pengelolaan properti kost dalam satu platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-yellow-600 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-50 transition duration-300"
              onClick={() => setShowComingSoon(true)}
            >
              Daftar Minat
            </motion.button>
          </motion.div>
        </section>

        {/* Fitur KosApp Section */}
        <section className="mb-16">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="inline-block text-3xl md:text-4xl font-bold text-gray-800 mb-3 relative">
              Fitur Utama KosApp
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Nikmati berbagai fitur canggih yang akan mengubah cara Anda
              mengelola dan menyewa properti kost
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Fitur />
          </motion.div>
        </section>

        {/* Modals */}
        <AnimatePresence>
          {showTentangKosApp && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTentangKosApp(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full relative overflow-auto my-4 max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative elements */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30"></div>

                {/* Top header section */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 relative z-10">
                  <button
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 transition-colors rounded-full p-1.5 text-white"
                    onClick={() => setShowTentangKosApp(false)}
                  >
                    <X size={24} />
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white rounded-full p-3">
                      <Info className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Tentang KosApp
                    </h2>
                  </div>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Aplikasi manajemen kost modern untuk memudahkan pemilik dan
                    penyewa properti kost.
                  </p>
                </div>

                {/* Main content */}
                <div className="p-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-6">
                      <motion.div
                        className="bg-yellow-50 rounded-xl p-6 border border-yellow-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
                          <Award className="w-6 h-6" /> Visi Kami
                        </h3>
                        <p className="text-gray-700">
                          Menjadi solusi terdepan dalam pengelolaan properti
                          kost yang efisien, transparan, dan menguntungkan bagi
                          semua pihak.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Star className="w-6 h-6" /> Keunggulan Kami
                        </h3>
                        <ul className="space-y-2">
                          {[
                            "Antarmuka yang mudah digunakan",
                            "Pengelolaan pembayaran otomatis",
                            "Notifikasi real-time",
                            "Laporan keuangan lengkap",
                          ].map((item, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <Check
                                size={18}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                      <motion.div
                        className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Latar Belakang
                        </h3>
                        <p className="text-gray-700">
                          KosApp lahir dari pemahaman mendalam tentang tantangan
                          yang dihadapi oleh pemilik dan penghuni kost. Kami
                          menciptakan solusi yang memudahkan pengelolaan
                          properti dan meningkatkan pengalaman penghuni.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-blue-50 rounded-xl p-6 border border-blue-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-xl font-bold text-blue-700 mb-3">
                          Testimoni Pengguna
                        </h3>
                        <div className="italic text-gray-700 border-l-4 border-blue-200 pl-4 py-2">
                          "KosApp sangat membantu saya mengelola 3 properti kost
                          sekaligus. Pembayaran jadi tepat waktu dan komunikasi
                          dengan penghuni jadi lebih mudah."
                        </div>
                        <p className="text-right mt-2 text-sm font-medium">
                          — Budi Setiawan, Pemilik Kost
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Punya pertanyaan? Hubungi kami
                      </p>
                      <p className="text-yellow-600 font-medium">
                        support@kosapp.id
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center gap-2"
                      onClick={() => {
                        setShowTentangKosApp(false);
                        setShowComingSoon(true);
                      }}
                    >
                      Daftar Minat <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowComingSoon(false);
              scrollHelper.enable(); // Pastikan scroll kembali saat modal ditutup
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl shadow-2xl p-8 md:p-10 max-w-xl w-full relative overflow-hidden my-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-yellow-300 opacity-30"></div>

              {/* Close button */}
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors z-10"
                onClick={() => {
                  setShowComingSoon(false);
                  scrollHelper.enable(); // Pastikan scroll kembali saat tombol close ditekan
                }}
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                {/* Icon with pulse animation */}
                <motion.div
                  className="mx-auto bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(250, 204, 21, 0.7)",
                      "0 0 0 20px rgba(250, 204, 21, 0)",
                      "0 0 0 0 rgba(250, 204, 21, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <Clock className="w-14 h-14 text-white" />
                </motion.div>

                {/* Text content */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-yellow-600 mb-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Segera Hadir!
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-700 mb-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Kami sedang mempersiapkan layanan KosApp untuk memberikan
                  pengalaman terbaik untuk Anda. Fitur pendaftaran akan segera
                  tersedia. Terima kasih atas kesabaran Anda!
                </motion.p>

                {/* Stay updated button */}
                <motion.button
                  className="mx-auto block px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Beri Tahu Saya Saat Diluncurkan
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Hubungi Kami
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPinHouse
                    size={18}
                    className="text-yellow-400 mt-1 flex-shrink-0"
                  />
                  <span>Jl. Mugarsari, Kec. Tamansari, Kota Tasik. Tasikmalaya, Jawa Barat 46196</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone
                    size={18}
                    className="text-yellow-400 mt-1 flex-shrink-0"
                  />
                  <span>+62 8234567890</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail
                    size={18}
                    className="text-yellow-400 mt-1 flex-shrink-0"
                  />
                  <span>info@miminkost.id</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Tautan</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTentangKosApp(true);
                    }}
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Kamar Tersedia
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Fasilitas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Berita Terbaru
              </h3>
              <p className="mb-4">
                Dapatkan informasi dan promo terbaru dari Mimin Kost
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="px-4 py-2 rounded-l-md text-gray-800 w-full"
                />
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-r-md transition-colors"
                  onClick={() => setShowComingSoon(true)}
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="pt-6 mt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-4 md:mb-0">
              {/* Social Media Icons */}
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-yellow-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-yellow-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-yellow-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
            <div className="text-center md:text-right text-sm text-gray-400">
              <p>
                © {new Date().getFullYear()} Mimin Kost. All rights reserved.
              </p>
              <p>
                Powered by <span className="text-yellow-400">KosApp</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
