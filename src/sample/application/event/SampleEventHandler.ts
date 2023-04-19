import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { Transactional } from '../../../../libs/Transactional';
import { SampleEvent } from '../../domain/event/SampleEvent';

@EventsHandler(SampleEvent)
export class SampleEventHandler implements IEventHandler<SampleEvent> {
  @Transactional()
  async handle(event: SampleEvent): Promise<void> {
    // client-sns message
  }
}
