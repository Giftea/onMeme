# **onMeme Meme Generation NFT App**

This README provides setup instructions, project structure details, key features, and documentation on how the **Chopin Framework** and other technologies were used in onMeme.

Find deployed project link [HERE](https://on-meme.vercel.app/)

![Screenshot 2025-02-28 at 09 56 53](https://github.com/user-attachments/assets/bc381847-4df4-4861-bf5f-e52227b51358)

---

## **🚀 Project Overview**

**onMeme** is an **onchain meme generator and NFT marketplace** where users can:
✅ **Create and customize memes**
✅ **Mint memes as NFTs**
✅ **Buy, sell, and trade NFTs** using **OMC (onMeme Coin)**
✅ **Engage in a leaderboard system** based on meme popularity and NFT sales
✅ **Use AI-powered meme generation**

The project leverages the **Chopin Framework** for **embedded wallets, decentralized transactions, and token management**, alongside **Next.js, tRPC, Drizzle ORM, Neon Postgres Database, IPFS, and Celestia**.

---

## **🛠️ Tech Stack**

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: tRPC, Drizzle ORM, Neon PostgreSQL
- **Blockchain**: Chopin Framework, Celestia
- **Storage**: IPFS (for meme metadata)
- **AI**: OpenAI API (for AI-generated meme suggestions)

---

## **📥 Installation & Setup**

### **1️⃣ Install Dependencies**

- [Git](https://git-scm.com/)
- [Node.js v20.x (LTS)](https://nodejs.org)
- [pnpm](https://pnpm.io/) version 9.x.x or higher

### **2️⃣ Clone the Repository**

```bash
git clone https://github.com/Giftea/onMeme.git
cd onMeme
```

```bash
pnpm install
```

### **3️⃣ Start the Development Server**

```bash
pnpm start:dev
```

This will run the app on [http://localhost:3000](http://localhost:3000)✅.

### **4️⃣ Set Up Environment Variables**

Reach out on [Telegram (@gif_tea)](https://t.me/gif_tea) for the environment variables.
Or send an email at <eleojogiftuhiene@gmail.com>

### **5️⃣ Chopin Authentication**

Click the "Login" button to authenticate, you'll be redirected to a page requesting your email address.
<img width="471" alt="Screenshot 2025-02-28 at 11 28 42" src="https://github.com/user-attachments/assets/a7c18c93-b31e-4d30-bd20-5990466491fe" />

After submiting your email address, a 6-digit code will be sent to your email. Enter the code and click "Continue".

<img width="452" alt="Screenshot 2025-02-28 at 11 29 04" src="https://github.com/user-attachments/assets/9b89586d-0516-488a-8e04-db3fa163aa45" />

You're now authenticated and a wallet address has been generated for you.

---

## **📂 Project Structure**

```
onMeme
│── app/              # Next.js pages and components
│── components/       # Reusable UI components (ShadCN, Meme Editor and app components)
│── config/           # App configuration settings
│── hooks/            # Custom React hooks
│── lib/
│   ├── chopin/       # Chopin Framework integrations
│   ├── database/     # Drizzle ORM schemas, queries, and migrations
│   │   ├── migrations/
│   │   ├── dbQueries.ts
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   ├── schema.ts
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions (IPFS, metadata, trpc utils, canvas utils)
│── server/
│   ├── routes/        # tRPC API routes
│── public/           # Static assets
│── .env              # Environment variables
│── middleware.ts     # Chopin server side middleware
│── chopin.config.json  # Chopin Framework configuration
│── drizzle.config.ts   # Drizzle ORM configuration
│── package.json      # Dependencies and scripts
```

---

## **🔹 How onMeme Uses Chopin Framework**

### **1️⃣ Embedded Wallets for Seamless Authentication**

- onMeme uses **Chopin’s Multi-Party Computation (MPC) wallets**, allowing users to interact without setting up external wallets.
- Wallets are automatically generated, making **onboarding frictionless**.
- Authentication is handled using **Chopin’s signing service**, which signs transactions securely via API.

### **2️⃣ Secure NFT Transactions & Marketplace**

- onMeme utilizes **Chopin’s sequencer** to ensure **NFT mints, sales, and transfers are processed in order**.
- Chopin takes all requests made on onMeme and executes them sequentially on the backend. The requests are then serialized and added into blocks on **Celestia**
- The **`tokens` and `balances` tables** track user funds in **OMC tokens**.
- **Ownership transfers are automated** when an NFT is sold.

### **3️⃣ Preventing Double-Minting & Fraud**

- Chopin helps **prevent users from minting the same meme multiple times** by validating meme metadata on Celestia.
- **Smart sequencing** ensures that transactions do not execute out of order, preventing double-listing of NFTs.

### **4️⃣ AI-Powered Meme Generation with Oracles**

- onMeme integrates **AI-powered meme generation** using OpenAI’s API.
- **Chopin’s Oracle module** ensures AI-generated memes are **stored verifiably** on Celestia.
- Future plans include **oraclized meme challenges**, where AI-generated topics can be turned into meme trends.

### **5️⃣ Gamification & Leaderboard**

- The leaderboard system ranks users based on:
  - **NFTs sold**
  - **Memes minted**
  - **Likes received**
  - **OMC earnings**
- Chopin’s tracking ensures **real-time leaderboard updates**.

---

## **📌 Special Features Beyond the Original Concept**

✔ **AI Meme Generation** – Users can generate AI-powered meme images and captions.
✔ **Leaderboard System** – Users earn points for engagement, sales, and community interaction.
✔ **Preventing Self-Purchases** – Users cannot buy their own NFTs.
✔ **Instant Token Transfers** – OMC transfers happen **seamlessly on-chain**.
✔ **IPFS & Celestia Integration** – Meme metadata is stored in a **decentralized manner**.

---

## **📜 Future Plans**

- Implement **community-driven meme challenges** where users compete for top memes.
- Introduce **staking rewards for top creators** based on meme engagement.
- Expand AI meme generation to allow **users to train their own meme styles**.

---

## **💡 Troubleshooting**

If you encounter issues:

- **Database Errors**: Ensure `.env` is correctly set up and run `pnpm db:migrate`.
- **Chopin Wallet Issues**: Clear browser cache and restart the app.
- **IPFS Upload Failures**: Check `lib/utils/metadata.utils.ts` and verify API access.

---

📞 Contact

Reach out on [Telegram (@gif_tea)](https://t.me/gif_tea) for any questions.
Or send an email at <eleojogiftuhiene@gmail.com>

You can also reach out for environment variables to run th app properly locally. Thanks!

---

### **📌 Summary**

This README provides everything needed to **set up, run, and understand onMeme**, along with a breakdown of how **Chopin Framework** powers its blockchain features. If more documentation is required, additional details can be added.
