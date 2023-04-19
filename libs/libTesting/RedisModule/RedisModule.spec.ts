import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { REDIS_CLIENT, RedisModule } from '../../RedisModule';
import { sampleKeyValue } from './testdata';

describe('RedisModule', () => {
  let redisClient: Redis;
  let retrievedValue: string | null;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();
    redisClient = module.get<Redis>(REDIS_CLIENT);

    await redisClient.set(sampleKeyValue.key, sampleKeyValue.value);
    retrievedValue = await redisClient.get(sampleKeyValue.key);
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should provide a Redis client', () => {
    expect(redisClient).toBeDefined();
  });

  it('should be able to get and set values in Redis', () => {
    expect(retrievedValue).toBe(sampleKeyValue.value);
  });
});
