import { EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { SampleFactory } from './SampleFactory';
import { SampleAggregate } from '../aggregate/Sample';
import { testModules } from '../../../../libs/Testing';

describe('SampleFactory', () => {
  let factory: SampleFactory;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const testModule = await testModules();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SampleFactory,
        {
          provide: EventPublisher,
          useValue: {
            mergeObjectContext: jest.fn(),
          },
        },
      ],
    }).compile();

    factory = module.get<SampleFactory>(SampleFactory);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new sample aggregate with the given options', () => {
      const options = { id: 1 };
      const result = new SampleAggregate({
        ...options,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
      jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(result);

      const sample = factory.create(options);

      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an existing sample aggregate from properties', () => {
      const properties = {
        id: 1,
        name: 'Test Sample',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const result = new SampleAggregate(properties);
      jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(result);

      const sample = factory.reconstitute(properties);

      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });
});
