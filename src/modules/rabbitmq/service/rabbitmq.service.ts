import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy, MessagePattern } from '@nestjs/microservices';
import { MessageService } from 'src/modules/message/service/message.service';
import { QueueName, QueuePattern } from '../enum/rabbitmq.enum';

@Injectable()
export class RabbitMQService {

  constructor(
    @Inject('rabbit-mq-module') private readonly client: ClientProxy,
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService,
  ) {}

  async sendChatMessage(pattern :string, message: any): Promise<any> {
    try {
      const result = await this.client.emit(pattern, message).toPromise();
      return result
    } catch(err) {
      Logger.log('Message received from socket.io err :', err)
    }
  }
}