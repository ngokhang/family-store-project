import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './models/auth/passport/jwt/jwt-auth.guard';

async function bootstrap() {
  const compression = require('compression');
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error'],
  });
  const reflector = app.get(Reflector);
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
    preflightContinue: false,
    credentials: true,
  });

  app.use(compression());
  await app.listen(8000);
}
bootstrap();
