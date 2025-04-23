import axios from "axios";
import WaktuPelaksanaan from "../model/WaktuPelaksanaan";

const API_URL = "http://localhost:8080/api/kebersihan";

// Configure Axios with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use((request) => {
  console.log("Request:", request);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export interface Kebersihan {
  id?: number;
  roomNumber: string;
  areaParking: boolean;
  areaCorridor: boolean;
  areaTerrace: boolean;
  areaGarden: boolean;
  executionTime: WaktuPelaksanaan; // Using the enum type
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

// Re-export the enum for convenience
export { WaktuPelaksanaan };

export const getAllKebersihan = async (): Promise<Kebersihan[]> => {
  try {
    const response = await api.get("");
    return response.data;
  } catch (error) {
    console.error("Error fetching cleaning schedules:", error);
    throw error;
  }
};

export const getKebersihanByRoom = async (
  roomNumber: string
): Promise<Kebersihan[]> => {
  try {
    const response = await api.get("");
    // Filter the schedules for the specific room
    return response.data.filter(
      (item: Kebersihan) =>
        item.roomNumber.toLowerCase() === roomNumber.toLowerCase()
    );
  } catch (error) {
    console.error(
      `Error fetching cleaning schedules for room ${roomNumber}:`,
      error
    );
    throw error;
  }
};

export const getKebersihanById = async (id: number): Promise<Kebersihan> => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cleaning schedule with id ${id}:`, error);
    throw error;
  }
};

export const createKebersihan = async (
  data: Kebersihan
): Promise<Kebersihan> => {
  try {
    // Remove any properties that should be managed by the server
    const { createdAt, updatedAt, ...cleanData } = data as any;

    const response = await api.post("", cleanData);
    return response.data;
  } catch (error) {
    console.error("Error creating cleaning schedule:", error);
    throw error;
  }
};

export const updateKebersihan = async (
  id: number,
  data: Kebersihan
): Promise<Kebersihan> => {
  try {
    // Ensure we're not sending createdAt/updatedAt fields which are managed by server
    const { createdAt, updatedAt, ...cleanData } = data as any;

    console.log(
      `Sending PUT request to ${API_URL}/${id} with data:`,
      cleanData
    );
    const response = await api.put(`/${id}`, cleanData);
    return response.data;
  } catch (error) {
    console.error(`Error updating cleaning schedule with id ${id}:`, error);
    throw error;
  }
};

export const deleteKebersihan = async (id: number): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    console.error(`Error deleting cleaning schedule with id ${id}:`, error);
    throw error;
  }
};

// Helper functions
export const getAreaNames = (schedule: Kebersihan): string[] => {
  const areas = [];
  if (schedule.areaParking) areas.push("Area Parkir");
  if (schedule.areaCorridor) areas.push("Koridor");
  if (schedule.areaTerrace) areas.push("Teras");
  if (schedule.areaGarden) areas.push("Taman");
  return areas;
};

export const getReadableTime = (time: WaktuPelaksanaan): string => {
  switch (time) {
    case WaktuPelaksanaan.MORNING:
      return "Pagi";
    case WaktuPelaksanaan.AFTERNOON:
      return "Siang";
    case WaktuPelaksanaan.NIGHT:
      return "Malam";
    default:
      return "";
  }
};
