import { createClient } from 'redis';

import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const redisClient = createClient({
          socket: {
            host: configService.get('redis_server_host'),
            port: configService.get('redis_server_port'),
          },
          database: configService.get('redis_server_db'),
        });
        await redisClient.connect();

        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
