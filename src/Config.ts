import { Logger } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsString()
  readonly AWS_REGION = process.env.AWS_REGION as string || 'AWS_REGION';

  @IsOptional()
  @IsString()
  readonly AWS_ENDPOINT = process.env.AWS_ENDPOINT || 'AWS_ENDPOINT';

  @IsString()
  readonly AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string || 'AWS_ACCESS_KEY_ID';

  @IsString()
  readonly AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string || 'AWS_SECRET_ACCESS_KEY';

  @IsString()
  readonly AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL as string || 'AWS_SQS_QUEUE_URL';

  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true' || true;

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string || 'localhost';

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT) || 3306;

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string || 'disney';

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string || 'root';

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string || 'test';

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === 'true' || true;

  @IsEmail()
  readonly EMAIL = process.env.EMAIL as string || 'test@example.com';

  @IsInt()
  readonly PORT = Number(process.env.PORT) || 4000;

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
