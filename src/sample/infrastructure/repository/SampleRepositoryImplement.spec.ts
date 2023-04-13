import { SampleEntity } from '../entity/Sample';
import { SampleRepositoryImplement } from './SampleRepositoryImplement';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { nestAppForTest, testModules } from '../../../../libs/Testing';
import { writeConnection } from '../../../../libs/DatabaseModule';
import { SampleAggregate } from '../../domain/aggregate/Sample';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectionToken } from '../../application/InjectionToken';
import { Repository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { SampleFactory } from '../../domain/factory/SampleFactory';

describe('SampleRepositoryImplement', () => {
  let repository: SampleRepository;
  let publisher: EventPublisher;
  let repo: Repository<SampleEntity>;

  beforeAll(async () => {
    await nestAppForTest();
    const providers: Provider[] = [
      SampleFactory,
      {
        provide: InjectionToken.SAMPLE_REPOSITORY,
        useClass: SampleRepositoryImplement,
      },
      {
        provide: EventPublisher,
        useValue: {
          mergeObjectContext: jest.fn(),
        },
      },
    ];
    const testModule = await testModules(providers);

    publisher = testModule.get<EventPublisher>(EventPublisher);
    repository = testModule.get<SampleRepositoryImplement>(
      InjectionToken.SAMPLE_REPOSITORY,
    );
  });

  afterEach(() => {
    jest.resetAllMocks(); // reset all mocked functions after each test
  });

  describe('save', () => {
    it('should save a single sample entity', async () => {
      repo = writeConnection.manager.getRepository(SampleEntity);
      const sampleData = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const newSample = new SampleAggregate(sampleData);
      jest.spyOn(repo, 'save').mockReturnValue(Promise.resolve(sampleData));
      jest
        .spyOn(repo, 'findOneBy')
        .mockReturnValue(Promise.resolve(sampleData));
      jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(newSample);

      await repository.save(newSample);

      const savedEntity = await repository.findById(1);
      expect(savedEntity).toEqual(newSample);
    });

    it('should save multiple sample entities', async () => {
      repo = writeConnection.manager.getRepository(SampleEntity);
      const samples = [
        {
          id: 2,
          createdAt: new Date('2023-04-12T01:53:00.724Z'),
          updatedAt: new Date('2023-04-12T01:53:00.724Z'),
          deletedAt: null,
        },
        {
          id: 3,
          createdAt: new Date('2023-04-12T01:53:00.724Z'),
          updatedAt: new Date('2023-04-12T01:53:00.724Z'),
          deletedAt: null,
        },
      ];

      const expected = samples.map(
        ({ id, createdAt, updatedAt, deletedAt }) => ({
          id,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          deletedAt,
        }),
      );

      const saveMock = jest.fn().mockReturnValue(expected);
      jest.spyOn(repo, 'save').mockImplementation(saveMock);

      const newSamples = samples.map((sample) => new SampleAggregate(sample));

      await repository.save(newSamples as SampleAggregate[]);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith(expected);
    });
  });

  describe('findById', () => {
    it('should return null if entity does not exist', async () => {
      repo = writeConnection.manager.getRepository(SampleEntity);
      jest.spyOn(repo, 'findOneBy').mockReturnValue(Promise.resolve(null));
      const result = await repository.findById(9999);

      expect(result).toBeNull();
    });

    it('should return sample if entity exists', async () => {
      const entity = new SampleEntity();
      entity.id = 4;
      entity.createdAt = new Date('2023-04-12T01:53:00.724Z');
      entity.updatedAt = new Date('2023-04-12T01:53:00.724Z');
      entity.deletedAt = null;
      repo = writeConnection.manager.getRepository(SampleEntity);
      const newSample = new SampleAggregate(entity);

      jest.spyOn(repo, 'save').mockResolvedValue(entity);
      jest.spyOn(repo, 'findOneBy').mockReturnValue(Promise.resolve(entity));
      jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(newSample);

      const result = await repository.findById(4);

      expect(result).toEqual(newSample);
    });
  });
});
