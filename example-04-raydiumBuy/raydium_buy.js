import assert from 'assert';

import {
  jsonInfo2PoolKeys,
  Liquidity,
  Percent,
  Token,
  TokenAmount,
  LIQUIDITY_STATE_LAYOUT_V4,
  MARKET_STATE_LAYOUT_V3,
  Market,
  SPL_MINT_LAYOUT,
  ENDPOINT as _ENDPOINT,
  Currency,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  TOKEN_PROGRAM_ID,
  TxVersion,
  buildSimpleTransaction,
  findProgramAddress,
  SPL_ACCOUNT_LAYOUT,
} from '@raydium-io/raydium-sdk';

import raydiumSdk from '@raydium-io/raydium-sdk';
import bs58 from "bs58";
import axios from "axios";
import {AnchorProvider, Program, Wallet} from "@coral-xyz/anchor";
const { ApiPoolInfoV4, InnerSimpleV0Transaction,TokenAccount } = raydiumSdk;

import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    VersionedTransaction,
    LAMPORTS_PER_SOL,
    SystemProgram,

} from '@solana/web3.js';

import solanaWeb3 from '@solana/web3.js';
const { SendOptions, Signer,INPUT_SOL_AMOUNT } = solanaWeb3;

import dotenv from 'dotenv';
// 在你对应的路径下创建一个.env文件，PUMP_SECRET_KEY=[163,19,.........]  里面存储的是钱包私钥的u8数组
dotenv.config({ path: '../.env' });
import {getKeypairFromEnvironment} from "@solana-developers/helpers";

const payer = getKeypairFromEnvironment("PUMP_SECRET_KEY"); // 钱包私钥从本地.env文件中获取
const walletPublicKey = payer.publicKey;
const wallet = new Wallet(payer);

const RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, { commitment: 'confirmed' });

const DEFAULT_TOKEN = {
    'SOL': new Currency(9, 'USDC', 'USDC'),
    'WSOL': new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
    'USDC': new Token(TOKEN_PROGRAM_ID, new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
    'RAY': new Token(TOKEN_PROGRAM_ID, new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), 6, 'RAY', 'RAY'),
    'RAY_USDC-LP': new Token(TOKEN_PROGRAM_ID, new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'), 6, 'RAY-USDC', 'RAY-USDC'),
  }
const makeTxVersion = TxVersion.V0; // LEGACY
const addLookupTableInfo = LOOKUP_TABLE_CACHE // only mainnet. other = undefined

async function getWalletTokenAccount(connection, walletPublicKey){
    const walletTokenAccount = await connection.getTokenAccountsByOwner(walletPublicKey, {programId: TOKEN_PROGRAM_ID,});
    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey, programId: i.account.owner, accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),}));
}

async function formatAmmKeysById(id) {
    const account = await connection.getAccountInfo(new PublicKey(id))
    if (account === null) throw Error(' get id info error ')
    const info = LIQUIDITY_STATE_LAYOUT_V4.decode(account.data)
  
    const marketId = info.marketId
    const marketAccount = await connection.getAccountInfo(marketId)
    if (marketAccount === null) throw Error(' get market info error')
    const marketInfo = MARKET_STATE_LAYOUT_V3.decode(marketAccount.data)
  
    const lpMint = info.lpMint
    const lpMintAccount = await connection.getAccountInfo(lpMint)
    if (lpMintAccount === null) throw Error(' get lp mint info error')
    const lpMintInfo = SPL_MINT_LAYOUT.decode(lpMintAccount.data)
  
    return {
      id,
      baseMint: info.baseMint.toString(),
      quoteMint: info.quoteMint.toString(),
      lpMint: info.lpMint.toString(),
      baseDecimals: info.baseDecimal.toNumber(),
      quoteDecimals: info.quoteDecimal.toNumber(),
      lpDecimals: lpMintInfo.decimals,
      version: 4,
      programId: account.owner.toString(),
      authority: Liquidity.getAssociatedAuthority({ programId: account.owner }).publicKey.toString(),
      openOrders: info.openOrders.toString(),
      targetOrders: info.targetOrders.toString(),
      baseVault: info.baseVault.toString(),
      quoteVault: info.quoteVault.toString(),
      withdrawQueue: info.withdrawQueue.toString(),
      lpVault: info.lpVault.toString(),
      marketVersion: 3,
      marketProgramId: info.marketProgramId.toString(),
      marketId: info.marketId.toString(),
      marketAuthority: Market.getAssociatedAuthority({ programId: info.marketProgramId, marketId: info.marketId }).publicKey.toString(),
      marketBaseVault: marketInfo.baseVault.toString(),
      marketQuoteVault: marketInfo.quoteVault.toString(),
      marketBids: marketInfo.bids.toString(),
      marketAsks: marketInfo.asks.toString(),
      marketEventQueue: marketInfo.eventQueue.toString(),
      lookupTableAccount: PublicKey.default.toString()
    }
  }

