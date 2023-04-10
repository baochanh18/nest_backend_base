import { IQuery } from '@nestjs/cqrs';

export class FindSampleByIdQuery implements IQuery {
  constructor(readonly id: number) {}
}
