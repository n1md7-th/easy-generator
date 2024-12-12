import { HttpExceptionsFilter } from '@common/common/filters/exception.filter';
import { ExceptionInterceptor } from '@common/common/interceptors/exception-handler.interceptor';
import { RequestInterceptor } from '@common/common/interceptors/request.interceptor';
import { description, name, version } from '../../../../package.json';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'node:path';
import { cwd, env } from 'node:process';
import { dump } from 'js-yaml';

export function configureApi(app: NestExpressApplication) {
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}

export function configurePipes(app: NestExpressApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

export function configureOrigin(app: NestExpressApplication) {
  app.enableCors({
    origin: (origin, callback) => {
      const corsWhitelist = env.ORIGINS.split(',') || [];
      const originNotDefined = !origin;
      const isWhitelisted = corsWhitelist.indexOf(origin) !== -1;
      const isLocalhost = new RegExp(/^https?:\/\/(localhost|127.0.0.1)/).test(
        origin,
      );
      const corsAllowed = originNotDefined || isLocalhost || isWhitelisted;

      if (corsAllowed) return callback(null, true);
      callback(new Error(`Origin [${origin}] Not allowed by CORS`));
    },
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type, X-SESSION-ID, X-REQUEST-ID',
    exposedHeaders: 'Authorization',
    credentials: true,
  });
}

export function configureSwagger(app: NestExpressApplication) {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT auth token',
        in: 'header',
      })
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .build(),
    {
      extraModels: [],
    },
  );
  try {
    writeFileSync(join(cwd(), './docs/swagger.yaml'), dump(document));
  } catch (error) {
    console.error(
      `Error while writing swagger.yaml file: ${error}`,
      'Bootstrap',
    );
  }

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

export function disableXPoweredByHeader(app: NestExpressApplication) {
  app.getHttpAdapter().getInstance().disable('x-powered-by');
}

export function configureInterceptors(app: NestExpressApplication) {
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalInterceptors(new ExceptionInterceptor());
}

export function configureFilters(app: NestExpressApplication) {
  app.useGlobalFilters(new HttpExceptionsFilter());
}
