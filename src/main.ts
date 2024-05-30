import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'src/config/storage.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.image.destination, {
    prefix: StorageConfig.image.urlPrefix,
    maxAge: StorageConfig.image.maxAge,
  });


  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
