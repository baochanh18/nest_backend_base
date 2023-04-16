import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { nestAppForTest, testModules } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { Sample, SampleAggregate } from '../../domain/aggregate/Sample';
import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleQueryImplement } from '../query/SampleQueryImplement';
import { TestingModule } from '@nestjs/testing';

describe('SampleRepositoryImplement', () => {
  let query: SampleQueryImplement;
  let repository: SampleRepository;
  let testConnection: { testModule: TestingModule; app: INestApplication };

  beforeAll(async () => {
    await nestAppForTest();
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
    testConnection = await testModules(providers);

    query = testConnection.testModule.get(SampleQueryImplement);
    repository = testConnection.testModule.get(SampleRepositoryImplement);
    await writeConnection.manager.delete(SampleEntity, {});
  });

  afterEach(async () => {
    await writeConnection.manager.delete(SampleEntity, {});
  });

  describe('save', () => {
    afterEach(async () => {
      await writeConnection.manager.delete(SampleEntity, {});
    });
    describe('saves a single entity', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        const data = {
          id: 1,
        } as unknown as SampleAggregate;
        await repository.save(data);
        entities = await writeConnection.manager.find(SampleEntity);
      });
      it('saved successfully', async () => {
        expect(entities[0].id).toEqual('1');
      });
    });

    describe('saves multiple entities', () => {
      let entities: SampleEntity[];
      beforeAll(async () => {
        const data = [{ id: 1 }, { id: 2 }] as unknown as SampleAggregate[];
        await repository.save(data);
        entities = await writeConnection.manager.find(SampleEntity);
      });
      it('saved successfully', async () => {
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
      it('should return null', async () => {
        expect(entity).toBeNull();
      });
    });

    describe('returns the entity with the given id', () => {
      let entity: Sample | null;
      beforeAll(async () => {
        const data = { id: 1 } as unknown as SampleAggregate;
        await repository.save(data);
        entity = await repository.findById(1);
      });
      it('id is matching', async () => {
        expect(entity?.compareId(1)).toBeTruthy;
      });
    });
  });
});
