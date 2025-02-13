CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"meme_id" integer NOT NULL,
	"user_id" varchar(42) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"nft_id" integer NOT NULL,
	"seller" varchar(42) NOT NULL,
	"price" integer NOT NULL,
	"status" varchar(10) NOT NULL,
	"listed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "memes" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" varchar(42) NOT NULL,
	"template_id" integer,
	"image_url" text NOT NULL,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(66) NOT NULL,
	"owner" varchar(42) NOT NULL,
	"metadata" jsonb NOT NULL,
	"minted_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "nfts_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(42) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"address" varchar(42) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_address_unique" UNIQUE("address")
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_nft_id_nfts_id_fk" FOREIGN KEY ("nft_id") REFERENCES "public"."nfts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_users_address_fk" FOREIGN KEY ("seller") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memes" ADD CONSTRAINT "memes_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memes" ADD CONSTRAINT "memes_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_owner_users_address_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;