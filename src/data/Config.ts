// Konfigurasi URL API berdasarkan environment
// Support untuk Create React App (process.env)
const getEnvVar = (craKey: string, fallback: string): string => {
  // Check Create React App environment variables
  if (typeof process !== 'undefined' && process.env && process.env[craKey]) {
    return process.env[craKey] as string;
  }
  
  // Return fallback
  return fallback;
};

export const API_BASE_URL = getEnvVar(
  'REACT_APP_API_BASE_URL',
  'http://141.11.25.167:8080'
);

export const API_URL = getEnvVar(
  'REACT_APP_API_URL',
  'http://141.11.25.167:8080/api'
);

// Konfigurasi lain yang diperlukan
export const APP_VERSION = '1.0.0';

// Konfigurasi waktu cookie (dalam hari)
export const AUTH_COOKIE_EXPIRY = 7;