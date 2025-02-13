Tokens and Balances
You can simply store a token's balance in a table.

```
CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    decimals INTEGER NOT NULL,
    max_supply INTEGER NOT NULL
);
 
CREATE TABLE balances (
    address VARCHAR(42) NOT NULL REFERENCES users(address),
    token_id INTEGER NOT NULL REFERENCES tokens(id),
    balance INTEGER NOT NULL,
    PRIMARY KEY (address, token_id)
);```

Or you can extend the user table to include a `balance` column if there is only one type of token.

```
ALTER TABLE users ADD COLUMN balance INTEGER NOT NULL DEFAULT 0;
```

Now the logic for how we can create, mint, and transfer tokens can be easily implemented in your backend.

Token Creation
```
export async function createToken(name: string, symbol: string, decimals: number, max_supply: number) {
    await sql`INSERT INTO tokens (name, symbol, decimals, max_supply) VALUES (${name}, ${symbol}, ${decimals}, ${max_supply})`;
}```

We can then create helper functions to get the max supply and total circulating supply.

```
export async function getMaxSupply(token_id: number) {
    const result = await sql`SELECT max_supply FROM tokens WHERE id = ${token_id}`;
    return result[0].max_supply;
}
 
export async function getTotalCirculatingSupply(token_id: number) {
    const result = await sql`SELECT SUM(balance) FROM balances WHERE token_id = ${token_id}`;
    return result[0].sum;
}```

Token Operations
Checking Balances

```
export async function getBalance(address: string, token_id: number) {
    const result = await sql`SELECT balance FROM balances WHERE address = ${address} AND token_id = ${token_id}`;
    return result[0].balance;
}
```

Minting

```
export async function mint(address: string, amount: number, token_id: number) {
    const maxSupply = await getMaxSupply(token_id);
    const currentSupply = await getTotalCirculatingSupply(token_id);
    
    if (currentSupply + amount > maxSupply) {
        throw new Error('Minting would exceed max supply');
    }
 
    await sql`INSERT INTO balances (address, token_id, balance) 
        VALUES (${address}, ${token_id}, ${amount}) 
        ON CONFLICT (address, token_id) 
        DO UPDATE SET balance = balances.balance + ${amount}`;
}
```

Burning

```
export async function burn(address: string, amount: number, token_id: number) {
    const senderBalance = await getBalance(address, token_id);
    
    if (!senderBalance.length || senderBalance[0].balance < amount) {
        throw new Error('Insufficient balance');
    }
 
    await sql`UPDATE balances SET balance = balance - ${amount} WHERE address = ${address} AND token_id = ${token_id}`;
}
```

Transferring
```
export async function transfer(from: string, to: string, amount: number, token_id: number) {
    const senderBalance = await getBalance(from, token_id);
    
    if (!senderBalance.length || senderBalance[0].balance < amount) {
        throw new Error('Insufficient balance');
    }
 
    await sql`UPDATE balances SET balance = balance - ${amount} WHERE address = ${from} AND token_id = ${token_id}`;
    await sql`UPDATE balances SET balance = balance + ${amount} WHERE address = ${to} AND token_id = ${token_id}`;
}
```



