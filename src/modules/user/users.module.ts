import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema/user.schema';
import { UserRepository } from './repository/user.repostory';
import { UserService } from './service/user.service';
import { UserController } from './controller/users.controller';
import { ResponseService } from 'src/utils/response/service/response.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UserRepository, UserService],
  providers: [UserService, UserRepository, ResponseService],
  controllers: [UserController],
})
export class UsersModule {}
