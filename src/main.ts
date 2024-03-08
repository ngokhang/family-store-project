import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.use(helmet());
  app.use(compression());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });
  await app.listen(8000);
}
bootstrap();
