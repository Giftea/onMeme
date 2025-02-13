ALTER TABLE "nfts" DROP CONSTRAINT "nfts_token_unique";--> statement-breakpoint
ALTER TABLE "nfts" ALTER COLUMN "token" SET DATA TYPE varchar;