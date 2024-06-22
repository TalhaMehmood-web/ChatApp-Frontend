import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import UserDetails from "@/miscellaneous/UserDetails";
import SelectedChat from "@/miscellaneous/SelectedChat";
import SelectedGroup from "@/miscellaneous/SelectedGroup";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/ui/Sidebar";
import logo from "../assets/whatsapp.png";
import { Outlet } from "react-router-dom";
const Details = () => {
  const {
    selectedUser,
    selectedChat,
    selectedGroup,
    openSidebar,
    setOpenSidebar,
  } = useGlobalContext();
  return (
    <div className="flex flex-1">
      {selectedUser !== null &&
        selectedChat === null &&
        selectedGroup === null && <UserDetails />}
      {selectedUser === null &&
        selectedChat !== null &&
        selectedGroup === null && <SelectedChat />}
      {selectedUser === null &&
        selectedChat === null &&
        selectedGroup !== null && <SelectedGroup />}
      {selectedUser === null &&
        selectedChat === null &&
        selectedGroup === null && (
          <div className="flex flex-col justify-between flex-1 ">
            <div className="bg-[#202C33] flex items-center ">
              <Sheet open={openSidebar}>
                <div
                  onClick={() => setOpenSidebar(true)}
                  className="block lg:hidden"
                >
                  <i className="mx-4 text-xl font-semibold cursor-pointer fa-solid fa-bars sm:text-2xl"></i>
                </div>

                <SheetContent
                  setOpenSidebar={() => setOpenSidebar(false)}
                  side="left"
                  className="flex flex-1 w-full p-0 text-white bg-[#111B21] border-none "
                >
                  <div className="flex flex-1 w-full py-2 mt-6 ">
                    <div className="flex ">
                      <Sidebar />
                    </div>
                    <div className="flex-1 flex   bg-[#111B21]  ">
                      {<Outlet />}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <p className="flex items-center justify-center flex-1 px-2 py-5 text-2xl italic font-bold text-center">
                Welcome To Whatsapp Clone
              </p>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              {/* logo */}
              <img
                src={logo}
                alt="image"
                className="object-contain lg:w-[70%] lg:h-[70%] "
              />
              <p className="text-center text-slate-400 sm:text-base text-[10px] ">
                Send one-on-one and group messages with archives and real time
                notifications <br />
                Be a group admin to add or remove the user. Star your favorite
                messages and keep tracking them
              </p>
            </div>

            <div className="bg-[#202C33]">
              <p className="p-4 text-lg italic font-semibold text-center text-slate-300">
                This Template is made by Talha Mehmood | Full Stack Developer
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Details;
