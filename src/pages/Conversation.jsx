import React, { useState, useEffect } from "react";
import ConversationItem from "../components/ui/ConversationItem";
import { useGlobalContext } from "@/context/GlobalContext";
import { useQuery } from "react-query";
import { fetchData } from "@/api/fetchData";
import ConversationSkeleton from "@/skeleton/ConversationSkeleton";
const Conversation = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const {
    user,
    setSelectedUser,
    setSelectedGroup,
    setSelectedChat,
    setSelectedStarred,
  } = useGlobalContext();
  const { data: chats, isLoading } = useQuery(["chats", user?._id], () =>
    fetchData(`chat/fetch-chats/${user?._id}`)
  );

  const handleSelectedChat = (chat) => {
    setSelectedUser(null);
    setSelectedChat(chat);
    setSelectedGroup(null);
    setSelectedStarred(null);
  };
  return (
    <div className="flex flex-1 flex-col p-3">
      <div className="flex w-full h-fit items-center justify-between p-2">
        <p className="text-2xl font-bold">Chats</p>
        <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
      </div>
      <div className="flex  justify-between space-x-5 my-4">
        <div className="flex flex-1 items-center bg-[#202C33] rounded-md  ">
          {searchFocus ? (
            <i
              onClick={() => setSearchFocus(false)}
              className={`fa-solid  fa-arrow-left  px-3  text-green-500  cursor-pointer `}
            ></i>
          ) : (
            <i className="fa-solid fa-magnifying-glass px-3 text-[#3f505a] "></i>
          )}
          <input
            onFocus={() => setSearchFocus(true)}
            className=" flex flex-1 px-3 py-2 outline-none border-none bg-transparent"
            type="search"
            placeholder="Search"
          />
        </div>
        <i className="fa-solid py-2 fa-bars-staggered"></i>
      </div>
      <div className="flex flex-1 flex-col max-h-[35rem]  overflow-y-scroll scroll">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ConversationSkeleton key={index} />
            ))
          : chats?.map((chat, index) => (
              <ConversationItem
                key={chat._id}
                name={chat.user.fullname}
                picture={chat.user.picture}
                lastMessage={chat.lastMessage && chat.lastMessage.message}
                id={chat.user._id}
                chatId={chat?._id}
                itemId={chat?._id}
                userId={chat?.user._id}
                date={chat.lastMessage && chat.lastMessage.createdAt}
                messageSenderId={chat.lastMessage && chat.lastMessage.senderId}
                onClick={() => handleSelectedChat(chat)}
                options={true}
                oneOnOneChat={true}
                isGroupChat={false}
                senderName={chat.user.fullname}
                isArchive={false}
              />
            ))}
        {chats?.length === 0 && (
          <div className="flex flex-1 text-2xl font-semibold italic justify-center items-center">
            No Chats Yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
