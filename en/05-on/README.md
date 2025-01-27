# Reading On-Chain Data (Part 2): `on` Subscriptions

This section will introduce you to some common methods for subscribing to on-chain data and their use cases.

Unlike single reads of on-chain data, subscriptions allow RPC nodes to push data to the client in a streaming manner. These methods also belong to the `Connection` class and have method names that start with `on`.

First, let's create an RPC connection:

```ts
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
```

## 1. onAccountChange and onProgramAccountChange

These are used to listen for real-time changes in the state of specific accounts. When the balance or stored data of an account changes, a callback function is triggered, providing the updated account information.

> This is very useful for wallet monitoring.

```ts
// Listen for changes to the account orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8
connection.onAccountChange(new PublicKey("orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8"), (accountInfo) => {
    console.log(`Account change: ${JSON.stringify(accountInfo)}\n`);
});
```

```
Account change: {"lamports":54656348509,"data":{"type":"Buffer","data":[]},"owner":"11111111111111111111111111111111","executable":false,"rentEpoch":18446744073709552000,"space":0}
```

`onProgramAccountChange` is similar, but it subscribes to the state of program accounts.

## 2. onLogs

This is used to listen for logs on the network in real-time, and you can also specify logs under a certain account.

> This is useful for monitoring new liquidity pool creations and wallet buy/sell actions.

```ts
// Listen for logs from raydium v4
connection.onLogs(new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"), (logs) => {
    console.log(`Logs: ${JSON.stringify(logs)}\n`);
});
```

```
Logs: {"signature":"5FziCd9SRzEJyXcxRotJqamGdcTfdMKiWB4GPvg2HiWFpzzyvnBGTaV6Vd8KANS85yHjszE61BxFc1gQQgSdATSg","err":null,"logs":["Program ComputeBudget111111111111111111111111111111 invoke [1]","Program ComputeBudget111111111111111111111111111111 success","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm invoke [1]","Program log: Instruction: Finish","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 invoke [2]","Program log: ray_log: A0cBmjWFAAAAbK8wbAAAAAACAAAAAAAAAEcBmjWFAAAA/2uOg3AUAADPqGwiEQAAAOq+oWwAAAAA","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: Transfer","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 101749 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: Transfer","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4736 of 94123 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 consumed 32059 of 120402 compute units","Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]","Program log: Instruction: CloseAccount","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2916 of 85643 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]","Program log: Instruction: CloseAccount","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3014 of 78745 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 11111111111111111111111111111111 invoke [2]","Program 11111111111111111111111111111111 success","Program 11111111111111111111111111111111 invoke [2]","Program 11111111111111111111111111111111 success","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]","Program log: Create","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: GetAccountDataSize","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1569 of 58189 compute units","Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program 11111111111111111111111111111111 invoke [3]","Program 11111111111111111111111111111111 success","Program 11111111111111111111111111111111 invoke [3]","Program 11111111111111111111111111111111 success","Program log: Initialize the associated token account","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: InitializeImmutableOwner","Program log: Please upgrade to SPL Token 2022 for immutable owner support","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 50213 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]","Program log: Instruction: InitializeAccount3","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3158 of 46329 compute units","Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 22297 of 65164 compute units","Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm consumed 108080 of 149850 compute units","Program 6rHBDckrDivyp5UarGvCqobhtdfuBf2p7E42zXNbKBGm success"]}
```