import {
  configureApi,
  configureOrigin,
  configurePipes,
  configureSwagger,
  disableXPoweredByHeader,
  configureInterceptors,
  configureFilters,
} from '@common/common/bootstrap/bootstrap.functions';
import { AppConfigService } from '@common/common/config/app-config.service';
import { authentication } from '@common/common/middlewares/context.middleware';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { pid } from 'node:process';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfigService);

  app.use(authentication);

  configureApi(app);
  configurePipes(app);
  configureOrigin(app);
  configureSwagger(app);
  configureFilters(app);
  configureInterceptors(app);
  disableXPoweredByHeader(app);

  const port = config.getOrThrow('http.port', { infer: true });
  const host = config.getOrThrow('http.host', { infer: true });
  const mode = config.getOrThrow('node.env', { infer: true });

  await app.listen(port, '0.0.0.0');

  console.log(`
    Application started at: ${host}:${port}
    Swagger docs: ${host}:${port}/docs
    Mode: ${mode}
    Pid: ${pid}
  `);
})();
