import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    // 1. getSlot
    const slot = await connection.getSlot();
    console.log(`Current slot: ${slot}\n`);

    // 2. getBalance
    // const balance = await connection.getBalance(new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1"));
    // console.log(`J1to1 balance: ${balance / LAMPORTS_PER_SOL} SOL\n`);

    // 3. getTokenAccountBalance
    // const tokenAccountBalance = await connection.getTokenAccountBalance(new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"));
    // console.log(`Token account balance: ${JSON.stringify(tokenAccountBalance)}\n`);

    // 4. getFirstAvailableBlock
    // const firstAvailableBlock = await connection.getFirstAvailableBlock();
    // console.log(`First available block: ${firstAvailableBlock}\n`);

    // 5. getLatestBlockhash
    // const latestBlockhash = await connection.getLatestBlockhash();
    // console.log(`Latest blockhash: ${latestBlockhash.blockhash}\n`);

    // 6. getParsedAccountInfo
    // const parsedAccountInfo = await connection.getParsedAccountInfo(new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'), "confirmed");
    // console.log("Parsed account info:", parsedAccountInfo)

    // 7. getParsedTransaction
    // const parsedTransaction = await connection.getParsedTransaction('3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC', {
    //     commitment: "confirmed",
    //     maxSupportedTransactionVersion: 0
    // });
    // console.log(`Parsed transaction: ${JSON.stringify(parsedTransaction)}\n`);

    // 8. getSignaturesForAddress
    // const signatures = await connection.getSignaturesForAddress(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
    //     limit: 3
    // });
    // console.log(`Recent 3 transaction signatures: ${JSON.stringify(signatures)}\n`);

    // 9. getTokenAccountsByOwner
    // const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
    //     mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
    // }, "confirmed");
    // console.log(`Token accounts: ${JSON.stringify(tokenAccountsByOwner)}\n`);

    // 10. getTokenLargestAccounts
    // const tokenLargestAccounts = await connection.getTokenLargestAccounts(new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump"));
    // console.log(`20 largest token holder accounts: ${JSON.stringify(tokenLargestAccounts)}\n`);

    // 11. getTokenSupply
    // const supplyInfo = await connection.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
    // console.log(`Total supply: ${supplyInfo.value.amount}\n`);

    // 12. getParsedProgramAccounts
    // const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
    // const accounts = await connection.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
    //     filters: [
    //         {
    //             dataSize: 165, // The data size of a Token account is 165 bytes
    //         },
    //         {
    //             memcmp: {
    //                 offset: 0, // Offset 0 indicates the position of the Token Mint address
    //                 bytes: mintAddress.toBase58(),
    //             },
    //         },
    //     ],
    // });
    // console.log("First 3 accounts:", accounts.slice(0, 3))

}

main();