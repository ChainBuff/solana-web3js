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
// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// Local wallet import
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);

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

    // Create v0 transaction and sign
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