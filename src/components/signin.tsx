"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";  
import { signIn } from "next-auth/react";

interface Errors {
  email: string;
  password: string;
}

interface Touched {
  email: boolean;
  password: boolean;
}

const Signin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const [touched, setTouched] = useState<Touched>({ email: false, password: false });
  const [submitError, setSubmitError] = useState<string>("");

  const handleBlur = (field: keyof Touched): void => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") {
      setErrors({ ...errors, email: validateEmail(email) });
    } else {
      setErrors({ ...errors, password: validatePassword(password) });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter a valid email.";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required.";
    } else if (password.length < 4 || password.length > 60) {
      return "Your password must contain between 4 and 60 characters.";
    }
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log(result)
    if (result?.error) {
      setSubmitError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative bottom-20 flex w-full max-w-xs flex-col gap-5 sm:bottom-0 lg:bottom-20 xl:gap-7">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="text-4xl mb-6 font-bold">Sign In</div>
        {submitError && <div className="text-red mb-4">{submitError}</div>}
        <div className="flex flex-col space-y-6 font-normal items-center">
          <input
            placeholder="Email"
            className="py-4 px-5 w-[350px] text-black rounded-md"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur("email")}
            required
          />
          {touched.email && errors.email && <div className="text-red-500 text-xs w-[350px] mt-1">{errors.email}</div>}
          <div className="relative w-[350px]">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="py-4 px-5 w-full text-black rounded-md"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              required
            />
            {password && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                <Image src="/visible.svg" alt="Toggle visibility" width={20} height={20} />
              </div>
            )}
          </div>
          {touched.password && errors.password && <div className="text-red-500 text-xs w-[350px] mt-1">{errors.password}</div>}
        </div>
        <button type="submit" className="mt-4 rounded-lg py-3 px-5 w-[350px] text-white bg-red">
          Sign In
        </button>
        <div className="flex flex-row space-x-2 mt-2">
          <div className="text-gray-300">New here?</div>
          <a className="hover:underline hover:cursor-pointer" onClick={() => router.push("/signup")}>Sign up now.</a>
        </div>
      </form>
    </div>
  );
};

export default Signin;
