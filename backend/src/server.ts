import Fastify from 'fastify';
import cors from '@fastify/cors';
import gymRoutes from './routes/gym.routes.js';

const fastify = Fastify({
  logger: true,
});

// Register Plugins
await fastify.register(cors, {
  origin: '*', // For demo purposes
});

// Register Routes
fastify.register(gymRoutes, { prefix: '/gyms' });

// Health Check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
