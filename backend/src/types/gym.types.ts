export interface Gym {
  id: string;
  name: string;
  maxCapacity: number;
  currentFullness: number; // For capacity percentage
}

export interface Booking {
  userId: string;
  gymId: string;
  timestamp: string;
}

export interface CapacityResponse {
  gymId: string;
  capacityPercentage: number;
  maxCapacity: number;
  currentCount: number;
}
