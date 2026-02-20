import { Gym, Booking } from '../types/gym.types.js';

export class GymRepository {
  private gyms: Map<string, Gym> = new Map();
  private bookings: Map<string, Booking[]> = new Map();

  constructor() {
    // Seed with some initial data
    this.gyms.set('gym-123', {
      id: 'gym-123',
      name: 'Central Fitness',
      maxCapacity: 100,
      currentFullness: 75,
    });
    this.bookings.set('gym-123', []);
  }

  async getGymById(id: string): Promise<Gym | undefined> {
    return this.gyms.get(id);
  }

  async getBookingsByGymId(gymId: string): Promise<Booking[]> {
    return this.bookings.get(gymId) || [];
  }

  async addBooking(booking: Booking): Promise<void> {
    const currentBookings = this.bookings.get(booking.gymId) || [];
    this.bookings.set(booking.gymId, [...currentBookings, booking]);
  }
}
