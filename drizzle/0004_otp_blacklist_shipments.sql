CREATE TYPE "public"."otp_purpose" AS ENUM('checkout', 'phone_verification', 'login');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."blacklist_reason" AS ENUM('REPEATED_REFUSAL', 'FAKE_ORDERS', 'FRAUD', 'ABUSE', 'OTHER');--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"phone" varchar(50),
	"email" varchar(255),
	"code_hash" text NOT NULL,
	"purpose" "otp_purpose" DEFAULT 'checkout' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"consumed_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"requester_ip" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_blacklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"phone" varchar(50),
	"email" varchar(255),
	"reason" "blacklist_reason" DEFAULT 'OTHER' NOT NULL,
	"note" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"courier" varchar(50) NOT NULL,
	"tracking_code" varchar(255),
	"consignment_id" varchar(255),
	"status" "shipment_status" DEFAULT 'PENDING' NOT NULL,
	"cod_amount" numeric(12, 2),
	"note" text,
	"provider_response" json,
	"dispatched_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_blacklist" ADD CONSTRAINT "customer_blacklist_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_blacklist" ADD CONSTRAINT "customer_blacklist_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_dispatched_by_users_id_fk" FOREIGN KEY ("dispatched_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "otp_codes_phone_idx" ON "otp_codes" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "otp_codes_email_idx" ON "otp_codes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "otp_codes_store_idx" ON "otp_codes" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "otp_codes_expires_idx" ON "otp_codes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "customer_blacklist_store_idx" ON "customer_blacklist" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "customer_blacklist_phone_idx" ON "customer_blacklist" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "customer_blacklist_email_idx" ON "customer_blacklist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "shipments_order_idx" ON "shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shipments_store_idx" ON "shipments" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "shipments_tracking_idx" ON "shipments" USING btree ("tracking_code");
