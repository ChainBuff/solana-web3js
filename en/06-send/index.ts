import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from "fs";

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// Import wallet locally
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);

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
    // const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    // console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

    // Send transaction
    // 1. sendAndConfirmTransaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet], { 
        skipPreflight: false 
    });
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);

    // const { blockhash } = await connection.getLatestBlockhash();
    // transaction.recentBlockhash = blockhash;
    // transaction.feePayer = fromWallet.publicKey;
    // transaction.sign(fromWallet);
    // const rawTransaction = transaction.serialize();

    // 2. sendRawTransaction
    // const signature = await connection.sendRawTransaction(rawTransaction, { 
    //     skipPreflight: false 
    // })
    // console.log("Transaction signature:", signature)
    
    // 3. sendEncodedTransaction
    // const base64Transaction = rawTransaction.toString('base64');
    // const signature = await connection.sendEncodedTransaction(base64Transaction, { 
    //     skipPreflight: false 
    // });
    // console.log("Transaction signature:", signature)
    
}

main();