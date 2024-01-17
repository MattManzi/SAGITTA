require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",

    networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["9f26178c5f93a11824daa9d725160a2466c6687d18989966e9d824c89b32ff95"]
    }
  }
};
