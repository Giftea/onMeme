import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id", { length: 42 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const memes = pgTable("memes", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id", { length: 42 })
    .references(() => users.id)
    .notNull(),
  templateId: integer("template_id").references(() => templates.id, { onDelete: "set null" }),
  imageUrl: text("image_url").notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  memeId: integer("meme_id")
    .references(() => memes.id)
    .notNull(),
  userId: varchar("user_id", { length: 42 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  memes: many(memes),
  likes: many(likes),
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
