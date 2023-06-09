import { EventPublisher } from '@nestjs/cqrs';
import { INestApplication, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { SampleFactory } from '.';
import { Sample, SampleAggregate, SampleProperties } from '../aggregate/sample';
import { testingConfigure } from '../../../../libs/Testing';

describe('SampleFactory', () => {
  let factory: SampleFactory;
  let publisher: EventPublisher;
  let options: any;
  let properties: any;
  let input: SampleProperties;
  let testModule: TestingModule;
  let app: INestApplication;
  let sample: Sample;
  let publisherSpy: jest.SpyInstance;
  const providers: Provider[] = [
    SampleFactory,
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: (properties: SampleProperties) => {
          return new SampleAggregate(properties);
        },
      },
    },
  ];

  beforeAll(async () => {
    const testConnection = await testingConfigure(providers);
    testModule = testConnection.testModule;
    app = testConnection.app;
    factory = testModule.get<SampleFactory>(SampleFactory);
    publisher = testModule.get<EventPublisher>(EventPublisher);
    publisherSpy = jest.spyOn(publisher, 'mergeObjectContext');

    options = { id: 1 };
    properties = {
      id: 1,
    };
    input = {
      ...options,
    } as SampleProperties;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createAggregate', () => {
    beforeAll(() => {
      sample = factory.createAggregate(options);
    });
    it('should create a new sample aggregate with the given options', () => {
      expect(sample.compareId(1)).toBeTruthy();
      expect(publisherSpy).toHaveBeenCalledWith(new SampleAggregate(input));
    });
  });

  describe('reconstitute', () => {
    beforeAll(() => {
      sample = factory.reconstitute(properties);
    });
    it('should reconstitute an existing sample aggregate from properties', () => {
      expect(sample.compareId(1)).toBeTruthy();
      expect(publisherSpy).toHaveBeenCalledWith(
        new SampleAggregate(properties),
      );
    });
  });
});
