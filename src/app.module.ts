import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../libs/DatabaseModule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestStorageMiddleware } from '../libs/RequestStorageMiddleware';
import { SamplesModule } from './sample/SamplesModule';
// import { MessageModule } from '../libs/MessageModule';
import { RedisModule } from '../libs/RedisModule';

@Module({
  imports: [
    RedisModule,
    DatabaseModule,
    SamplesModule,
    // MessageModule,
    CacheModule.register({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
