import { AiOutlineEdit, AiOutlineHeart } from "react-icons/ai";
import { useState } from "react";
import Identicon from "react-identicons";
import useBlockchain from "../hooks/use-blockchain";
import { BiDollarCircle } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "react-modal";
import { customStyles } from "../lib/constants";
import TipModal from "./TipModal";

const style = {
  wrapper: `flex p-3 border-b border-[#38444d] hover:bg-gray-900/25`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
  postMain: `flex-1 px-4`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `my-2`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `flex justify-center items-center space-x-1 rounded-full text-lg p-2`,
};

const Post = ({
  userName,
  text,
  avatar,
  timestamp,
  likes,
  id,
  tip,
  hash,
  func,
}) => {
  const { contract } = useBlockchain();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [tmodalIsOpen, setTIsOpen] = useState(false);
  const [editpost, setEditPost] = useState("");
  const [state, setState] = useState("");

  function openModal() {
    setIsOpen(true);
  }

  function TopenModal() {
    setTIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function TcloseModal() {
    setTIsOpen(false);
  }

  async function LikeTweet(index) {
    console.log("Liking");
    if (!contract) {
      return;
    }
    console.log(index);
    const response = await contract.likeTweet(index);
    await response.wait();
    func();
    console.log("Liked");
  }

  async function DeleteTweet(index) {
    console.log("Deleting");
    if (!contract) {
      return;
    }
    const response = await contract.delTweets(index);
    await response.wait();
    func();
    console.log("Deleted");
  }

  async function EditTweets(index) {
    console.log("Tweet Editing");
    console.log(index);

    if (!editpost) {
      return;
    }

    const response = await contract.editTweets(index, editpost);
    setState("Submitting");
    await response.wait();
    func();
    console.log("Tweet Edited");
    setEditPost("");
    setIsOpen(false);
  }

  return (
    <div className={style.wrapper}>
      <div>
        <Identicon size="40" string={avatar} className={style.profileImage} />
      </div>
      <div className={style.postMain}>
        <div>
          <span className={style.headerDetails}>
            <span className={style.name}>{userName}</span>
            <span className={style.handleAndTimeAgo}>• {timestamp}</span>
          </span>
          <div className={style.tweet}>{text}</div>
          <div>
            <img src={hash} />
          </div>
        </div>
        <div className={style.footer}>
          <div
            title="Like Tweet"
            className={`${style.footerIcon} hover:text-[#f91c80] hover:bg-[#39243c]`}
          >
            <AiOutlineHeart
              onClick={() => {
                LikeTweet(id - 1);
              }}
            />

            <p className={`${likes <= 0 ? "hidden" : "text-sm"}`}>{likes}</p>
          </div>
          <div
            title="Edit Tweet"
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <AiOutlineEdit onClick={openModal} />
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              ariaHideApp={false}
            >
              <div className="flex flex-col justify-center items-center bg-gray-900 text-white p-5">
                <div className="flex flex-row space-x-[500px] py-4">
                  <h1
                    className="text-lg
         font-bold text-sky-500"
                  >
                    Edit Tweet
                  </h1>
                  <button className="font-bold" onClick={closeModal}>
                    X
                  </button>
                </div>

                <input
                  placeholder="Edit Tweet"
                  className="w-full bg-transparent p-3 outline-none border-2 border-gray-600 rounded-md"
                  onChange={(e) => {
                    setEditPost(e.target.value);
                  }}
                />
                <button
                  className="my-4 bg-[#1d9bf0] text-white px-5 py-2 rounded-lg"
                  onClick={() => EditTweets(id - 1)}
                >
                  {state === "Submitting" ? "Submitting" : "Submit"}
                </button>
              </div>
            </Modal>
          </div>
          <div
            title="Tip Tweet"
            className={`${style.footerIcon} hover:text-[#03ba7c] hover:bg-[#1b393b]`}
          >
            <BiDollarCircle onClick={TopenModal} />
            <Modal
              isOpen={tmodalIsOpen}
              onRequestClose={TcloseModal}
              style={customStyles}
              ariaHideApp={false}
            >
              <TipModal id={id} close={TcloseModal} />
            </Modal>

            <p className={`${tip <= 0 ? "hidden" : "text-sm"}`}>
              {tip + " ETH"}
            </p>
          </div>

          <div
            title="Delete Tweet"
            className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
          >
            <MdDeleteOutline
              onClick={() => {
                DeleteTweet(id - 1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
