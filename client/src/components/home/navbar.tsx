"use client";

import { setActiveTab } from "@/lib/store/features/tweet-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import React, { useEffect } from "react";

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.tweets);

  useEffect(() => {
    const status = localStorage.getItem("status") || "forYou";
    dispatch(setActiveTab(status));
  }, [activeTab, dispatch]);

  return (
    <div className="mt-14 flex items-center justify-around bg-black text-white h-16 border-b border-gray-700 sm:mt-0">
      <div className="flex w-1/2 justify-between">
        <div
          className={`relative text-sm font-semibold cursor-pointer ${
            activeTab === "forYou" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => {
            dispatch(setActiveTab("forYou"));
            localStorage.setItem("status", JSON.stringify("forYou"));
          }}
        >
          For you
          {activeTab === "forYou" && (
            <div className="absolute  left-0 right-0 h-1 bg-blue-500 rounded-t-md  top-9"></div>
          )}
        </div>
        <div
          className={`relative text-sm font-semibold cursor-pointer ${
            activeTab === "following" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => {
            dispatch(setActiveTab("following"));
            localStorage.setItem("status", JSON.stringify("following"));
          }}
        >
          {activeTab === "following" && (
            <div className="absolute left-0 right-0 h-1 bg-blue-500 rounded-t-md top-9"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
