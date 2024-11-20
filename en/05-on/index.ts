import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    // 1. onAccountChange
    // connection.onAccountChange(new PublicKey("orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8"), (accountInfo) => {
    //     console.log(`Account change: ${JSON.stringify(accountInfo)}\n`);
    // });

    // 2. onLogs
    connection.onLogs(new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"), (logs) => {
        console.log(`Logs: ${JSON.stringify(logs)}\n`);
    });

}

main();