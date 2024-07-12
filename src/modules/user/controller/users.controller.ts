import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Body
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AtGuard, GetCurrentUserId } from 'src/common';
import { UserService } from '../service/user.service';
import { ResponseService } from 'src/utils/response/service/response.service';
import { UpdateUserProfileDto } from '../dto/update-user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller({
  path: 'user',
  version: '1.0',
})
export class UserController {
  constructor(private readonly usersService: UserService, private readonly responseService: ResponseService) {}

  @Get()
  @UseGuards(AtGuard)
  async user(@GetCurrentUserId() userId: string) {
    const result = await this.usersService.findById(userId);
    if (!result) {
      return this.responseService.error("failed", HttpStatus.BAD_REQUEST)
    }
    const response: UserResponseDto = {
      id: result.id,
      name: result.name,
      email: result.email,
      username: result.username,
      phone: (result.phone) ? result.phone : '',
      gender: (result.gender) ? result.gender : '',
      birthday: (result.birthday) ? result.birthday : null,
      horoscope: (result.horoscope) ? result.horoscope : '',
      zodiac: (result.zodiac) ? result.zodiac : '',
      height: (result.height) ? result.height : 0,
      weight: (result.weight) ? result.weight : 0,
      interests: result.interests,
    }
    return this.responseService.success(response)
  }

  @Post()
  @UseGuards(AtGuard)
  async update(@GetCurrentUserId() userId: string, @Body() updateUser: UpdateUserProfileDto) {
    const [_, month, day] = updateUser.birthday.toString().split('-').map(Number);
    const zodiac = this.usersService.getZodiacSign(month, day);
    const horoscope = this.usersService.getHoroscope(zodiac);

    updateUser.horoscope = horoscope
    updateUser.zodiac = zodiac
    const update = await this.usersService.updateOne(userId, updateUser)
    if (!update) {
      return this.responseService.error("failed to update your profile", HttpStatus.BAD_REQUEST)
    }
    return this.responseService.success(null)
  }

  // @Post('data/admin')
  // async createAdmin(@Body() createUserDto: AuthDto) {
  //   return await this.usersService.create(createUserDto);
  // }

  // @Get()
  // async findAll(@Query() q: string) {
  //   return await this.usersService.findAll(q);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.usersService.findById(id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return await this.usersService.updateOne(id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.usersService.delete(id);
  // }
}
