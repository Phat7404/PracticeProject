import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './modules/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    abortOnError: false,
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8080;
  
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  app.enableCors();

  // Listen on all network interfaces with a timeout
  await app.listen(port, '0.0.0.0');
}

// Handle Cloudflare Workers environment
if (typeof process === 'undefined') {
  // We're in a Cloudflare Worker
  bootstrap().catch(console.error);
} else {
  // We're in Node.js
  bootstrap();
}
