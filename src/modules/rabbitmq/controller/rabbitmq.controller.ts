import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitMQService } from '../service/rabbitmq.service';
import { Public } from '@src/common';
import { QueuePattern } from '../enum/rabbitmq.enum';

@Controller()
export class RabbitMQController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Public()
  @MessagePattern(QueuePattern.QUEUE_PATTERN_CHAT_MESSAGE)
  public async receiveChatMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    try {
      const channel = context.getChannelRef();
      const orginalMessage = context.getMessage()
      channel.ack(orginalMessage);
    } catch(err) {
      console.log("err receive consume ",err)
    }
  }
}