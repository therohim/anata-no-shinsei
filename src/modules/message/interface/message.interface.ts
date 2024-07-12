import { CreateMessageDto } from "../dto/create-message.dto";
import { Message } from "../schema/message.schema";

export interface MessageServiceInterface {
  create(createMessageDto: CreateMessageDto): Promise<Message>
}