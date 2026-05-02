ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_name" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address_line1" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address_line2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_district" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_area" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_city" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_postal_code" varchar(20);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" serial PRIMARY KEY NOT NULL,
  "store_id" integer NOT NULL,
  "email" varchar(255) NOT NULL,
  "name" varchar(255),
  "source" varchar(100),
  "subscribed" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "unsubscribed_at" timestamp
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_store_id_stores_id_fk"
    FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_store_email_idx"
  ON "newsletter_subscribers" USING btree ("store_id","email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "newsletter_store_idx"
  ON "newsletter_subscribers" USING btree ("store_id");
