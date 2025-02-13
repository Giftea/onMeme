import { db } from "@/lib/db";
import {
  users,
  nfts,
  listings,
  likes,
  memes,
  tokens,
  balances,
} from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
const PROJECT_OWNER_ADDRESS = process.env.PROJECT_OWNER_ADDRESS || "";

// Get all users
export async function getUsers() {
  return await db.select().from(users);
}

// Fetch user by address
export async function getUserByAddress(address: string) {
  return await db.select().from(users).where(eq(users.address, address));
}

// Create a new user
export async function createUser(id: string, address: string) {
  return await db
    .insert(users)
    .values({ id, username: "", address })
    .returning();
}

// Update user by address
export async function updateUser(address: string, username?: string) {
  return await db
    .update(users)
    .set({ ...(username && { username }) }) // Update only if a new username is provided
    .where(eq(users.address, address))
    .returning();
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
export async function mintNFT(owner: string, metadata: object) {
  return await db.insert(nfts).values({ token: '1', owner, metadata }).returning();
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

// Create a token
export async function createToken(
  creatorAddress: string, // New parameter to check authorization
  name: string,
  symbol: string,
  decimals: number,
  maxSupply: number
) {
  if (creatorAddress.toLowerCase() !== PROJECT_OWNER_ADDRESS.toLowerCase()) {
    throw new Error("Unauthorized: Only the project owner can create tokens");
  }

  return await db.insert(tokens).values({ name, symbol, decimals, maxSupply }).returning();
}

// Get the max supply of a token
export async function getMaxSupply(tokenId: number) {
  const result = await db
    .select({ maxSupply: tokens.maxSupply })
    .from(tokens)
    .where(eq(tokens.id, tokenId));
  return result[0]?.maxSupply ?? 0;
}

// Get the total circulating supply of a token
export async function getTotalCirculatingSupply(tokenId: number) {
  const result = await db
    .select({ totalSupply: sql<number>`SUM(${balances.balance})` })
    .from(balances)
    .where(eq(balances.tokenId, tokenId));
  return result[0]?.totalSupply ?? 0;
}

// Get the balance of an address for a token
export async function getBalance(address: string, tokenId: number) {
  const result = await db
    .select({ balance: balances.balance })
    .from(balances)
    .where(and(eq(balances.address, address), eq(balances.tokenId, tokenId)));

  return result[0]?.balance ?? 0;
}

// Mint tokens
export async function mint(address: string, amount: number, tokenId: number) {
  const maxSupply = await getMaxSupply(tokenId);
  const currentSupply = await getTotalCirculatingSupply(tokenId);

  if (currentSupply + amount > maxSupply) {
    throw new Error("Minting would exceed max supply");
  }

  return await db
    .insert(balances)
    .values({ address, tokenId, balance: amount })
    .onConflictDoUpdate({
      target: [balances.address, balances.tokenId],
      set: { balance: sql`${balances.balance} + ${amount}` },
    })
    .returning();
}

// Burn tokens
export async function burn(address: string, amount: number, tokenId: number) {
  const currentBalance = await getBalance(address, tokenId);

  if (currentBalance < amount) {
    throw new Error("Insufficient balance");
  }

  return await db
    .update(balances)
    .set({ balance: sql`${balances.balance} - ${amount}` })
    .where(and(eq(balances.address, address), eq(balances.tokenId, tokenId)))
    .returning();
}

// Transfer tokens
export async function transfer(
  from: string,
  to: string,
  amount: number,
  tokenId: number
) {
  const senderBalance = await getBalance(from, tokenId);

  if (senderBalance < amount) {
    throw new Error("Insufficient balance");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(balances)
      .set({ balance: sql`${balances.balance} - ${amount}` })
      .where(and(eq(balances.address, from), eq(balances.tokenId, tokenId)));

    await tx
      .insert(balances)
      .values({ address: to, tokenId, balance: amount })
      .onConflictDoUpdate({
        target: [balances.address, balances.tokenId],
        set: { balance: sql`${balances.balance} + ${amount}` },
      });
  });
}
