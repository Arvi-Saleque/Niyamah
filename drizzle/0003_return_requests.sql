CREATE TYPE "public"."return_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "return_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" text,
	"reason" text NOT NULL,
	"items" json NOT NULL,
	"status" "return_request_status" DEFAULT 'PENDING' NOT NULL,
	"admin_note" text,
	"refund_amount" numeric(12, 2),
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "return_requests_order_idx" ON "return_requests" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "return_requests_user_idx" ON "return_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "return_requests_status_idx" ON "return_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "return_requests_store_idx" ON "return_requests" USING btree ("store_id");