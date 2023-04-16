import { TestingModule } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';

import { Repository } from 'typeorm';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { SampleEntity } from '../entity/Sample';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleQueryImplement } from './SampleQueryImplement';
import { SampleRepositoryImplement } from '../repository/SampleRepositoryImplement';
import { testModules } from '../../../../libs/Testing';
import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';

describe('SampleQueryImplement', () => {
  let query: SampleQueryImplement;
  let repository: Repository<SampleEntity>;
  let testConnection: { testModule: TestingModule; app: INestApplication };

  beforeAll(async () => {
    const providers: Provider[] = [
      SampleQueryImplement,
      SampleRepositoryImplement,
      SampleFactory,
      {
        provide: EventPublisher,
        useValue: {
          mergeObjectContext: jest.fn(),
        },
      },
    ];
    testConnection = await testModules(providers);

    query = testConnection.testModule.get(SampleQueryImplement);
    repository = testConnection.testModule.get(SampleRepositoryImplement);
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterAll(async () => {
    await writeConnection.manager.delete(SampleEntity, {});
    await testConnection.app.close();
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
      let entity: SampleEntity;
      beforeAll(async () => {
        entity = new SampleEntity();
        entity.id = 1;

        await repository.save(entity);

        result = await query.findById(1);
      });
      it('expect result not null', () => {
        expect(result).not.toBeNull();
        expect(result?.id).toEqual(entity.id.toString());
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
      let entity: SampleEntity;
      beforeAll(async () => {
        entity = new SampleEntity();
        entity.id = 1;

        await repository.save(entity);

        result = await query.find({ skip: 0, take: 10 });
      });
      it('should return an array of entity data if entities are found', async () => {
        expect(result.samples).toHaveLength(1);
        expect(result.samples[0].id).toEqual(entity.id.toString());
      });
    });
  });
});
