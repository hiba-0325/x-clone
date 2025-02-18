"use client";
// import { authLogin } from "@/lib/store/thunks/auth-thunks";
// import { useAppDispatch } from "@/lib/store/hook";
// import { useSession, } from "next-auth/react";

// import { useRouter } from "next/navigation";
import React, {  useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";

export default function Home() {
 
  // const router = useRouter();
  // const dispatch = useAppDispatch();

  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  // // Handle session-based redirection
  // useEffect(() => {
  //   if (session?.user?.email) {
  //     const userEmail = session.user.email;
  //     const fetchData = async () => {
  //       try {
  //         const res = await dispatch(authLogin(userEmail)).unwrap();
  //         if (res.message === "Login successful") {
  //           localStorage.setItem("loginedUser", JSON.stringify(true));
  //           localStorage.setItem("status", JSON.stringify("forYou"));
  //           router.push("/home");
  //         } else if (res.message === "User not found") {
  //           localStorage.setItem(
  //             "registration",
  //             JSON.stringify({
  //               name: session?.user?.name,
  //               email: session?.user?.email,
  //               image: session?.user?.image,
  //             })
  //           );
  //           router.push("/verify-username");
  //         }
  //       } catch (error) {
  //         console.error("Error during session handling:", error);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [session?.user, dispatch, router]);

  // Handle form submission


  return (
    <div className="flex justify-center md:flex-row h-screen bg-black text-white">
      {/* Left Side - Logo */}
  
      {/* Right Side - Auth Form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-6">
        <h1 className="text-4xl md:text-6xl font-extrabold">Happening Now</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">Join today.</h2>
      <br></br>

        {/* Password Input (only visible in login mode) */}
        {isLogin ? <LoginForm /> : <RegisterForm />}

        {/* Toggle between Sign In and Sign Up */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
