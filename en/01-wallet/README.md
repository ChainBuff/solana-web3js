# Create Wallet & Import Wallet

> The private key is the only credential for the account; please keep it safe.

This section will introduce how to create your own wallet using the web3.js library.

## Create Wallet

A Solana wallet refers to a pair of `private key` and `public key`, which are the credentials used to access and manage accounts on Solana. The key pair is generated through random numbers to ensure that each key pair is unique.

- Private Key: A confidential key used to prove account ownership. The private key can be used to generate digital signatures and authorize transactions. If the private key is leaked, others can use it to control your account.
- Public Key: The public part paired with the private key. The public key is your account address, and others can send assets to you or query your account balance through the public key, but they cannot use it to authorize operations.

```ts
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { Buffer } from 'buffer';

// Create wallet
const wallet = Keypair.generate();

// Get public key and private key
const publicKey = wallet.publicKey.toBase58();
const secretKey = wallet.secretKey; // A Uint8Array

// Print
console.log("Wallet Public Key:", publicKey);
console.log("Wallet Private Key:", secretKey);
console.log("Wallet Private Key (base64):", Buffer.from(secretKey).toString("base64"));

// Save Uint8Array private key
fs.writeFileSync("wallet.json", JSON.stringify(Array.from(secretKey)));
```

Run with `npx esrun 01-wallet/index.ts`, the output is as follows:

```bash
Wallet Public Key: EkfAVHeFtDUmGQJH5e67i784wKKNA7jyStKywQWysY73
Wallet Private Key: Uint8Array(64) [
  180, 206,  18, 236, 242, 179, 168, 142, 181,  66,
  158, 123, 232, 162, 205, 195, 192,  56, 117, 152,
  238,  67, 141, 162, 250,  60, 104, 153,  79,  96,
   49, 234, 204,  87,  14, 120, 218,  77, 112, 188,
  235, 139,   1, 134, 201, 208, 112,  25,   2, 151,
  227, 188,  25,  69, 178, 196, 146, 227, 179,  14,
  118, 115, 233, 234
]
Wallet Private Key (base64): tM4S7PKzqI61Qp576KLNw8A4dZjuQ42i+jxomU9gMerMVw542k1wvOuLAYbJ0HAZApfjvBlFssSS47MOdnPp6g==
```

The private key is saved in the `wallet.json` file in the root directory of this project. The public key is 32 bytes long, usually encoded in Base58; the private key is 64 bytes long, usually encoded in Base64.

## Import Wallet

Import the private key from the newly saved `wallet.json` file to restore the wallet.

```ts
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const wallet = Keypair.fromSecretKey(secretKey);

console.log("Wallet Public Key:", wallet.publicKey.toString());
console.log("Wallet Private Key:", wallet.secretKey);
console.log("Wallet Private Key (base64):", Buffer.from(secretKey).toString("base64"));
```

The output after running should be consistent with the previous output.


