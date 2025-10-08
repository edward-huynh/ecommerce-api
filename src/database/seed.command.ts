import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedDataService } from './seed-data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedDataService);
  
  try {
    await seedService.seedAll();
    console.log('🎉 Seed data completed successfully!');
  } catch (error) {
    console.error('❌ Seed data failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();