import { useState } from "react";
import { useRouter } from "next/router";
import SidebarOption from "./SidebarOption";
import { RiHome7Line, RiHome7Fill, RiFileList2Fill } from "react-icons/ri";
import { BiHash } from "react-icons/bi";
import { FiBell, FiMoreHorizontal } from "react-icons/fi";
import { FaRegListAlt, FaHashtag, FaBell } from "react-icons/fa";
import { VscTwitter } from "react-icons/vsc";
import Identicon from "react-identicons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BsBookmark,
  BsBookmarkFill,
  BsPerson,
  BsPersonFill,
} from "react-icons/bs";
import useBlockchain from "../hooks/use-blockchain";
import Modal from "react-modal";
import { customStyles } from "../lib/constants";
import { useRef, useEffect } from "react";
import { uploadImage, fetchImage } from "../lib/nftStorage";
import { NFTStorage, File } from "nft.storage";
import axios from "axios";

const style = {
  wrapper: `flex-[0.7] px-8 flex flex-col`,
  twitterIconContainer: `text-3xl m-4`,
  tweetButton: `bg-[#1d9bf0] hover:bg-[#1b8cd8] flex items-center justify-center font-bold rounded-3xl h-[50px] mt-[20px] cursor-pointer`,
  navContainer: `flex-1`,
  profileButton: `flex items-center mb-6 cursor-pointer hover:bg-[#333c45] rounded-[100px] p-2`,
  profileLeft: `flex item-center justify-center mr-4`,
  profileImage: `rounded-full`,
  profileRight: `flex-1 flex`,
  details: `flex-1`,
  name: `text-lg font-semibold  `,
  handle: `text-[#8899a6]`,
  moreContainer: `flex items-center mr-2`,
  fileInput: `hidden`,
  fileSelected: `bg-[#2b6127] text-white px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`,
  customInput: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer mt-[20px]`,
};

const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhNzVkODgxZmExMmVlMjk0RGE3ZTllMkVhMkUzMmYxQmQxRjVkMTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDI0NTM0OTE3MiwibmFtZSI6Ik5GVCBaT05FIn0.bmL4N5l0VdNYlCKgmII4s0MUVy9BGTbbvuuRTiakQuc",
});

const Sidebar = ({ initialSelectedIcon = "Home" }) => {
  const [selected, setSelected] = useState(initialSelectedIcon);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { address, contract, authProvider } = useBlockchain();
  const [fileUrl, updateFileUrl] = useState();
  const [tweetMessage, setTweetMessage] = useState("");
  const [state, setState] = useState("Tweet");
  const [img, setImage] = useState("");

  function truncate(_string) {
    let addr = "@" + _string.slice(0, 7) + "...";
    return addr;
  }

  function openModal() {
    setState("Tweet");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function CreateTweetImg() {
    setState("Tweeting");
    const img = new File([fileUrl], "nft.jpg", { type: "image/jpg/png" });
    const metadata = await client.store({
      name: "",
      description: "",
      image: img,
    });
    const url = "https://nftstorage.link/ipfs/" + metadata.url.slice(7, 80);
    const res = await axios.get(url);
    if (!tweetMessage || !res) {
      toast.error("Error!");
      closeModal();
      return;
    }
    const imageUrl =
      "https://nftstorage.link/ipfs/" + res.data.image.slice(7, 80);
    setImage(imageUrl);
    console.log("uploaded", imageUrl);
    const response = await contract.createTweetImg(tweetMessage, imageUrl);
    await response.wait();
    toast.success("Tweet created");
    setState("Tweeted");
  }

  return (
    <div className={style.wrapper}>
      <div className={style.twitterIconContainer}>
        <VscTwitter />
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

      <div className={style.navContainer}>
        <SidebarOption
          Icon={selected === "Home" ? RiHome7Fill : RiHome7Line}
          text="Home"
          isActive={Boolean(selected === "Home")}
          setSelected={setSelected}
          redirect={"/"}
        />
        <SidebarOption
          Icon={selected === "Profile" ? BsPersonFill : BsPerson}
          text="Profile"
          isActive={Boolean(selected === "Profile")}
          setSelected={setSelected}
        />
        <SidebarOption
          Icon={selected === "Explore" ? FaHashtag : BiHash}
          text="Explore"
          isActive={Boolean(selected === "Explore")}
          setSelected={setSelected}
        />

        <SidebarOption
          Icon={selected === "Lists" ? RiFileList2Fill : FaRegListAlt}
          text="Lists"
          isActive={Boolean(selected === "Lists")}
          setSelected={setSelected}
        />

        <div className={style.tweetButton} onClick={openModal}>
          Tweet
        </div>
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
                Tweet with Image
              </h1>
              <button className="font-bold" onClick={closeModal}>
                X
              </button>
            </div>
            <input
              placeholder="What's happening?"
              className="w-full bg-transparent p-3 outline-none border-2 border-gray-600 rounded-md"
              onChange={(e) => {
                setTweetMessage(e.target.value);
              }}
            />
            <input
              type="file"
              onChange={(e) => {
                updateFileUrl(e.target.files[0]);
              }}
              className="mt-3"
              required
            />
            {/* Tweet button */}
            {img && <img src={img} width="200" height="200" />}

            <button
              className="bg-[#1d9bf0] hover:bg-[#1b8cd8] text-white px-5 py-2 text-xl font-semibold rounded-md mt-[20px]"
              onClick={async () => {
                CreateTweetImg();
              }}
            >
              {state}
            </button>
          </div>
        </Modal>
      </div>
      <div
        className={style.profileButton}
        onClick={authProvider}
        title="Connect Wallet"
      >
        <div className={style.profileLeft}>
          <Identicon
            size="40"
            string={address}
            className={style.profileImage}
          />
        </div>
        <div className={style.profileRight}>
          <div className={style.details}>
            <div className={style.name}>
              {address ? truncate(address) : "Address"}
            </div>
          </div>
          <div className={style.moreContainer}>
            <FiMoreHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
