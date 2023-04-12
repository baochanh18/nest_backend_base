// migrations/mongo-migrate-config.js
import { Config } from './src/Config';

const mongoConfig = {
  mongodb: {
    // Connection URI for your MongoDB instance
    url: `mongodb://${Config.DOCUMENT_DATABASE_USER}:${Config.DOCUMENT_DATABASE_PASSWORD}@${Config.DOCUMENT_DATABASE_HOST}:${Config.DOCUMENT_DATABASE_PORT}/${Config.DOCUMENT_DATABASE_NAME}`,

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

module.exports = mongoConfig;
