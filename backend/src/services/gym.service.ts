import { GymRepository } from '../repositories/gym.repository.js';
import { Booking, CapacityResponse } from '../types/gym.types.js';

export class GymService {
  constructor(private gymRepository: GymRepository) {}

  async getCapacity(gymId: string): Promise<CapacityResponse> {
    const gym = await this.gymRepository.getGymById(gymId);
    if (!gym) {
      throw new Error('Gym not found');
    }

    const bookings = await this.gymRepository.getBookingsByGymId(gymId);
    
    // In a real scenario, "Current Fullness" might come from IoT sensors.
    // Here we combine sensors (currentFullness) with active slot bookings.
    // For simplicity, let's say slots are reserved capacity.
    const activeBookingsCount = bookings.length;
    const currentCount = Math.floor((gym.currentFullness / 100) * gym.maxCapacity) + activeBookingsCount;
    
    const capacityPercentage = Math.min(100, Math.round((currentCount / gym.maxCapacity) * 100));

    return {
      gymId: gym.id,
      capacityPercentage,
      maxCapacity: gym.maxCapacity,
      currentCount: Math.min(gym.maxCapacity, currentCount),
    };
  }

  /**
   * High Concurrency Booking Logic
   * In a real-world cloud-native app, we would use:
   * 1. Redis LUA scripts for atomic check-and-set.
   * 2. SQL Transactions with SERIALIZABLE isolation.
   * 3. Optimistic concurrency control (versioning).
   * 
   * For this mock, we demonstrate the logic by checking capacity before adding a booking.
   */
  async bookSlot(userId: string, gymId: string): Promise<Booking> {
    const gym = await this.gymRepository.getGymById(gymId);
    if (!gym) {
      throw new Error('Gym not found');
    }

    const bookings = await this.gymRepository.getBookingsByGymId(gymId);
    
    // Calculate current fullness from sensors
    const sensorCount = Math.floor((gym.currentFullness / 100) * gym.maxCapacity);
    const availableSlots = gym.maxCapacity - sensorCount;

    // Requirement Check: Ensure slot is not double-booked (over capacity)
    if (bookings.length >= availableSlots) {
      throw new Error('Gym is at max capacity');
    }

    // Check if user already has a booking
    const existing = bookings.find(b => b.userId === userId);
    if (existing) {
      throw new Error('User already has a booking for this gym');
    }

    const newBooking: Booking = {
      userId,
      gymId,
      timestamp: new Date().toISOString(),
    };

    await this.gymRepository.addBooking(newBooking);
    return newBooking;
  }
}
