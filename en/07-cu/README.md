# Adding Priority Fees

Priority fees are additional fees paid on top of the base transaction fee (5000 Lamports). By adding a priority fee to a transaction, you can increase the priority of the transaction being processed when block space is limited.

The minimum component for calculating transaction fees on Solana is `Compute Units (CU)`, which measures the computational resources consumed by a transaction.

The calculation method for priority fees is `Number of CUs * Price per CU`, where the price is in `microLamports`.

> 1 Lamport = 10^6 microLamports

Therefore, the priority fee for a transaction should be divided into two parts: `Number of CUs` and `CU Price`. We can customize our transaction's priority fees through the Compute Budget program instructions.

## Compute Budget Program Instructions

This section will explain two methods for setting priority fees: `setComputeUnitPrice` and `setComputeUnitLimit`.

First, create an RPC connection and import our wallet:

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    ComputeBudgetProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import fs from "fs";

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

### setComputeUnitPrice

By default, the allocation of transaction CU numbers is `200000 * Number of Instructions`.

> Note that Compute Budget program instructions are not counted in the number of instructions here.

By setting the price per CU to 5 microLamports using `setComputeUnitPrice`, we can see that [this transaction, which contains only one transfer instruction](https://solscan.io/tx/34eohoyTp2oZ1jtFNtcEUp9oe2QfRf5HRarexCbKnUm93ga3sGjP8Aduwd8xcbRrZk9HNdRJ9rqWZ8peGhruPfuK), has a priority fee of 0.000000001 SOL, i.e., `200000 * 1 * 5 = 1 Lamport`.

```ts
async function main() {

    // Create transaction
    const transaction = new Transaction();

    // CU price
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5
    });
    transaction.add(computeUnitPriceInstruction);

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Add transfer instruction
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

main();
```

When running with `npx esrun 07-cu/index.ts`, the output should be as follows:

```
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301579053 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 300
  }
}
Transaction sent: https://solscan.io/tx/34eohoyTp2oZ1jtFNtcEUp9oe2QfRf5HRarexCbKnUm93ga3sGjP8Aduwd8xcbRrZk9HNdRJ9rqWZ8peGhruPfuK
```

Here are a few other transaction examples:

- Price per CU is 1 microLamports, 1 transfer instruction. Due to being less than 1 Lamport, it is processed as 1 Lamport: [Priority fee is 1 Lamport](https://solscan.io/tx/5WxZ9uST4Raz3fyCJyodLcx3Ruyy2JYPvJa7kD28ehn9VquPkV6jm6pzAGFGt8c1fYF7yhFpptTTJCX6PYsJr8i9)
- Price per CU is 25 microLamports, 1 transfer instruction: [Priority fee is 5 Lamports](https://solscan.io/tx/EWgoUVMGLNEzAoGiY79NWzhzFHFk8bw5ivGXBE82afsCL5E3o71jvVQKFPS3f1NvggdMQGc6naWHLphFS2oqaYX)
- Price per CU is 5 microLamports, 2 transfer instructions: [Priority fee is 2 Lamports](https://solscan.io/tx/4SbD6b1aFG4fXErzFcGzx6xr3RXFVB66Xm2yXwe2PP4qsmzRQKfzeibeJuWPtrEccnsky2MW9wm3UtjrRfJL1YsE)

### setComputeUnitLimit

In fact, the computational resource consumption of a simple transfer instruction is only 150 CUs, while the default CU allocation per instruction is 200000, which often leads to additional priority fee expenditures.

Therefore, we can determine the CU limit for our transaction using `setComputeUnitLimit`.

> The maximum CU allocation for each transaction is `1400000`.

Since a priority fee of less than 1 Lamport will be processed as 1 Lamport, for estimation, we take the CU limit as 500 (the actual cost for 3 instructions is 450). If we set the CU price to 4000 microLamports, the priority fee should be 2 Lamports, [see this transaction here](https://solscan.io/tx/41APCjw2ifHkqV3Ha7S7Q1LADb9S396acsCqErdk6Tp3xcCMLge1FueRnj4dfTSbhgeA9DBvfPNRJxoZuYEqCQUS).

```ts
async function main() {

    // Create transaction
    const transaction = new Transaction();

    // CU price
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 4000
    });
    transaction.add(computeUnitPriceInstruction);

    // CU limit
    const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 500,
    });
    transaction.add(computeUnitLimitInstruction);

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Add transfer instruction
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

main();
```

When running again, the output should be as follows:

```
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301580071 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 450
  }
}
Transaction sent: https://solscan.io/tx/41APCjw2ifHkqV3Ha7S7Q1LADb9S396acsCqErdk6Tp3xcCMLge1FueRnj4dfTSbhgeA9DBvfPNRJxoZuYEqCQUS
```

---

## Summary

By using the `setComputeUnitPrice` and `setComputeUnitLimit` instructions, we can flexibly define our own priority fees in practical applications. Generally, it is necessary to estimate the CU consumption of your transactions and fix this value to dynamically adjust the CU price parameters, ensuring that your transaction's priority fee changes with the network's priority fee levels.