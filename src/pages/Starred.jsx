import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { fetchData } from "@/api/fetchData";
import { useGlobalContext } from "@/context/GlobalContext";
import { formatTimestamp } from "@/utils/DateFormat";

const Starred = () => {
  const {
    user,
    setSelectedChat,
    setSelectedGroup,
    setSelectedUser,
    selectedStarred,
    setSelectedStarred,
    setOpenSidebar,
  } = useGlobalContext();

  const { data: starred } = useQuery(
    ["starred", user?._id],
    () => fetchData(`message/starred/${user?._id}`),
    {
      enabled: !!user?._id,
    }
  );

  const handleClick = useCallback(
    (chat, isGroupChat, starId) => {
      setOpenSidebar(false);
      setSelectedStarred(starId);
      setSelectedUser(null);
      if (isGroupChat) {
        setSelectedGroup(chat);
        setSelectedChat(null);
      } else {
        setSelectedChat(chat);
        setSelectedGroup(null);
      }
    },
    [
      setOpenSidebar,
      setSelectedStarred,
      setSelectedUser,
      setSelectedGroup,
      setSelectedChat,
    ]
  );

  const starredList = useMemo(
    () =>
      starred?.map((star) => (
        <div
          className={`flex w-full ${
            star._id === selectedStarred
              ? " bg-[#283b47] "
              : " bg-[#121d24] hover:bg-[#192831]"
          } text-sm cursor-pointer duration-300 border-b border-slate-700/50 p-3 space-x-2`}
          key={star._id}
          onClick={() => handleClick(star.chat, star.isGroupChat, star._id)}
        >
          <img
            src={star.sentBy.picture}
            className="w-8 h-8 rounded-full object-cover"
            alt={star.sentBy.name}
          />
          <div className="flex flex-col w-full justify-between space-y-2">
            <div className="flex w-full space-x-3 justify-between items-center">
              <div className="flex items-center space-x-2">
                <span>{star.sentBy.name}</span>
                <i className="fa-solid fa-caret-right text-[10px] text-slate-400"></i>
                <span>{star.receivedBy}</span>
              </div>
              <div>
                <p className="text-[10px]">{formatTimestamp(star.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-1 justify-between items-center space-x-2">
              <div
                className={`flex justify-between space-x-5 flex-1 ${
                  star.sentBy._id === user?._id
                    ? "bg-[#005C4B]"
                    : "bg-[#000000]"
                } py-1 pr-4 pl-2 rounded-md max-w-fit`}
              >
                <p>{star.message}</p>
                <i className="fa-solid flex items-end text-end fa-star text-[9px]"></i>
              </div>
              <i className="fa-solid fa-angles-right text-slate-300"></i>
            </div>
          </div>
        </div>
      )),
    [starred, selectedStarred, handleClick, user]
  );

  return (
    <div className="flex flex-1 space-y-3 flex-col">
      <div className="px-5 pt-5 pb-1">
        <p className="text-2xl bg-slate-800 py-3 px-2 text-center font-bold">
          Starred
        </p>
      </div>
      <div className="flex flex-col flex-1 max-h-[620px] px-2 py-2 overflow-x-hidden overflow-y-scroll scroll scroll-smooth">
        {starredList}
        {!starred ||
          (starred?.length === 0 && (
            <div className="flex text-2xl font-semibold italic flex-1 justify-center items-center">
              Starred is Empty
            </div>
          ))}
      </div>
    </div>
  );
};

export default Starred;
