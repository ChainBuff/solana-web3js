import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

async function main() {

    const poolAccountPublicKey = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
    const accountInfo = await connection.getAccountInfo(poolAccountPublicKey);
    const dataBuffer = accountInfo?.data;
    if (!dataBuffer) {
        throw new Error("Account data not found");
    }
    console.log(dataBuffer)

    const offset = 253
    const sqrtPriceX64Buffer = dataBuffer.slice(offset, offset + 16); // Read 16 bytes
    const sqrtPriceX64Value = new BN(sqrtPriceX64Buffer, 'le'); // Create BN instance using little-endian byte order
    console.log(`sqrtPriceX64Value at offset ${offset}:`, sqrtPriceX64Value.toString());

    // Calculate price
    const sqrtPriceX64BigInt = BigInt(sqrtPriceX64Value.toString());
    const sqrtPriceX64Float = Number(sqrtPriceX64BigInt) / (2 ** 64);
    const price = sqrtPriceX64Float ** 2 * 1e9 / 1e6;
    console.log(`WSOL price:`,  price.toString())
}

main();