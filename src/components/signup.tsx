"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/signin");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="text-4xl mb-6">Sign Up</div>
        <div className="flex flex-col space-y-6 font-normal">
          <input
            placeholder="Name"
            className="py-4 px-5 w-[350px] text-black rounded-md"
            required
          />
          <input
            placeholder="Age"
            type="number"
            className="py-4 px-5 w-[350px] text-black rounded-md"
            required
          />
          <input
            placeholder="Username"
            className="py-4 px-5 w-[350px] text-black rounded-md"
            required
          />
          <div className="relative w-[350px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="py-4 px-5 w-full text-black rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && 
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                <Image src="/visible.svg" alt="visible" width={20} height={20} />
              </div>
            }
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg py-3 px-5 w-[350px] text-white bg-red"
        >
          Submit
        </button>
        <div className="flex flex-row space-x-2 mt-2">
          <div className="text-gray-300">Already have an account?</div>
          <div
            className="hover:underline hover:cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Sign In.
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
