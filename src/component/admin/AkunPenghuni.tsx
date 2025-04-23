import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

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
const API_URL = "http://localhost:8080/api/auth";

export default function EditAkunPenghuni() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isPasswordResetPopupOpen, setIsPasswordResetPopupOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mengambil data pengguna dari backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users from:", `${API_URL}/users`);
      const response = await axios.get(`${API_URL}/users`);
      console.log("Received response:", response.data);

      // Memastikan data sensitif tidak terekspos ke UI
      const sanitizedUsers = response.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roomId: user.roomId,
        role: user.role,
      }));

      setUsers(sanitizedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users data. Please try again later.");

      // Data dummy untuk pengembangan/pengujian
      const dummyUsers: User[] = [
        {
          id: 1,
          username: "Bambang Suryanto",
          email: "bambang.s@email.com",
          phoneNumber: "+6281234567890",
          roomId: 101,
          role: "USER",
        },
        {
          id: 2,
          username: "Dewi Kusuma",
          email: "dewi.k@email.com",
          phoneNumber: "+6287654321098",
          roomId: 201,
          role: "USER",
        },
        {
          id: 3,
          username: "Rudi Hartono",
          email: "rudi.h@email.com",
          phoneNumber: "+6282198765432",
          roomId: 102,
          role: "USER",
        },
      ];
      setUsers(dummyUsers);
    } finally {
      setIsLoading(false);
    }
  };

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

          // Make a real API call to delete the user
          const response = await axios.delete(`${API_URL}/users/${user.id}`);

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

      // Make a real API call to the backend
      const response = await axios.put(`${API_URL}/users/${selectedUser.id}`, {
        username: selectedUser.username,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
        roomId: selectedUser.roomId,
      });

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

  const handlePasswordReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    try {
      // Show loading indicator
      Swal.fire({
        title: "Mengatur ulang password...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make a real API call to reset the password
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
    console.log("Going to page:", page);
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
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
                <FaEdit
                  className="cursor-pointer"
                  onClick={() => handleEditClick(user)}
                />
                <FaKey
                  className="cursor-pointer text-yellow-500"
                  onClick={() => handlePasswordResetClick(user)}
                  title="Reset Password"
                />
                <FaTrash
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
              <FaTimes
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
              <FaTimes
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  className="border rounded w-full py-2 px-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
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
