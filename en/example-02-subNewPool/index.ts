import {
    Connection,
    PublicKey
} from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");
const raydiumV4PublicKey = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');

connection.onLogs(
    raydiumV4PublicKey,
    ({ logs, err, signature }) => {
        if (err) return;

        if (logs && logs.some(log => log.includes("initialize2"))) {
            console.log(`New liquidity pool created: https://solscan.io/tx/${signature}`);
        }
    },
    "confirmed"
);