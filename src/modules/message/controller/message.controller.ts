import { Body, Controller, forwardRef, Get, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AtGuard, GetCurrentUserId } from '@src/common';
import { ResponseService } from '@src/utils/response/service/response.service';
import { MessageResponseDto, UserObject } from '../dto/message-response.dto';
import { ParticipansResponseDto, RoomResponseDto } from '../dto/room-response.dto';
import { MessageService } from '../service/message.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { ChatGateway } from '@src/modules/chat/chat.gateway';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway,
  ) {}

  @Post('/send')
  @UseGuards(AtGuard)
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @GetCurrentUserId() userId: string) {
    if (sendMessageDto.receiver == userId) {
      return this.responseService.error("you cannot send message your self", HttpStatus.BAD_REQUEST)
    }
    const createMessage : CreateMessageDto = {
      sender:userId,
      receiver: sendMessageDto.receiver,
      message: sendMessageDto.message
    }

    // Process message and save to database
    await this.messageService.create(createMessage);

    // publish to socket.io
    this.chatGateway.server.emit('sendMessage', createMessage);

    return this.responseService.success(null)
  }


  @Get('/rooms')
  @UseGuards(AtGuard)
  async findRooms(
    @GetCurrentUserId() userId: string,
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
   ) {
    page = (page) ? page : 1
    limit = (limit) ? limit : 10
    const rooms = await this.messageService.findRooms(page, limit, userId, {search})
    const datas : RoomResponseDto[] = []
    for(let i= 0; i < rooms.data.length; i++) {
      const participans : ParticipansResponseDto[] = []
      for (let j=0; j < rooms.data[i].participantInfos.length; j++) {
        participans.push({
          id: rooms.data[i].participantInfos[j]._id,
          name: rooms.data[i].participantInfos[j].name,
        })
      }
      datas.push({
        id:rooms.data[i]._id,
        user: participans,
        last_message: rooms.data[i].last_message
      })
    }

    const meta = {
      page: page,
      limit:limit,
      total_pages: rooms.totalPages,
      total_count: rooms.totalCount,
    }
    return this.responseService.pagination(datas, meta)
  }

  @Get('/rooms/:roomId')
  @UseGuards(AtGuard)
  async findMessages(
    @GetCurrentUserId() userId: string,
    @Param('roomId') roomId = "",
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
   ) {
    page = (page) ? page : 1
    limit = (limit) ? limit : 10
    if (roomId == "" || roomId == ":roomId") {
      return this.responseService.pagination(null, null, "room ID cannnot be empty", HttpStatus.BAD_REQUEST)
    }
    const message = await this.messageService.findMessagesByRoomID(page, limit, roomId, {search})
    const datas : MessageResponseDto[] = []
    for(let i= 0; i < message.data.length; i++) {
      const sender : UserObject = {
        id:'',
        name:''
      }
      const receiver : UserObject = {
        id:'',
        name:''
      }
      if(message.data[i].sender._id == userId) {
        sender.id = message.data[i].sender._id || ''
        sender.name= message.data[i].sender.name || ''
      } else {
        receiver.id = message.data[i].sender._id || ''
        receiver.name= message.data[i].sender.name || ''
      }
      if(message.data[i].receiver._id == userId) {
        sender.id = (message.data[i].receiver) ? message.data[i].receiver._id : ''
        sender.name= (message.data[i].receiver) ? message.data[i].receiver.name : ''
      } else {
        receiver.id = (message.data[i].receiver) ? message.data[i].receiver._id : ''
        receiver.name= (message.data[i].receiver) ? message.data[i].receiver.name : ''
      }
      datas.push({
        id:message.data[i]._id,
        message:message.data[i].message,
        sender,
        receiver,
        created_at:message.data[i].createdAt,
        updated_at:message.data[i].updatedAt,
      })
    }

    const meta = {
      page: page,
      limit:limit,
      total_pages: message.totalPages,
      total_count: message.totalCount,
    }
    return this.responseService.pagination(datas, meta)
  }
}
