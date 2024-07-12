import { forwardRef, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports:[
    forwardRef(() => MessageModule)
  ],
  providers: [ChatGateway],
  exports:[ChatGateway]
})
export class ChatModule {}