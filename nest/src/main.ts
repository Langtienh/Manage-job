import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // get config (use env)
  const configService = app.get(ConfigService);

  // config auth guard globally
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // enable cors
  // origin: Fe domain, example: 'http://localhost:3000',
  // origin: '*',
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  app.enableCors();

  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();
