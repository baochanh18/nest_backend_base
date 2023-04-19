import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { writeConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../entity/Sample';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import { Sample, SampleProperties } from '../../domain/aggregate/Sample';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { REDIS_CLIENT } from '../../../../libs/RedisModule';

export class SampleRepositoryImplement implements SampleRepository {
  @Inject() private readonly sampleFactory: SampleFactory;
  @Inject(REDIS_CLIENT)
  private readonly redisClient: Redis;

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

  async getCacheData(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async setCacheData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  private modelToEntity(model: Sample): SampleEntity {
    const properties = JSON.parse(JSON.stringify(model)) as SampleProperties; // deep clone object
    return {
      ...properties,
      id: properties.id,
      createdAt: properties.createdAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: SampleEntity): Sample {
    return this.sampleFactory.reconstitute({ ...entity });
  }
}
