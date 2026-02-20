export interface CapacityData {
  gymId: string;
  capacityPercentage: number;
  maxCapacity: number;
  currentCount: number;
}

export interface BookingResponse {
  userId: string;
  gymId: string;
  timestamp: string;
}

export type UIState = 'idle' | 'loading' | 'success' | 'error';
