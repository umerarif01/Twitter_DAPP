import { useCallback, useEffect, useState } from "react";
import TweetBox from "./TweetBox";
import Post from "./Post";
import { BsStars } from "react-icons/bs";
import useBlockchain from "../hooks/use-blockchain";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const style = {
  wrapper: `flex-[2] border-r border-l border-[#38444d] scrollbar-hide overflow-y-scroll`,
  header: `sticky top-0 bg-black z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

const Feed = () => {
  const { address, contract, signer } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);

  function ETHConverter(number) {
    if (!number) return;

    let x = number / 1000000000000000000;
    return x;
  }

  function truncate(_string) {
    let addr = "@" + _string.slice(0, 7) + "...";
    return addr;
  }

  function time2TimeAgo(ts) {
    // This function computes the delta between the
    // provided timestamp and the current time, then test
    // the delta for predefined ranges.

    var d = new Date(); // Gets the current time
    var nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
    var seconds = nowTs - ts;

    // more that two days
    if (seconds > 2 * 24 * 3600) {
      return "a few days ago";
    }
    // a day
    if (seconds > 24 * 3600) {
      return "yesterday";
    }

    if (seconds > 3600) {
      return "a few hours ago";
    }
    if (seconds > 1800) {
      return "Half an hour ago";
    }
    if (seconds > 60) {
      return Math.floor(seconds / 60) + " minutes ago";
    }
    if (seconds < 60) {
      return "few seconds ago";
    }
  }
  const Tweets = useCallback(async () => {
    console.log("Loading...");
    if (!contract) {
      return;
    }

    const count = (await contract.TotalTweets()).toNumber();
    console.log("Total Tweets Created : ", count);

    if (!count) {
      setTweets([]);
      return;
    }

    const loadedTweets = [];

    for (let index = 0; index < count; index++) {
      const tweet = await contract.tweets(index);
      loadedTweets.push({
        id: loadedTweets.length + 1,
        content: tweet.content,
        hash: tweet.hash,
        likes: tweet.likes.toNumber(),
        author: tweet.author,
        deleted: tweet.deleted,
        postedAt: tweet.postedAt.toNumber(),
        tipAmount: ETHConverter(tweet.tipAmount),
      });
    }
    console.log(loadedTweets);
    setTweets(loadedTweets.reverse());
    setLoading(true);
  }, [contract]);

  useEffect(() => {
    Tweets();
  }, [Tweets]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <div className={style.headerTitle}>Home</div>
        <BsStars />
      </div>

      <TweetBox func={Tweets} />

      {!loading ? (
        <div className="flex justify-center items-center my-3">
          <CircularProgress />
        </div>
      ) : (
        <>
          {tweets.map((tweet) => (
            <div
              className={`${tweet.deleted === true ? "hidden" : ""}`}
              key={tweet.id}
            >
              <Post
                id={tweet.id}
                userName={tweet.author ? truncate(tweet.author) : "Address"}
                text={tweet.content}
                avatar={tweet.author}
                timestamp={time2TimeAgo(tweet.postedAt)}
                tip={tweet.tipAmount}
                hash={tweet.hash}
                likes={tweet.likes}
                img={tweet.hash}
                func={Tweets}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
