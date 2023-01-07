require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_RPC_URL,
      accounts:[process.env.USER_KEY],
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
};
