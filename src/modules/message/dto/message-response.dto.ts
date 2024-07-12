import { IsArray, IsDateString, IsObject, IsOptional, IsString } from 'class-validator';

export class MessageResponseDto {
  @IsString()
  id: string;

  @IsObject()
  sender?: UserObject;

  @IsObject()
  receiver?: UserObject;

  @IsString()
  message: string;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;
}

export class UserObject {
  @IsString()
  id: string;

  @IsString()
  name: string;
}