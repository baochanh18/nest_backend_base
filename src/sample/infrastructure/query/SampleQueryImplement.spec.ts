import { Test, TestingModule } from '@nestjs/testing';
import {
  InjectRepository,
  TypeOrmModule,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { DataSourceOptions, Repository } from 'typeorm';
import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';
import { FindSamplesResult } from '../../application/query/FindSamples/FindSamplesResult';
import { FindSamplesQuery } from '../../application/query/FindSamples/FindSamplesQuery';
import { SampleEntity } from '../entity/Sample';
import { SampleQueryImplement } from './SampleQueryImplement';
import { testModules } from '../../../../libs/Testing';
import { connectionSource } from '../../../../libs/DatabaseSource';
import { InjectionToken } from '../../application/InjectionToken';
import { SampleRepositoryImplement } from '../repository/SampleRepositoryImplement';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { EventPublisher } from '@nestjs/cqrs';

describe('SampleQueryImplement', () => {
  let module: TestingModule;
  let query: SampleQueryImplement;
  let repository: Repository<SampleEntity>;

  beforeAll(async () => {
    const providers = [
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
    module = await testModules(providers);
    // Test.createTestingModule({
    //   imports: [
    //     TypeOrmModule.forRoot({
    //       // your database configuration here
    //     }),
    //     TypeOrmModule.forFeature([SampleEntity]),
    //   ],
    //
    // }).compile();

    query = module.get(SampleQueryImplement);
    repository = module.get(SampleRepositoryImplement);
  });

  afterAll(() => {
    module.close();
  });

  describe('findById', () => {
    it('should return null if entity is not found', async () => {
      const result = await query.findById(1000);

      expect(result).toBeNull();
    });

    it('should return entity data if entity is found', async () => {
      const entity = new SampleEntity();
      entity.id = 1;
      entity.createdAt = new Date();

      await repository.save(entity);

      const result = await query.findById(1);

      // expect(result.id).toEqual(entity.id);
      // expect(result.createdAt).toEqual(entity.createdAt);
    });
  });

  // describe('find', () => {
  //   it('should return an empty array if no entities are found', async () => {
  //     await repository.clear();

  //     const result = await query.find({ skip: 0, take: 10 });

  //     expect(result.samples).toHaveLength(0);
  //   });

  //   it('should return an array of entity data if entities are found', async () => {
  //     const entity = new SampleEntity();
  //     entity.id = 1;

  //     await repository.save(entity);

  //     const result = await query.find({ skip: 0, take: 10 });

  //     expect(result.samples).toHaveLength(1);
  //     expect(result.samples[0].id).toEqual(entity.id);
  //   });
  // });
});
