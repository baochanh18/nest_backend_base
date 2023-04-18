import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { writeConnection } from '../../../../libs/DatabaseModule';
import { SampleEntity } from '../entity/Sample';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleQueryImplement } from './SampleQueryImplement';
import { testingConfigure } from '../../../../libs/Testing';
import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';
import { sampleData } from './testdata';

describe('SampleQueryImplement', () => {
  let query: SampleQueryImplement;
  let testModule: TestingModule;
  let app: INestApplication;
  const providers: Provider[] = [
    SampleQueryImplement,
    SampleFactory,
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: jest.fn(),
      },
    },
  ];
  beforeAll(async () => {
    const testConnection = await testingConfigure(providers);
    testModule = testConnection.testModule;
    app = testConnection.app;
    query = testModule.get(SampleQueryImplement);
    await writeConnection.manager.delete(SampleEntity, {});
    await writeConnection.manager.save(SampleEntity, sampleData);
  });

  afterAll(async () => {
    await writeConnection.manager.delete(SampleEntity, {});
    await app.close();
  });

  describe('findById', () => {
    let result: FindSampleByIdResult | null;
    describe('should return null if entity is not found', () => {
      beforeAll(async () => {
        result = await query.findById(1000);
      });
      it('expect result to be null', () => {
        expect(result).toBeNull();
      });
    });

    describe('should return entity data if entity is found', () => {
      beforeAll(async () => {
        result = await query.findById(1);
      });
      it('expect result not null', () => {
        expect(result).not.toBeNull();
        expect(result?.id).toEqual(sampleData[0].id.toString());
      });
    });
  });

  describe('find', () => {
    beforeAll(async () => {
      await writeConnection.manager.delete(SampleEntity, {});
    });
    describe('should return an empty array if no entities are found', () => {
      let result;
      beforeAll(async () => {
        result = await query.find({ skip: 0, take: 10 });
      });
      it('length equal 0', async () => {
        expect(result.samples).toHaveLength(0);
      });
    });

    describe('should return an array of entity data if entities are found', () => {
      let result;
      beforeAll(async () => {
        await writeConnection.manager.save(SampleEntity, sampleData);
        result = await query.find({ skip: 0, take: 10 });
      });
      it('should return an array of entity data if entities are found', async () => {
        expect(result.samples).toHaveLength(1);
        expect(result.samples[0].id).toEqual(sampleData[0].id.toString());
      });
    });
  });
});
