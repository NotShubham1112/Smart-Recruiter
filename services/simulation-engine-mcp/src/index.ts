import { startServer } from './server.js';

const PORT = Number(process.env.PORT ?? 4105);

async function main() {
  const server = await startServer(PORT);
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch(console.error);
