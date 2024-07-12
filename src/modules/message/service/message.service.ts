import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message } from '../schema/message.schema';
import { RabbitMQService } from 'src/modules/rabbitmq/service/rabbitmq.service';
import { Room } from '../schema/room.schema';
import { ObjectId } from 'mongodb';
import { CreateRoomDto } from '../dto/create-room.dto';
import { MessageServiceInterface } from '../interface/message.interface';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { QueuePattern } from '@src/modules/rabbitmq/enum/rabbitmq.enum';
import { RoomResponseDto } from '../dto/room-response.dto';

@Injectable()
export class MessageService implements MessageServiceInterface {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway,
    @Inject(forwardRef(() => RabbitMQService)) private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const room = await this.findRoomByParticipants(createMessageDto.sender, createMessageDto.receiver)
    const createRoomDto: CreateRoomDto = {
      last_message: createMessageDto.message,
      participants:[
        createMessageDto.sender,
        createMessageDto.receiver
      ]
    }
    if (room.length > 0) {
      createMessageDto.room_id = room[0]._id as string
      const result = await this.updateLastMessage(createMessageDto.room_id, createRoomDto)
    } else {
      const saveRoom = await this.createRoom(createRoomDto)
      createMessageDto.room_id = saveRoom.id
    }
    
    const createdMessage = new this.messageModel({
      sender: new ObjectId(createMessageDto.sender),
      receiver: new ObjectId(createMessageDto.receiver),
      room_id:createMessageDto.room_id,
      message: createMessageDto.message
    });
    await createdMessage.save();

    // Send message to RabbitMQ
    this.rabbitMQService.sendChatMessage(QueuePattern.QUEUE_PATTERN_CHAT_MESSAGE, createdMessage);
    return createdMessage;
  }

  async findRoomByParticipants(sender: string, receiver: string): Promise<Room[]> {
    const sender2ObjectId = new ObjectId(sender);
    const receiver2ObjectId = new ObjectId(receiver);

    const result = this.roomModel.aggregate([
      {
        $match:{
          participants:{
            $all:[sender2ObjectId, receiver2ObjectId]
          }
        }
      }
    ])
    return await result.exec()
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const participantsIds = createRoomDto.participants.map(participant => new ObjectId(participant));
    
    // Create new chat instance
    const createRoom = new this.roomModel({
      participants: participantsIds,
      last_message: createRoomDto.last_message
    });
    return createRoom.save();
  }

  async updateLastMessage(id: string, createRoomDto: CreateRoomDto): Promise<any>{
    return await this.roomModel.updateOne({_id: id}, {last_message: createRoomDto.last_message})
  }

  async handleIncomingMessage(message: Message): Promise<void> {
    // Handle the incoming message from RabbitMQ (you might need to inject a gateway here)
    this.chatGateway.server.to(message.room_id.toString()).emit('receiveMessage', message);
  }

  async findRooms(page = 1, limit = 10, userId="", filter : any): Promise<any> {
    try {
      const currentUserId = (userId) ? new ObjectId(userId) : null
      const aggregatePipeline: any[] = [];
      if (currentUserId) {
        aggregatePipeline.push({
          $match:{
            participants:{
              $in:[currentUserId]
            }
          }
        })
      }
      
      if (filter.search) {
        aggregatePipeline.push({
          $match: {
            $or: [
              { name: { $regex: filter.search, $options: 'i' } },
            ],
          },
        });
      }

      aggregatePipeline.push({
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantInfos"
        }
      })

      aggregatePipeline.push({
        $facet:{
          data:[
            {
              $sort:{
                "updatedAt":-1
              }
            },
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          totalCount:[
            {
              $count:'count'
            }
          ]
        }
      })

      // aggregatePipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
      const result = await this.roomModel.aggregate(aggregatePipeline).exec()

      const totalCount = result[0].totalCount[0]?.count || 0
      const data = result[0].data
      
      return {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount/limit),
        data
      }
    } catch (error:any) {
      // Handle error appropriately
      throw new Error(`Failed to find chat rooms: ${error.message}`);
    }
  }

  async findMessagesByRoomID(page = 1, limit = 10,roomId: string, filter : any): Promise<any> {
    try {
      const aggregatePipeline: any[] = [];

      aggregatePipeline.push({
        $match:{
          room_id:new ObjectId(roomId)
        }
      })
      
      if (filter.search) {
        aggregatePipeline.push({
          $match: {
            $or: [
              { message: { $regex: filter.search, $options: 'i' } },
            ],
          },
        });
      }

      aggregatePipeline.push({
        $sort:{
          _id:-1
        }
      })

      aggregatePipeline.push({
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender"
        }
      })

      aggregatePipeline.push({
        $unwind:{
          path: "$sender",
          preserveNullAndEmptyArrays: true
        }
      })

      aggregatePipeline.push({
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver"
        }
      })

      aggregatePipeline.push({
        $unwind:{
          path: "$receiver",
          preserveNullAndEmptyArrays: true
        }
      })

      aggregatePipeline.push({
        $facet:{
          data:[
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ],
          totalCount:[
            {
              $count:'count'
            }
          ]
        }
      })

      const result = await this.messageModel.aggregate(aggregatePipeline).exec()

      const totalCount = result[0].totalCount[0]?.count || 0
      const data = result[0].data
      
      return {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount/limit),
        data
      }
    } catch (error:any) {
      // Handle error appropriately
      throw new Error(`Failed to find chat messages: ${error.message}`);
    }
  }
}