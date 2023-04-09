import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  SampleMessage,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from '../../../../libs/MessageModule';
import { Transactional } from 'libs/Transactional';

import { SampleEvent } from '../../domain/event/SampleEvent';

@EventsHandler(SampleEvent)
export class SampleEventHandler implements IEventHandler<SampleEvent> {
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  @Transactional()
  async handle(event: SampleEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.SampleTopic,
      new SampleMessage(event.id),
    );
  }
}
