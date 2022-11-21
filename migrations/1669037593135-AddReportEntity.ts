import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportEntity1669037593135 implements MigrationInterface {
    name = 'AddReportEntity1669037593135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT '200', "availability" character varying NOT NULL DEFAULT '0', "outages" integer NOT NULL DEFAULT '0', "downtime" integer NOT NULL DEFAULT '0', "uptime" integer NOT NULL DEFAULT '0', "responseTime" numeric(5,2) NOT NULL DEFAULT '0', "userId" uuid NOT NULL, "checkId" uuid NOT NULL, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_b3563030a5074dc72798a32390b" FOREIGN KEY ("checkId") REFERENCES "check"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_b3563030a5074dc72798a32390b"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }

}
