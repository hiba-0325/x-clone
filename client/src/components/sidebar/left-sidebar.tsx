"use client";
import React, { useEffect, useState } from "react";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineMail,
  AiOutlineUser,
} from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { BiBookmark } from "react-icons/bi";
import { RiQuillPenAiLine } from "react-icons/ri";

import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";

export type User = {
  id: string;
  name: string;
  userName: string;
  email?: string;
  pfp?: string;
};

const Sidebar: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const currentUser = Cookies.get("user");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setLoggedInUser(user);
    }
  }, []);

  const handleLogout = async () => {
    Cookies.remove("user");

    setShowLogoutPopup(false); 
  };

  return (
    <div className=" flex-col py-6 justify-between max-w-[250px] items-end pr-2 border-r border-blue-500 h-screen bg-black">
      
      <Link
        href={"/home"}
        className="text-4xl font-bold pr-1 transition-colors  hover:bg-gray-900 p-2 rounded-full"
      >
        <FaXTwitter />
      </Link>

     
      <nav className="flex flex-col gap-5 pr-3 w-full">
        <Link
          href={"/home"}
          className="flex items-center gap-3 text-xl cursor-pointer  hover:bg-gray-900 p-2 rounded-full"
        >
          <AiFillHome size={24} />
          <span className="hidden lg:inline">Home</span>
        </Link>
        <Link
          href={"/explore"}
          className="flex items-center gap-3 text-xl cursor-pointer hover:bg-gray-900 p-2 rounded-full "
        >
          <AiOutlineSearch size={24} />
          <span className="hidden lg:inline">Explore</span>
        </Link>
        <Link
          href={"/notifications"}
          className="flex items-center gap-3 text-xl cursor-pointer  hover:bg-gray-900 p-2 rounded-full"
        >
          <AiOutlineBell size={24} />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
        <Link
          href={"/messages"}
          className="flex items-center gap-3 text-xl cursor-pointer hover:bg-gray-900 p-2 rounded-full"
        >
          <AiOutlineMail size={24} />
          <span className="hidden lg:inline">Messages</span>
        </Link>
        <Link
          href={"/bookmarks"}
          className="flex items-center gap-3 text-xl cursor-pointer  hover:bg-gray-900 p-2 rounded-full"
        >
          <BiBookmark size={24} />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
       
        <Link
          href={"/profile"}
          className="flex items-center  gap-3 text-xl cursor-pointer  hover:bg-gray-900 p-2 rounded-full "
        >
          <AiOutlineUser size={24}  />
          <span className="hidden lg:inline">Profile</span>
        </Link>
      </nav>
      <br/>
      <button className="bg-blue-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-400  transition-colors w-full lg:w-auto flex items-center justify-center gap-2">
        
        <RiQuillPenAiLine size={20} className="lg:hidden" />
       
        <span className="hidden lg:inline">Post</span>
        
      </button>
<br/>
      <div
  className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-full cursor-pointer w-full"
  onClick={() => setShowLogoutPopup(!showLogoutPopup)}
>
  {/* Profile Picture */}
  {loggedInUser?.pfp && (
            <Image
              src={loggedInUser.pfp}
              width={100}
              height={100}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full"
            />
        )}
  
  <div className="flex flex-col lg:flex">
 
    <span className="font-bold">{loggedInUser?.name || "Name"}</span>

    <span className="text-sm text-gray-400">
      @{loggedInUser?.userName || "username"}
    </span>
  </div>
</div>


     
      {showLogoutPopup && (
        <div className="absolute bottom-20 right-5 bg-black border border-gray-700 rounded-lg shadow-lg p-4 w-56">
          <p className="text-white mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-3">
            <button
              className="text-gray-400 text-lg hover:text-white transition-colors"
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </button>
            <button
              className="bg-white text-black py-2 px-6 rounded-full text-lg font-semibold hover:bg-slate-50 transition-colors"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;