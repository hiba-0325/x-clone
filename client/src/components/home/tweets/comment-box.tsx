"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaComment } from "react-icons/fa";
import { useAppDispatch } from "@/lib/store/hook";
import { createComment } from "@/lib/store/thunks/comments-thunks";
import Image from "next/image";
import { socket } from "@/components/message/chat-list";
import Cookies from "js-cookie";
import { TweetData } from "@/utils/types/types";

type CommentProps = {
  tweet:TweetData | null;
  loggedUser: {
    pfp: string;
  };
};

const CommentBox: React.FC<CommentProps> = ({ tweet, loggedUser }) => {
  const [commentText, setCommentText] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    const currentUser = Cookies.get("user");
    const user = JSON.parse(currentUser || "{}");

    if (commentText.trim() === "") {
      toast.info("Comment cannot be empty");
      return;
    }

    dispatch(
      createComment({ tweetId: tweet?._id as string, content: commentText })
    ).unwrap();

    socket.emit("comment", { tweetId: tweet?._id, userId: user.id });
    toast.success("Comment submitted successfully");
    setCommentText("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-black p-2">
          <FaComment className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black border-none">
        <DialogHeader>
          <DialogTitle>Post your reply</DialogTitle>
        </DialogHeader>
        <div className="flex">
          <div className="flex">
            <div className="flex flex-col items-center">
              {tweet?.user?.pfp && (
                <Image
                  src={tweet?.user?.pfp}
                  alt="profile"
                  height={50}
                  width={50}
                  className="border rounded-full"
                />
              )}
              <div className="border-l h-28 mt-2"></div>
            </div>
            <div>
              <div className="flex pl-2 gap-2 mt-3">
                <div>{tweet?.user?.name}</div>
                <div>{tweet?.user?.userName}</div>
              </div>
              <div className="pl-2 flex flex-col justify-center h-16">
                {tweet?.text}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="pl-1 text-white flex items-center justify-center rounded-full">
            <Image
              src={loggedUser?.pfp || ""}
              alt="profile"
              height={40}
              width={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Post your reply"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={commentText.trim() === ""}
            className={`${
              commentText.trim() === ""
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-400"
            }`}
          >
            Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentBox;
