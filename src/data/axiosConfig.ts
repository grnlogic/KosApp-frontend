import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Tambahkan variabel untuk mencegah multiple refresh request
let isRefreshing = false;
let refreshSubscribers: any[] = [];

// Helper function untuk menjalankan callbacks setelah refresh berhasil
const onRefreshed = (token: boolean) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Helper function untuk menambahkan request ke antrian
const addRefreshSubscriber = (callback: (token: any) => void) => {
  refreshSubscribers.push(callback);
};

// Tambahkan interceptor untuk refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan belum ada upaya refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Periksa jika refresh sedang berjalan
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Coba refresh token melalui endpoint khusus refresh token
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );

          // Jika refresh berhasil
          if (refreshResponse.status === 200) {
            // Token sudah diperbarui dalam HTTP-only cookies oleh server
            isRefreshing = false;
            onRefreshed(true);
            console.log("Token berhasil diperbarui");
            
            // Coba lagi request asli
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          isRefreshing = false;
          
          // Hapus cookie isLoggedIn hanya jika refresh benar-benar gagal
          if (axios.isAxiosError(refreshError) && refreshError.response && refreshError.response.status === 401) {
            console.log("Token tidak dapat diperbarui, menghapus sesi");
            Cookies.remove("isLoggedIn", { path: "/" });
            window.location.href = "/";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // Jika refresh sedang berjalan, tambahkan request ke antrian
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

// Pastikan withCredentials selalu true
axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
