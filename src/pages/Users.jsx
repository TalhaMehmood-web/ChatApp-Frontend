import React, { useState } from "react";
import ConversationItem from "../components/ui/ConversationItem";
import { useQuery } from "react-query";
import { fetchData } from "@/api/fetchData";
import { useGlobalContext } from "@/context/GlobalContext";
import ConversationSkeleton from "@/skeleton/ConversationSkeleton";
const Users = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const {
    setSelectedUser,
    setSelectedChat,
    setSelectedGroup,
    setSelectedStarred,
  } = useGlobalContext();
  const { data: users, isLoading } = useQuery("users", () =>
    fetchData("user/get-users")
  );

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
    setSelectedChat(null);
    setSelectedGroup(null);
    setSelectedStarred(null);
  };
  return (
    <div className="flex flex-col flex-1 p-2  sm:p-3">
      <div className="flex items-center justify-between w-full p-2 h-fit">
        <p className="text-2xl font-bold">Users</p>
        <i className="text-xl fa-solid fa-ellipsis-vertical"></i>
      </div>
      <div className="flex justify-between my-4 space-x-5">
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
            className="flex flex-1 px-3 py-2 bg-transparent border-none outline-none "
            type="search"
            placeholder="Search"
          />
        </div>
        <i className="py-2 fa-solid fa-bars-staggered"></i>
      </div>
      <div className="flex flex-1  flex-col max-h-[35rem]  overflow-y-scroll scroll">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <ConversationSkeleton key={index} />
          ))}
        {!isLoading &&
          users &&
          users?.map((user, index) => (
            <ConversationItem
              key={user._id}
              userId={user._id}
              itemId={user._id}
              name={user.fullname}
              picture={user.picture}
              email={user.email}
              phoneNumber={user.phoneNumber}
              onClick={() => handleSelectedUser(user)}
              options={false}
              oneOnOneChat={false}
              isGroupChat={false}
            />
          ))}
        {!isLoading && !users && (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-2xl font-semibold italic">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
