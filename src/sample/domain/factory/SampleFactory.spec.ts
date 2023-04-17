import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { SampleFactory } from './SampleFactory';
import { Sample, SampleAggregate } from '../aggregate/Sample';
import { testingConnection } from '../../../../libs/Testing';

describe('SampleFactory', () => {
  let factory: SampleFactory;
  let publisher: EventPublisher;
  let options: any;
  let properties: any;
  let result: SampleAggregate;
  let testModule: TestingModule;
  let appConnection: INestApplication;
  let sample: Sample;
  const providers: Provider[] = [
    SampleFactory,
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: jest.fn(),
      },
    },
  ];

  beforeAll(async () => {
    const testConnection = await testingConnection(providers);
    testModule = testConnection.testModule;
    appConnection = testConnection.app;
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

  afterAll(async () => {
    await appConnection.close();
  });

  describe('create', () => {
    beforeAll(() => {
      sample = factory.create(options);
    });
    it('should create a new sample aggregate with the given options', () => {
      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });

  describe('reconstitute', () => {
    beforeAll(() => {
      sample = factory.reconstitute(properties);
    });
    it('should reconstitute an existing sample aggregate from properties', () => {
      expect(sample).toBe(result);
      expect(publisher.mergeObjectContext).toHaveBeenCalledWith(result);
    });
  });
});
