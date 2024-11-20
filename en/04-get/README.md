# Reading On-Chain Data (Part 1): `get` Read

This section will introduce you to some commonly used methods for reading on-chain data and their use cases.

These methods belong to the `Connection` class and are for single on-chain data reads, with method names starting with `get`.

Before using these methods, you need to create an RPC connection.

```ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

## 1. getSlot

Get the current slot.

```ts
const slot = await connection.getSlot();
console.log(`Current slot: ${slot}\n`);
```

```
Current slot: 300579039
```

## 2. getBalance

Get the SOL balance of a specified account.

```ts
// Query the SOL balance of Jito1
const balance = await connection.getBalance(new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1"));
console.log(`J1to1 balance: ${balance / LAMPORTS_PER_SOL} SOL\n`);
```

```
J1to1 balance: 12.172897148 SOL
```

## 3. getTokenAccountBalance

Query the balance of a specified token account.

> Solana assigns a token account to each token holder, and each account needs to pay 0.002 SOL in rent. When you no longer need this token account, you can choose to close it and reclaim the rent.

```ts
// Get the USDC balance of the account web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2
// https://solscan.io/account/HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT
const tokenAccountBalance = await connection.getTokenAccountBalance(new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"));
console.log(`Token account balance: ${JSON.stringify(tokenAccountBalance)}\n`);
```

```
Token account balance: {"context":{"apiVersion":"2.0.3","slot":300580444},"value":{"amount":"2000000","decimals":6,"uiAmount":2,"uiAmountString":"2"}}
```

## 4. getFirstAvailableBlock 

Get the earliest block number accessible by the current RPC node.

> Due to the large amount of data on Solana, general RPC nodes cannot store all block data and can only keep a small snapshot locally. Therefore, if you want to analyze historical transactions in blocks, purchasing a large RPC service provider's node is a good choice.

```ts
const firstAvailableBlock = await connection.getFirstAvailableBlock();
console.log(`First available block: ${firstAvailableBlock}\n`);
```

```
First available block: 300439300
```

## 5. getLatestBlockhash

Get the latest block hash.

> This is often called when sending transactions.

```ts
const latestBlockhash = await connection.getLatestBlockhash();
console.log(`Latest block hash: ${latestBlockhash.blockhash}\n`);
```

```
Latest block hash: Hik7iYgKiALmPXp8HTAqok3kDQuSYWCaPLNa7rLNeu6v
```

## 6. getParsedAccountInfo

Get detailed information about a parsed account.

> This is very useful when obtaining information about on-chain liquidity pools.

`getMultipleParsedAccounts` can query multiple account information at once.

```ts
// Get the account information of the raydium clmm WSOL/USDC liquidity pool
const accountInfo = await connection.getAccountInfo(new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'), "confirmed");
console.log("Account information:", accountInfo)
```

```
{
  data: <Buffer f7 ed e3 f5 d7 c3 de 46 fb 81 6e 66 63 0c 3b b7 24 dc 59 e4 9f 6c c4 30 6e 60 3a 6a ac ca 06 fa 3e 34 e2 b4 0a d5 97 9d 8d 58 3a 6b bb 1c 51 0e f4 3f ... 1494 more bytes>,
  executable: false,
  lamports: 865597210,
  owner: PublicKey [PublicKey(CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK)] {
    _bn: <BN: a5d5ca9e04cf5db590b714ba2fe32cb159133fc1c192b72257fd07d39cb0401e>
  },
  rentEpoch: 18446744073709552000,
  space: 1544
}
```

## 7. getParsedTransaction

Get detailed information about a parsed transaction.

`getParsedTransactions` can query multiple transactions at once.

> This is very useful in scenarios where transaction parsing is needed.

```ts
// Parse a SOL transfer transaction
const parsedTransaction = await connection.getParsedTransaction('3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC', {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
});
console.log(`Parsed transaction: ${JSON.stringify(parsedTransaction)}\n`);
```

```
Parsed transaction: {"blockTime":1731232782,"meta":{"computeUnitsConsumed":150,"err":null,"fee":5000,"innerInstructions":[],"logMessages":["Program 11111111111111111111111111111111 invoke [1]","Program 11111111111111111111111111111111 success"],"postBalances":[7826454,1993200,1],"postTokenBalances":[],"preBalances":[7832454,1992200,1],"preTokenBalances":[],"rewards":[],"status":{"Ok":null}},"slot":300547625,"transaction":{"message":{"accountKeys":[{"pubkey":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2","signer":true,"source":"transaction","writable":true},{"pubkey":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","signer":false,"source":"transaction","writable":true},{"pubkey":"11111111111111111111111111111111","signer":false,"source":"transaction","writable":false}],"instructions":[{"parsed":{"info":{"destination":"buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ","lamports":1000,"source":"web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"},"type":"transfer"},"program":"system","programId":"11111111111111111111111111111111","stackHeight":null}],"recentBlockhash":"7F3ptA9dwyosGYK2RMZneutNEfc6PruonnZcqVH35wyG"},"signatures":["3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC"]},"version":"legacy"}
```

## 8. getSignaturesForAddress

Get a list of transaction signatures related to a specified account address.

> This is very useful when monitoring an account.

```ts
// Get the latest 3 transaction signatures for the account web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2
const signatures = await connection.getSignaturesForAddress(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
        limit: 3
    });
console.log(`Latest 3 transaction signatures: ${JSON.stringify(signatures)}\n`);
```

```
Latest 3 transaction signatures: [{"blockTime":1731241155,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"5sFePYo4zAX2uiGmt1LmDBfoYDxXGhiix1of8K3DPD3Kua4fGStbMtKWvyUc1u1fdtrVS8DM51pgA9Us9GsaDRjm","slot":300566648},{"blockTime":1731232782,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC","slot":300547625},{"blockTime":1731232657,"confirmationStatus":"finalized","err":null,"memo":null,"signature":"4aZJwh2srekTB3w7VzF91rNv7oB1ZPMGwds1ohnivejHMUdSw7Eacp5kLkcChJuU2MmjewrusVNbHa2aCpjwTy6M","slot":300547340}]
```

## 9. getTokenAccountsByOwner

Used to query all token accounts under a specific account.

```ts
const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
}, "confirmed");
console.log(`Token accounts: ${JSON.stringify(tokenAccountsByOwner)}\n`);
```

```
Token accounts: {"context":{"apiVersion":"2.0.3","slot":300580814},"value":[{"account":{"data":{"type":"Buffer","data":[198,250,122,243,190,219,173,58,61,101,243,106,171,201,116,49,177,187,228,194,210,246,224,228,124,166,2,3,69,47,93,97,13,255,221,17,24,19,199,35,78,149,150,80,234,75,209,227,110,41,100,154,108,37,103,158,230,205,202,31,47,49,116,137,128,132,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"executable":false,"lamports":2039280,"owner":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","rentEpoch":18446744073709552000,"space":165},"pubkey":"HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"}]}
```

## 10. getTokenLargestAccounts

Query the top 20 holders of a specific token.

```ts
// Get the top 20 holders of the token with mint address Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump
const tokenLargestAccounts = await connection.getTokenLargestAccounts(new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump"));
console.log(`Top 20 token holders: ${JSON.stringify(tokenLargestAccounts)}\n`);
```

```
Top 20 token holders: {"context":{"apiVersion":"2.0.3","slot":300581319},"value":[{"address":"5hWv7FkSbyjyMNxKutWkA41azBFLkZNv3seLhZMeVR9f","amount":"152069454264255","decimals":6,"uiAmount":152069454.264255,"uiAmountString":"152069454.264255"},{"address":"EREWvGJSLVZ7cYqR9UBHags8Nu69UJWJTyUs5x1PxSVu","amount":"33554743151407","decimals":6,"uiAmount":33554743.151407,"uiAmountString":"33554743.151407"},{"address":"CsZcHJ9PgteaQfcNAsJhveM97THJ1erJYDCKxPv7zyoJ","amount":"23722304864271","decimals":6,"uiAmount":23722304.864271,"uiAmountString":"23722304.864271"},{"address":"BeJNuqkM7fLTQ9ayXxmRR2HcxwCtYdE5A83pDfkoK2ac","amount":"20153660767179","decimals":6,"uiAmount":20153660.767179,"uiAmountString":"20153660.767179"},{"address":"ECq3rtYeuGqjRYB5mnAQVkmnxEEhqZrCsj9iDXMLzMas","amount":"19542872794233","decimals":6,"uiAmount":19542872.794233,"uiAmountString":"19542872.794233"},{"address":"3eQwYYPvPRNT95ijnV7MhiuDf3UvFppgmbUfzGr3swGy","amount":"18960282274790","decimals":6,"uiAmount":18960282.27479,"uiAmountString":"18960282.27479"},{"address":"A9X8AbYgRUDgv76oJb3owJ9KZNQyMHYYoBUAcXYTQb4X","amount":"18385694793997","decimals":6,"uiAmount":18385694.793997,"uiAmountString":"18385694.793997"},{"address":"3tBpHjkbA2iPgLiynkh8aocx25cZw5giDsKgBMt18FQY","amount":"16192533170352","decimals":6,"uiAmount":16192533.170352,"uiAmountString":"16192533.170352"},{"address":"CKzAxaWfCvN2E2gsHZuh9ahkFURmWgrjcJmQJfS39JXw","amount":"15336629610352","decimals":6,"uiAmount":15336629.610352,"uiAmountString":"15336629.610352"},{"address":"AkRDFNqBny8QSWrm4hVHGz76AANHBYUySJ2FMMPJgFvc","amount":"14313037432834","decimals":6,"uiAmount":14313037.432834,"uiAmountString":"14313037.432834"},{"address":"7o9C3KFMinhVyCpAL18mjvWUAyNWECgfugoDEdEgVS3r","amount":"14278373348178","decimals":6,"uiAmount":14278373.348178,"uiAmountString":"14278373.348178"},{"address":"AgY1NbsCMaon6hjfcBMQjSaRyw8sUZNaoDht6H7Zw6GT","amount":"13601918495029","decimals":6,"uiAmount":13601918.495029,"uiAmountString":"13601918.495029"},{"address":"H1Qm7UNCdfhrbmjzzSKBN28xScZoBrU4CiTrQLfZwnTN","amount":"13212871578892","decimals":6,"uiAmount":13212871.578892,"uiAmountString":"13212871.578892"},{"address":"CLRVbDx6QkcSCGAkMSfmQuTFqpZun3tFRZHoCd7GV2MP","amount":"13045037329632","decimals":6,"uiAmount":13045037.329632,"uiAmountString":"13045037.329632"},{"address":"F6f91snaYJvioLtx5ESqKZTLxNuZn3erv78yBDvkP3kH","amount":"12234592572102","decimals":6,"uiAmount":12234592.572102,"uiAmountString":"12234592.572102"},{"address":"8D9v7JRy8uVLiqFcxQJjmPhdFttJcX6E5Kmn4WDFV3tM","amount":"11847710475369","decimals":6,"uiAmount":11847710.475369,"uiAmountString":"11847710.475369"},{"address":"Dvi82ZRJjey2eXV27U2Y8BGPbEkfq3B6t7pLsLCA4Ajh","amount":"11234459181997","decimals":6,"uiAmount":11234459.181997,"uiAmountString":"11234459.181997"},{"address":"HT1nud5TfKgnr2eG1bRB6eutRRNrHTS5uez4fFxL9txo","amount":"10980211007652","decimals":6,"uiAmount":10980211.007652,"uiAmountString":"10980211.007652"},{"address":"DrGFmy45YwcbUTZFn2XrKvVUTBbBY1jjGfMKGLFEkSmK","amount":"10536406834949","decimals":6,"uiAmount":10536406.834949,"uiAmountString":"10536406.834949"},{"address":"EkPJUGTRxEsDeLU7LbizUUgnA19GPzerUjLvEGAc9Zbi","amount":"10460309988199","decimals":6,"uiAmount":10460309.988199,"uiAmountString":"10460309.988199"}]}
```

## 11. getTokenSupply

Get the supply of a token.

```ts
// Get the supply of USDC
const supplyInfo = await connection.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
console.log(`Total supply: ${supplyInfo.value.amount}\n`);
```

```
Total supply: 3277049395067962
```

## 12. getParsedProgramAccounts

Batch retrieve all account information under a specific program.

> This is very useful when obtaining all holders of a specific token.

```ts
// Get all holders of the token with mint address Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump
const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
const accounts = await connection.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
    filters: [
        {
            dataSize: 165, // The data size of a Token account is 165 bytes
        },
        {
            memcmp: {
                offset: 0, // Offset 0 indicates the position of the Token Mint address
                bytes: mintAddress.toBase58(),
            },
        },
    ],
});

// Only print the first 3 holders
console.log("First 3 accounts:",  accounts.slice(0, 3))

```

```
First 3 accounts: [
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(Avd9odZRLXLJTofuGSwPnUjTweniq7hae1fiyqeKMMiG)] {
      _bn: <BN: 9375d79921e9ebb0d16610d41bf7845523c58600ec36fc853e0a575e89453b89>
    }
  },
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(53P2PjAqKcVm7iE2ZKGF5BDWSxHY7EPvhQw7iTvMYjWn)] {
      _bn: <BN: 3c0acfdb1629d9cbf13eaa22e97b7056a818513e45f90296d40392832af217df>
    }
  },
  {
    account: {
      data: [Object],
      executable: false,
      lamports: 2039280,
      owner: [PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)]],
      rentEpoch: 18446744073709552000,
      space: 165
    },
    pubkey: PublicKey [PublicKey(7EyFQhPg4S61U1FHnbL7BK1pnhFFyGLGXc6C99RGJCei)] {
      _bn: <BN: 5cba45ba1eb61ed5aeefc526c55f3d08441980486deb5eab70b8724e1012dfaf>
    }
  }
]
```