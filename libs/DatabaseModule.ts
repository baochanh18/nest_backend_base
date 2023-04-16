import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { connectionSource } from './DatabaseSource';
import { documentDbConnection } from './DocumentDBModule';

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
  private readonly dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource(connectionSource as DataSourceOptions);
  }

  private async initializeConnections(): Promise<void> {
    await this.dataSource.initialize();
    const [writeQueryRunner, manager] = await Promise.all([
      this.dataSource.createQueryRunner(),
      this.dataSource.manager
    ]);
    writeConnection = writeQueryRunner;
    readConnection = manager;
  }

  private async destroyConnections(): Promise<void> {
    await this.dataSource.destroy();
  }

  async onModuleInit(): Promise<void> {
    await this.initializeConnections();
  }

  async onModuleDestroy(): Promise<void> {
    await this.destroyConnections();
  }
}

@Global()
@Module({
  providers: [DatabaseService],
  imports: [documentDbConnection],
})
export class DatabaseModule {}
