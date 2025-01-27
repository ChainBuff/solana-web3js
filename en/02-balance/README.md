# Get SOL Balance of an Account

> The RPC port is the medium for interacting with the Solana blockchain.

This section will introduce how to create an RPC connection using the `Connection` class and use the `getBalance` method to retrieve the SOL balance of an account.

## Creating an RPC Connection

The `Connection` class is the core class for interacting with the Solana blockchain, providing various methods to communicate with the blockchain. An instance of `Connection` can be created by providing the RPC port and confirmation level, as shown below:

```ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

`https://api.mainnet-beta.solana.com` is the official RPC port provided by Solana, and `confirmed` is the default confirmation level.

> Note:
> `processed` is a lower confirmation level, meaning the queried data is verified but not fully confirmed. `confirmed` indicates that the node has written the transaction to the blockchain, but it may not be finally confirmed. If a higher confirmation level is needed, `finalized` can be used.

## Querying Account Balance

The `getBalance` method is used to query the SOL balance of a specified account, returning the balance in lamports, which needs to be divided by `LAMPORTS_PER_SOL` to convert to SOL units.

> Note:
> `LAMPORTS_PER_SOL` is the number of lamports in 1 SOL, equal to 10^9.

Here, we will query the SOL balance of Jito1, whose public key is `CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1`.

```ts
async function main() {

    // Query Jito1's SOL balance
    const publicKey = new PublicKey('CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1');
    const balance = await connection.getBalance(publicKey);
    console.log(`Jito1 balance: ${balance / LAMPORTS_PER_SOL} SOL`); // Convert to SOL units
}

main();
```

By running the above code with `npx esrun 02-balance/index.ts`, you can see that Jito1's current SOL balance is 9.999906999 SOL.

```
Jito1 balance: 9.999906999 SOL
```