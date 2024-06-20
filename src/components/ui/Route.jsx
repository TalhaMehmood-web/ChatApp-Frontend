import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { useQueryClient } from "react-query";
import { useGlobalContext } from "@/context/GlobalContext";
const Route = ({ icon, onClick, route, title }) => {
  const location = useLocation();
  const { user, notificationsLength } = useGlobalContext();
  const isActive = location.pathname === route;
  const bgColor = isActive
    ? "bg-[#374248] text-white"
    : "bg-transparent text-slate-300 ";
  const shakeBellIcon = icon === "fa-bell" && "shake";
  const queryClient = useQueryClient();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`flex relative items-center duration-500 space-x-3 cursor-pointer hover:bg-[#374248] p-3 justify-center ${bgColor} duration-200`}
          >
            <i
              className={`fa-solid ${icon}  ${shakeBellIcon} text-normal  sm:text-lg`}
            ></i>
            {icon === "fa-bell" && (
              <span className="inline-flex absolute  right-2 top-0  sm:top-1 sm:right-5 items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-100 bg-green-600 rounded-full">
                {notificationsLength > 0 ? notificationsLength : "0"}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-slate-700 rounded-full text-white border-none"
          side="right"
        >
          <p className="rounded-full">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Route;
