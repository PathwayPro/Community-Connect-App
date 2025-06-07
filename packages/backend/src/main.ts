import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorInterceptor, ResponseInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  app.enableCors();

  app.useGlobalInterceptors(new ResponseInterceptor(), new ErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Community Connect API')
    .setDescription('Community Connect API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter your Bearer token',
      },
      'JWT',
    )
    .addTag('Authentication', 'Authentication related endpoints')
    .build();

  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      url: '/api/v1/api-json', // Update the Swagger UI to fetch the prefixed JSON
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
