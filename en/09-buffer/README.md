# Buffer Parsing

Buffer parsing essentially involves interpreting the raw binary data stored on-chain.

In general, we often do not know the structure of each segment of binary data, and we usually only need a specific field from this binary data. Therefore, this section will introduce a manual method for parsing on-chain binary data, using the example of obtaining the WSOL price from the Raydium CLMM WSOL/USDC liquidity pool, with the address `8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj`.

> Obtaining the liquidity pool price is commonly used in arbitrage and liquidity mining scenarios.

## Parsing the USDC Relative Price of WSOL in the WSOL/USDC Liquidity Pool

In the Raydium CLMM protocol liquidity pool, the token price is explicitly stored in the account data of the liquidity pool account address, as shown below:

![](../../img/09-01.png)

Here, we assume that we do not know the structure of the stored data and will use a manual parsing method to obtain this price.

The data type of `sqrtPriceX64` is `u128`, occupying 16 bytes. Therefore, we only need to obtain the starting offset of `sqrtPriceX64` and read 16 bytes for parsing.

The lengths of other data types are marked in the image, where `u8` is 1, `pubkey` is 32, and `u16` is 2.

> Note: In Solana's account data, the initial 8 bytes are used for the prefix identifier (discriminator).

Thus, the starting offset of `sqrtPriceX64` should be $8 + 1 + 32*7 + 1 + 1 + 2 + 16 = 253$

![](../../img/09-02.png)

```ts
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// Create RPC connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

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
    console.log(`WSOL Price:`,  price.toString())
}

main();
```

Running with `npx esrun 09-buffer/index.ts` should output as follows:

```
<Buffer f7 ed e3 f5 d7 c3 de 46 fb 81 6e 66 63 0c 3b b7 24 dc 59 e4 9f 6c c4 30 6e 60 3a 6a ac ca 06 fa 3e 34 e2 b4 0a d5 97 9d 8d 58 3a 6b bb 1c 51 0e f4 3f ... 1494 more bytes>
sqrtPriceX64Value at offset 253: 8622437757683733036
WSOL Price: 218.4845296506469