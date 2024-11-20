# `v0` Transactions

Versioned Transactions, also known as `v0` transactions, are a new type of transaction introduced during the Solana update process. Due to the limitations on the number of accounts in traditional (legacy) transactions, `v0` transactions introduce the Address Lookup Tables feature to compress the number of accounts, increasing the limit from 35 to 64 accounts.

> `v0` transactions are widely used in on-chain arbitrage scenarios.

This section will explain how to create `v0` transactions and how to use Address Lookup Tables.

## Creating `v0` Transactions

Here is an example of creating a `v0` transaction.

> Unless otherwise specified, it is recommended that all transactions use the `v0` type.

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    TransactionMessage,
    VersionedTransaction,
    SystemProgram,
} from '@solana/web3.js';
import fs from "fs";

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// Import wallet locally
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);
```

```ts
async function main() {

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Transfer instruction
    const instruction = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });

    // Create v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: fromWallet.publicKey,
        recentBlockhash: blockhash, // Recent block hash
        instructions: [instruction], // Instruction array
    }).compileToV0Message();

    // Create and sign v0 transaction
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([fromWallet]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

main();
```

By running `npx esrun 08-v0/index.ts`, the output is as follows:

```
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301586586 },
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
Transaction sent: https://solscan.io/tx/5BLjkVYjkLHa7rz7616r6Nx4fbMYe4Y3mBj6ucihrB7hXmjfe59V16MHfPsVYhECZs8qBU6n39kzxLQgm89pQ8k1
```

You can [view this transaction](https://solscan.io/tx/5BLjkVYjkLHa7rz7616r6Nx4fbMYe4Y3mBj6ucihrB7hXmjfe59V16MHfPsVYhECZs8qBU6n39kzxLQgm89pQ8k1) version in the blockchain explorer.

![](../../img/08-01.png)

## Address Lookup Tables

By interacting with the `AddressLookupTableProgram`, you can create your own address lookup table and introduce your lookup table into transactions.

### Creating an ALT

```ts
import {
    Connection,
    PublicKey,
    Keypair,
    TransactionMessage,
    VersionedTransaction,
    SystemProgram,
    AddressLookupTableProgram
} from '@solana/web3.js';
import fs from "fs";

// Create RPC connection
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");
const connection = new Connection("https://chrissy-w0sbco-fast-mainnet.helius-rpc.com", "confirmed");

// Import wallet locally
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const payer = Keypair.fromSecretKey(secretKey);
```

```ts
async function createALT() {

    // Get current slot
    const slot = await connection.getSlot("confirmed");

    // Create ALT
    const [lookupTableInstruction, lookupTableAddress] =
        AddressLookupTableProgram.createLookupTable({
            authority: payer.publicKey,
            payer: payer.publicKey,
            recentSlot: slot,
        });

    console.log("Lookup table address:", lookupTableAddress.toBase58());

    // Create v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // Recent block hash
        instructions: [lookupTableInstruction], // Instruction array
    }).compileToV0Message();

    // Create and sign v0 transaction
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

// Create ALT
createALT();
```

By running `npx esrun 08-v0/alt.ts`, the output is as follows:

```
ALT account address 2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301694685 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program AddressLookupTab1e1111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program AddressLookupTab1e1111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 1200
  }
}
Transaction sent: https://solscan.io/tx/5jeF2fY2B83ETueuzcdF5bjXpB949gW9FxMEietnpCDgW7LFgsKFxcnLDYxcE1RDBKcPjMYw3sJQLKv2TxjPajCT
```

Thus, we have created our own address lookup table with the address `2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5`.

### Adding Account Addresses to ALT

```ts
async function addAddresses() {

    const lookupTableAddress = new PublicKey('2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5')

    // Add account to ALT
    const extendInstruction = AddressLookupTableProgram.extendLookupTable({
        lookupTable: lookupTableAddress,
        payer: payer.publicKey,
        authority: payer.publicKey,
        addresses: [
            payer.publicKey,
            new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ'),
            SystemProgram.programId, // 
        ],
    });

    // Create v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // Recent block hash
        instructions: [extendInstruction], // Instruction array
    }).compileToV0Message();

    // Create and sign v0 transaction
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

}

