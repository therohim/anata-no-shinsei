import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  phone: string;

  @IsString()
  gender: string;

  @IsDateString()
  birthday: Date;

  @IsString()
  @IsOptional()
  horoscope?: string;

  @IsString()
  @IsOptional()
  zodiac?: string;

  @IsString()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  weight?: number;

  @IsString({ each: true })
  @IsOptional()
  interests?: string[];
}
