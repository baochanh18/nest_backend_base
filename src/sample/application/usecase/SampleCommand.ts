import { ICommand } from '@nestjs/cqrs';

export class SampleCommand implements ICommand {
  constructor(readonly id: number) {}
}
