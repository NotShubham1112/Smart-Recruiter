import type { FastifyInstance } from 'fastify';

export async function roleRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { roles: [], total: 0, page: 1 };
  });
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Role detail endpoint' };
  });
  app.post('/', async (request) => {
    return { id: 'new-role-id', message: 'Role created' };
  });
}
