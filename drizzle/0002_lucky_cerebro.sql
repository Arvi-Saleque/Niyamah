CREATE TABLE "homepage_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"block_key" varchar(64) NOT NULL,
	"data" json NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"source" varchar(100),
	"subscribed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_name" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line1" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_district" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_area" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "homepage_blocks" ADD CONSTRAINT "homepage_blocks_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "homepage_blocks_store_key_uniq" ON "homepage_blocks" USING btree ("store_id","block_key");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_store_email_idx" ON "newsletter_subscribers" USING btree ("store_id","email");--> statement-breakpoint
CREATE INDEX "newsletter_store_idx" ON "newsletter_subscribers" USING btree ("store_id");