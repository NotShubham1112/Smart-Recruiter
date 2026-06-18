import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export async function authPlugin(app: FastifyInstance): Promise<void> {
  await app.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production' });
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}

export default fp(authPlugin);
