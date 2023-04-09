import { IQuery } from '@nestjs/cqrs';

export class FindSamplesQuery implements IQuery {
  readonly skip: number;
  readonly take: number;

  constructor(options: FindSamplesQuery) {
    Object.assign(this, options);
  }
}
