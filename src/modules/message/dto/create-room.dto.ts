import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateRoomDto {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  participants: string[];

  @IsString()
  @IsOptional()
  last_message: string

}
