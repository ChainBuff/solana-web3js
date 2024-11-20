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
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// Local wallet import
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const payer = Keypair.fromSecretKey(secretKey);

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

    console.log("lookup table address:", lookupTableAddress.toBase58());

    // Create v0 message
    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash, // Recent block hash
        instructions: [lookupTableInstruction], // Instruction array
    }).compileToV0Message();

    // Create v0 transaction and sign
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

async function addAddresses() {

    const lookupTableAddress = new PublicKey('2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5')

    // Add accounts to ALT
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

    // Create v0 transaction and sign
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

}

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

    // Create v0 transaction and sign
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await connection.sendTransaction(transaction);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

}

async function parseTx() {

    const parsedTransaction1 = await connection.getParsedTransaction('4LwygRtiF9ZCrbGKoh8MEzmxowaRHPaDc1nsinkv72uXU2cUCuZ8YskBBgsvbBEMZ5Pqpf6C6WcXtCkqAuLZand1', {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
    });
    console.log(`Parsed v0 transaction: ${JSON.stringify(parsedTransaction1)}\n`);

}

// Create ALT
// createALT();

// Add accounts to ALT
// addAddresses();

// Transfer using ALT
// transfer();

// Get parsed v0 transaction
parseTx();