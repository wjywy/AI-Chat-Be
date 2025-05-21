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
        synchronize: false,
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    EmailModule,
    RedisModule,
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
