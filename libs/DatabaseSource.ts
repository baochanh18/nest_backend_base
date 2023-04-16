import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../src/config';

export const connectionSource = {
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
  timezone: 'Z',
  entities: ['src/**/infrastructure/entity/*.ts'],
  migrations: ['src/RDS/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(connectionSource as DataSourceOptions);
