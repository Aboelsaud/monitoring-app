import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTagsDataType1669033565395 implements MigrationInterface {
    name = 'ChangeTagsDataType1669033565395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "check" ADD "tags" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "check" ADD "tags" text array`);
    }

}
