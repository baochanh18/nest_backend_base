import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { nestAppForTest, testModules } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { SampleAggregate } from '../../domain/aggregate/Sample';
import { EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectionToken } from '../../application/InjectionToken';

describe('SampleRepositoryImplement', () => {
  let repository: SampleRepository;
  let publisher: EventPublisher;

  beforeAll(async () => {
    await nestAppForTest();
    // repository = new SampleRepositoryImplement();
    const testModule = await testModules();

    publisher = testModule.get<EventPublisher>(EventPublisher);
    repository = testModule.get<SampleRepositoryImplement>(InjectionToken.SAMPLE_REPOSITORY);
  });

  describe('save', () => {
    it('should save a single sample entity', async () => {
      const repo = writeConnection.manager.getRepository(SampleEntity);
      const sampleData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const newEntity = {
        ...new SampleEntity(),
        ...sampleData,
      };
      const newSample = new SampleAggregate(sampleData);
      jest.spyOn(repo, 'save').mockReturnValue(Promise.resolve(newEntity));

      jest.spyOn(repo, 'findOneBy').mockReturnValue(Promise.resolve(newEntity));

      jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(newSample);

      await repository.save(newSample);

      const savedEntity = await repository.findById(1);
      expect(savedEntity).toEqual(sampleData);
    });

    // it('should save multiple sample entities', async () => {
    //   const samples = [
    //     { id: 2, createdAt: new Date(), deletedAt: null },
    //     { id: 3, createdAt: new Date(), deletedAt: null },
    //   ];

    //   await sampleRepo.save(samples);

    //   const savedEntities = await findEntitiesByIds([2, 3]);
    //   expect(savedEntities).toEqual(samples);
    // });
  });

  // describe('findById', () => {
  //   it('should return null if entity does not exist', async () => {
  //     const result = await sampleRepo.findById(9999);

  //     expect(result).toBeNull();
  //   });

  //   it('should return sample if entity exists', async () => {
  //     const entity = new SampleEntity();
  //     entity.id = 4;
  //     entity.createdAt = new Date();
  //     entity.deletedAt = null;
  //     await writeConnection.manager.getRepository(SampleEntity).save(entity);

  //     const result = await sampleRepo.findById(4);

  //     expect(result).toEqual({
  //       id: 4,
  //       createdAt: entity.createdAt,
  //       deletedAt: entity.deletedAt,
  //     });
  //   });
  // });
});
