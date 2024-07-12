import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './service/rabbitmq.service';
import { MessageModule } from '../message/message.module';
import { RabbitMQController } from './controller/rabbitmq.controller';
import { QueueName } from './enum/rabbitmq.enum';
import { AMQP_URI } from '@src/environments';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: [AMQP_URI],
          queue: QueueName.NAME,
        },
      },
    ]),
    forwardRef(() => MessageModule)
  ],
  controllers:[RabbitMQController],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
