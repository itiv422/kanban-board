import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config = require('config');

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || config.get('server.port');
  const options = new DocumentBuilder()
    .setTitle('Todo example')
    .setDescription('The simple todo application')
    .setVersion('1.0')
    .addTag('todo')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
