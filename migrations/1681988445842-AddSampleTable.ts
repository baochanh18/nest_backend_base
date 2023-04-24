import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSampleTable1681988445842 implements MigrationInterface {
    name = 'AddSampleTable1681988445842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`samples\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sample_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sample_id\` int NOT NULL, \`content\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_c1f7dcce4bec83becb29e03b7b\` (\`sample_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sample_details\` ADD CONSTRAINT \`FK_c1f7dcce4bec83becb29e03b7b9\` FOREIGN KEY (\`sample_id\`) REFERENCES \`samples\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sample_details\` DROP FOREIGN KEY \`FK_c1f7dcce4bec83becb29e03b7b9\``);
        await queryRunner.query(`DROP INDEX \`REL_c1f7dcce4bec83becb29e03b7b\` ON \`sample_details\``);
        await queryRunner.query(`DROP TABLE \`sample_details\``);
        await queryRunner.query(`DROP TABLE \`samples\``);
    }

}
