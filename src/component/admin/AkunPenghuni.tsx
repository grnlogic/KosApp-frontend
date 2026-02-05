import {
  Pencil,
  Key,
  Trash,
  X,
  ArrowLeft,
  Plus,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import Commet from "./Commet";

// Mendefinisikan interface pengguna sesuai dengan data backend
interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  roomId: number | null;
  role: string;
  pendingRegistration?: boolean;
  requestedRoomId?: number | string | null; // Perbaikan tipe data untuk kompatibilitas
  // Tambahkan properti untuk data sewa dari PendingRegistrationRequest
  roomNumber?: string;
  durasiSewa?: number;
  tanggalMulai?: string;
  metodePembayaran?: string;
  totalPembayaran?: number;
}

interface ErrorResponse {
  message: string;
}

// Add this interface right after the User interface
interface PendingRegistrationRequest {
  id: string;
  userId?: number; // Optional: for existing users requesting rooms
  username: string;
  email: string;
  phoneNumber?: string;
  requestedRoomId: string | number;
  roomNumber?: string;
  // Tambahkan informasi sewa
  durasiSewa?: number;
  tanggalMulai?: string;
  metodePembayaran?: string;
  totalPembayaran?: number;
  timestamp: number;
  status: "pending";
}

// URL API dasar
const API_URL = "http://141.11.25.167:8080";

