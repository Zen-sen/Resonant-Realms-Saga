require("dotenv").config();
const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    polygon_amoy: {
      url: process.env.POLYGON_RPC || "https://rpc-amoy.polygon.technology",
      chainId: parseInt(process.env.POLYGON_CHAIN_ID || "80002"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    pi_testnet: {
      url: process.env.PI_TESTNET_RPC_URL || "https://rpc-testnet.pivm.network",
      chainId: parseInt(process.env.PI_TESTNET_CHAIN_ID || "31415"),
      accounts: []
    }
  }
};

module.exports = config;
