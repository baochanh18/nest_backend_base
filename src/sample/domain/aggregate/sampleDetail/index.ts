import { AggregateRoot } from '@nestjs/cqrs';

export type SampleDetailEssentialProperties = Readonly<
  Required<{
    id: number | null;
    sampleId: number | null;
  }>
>;

export type SampleDetailOptionalProperties = Readonly<
  Partial<{
    content: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type SampleDetailProperties = SampleDetailEssentialProperties &
  Required<SampleDetailOptionalProperties>;

export interface SampleDetail {
  updateContent: (content: string) => void;
  getSampleDetail: () => SampleDetailProperties;
}

export class SampleDetailAggregate
  extends AggregateRoot
  implements SampleDetail
{
  private readonly id: number | null;
  private readonly sampleId: number | null;
  private content: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(properties: SampleDetailProperties) {
    super();
    Object.assign(this, properties);
  }

  updateContent(content: string) {
    this.content = content;
  }

  getSampleDetail(): SampleDetailProperties {
    return {
      id: this.id,
      sampleId: this.sampleId,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
