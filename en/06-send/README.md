# Writing On-Chain Data: `send` Sending Transactions

This section will guide you through several common methods for sending transactions, which are functionally similar: `sendAndConfirmTransaction`, `sendRawTransaction`, and `sendEncodedTransaction`.

## 1. sendAndConfirmTransaction

Sends a transaction and waits for its confirmation, with an automatic confirmation mechanism. Suitable for scenarios where you want to simplify transaction confirmation.

```ts
const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet], { 
        skipPreflight: false 
    });
console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
```

After running with `npx esrun 06-send/index.ts`, you can view the simulated transaction results and whether the transaction was sent successfully.

```
Simulated transaction result:  {
  context: { apiVersion: '2.0.3', slot: 300771879 },
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
Transaction sent: https://solscan.io/tx/4W4QvBfAzezyxatAbE53awibDytLkZmcagnBihz8QSaqhMTJFN5AoQjfxggm7PGQgYmTvTHWhmDSsi4JEn4wCFwX
```

## 2. sendRawTransaction

Sends a signed and serialized transaction.

```ts
const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = fromWallet.publicKey;
transaction.sign(fromWallet);
const rawTransaction = transaction.serialize();

const signature = await connection.sendRawTransaction(rawTransaction, { 
    skipPreflight: false 
});
console.log("Transaction signature:", signature);
```

```
Transaction signature: 3CuP3PpSMMknoB88kWEzAC6dxTAYx1x5oo9KjFSzaCydZRcSdpogBdLLJbKEVHp8nmPfyxB3UhUQtnM6YNFNsA6A
```

## 3. sendEncodedTransaction

Sends base64 encoded transaction data, which has better compatibility.

```ts
const base64Transaction = rawTransaction.toString('base64');
const signature = await connection.sendEncodedTransaction(base64Transaction, { 
    skipPreflight: false 
});
console.log("Transaction signature:", signature);
```

```
Transaction signature: 4NnavZedvvx5s7KTYnuVcvbZiV4dsUDUswJBe11E7FV2txcCYM8ypjbDmvHzWFvqKf9t3RZLkEo7Ek2HxoDyCcV8
```

> Note: If you set skipPreflight to true, it means you will skip the simulation process before sending the transaction, which can speed up submission but may also lead to transaction failure, resulting in the loss of transaction fees.