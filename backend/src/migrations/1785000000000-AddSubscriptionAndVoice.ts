import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubscriptionAndVoice1785000000000 implements MigrationInterface {
  name = 'AddSubscriptionAndVoice1785000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // --- users: subscription columns ---
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_plan_enum') THEN
        CREATE TYPE "users_plan_enum" AS ENUM ('free', 'pro', 'max'); END IF; END $$`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_plan_status_enum') THEN
        CREATE TYPE "users_plan_status_enum" AS ENUM ('active', 'past_due', 'canceled', 'none'); END IF; END $$`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plan" "users_plan_enum" NOT NULL DEFAULT 'free'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "planStatus" "users_plan_status_enum" NOT NULL DEFAULT 'none'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingBonusGrantedAt" TIMESTAMPTZ`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripeCustomerId" varchar UNIQUE`,
    );

    // --- voice_quotas ---
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_quotas_plan_snapshot_enum') THEN
        CREATE TYPE "voice_quotas_plan_snapshot_enum" AS ENUM ('free', 'pro', 'max'); END IF; END $$`,
    );
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "voice_quotas" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "user_id" integer NOT NULL,
      "period_start" TIMESTAMPTZ NOT NULL,
      "period_end" TIMESTAMPTZ NOT NULL,
      "standard_seconds_used" integer NOT NULL DEFAULT 0,
      "realtime_seconds_used" integer NOT NULL DEFAULT 0,
      "bonus_seconds_granted" integer NOT NULL DEFAULT 0,
      "bonus_seconds_used" integer NOT NULL DEFAULT 0,
      "plan_snapshot" "voice_quotas_plan_snapshot_enum" NOT NULL DEFAULT 'free',
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_voice_quotas" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_voice_quotas_user" UNIQUE ("user_id"),
      CONSTRAINT "FK_voice_quotas_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    // --- voice_sessions ---
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_sessions_mode_enum') THEN
        CREATE TYPE "voice_sessions_mode_enum" AS ENUM ('standard', 'realtime'); END IF; END $$`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_sessions_status_enum') THEN
        CREATE TYPE "voice_sessions_status_enum" AS ENUM ('active', 'ended', 'capped', 'aborted'); END IF; END $$`,
    );
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_sessions_ended_reason_enum') THEN
        CREATE TYPE "voice_sessions_ended_reason_enum" AS ENUM ('user', 'cap', 'silence', 'error'); END IF; END $$`,
    );
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "voice_sessions" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "user_id" integer NOT NULL,
      "conversation_session_id" uuid,
      "target_language" varchar NOT NULL,
      "native_language" varchar NOT NULL,
      "cefr_level" varchar(2) NOT NULL,
      "mode" "voice_sessions_mode_enum" NOT NULL DEFAULT 'standard',
      "status" "voice_sessions_status_enum" NOT NULL DEFAULT 'active',
      "user_speaking_seconds" integer NOT NULL DEFAULT 0,
      "ai_speaking_seconds" integer NOT NULL DEFAULT 0,
      "wall_clock_seconds" integer NOT NULL DEFAULT 0,
      "session_cap_seconds" integer NOT NULL,
      "stt_model" varchar NOT NULL,
      "tts_model" varchar NOT NULL,
      "llm_model" varchar NOT NULL,
      "ended_reason" "voice_sessions_ended_reason_enum",
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      "ended_at" TIMESTAMPTZ,
      CONSTRAINT "PK_voice_sessions" PRIMARY KEY ("id"),
      CONSTRAINT "FK_voice_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_voice_sessions_conversation" FOREIGN KEY ("conversation_session_id") REFERENCES "conversation_sessions"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_voice_sessions_user_created" ON "voice_sessions" ("user_id", "created_at")`,
    );

    // --- voice_usage_events ---
    await queryRunner.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_usage_events_kind_enum') THEN
        CREATE TYPE "voice_usage_events_kind_enum" AS ENUM ('stt', 'llm', 'tts'); END IF; END $$`,
    );
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "voice_usage_events" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "user_id" integer NOT NULL,
      "voice_session_id" uuid NOT NULL,
      "kind" "voice_usage_events_kind_enum" NOT NULL,
      "model" varchar NOT NULL,
      "target_language" varchar NOT NULL,
      "user_speaking_seconds" integer NOT NULL DEFAULT 0,
      "input_tokens" integer,
      "output_tokens" integer,
      "audio_seconds_in" integer,
      "audio_seconds_out" integer,
      "est_cost_micros" bigint NOT NULL DEFAULT 0,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_voice_usage_events" PRIMARY KEY ("id"),
      CONSTRAINT "FK_voice_usage_events_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_voice_usage_events_session" FOREIGN KEY ("voice_session_id") REFERENCES "voice_sessions"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_voice_usage_events_user_created" ON "voice_usage_events" ("user_id", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_voice_usage_events_session" ON "voice_usage_events" ("voice_session_id")`,
    );

    // --- stripe_customers ---
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "stripe_customers" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "user_id" integer NOT NULL,
      "stripe_customer_id" varchar NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_stripe_customers" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_stripe_customers_user" UNIQUE ("user_id"),
      CONSTRAINT "UQ_stripe_customers_stripe_id" UNIQUE ("stripe_customer_id"),
      CONSTRAINT "FK_stripe_customers_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    // --- stripe_subscriptions ---
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "stripe_subscriptions" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "user_id" integer NOT NULL,
      "stripe_subscription_id" varchar NOT NULL,
      "stripe_price_id" varchar NOT NULL,
      "status" varchar NOT NULL,
      "current_period_start" TIMESTAMPTZ NOT NULL,
      "current_period_end" TIMESTAMPTZ NOT NULL,
      "cancel_at_period_end" boolean NOT NULL DEFAULT false,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_stripe_subscriptions" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_stripe_subscriptions_stripe_id" UNIQUE ("stripe_subscription_id"),
      CONSTRAINT "FK_stripe_subscriptions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_stripe_subscriptions_user" ON "stripe_subscriptions" ("user_id")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_stripe_subscriptions_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stripe_subscriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stripe_customers"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_voice_usage_events_session"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_voice_usage_events_user_created"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "voice_usage_events"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "voice_usage_events_kind_enum"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_voice_sessions_user_created"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "voice_sessions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "voice_sessions_ended_reason_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "voice_sessions_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "voice_sessions_mode_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "voice_quotas"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "voice_quotas_plan_snapshot_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "stripeCustomerId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "onboardingBonusGrantedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "emailVerified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "planStatus"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "plan"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_plan_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_plan_enum"`);
  }
}
