import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { connectionSource } from './DatabaseSource';

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    writeConnection = connectionSource.createQueryRunner();
    readConnection = connectionSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await connectionSource.destroy();
  }
}

export const ENTITY_ID_TRANSFORMER = 'EntityIdTransformer';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [ENTITY_ID_TRANSFORMER],
})
export class DatabaseModule {}
