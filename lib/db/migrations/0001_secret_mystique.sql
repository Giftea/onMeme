CREATE TABLE "balances" (
	"address" varchar(42) NOT NULL,
	"token_id" integer NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "balances_address_token_id_pk" PRIMARY KEY("address","token_id")
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(255) NOT NULL,
	"decimals" integer NOT NULL,
	"max_supply" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_address_users_address_fk" FOREIGN KEY ("address") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_token_id_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE no action ON UPDATE no action;