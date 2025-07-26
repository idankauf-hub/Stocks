import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { JwtAuthGuard } from './app/auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
