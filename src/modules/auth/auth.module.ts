import { Module } from '@nestjs/common';
import { RtStrategiest, AtStrategiest } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/users.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { ResponseService } from 'src/utils/response/service/response.service';
@Module({
  imports: [JwtModule.register({}), UsersModule],

  providers: [AuthService, AtStrategiest, RtStrategiest, ResponseService],
  controllers: [AuthController],
})
export class AuthModule {}
