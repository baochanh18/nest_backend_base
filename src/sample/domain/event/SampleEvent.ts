import { IEvent } from '@nestjs/cqrs';

export class SampleEvent implements IEvent {
  constructor(readonly id: number) {}
}
