import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
// import { AccountEntity } from '../src/account/infrastructure/entity/AccountEntity';
import { Config } from '../src/Config';

export const connectionSource = new DataSource({
  name: 'default',
  type: 'mysql',
  charset: 'utf8mb4_unicode_ci',
  logging: Config.DATABASE_LOGGING,
  host: Config.DATABASE_HOST,
  port: Config.DATABASE_PORT,
  database: Config.DATABASE_NAME,
  username: Config.DATABASE_USER,
  password: Config.DATABASE_PASSWORD,
  synchronize: Config.DATABASE_SYNC,
  cache: true,
  entities: ['src/**/infrastructure/entities/*.ts'],
  migrations: ['migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});