async function swapOnlyAmm(input) {
    // -------- pre-action: get pool info --------
    const targetPoolInfo = await formatAmmKeysById(input.targetPool);
    assert(targetPoolInfo, 'Cannot find the target pool');

    const poolKeys = jsonInfo2PoolKeys(targetPoolInfo);
    // -------- step 1: compute amount out --------
    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
    const outPutToken = new Token(TOKEN_PROGRAM_ID, poolKeys.quoteMint, poolKeys.quoteDecimals);
    const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
      poolKeys: poolKeys,
      poolInfo: poolInfo,
      amountIn: input.inputTokenAmount,
      currencyOut: outPutToken,
      slippage: input.slippage,
    });

    // -------- step 2: create instructions by SDK function --------
    const { innerTransactions }  = await Liquidity.makeSwapInstructionSimple({
        connection,
        poolKeys,
        userKeys: {
          tokenAccounts: input.walletTokenAccounts,
          owner: input.wallet,
        },
        amountIn: input.inputTokenAmount,
        amountOut: minAmountOut,
        fixedSide: 'in',
        makeTxVersion,
    });

    console.log('amountOut:', amountOut.toFixed(), '  minAmountOut:', minAmountOut.toFixed());


    const transaction = new Transaction();
    transaction.add(...innerTransactions);
    // 添加支付小费指令
    transaction.add(SystemProgram.transfer({
        fromPubkey: input.wallet,
        toPubkey: JITO_ACCOUNT_ID,
        lamports: 0.00001 * 1e9,
    }));

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);

    const simulationResult = await connection.simulateTransaction(signedTransaction);
    console.log(JSON.stringify(simulationResult));

    // 发送交易 正式交易 
    // const serializedTransaction = signedTransaction.serialize();
    // const base58Transaction = bs58.encode(serializedTransaction);

    // const bundle_data = {
    //   jsonrpc: "2.0",
    //   id: 1,
    //   method: "sendBundle",
    //   params: [[base58Transaction]],
    // };
    // const bundle_resp = await axios.post(`https://frankfurt.mainnet.block-engine.jito.wtf/api/v1/bundles`, bundle_data, {
    //   headers: {
    //       'Content-Type': 'application/json',
    //   },
    // });
    // const bundle_id = bundle_resp.data.result;
    // console.log(`sent to frankfurt, bundle id: ${bundle_id}`);
    // console.log(`Transaction hash: ${bs58.encode(signedTransaction.signature)}`);
    const txids = [];
    return txids;
}

async function howToUse() {
  const outputToken = "2xnfwmo2kDqheTJqyMSdREjVB7YGvjtSDWKkuXP5pump"; // RAY
  const targetPool = 'CMmpaPrnDLFoi57trMjtuYKxkUab8E7qsuWVnUHWQG2y'; // USDC-RAY pool
  const TOKEN_PROGRAM_ID_1 = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  const inputToken = new Token(
    TOKEN_PROGRAM_ID_1, // Raydium中指定的Token Program ID
    new PublicKey("So11111111111111111111111111111111111111112"), // Mint地址
    9 // Decimals
  );
  const inputTokenAmount = new TokenAmount(inputToken, 0.001 * 10 ** 9);
  const slippage = new Percent(1, 100);
  const walletTokenAccounts = await getWalletTokenAccount(connection, walletPublicKey);

  swapOnlyAmm({
    outputToken,
    targetPool,
    inputTokenAmount,
    slippage,
    walletTokenAccounts,
    wallet: walletPublicKey,
  }).then(({ txids }) => {
    console.log('txids', txids);
  }).catch(error => {
    console.error('Error during swap:', error);
  });
}

howToUse();
