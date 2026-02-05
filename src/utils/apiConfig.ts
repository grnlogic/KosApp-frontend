/**
 * API Configuration Helper
 * Centralized API URL management untuk menghindari hardcoded URLs
 */

// Get API Base URL dari environment variable
export const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_BASE_URL || 'http://141.11.25.167:8080';
};

// Get API URL (dengan /api suffix)
export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || 'http://141.11.25.167:8080/api';
};

// Helper untuk membuat full API endpoint
export const getApiEndpoint = (path: string): string => {
  const apiUrl = getApiUrl();
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${apiUrl}/${cleanPath}`;
};

// Export sebagai default object
export default {
  getApiBaseUrl,
  getApiUrl,
  getApiEndpoint,
  // Convenience properties
  baseUrl: getApiBaseUrl(),
  apiUrl: getApiUrl(),
};
