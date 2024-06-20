import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "@/data/navigationRoutes";
import { useGlobalContext } from "@/context/GlobalContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import Route from "./Route";
const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  return (
    <div
      className={`flex flex-col bg-[#202C33] justify-between py-4 w-16 sm:w-20 duration-300 ease-in-out transition-all`}
    >
      <div className="flex flex-col space-y-3">
        {navigationRoutes?.map((route, index) => (
          <Route
            key={route.title + index}
            icon={route.icon}
            route={route.route}
            title={route.title}
            onClick={() => navigate(route.route)}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-3">
        <Route
          icon={"fa-gear"}
          route={"/chats/settings"}
          title={"Settings"}
          onClick={() => navigate("/chats/settings")}
        />

        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div
                onClick={() => navigate("/chats/profile")}
                className={`flex items-center space-x-3 p-3 w-full cursor-pointer hover:bg-[#374248] justify-center`}
              >
                <img
                  className="w-8 h-8 rounded-full  object-cover"
                  src={user?.picture}
                  alt={user?.fullname}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="bg-slate-700 rounded-full text-white border-none"
              side="right"
            >
              <p className="rounded-full"> Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
