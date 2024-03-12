import { VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { JwtAuthGuard } from './auth/passport/jwt/jwt-auth.guard';

async function bootstrap() {
  const compression = require('compression');
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.use(helmet());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.use(compression());
  await app.listen(8000);
}
bootstrap();
