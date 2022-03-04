import { useState, useContext } from "react";
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
import { create } from "ipfs-http-client";

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

const client = create("https://ipfs.infura.io:5001/api/v0");

const Sidebar = ({ initialSelectedIcon = "Home" }) => {
  const [selected, setSelected] = useState(initialSelectedIcon);
  const [modalIsOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { address, contract } = useBlockchain();
  const [fileUrl, updateFileUrl] = useState(``);
  const [tweetMessage, setTweetMessage] = useState("");

  function truncate(_string) {
    let addr = "@" + _string.slice(0, 7) + "...";
    return addr;
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
      console.log(url);
      console.log("File Uploaded");
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function CreateTweetImg(event) {
    event.preventDefault();
    if (!tweetMessage) {
      return;
    }

    const response = await contract.createTweetImg(tweetMessage, fileUrl);
    await response.wait();
    toast.success("Tweet created");
    console.log("Tweet created");
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
            <input type="file" onChange={onChange} className="mt-4" />
            {fileUrl && <img className="mt-4" src={fileUrl} width="600px" />}
            <button
              className="bg-[#1d9bf0] hover:bg-[#1b8cd8] text-white px-5 text-xl font-bold py-3 rounded-md mt-[20px]"
              onClick={CreateTweetImg}
            >
              Tweet
            </button>
          </div>
        </Modal>
      </div>
      <div className={style.profileButton}>
        <div className={style.profileLeft}>
          {/* <img src="/logo.png" alt="profile" className={style.profileImage} /> */}
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
