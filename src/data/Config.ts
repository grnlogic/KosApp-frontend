// Konfigurasi URL API berdasarkan environment
export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  'https://manage-kost-production.up.railway.app'; // Ganti dengan URL API backend Anda

// Konfigurasi lain yang diperlukan
export const APP_VERSION = '1.0.0';

// Konfigurasi waktu cookie (dalam hari)
export const AUTH_COOKIE_EXPIRY = 7;