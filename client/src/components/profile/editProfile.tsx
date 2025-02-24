"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoCameraSharp } from "react-icons/io5";
import { useParams } from "next/navigation";
import {
  fetchUserData,
  updateUserProfile,
} from "@/lib/store/thunks/user-thunks";
import { useAppDispatch } from "@/lib/store/hook";
import { toast } from "react-toastify";

interface EditProfileProps {
  user: {
    name: string;
    bio?: string;
    pfp?: string;
    web?: string;
    location?: string;
    header?: string;
  };
  onClose: () => void;
  onSave?: (updatedProfile: {
    name: string;
    bio: string;
    pfp: string;
    web: string;
    location: string;
    header: string;
  }) => void;
}

const EditProfileModal: React.FC<EditProfileProps> = ({ user, onClose }) => {
  const { userName }: { userName: string } = useParams();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");
  const [web, setWeb] = useState(user.web || "");
  const [header, setHeader] = useState<File | null>(null);
  const [previewBgImage, setPreviewBgImage] = useState<string>(
    user.header || ""
  );
  const [pfp, setPfp] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(user.pfp || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPfp(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeader(file);
      setPreviewBgImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateUserProfile({
          userName,
          name,
          bio,
          location,
          web,
          pfp,
          header,
        })
      ).unwrap();
      toast.success("updated successfully");
      onClose();
      await dispatch(fetchUserData(userName));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-black text-white rounded-lg shadow-lg w-full max-w-2xl border border-gray-600">
        <div className="flex justify-between items-center p-4 ">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-light"
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            onClick={handleSubmit}
            className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 transition"
          >
            Save
          </button>
        </div>
        <div className="overflow-y-auto max-h-[76vh]">
          <div className="relative w-full h-44 bg-black flex justify-center items-center">
            {previewBgImage && (
              <Image
                src={previewBgImage}
                alt="Background"
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            )}
            <label
              htmlFor="header"
              className="absolute bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600 transition"
            >
              <IoCameraSharp className="text-white text-xl" />
              <input
                type="file"
                name="image"
                id="header"
                className="hidden"
                accept="image/*"
                onChange={handleBgImageChange}
              />
            </label>
            <div className="absolute -bottom-14 left-4 w-28 h-28 rounded-full border-4 border-black overflow-hidden">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="bg-gray-600 w-full h-full flex items-center justify-center">
                  <IoCameraSharp className="text-white text-4xl" />
                </div>
              )}
            </div>
            <label
              htmlFor="pfp"
              className="absolute -bottom-12 left-[90px] bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600 transition"
            >
              <IoCameraSharp className="text-white" />
              <input
                type="file"
                name="image"
                id="pfp"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="p-6 mt-9 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-black border-gray-600 border text-white rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 bg-black border-gray-600 border text-white rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Tell the world about yourself"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-black border-gray-600 border text-white rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Your location"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Website
              </label>
              <input
                type="text"
                value={web}
                onChange={(e) => setWeb(e.target.value)}
                className="w-full p-2 bg-black border-gray-600 border text-white rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Your website"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
