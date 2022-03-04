import React, { useState } from "react";
import useBlockchain from "../hooks/use-blockchain";

const TipModal = ({ close, id }) => {
  const [state, setState] = useState("");
  const [tip, setTip] = useState();
  const { contract } = useBlockchain();

  async function TipTweet(index) {
    console.log("Tipping");
    console.log(index);

    if (!tip) {
      return;
    }

    const response = await contract.tipPost(index, tip);
    setState("Submitting");
    await response.wait();
    // func();
    console.log("Tipped");
    setTip(0);
    // setIsOpen(false);
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 text-white p-5">
      <div className="flex flex-row space-x-[500px] py-4">
        <h1
          className="text-lg
          font-bold text-green-500"
        >
          $ Tip Tweet
        </h1>
        <button className="font-bold" onClick={close}>
          X
        </button>
      </div>

      <input
        type="number"
        placeholder="Enter ETH Value"
        className="w-full bg-transparent p-3 outline-none border-2 border-gray-600 rounded-md"
        onChange={(e) => {
          setTip(e.target.value);
          console.log(tip);
        }}
      />
      <button
        className="my-4 bg-[#1d9bf0] text-white px-5 py-2 rounded-lg"
        onClick={() => {
          if (!id) {
            return;
          }
          TipTweet(id - 1);
        }}
      >
        {state === "Submitting" ? "Submitting" : "Submit"}
      </button>
    </div>
  );
};

export default TipModal;
