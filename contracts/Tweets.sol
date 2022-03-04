//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Tweets {

Tweeter[] public tweets;

    struct Tweeter {
        uint id;
        string content;
        string hash;
        address payable author;
        bool deleted;
        uint likes;
        uint postedAt;
        uint tipAmount;
    }

    event Tweeted(uint256 id, string content, address payable author,uint256 likes);

    event PostTipped(
    uint id,
    uint tipAmount,
    address payable author
  );

  constructor(string memory tweetcontent) {
        console.log("Tweeter Smart Contract Deployed (:");
        createTweets(tweetcontent);
        console.log("1st tweet Created!");
    }

    function createTweets(string memory _content) public {
        require(bytes(_content).length > 0);
        uint id = tweets.length + 1;
        uint likes = 0;
        uint postedAt = block.timestamp;
        uint tipAmount = 0;
        string memory hash = "";
        tweets.push(Tweeter(id, _content,hash,  payable(msg.sender), false, likes, postedAt,tipAmount));
        emit Tweeted(id, _content,  payable(msg.sender),likes);
    }

    function createTweetImg(string memory _content,string memory _hash) public {
        require(bytes(_hash).length > 0);
        require(bytes(_content).length > 0);
        uint id = tweets.length + 1;
        uint likes = 0;
        uint postedAt = block.timestamp;
        uint tipAmount = 0;
        string memory hash = _hash;
        tweets.push(Tweeter(id, _content,hash,  payable(msg.sender), false, likes, postedAt,tipAmount));
        emit Tweeted(id, _content,  payable(msg.sender),likes);
    }

    function likeTweet(uint _index) public{
      uint id = _index ;
        Tweeter storage tweet = tweets[id];
        tweet.likes = tweet.likes + 1;
        emit Tweeted(id, tweet.content,  payable(msg.sender),tweet.likes);
    }

    function delTweets(uint _index) public {
        uint id = _index;
        Tweeter storage tweet = tweets[id];
        require(
			msg.sender == tweet.author,
			"Tweet can only be deleted by owner"
		);
        tweet.deleted = true;
         emit Tweeted(id, tweet.content,  payable(msg.sender),tweet.likes);
        // emit Tweeted(id, tweet.content, msg.sender);
    }

    function editTweets(uint _index, string memory _newcontent) public {
        uint id = _index;
        Tweeter storage tweet = tweets[id];
        require(bytes(_newcontent).length > 0);
         require(
			msg.sender == tweet.author,
			"Tweet can only be edited by owner"
		);
        tweet.content = _newcontent;
         emit Tweeted(id, tweet.content,  payable(msg.sender),tweet.likes);
        // emit Tweeted(id, tweet.content, msg.sender);
    }
    
    function tipPost(uint _index,uint _tipAmount) public payable {
      uint id = _index;
      Tweeter storage tweet = tweets[id];
      require(_tipAmount > 0);
      _tipAmount = msg.value;
      (bool sent,) = tweet.author.call{value: _tipAmount}("");
      require(sent, "Failed to send Ether");
      tweet.tipAmount = tweet.tipAmount + _tipAmount;
      emit PostTipped( id,tweet.tipAmount, payable(msg.sender));
  }
    
    function readTweets() public view returns (Tweeter[] memory){
        return tweets;
    }

    function TotalTweets() public view returns (uint256){
        uint256 total = tweets.length;
        return total;
    }
}
