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
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.address, address))
    .limit(1);
  if (existingUser) return existingUser;

  const [newUser] = await db
    .insert(users)
    .values({ address, username: "", id })
    .returning();

  await db
    .insert(balances)
    .values({
      address,
      tokenId: 1,
      balance: 10,
    })
    .onConflictDoNothing(); // Prevent duplicate entries

  return newUser;
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

// Get NFT by ID
export async function getNFTByID(id: number) {
  const nft = await db.select().from(nfts).where(eq(nfts.id, id));
  return nft[0];
}

// Get NFTs owned by a specific user
export async function getNFTsByOwner(owner: string) {
  return await db.select().from(nfts).where(eq(nfts.owner, owner));
}

export async function isMemeMinted(memeId: number) {
  const [existingNFT] = await db
    .select()
    .from(nfts)
    .where(eq(nfts.memeId, memeId))
    .limit(1);

  return !!existingNFT;
}

// Mint a new NFT
export async function mintNFT(owner: string, metadata: object, memeId: number) {
  const [existingNFT] = await db
    .select()
    .from(nfts)
    .where(eq(nfts.memeId, memeId))
    .limit(1);
  if (existingNFT) {
    throw new Error("This NFT has already been minted.");
  }

  return await db
    .insert(nfts)
    .values({ token: "1", owner, metadata, memeId })
    .returning();
}

// Get all likes for an nft
export async function getLikesForListing(listingId: number) {
  return await db.select().from(likes).where(eq(likes.listingId, listingId));
}

// Like an nft
export async function likeListing(listingId: number, userId: string) {
  // Check if the user has already liked the listing
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.listingId, listingId), eq(likes.userId, userId)));

  if (existingLike.length > 0) {
    // If the like exists, delete it (unlike)
    return await db
      .delete(likes)
      .where(and(eq(likes.listingId, listingId), eq(likes.userId, userId)))
      .returning();
  } else {
    // If the like does not exist, insert a new like
    return await db.insert(likes).values({ listingId, userId }).returning();
  }
}

// Purchase NFT
export async function purchaseNFT(listingId: number, buyerAddress: string) {
  // Get listing details
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);
  if (!listing) throw new Error("Listing not found.");
  if (listing.status !== "listed")
    throw new Error("NFT is no longer available.");

  // Prevent users from purchasing their own NFT
  if (listing.seller === buyerAddress) {
    throw new Error("You cannot purchase your own NFT.");
  }

  await db
    .insert(balances)
    .values({
      address: listing.seller,
      tokenId: 1,
      balance: 10,
    })
    .onConflictDoNothing();

  // Fetch buyer's balance
  const [buyerBalance] = await db
    .select()
    .from(balances)
    .where(and(eq(balances.address, buyerAddress), eq(balances.tokenId, 1)))
    .limit(1);

  if (!buyerBalance || buyerBalance.balance < listing.price) {
    throw new Error("Insufficient balance.");
  }

  // Fetch seller's balance
  const [sellerBalance] = await db
    .select()
    .from(balances)
    .where(and(eq(balances.address, listing.seller), eq(balances.tokenId, 1)))
    .limit(1);

  if (!sellerBalance)
    throw new Error("Seller does not have an account balance.");

  // Start transaction to ensure atomic updates
  await db.transaction(async (tx) => {
    // Transfer NFT ownership
    await tx
      .update(nfts)
      .set({ owner: buyerAddress }) // Change owner to buyer
      .where(eq(nfts.id, listing.nftId));

    // Deduct price from buyer's balance
    await tx
      .update(balances)
      .set({ balance: buyerBalance.balance - listing.price })
      .where(and(eq(balances.address, buyerAddress), eq(balances.tokenId, 1)));

    // Add price to seller's balance
    await tx
      .update(balances)
      .set({ balance: sellerBalance.balance + listing.price })
      .where(
        and(eq(balances.address, listing.seller), eq(balances.tokenId, 1))
      );

    //  Update listing status to "sold"
    await tx
      .update(listings)
      .set({ status: "sold" })
      .where(eq(listings.id, listingId));
  });

  return { message: "NFT purchased successfully!", newOwner: buyerAddress };
}

// Get all listings
export async function getAllListings() {
  return await db.select().from(listings);
}

// Get listings by seller
export async function getListingsBySeller(seller: string) {
  const result = await db
    .select({
      listingId: listings.id,
      price: listings.price,
      status: listings.status,
      listedAt: listings.listedAt,
      nftId: nfts.id,
      nftToken: nfts.token,
      nftMetadata: nfts.metadata,
      sellerId: users.id,
      sellerAddress: users.address,
      sellerUsername: users.username,
    })
    .from(listings)
    .innerJoin(nfts, eq(listings.nftId, nfts.id))
    .innerJoin(users, eq(listings.seller, users.address))
    .where(eq(listings.seller, seller));

  return result;
}

