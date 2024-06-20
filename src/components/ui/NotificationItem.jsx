import React from "react";
import { useSocketContext } from "@/context/SocketContext";
import Indicator from "./Indicator";
import { formatTimestamp } from "@/utils/DateFormat";
const NotificationItem = ({
  senderName,
  senderPicture,
  message,
  date,
  senderId,
  notificationIndex,
}) => {
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers?.find((user) => user === senderId);
  const indicatorColor = isOnline ? "bg-green-500 animate-pulse" : "bg-red-500";
  const notificationBg = notificationIndex % 2 === 0 ? "bg-[#202C33]" : "";
  return (
    <div
      className={`flex items-center relative justify-between w-full space-x-3 px-4 py-2 ${notificationBg}`}
    >
      <div className="flex justify-start items-start h-full">
        <img
          src={senderPicture}
          alt={senderName}
          className="w-12 h-12 rounded-full object-cover  "
        />
      </div>
      <Indicator color={indicatorColor} />
      <div className="flex flex-1 flex-col space-y-1 ">
        <p>{senderName}</p>
        <p className="font-light text-slate-300 text-sm">{message}</p>
      </div>
      <div className="flex justify-start items-start  h-full">
        <p className="text-[9px] ">{formatTimestamp(date)}</p>
      </div>
    </div>
  );
};

export default NotificationItem;
