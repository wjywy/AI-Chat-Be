import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

import { User } from './users/entities/user.entity';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { LoginGuard } from './login.guard';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { Message } from './chat/entities/message.entity';
import { FileModule } from './file/file.module';
import { FileEntity } from './file/entities/file.entity';
import { AiModule } from './ai/ai.module';
import { AgentModule } from './agent/agent.module';
// import { Agent } from './agent/entities/agent.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'fishThing',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): MysqlConnectionOptions => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        entities: [User, Chat, Message, FileEntity], // 添加Agent实体
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    EmailModule,
    RedisModule,
    ChatModule,
    FileModule,
    AiModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      useClass: LoginGuard,
      provide: 'APP_GUARD',
    },
  ],
})
export class AppModule {}
