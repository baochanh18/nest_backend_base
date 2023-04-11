import { SampleQueryImplement } from './SampleQueryImplement';
import { readConnection } from '../../../../libs/DatabaseModule';
import { FindSamplesQuery } from '../../application/query/FindSamples/FindSamplesQuery';
import { nestAppForTest } from '../../../../libs/Testing';
import { SampleEntity } from '../entity/Sample';

describe('SampleQueryImplement', () => {
  let sampleQuery: SampleQueryImplement;

  beforeAll(async () => {
    await nestAppForTest();
    sampleQuery = new SampleQueryImplement();
  });

  afterEach(async () => {
    jest.resetAllMocks(); // reset all mocked functions after each test
  });

  describe('findById', () => {
    it('should return null if entity does not exist', async () => {
      const repository = readConnection.getRepository(SampleEntity);
      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValue(Promise.resolve(null));

      const result = await sampleQuery.findById(1);

      expect(result).toBeNull();
    });

    it('should return entity data if entity exists', async () => {
      const entityData = {
        id: 1,
        createdAt: new Date('2022-01-01T00:00:00Z'),
        updatedAt: new Date('2022-01-01T00:00:00Z'),
        deletedAt: null,
      };

      const repository = readConnection.getRepository(SampleEntity);
      jest.spyOn(repository, 'findOneBy').mockReturnValue(
        Promise.resolve({
          ...entityData,
        }),
      );

      const result = await sampleQuery.findById(entityData.id);

      expect(result).toEqual(entityData);
    });
  });

  describe('find', () => {
    it('should return empty array if no entities exist', async () => {
      const repository = readConnection.getRepository(SampleEntity);
      jest.spyOn(repository, 'find').mockReturnValue(Promise.resolve([]));

      const options = {
        skip: 1,
        take: 1,
      } as FindSamplesQuery;

      const result = await sampleQuery.find(new FindSamplesQuery(options));

      expect(result).toEqual({ samples: [] });
    });

    it('should return array of entities if entities exist', async () => {
      const entityData = {
        id: 1,
        createdAt: new Date('2022-01-01T00:00:00Z'),
        updatedAt: new Date('2022-01-01T00:00:00Z'),
        deletedAt: null,
      };
      const repository = readConnection.getRepository(SampleEntity);
      jest
        .spyOn(repository, 'find')
        .mockReturnValue(Promise.resolve([entityData]));

      const options = {
        skip: 1,
        take: 1,
      } as FindSamplesQuery;

      const result = await sampleQuery.find(new FindSamplesQuery(options));

      expect(result).toEqual({
        samples: [{ id: 1 }],
      });
    });
  });
});
