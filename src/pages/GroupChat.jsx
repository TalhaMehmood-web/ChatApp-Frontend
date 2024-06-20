import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/api/fetchData";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { postData } from "@/api/postData";
import { useGlobalContext } from "@/context/GlobalContext";
import ConversationSkeleton from "@/skeleton/ConversationSkeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import ConversationItem from "@/components/ui/ConversationItem";
const GroupChat = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [groupPicture, setGroupPicture] = useState(null);
  const [chatName, setChatName] = useState("");
  const [filterUsers, setFilterUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalText, setModalText] = useState("Submit");
  const {
    user,
    setSelectedUser,
    setSelectedChat,
    setSelectedGroup,
    setSelectedStarred,
  } = useGlobalContext();
  const queryClient = useQueryClient();
  // queries
  const { data: users } = useQuery("users", () => fetchData("user/get-users"));
  const { data: groups, isLoading: isGroupsLoading } = useQuery("groups", () =>
    fetchData(`chat/groups/${user?._id}`)
  );

  // mutations
  const createGroupMutation = useMutation(
    async () => {
      const userIds = selectedUsers?.map((user) => user._id);

      const formData = new FormData();
      formData.append("chatName", chatName);
      formData.append("stringifiedUsers", JSON.stringify(userIds));
      formData.append("groupPicture", groupPicture);
      return await postData("chat/group", formData);
    },
    {
      onMutate: () => {
        setModalText("Submitting...");
      },
      onSuccess: ({ data }) => {
        if (data) {
          setModalText("Submitted");
          toast.success("Group created successfully", {
            position: "bottom-right",
          });
          queryClient.invalidateQueries("groups");
          setChatName("");
          setSelectedUsers([]);
          setGroupPicture(null);
          setOpenModal(false);
        }
      },
    }
  );

  // create group handler
  const handleCreateGroup = async () => {
    if (chatName.trim() === "") {
      return toast.error("Group name is required", {
        position: "bottom-center",
      });
    }
    if (!groupPicture) {
      return toast.error("Group picture is required", {
        position: "bottom-center",
      });
    }
    if (selectedUsers && selectedUsers.length < 1) {
      return toast.error("At least one user is required for group ", {
        position: "bottom-left",
      });
    }
    await createGroupMutation.mutateAsync();
  };
  const handleSelectedGroup = (group) => {
    setSelectedUser(null);
    setSelectedChat(null);
    setSelectedGroup(group);
    setSelectedStarred(null);
  };
  // ui handlers

  const handleAddUser = (user) => {
    const isUserSelected = selectedUsers.some((u) => u._id === user._id);

    if (!isUserSelected) {
      setSelectedUsers((prevUsers) => [...prevUsers, user]);
    }
  };

  const excludeFromDisplay = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((u) => u._id !== user._id)
    );
  };
  //effects
  useEffect(() => {
    setFilterUsers(() => {
      return users?.filter((user) => {
        return user.fullname.toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }, [setFilterUsers, users, searchText]);

  return (
    <div className={"flex flex-1 flex-col "}>
      <div className="p-5  flex items-center justify-between">
        <p className=" text-2xl font-bold">Groups</p>
        <Dialog open={openModal}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setOpenModal(true);
                setModalText("Submit");
              }}
              className={"bg-blue-600  hover:bg-blue-500 focus:bg-blue-500"}
            >
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent
            setOpenModal={setOpenModal}
            className="w-[700px] overflow-y-scroll scroll bg-slate-900 text-white border-transparent flex  flex-col h-[90%] "
          >
            <div className="flex flex-1 flex-col  ">
              <div className="space-y-3 my-2">
                <Label className="text-xl" htmlFor={"groupName"}>
                  {"Group Name"}
                </Label>
                <Input
                  className="bg-transparent"
                  id="groupName"
                  name="groupName"
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Enter Group Name"
                />
              </div>
              <div className="space-y-3 my-2">
                <Label className="text-xl" htmlFor={"groupPicture"}>
                  {"Group Picture"}
                </Label>
                <Input
                  className="bg-transparent cursor-pointer"
                  id="groupPicture"
                  name="groupPicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setGroupPicture(file);
                  }}
                />
              </div>
              <div className="space-y-3 my-2">
                <p className="text-xl font-semibold">Search Users</p>
                <Input
                  className="bg-transparent"
                  type="search"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  placeholder="Search Users for Group"
                />
              </div>
              {/* selected users name */}
              <div className="flex flex-wrap items-center space-x-3 px-3 my-2">
                {selectedUsers?.map((user, index) => (
                  <div
                    className="border text-sm px-2 my-1 py-1 flex items-center space-x-1 rounded-lg bg-slate-800 "
                    key={user?._id + index}
                  >
                    <p>{user?.fullname}</p>
                    <i
                      onClick={() => excludeFromDisplay(user)}
                      className="fa-solid fa-xmark cursor-pointer"
                    ></i>
                  </div>
                ))}
              </div>
              {/* users list */}
              <div className="flex flex-col max-h-[250px] scroll-smooth space-y-2 bg-slate-700/10 rounded-md flex-1 p-2 overflow-y-scroll scroll">
                {filterUsers?.map((user) => (
                  <div
                    key={user?._id}
                    className="flex w-full space-x-2 items-center border p-2 rounded-md border-slate-700/70 "
                  >
                    <img
                      src={user.picture}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={user.fullname}
                    />
                    <div className="flex flex-1 justify-between   ">
                      <div className="flex flex-col space-y-1">
                        <p>{user.fullname}</p>
                        <p className="text-[#70818b] text-sm">{user.email}</p>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleAddUser(user)}
                          className="py-1 bg-slate-950 hover:bg-slate-950/70"
                        >
                          Add {user.fullname}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateGroup}
                type="submit"
                className="bg-slate-950  hover:bg-slate-950/70"
              >
                {modalText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between my-4 space-x-5 px-5">
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
      <div className="flex flex-1 flex-col px-5 ">
        {isGroupsLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ConversationSkeleton key={index} />
            ))
          : groups?.map((group) => (
              <ConversationItem
                key={group._id}
                name={group.chatName}
                picture={group.groupPicture}
                lastMessage={group.lastMessage && group.lastMessage.message}
                date={group.lastMessage && group.lastMessage.createdAt}
                id={group?._id}
                chatId={group?._id}
                itemId={group._id}
                onClick={() => handleSelectedGroup(group)}
                isGroupChat={true}
                options={true}
                isArchive={false}
                oneOnOneChat={false}
                senderName={group.lastMessage && group.lastMessage.senderName}
                messageSenderId={
                  group.lastMessage && group.lastMessage.senderId
                }
              />
            ))}
        {groups?.length === 0 && (
          <div className="flex flex-1 text-2xl font-semibold italic justify-center items-center">
            You are not in any Group
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
