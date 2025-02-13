/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import Image from "next/image";

const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log(
        "Sending request to:",
        "http://localhost:3008/api/auth/send_otp"
      );
      console.log("Form Data Before Sending:", {
        name,
        userName, // Check if this exists
        email,
        password,
      });

      const res = await axiosInstance.post("api/auth/send_otp", {
        name,
        userName, // Change this to match backend
        email,
        password,
      });

      console.log(res);

      console.log("Response from backend:", res.data);

      localStorage.setItem(
        "registration",
        JSON.stringify({ name, userName, email,password })
      );
      alert("OTP sent to your email. Please verify!");
      router.push("/verify-otp");
    } catch (err: any) {
      console.error("Full error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      {/* Main Container */}
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/twitter-logo.png"
            width={48}
            height={48}
            alt="X Logo"
            className="max-w-[48px]"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center tracking-tight">
          Create your account
        </h1>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
