import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Config } from '../src/config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        return new Redis({
          host: Config.REDIS_HOST,
          port: Config.REDIS_PORT,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
