import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Config } from '../src/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (): Redis => {
        return new Redis({
          host: Config.REDIS_HOST,
          port: Config.REDIS_PORT,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
