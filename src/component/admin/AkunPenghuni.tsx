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
}

interface ErrorResponse {
  message: string;
}

// URL API dasar
const API_URL = "https://manage-kost-production.up.railway.app";

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
// Mengambil data pengguna dari backend
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
    
    // Inisialisasi users sebagai array kosong, bukan data dummy
    setUsers([]);
  } finally {
    setIsLoading(false);
  }
};
  // Mengambil data pengguna dari backend
  // (Duplicate fetchUsers function removed)

  // Memuat data pengguna saat komponen terpasang
  useEffect(() => {
    fetchUsers();
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

    // Validate password
    const errors = validatePassword(newPassword);

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordErrors(["Password dan konfirmasi password tidak sesuai"]);
      return;
    }

    try {
      // Show loading indicator
      Swal.fire({
        title: "Mengatur ulang password...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make a real API call to reset the password without auth header
      const response = await axios.put(
        `${API_URL}/users/${selectedUser.id}/reset-password`,
        { newPassword }
      );

      // Check if response was successful
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

      // Type check the error before accessing properties
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan password baru";

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
        <div className="flex gap-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Cari penghuni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
              <div className="flex gap-3 text-xl text-gray-600">
                <Pencil
                  className="cursor-pointer"
                  onClick={() => handleEditClick(user)}
                />
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

      <div className="flex justify-center mt-6 gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={`w-8 h-8 rounded-full border ${
              n === 1 ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => handlePageClick(n)}
          >
            {n}
          </button>
        ))}
      </div>

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
