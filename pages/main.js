import React from "react";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-black text-white`,
  content: `max-w-[1400px] w-2/3 flex justify-between`,
};

const Main = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
};

export default Main;
