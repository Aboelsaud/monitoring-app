import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCheckEntity1668774501072 implements MigrationInterface {
    name = 'AddCheckEntity1668774501072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."check_protocol_enum" AS ENUM('HTTP', 'HTTPS', 'TCP')`);
        await queryRunner.query(`CREATE TABLE "check" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "protocol" "public"."check_protocol_enum" NOT NULL DEFAULT 'HTTP', "path" character varying NOT NULL DEFAULT '/', "port" integer, "webhook" character varying, "timeout" integer NOT NULL DEFAULT '5', "interval" integer NOT NULL DEFAULT '10', "threshold" integer NOT NULL DEFAULT '1', "authentication" jsonb, "tags" text array, "httpHeaders" jsonb, "assert" jsonb, "ignoreSSL" boolean NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_6ee0972d45123f0224b28c67d20" UNIQUE ("url"), CONSTRAINT "PK_de2f7a277e891b3342c5b0d2710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "check" ADD CONSTRAINT "FK_918560179c0e9aeb24381534b7e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "check" DROP CONSTRAINT "FK_918560179c0e9aeb24381534b7e"`);
        await queryRunner.query(`DROP TABLE "check"`);
        await queryRunner.query(`DROP TYPE "public"."check_protocol_enum"`);
    }

}
