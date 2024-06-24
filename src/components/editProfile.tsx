"use client";
import { useState } from "react";
import Toast from "./toast";
import Balance, { ToastState } from "./balance";
import { signIn, useSession } from "next-auth/react";
import DimmedLoad from "./dimmedLoad";

interface UserProfile {
  name: string | null;
  email: string;
  balance: number;
}

interface EditProfileFormProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  setEditing: (editing: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: "info" | "error" | "success") => void;
}

const EditProfileForm = ({
  user,
  setUser,
  setEditing,
  setLoading, 
  showToast
}: EditProfileFormProps) => {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    password: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "error",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password.length < 6) {
      setToast({
        isOpen: true,
        message: "Password must be more than 6 characters long!",
        type: "error",
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setToast({
        isOpen: true,
        message: "Password do not match!",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, name: updatedUser.name, email: updatedUser.email });
        setEditing(false);

        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email,
            Balance: updatedUser.balance,
          },
        });

        showToast("Profile updated successfully!", "success");
      } else {
        const errorData = await response.json();
        setToast({
          isOpen: true,
          message: errorData.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setToast({
        isOpen: true,
        message: "Failed to update profile",
        type: "error",
      });
    } finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="p-4 rounded-md" onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:{" "}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full text-black"
          />
        </label>
        <label className="block mb-2">
          Email:{" "}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full text-black"
          />
        </label>
        <label className="block mb-2">
          New Password:{" "}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded w-full text-black"
          />
        </label>
        <label className="block mb-2">
          Confirm Password:{" "}
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border p-2 rounded w-full text-black"
          />
        </label>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Profile
        </button>
        <button
          className="ml-2 bg-red text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>
      </form>
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        closeToast={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};
export default EditProfileForm;
