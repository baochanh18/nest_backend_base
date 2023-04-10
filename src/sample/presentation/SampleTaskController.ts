import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { MessageHandler } from '../../../libs/MessageModule';

import { SampleCommand } from '../application/usecase/SampleCommand';

@Controller()
export class SampleTaskController {
  @Inject() private readonly commandBus: CommandBus;

  @MessageHandler(SampleCommand.name)
  async sampleTask(message: SampleCommand): Promise<void> {
    await this.commandBus.execute<SampleCommand, void>(message);
  }
}
