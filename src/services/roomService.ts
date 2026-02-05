import axios from 'axios';

// Base URL for API - adjust based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://141.11.25.167:8080/api';

// Room interface matching backend model
export interface Room {
  id: number;
  nomorKamar: string;
  status: 'kosong' | 'terisi' | 'pending';
  hargaBulanan: number;
  fasilitas: string;
  title: string;
  description: string;
  price: number;
  statusPembayaran?: string;
}

// Room Statistics interface
export interface RoomStatistics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  pendingRooms: number;
}

// Search parameters
export interface RoomSearchParams {
  maxPrice?: number;
  minPrice?: number;
  facility?: string;
}

/**
 * Room Service - Handle all room-related API calls
 */
class RoomService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/rooms`;
  }

  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    try {
      const response = await axios.get<Room[]>(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all rooms:', error);
      throw error;
    }
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: number): Promise<Room> {
    try {
      const response = await axios.get<Room>(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get room by room number
   */
  async getRoomByNomorKamar(nomorKamar: string): Promise<Room> {
    try {
      const response = await axios.get<Room>(`${this.baseURL}/nomor/${nomorKamar}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${nomorKamar}:`, error);
      throw error;
    }
  }

  /**
   * Get all available rooms
   */
  async getAvailableRooms(): Promise<Room[]> {
    try {
      const response = await axios.get<Room[]>(`${this.baseURL}/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }

  /**
   * Get rooms by status
   */
  async getRoomsByStatus(status: 'kosong' | 'terisi' | 'pending'): Promise<Room[]> {
    try {
      const response = await axios.get<Room[]>(`${this.baseURL}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms by status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Search rooms with filters
   */
  async searchRooms(params: RoomSearchParams): Promise<Room[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.facility) queryParams.append('facility', params.facility);

      const response = await axios.get<Room[]>(`${this.baseURL}/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching rooms:', error);
      throw error;
    }
  }

  /**
   * Get room statistics
   */
  async getRoomStatistics(): Promise<RoomStatistics> {
    try {
      const response = await axios.get<RoomStatistics>(`${this.baseURL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room statistics:', error);
      throw error;
    }
  }

  /**
   * Create new room (Admin only)
   */
  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    try {
      const response = await axios.post<Room>(this.baseURL, room);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Update room (Admin only)
   */
  async updateRoom(id: number, room: Partial<Room>): Promise<Room> {
    try {
      const response = await axios.put<Room>(`${this.baseURL}/${id}`, room);
      return response.data;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update room status only
   */
  async updateRoomStatus(id: number, status: 'kosong' | 'terisi' | 'pending'): Promise<Room> {
    try {
      const response = await axios.patch<Room>(`${this.baseURL}/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating room status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Room> {
    try {
      const response = await axios.patch<Room>(
        `${this.baseURL}/${id}/payment-status?paymentStatus=${paymentStatus}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating payment status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete room (Admin only)
   */
  async deleteRoom(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${id}`);
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if room number exists
   */
  async checkRoomNumberExists(nomorKamar: string): Promise<boolean> {
    try {
      const response = await axios.get<{ nomorKamar: string; exists: boolean }>(
        `${this.baseURL}/check/${nomorKamar}`
      );
      return response.data.exists;
    } catch (error) {
      console.error(`Error checking room number ${nomorKamar}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const roomService = new RoomService();
export default roomService;
