import WaktuPelaksanaan from "./WaktuPelaksanaan";

interface Kebersihan {
  id?: number;
  roomNumber: string;
  areaParking: boolean;
  areaCorridor: boolean;
  areaTerrace: boolean;
  areaGarden: boolean;
  executionTime: WaktuPelaksanaan;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export default Kebersihan;
