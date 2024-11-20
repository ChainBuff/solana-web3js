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
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// Local import wallet
// const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json")));
const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2.json")));
const fromWallet = Keypair.fromSecretKey(fromSecretKey);

async function main() {

    // Create transaction
    const transaction = new Transaction();

    // CU price
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5
    });
    transaction.add(computeUnitPriceInstruction);

    // CU limit
    // const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    //     units: 500,
    // });
    // transaction.add(computeUnitLimitInstruction);

    // Target address
    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

    // Add transfer instruction
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // // Add transfer instruction
    // const instruction2 = SystemProgram.transfer({
    //     fromPubkey: fromWallet.publicKey,
    //     toPubkey: toAddress,
    //     lamports: 1000, // 1000 lamports
    // });
    // transaction.add(instruction2);

    // Simulate transaction
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("Simulation result: ", simulateResult);

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
}

main();