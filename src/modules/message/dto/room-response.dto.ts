import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class RoomResponseDto {
  @IsString()
  id: string;

  @IsArray()
  user: ParticipansResponseDto[];

  @IsString()
  last_message: string;
}

export class ParticipansResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}