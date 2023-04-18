import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testingConfigure } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { Sample, SampleAggregate } from '../../domain/aggregate/Sample';
import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleQueryImplement } from '../query/SampleQueryImplement';
import { TestingModule } from '@nestjs/testing';
import { sampleData, sampleKeyValue } from './testdata';
import { InjectionToken } from '../../application/InjectionToken';
import { Redis } from 'ioredis';

describe('SampleRepositoryImplement', () => {
  let query: SampleQueryImplement;
  let repository: SampleRepository;
  let testModule: TestingModule;
  let app: INestApplication;
  let redisClient: Redis;
  const providers: Provider[] = [
    SampleFactory,
    SampleQueryImplement,
    SampleRepositoryImplement,
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: (properties) => {
          return new SampleAggregate(properties);
        },
      },
    },
    {
      provide: InjectionToken.REDIS_CLIENT,
      useClass: Redis,
    },
  ];
  beforeAll(async () => {
    const testConnection = await testingConfigure(providers);
    testModule = testConnection.testModule;
    app = testConnection.app;
    query = testModule.get(SampleQueryImplement);
    repository = testModule.get(SampleRepositoryImplement);
    redisClient = testModule.get(InjectionToken.REDIS_CLIENT);
    await writeConnection.manager.delete(SampleEntity, {});
    redisClient.flushall();
  });

  afterEach(async () => {
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterAll(async () => {
    await app.close();
    redisClient.quit();
  });

  describe('save', () => {
    afterEach(async () => {
      await writeConnection.manager.delete(SampleEntity, {});
    });
    describe('saves a single entity', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        await repository.save(sampleData[0]);
        entities = await writeConnection.manager.find(SampleEntity);
      });
      it('saved to DB successfully', () => {
        expect(entities[0].id).toEqual('1');
      });
    });

    describe('saves multiple entities', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        await repository.save(sampleData);
        entities = await writeConnection.manager.find(SampleEntity);
      });
      it('saved to DB successfully', () => {
        expect(entities[0].id).toEqual('1');
        expect(entities[1].id).toEqual('2');
      });
    });
  });

  describe('findById', () => {
    describe('returns null if entity is not found', () => {
      let entity: Sample | null;
      beforeAll(async () => {
        entity = await repository.findById(1);
      });
      it('should return null', () => {
        expect(entity).toBeNull();
      });
    });

    describe('returns the entity with the given id', () => {
      let entity: Sample | null;
      beforeAll(async () => {
        await repository.save(sampleData[0]);
        entity = await repository.findById(1);
      });
      it('id is matching', () => {
        expect(entity?.compareId(1)).toBeTruthy;
      });
    });
  });

  describe('getCacheData', () => {
    let result: string | null;
    describe('should return null for non-existent key', () => {
      beforeAll(async () => {
        result = await repository.getCacheData('non-existent-key');
      });
      it('should return null', async () => {
        expect(result).toBeNull();
      });
    });

    describe('should return cached data for existing key', () => {
      beforeAll(async () => {
        await redisClient.set(sampleKeyValue.key, sampleKeyValue.value);
        result = await repository.getCacheData(sampleKeyValue.key);
      });
      it('should return expected value', async () => {
        expect(result).toBe(sampleKeyValue.value);
      });
    });
  });

  describe('setCacheData', () => {
    describe('should set data in cache for valid key and value', () => {
      let result: string | null;
      beforeAll(async () => {
        await repository.setCacheData(sampleKeyValue.key, sampleKeyValue.value);
        result = await redisClient.get(sampleKeyValue.key);
      });
      it('should return expected value', async () => {
        expect(result).toBe(sampleKeyValue.value);
      });
    });
  });
});
