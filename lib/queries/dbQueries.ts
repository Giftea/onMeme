import { db } from "@/lib/db";
import {
  users,
  nfts,
  listings,
  likes,
  memes,
  templates,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Get all users
export async function getUsers() {
  return await db.select().from(users);
}

// Get user by address
export async function getUserByAddress(address: string) {
  const user = await db.select().from(users).where(eq(users.address, address));

  return user[0];
}

// Create a new user
export async function createUser(
  id: string,
  username: string,
  address: string
) {
  return await db.insert(users).values({ id, username, address }).returning();
}

// Get all NFTs
export async function getAllNFTs() {
  return await db.select().from(nfts);
}

// Get NFTs owned by a specific user
export async function getNFTsByOwner(owner: string) {
  return await db.select().from(nfts).where(eq(nfts.owner, owner));
}

// Mint a new NFT
export async function mintNFT(token: string, owner: string, metadata: object) {
  return await db.insert(nfts).values({ token, owner, metadata }).returning();
}

// Get all listings
export async function getAllListings() {
  return await db.select().from(listings);
}

// Get listings by seller
export async function getListingsBySeller(seller: string) {
  return await db.select().from(listings).where(eq(listings.seller, seller));
}

// Create a new listing
export async function createListing(
  nftId: number,
  seller: string,
  price: number
) {
  return await db
    .insert(listings)
    .values({ nftId, seller, price, status: "listed" })
    .returning();
}

// Update listing status
export async function updateListingStatus(
  id: number,
  status: "listed" | "sold" | "cancelled"
) {
  return await db
    .update(listings)
    .set({ status })
    .where(eq(listings.id, id))
    .returning();
}

// Get all memes
export async function getAllMemes() {
  return await db.select().from(memes);
}

// Get memes by user
export async function getMemesByOwner(ownerId: string) {
  return await db.select().from(memes).where(eq(memes.ownerId, ownerId));
}

// Create a new meme
export async function createMeme(
  ownerId: string,
  templateId: number,
  imageUrl: string,
  isPublic = true
) {
  return await db
    .insert(memes)
    .values({ ownerId, templateId, imageUrl, isPublic })
    .returning();
}

// Get all likes for a meme
export async function getLikesForMeme(memeId: number) {
  return await db.select().from(likes).where(eq(likes.memeId, memeId));
}

// Like a meme
export async function likeMeme(memeId: number, userId: string) {
  return await db.insert(likes).values({ memeId, userId }).returning();
}