export default function EditAkunPenghuni() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isPasswordResetPopupOpen, setIsPasswordResetPopupOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Add new state for notifications
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Modify the fetchPendingRegistrations function to read from localStorage
  const fetchPendingRegistrations = async () => {
    try {
      // Perbaikan untuk menghandle nilai id yang bisa undefined atau bukan string
      const safeIdConversion = (id: any) => {
        // Jika id adalah string dan mengandung "req-", lakukan replace
        if (typeof id === "string" && id.includes("req-")) {
          return (
            parseInt(id.replace("req-", "")) ||
            Math.floor(Math.random() * 10000)
          );
        }
        // Jika id adalah number, gunakan langsung
        else if (typeof id === "number") {
          return id;
        }
        // Jika undefined atau format lain, generate random ID
        else {
          return Math.floor(Math.random() * 10000);
        }
      };

      // First try to get any existing API pending registrations
      let apiRequests: User[] = [];
      try {
        const response = await axios.get(
          `${API_URL}/api/room-requests/pending`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          apiRequests = response.data;
        }
      } catch (apiError) {
        console.warn("Error fetching API pending registrations:", apiError);
        // Continue execution to at least show localStorage requests
      }

      // Get locally stored pending requests
      const localPendingRequests: PendingRegistrationRequest[] = JSON.parse(
        localStorage.getItem("pendingRoomRequests") || "[]"
      );

      // Clean up localStorage: remove already approved users
      try {
        const allUsers = await axios.get(`${API_URL}/api/users`);
        const approvedEmails = allUsers.data
          .filter((u: User) => u.roomId !== null)
          .map((u: User) => u.email);

        // Filter out requests that have already been approved
        const cleanedRequests = localPendingRequests.filter(
          (req) => !approvedEmails.includes(req.email)
        );

        // Update localStorage if we removed any
        if (cleanedRequests.length !== localPendingRequests.length) {
          localStorage.setItem(
            "pendingRoomRequests",
            JSON.stringify(cleanedRequests)
          );
        }

        // Use cleaned requests instead
        const localRequestsAsUsers: User[] = cleanedRequests.map((req) => ({
          id: safeIdConversion(req.id),
          username: req.username,
          email: req.email,
          phoneNumber: req.phoneNumber || "",
          roomId: null,
          role: "PENDING_USER",
          pendingRegistration: true,
          requestedRoomId: req.requestedRoomId,
          // Copy additional rental properties
          roomNumber: req.roomNumber,
          durasiSewa: req.durasiSewa,
          tanggalMulai: req.tanggalMulai,
          metodePembayaran: req.metodePembayaran,
          totalPembayaran: req.totalPembayaran,
        }));

        // Combine API results with local storage results (avoiding duplicates)
        let combinedRequests = [...apiRequests];

        // Only add local requests that aren't already in the API requests
        for (const localReq of localRequestsAsUsers) {
          if (
            !apiRequests.some(
              (apiReq) =>
                apiReq.email === localReq.email &&
                apiReq.requestedRoomId === localReq.requestedRoomId
            )
          ) {
            combinedRequests.push(localReq);
          }
        }

        setPendingRequests(combinedRequests);
        setNotificationCount(combinedRequests.length);

        // Animate the notification bell if there are new requests
        if (combinedRequests.length > 0) {
          const bell = document.querySelector(".notification-bell");
          if (bell) {
            bell.classList.add("animate-bounce");
            setTimeout(() => bell.classList.remove("animate-bounce"), 1000);
          }
        }
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
        // Fall back to original logic without cleanup
        const localRequestsAsUsers: User[] = localPendingRequests.map(
          (req) => ({
            id: safeIdConversion(req.id),
            username: req.username,
            email: req.email,
            phoneNumber: req.phoneNumber || "",
            roomId: null,
            role: "PENDING_USER",
            pendingRegistration: true,
            requestedRoomId: req.requestedRoomId,
            roomNumber: req.roomNumber,
            durasiSewa: req.durasiSewa,
            tanggalMulai: req.tanggalMulai,
            metodePembayaran: req.metodePembayaran,
            totalPembayaran: req.totalPembayaran,
          })
        );

        let combinedRequests = [...apiRequests];
        for (const localReq of localRequestsAsUsers) {
          if (
            !apiRequests.some(
              (apiReq) =>
                apiReq.email === localReq.email &&
                apiReq.requestedRoomId === localReq.requestedRoomId
            )
          ) {
            combinedRequests.push(localReq);
          }
        }

        setPendingRequests(combinedRequests);
        setNotificationCount(combinedRequests.length);
      }
    } catch (err) {
      console.error("Error in fetchPendingRegistrations:", err);

      // Fall back to just local storage data if API call fails
      try {
        const localPendingRequests: PendingRegistrationRequest[] = JSON.parse(
          localStorage.getItem("pendingRoomRequests") || "[]"
        );

        const localRequestsAsUsers: User[] = localPendingRequests.map(
          (req) => ({
            id:
              parseInt(req.id.replace("req-", "")) ||
              Math.floor(Math.random() * 10000),
            username: req.username,
            email: req.email,
            phoneNumber: req.phoneNumber || "",
            roomId: null,
            role: "PENDING_USER",
            pendingRegistration: true,
            requestedRoomId: req.requestedRoomId,
            // Copy additional properties
            roomNumber: req.roomNumber,
            durasiSewa: req.durasiSewa,
            tanggalMulai: req.tanggalMulai,
            metodePembayaran: req.metodePembayaran,
            totalPembayaran: req.totalPembayaran,
          })
        );

        setPendingRequests(localRequestsAsUsers);
        setNotificationCount(localRequestsAsUsers.length);
      } catch (e) {
        console.error("Error parsing local pending requests:", e);
        setPendingRequests([]);
        setNotificationCount(0);
      }
    }
  };

  // Approve a registration request
  const handleApproveRequest = async (userId: number) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: "Memproses...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Check if this is a localStorage request
      const isLocalRequest = pendingRequests.find(
        (req) => req.id === userId && req.pendingRegistration
      );

      if (isLocalRequest) {
        // For localStorage requests, check if user already exists (has userId)
        const existingUserId = (isLocalRequest as any).userId;

        try {
          let userIdToAssign = existingUserId;

          // If no userId, need to create user first OR check if already exists
          if (!existingUserId) {
            // First, check if user already exists in database
            try {
              const allUsers = await axios.get(`${API_URL}/api/users`);
              const existingUser = allUsers.data.find(
                (u: User) =>
                  u.email === isLocalRequest.email ||
                  u.username === isLocalRequest.username
              );

              if (existingUser) {
                userIdToAssign = existingUser.id;

                // Check if user already has a room
                if (existingUser.roomId) {
                  // User already has room, remove from localStorage and show message
                  const localRequests = JSON.parse(
                    localStorage.getItem("pendingRoomRequests") || "[]"
                  );
                  const updatedRequests = localRequests.filter(
                    (req: PendingRegistrationRequest) =>
                      req.email !== isLocalRequest.email
                  );
                  localStorage.setItem(
                    "pendingRoomRequests",
                    JSON.stringify(updatedRequests)
                  );

                  // Update state
                  setPendingRequests(
                    pendingRequests.filter((req) => req.id !== userId)
                  );
                  setNotificationCount((prev) => prev - 1);

                  throw new Error(
                    `User ${existingUser.username} sudah memiliki kamar dengan ID ${existingUser.roomId}. Permintaan sudah diproses sebelumnya.`
                  );
                }
              } else {
                // User doesn't exist, create new one

                // Validate required fields before sending
                if (
                  !isLocalRequest.username ||
                  !isLocalRequest.username.trim()
                ) {
                  throw new Error("Username tidak boleh kosong");
                }

                if (!isLocalRequest.email || !isLocalRequest.email.trim()) {
                  throw new Error("Email tidak boleh kosong");
                }

                // Validate email format
                const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
                if (!emailRegex.test(isLocalRequest.email)) {
                  throw new Error("Format email tidak valid");
                }

                // Prepare phone number with fallback
                const phoneNumber =
                  isLocalRequest.phoneNumber?.trim() || "0000000000";

                // First register the user through the existing API

                // First register the user through the existing API
                const registerResponse = await axios.post(
                  `${API_URL}/api/auth/register-direct`,
                  {
                    username: isLocalRequest.username.trim(),
                    email: isLocalRequest.email.trim(),
                    password: "KosApp@2024", // Default password
                    phoneNumber: phoneNumber,
                  }
                );

                if (registerResponse.status === 200) {
                  // User created successfully, get the user ID
                  const updatedUsers = await axios.get(`${API_URL}/api/users`);
                  const createdUser = updatedUsers.data.find(
                    (u: User) => u.email === isLocalRequest.email
                  );

                  if (createdUser) {
                    userIdToAssign = createdUser.id;
                  }
                }
              }
            } catch (checkError) {
              // If it's our custom error (user already has room), throw it
              if (
                checkError instanceof Error &&
                checkError.message.includes("sudah memiliki kamar")
              ) {
                throw checkError;
              }
              // Otherwise, it might be network error checking users, so try to create user anyway
              console.warn("Error checking existing users:", checkError);

              // Try to create user

              // Validate required fields
              if (!isLocalRequest.username || !isLocalRequest.username.trim()) {
                throw new Error("Username tidak boleh kosong");
              }

              if (!isLocalRequest.email || !isLocalRequest.email.trim()) {
                throw new Error("Email tidak boleh kosong");
              }

              const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
              if (!emailRegex.test(isLocalRequest.email)) {
                throw new Error("Format email tidak valid");
              }

              const phoneNumber =
                isLocalRequest.phoneNumber?.trim() || "0000000000";

              const registerResponse = await axios.post(
                `${API_URL}/api/auth/register-direct`,
                {
                  username: isLocalRequest.username.trim(),
                  email: isLocalRequest.email.trim(),
                  password: "KosApp@2024",
                  phoneNumber: phoneNumber,
                }
              );

              if (registerResponse.status === 200) {
                const allUsers = await axios.get(`${API_URL}/api/users`);
                const createdUser = allUsers.data.find(
                  (u: User) => u.email === isLocalRequest.email
                );

                if (createdUser) {
                  userIdToAssign = createdUser.id;
                }
              }
            }
          } else {
          }

          // Now assign room to user (either newly created or existing)
          if (userIdToAssign) {
            // Assign the room to the user
            await axios.put(
              `${API_URL}/api/users/${userIdToAssign}/assign-user-room`,
              { roomId: isLocalRequest.requestedRoomId }
            );

            // Update the room status to "terisi" in the kamar API
            try {
              await axios
                .get(`${API_URL}/api/kamar/${isLocalRequest.requestedRoomId}`)
                .then((roomResponse) => {
                  if (roomResponse.data) {
                    axios.put(
                      `${API_URL}/api/kamar/${isLocalRequest.requestedRoomId}`,
                      {
                        ...roomResponse.data,
                        status: "terisi",
                      }
                    );
                  }
                });
            } catch (roomError) {
              console.warn("Gagal memperbarui status kamar:", roomError);
            }

            // TODO: Ideally, we'd also save the rental information to a rentals table in the database
            // For now, we can just show a success message that includes the rental details
            let successMessage = `Penghuni ${
              isLocalRequest.username
            } berhasil terdaftar untuk kamar ${
              isLocalRequest.roomNumber || isLocalRequest.requestedRoomId
            }`;
            if (isLocalRequest.durasiSewa) {
              successMessage += `\nDetail sewa: ${isLocalRequest.durasiSewa} bulan, mulai ${isLocalRequest.tanggalMulai}`;
              successMessage += `\nTotal pembayaran: Rp ${isLocalRequest.totalPembayaran?.toLocaleString()}`;
            }

            Swal.fire({
              icon: "success",
              title: "Permintaan Diterima",
              text: successMessage,
              confirmButtonColor: "#000",
            });

            // Remove this request from localStorage
            const localRequests = JSON.parse(
              localStorage.getItem("pendingRoomRequests") || "[]"
            );
            const updatedRequests = localRequests.filter(
              (req: PendingRegistrationRequest) =>
                req.id !== String(isLocalRequest.id)
            );
            localStorage.setItem(
              "pendingRoomRequests",
              JSON.stringify(updatedRequests)
            );

            // Update state
            setPendingRequests(
              pendingRequests.filter((req) => req.id !== userId)
            );
            setNotificationCount((prev) => prev - 1);

            // Refresh the user list
            fetchUsers();
          } else {
            throw new Error("Gagal mendapatkan user ID");
          }
        } catch (error) {
          console.error("Error processing room request:", error);

          // Enhanced error handling
          const axiosError = error as AxiosError<ErrorResponse>;
          let errorMessage = "Terjadi kesalahan saat memproses permintaan";
          let errorDetails = "";

          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else if (error instanceof Error && error.message) {
            // Handle validation errors from our frontend checks
            errorMessage = error.message;
          } else if (axiosError.response?.status === 400) {
            errorMessage =
              "Data tidak valid. Periksa kembali data yang dimasukkan.";
            errorDetails =
              "Pastikan username, email, dan nomor telepon sudah terisi dengan benar.";
          } else if (axiosError.message) {
            errorMessage = `Error: ${axiosError.message}`;
          }

          console.error("Detailed error:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
            message: axiosError.message,
          });

          Swal.fire({
            icon: "error",
            title: "Gagal Menyetujui",
            text: errorMessage,
            footer: errorDetails || undefined,
            confirmButtonColor: "#000",
          });
        }
        return;
      }

      // Perbaiki endpoint dan tambahkan header Authorization
      const response = await axios.post(
        `${API_URL}/api/room-requests/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove this request from pendingRequests
        setPendingRequests(pendingRequests.filter((req) => req.id !== userId));
        setNotificationCount((prev) => prev - 1);

        // Refresh the user list
        fetchUsers();

        Swal.fire({
          icon: "success",
          title: "Permintaan Diterima",
          text: "Penghuni berhasil terdaftar untuk kamar",
          confirmButtonColor: "#000",
        });
      }
    } catch (err) {
      console.error("Error approving request:", err);
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat menyetujui permintaan";
      Swal.fire({
        icon: "error",
        title: "Gagal Menyetujui",
        text: errorMessage,
        confirmButtonColor: "#000",
      });
    }
  };

  // Reject a registration request
  const handleRejectRequest = async (userId: number) => {
    try {
      // Show loading indicator
      Swal.fire({
        title: "Memproses...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Check if this is a localStorage request
      const isLocalRequest = pendingRequests.find(
        (req) => req.id === userId && req.pendingRegistration
      );

      if (isLocalRequest) {
        // For localStorage requests, just remove it from storage
        const localRequests: PendingRegistrationRequest[] = JSON.parse(
          localStorage.getItem("pendingRoomRequests") || "[]"
        );
        const updatedRequests = localRequests.filter(
          (req: PendingRegistrationRequest) => `req-${userId}` !== req.id
        );
        localStorage.setItem(
          "pendingRoomRequests",
          JSON.stringify(updatedRequests)
        );

        // Update UI
        setPendingRequests(pendingRequests.filter((req) => req.id !== userId));
        setNotificationCount((prev) => prev - 1);

        Swal.fire({
          icon: "success",
          title: "Permintaan Ditolak",
          confirmButtonColor: "#000",
        });
        return;
      }

      // Ganti kode DELETE dengan POST ke endpoint yang benar
      const response = await axios.post(
        `${API_URL}/api/room-requests/reject/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove this request from pendingRequests
        setPendingRequests(pendingRequests.filter((req) => req.id !== userId));
        setNotificationCount((prev) => prev - 1);

        Swal.fire({
          icon: "success",
          title: "Permintaan Ditolak",
          confirmButtonColor: "#000",
        });
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat menolak permintaan";

      Swal.fire({
        icon: "error",
        title: "Gagal Menolak",
        text: errorMessage,
        confirmButtonColor: "#000",
      });
    }
  };

  // Mengambil data penghuni dari backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Panggil API untuk mendapatkan data pengguna
      const response = await axios.get(`${API_URL}/api/users`);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        throw new Error("Server responded with non-success status");
      }
    } catch (err) {
      console.error("Error fetching users:", err);

      // Tampilkan error menggunakan SweetAlert
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat mengambil data penghuni";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: errorMessage,
        confirmButtonColor: "#000",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Memuat data pengguna saat komponen terpasang
  useEffect(() => {
    fetchUsers();
    fetchPendingRegistrations();
    // Set up polling to check for new registration requests every minute
    const intervalId = setInterval(fetchPendingRegistrations, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Filter pengguna berdasarkan kata kunci pencarian
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  );

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  const handlePasswordResetClick = (user: User) => {
    Swal.fire({
      title: "Reset Password",
      text: `Anda akan mereset password untuk ${user.username}. Lanjutkan?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedUser(user);
        setIsPasswordResetPopupOpen(true);
        setNewPassword("");
      }
    });
  };

  const handleDeleteClick = (user: User) => {
    Swal.fire({
      title: "Hapus Penghuni?",
      text: `Anda akan menghapus data ${user.username}. Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Show loading indicator
          Swal.fire({
            title: "Menghapus penghuni...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Make a real API call to delete the user without auth header
          const response = await axios.delete(
            `${API_URL}/api/users/${user.id}`
          );

          if (response.status === 200) {
            // Remove user from local state
            setUsers(users.filter((u) => u.id !== user.id));
            Swal.fire({
              title: "Terhapus!",
              text: "Data penghuni telah dihapus.",
              icon: "success",
              confirmButtonColor: "#000",
            });
          } else {
            throw new Error("Server responded with non-success status");
          }
        } catch (err) {
          console.error("Error deleting user:", err);
          // Get error message from API if available
          const axiosError = err as AxiosError<ErrorResponse>;
          const errorMessage =
            axiosError.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data";
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus data",
            text: errorMessage,
            confirmButtonColor: "#000",
          });
        }
      }
    });
  };

  const handleAddClick = () => {
    Swal.fire({
      title: "Tambah Penghuni Baru",
      text: "Fitur akan segera tersedia",
      icon: "info",
      confirmButtonColor: "#000",
    });
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
    setIsPasswordResetPopupOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Show loading indicator
      Swal.fire({
        title: "Menyimpan perubahan...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make a real API call to the backend without auth header
      const response = await axios.put(
        `${API_URL}/api/users/${selectedUser.id}`,
        {
          username: selectedUser.username,
          email: selectedUser.email,
          phoneNumber: selectedUser.phoneNumber,
          roomId: selectedUser.roomId,
        }
      );

      // Update local state on successful response
      if (response.status === 200) {
        setUsers(
          users.map((u) => (u.id === selectedUser.id ? selectedUser : u))
        );
        handleClosePopup();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Data penghuni berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error("Server responded with non-success status");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      // Get error message from API if available
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan perubahan";
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui data",
        text: errorMessage,
        confirmButtonColor: "#000",
      });
    }
  };

  // Validate password
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password harus minimal 8 karakter");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password harus memiliki minimal 1 huruf kapital");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password harus memiliki minimal 1 angka");
    }

    return errors;
  };

  const handlePasswordReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validasi password seperti sebelumnya...

    try {
      // Show loading indicator
      Swal.fire({
        title: "Mengatur ulang password...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Pastikan token ada dan valid
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Silakan login kembali."
        );
      }

      // Perbaiki format request dan header
      const response = await axios.put(
        `${API_URL}/api/users/${selectedUser.id}/reset-password`,
        { newPassword }, // Pastikan format body request sesuai dengan yang diharapkan backend
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Periksa respons
      if (response.status === 200) {
        handleClosePopup();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Password berhasil direset",
          text: "Password baru telah ditetapkan untuk penghuni",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error("Server responded with non-success status");
      }
    } catch (err) {
      console.error("Error resetting password:", err);

      // Handle specific error cases
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = "Terjadi kesalahan saat menyimpan password baru";

      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        errorMessage = "Sesi login telah berakhir. Silakan login kembali.";
        // Redirect ke halaman login
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal mereset password",
        text: errorMessage,
        confirmButtonColor: "#000",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  const handlePageClick = (page: number) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      icon: "info",
      title: `Berpindah ke halaman ${page}`,
    });
    // Logic to change page would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 items-center">
          {/* Notification Bell */}
          <button
            className="relative p-2 bg-white rounded shadow notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notificationCount}
              </div>
            )}
          </button>

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Cari penghuni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="mt-2 bg-white rounded shadow-lg p-4 border max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Permintaan Sewa Kamar</h3>

              {/* Add debug button */}
              <button
                className="text-xs bg-gray-100 px-2 py-1 rounded"
                onClick={() => {
                  // Show the raw data from localStorage for debugging
                  const localData = localStorage.getItem("pendingRoomRequests");
                  Swal.fire({
                    title: "Debug: Stored Requests",
                    html: `<pre class="text-left text-xs">${JSON.stringify(
                      JSON.parse(localData || "[]"),
                      null,
                      2
                    )}</pre>`,
                    width: 800,
                    confirmButtonText: "Refresh Data",
                    showDenyButton: true, // Tambahkan tombol reset
                    denyButtonText: "Hapus Semua Data",
                    showCancelButton: true,
                    cancelButtonText: "Tutup",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      fetchPendingRegistrations();
                    }
                    if (result.isDenied) {
                      // Reset semua data permintaan sewa
                      localStorage.removeItem("pendingRoomRequests");
                      fetchPendingRegistrations();
                      Swal.fire("Data telah dihapus", "", "success");
                    }
                  });
                }}
              >
                Debug
              </button>
            </div>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">Tidak ada permintaan saat ini</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border p-3 rounded">
                    <div className="flex justify-between">
                      <div>
                        <p>
                          <span className="font-semibold">
                            {request.username}
                          </span>{" "}
                          meminta sewa kamar
                        </p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        {request.phoneNumber && (
                          <p className="text-sm text-gray-600">
                            Tel: {request.phoneNumber}
                          </p>
                        )}
                      </div>
                      <div className="bg-yellow-50 px-3 py-1 rounded">
                        <p className="font-medium">
                          Kamar: {request.roomNumber || request.requestedRoomId}
                        </p>
                      </div>
                    </div>

                    {/* Tampilkan informasi sewa jika tersedia */}
                    {request.durasiSewa && (
                      <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <p>
                            <span className="font-medium">Durasi:</span>{" "}
                            {request.durasiSewa} bulan
                          </p>{" "}
                          <p>
                            <span className="font-medium">Mulai:</span>{" "}
                            {request.tanggalMulai}
                          </p>
                          <p>
                            <span className="font-medium">Pembayaran:</span>{" "}
                            {request.metodePembayaran}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> Rp{" "}
                            {request.totalPembayaran?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Tolak
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        Terima
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Commet color="#32cd32" size="medium" text="" textColor="" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found matching your search criteria.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded p-3 shadow flex justify-between items-start"
            >
              <div>
                <p className="font-bold">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">
                  {user.phoneNumber || "No phone number"}
                </p>
                <p className="text-sm text-gray-600">
                  Kamar: {user.roomId ? `A-${user.roomId}` : "Belum diatur"}
                </p>
                {/* Password and role intentionally not displayed */}
              </div>
              <div className="flex gap-2">
                <span title="Reset Password">
                  <Key
                    className="cursor-pointer text-yellow-500"
                    onClick={() => handlePasswordResetClick(user)}
                  />
                </span>
                <Trash
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDeleteClick(user)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Popup */}
      {isEditPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Penghuni</h2>
              <X
                className="text-gray-600 cursor-pointer"
                onClick={() => {
                  Swal.fire({
                    title: "Batalkan perubahan?",
                    text: "Perubahan yang Anda buat tidak akan disimpan.",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#000",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ya, Batalkan",
                    cancelButtonText: "Lanjutkan Edit",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleClosePopup();
                    }
                  });
                }}
              />
            </div>

            <form onSubmit={handleSaveChanges}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="username"
                  className="border rounded w-full py-2 px-3"
                  value={selectedUser.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="border rounded w-full py-2 px-3"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="border rounded w-full py-2 px-3"
                  value={selectedUser.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  name="roomId"
                  className="border rounded w-full py-2 px-3"
                  value={selectedUser.roomId || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* No fields for password or role */}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                  onClick={() => {
                    Swal.fire({
                      title: "Batalkan perubahan?",
                      text: "Perubahan yang Anda buat tidak akan disimpan.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#000",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Ya, Batalkan",
                      cancelButtonText: "Lanjutkan Edit",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleClosePopup();
                      }
                    });
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Popup */}
      {isPasswordResetPopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <X
                className="text-gray-600 cursor-pointer"
                onClick={() => {
                  Swal.fire({
                    title: "Batalkan reset password?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#000",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ya, Batalkan",
                    cancelButtonText: "Lanjutkan",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleClosePopup();
                    }
                  });
                }}
              />
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <p className="text-gray-700 mb-4">
                  Anda akan mereset password untuk penghuni:{" "}
                  <strong>{selectedUser.username}</strong>
                </p>

                {/* Password field with toggle visibility */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="border rounded w-full py-2 px-3 pr-10"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordErrors(validatePassword(e.target.value));
                      }}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm password field */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="border rounded w-full py-2 px-3"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Password requirements */}
                <div className="mt-2 text-sm">
                  <p className="font-semibold mb-1">
                    Password harus memenuhi kriteria berikut:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      {newPassword.length >= 8 ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      Minimal 8 karakter
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(newPassword) ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      Memiliki minimal 1 huruf kapital
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(newPassword) ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      Memiliki minimal 1 angka
                    </li>
                    <li className="flex items-center">
                      {newPassword === confirmPassword && newPassword !== "" ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      Password dan konfirmasi harus sama
                    </li>
                  </ul>
                </div>

                {/* Display validation errors */}
                {passwordErrors.length > 0 && (
                  <div className="mt-2 text-red-500 text-sm">
                    {passwordErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                  onClick={() => {
                    Swal.fire({
                      title: "Batalkan reset password?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#000",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Ya, Batalkan",
                      cancelButtonText: "Lanjutkan",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleClosePopup();
                      }
                    });
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded"
                  disabled={
                    passwordErrors.length > 0 ||
                    newPassword !== confirmPassword ||
                    newPassword.length === 0
                  }
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
