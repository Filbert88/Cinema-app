"use client";
import EditProfileForm from "./editProfile";
import { useState } from "react";
import DimmedLoad from "./dimmedLoad";
import Toast from "./toast";
import { ToastState } from "./balance";

interface UserProfile {
  name: string | null;
  email: string;
  balance: number;
}

const Profile = ({ name, email, balance }: UserProfile) => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({ name, email, balance });
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const showToast = (message: string, type: "info" | "error" | "success") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  return (
    <div className="bg-black min-h-screen flex items-center">
      {loading ? (
        <DimmedLoad />
      ) : (
        <div className="container mx-auto flex flex-col items-center p-20 relative bottom-20">
          <h1 className="text-4xl font-bold">User Profile</h1>
          {editing ? (
            <EditProfileForm
              user={user}
              setUser={setUser}
              setEditing={setEditing}
              setLoading={setLoading}
              showToast={showToast}
            />
          ) : (
            <>
              <div className="flex flex-col text-center mt-4">
                <div className="font-thin text-xl">Name</div>
                <div className="font-semibold text-2xl">{user.name}</div>
              </div>
              <div className="flex flex-col text-center mt-3">
                <div className="font-thin text-xl">Email</div>
                <div className="font-semibold text-2xl">{user.email}</div>
              </div>
              <div className="flex flex-col mt-3 text-center">
                <div className="font-thin text-xl">Balance</div>
                <div className="font-semibold text-2xl">
                  {formatRupiah(user.balance)}
                </div>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      )}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        closeToast={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default Profile;
