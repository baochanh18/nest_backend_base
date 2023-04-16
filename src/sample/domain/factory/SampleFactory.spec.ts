import { EventPublisher } from '@nestjs/cqrs';
import { SampleFactory } from './SampleFactory';
import { SampleAggregate } from '../aggregate/Sample';
import { testModules } from '../../../../libs/Testing';
import { Provider } from '@nestjs/common';

describe('SampleFactory', () => {
  let factory: SampleFactory;
  let publisher: EventPublisher;
  let options: any;
  let properties: any;
  let result: SampleAggregate;

  beforeAll(async () => {
    const providers: Provider[] = [
      SampleFactory,
      {
        provide: EventPublisher,
        useValue: {
          mergeObjectContext: jest.fn(),
        },
      },
    ];
    const { testModule } = await testModules(providers);

    factory = testModule.get<SampleFactory>(SampleFactory);
    publisher = testModule.get<EventPublisher>(EventPublisher);

    options = { id: 1 };
    properties = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    result = new SampleAggregate({
      ...options,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: null,
    });
  });

  beforeEach(() => {
    jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(result);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new sample aggregate with the given options', () => {
      // Act
      const sample = factory.create(options);

      // Assert
      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an existing sample aggregate from properties', () => {
      // Act
      const sample = factory.reconstitute(properties);

      // Assert
      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });
});
