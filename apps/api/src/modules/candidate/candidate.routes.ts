import type { FastifyInstance } from 'fastify';

export async function candidateRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { candidates: [], total: 0, page: 1 };
  });
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Candidate detail endpoint' };
  });
  app.post('/', async (request) => {
    return { id: 'new-candidate-id', message: 'Candidate created' };
  });
}
