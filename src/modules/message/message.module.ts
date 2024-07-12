import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from '../chat/chat.module';
import { UsersModule } from '../user/users.module';
import { MessageController } from './controller/message.controller';
import { Message, MessageSchema } from './schema/message.schema';
import { MessageService } from './service/message.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { Room, RoomSchema } from './schema/room.schema';
import { ResponseService } from '@src/utils/response/service/response.service';
import { ChatGateway } from '../chat/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: Room.name, schema: RoomSchema }]),
    UsersModule,
    forwardRef(() => ChatModule),
    forwardRef(() => RabbitMQModule)
    // RabbitMQModule
  ],
  providers: [
    MessageService,
    ResponseService,
    ChatGateway
  ],
  controllers: [MessageController],
  exports: [MessageService], // Export services if needed in other modules
})
export class MessageModule {}
