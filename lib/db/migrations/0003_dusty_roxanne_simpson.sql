CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"user_id" varchar(42) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "user_listing_unique" UNIQUE("user_id","listing_id")
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_address_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;