import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const APIKEY = process.env.INFURA_API;
const token = process.env.TG_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const provider = new ethers.providers.JsonRpcProvider(APIKEY);
const maxTokens = 18000;
var unitWallet1 = Number;
var unitWallet2 = Number;

var subtractamount1 = 0;
var subtractamount2 = 0;

var soldTokenAmount1 = 0;
var soldTokenAmount2 = 0;

var tokenName = String;

var unitPairContract = {
  unitSupply: Number,
  wethSupply: Number,
};

var wethPair = {
  usdSupply: Number,
  wethSupply: Number,
};

var ethPrice;
var unitPrice;

var wallet1MaxTokens;
var wallet2MaxTokens;

var currentTokensWorth1;
var currentTokensWorth1Eth;
var MaxTokensworth1;
var MaxTokensworth1Eth;

var currentTokensWorth2;
var currentTokensWorth2Eth;
var MaxTokensworth2;
var MaxTokensworth2Eth;

async function main() {
  async function getWalletBalance() {
    const unitContractAddress = "0x1e241521f4767853b376c2fe795a222a07d588ee";

    const unitABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint)",
      "event Transfer(address indexed from, address indexed to, uint value)",
    ];

    const unitContract = new ethers.Contract(
      unitContractAddress,
      unitABI,
      provider
    );

    //check for amount of tokens

    const wallet1 = "0x1ffb2273bcc31267414d9d0771b0395047488fde";
    const wallet2 = "0xc3706554de1280800e72ab8C468e98305cEc7914";

    // // List all token transfers *from* myAddress

    const sex1 = await unitContract.queryFilter(
      unitContract.filters.Transfer(wallet1)
    );
    subtractamount1 = 0;

    for (var i = 0; i < sex1.length; i++) {
      const newSubtract1 = subtractamount1;

      const filter1 = await sex1[i].args.value.toString();
      let store = await Number(ethers.utils.formatEther(filter1));

      subtractamount1 = newSubtract1 + store;
    }

    const tokensSold1 = await unitContract.queryFilter(
      unitContract.filters.Transfer(
        "0x80f5666a6fe5c51739dc99b55463d5b098ffc10a",
        wallet1
      )
    );

    soldTokenAmount1 = 0;

    for (var i = 0; i < tokensSold1.length; i++) {
      const NewsoldTokenAmount1 = soldTokenAmount1;

      const filter1 = await tokensSold1[i].args.value.toString();
      let store = await Number(ethers.utils.formatEther(filter1));

      soldTokenAmount1 = NewsoldTokenAmount1 + store;
    }

    const tokensSold2 = await unitContract.queryFilter(
      unitContract.filters.Transfer(
        "0x80f5666a6fe5c51739dc99b55463d5b098ffc10a",
        wallet2
      )
    );

    soldTokenAmount2 = 0;

    for (var i = 0; i < tokensSold2.length; i++) {
      const NewsoldTokenAmount2 = soldTokenAmount2;

      const filter1 = await tokensSold2[i].args.value.toString();
      let store = await Number(ethers.utils.formatEther(filter1));

      soldTokenAmount2 = NewsoldTokenAmount1 + store;
    }

    const sex2 = await unitContract.queryFilter(
      unitContract.filters.Transfer(wallet2)
    );

    subtractamount2 = 0;

    for (var i = 0; i < sex2.length; i++) {
      const newSubtract2 = subtractamount2;

      const filter2 = await sex2[i].args.value.toString();
      let store = await Number(ethers.utils.formatEther(filter2));

      subtractamount2 = newSubtract2 + store;
    }

    //Get Balances

    const getBalance1 = await unitContract.balanceOf(wallet1);

    const getBalance2 = await unitContract.balanceOf(wallet2);

    const unitPair = await unitContract.balanceOf(
      "0x80F5666a6FE5c51739dC99B55463d5b098FFC10A"
    );

    tokenName = await unitContract.name();

    (unitWallet1 = ethers.utils.formatEther(getBalance1)),
      (unitWallet2 = ethers.utils.formatEther(getBalance2));
    unitPairContract.unitSupply = ethers.utils.formatEther(unitPair);
  }

  async function getEthPrice() {
    const contractAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint)",
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const unitPair = await contract.balanceOf(
      "0x80F5666a6FE5c51739dC99B55463d5b098FFC10A"
    );

    const ethpair = await contract.balanceOf(
      "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
    );

    unitPairContract.wethSupply = ethers.utils.formatEther(unitPair);
    wethPair.wethSupply = ethers.utils.formatEther(ethpair);
  }

  async function getUsdt() {
    const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint)",
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const ethpair = await contract.balanceOf(
      "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
    );

    wethPair.usdSupply = ethers.utils.formatEther(ethpair) * 10 ** 12;
  }

  await getEthPrice();
  await getUsdt();
  await getWalletBalance();

  ethPrice = (((wethPair.usdSupply / wethPair.wethSupply) * 100) / 100).toFixed(
    0
  );

  unitPrice = (
    (((unitPairContract.wethSupply * ethPrice) / unitPairContract.unitSupply) *
      100) /
    100
  ).toFixed(2);

  wallet1MaxTokens = maxTokens - subtractamount1;
  wallet2MaxTokens = maxTokens - subtractamount2;

  currentTokensWorth1 = unitWallet1 * unitPrice;
  currentTokensWorth1Eth = currentTokensWorth1 / ethPrice;
  MaxTokensworth1 = wallet1MaxTokens * unitPrice;
  MaxTokensworth1Eth = MaxTokensworth1 / ethPrice;

  currentTokensWorth2 = unitWallet2 * unitPrice;
  currentTokensWorth2Eth = currentTokensWorth2 / ethPrice;
  MaxTokensworth2 = wallet2MaxTokens * unitPrice;
  MaxTokensworth2Eth = MaxTokensworth2 / ethPrice;
}
var handle = null;
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const array = [
    "I would dump this motherfucker right now if i could",
    "Im sleeping, is it pumping?",
    "Is it over?",
    "Fuck im bricked the fuck up right now",
    "Take my advice and dump it -99%",
    "No mercy. Dump it",
    "The familia needs some love and eth",
    "Why pump",
    "Wen Coinsbit",
    "Wen CMC listing ser",
  ];

  if (messageText === "/unit30") {
    console.log("Someone called the Interval 30 mins");

    if (handle === null) {
      bot.sendMessage(chatId, "Starting 30min Interval");
    } else {
      bot.sendMessage(chatId, "Resetting 30min Interval");
    }

    clearInterval(handle);

    myFunc();

    handle = setInterval(myFunc, 1800000);

    async function myFunc() {
      await main();
      bot.sendMessage(
        chatId,

        "💰 Unit: $" +
          unitPrice +
          "\n" +
          "⚡️ ETH: $" +
          ethPrice +
          "\n\n" +
          "➕ Combined Tokens: " +
          (parseInt(unitWallet1) + parseInt(unitWallet2)).toFixed(0) +
          "\n💵 Worth: $" +
          (currentTokensWorth1 + currentTokensWorth2).toFixed(0) +
          "   ( " +
          (currentTokensWorth1Eth + currentTokensWorth2Eth).toFixed(2) +
          "ETH )\n\n" +
          "🔝 Current + Vested Tokens: " +
          (wallet1MaxTokens + wallet2MaxTokens).toFixed(0) +
          "\n" +
          "🤑 Worth: $" +
          (MaxTokensworth1 + MaxTokensworth2).toFixed(0) +
          "   ( " +
          (MaxTokensworth1Eth + MaxTokensworth2Eth).toFixed(2) +
          "ETH )\n\n\n" +
          "1️⃣ Wallet 1:         " +
          Math.floor(unitWallet1) +
          " Tokens ( $" +
          currentTokensWorth1.toFixed(0) +
          " )\n\n" +
          "Unreleased: " +
          (maxTokens - unitWallet1 - subtractamount1).toFixed(0) +
          " ( $" +
          ((maxTokens - unitWallet1 - subtractamount1) * unitPrice).toFixed(0) +
          " )\n" +
          "Sold: " +
          subtractamount1.toFixed(0) +
          "  ( " +
          ((subtractamount1 / maxTokens) * 100).toFixed(2) +
          "%)" +
          "\n\n\n" +
          "2️⃣ Wallet 2:         " +
          Math.floor(unitWallet2) +
          " Tokens ( $" +
          currentTokensWorth2.toFixed(0) +
          " )\n\n" +
          "Unreleased: " +
          (18000 - unitWallet2 - subtractamount2).toFixed(0) +
          " ( $" +
          ((18000 - unitWallet2 - subtractamount2) * unitPrice).toFixed(0) +
          " )\n" +
          "Sold: " +
          subtractamount2.toFixed(0) +
          "  ( " +
          ((subtractamount2 / maxTokens) * 100).toFixed(2) +
          "%)\n\n" +
          "<a href='https://www.dextools.io/app/en/ether/pair-explorer/0x80f5666a6fe5c51739dc99b55463d5b098ffc10a'>DexTools</a> | " +
          "<a href='https://dexscreener.com/ethereum/0x80f5666a6fe5c51739dc99b55463d5b098ffc10a'>DexScreener</a> | " +
          "<a href='https://etherscan.io/address/0x1e241521f4767853b376c2fe795a222a07d588ee'>Etherscan</a>     ",
        { parse_mode: "HTML", disable_web_page_preview: true }
      );
    }
  }

  if (messageText === "/eth") {
    console.log("Someone called eth");
    async function myFunc() {
      await main();
      bot.sendMessage(chatId, "Eth: $" + ethPrice);
    }
    myFunc();
  }

  if (messageText === "/unit") {
    console.log("Someone called unit");
    async function myFunc() {
      var startTime = performance.now();
      await main();

      await bot.sendMessage(
        chatId,

        "💰 Unit: $" +
          unitPrice +
          "\n" +
          "⚡️ ETH: $" +
          ethPrice +
          "\n\n" +
          "➕ Combined Tokens: " +
          (parseInt(unitWallet1) + parseInt(unitWallet2)).toFixed(0) +
          "\n💵 Worth: $" +
          (currentTokensWorth1 + currentTokensWorth2).toFixed(0) +
          "   ( " +
          (currentTokensWorth1Eth + currentTokensWorth2Eth).toFixed(2) +
          "ETH )\n\n" +
          "🔝 Current + Vested Tokens: " +
          (wallet1MaxTokens + wallet2MaxTokens).toFixed(0) +
          "\n" +
          "🤑 Worth: $" +
          (MaxTokensworth1 + MaxTokensworth2).toFixed(0) +
          "   ( " +
          (MaxTokensworth1Eth + MaxTokensworth2Eth).toFixed(2) +
          "ETH )\n\n\n" +
          "👥 Each :   " +
          (wallet1MaxTokens + wallet2MaxTokens) / 6 +
          "1️⃣ Wallet 1:         " +
          Math.floor(unitWallet1) +
          " Tokens ( $" +
          currentTokensWorth1.toFixed(0) +
          " )\n\n" +
          "Unreleased: " +
          (
            18000 -
            Math.round(unitWallet1) -
            subtractamount1 +
            soldTokenAmount1
          ).toFixed(0) +
          " ( $" +
          (
            (18000 -
              parseInt(unitWallet1) -
              subtractamount1 +
              soldTokenAmount1) *
            unitPrice
          ).toFixed(0) +
          " )\n" +
          "Sold: " +
          subtractamount1.toFixed(0) +
          "  ( " +
          ((subtractamount1 / maxTokens) * 100).toFixed(2) +
          "%)" +
          "\n\n\n" +
          "2️⃣ Wallet 2:         " +
          Math.floor(unitWallet2) +
          " Tokens ( $" +
          currentTokensWorth2.toFixed(0) +
          " )\n\n" +
          "Unreleased: " +
          (
            18000 -
            Math.round(unitWallet2) -
            subtractamount2 +
            soldTokenAmount2
          ).toFixed(0) +
          " ( $" +
          (
            (18000 -
              parseInt(unitWallet2) -
              subtractamount2 +
              soldTokenAmount2) *
            unitPrice
          ).toFixed(0) +
          " )\n" +
          "Sold: " +
          subtractamount2.toFixed(0) +
          "  ( " +
          ((subtractamount2 / maxTokens) * 100).toFixed(2) +
          "%)\n\n" +
          "<a href='https://www.dextools.io/app/en/ether/pair-explorer/0x80f5666a6fe5c51739dc99b55463d5b098ffc10a'>DexTools</a> | " +
          "<a href='https://dexscreener.com/ethereum/0x80f5666a6fe5c51739dc99b55463d5b098ffc10a'>DexScreener</a> | " +
          "<a href='https://etherscan.io/address/0x1e241521f4767853b376c2fe795a222a07d588ee'>Etherscan</a>     ",
        { parse_mode: "HTML", disable_web_page_preview: true }
      );
      var endTime = performance.now();

      bot.sendMessage(
        chatId,
        `Call took ${Math.round(endTime - startTime)} milliseconds`
      );
    }
    myFunc();

    //   var randomNumber = Math.floor(Math.random() * 100);
    //   var randomhighnumber = Math.floor(Math.random() * 100000);

    //   setTimeout(() => {
    //     bot.sendMessage(chatId, array[randomNumber]);
    //   }, randomhighnumber);
  }

  if (messageText === "/fud") {
    var randomNumber = Math.floor(Math.random() * 10);

    bot.sendMessage(chatId, array[randomNumber]);
  }
});

console.log("Bot started");
