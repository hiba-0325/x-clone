
"use client";

import { useState } from "react";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("api/auth/login", {
        email,
        password,
      });
  
      const user = {
        token: res.data.accessToken,
        id: res.data.userId, // If needed
      };
  
      // ✅ Store in Cookies (Expires in 7 days)
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
  
      // ✅ Also store in localStorage (if needed)
      localStorage.setItem("token", res.data.accessToken); 
  
      console.log("✅ Token stored in Cookies & localStorage:", Cookies.get("user"));
  
      // Redirect to home
      router.push("/home"); 
    } catch (err) {
      setError(axiosErrorCatch(err));
    }
  };

  return (
    <div className="flex justify-center items-center  bg-black text-white">
      <div className="p-6 bg-gray-900 rounded-xl shadow-lg w-96">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/twitter-logo.png"
            width={50}
            height={50}
            alt="X Logo"
          />
        </div>

        <h1 className="text-2xl font-bold text-center">Sign in to X</h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-500 outline-none"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full mt-4"
          >
            Login
          </button>
        </form>

        {/* <p className="text-center text-gray-400 text-sm ">
          Dont have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p> */}
      </div>
    </div>
  );
};
export default LoginForm;
