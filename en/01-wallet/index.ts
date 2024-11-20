import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { Buffer } from 'buffer';

// Create a wallet
const wallet = Keypair.generate();

// Get the public key and secret key
const publicKey = wallet.publicKey.toBase58();
const secretKey = wallet.secretKey; // A Uint8Array

// Print keys
console.log("Wallet Public Key:", publicKey);
console.log("Wallet Secret Key:", secretKey);
console.log("Wallet Secret Key (base64):", Buffer.from(secretKey).toString("base64"));

// Save the Uint8Array secret key
fs.writeFileSync("wallet.json", JSON.stringify(Array.from(secretKey)));

// Import the wallet
// const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
// const wallet = Keypair.fromSecretKey(secretKey);

// console.log("Wallet Public Key:", wallet.publicKey.toString());
// console.log("Wallet Secret Key:", wallet.secretKey);
// console.log("Wallet Secret Key (base64):", Buffer.from(secretKey).toString("base64"));
