import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GymService } from '../services/gym.service.js';
import { GymRepository } from '../repositories/gym.repository.js';

describe('GymService', () => {
  let gymRepository: GymRepository;
  let gymService: GymService;

  beforeEach(() => {
    gymRepository = new GymRepository();
    gymService = new GymService(gymRepository);
  });

  it('should return correct capacity', async () => {
    const capacity = await gymService.getCapacity('gym-123');
    expect(capacity.gymId).toBe('gym-123');
    // Initial seeded data: max 100, current 75
    expect(capacity.capacityPercentage).toBe(75);
  });

  it('should allow booking when capacity is available', async () => {
    const booking = await gymService.bookSlot('user-1', 'gym-123');
    expect(booking.userId).toBe('user-1');
    expect(booking.gymId).toBe('gym-123');

    const capacity = await gymService.getCapacity('gym-123');
    // 75 sensors + 1 booking = 76%
    expect(capacity.capacityPercentage).toBe(76);
  });

  it('should not allow double-booking by the same user', async () => {
    await gymService.bookSlot('user-1', 'gym-123');
    await expect(gymService.bookSlot('user-1', 'gym-123')).rejects.toThrow('User already has a booking');
  });

  it('should not allow booking when gym is full', async () => {
    // Fill up the gym (100 total capacity, 75 initial, so 25 slots left)
    for (let i = 0; i < 25; i++) {
      await gymService.bookSlot(`user-${i}`, 'gym-123');
    }

    await expect(gymService.bookSlot('user-overflow', 'gym-123')).rejects.toThrow('Gym is at max capacity');
  });
});
