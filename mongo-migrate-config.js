// migrations/mongo-migrate-config.js
import { config } from './src/config';

const mongoconfig = {
  mongodb: {
    // Connection URI for your MongoDB instance
    url: `mongodb://${config.DOCUMENT_DATABASE_USER}:${config.DOCUMENT_DATABASE_PASSWORD}@${config.DOCUMENT_DATABASE_HOST}:${config.DOCUMENT_DATABASE_PORT}/${config.DOCUMENT_DATABASE_NAME}`,

    // Database name
    databaseName: 'disney',

    // Options object passed to the MongoClient constructor
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Path to the directory containing your migration files
  migrationsDir: './src/RDS/document_migrations',

  // Name of the collection where migration state is stored
  changelogCollectionName: 'changelog',
};

module.exports = mongoconfig;
