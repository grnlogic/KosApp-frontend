import Cookies from "js-cookie";

/**
 * Helper function untuk mengecek dan menampilkan log status autentikasi
 * Gunakan function ini di halaman manapun untuk memverifikasi token tersimpan dengan benar
 * 
 * Contoh penggunaan:
 * import { checkAuthenticationStatus } from '../utils/authLogger';
 * 
 * // Di useEffect atau function lain:
 * const authStatus = checkAuthenticationStatus();
 * console.log(authStatus);
 */
export const checkAuthenticationStatus = () => {
  console.log("╔════════════════════════════════════════════════════════");
  console.log("║ CHECKING AUTHENTICATION STATUS");
  console.log("╠════════════════════════════════════════════════════════");
  console.log("║ Timestamp:", new Date().toISOString());
  console.log("║ Current Page:", window.location.pathname);
  
  // Cek Cookies
  const isLoggedInCookie = Cookies.get("isLoggedIn");
  const userRoleCookie = Cookies.get("userRole");
  const userRoomIdCookie = Cookies.get("userRoomId");
  
  console.log("║");
  console.log("║ COOKIES:");
  console.log("║  - isLoggedIn:", isLoggedInCookie || "❌ NOT FOUND");
  console.log("║  - userRole:", userRoleCookie || "❌ NOT FOUND");
  console.log("║  - userRoomId:", userRoomIdCookie || "❌ NOT FOUND");
  console.log("║  - All cookies:", document.cookie || "❌ EMPTY");
  
  // Cek LocalStorage
  const userDataLS = localStorage.getItem("userData");
  const roomIdLS = localStorage.getItem("roomId");
  
  console.log("║");
  console.log("║ LOCALSTORAGE:");
  console.log("║  - userData:", userDataLS || "❌ NOT FOUND");
  console.log("║  - roomId:", roomIdLS || "❌ NOT FOUND");
  
  let parsedUserData = null;
  if (userDataLS) {
    try {
      parsedUserData = JSON.parse(userDataLS);
      console.log("║  - Parsed userData:");
      console.log("║    * username:", parsedUserData.username);
      console.log("║    * email:", parsedUserData.email);
      console.log("║    * role:", parsedUserData.role);
      console.log("║    * roomId:", parsedUserData.roomId);
      console.log("║    * loginTime:", parsedUserData.loginTime);
    } catch (e) {
      console.log("║  - ❌ Error parsing userData:", e);
    }
  }
  
  // Validasi status autentikasi
  const isAuthenticated = isLoggedInCookie === "true" && userDataLS;
  console.log("║");
  console.log("║ AUTHENTICATION STATUS:", isAuthenticated ? "✅ AUTHENTICATED" : "❌ NOT AUTHENTICATED");
  
  // Cek konsistensi data
  console.log("║");
  console.log("║ DATA CONSISTENCY CHECK:");
  const cookieRoleMatchesLS = userRoleCookie === parsedUserData?.role;
  const cookieRoomIdMatchesLS = userRoomIdCookie === parsedUserData?.roomId || userRoomIdCookie === roomIdLS;
  console.log("║  - Cookie role matches localStorage:", cookieRoleMatchesLS ? "✅ MATCH" : "⚠️ MISMATCH");
  console.log("║  - Cookie roomId matches localStorage:", cookieRoomIdMatchesLS ? "✅ MATCH" : "⚠️ MISMATCH");
  
  console.log("╚════════════════════════════════════════════════════════");
  
  return {
    isAuthenticated,
    cookies: {
      isLoggedIn: isLoggedInCookie,
      userRole: userRoleCookie,
      userRoomId: userRoomIdCookie,
      allCookies: document.cookie
    },
    localStorage: {
      userData: parsedUserData,
      roomId: roomIdLS
    },
    consistency: {
      roleMatches: cookieRoleMatchesLS,
      roomIdMatches: cookieRoomIdMatchesLS
    }
  };
};

/**
 * Helper function untuk mengecek token HTTP-only cookie dari backend
 * Melakukan request ke backend untuk memverifikasi token masih valid
 * 
 * Contoh penggunaan:
 * import { verifyTokenWithBackend } from '../utils/authLogger';
 * 
 * const isValid = await verifyTokenWithBackend();
 */
export const verifyTokenWithBackend = async (apiBaseUrl: string) => {
  console.log("╔════════════════════════════════════════════════════════");
  console.log("║ VERIFYING TOKEN WITH BACKEND");
  console.log("╠════════════════════════════════════════════════════════");
  console.log("║ Timestamp:", new Date().toISOString());
  console.log("║ API Base URL:", apiBaseUrl);
  
  try {
    // Contoh endpoint untuk verify token - sesuaikan dengan backend Anda
    const response = await fetch(`${apiBaseUrl}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include', // Penting untuk mengirim HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("║");
    console.log("║ Response Status:", response.status);
    console.log("║ Response OK:", response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log("║ Response Data:", data);
      console.log("║");
      console.log("║ TOKEN STATUS: ✅ VALID");
      console.log("╚════════════════════════════════════════════════════════");
      
      return {
        isValid: true,
        data: data
      };
    } else {
      console.log("║ TOKEN STATUS: ❌ INVALID OR EXPIRED");
      console.log("╚════════════════════════════════════════════════════════");
      
      return {
        isValid: false,
        error: `Status ${response.status}`
      };
    }
  } catch (error) {
    console.log("║ ❌ Error verifying token:", error);
    console.log("║ TOKEN STATUS: ❌ VERIFICATION FAILED");
    console.log("╚════════════════════════════════════════════════════════");
    
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Helper function untuk clear semua data autentikasi (untuk testing)
 */
export const clearAuthData = () => {
  console.log("╔════════════════════════════════════════════════════════");
  console.log("║ CLEARING ALL AUTHENTICATION DATA");
  console.log("╠════════════════════════════════════════════════════════");
  
  // Clear cookies
  Cookies.remove("isLoggedIn", { path: "/" });
  Cookies.remove("userRole", { path: "/" });
  Cookies.remove("userRoomId", { path: "/" });
  console.log("║ ✅ Cookies cleared");
  
  // Clear localStorage
  localStorage.removeItem("userData");
  localStorage.removeItem("roomId");
  console.log("║ ✅ LocalStorage cleared");
  
  console.log("╚════════════════════════════════════════════════════════");
};
