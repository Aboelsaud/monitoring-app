import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorResponseTimeToDecimal1668801667709 implements MigrationInterface {
    name = 'RefactorResponseTimeToDecimal1668801667709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "responseTime"`);
        await queryRunner.query(`ALTER TABLE "report" ADD "responseTime" numeric(5,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "responseTime"`);
        await queryRunner.query(`ALTER TABLE "report" ADD "responseTime" integer NOT NULL DEFAULT '0'`);
    }

}
