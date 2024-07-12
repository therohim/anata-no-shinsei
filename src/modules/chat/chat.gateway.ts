import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { MessageService } from '../message/service/message.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => MessageService)) private readonly messagesService: MessageService
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    // @ConnectedSocket() client: Socket
  ): Promise<void> {
    this.server.emit('sendMessage', createMessageDto);
    // const message = await this.messagesService.create(createMessageDto);
    // this.server.to(createMessageDto.room).emit('receiveMessage', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket
  ): void {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket
  ): void {
    client.leave(room);
  }
}
