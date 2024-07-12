import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AtGuard } from './common';
import { MONGO_DATABASE_URI } from './environments';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/app.module';
import { MessageModule } from './modules/message/message.module';
import { RabbitMQController } from './modules/rabbitmq/controller/rabbitmq.controller';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { UsersModule } from './modules/user/users.module';
import { ResponseModule } from './utils/response/response.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: MONGO_DATABASE_URI,
      }),
    }),
    HealthModule,
    RabbitMQModule,
    AuthModule,
    UsersModule,
    ChatModule,
    MessageModule,
    ResponseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
