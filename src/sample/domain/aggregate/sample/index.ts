import { InternalServerErrorException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';

import { ErrorMessage } from '../../ErrorMessage';
import { SampleEvent } from '../../event/SampleEvent';
import { SampleDetailAggregate } from '../sampleDetail';

export type SampleEssentialProperties = Readonly<
  Required<{
    id: number;
  }>
>;

export type SampleOptionalProperties = Readonly<
  Partial<{
    sampleDetail: SampleDetailAggregate | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>
>;

export type SampleProperties = SampleEssentialProperties &
  Required<SampleOptionalProperties>;

export interface Sample {
  compareId: (id: number) => boolean;
  sampleEvent: () => void;
  sampleErrorEvent: (id: number) => void;
  getSample: () => SampleProperties;
  commit: () => void;
}

export class SampleAggregate extends AggregateRoot implements Sample {
  private readonly id: number;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;
  private sampleDetail: SampleDetailAggregate;

  constructor(properties: SampleProperties) {
    super();
    Object.assign(this, properties);
  }

  compareId(id: number): boolean {
    return id === this.id;
  }

  sampleEvent(): void {
    this.apply(new SampleEvent(this.id));
  }

  sampleErrorEvent(id: number): void {
    if (id < 1) throw new InternalServerErrorException(ErrorMessage.INVALID_ID);
  }

  getSample(): SampleProperties {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      sampleDetail: this.sampleDetail,
    };
  }
}
