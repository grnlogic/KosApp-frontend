import axios from "axios";

const API_BASE_URL = "https://manage-kost-production.up.railway.app/api";

/**
 * Gets the authentication token from cookies or localStorage
 */
export const getAuthToken = (): string | null => {
  // Try from cookies first
  const tokenFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  if (tokenFromCookie) return tokenFromCookie;

  // Then try localStorage
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData.token || null;
  } catch (e) {
    console.error("Error parsing userData from localStorage:", e);
    return null;
  }
};

/**
 * Gets the user ID from cookie or storage
 */
export const getUserIdFromCookieOrStorage = (): number | null => {
  // 1. Coba ambil dari cookie terlebih dahulu
  const cookies = document.cookie.split(";");
  let jwtToken = null;

  // Cari cookie yang berisi token JWT
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "authToken" || name === "token" || name === "jwt") {
      jwtToken = value;
      break;
    }
  }

  // Jika ditemukan token di cookie, decode untuk mendapatkan userId
  if (jwtToken) {
    try {
      // Decode JWT untuk mendapatkan payload
      const base64Url = jwtToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      console.log("JWT payload:", payload);

      // Biasanya userId ada di payload sebagai "sub", "userId", "id" atau format lainnya
      if (payload.sub) return payload.sub;
      if (payload.userId) return payload.userId;
      if (payload.id) return payload.id;
    } catch (e) {
      console.error("Error parsing JWT:", e);
    }
  }

  // 2. Jika tidak berhasil, coba dari localStorage
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.id) {
        return userData.id.toString();
      }
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
    }
  }

  // 3. Jika masih tidak berhasil, kembalikan null
  return null;
};

/**
 * Gets the user role from localStorage
 */
export const getUserRole = (): string => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData.role || "user";
  } catch (e) {
    console.error("Error parsing user role from localStorage:", e);
    return "user";
  }
};

/**
 * Creates headers with authentication if token exists
 */
export const createAuthHeaders = () => {
  const token = getAuthToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

/**
 * Checks if the current user has admin permissions
 */
export const hasAdminPermission = (): boolean => {
  const role = getUserRole();
  return role === "admin" || role === "owner";
};

/**
 * Create an authenticated API client
 */
export const authApi = axios.create({
  baseURL: "https://manage-kost-production.up.railway.app/api",
  timeout: 10000,
  withCredentials: true, // Penting untuk mengirim cookies
});

// Tambahkan interceptor untuk debugging
authApi.interceptors.request.use(
  (config) => {
    console.log("Request config:", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
