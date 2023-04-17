import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testingConnection } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { Sample, SampleAggregate } from '../../domain/aggregate/Sample';
import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleQueryImplement } from '../query/SampleQueryImplement';
import { TestingModule } from '@nestjs/testing';
import { multipleSampleData, singleSampleData } from './testdata';

describe('SampleRepositoryImplement', () => {
  let query: SampleQueryImplement;
  let repository: SampleRepository;
  let testModule: TestingModule;
  let appConnection: INestApplication;
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
    const testConnection = await testingConnection(providers);
    testModule = testConnection.testModule;
    appConnection = testConnection.app;
    query = testModule.get(SampleQueryImplement);
    repository = testModule.get(SampleRepositoryImplement);
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterEach(async () => {
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterAll(async () => {
    await appConnection.close();
  });

  describe('save', () => {
    afterEach(async () => {
      await writeConnection.manager.delete(SampleEntity, {});
    });
    describe('saves a single entity', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        await repository.save(singleSampleData);
        entities = await writeConnection.manager.find(SampleEntity);
      });
      it('saved to DB successfully', () => {
        expect(entities[0].id).toEqual('1');
      });
    });

    describe('saves multiple entities', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        await repository.save(multipleSampleData);
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
        await repository.save(singleSampleData);
        entity = await repository.findById(1);
      });
      it('id is matching', () => {
        expect(entity?.compareId(1)).toBeTruthy;
      });
    });
  });
});
