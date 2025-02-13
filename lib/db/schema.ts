import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 42 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  address: varchar("address", { length: 42 }).unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Templates Table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Memes Table
export const memes = pgTable("memes", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id", { length: 42 })
    .references(() => users.id)
    .notNull(),
  templateId: integer("template_id").references(() => templates.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url").notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Likes Table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  memeId: integer("meme_id")
    .references(() => memes.id)
    .notNull(),
  userId: varchar("user_id", { length: 42 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// NFTs Table
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  token: varchar("token").notNull(),
  owner: varchar("owner", { length: 42 })
    .references(() => users.address)
    .notNull(),
  metadata: jsonb("metadata").notNull(),
  mintedAt: timestamp("minted_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Listings Table
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id")
    .references(() => nfts.id, { onDelete: "cascade" })
    .notNull(),
  seller: varchar("seller", { length: 42 })
    .references(() => users.address)
    .notNull(),
  price: integer("price").notNull(),
  status: varchar("status", { length: 10 })
    .$type<"listed" | "sold" | "cancelled">()
    .notNull(),
  listedAt: timestamp("listed_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Tokens Table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 255 }).notNull(),
  decimals: integer("decimals").notNull(),
  maxSupply: integer("max_supply").notNull(),
});

// Balances Table
export const balances = pgTable(
  "balances",
  {
    address: varchar("address", { length: 42 })
      .references(() => users.address)
      .notNull(),
    tokenId: integer("token_id")
      .references(() => tokens.id)
      .notNull(),
    balance: integer("balance").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.address, table.tokenId] })]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  memes: many(memes),
  likes: many(likes),
  nfts: many(nfts),
  listings: many(listings),
}));

export const memesRelations = relations(memes, ({ one, many }) => ({
  owner: one(users, {
    fields: [memes.ownerId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [memes.templateId],
    references: [templates.id],
  }),
  likes: many(likes),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  memes: many(memes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  meme: one(memes, {
    fields: [likes.memeId],
    references: [memes.id],
  }),
}));

export const nftsRelations = relations(nfts, ({ one, many }) => ({
  owner: one(users, {
    fields: [nfts.owner],
    references: [users.address],
  }),
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  nft: one(nfts, {
    fields: [listings.nftId],
    references: [nfts.id],
  }),
  seller: one(users, {
    fields: [listings.seller],
    references: [users.address],
  }),
}));

export const tokensRelations = relations(tokens, ({ many }) => ({
  balances: many(balances),
}));

export const balancesRelations = relations(balances, ({ one }) => ({
  user: one(users, {
    fields: [balances.address],
    references: [users.address],
  }),
  token: one(tokens, {
    fields: [balances.tokenId],
    references: [tokens.id],
  }),
}));
