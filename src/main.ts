import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('Compatibility Calculation Service API')
      .setDescription('Compatibility Calculation Service Documentation')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
