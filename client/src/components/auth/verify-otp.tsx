
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import Image from "next/image";

const VerifyOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
 const [ password,setPassword]= useState("")
  useEffect(() => {
    const registrationData = localStorage.getItem("registration");
    if (registrationData) {
      setEmail(JSON.parse(registrationData).email);
      setName(JSON.parse(registrationData).name);
      setUserName(JSON.parse(registrationData).userName);
      setPassword(JSON.parse(registrationData).password)

    } else {
      router.push("/register"); 
    }
  }, [router]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("api/auth/register", { email, otp ,name,userName,password});
      if (res.data.success) {
        alert("OTP Verified! Registration successful.");
        localStorage.removeItem("registration");
        router.push("/login");
      }
    } catch (err) {
      setError(axiosErrorCatch(err));
    }
  }; 

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl space-y-6">
        <div className="flex justify-center">
          <Image src="/images/twitter-logo.png" width={48} height={48} alt="X Logo" className="max-w-[48px]" />
        </div>
        <h1 className="text-3xl font-bold text-center tracking-tight">Verify OTP</h1>
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
