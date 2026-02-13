require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.methodIdentifiers",
            "metadata"
          ]
        }
      }
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    pi_testnet: {
      url: process.env.PI_TESTNET_RPC_URL || "https://rpc-testnet.pivm.network",
      chainId: parseInt(process.env.PI_TESTNET_CHAIN_ID || "31415"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};