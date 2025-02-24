"use client";
import useDebounce from "@/lib/useDebounce";
import { useAppSelector } from "@/lib/store/hook";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type ActiveTab = "forYou" | "trending" | "news" | "sports" | "entertainment";

const Explore: React.FC = () => {
  const { users } = useAppSelector((state) => state.chat);
  const [activeTab, setActiveTab] = useState<ActiveTab>("forYou");
  const [query, setQuery] = useState<string>(""); 
  const router = useRouter();
  
  useDebounce({ query });
  const handleNavigation = (userName: string) => {
    router.push(`/${userName}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full px-6 py-4">
        <div>
          <div>
            <svg
              className="absolute top-4 pl-3 w-9 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-4.35-4.35M10 4a6 6 0 100 12 6 6 0 000-12z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={query} // Bind query state to input
              onChange={(e) => setQuery(e.target.value)} // Update query state
              className="w-full bg-slate-700 text-gray-300 py-2 px-12 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <header className="border-b border-gray-700 pb-4 pt-7 mb-6 max-w-full hide-scrollbar overflow-x-auto text-nowrap">
          <nav className="flex justify-between space-x-4 mt-2">
            {["forYou", "trending", "news", "sports", "entertainment"].map(
              (tab) => (
                <div
                  key={tab}
                  className={`relative text-gray-400 font-medium cursor-pointer ${
                    activeTab === tab ? "text-white" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab as ActiveTab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute left-0 right-0 h-1 bg-blue-500 rounded-t-md top-9"></div>
                  )}
                </div>
              )
            )}
          </nav>
        </header>
        {!users || users.length < 1 ? (
          <div></div>
        ) : (
          <div className="hide-scrollbar overflow-y-auto h-[80vh]">
            {users.map((user) => (
              <div
                key={user._id}
                className="border-b py-3 cursor-pointer border-gray-600"
                onClick={() => handleNavigation(user.userName)}
              >
                <div>
                  <div className="flex gap-4">
                    <div>
                      {user?.pfp && (
                        <Image
                          src={user?.pfp}
                          alt="profile"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xl">
                        {user?.name ? user.name : "Messages"}
                      </div>
                      <Link
                        href={`/${user?.userName}`}
                        className="text-gray-500 cursor-pointer hover:underline"
                      >
                        {user?.userName ? "@" + user.userName : ""}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="w-1/2 px-6 py-4 border-l border-gray-700 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="ml-3">
              <p className="font-medium">Tovino Thomas</p>
              <p className="text-sm text-gray-400">@ttovino</p>
            </div>
          </div>
          <button className="bg-white text-black px-4 py-1 rounded-lg text-sm">
            Following
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="ml-3">
              <p className="font-medium">Aju Varghese</p>
              <p className="text-sm text-gray-400">@AjuVarghese</p>
            </div>
          </div>
          <button className="bg-white text-black px-4 py-1 rounded-lg text-sm">
            Following
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="ml-3">
              <p className="font-medium">SportsCenter</p>
              <p className="text-sm text-gray-400">@SportsCenter</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm">
            Follow
          </button>
        </div>

        <a href="#" className="text-blue-500 text-sm">
          Show more
        </a>
      </aside>
    </div>
  );
};

export default Explore;