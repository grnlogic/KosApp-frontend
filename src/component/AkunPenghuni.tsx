import { authApi, hasAdminPermission } from "../utils/apiUtils";
import Swal from "sweetalert2";

// ...existing code...

// Replace the approval function
const approveUser = async (userId: number) => {
  if (!hasAdminPermission()) {
    Swal.fire({
      title: "Akses Ditolak",
      text: "Anda tidak memiliki izin untuk melakukan tindakan ini",
      icon: "error",
      confirmButtonColor: "#000",
    });
    return;
  }

  try {
    const response = await authApi.post(
      `/users/${userId}/approve-registration`,
      {}
    );

    // Handle success
    Swal.fire({
      title: "Berhasil!",
      text: "Pendaftaran pengguna telah disetujui",
      icon: "success",
      confirmButtonColor: "#000",
    });

    // Refresh user list or update UI as needed
    fetchUsers(); // Assume this function refreshes the user list
  } catch (error: any) {
    console.error("Error approving request:", error);

    // Handle specific error cases
    let errorMessage = "Gagal menyetujui pendaftaran";

    if (error.response) {
      if (error.response.status === 403) {
        errorMessage =
          "Akses ditolak. Anda mungkin tidak memiliki izin untuk melakukan tindakan ini.";
      } else if (error.response.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        // Optional: Redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: Permintaan gagal`;
      }
    }

    Swal.fire({
      title: "Gagal",
      text: errorMessage,
      icon: "error",
      confirmButtonColor: "#000",
    });
  }
};

const deleteUser = async (userId: number) => {
    try {
      // Gunakan metode DELETE ke endpoint /api/users/{userId}
      const response = await authApi.delete(`/users/${userId}`);
      
      Swal.fire({
        title: "Berhasil!",
        text: "Pengguna telah dihapus",
        icon: "success",
        confirmButtonColor: "#000",
      });
      
      // Refresh daftar pengguna
      fetchUsers();
    } catch (error: any) {
      console.error("Error menghapus pengguna:", error);
      
      let errorMessage = "Gagal menghapus pengguna";
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk menghapus pengguna.";
        } else if (error.response.status === 401) {
          errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        }
      }
      
      Swal.fire({
        title: "Gagal",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#000",
      });
    // Refresh user list or update UI as needed
    fetchUsers(); // Assume this function refreshes the user list
  }
};

// ...existing code...

// Also update the user fetching function if it exists
const fetchUsers = async () => {
  try {
    const response = await authApi.get("/users");
    // Process the response
    setUsers(response.data); // Assuming you have a state variable for users
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Handle error
  }
};

function setUsers(data: any) {
  throw new Error("Function not implemented.");
}
// ...existing code...
