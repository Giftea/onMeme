CREATE TABLE "nft_transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"nft_id" integer NOT NULL,
	"seller" varchar(42) NOT NULL,
	"buyer" varchar(42) NOT NULL,
	"price" integer NOT NULL,
	"transferred_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "nft_transfers" ADD CONSTRAINT "nft_transfers_nft_id_nfts_id_fk" FOREIGN KEY ("nft_id") REFERENCES "public"."nfts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_transfers" ADD CONSTRAINT "nft_transfers_seller_users_address_fk" FOREIGN KEY ("seller") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_transfers" ADD CONSTRAINT "nft_transfers_buyer_users_address_fk" FOREIGN KEY ("buyer") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;