import {
    InferSelectModel,
    InferInsertModel,
  } from "drizzle-orm";
  import { users, memes, templates, likes } from "@/lib/db/schema";
  
  // 🔹 User Types
  export type User = InferSelectModel<typeof users>;
  export type NewUser = InferInsertModel<typeof users>;
  
  // 🔹 Meme Types
  export type Meme = InferSelectModel<typeof memes>;
  export type NewMeme = InferInsertModel<typeof memes>;
  
  // 🔹 Template Types
  export type Template = InferSelectModel<typeof templates>;
  export type NewTemplate = InferInsertModel<typeof templates>;
  
  // 🔹 Likes Types
  export type Like = InferSelectModel<typeof likes>;
  export type NewLike = InferInsertModel<typeof likes>;
  