import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSocketContext } from "@/context/SocketContext";
import Indicator from "./Indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useMutation, useQueryClient } from "react-query";
import { postData } from "@/api/postData";
import { deleteData } from "@/api/deleteData";
import { formatTimestamp } from "@/utils/DateFormat";
const ConversationItem = ({
  userId,
  name,
  picture,
  date,
  lastMessage,
  email,
  phoneNumber,
  onClick,
  isGroupChat,
  oneOnOneChat,
  options,
  chatId,
  isArchive,
  itemId,
  archiveId,
  messageSenderId,
  senderName,
}) => {
  const { onlineUsers } = useSocketContext();
  const queryClient = useQueryClient();
  const { selectedUser, selectedChat, selectedGroup, user, setOpenSidebar } =
    useGlobalContext();
  const conversationBg =
    selectedUser?._id === itemId ||
    selectedChat?._id === itemId ||
    selectedGroup?._id === itemId
      ? "bg-[#202C33]"
      : "";
  const conversationHover =
    selectedUser?._id !== userId && "hover:bg-[#323b413a]";
  const isOnline = onlineUsers?.find((user) => user === userId);
  const indicatorColor = isOnline ? "bg-green-500 animate-pulse" : "bg-red-500";
  // handlers
  const addToArchiveMutation = useMutation(
    () => postData(`archive/${chatId}`),
    {
      onMutate: () => {
        if (isGroupChat) {
          queryClient.setQueryData("groups", (prevGroups) => {
            return prevGroups?.filter((chat) => chat._id !== chatId);
          });
        }
        if (oneOnOneChat) {
          queryClient.setQueryData("chats", (prevChats) => {
            return prevChats?.filter((chat) => chat._id !== chatId);
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["archives", user?._id]);
        if (isGroupChat) {
          queryClient.invalidateQueries("groups");
        }
        if (oneOnOneChat) {
          queryClient.invalidateQueries("chats");
        }
      },
    }
  );
  const removeFromArchiveMutation = useMutation(
    () => deleteData(`archive/${archiveId}`),
    {
      onMutate: () => {
        queryClient.setQueryData(["archives", user?._id], (prevData) => {
          return prevData.filter((archive) => archive._id !== archiveId);
        });
      },

      onSuccess: () => {
        queryClient.invalidateQueries(["archives", user?._id]);
        if (isGroupChat) {
          queryClient.invalidateQueries("groups");
        } else {
          queryClient.invalidateQueries("chats");
        }
      },
    }
  );
  const handleArchive = async () => {
    await addToArchiveMutation.mutateAsync();
  };
  const removeFromArchive = async () => {
    await removeFromArchiveMutation.mutateAsync();
  };
  return (
    <div
      onClick={() => setOpenSidebar(false)}
      className={`flex items-center  sm:px-2 relative   ${conversationBg} ${conversationHover}`}
    >
      <img
        className="object-cover border border-slate-600 sm:w-12 sm:h-12 h-10 w-10 rounded-full "
        src={picture}
        alt={name}
      />
      {!isGroupChat && (
        <div className="sm:block hidden ">
          <Indicator color={indicatorColor} />
        </div>
      )}
      <div className="flex items-start justify-between flex-1 py-2 mx-3 space-x-2 border-b border-slate-800 ">
        <div
          onClick={onClick}
          className="flex flex-col flex-1 space-y-2 cursor-pointer"
        >
          <div className="flex w-full justify-between items-center">
            <p className=" text-normal sm:text-lg whitespace-nowrap">{name}</p>
            {!isGroupChat && (
              <div className="block sm:hidden ">
                <span
                  className={`flex w-2  h-2 me-3  rounded-full ${indicatorColor}`}
                ></span>
              </div>
            )}
          </div>

          {options && (
            <p className="text-[#70818b]  text-sm me">
              {lastMessage
                ? `${
                    messageSenderId === user?._id ? "You" : senderName
                  } : ${lastMessage}`
                : "no messages yet"}
            </p>
          )}

          {email && <p className="text-[#70818b] text-sm">{email}</p>}
        </div>
        <div className="flex  flex-col  h-[50px] text-slate-300 ">
          {date && (
            <p className=" text-[10px] flex flex-1 sm:text-[12px] font-thin ">
              {formatTimestamp(date)}
            </p>
          )}
          {options && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <i className="fa-solid fa-angle-down flex  justify-end flex-1 items-end text-[12px] text-end sm:text-normal text-slate-300 cursor-pointer hover:text-white"></i>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[10rem] mr-3 sm:mr-20  bg-slate-600 border-none text-white ">
                {(isGroupChat || oneOnOneChat) && !isArchive ? (
                  <p
                    onClick={handleArchive}
                    className="text-start text-sm font-light p-2 hover:bg-slate-800 cursor-pointer"
                  >
                    Archive {isGroupChat ? "Group" : "Chat"}
                  </p>
                ) : (
                  <p
                    onClick={removeFromArchive}
                    className="text-start text-sm font-light p-2 hover:bg-slate-800 cursor-pointer"
                  >
                    UnArchive {isGroupChat ? "Group" : "Chat"}
                  </p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
