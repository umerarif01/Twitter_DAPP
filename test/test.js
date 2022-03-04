const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tweets", function () {
  it("Should create a tweet", async function () {
    const Tweets = await hre.ethers.getContractFactory("Tweets");
    const tweet = await Tweets.deploy();
    await tweet.deployed();

    const setTweet = await tweet.createTweets("1st tweet created");
    console.log(setTweet);
    // wait until the transaction is mined
    await setTweet.wait();

    expect(await tweet.TotalTweets()).to.equal(1);
  });
});
