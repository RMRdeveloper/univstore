import { NestFactory } from '@nestjs/core';
import { StandaloneSeedModule } from './standalone-seed.module.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(StandaloneSeedModule);


  try {
    // Seed is now executed automatically on application bootstrap
    console.log('Seed process initiated...');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
