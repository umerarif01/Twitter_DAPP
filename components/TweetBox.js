import { BsCardImage, BsEmojiSmile } from "react-icons/bs";
import { RiFileGifLine, RiBarChartHorizontalFill } from "react-icons/ri";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import Identicon from "react-identicons";
import useBlockchain from "../hooks/use-blockchain";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  wrapper: `px-4 flex flex-row border-b border-[#38444d] pb-4`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
  icon: `text-xl mr-2 hover:cursor-pointer`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
  inactiveSubmit: `bg-[#196195] text-[#95999e]`,
  activeSubmit: `bg-[#1d9bf0] text-white`,
};

const TweetBox = ({ func }) => {
  const [tweetMessage, setTweetMessage] = useState("");
  const { address, contract } = useBlockchain();

  async function CreateTweet(event) {
    event.preventDefault();
    if (!tweetMessage) {
      return;
    }

    const response = await contract.createTweets(tweetMessage);
    await response.wait();
    func();
    toast.success("Tweet created");
    console.log("Tweet created");
  }

  return (
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        <Identicon size="40" string={address} className={style.profileImage} />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={style.tweetBoxRight}>
        <form>
          <textarea
            onChange={(e) => {
              setTweetMessage(e.target.value);
            }}
            // value={tweetMessage}
            placeholder="What's happening?"
            className={style.inputField}
          />
          <div className={style.formLowerContainer}>
            <div className={style.iconsContainer}>
              <BsCardImage
                title="Upload Tweet with image"
                className={style.icon}
              />

              <BsEmojiSmile className={style.icon} />

              <MdOutlineLocationOn className={style.icon} />
            </div>
            <button
              type="submit"
              onClick={CreateTweet}
              disabled={!tweetMessage}
              className={`${style.submitGeneral} ${
                tweetMessage ? style.activeSubmit : style.inactiveSubmit
              }`}
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
