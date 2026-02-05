import axiosInstance from "../data/axiosConfig";
import WaktuPelaksanaan from "../model/WaktuPelaksanaan";

const KEBERSIHAN_PATH = "/api/kebersihan";

export interface Kebersihan {
  id?: number;
  roomNumber: string;
  areaParking: boolean;
  areaCorridor: boolean;
  areaTerrace: boolean;
  areaGarden: boolean;
  executionTime: WaktuPelaksanaan; // Using the enum type
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Re-export the enum for convenience
export { WaktuPelaksanaan };

export const getAllKebersihan = async (): Promise<Kebersihan[]> => {
  try {
    const response = await axiosInstance.get(KEBERSIHAN_PATH);
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
    const response = await axiosInstance.get(KEBERSIHAN_PATH);
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
    const response = await axiosInstance.get(`${KEBERSIHAN_PATH}/${id}`);
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

    const response = await axiosInstance.post(KEBERSIHAN_PATH, cleanData);
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

  
    
    const response = await axiosInstance.put(`${KEBERSIHAN_PATH}/${id}`, cleanData);
    return response.data;
  } catch (error) {
    console.error(`Error updating cleaning schedule with id ${id}:`, error);
    throw error;
  }
};

export const deleteKebersihan = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${KEBERSIHAN_PATH}/${id}`);
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
