const main = async () => {
  const Tweets = await hre.ethers.getContractFactory("Tweets");
  const tweet = await Tweets.deploy("1st tweet Created!");
  await tweet.deployed();
  console.log("Contract deployed to:", tweet.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
