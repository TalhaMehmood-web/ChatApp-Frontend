import { fetchData } from "@/api/fetchData";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useGlobalContext } from "@/context/GlobalContext";
import ConversationItem from "@/components/ui/ConversationItem";
const Archive = () => {
  const { user, setSelectedUser, setSelectedChat, setSelectedGroup } =
    useGlobalContext();

  const { data: archives } = useQuery(["archives", user?._id], () =>
    fetchData(`archive/${user?._id}`)
  );
  // console.log(archives);
  const handleSelectedChat = (chat) => {
    setSelectedUser(null);
    if (chat?.isGroupChat) {
      setSelectedGroup(chat);
      setSelectedChat(null);
    }
    if (!chat.isGroupChat) {
      setSelectedChat(chat);
      setSelectedGroup(null);
    }
  };
  return (
    <div className="flex flex-1 flex-col space-y-3 p-5">
      <p className="text-2xl bg-slate-800 py-3 px-2 text-center font-bold">
        Archives
      </p>

      <div className="flex flex-1 flex-col">
        {archives?.length > 0 ? (
          archives?.map((archive) => (
            <ConversationItem
              key={archive._id}
              name={
                archive?.chat.isGroupChat
                  ? archive?.chat?.chatName
                  : archive?.chat.user?.fullname
              }
              picture={
                archive?.chat.isGroupChat
                  ? archive?.chat?.groupPicture
                  : archive?.chat.user?.picture
              }
              lastMessage={archive?.chat.lastMessage?.message}
              date={archive?.chat.lastMessage?.createdAt}
              chatId={archive?.chat?._id}
              onClick={() => handleSelectedChat(archive?.chat)}
              isGroupChat={archive?.chat?.isGroupChat}
              options={true}
              oneOnOneChat={archive?.chat?.isGroupChat ? false : true}
              isArchive={true}
              itemId={archive?.chat?._id}
              userId={
                archive?.chat.isGroupChat ? null : archive?.chat?.user?._id
              }
              archiveId={archive?._id}
              senderName={
                archive.chat.lastMessage && archive.chat.lastMessage.senderName
              }
            />
          ))
        ) : (
          <p className="text-2xl italic font-semibold flex flex-1 justify-center items-center ">
            Archive is Empty
          </p>
        )}
      </div>
    </div>
  );
};

export default Archive;
