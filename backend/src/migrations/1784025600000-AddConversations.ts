import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConversations1784025600000 implements MigrationInterface {
  name = 'AddConversations1784025600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "conversation_sessions_status_enum" AS ENUM ('active', 'assessment_queued', 'assessing', 'completed', 'assessment_failed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "conversation_messages_role_enum" AS ENUM ('learner', 'assistant')`,
    );
    await queryRunner.query(
      `CREATE TYPE "conversation_messages_generation_status_enum" AS ENUM ('persisted', 'generating', 'failed')`,
    );
    await queryRunner.query(`CREATE TABLE "conversation_sessions" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" integer NOT NULL,
      "flow_session_id" integer NOT NULL, "target_language" varchar NOT NULL,
      "native_language" varchar NOT NULL, "cefr_level" varchar(2) NOT NULL,
      "scenario" jsonb NOT NULL, "status" "conversation_sessions_status_enum" NOT NULL DEFAULT 'active',
      "feedback_version" varchar, "feedback" jsonb, "companion_prompt_version" varchar NOT NULL DEFAULT 'companion-v1',
      "critic_prompt_version" varchar NOT NULL DEFAULT 'critic-v1', "companion_model" varchar NOT NULL,
      "critic_model" varchar NOT NULL, "assessment_attempt" integer NOT NULL DEFAULT 0,
      "failure_code" varchar, "failure_message" varchar, "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "finalized_at" TIMESTAMPTZ, "assessed_at" TIMESTAMPTZ,
      CONSTRAINT "PK_conversation_sessions" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_conversation_flow" UNIQUE ("flow_session_id"),
      CONSTRAINT "FK_conversation_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_conversation_flow" FOREIGN KEY ("flow_session_id") REFERENCES "flow_sessions"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_conversation_owner_created" ON "conversation_sessions" ("user_id", "created_at")`,
    );
    await queryRunner.query(`CREATE TABLE "conversation_messages" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid NOT NULL,
      "order_index" integer NOT NULL, "role" "conversation_messages_role_enum" NOT NULL,
      "content" text NOT NULL, "client_message_id" uuid,
      "generation_status" "conversation_messages_generation_status_enum" NOT NULL DEFAULT 'persisted',
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_conversation_messages" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_conversation_message_order" UNIQUE ("session_id", "order_index"),
      CONSTRAINT "UQ_conversation_client_message" UNIQUE ("session_id", "client_message_id"),
      CONSTRAINT "FK_conversation_message_session" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `ALTER TABLE "flashcards" ADD "card_kind" varchar NOT NULL DEFAULT 'word'`,
    );
    await queryRunner.query(
      `ALTER TABLE "flashcards" ADD "conversation_session_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "flashcards" ADD "conversation_correction_id" varchar`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_sentence_card_source" ON "flashcards" ("user_id", "conversation_session_id", "conversation_correction_id") WHERE "conversation_session_id" IS NOT NULL AND "conversation_correction_id" IS NOT NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_sentence_card_source"`);
    await queryRunner.query(
      `ALTER TABLE "flashcards" DROP COLUMN "conversation_correction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "flashcards" DROP COLUMN "conversation_session_id"`,
    );
    await queryRunner.query(`ALTER TABLE "flashcards" DROP COLUMN "card_kind"`);
    await queryRunner.query(`DROP TABLE "conversation_messages"`);
    await queryRunner.query(`DROP INDEX "IDX_conversation_owner_created"`);
    await queryRunner.query(`DROP TABLE "conversation_sessions"`);
    await queryRunner.query(
      `DROP TYPE "conversation_messages_generation_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "conversation_messages_role_enum"`);
    await queryRunner.query(`DROP TYPE "conversation_sessions_status_enum"`);
  }
}
