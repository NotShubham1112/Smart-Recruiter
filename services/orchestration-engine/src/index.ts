import { QueueConsumer } from './queue-consumer.js';

async function main() {
  const consumer = new QueueConsumer();
  await consumer.start();
  process.on('SIGTERM', async () => {
    await consumer.stop();
    process.exit(0);
  });
}

main().catch(console.error);
