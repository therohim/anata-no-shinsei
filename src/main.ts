import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerMiddleware, ValidationPipe } from './common';
import { LoggerFactory } from './config';
import { AMQP_URI, APP_PORT, NODE_ENV } from './environments';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QueueName } from './modules/rabbitmq/enum/rabbitmq.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    // logger: new LoggerFactory(),
    cors: true
  });
  
  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix('api');

  app.use(helmet());

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded())

  // loggerMiddleware
  NODE_ENV !== 'testing' && app.use(LoggerMiddleware)

  app.enableCors({
    origin: '*',
    credentials: false,
  });

  app.use(cookieParser());

  // Starts listening to shutdown hooks
  app.enableShutdownHooks()

  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [AMQP_URI],
      queue: QueueName.NAME,
      // false = manual acknowledgement; true = automatic acknowledgment
      noAck: false,
      // Get one by one
      prefetchCount: 1
    }
  });

  await app.listen(APP_PORT);
  await microservice.listen()
}
bootstrap();
