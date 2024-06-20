import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import UserDetails from "@/miscellaneous/UserDetails";
import SelectedChat from "@/miscellaneous/SelectedChat";
import SelectedGroup from "@/miscellaneous/SelectedGroup";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/ui/Sidebar";
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
          <div className="flex flex-1 flex-col justify-between  ">
            <div className="bg-[#202C33] flex items-center ">
              <Sheet open={openSidebar}>
                <div
                  onClick={() => setOpenSidebar(true)}
                  className=" lg:hidden  block"
                >
                  <i className="fa-solid  fa-bars  text-xl sm:text-2xl mx-4 font-semibold cursor-pointer"></i>
                </div>

                <SheetContent
                  side="left"
                  className="flex flex-1 w-full p-0 text-white bg-[#111B21] border-none "
                >
                  <div className="flex flex-1 w-full mt-6 py-2  ">
                    <div className=" flex  ">
                      <Sidebar />
                    </div>
                    <div className="flex-1 flex   bg-[#111B21]  ">
                      {<Outlet />}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <p className="px-2 flex flex-1 justify-center items-center py-5 text-2xl italic font-bold  text-center">
                Welcome To Whatsapp Clone
              </p>
            </div>
            <div className="flex flex-1 "></div>

            <div className="bg-[#202C33]">
              <p className="p-4 text-lg font-semibold text-slate-300 italic text-center">
                This Template is made by Talha Mehmood | Full Stack Developer
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Details;
