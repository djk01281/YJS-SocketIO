import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(3000);
}
bootstrap();