addAddresses()
```

```
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301695975 },
  value: {
    accounts: null,
    err: null,
    innerInstructions: null,
    logs: [
      'Program AddressLookupTab1e1111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program AddressLookupTab1e1111111111111111111111111 success'
    ],
    replacementBlockhash: null,
    returnData: null,
    unitsConsumed: 900
  }
}
Transaction sent: https://solscan.io/tx/ZRM6NDdtFkH4dRxBNe3r4mEg8yNF87UCs8UE2vycec1Y88XcDHWVbU6Wa7den3a9o6EwzdVFQr6PvW2i19Qv5FF
```

You can view the recently added account addresses in our address lookup table account.

![](../../img/08-02.png)

### Using ALT in `v0` Transactions

```ts
async function transfer() {

    const lookupTableAddress = new PublicKey('2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5')

    // Get ALT
    const ALT = await connection.getAddressLookupTable(lookupTableAddress);
    const lookupTableAccount = ALT.value;
    if (!ALT.value) {
        throw new Error("lookupTableAccount does not exist");
    }
    console.log('lookupTableAccount:', lookupTableAccount)

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Transfer instruction
    const instruction = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });

    // Create v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // Recent block hash
        instructions: [instruction], // Instruction array
    }).compileToV0Message([lookupTableAccount]);

    // Create and sign v0 transaction
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

}

transfer()
```

```
lookupTableAccount: AddressLookupTableAccount {
  key: PublicKey [PublicKey(2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5)] {
    _bn: <BN: 1b5e70e8025f0bc9539e0207d27bf9a2290024800ca551cbf773ecf4fef1f9a8>
  },
  state: {
    deactivationSlot: 18446744073709551615n,
    lastExtendedSlot: 301695984,
    lastExtendedSlotStartIndex: 0,
    authority: PublicKey [PublicKey(web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2)] {
      _bn: <BN: dffdd111813c7234e959650ea4bd1e36e29649a6c25679ee6cdca1f2f317489>
    },
    addresses: [
      [PublicKey [PublicKey(web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2)]],
      [PublicKey [PublicKey(buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ)]],
      [PublicKey [PublicKey(11111111111111111111111111111111)]]
    ]
  }
}
Simulation result:  {
  context: { apiVersion: '2.0.3', slot: 301701358 },
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
Transaction sent: https://solscan.io/tx/4LwygRtiF9ZCrbGKoh8MEzmxowaRHPaDc1nsinkv72uXU2cUCuZ8YskBBgsvbBEMZ5Pqpf6C6WcXtCkqAuLZand1
```

![](../../img/08-03.png)

Call `getParsedTransaction` to retrieve this `v0` transaction as follows:

```ts
async function parseTx() {

    const parsedTransaction = await connection.getParsedTransaction('4LwygRtiF9ZCrbGKoh8MEzmxowaRHPaDc1nsinkv72uXU2cUCuZ8YskBBgsvbBEMZ5Pqpf6C6WcXtCkqAuLZand1', {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
    });
    console.log(`Parsed v0 transaction: ${JSON.stringify(parsedTransaction)}\n`);

}

parseTx()
```

```
Parsed v0 transaction: {"blockTime":1731742689,"meta":{"computeUnitsConsumed":150,"err":null,"fee":5000,"innerInstructions":[],"logMessages":["Program 11111111111111111111111111111111 invoke [1]","Program 11111111111111111111111111111111 success"],"postBalances":[5770640,1,2018400],"postTokenBalances":[],"preBalances":[5776640,1,2017400],"preTokenBalances":[],"rewards":[],"status":{"Ok":null}},"slot":301701368,"transaction":{"message":{"accountKeys":[{"pubkey":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2","signer":true,"source":"transaction","writable":true},{"pubkey":"11111111111111111111111111111111","signer":false,"source":"transaction","writable":false},{"pubkey":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","signer":false,"source":"lookupTable","writable":true}],"addressTableLookups":[{"accountKey":"2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5","readonlyIndexes":[],"writableIndexes":[1]}],"instructions":[{"parsed":{"info":{"destination":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","lamports":1000,"source":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"},"type":"transfer"},"program":"system","programId":"11111111111111111111111111111111","stackHeight":null}],"recentBlockhash":"DcQMezPzouNnbrHufbhrpjFftMxVpDKX4vwCGc2NQHKZ"},"signatures":["4LwygRtiF9ZCrbGKoh8MEzmxowaRHPaDc1nsinkv72uXU2cUCuZ8YskBBgsvbBEMZ5Pqpf6C6WcXtCkqAuLZand1"]},"version":0}
```
