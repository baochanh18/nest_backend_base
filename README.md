# Project Title

This is sample Project

## Installation

To install the project, follow these steps:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start app with `npm run docker:up`.
4. Generate migraiton with `npm run migration:run`.

## Scripts

This project includes several scripts that you can use to run various tasks:

- `build`: Builds the project using Nest.
- `format`: Formats the TypeScript source code using Prettier.
- `start`: Starts the project using Nest.
- `start:dev`: Starts the project using Nest in development mode with file watching enabled.
- `start:debug`: Starts the project using Nest in debug mode with file watching enabled.
- `start:prod`: Starts the compiled production version of the project.
- `lint`: Lints the TypeScript source code using ESLint.
- `test`: Runs the Jest test suite with some environment variables set.
- `test:watch`: Runs the Jest test suite and watches for changes.
- `test:cov`: Runs the Jest test suite and generates a coverage report.
- `test:debug`: Runs the Jest test suite in debug mode for debugging tests.
- `test:e2e`: Runs the Jest end-to-end (e2e) test suite with a custom configuration file.
- `docker:up`: Starts the project containers using Docker Compose.
- `docker:down`: Stops the project containers using Docker Compose.
- `migration:generate`: Generates a new migration for TypeORM.
- `migration:run`: Runs all pending migrations for TypeORM.
- `migration:revert`: Reverts the most recently applied migration for TypeORM.
- `migration:run:test`: Runs all pending migrations on the test database.
- `migration:revert:test`: Reverts the most recently applied migration on the test database for TypeORM.

You can run any of these scripts using `npm run` followed by the script name. For example:

```
npm run build
```

## Usage
### Docker
To start the project containers, run:

```
npm run docker:up
```

This will start the containers in detached mode. You can then access the project at `http://localhost:4000`.

To stop the project containers, run:

```
npm run docker:down
```

This will stop and remove the containers, as well as any data volumes defined in the `docker-compose.yml` file.

Make sure that you have followed the installation steps mentioned in the readme before running these commands.

### Migration
Here's an example of how to generate a migration using the provided script:

```
npm run migration:generate --name="create_users_table"
```

This will create a new file in the `migrations` directory with a timestamp and the name you provided. Inside this file, you can write your query to create or modify database tables.

Make sure to replace `"Migration_name"` with a descriptive name for the migration you are creating. Also, ensure that your database is properly configured before running the migration command.
## API Documentation

Esa document

## Technologies Used

- [Nest](https://nestjs.com/)
- Docker compose
- CQRS
- DDD
- Micro Services
