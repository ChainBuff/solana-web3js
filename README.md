# Solana Web3.js 教程

> 本教程由Buff社区成员编写，每周更新1-3节。

Solana Web3.js 库是一个用于与 Solana 区块链进行交互的 JavaScript 基础库。

本教程旨在提供一些简单的例子，帮助你快速上手 Solana 区块链开发。

> English version (英文版): [README-en.md](./README-en.md)

--- 

在阅读之前，需要运行如下来安装@solana/web3.js，本教程使用的版本为1.95.4。

```
$ npm install @solana/web3.js@1.95.4
```

之后，可通过 `npx esrun xxx/index.ts` 来运行每节的代码。

## 目录

0. 基础术语表

### 基础

1. [创建钱包 & 导入钱包](./01-wallet/)
2. [获取账户下的 SOL 余额](./02-balance/)
3. [发送自己的第一笔转账交易](./03-transfer/)
4. [读取链上数据（一）：`get` 读取](./04-get/)
5. [读取链上数据（二）：`on` 订阅](./05-on/)
6. [写入链上数据：`send` 发送交易](./06-send/)

### 进阶

7. [添加优先费](./07-cu/)
8. [`v0` 交易](./08-v0/)
9. [解析buffer](./09-buffer/)
10. 

### 实战

1. [监听钱包](./example-01-subWallet/)
2. [监听raydium v4新流动池创建](./example-02-subNewPool/)
3. [监听raydium clmm代币的实时价格](./example-03-subPrice/)
4. [获取代币持有比例](./example-04-analysisToken/)
5. [关闭代币账户退租](./example-05-closeATA/)

## 参考

- https://solana-labs.github.io/solana-web3.js/v1.x
- https://solana.com/zh/developers/cookbook
- https://solana.com/docs

## 捐赠

如果你想支持Buff社区的发展，可通过向 `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` 地址捐赠Solana链上资产。

社区资金将被用于奖励社区贡献者，贡献包括但不限于 `PR`。
