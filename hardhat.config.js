require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,             //It is when we perform tests
    },
    localhost: {                   //Localhost is the fake blockchain running
      chainId: 31337,
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.8" },
      { version: "0.8.0" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
