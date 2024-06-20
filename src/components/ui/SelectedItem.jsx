import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useGlobalContext } from "@/context/GlobalContext";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageSkeleton from "@/skeleton/MessageSkeleton";
import Skeleton from "react-loading-skeleton";
import LeaveGroup from "./LeaveGroup";
import DeleteGroup from "@/miscellaneous/DeleteGroup";
import ViewUser from "@/miscellaneous/ViewUser";
import CommonGroupsOfSelectedUser from "@/miscellaneous/CommonGroupsOfSelectedUser";
const SelectedItem = React.forwardRef(
  (
    {
      isGroupChat,
      isUserDetails,
      displayItem,
      IndicatorStyles,
      messages,
      sendFriendRequest,
      acceptFriendRequest,
      isOnline,
      onMessageSent,
      groupMembers,
      onMessageChange,
      isGroupAdmin,
      setOpenModal,

      search,
      setSearch,
      selectedUsers,
      filterUsers,
      selectUsers,
      excludeFromDisplay,
      addNewParticipants,
      submitText,
      handleRemoveFromGroup,
      onGroupMessageSend,
      onGroupMessageChange,
      isMessagesLoading,
      detailsLoading,
      ...rest
    },
    ref
  ) => {
    const { selectedUser, user, openSidebar, setOpenSidebar } =
      useGlobalContext();
    return (
      <div className="flex flex-1 flex-col">
        <div className="bg-[#202C33] px-4 sm:py-2 flex items-center  space-x-4 ">
          <Sheet open={openSidebar}>
            <div
              onClick={() => setOpenSidebar(true)}
              className=" lg:hidden  block"
            >
              <i className="fa-solid  fa-bars text-xl sm:text-2xl font-semibold cursor-pointer"></i>
            </div>

            <SheetContent
              setOpenSidebar={setOpenSidebar}
              side="left"
              className="flex flex-1 w-full p-0 text-white bg-[#111B21] border-none "
            >
              <div className="flex flex-1 w-full mt-6 py-2  ">
                <div className=" flex  ">
                  <Sidebar />
                </div>
                <div className="flex-1 flex   bg-[#111B21]  ">{<Outlet />}</div>
              </div>
            </SheetContent>
          </Sheet>
          {isUserDetails ? (
            <div className="bg-[#202C33] p-4 flex w-full items-center justify-between">
              <p className="text-2xl font-bold">Contact Info</p>
              {detailsLoading ? (
                <Skeleton baseColor="#111B21" className="w-32 h-9" />
              ) : (
                displayItem?.chat === null && (
                  <Button
                    onClick={sendFriendRequest}
                    className="hover:bg-[#182435]"
                  >
                    Send Request
                  </Button>
                )
              )}
              {displayItem?.chat !== null &&
                displayItem?.chat.request.status === "sended" &&
                displayItem?.chat.request.to === selectedUser?._id && (
                  <Button className="hover:bg-[#182435] ">
                    Request Sended
                  </Button>
                )}
              {displayItem?.chat !== null &&
                displayItem?.chat.request.status === "sended" &&
                displayItem?.chat.request.to !== selectedUser?._id && (
                  <Button
                    onClick={acceptFriendRequest}
                    className="hover:bg-[#182435]"
                  >
                    Accept Request
                  </Button>
                )}
              {displayItem?.chat !== null &&
                displayItem?.chat.request.status === "accepted" && (
                  <Button
                    disabled
                    className="hover:bg-[#182435] cursor-not-allowed "
                  >
                    Request Accepted
                  </Button>
                )}
            </div>
          ) : isGroupChat ? (
            <Sheet>
              <SheetTrigger asChild>
                <div className="bg-[#202C33] px-4  py-2 flex items-center justify-between cursor-pointer">
                  <div className="flex   items-center space-x-4 ">
                    <img
                      src={displayItem?.groupPicture}
                      className="w-12 h-12 object-cover border border-slate-600 rounded-full"
                      alt={displayItem?.chatName}
                    />
                    <div className="flex flex-col space-y-1">
                      <p className="text-xl font-semibold">
                        {displayItem?.chatName}
                      </p>
                      <div className="flex  items-center space-x-2 ">
                        {groupMembers?.users
                          ?.slice(0, 3)
                          ?.sort((a, b) =>
                            a?.fullname?.localeCompare(b?.fullname)
                          )
                          .map((member) => (
                            <p
                              className="sm:text-sm text-[10px] font-normal  text-slate-200  "
                              key={member?._id}
                            >
                              {member?._id === user?._id
                                ? "You,"
                                : `${member?.fullname},`}
                            </p>
                          ))}
                        <span>...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent
                className={
                  "flex bg-slate-900 text-white  border-none flex-1 p-0  w-full lg:w-2/6  "
                }
              >
                <div className="flex flex-1 border-t border-slate-700 overflow-y-scroll overflow-x-hidden scroll-smooth scroll flex-col mt-10 ">
                  <div className="flex flex-col justify-center items-center w-full space-y-2 bg-slate-800 my-2 ml-2 px-3 rounded-md">
                    <img
                      className="rounded-full object-cover w-52 h-52"
                      src={displayItem?.groupPicture}
                      alt={displayItem?.chatName}
                    />
                    <p className="text-xl">{displayItem?.chatName}</p>
                  </div>
                  {/* group admin container */}
                  {isGroupAdmin ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setOpenModal(true);
                          }}
                          className="border-none outline-none flex  justify-start bg-slate-800 hover:bg-slate-700  py-8 ml-2  "
                        >
                          <div className="flex items-center cursor-pointer space-x-3 ">
                            <div className="bg-[#00A884] rounded-full w-10  h-10 flex justify-center items-center">
                              <i className=" fa-solid fa-user-plus"></i>
                            </div>
                            <p className="text-lg  font-semibold">
                              Add Members
                            </p>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        setOpenModal={setOpenModal}
                        className="w-[700px] bg-slate-900 text-white overflow-y-scroll h-[90%] overflow-x-hidden scroll border-none"
                      >
                        <div className="flex flex-1 flex-col  border-slate-700/70  p-2 ">
                          <p className="text-xl text-center bg-slate-800 my-4 py-4 rounded-md w-full">
                            Add New Participants to {displayItem?.chatName}
                          </p>
                          {/* search new participants */}
                          <div className="flex flex-col space-y-1">
                            <Label className="text-lg"> Search User </Label>
                            <Input
                              type="text"
                              placeholder="Search User"
                              className="bg-transparent border-slate-700 focus:border-blue-600"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                          {/* selected users lists */}
                          <div className="flex flex-wrap items-center  space-x-3 px-3 my-2">
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
                          {/* users lists to be added to group */}
                          <div className="flex flex-1 flex-col  bg-slate-800/20 p-2 rounded-md  ">
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
                                    <p className="text-[#70818b] text-sm">
                                      {user.email}
                                    </p>
                                  </div>
                                  <div>
                                    <Button
                                      onClick={() => selectUsers(user)}
                                      className="py-1 bg-slate-950 hover:bg-slate-950/70"
                                    >
                                      Click to add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end items-end">
                            <Button
                              onClick={addNewParticipants}
                              className="py-1 mt-2 bg-slate-950 hover:bg-slate-950/70"
                            >
                              {submitText}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <LeaveGroup />
                  )}
                  {/* group members container */}
                  <div className="flex flex-col w-full p-2 space-y-2">
                    {groupMembers?.users?.map((member) => (
                      <div
                        className="flex items-center space-x-3 "
                        key={member?._id}
                      >
                        <img
                          className="w-10 h-10 object-cover rounded-full"
                          src={member.picture}
                          alt={member.fullname}
                        />
                        <div className="flex flex-1 border-b border-slate-700 ">
                          <div className="flex flex-col space-y-1 flex-1">
                            <p>
                              {member._id === user?._id
                                ? "You"
                                : member.fullname}
                            </p>
                            <p className="text-sm text-slate-300 font-thin">
                              {member.about}
                            </p>
                          </div>
                          {displayItem?.groupAdmin?._id === member._id ? (
                            <div className="flex h-full justify-start  ">
                              <p className="text-[10px] font-light border-transparent rounded-md text-green-100 bg-green-600/50  p-2 py-1">
                                Group Admin
                              </p>
                            </div>
                          ) : (
                            displayItem?.groupAdmin._id === user?._id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button className="border-none outline-none">
                                    <i className="fa-solid fa-angle-down text-slate-300 cursor-pointer hover:text-white"></i>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[10rem] mr-2 bg-slate-600 border-none text-white ">
                                  <p
                                    onClick={() =>
                                      handleRemoveFromGroup(member._id)
                                    }
                                    className="text-start text-sm font-light p-2 hover:bg-slate-800 cursor-pointer"
                                  >
                                    Remove From Group
                                  </p>

                                  <ViewUser member={member} />
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>{isGroupAdmin && <DeleteGroup />}</div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="bg-[#202C33] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={displayItem?.user.picture}
                  className="w-12 h-12 object-cover rounded-full"
                  alt={displayItem?.user.fullname}
                />
                <div className="flex flex-col space-y-1">
                  <p className="text-xl font-semibold">
                    {displayItem?.user.fullname}
                  </p>
                  <div className="flex items-center ">
                    <span
                      className={`flex w-2   h-2 me-3  rounded-full ${IndicatorStyles}`}
                    ></span>
                    <p className="font-light text-slate-200">
                      {isOnline ? "Active Now" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          )}
        </div>
        {isUserDetails ? (
          <div
            style={{
              maxHeight: "calc(739px - 110px)",
            }}
            className="flex flex-col flex-1  space-y-3 overflow-x-hidden overflow-y-scroll scroll "
          >
            <div className="bg-[#202c33bd] mt-3  flex justify-center items-center flex-col space-y-3 py-4">
              {detailsLoading ? (
                <Skeleton
                  className="w-64 h-64 aspect-square rounded-full"
                  baseColor="#111B21"
                />
              ) : (
                <img
                  src={displayItem?.user.picture}
                  className="object-cover w-64 h-64 rounded-full aspect-square"
                  alt={displayItem?.user.fullname}
                />
              )}
              {detailsLoading ? (
                <Skeleton className="w-24 " baseColor="#111B21" />
              ) : (
                <p className="text-xl font-normal">
                  {displayItem?.user.fullname}
                </p>
              )}
              {detailsLoading ? (
                <Skeleton baseColor="#111B21" className="w-52" />
              ) : (
                <p className="text-lg font-light text-slate-300">
                  {displayItem?.user.phoneNumber.trim() !== ""
                    ? displayItem?.user.phoneNumber
                    : displayItem?.user.email}
                </p>
              )}
            </div>
            <div className=" bg-[#202C33] flex flex-col px-3 py-2 space-y-1">
              <p className="text-xl font-bold  text-slate-300">About</p>
              {detailsLoading ? (
                <Skeleton baseColor="#111B21" className="w-1/2 h-4" />
              ) : (
                <p className="text-xl font-normal">{displayItem?.user.about}</p>
              )}
            </div>
            <div className="flex w-full flex-col px-3 py-2 space-y-2 bg-[#202C33]">
              <p className="text-xl font-bold text-slate-300">
                Groups In common ({displayItem?.groupsInCommon?.length})
              </p>
              {displayItem?.groupsInCommon?.length > 0 ? (
                <CommonGroupsOfSelectedUser
                  groups={displayItem?.groupsInCommon}
                />
              ) : (
                "No common groups"
              )}
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                maxHeight: "calc(90vh - 88px)",
              }}
              className="flex flex-1 flex-col py-3 "
            >
              <div className="flex flex-col space-y-2 px-1   sm:px-5  flex-1  overflow-x-hidden overflow-y-scroll scroll scroll-smooth ">
                {isMessagesLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={`${
                          index % 2 === 0 ? "justify-end" : "justify-start"
                        } flex w-full   `}
                      >
                        <MessageSkeleton index={index} />
                      </div>
                    ))
                  : messages?.length > 0 &&
                    messages?.map((message) => (
                      <Message
                        key={message._id}
                        messageId={message?._id}
                        id={message.sender._id}
                        picture={message.sender.picture}
                        name={message.sender.fullname}
                        date={message.createdAt}
                        message={message.message}
                        receiverId={message.receiverId}
                        shake={message.shouldShake}
                        starredBy={message.starredBy}
                        chatId={message.chatId}
                        isEdited={message.isEdited}
                      />
                    ))}
                {messages?.length === 0 && (
                  <div className="flex flex-1 justify-center items-center text-lg font-semibold italic">
                    Be the first to start conversation
                  </div>
                )}
              </div>
            </div>
            {isGroupChat ? (
              <MessageForm
                onSubmit={onGroupMessageSend}
                onChange={onGroupMessageChange}
                ref={ref}
                {...rest}
              />
            ) : (
              <MessageForm
                onSubmit={onMessageSent}
                onChange={onMessageChange}
                ref={ref}
                {...rest}
              />
            )}
          </>
        )}
      </div>
    );
  }
);
export default SelectedItem;
