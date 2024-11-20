import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    // Query the SOL balance of Jito1
    const publicKey = new PublicKey('CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1');
    const balance = await connection.getBalance(publicKey);
    console.log(`Jito1 balance: ${balance / LAMPORTS_PER_SOL} SOL`); // Convert to SOL unit
}

main();