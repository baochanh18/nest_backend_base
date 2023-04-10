import { Inject } from '@nestjs/common';

import { writeConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../../infrastructure/entity/SampleEntity';

import { SampleRepository } from '../../domain/SampleRepository';
import { Sample, SampleProperties } from '../../domain/Sample';
import { SampleFactory } from '../../domain/SampleFactory';

export class SampleRepositoryImplement implements SampleRepository {
  @Inject() private readonly sampleFactory: SampleFactory;

  async save(data: Sample | Sample[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(SampleEntity).save(entities);
  }

  async findById(id: number): Promise<Sample | null> {
    const entity = await writeConnection.manager
      .getRepository(SampleEntity)
      .findOneBy({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  private modelToEntity(model: Sample): SampleEntity {
    const properties = JSON.parse(JSON.stringify(model)) as SampleProperties;
    return {
      ...properties,
      id: properties.id,
      createdAt: properties.createdAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: SampleEntity): Sample {
    return this.sampleFactory.reconstitute({
      ...entity,
      id: entity.id,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    });
  }
}
