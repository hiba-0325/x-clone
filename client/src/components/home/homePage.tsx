"use client";

import React from "react";
import NavBar from "@/components/home/navbar";
import SearchSection from "@/components/home/search-section/search-section";
import TweetList from "@/components/home/tweets/tweet-list";
import PostInput from "@/components/home/tweets/tweetForm";




export default function Home() {
  

  
  return (
    <div className="w-screen h-screen flex">
      <div className="  sm:w-1/2 border-r border-gray-600 sticky">
        <div className="">
          <NavBar />
        </div>
        <div className="hide-scrollbar overflow-y-scroll w-full sm:w-full max-h-[91vh]">
          <PostInput />
          <TweetList />
        </div>
      </div>
      <div className="hidden md:block sm:w-1/4">
        <SearchSection />
      </div>
    </div>
  );
}