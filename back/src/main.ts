import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //For production prefix will be set on ingress level
  if(process.env.NODE_ENV !== 'production'){
    app.setGlobalPrefix('api');
  }
  
  app.enableVersioning({
    type: VersioningType.URI
  }).enableCors({
    origin: process.env.ALLOWED_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
