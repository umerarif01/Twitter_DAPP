require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/3B7-18xGSLhXH5Nbmm8csQHeVqdegWXw",
      accounts: [
        "25aaee7da74ec17ae7aa45f74d3656d9b6df75238ccac04effd73c93c21e81e2",
      ],
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/J6JDw-n3-7ZkaYHGLGuN1HPXFc7E2Chn",
      accounts: [
        "4f108e086e8f3e35f37aa38d7cb31dd650e4e3304ce29d991d142688533fe9ef",
      ],
    },
  },
};
