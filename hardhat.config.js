require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

// const ALCHEMY_API_KEY = "STGFzKrYFzOFZscYY1-TfP-exED5SiDX";  // Goerli Test dashboard.alchemy.com
const ALCHEMY_API_KEY = "ddlajVqnq0eg7mxq0oFzYjVHOh2XtjWb";     // Goerli Test dashboard.alchemy.com

const GOERLI_PRIVATE_KEY = "xxx";  // Removed private key to push to my repo, which is public

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const gasBal = 6000000
// const balanceBefore = new BigNumber(await contract.getBalance(gasBal));           //   1/29
// assert(balanceBefore.minus(amountSent).minus(gasCost).isEqualTo(balanceAfter));   //   1/29

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.7.6",
        settings: {}
      },
      {
        version: "0.8.6",
      },
    ]
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
      // gasPrice: 20000000000,
      // gas: console.log(gasBal.toString()),
      // gas: balanceBefore,
      gas: 6000000,
      allowUnlimitedContractSize: true
      
    },
    // hardhat: {
    //   forking: {
    //     url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   }
    // }
  },
};
