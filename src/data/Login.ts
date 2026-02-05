import Cookies from "js-cookie"; // Import js-cookie

export const Login = async (username: string, password: string) => {
  try {
    const apiBaseUrl =
      process.env.REACT_APP_API_BASE_URL ||
      "http://141.11.25.167:8080";

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const responseText = await response.text(); // Ambil response sebagai teks (untuk debugging)

    if (!response.ok) {
      console.error("Login Error:", responseText);
      alert(`Login gagal: ${responseText}`); // Tampilkan error yang dikirim dari backend
      return false;
    }

    try {
      const data = JSON.parse(responseText); // Coba parsing ke JSON
      if (data.token) {
        localStorage.setItem("token", data.token);
        Cookies.set("authToken", data.token, { expires: 7 }); // Simpan token ke cookies dengan masa berlaku 7 hari
        return true;
      } else {
        console.warn("Token tidak ditemukan dalam response:", data);
        alert("Login berhasil tetapi token tidak ditemukan!");
        return false;
      }
    } catch (error) {
      console.error("Response bukan JSON:", responseText);
      alert("Login berhasil tetapi format response salah!");
      return false;
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Terjadi kesalahan saat login.");
    return false;
  }
};
