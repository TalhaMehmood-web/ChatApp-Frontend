import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import SettingsItem from "@/components/ui/SettingsItem";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { postData } from "@/api/postData";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser, setSelectedUser, setSelectedChat, setSelectedGroup } =
    useGlobalContext();
  const logoutMutation = useMutation(() => postData("user/logout", null), {
    onSuccess: () => {
      navigate("/");
      localStorage.removeItem("user");
      toast.success("Logged out");
      setUser(null);
      setSelectedUser(null);
      setSelectedChat(null);
      setSelectedGroup(null);
    },
  });
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };
  return (
    <div className="flex flex-1 flex-col  text-slate-100">
      <p className="font-bold text-2xl p-5 ">Settings</p>
      <div
        onClick={() => navigate("/chats/profile")}
        className="flex justify-center  items-center flex-col   hover:bg-[#233138] cursor-pointer p-5 duration-200 rounded-md"
      >
        <img
          className="rounded-full w-52 h-52 duration-200 xl:w-52 xl:h-52 md:w-40 md:h-40 object-cover "
          src={user?.picture}
          alt={user?.fullname}
        />
        <div className="flex space-y-1 justify-center flex-col items-center my-2 bg-slate-800/60 flex-1 w-full p-2 rounded-md">
          <p className="text-lg font-semibold">{user?.fullname}</p>
          <p className="text-slate-400">{user?.about}</p>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <SettingsItem
          icon={"fa-key"}
          color={"text-slate-300"}
          title={"Change Password"}
          onClick={() => navigate("/change-password")}
        />
        <SettingsItem
          icon={"fa-user"}
          color={"text-slate-300 "}
          title={"Update Profile"}
          onClick={() => navigate("/update-profile")}
        />
        <SettingsItem
          icon={"fa-arrow-right-from-bracket"}
          color={"text-red-500"}
          title={"Log out"}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Settings;
