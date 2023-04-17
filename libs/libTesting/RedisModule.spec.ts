import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { RedisModule } from '../RedisModule';

describe('RedisModule', () => {
  let redisClient: Redis;
  let retrievedValue: string | null;
  const key = 'test-key';
  const value = 'test-value';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();
    redisClient = module.get<Redis>('REDIS_CLIENT');

    await redisClient.set(key, value);
    retrievedValue = await redisClient.get(key);
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should provide a Redis client', () => {
    expect(redisClient).toBeDefined();
  });

  it('should be able to get and set values in Redis', () => {
    expect(retrievedValue).toBe(value);
  });
});
