import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { GymService } from '../services/gym.service.js';
import { GymRepository } from '../repositories/gym.repository.js';

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  const gymRepository = new GymRepository();
  const gymService = new GymService(gymRepository);

  fastify.get('/:id/capacity', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const capacity = await gymService.getCapacity(id);
      return capacity;
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  });

  fastify.post('/:id/book', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = request.body as { userId: string };

    if (!userId) {
      reply.status(400).send({ error: 'userId is required' });
      return;
    }

    try {
      const booking = await gymService.bookSlot(userId, id);
      return booking;
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  });
}