export async function getListingByNFTId(id: number) {
  const result = await db
    .select({
      listingId: listings.id,
      price: listings.price,
      status: listings.status,
      listedAt: listings.listedAt,
      nftId: nfts.id,
      nftToken: nfts.token,
      nftMetadata: nfts.metadata,
      sellerId: users.id,
      sellerAddress: users.address,
      sellerUsername: users.username,
    })
    .from(listings)
    .innerJoin(nfts, eq(listings.nftId, nfts.id))
    .innerJoin(users, eq(listings.seller, users.address))
    .where(eq(listings.nftId, id));

  return result.length > 0 ? result[0] : null;
}

export async function getListingByID(id: number) {
  const result = await db
    .select({
      listingId: listings.id,
      price: listings.price,
      status: listings.status,
      listedAt: listings.listedAt,
      nftId: nfts.id,
      nftToken: nfts.token,
      nftMetadata: nfts.metadata,
      sellerId: users.id,
      sellerAddress: users.address,
      sellerUsername: users.username,
    })
    .from(listings)
    .innerJoin(nfts, eq(listings.nftId, nfts.id))
    .innerJoin(users, eq(listings.seller, users.address))
    .where(eq(listings.id, id));

  return result.length > 0 ? result[0] : null;
}

// Check if NFT is already listed
export async function isNFTListed(nftId: number) {
  const [existingNFT] = await db
    .select()
    .from(listings)
    .where(eq(listings.nftId, nftId))
    .limit(1);

  return !!existingNFT;
}

// Create a new listing
export async function createListing(
  nftId: number,
  seller: string,
  price: number
) {
  const [existingListing] = await db
    .select()
    .from(listings)
    .where(eq(listings.nftId, nftId))
    .limit(1);
  if (existingListing) {
    throw new Error("This NFT is already listed for sale.");
  }

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

export async function updateListingPrice(listingId: number, newPrice: number) {
  // Ensure a valid price is provided
  if (newPrice <= 0) {
    throw new Error("Price must be greater than zero.");
  }

  return await db
    .update(listings)
    .set({ price: newPrice, status: "listed" })
    .where(eq(listings.id, listingId))
    .returning();
}

export async function getMarketplaceListings() {
  return await db
    .select({
      listingId: listings.id,
      price: listings.price,
      status: listings.status,
      listedAt: listings.listedAt,
      nftId: nfts.id,
      nftToken: nfts.token,
      nftMetadata: nfts.metadata,
      sellerId: users.id,
      sellerAddress: users.address,
      sellerUsername: users.username,
    })
    .from(listings)
    .innerJoin(nfts, eq(listings.nftId, nfts.id))
    .innerJoin(users, eq(listings.seller, users.address))
    .where(eq(listings.status, "listed"));
}

// Get all memes
export async function getAllMemes() {
  return await db.select().from(memes);
}

// Get memes by user
export async function getMemesByOwner(ownerAddress: string) {
  return await db
    .select()
    .from(memes)
    .where(eq(memes.ownerAddress, ownerAddress));
}

// Create a new meme
export async function createMeme(
  ownerAddress: string,
  templateId: string,
  imageUrl: string,
  isPublic = true
) {
  return await db
    .insert(memes)
    .values({ ownerAddress, templateId, imageUrl, isPublic })
    .returning();
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

  return await db
    .insert(tokens)
    .values({ name, symbol, decimals, maxSupply })
    .returning();
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

  if (Number(currentSupply) + Number(amount) > maxSupply) {
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

// Get top users based on combined leaderboard points
export async function getLeaderboard() {
  return await db
    .select({
      userId: users.id,
      username: users.username,
      address: users.address,
      totalPoints: sql<number>`
        (COALESCE(COUNT(${listings.id}), 0) * 5) +  -- NFTs Sold (5 points each)
        (COALESCE(COUNT(${nfts.id}), 0) * 2) +      -- Memes Minted (2 points each)
        (COALESCE(SUM(${balances.balance}), 0) * 1) + -- OMC Earned (1 point per OMC)
        (COALESCE(COUNT(${likes.id}), 0) * 1)       -- Likes Received (1 point each)
      `.as("totalPoints"),
    })
    .from(users)
    .leftJoin(
      listings,
      sql`${users.address} = ${listings.seller} AND ${listings.status} = 'sold'`
    ) // NFTs Sold
    .leftJoin(nfts, sql`${users.address} = ${nfts.owner}`)
    .leftJoin(balances, sql`${users.address} = ${balances.address}`)
    .leftJoin(likes, sql`${users.id} = ${likes.userId}`)
    .groupBy(users.id)
    .orderBy(
      sql`(COALESCE(COUNT(${listings.id}), 0) * 5) +  
        (COALESCE(COUNT(${nfts.id}), 0) * 2) +  
        (COALESCE(SUM(${balances.balance}), 0) * 1) +  
        (COALESCE(COUNT(${likes.id}), 0) * 1) DESC`
    )
    .limit(10);
}
