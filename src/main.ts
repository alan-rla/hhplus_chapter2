import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './httpException.filter';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { winstonLogger } from './libs/utils/winston.utils';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
    }),
  );

  // NestJS/Swagger 적용
  const config = new DocumentBuilder()
    .setTitle('항해 플러스 챕터 2 - 대기열')
    .setDescription('항해 플러스 챕터 2 백엔드')
    .setVersion('1.0')
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { withCredentials: true, defaultModelsExpandDepth: -1 },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  // HTTP 예외처리용 필터 사용
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = +configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
