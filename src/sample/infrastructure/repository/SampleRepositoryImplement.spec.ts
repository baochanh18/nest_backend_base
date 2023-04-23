import { plainToInstance } from 'class-transformer';

import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testingConfigure } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { Sample, SampleAggregate } from '../../domain/aggregate/sample';
import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { SampleFactory } from '../../domain/factory';
import { SampleQueryImplement } from '../query/SampleQueryImplement';
import { TestingModule } from '@nestjs/testing';
import { sampleData, sampleKeyValues, updateSampleData } from './testdata';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../../../libs/RedisModule';
import { SampleDetailEntity } from '../entity/SampleDetail';

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
  ];
  beforeAll(async () => {
    const testConnection = await testingConfigure(providers);
    testModule = testConnection.testModule;
    app = testConnection.app;
    query = testModule.get(SampleQueryImplement);
    repository = testModule.get(SampleRepositoryImplement);
    redisClient = testModule.get(REDIS_CLIENT);
    await writeConnection.manager.delete(SampleDetailEntity, {});
    await writeConnection.manager.delete(SampleEntity, {});
    await redisClient.flushall();
    const flattenedRecords = sampleKeyValues.flatMap((obj) => [
      obj.key,
      obj.value,
    ]);
    await redisClient.mset(flattenedRecords);
  });

  afterEach(async () => {
    await writeConnection.manager.delete(SampleDetailEntity, {});
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterAll(async () => {
    await app.close();
    redisClient.flushall();
    redisClient.quit();
  });

  describe('save', () => {
    afterEach(async () => {
      await writeConnection.manager.delete(SampleDetailEntity, {});
      await writeConnection.manager.delete(SampleEntity, {});
    });
    describe('saves a single entity', () => {
      let entitiy: SampleEntity;
      describe('insert a new record', () => {
        beforeAll(async () => {
          await repository.save(sampleData[0]);
          entitiy = plainToInstance(SampleEntity, await repository.findById(1));
        });
        it('saved to DB successfully', () => {
          expect(entitiy.id).toEqual(1);
          expect(entitiy.sampleDetail).not.toBeNull();
          expect(entitiy.sampleDetail?.content).toEqual('test');
        });
      });

      describe('updates an existing record', () => {
        beforeAll(async () => {
          await repository.save(updateSampleData[0]);
          entitiy = plainToInstance(SampleEntity, await repository.findById(1));
        });
        it('saved to DB successfully', () => {
          expect(entitiy.id).toEqual(1);
          expect(entitiy.sampleDetail).not.toBeNull();
          expect(entitiy.sampleDetail?.content).toEqual('updated content 1');
        });
      });
    });

    describe('saves multiple entities', () => {
      let entities: SampleEntity[];
      describe('insert new records', () => {
        beforeAll(async () => {
          await repository.save(sampleData);
          entities = await writeConnection.manager.find(SampleEntity, {
            relations: ['sampleDetail'],
          });
        });
        it('saved to DB successfully', () => {
          expect(entities.length).toEqual(2);
        });
        it('1st record can saving relation table successfully', () => {
          expect(entities[0].sampleDetail).not.toBeNull();
          expect(entities[0].sampleDetail?.content).toEqual('test');
        });
        it('2nd record can saving relation table successfully', () => {
          expect(entities[1].sampleDetail).not.toBeNull();
          expect(entities[1].sampleDetail?.content).toEqual('testhoge');
        });
      });
      describe('updates existing records', () => {
        beforeAll(async () => {
          await repository.save(updateSampleData);
          entities = await writeConnection.manager.find(SampleEntity, {
            relations: ['sampleDetail'],
          });
        });
        it('saved to DB successfully', () => {
          expect(entities.length).toEqual(2);
        });
        it('1st record can saving relation table successfully', () => {
          expect(entities[0].sampleDetail).not.toBeNull();
          expect(entities[0].sampleDetail?.content).toEqual(
            'updated content 1',
          );
        });
        it('2nd record can saving relation table successfully', () => {
          expect(entities[1].sampleDetail).not.toBeNull();
          expect(entities[1].sampleDetail?.content).toEqual(
            'updated content 2',
          );
        });
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
        result = await repository.getCacheData(sampleKeyValues[0].key);
      });
      it('should return expected value', async () => {
        expect(result).toBe(sampleKeyValues[0].value);
      });
    });
  });

  describe('setCacheData', () => {
    describe('should set data in cache for valid key and value', () => {
      let result: string | null;
      const key = 'new-test-key';
      const value = 'new-value';
      beforeAll(async () => {
        await repository.setCacheData(key, value);
        result = await redisClient.get(key);
      });
      it('should return expected value', async () => {
        expect(result).toBe(value);
      });
    });
  });
});
