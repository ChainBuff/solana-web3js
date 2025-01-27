# Sending Your First Transfer Transaction

> Sending a transaction is the only way to change the on-chain state.

This section will introduce how to create and send your first transfer transaction.

## Creating an RPC Connection and Importing a Wallet

First, as we learned earlier, we need to create an RPC connection and import our wallet private key.

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import fs from "fs";

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// Import wallet locally
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);
```

## Creating, Simulating, and Sending a Transfer Transaction

Next, we will create a transaction and add a transfer instruction to `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ`. After that, we can first simulate whether the transaction will succeed. If the simulation is successful, we will actually send the transaction.

> Note:
> `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` is the public fund account of the Buff community and can be replaced with any other account.

```ts
async function main() {

    // Create transaction
    const transaction = new Transaction();

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Add transfer instruction
    const instruction = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction);
    
    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Transaction sent, https://solscan.io/tx/${signature}`);
}

main();
```

After running the script with `npx esrun 03-transfer/index.ts`, the output should be as follows:

```bash
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 300547622 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 150
  }
}
Transaction sent: https://solscan.io/tx/3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC
```

Through this transaction, we successfully transferred 1000 lamports to `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ`, and you can view this transaction on the blockchain explorer [here](https://solscan.io/tx/3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC).