import { MongooseModule } from '@nestjs/mongoose';
import { Config } from '../src/config';

export const url = `mongodb://${Config.DOCUMENT_DATABASE_USER}:${Config.DOCUMENT_DATABASE_PASSWORD}@${Config.DOCUMENT_DATABASE_HOST}:${Config.DOCUMENT_DATABASE_PORT}/${Config.DOCUMENT_DATABASE_NAME}`;

function getConnection() {
  return MongooseModule.forRoot(url);
}

export const documentDbConnection = getConnection();
