import { useGlobalContext } from "@/context/GlobalContext";
import { formatTimestamp } from "@/utils/DateFormat";
import React from "react";

const CommonGroupsOfSelectedUser = ({ groups }) => {
  const { user, setSelectedGroup, setSelectedUser } = useGlobalContext();
  const handleGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };
  return (
    <div className="bg-slate-900 p-2 flex flex-col space-y-1 divide-y divide-slate-700 ">
      {groups?.map((group) => (
        <div
          // onClick={(group) => handleGroup(group)}
          className="flex items-center  py-2 space-x-2 w-full "
          key={group._id}
        >
          <img
            src={group.groupPicture}
            alt={group.chatName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center justify-between ">
              <p className="text-lg">
                {group.chatName} (+{group.totalUsers})
              </p>
              <p className="text-slate-300 font-thin text-sm">
                {group.lastMessage &&
                  formatTimestamp(group.lastMessage.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-slate-200 font-thin">
                {user?._id === group?.sender?._id
                  ? "You"
                  : group?.sender?.fullname}{" "}
                :
                {group.lastMessage
                  ? group.lastMessage.message
                  : "no messages yet"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommonGroupsOfSelectedUser;
