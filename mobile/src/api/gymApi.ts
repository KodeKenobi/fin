import { CapacityData, BookingResponse } from '../types';

const BASE_URL = 'http://localhost:3000'; // Replace with actual API URL for production

export const gymApi = {
  getCapacity: async (gymId: string): Promise<CapacityData> => {
    const response = await fetch(`${BASE_URL}/gyms/${gymId}/capacity`);
    if (!response.ok) {
      throw new Error('Failed to fetch capacity');
    }
    return response.json();
  },

  bookSlot: async (gymId: string, userId: string): Promise<BookingResponse> => {
    const response = await fetch(`${BASE_URL}/gyms/${gymId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to book slot');
    }
    return response.json();
  },
};
