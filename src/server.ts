import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`[Server] Backend listening on http://localhost:${ENV.PORT}`);
    console.log(`[Server] CORS configured for frontend at: ${ENV.FRONTEND_URL}`);
    console.log(`[Server] AI mock mode: ${ENV.AI_MOCK_MODE ? 'ENABLED (deterministic responses)' : 'DISABLED (real API)'}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
