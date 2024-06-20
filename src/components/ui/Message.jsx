import React, { useRef, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { formatTimestamp } from "@/utils/DateFormat";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "react-query";
import { updateData } from "@/api/updateData";
import toast from "react-hot-toast";
import { Input } from "./input";
import { useForm } from "react-hook-form";
import { useSocketContext } from "@/context/SocketContext";
const Message = ({
  picture,
  id,
  name,
  message,
  date,
  receiverId,
  shake,
  messageId,
  starredBy,
  chatId,
  isEdited,
}) => {
  const { user, selectedStarred, setSelectedStarred } = useGlobalContext();
  const queryClient = useQueryClient();
  const lastMessageRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false); // classes
  const [openDialog, setOpenDialog] = useState(false);
  const { socket } = useSocketContext();
  const form = useForm({
    defaultValues: {
      text: message,
    },
  });
  const { handleSubmit, register } = form;
  const isLoggedUserMessage =
    user?._id === id ? "justify-end " : "justify-start ";
  const bgColor = user?._id === id ? "bg-[#005C4B] " : "bg-[#202C33]";
  // effects
  useEffect(() => {
    if (!selectedStarred) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
    if (selectedStarred && selectedStarred === messageId) {
      setTimeout(() => {
        const starredMessage = document.getElementById("starred");
        starredMessage?.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
  }, [selectedStarred, messageId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        lastMessageRef.current &&
        !lastMessageRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
        setOpenDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);
  const shouldShake = user?._id === receiverId && shake && "shake";
  // mutations
  const starMessageMutation = useMutation(
    () => updateData(`message/${messageId}`),
    {
      onMutate: () => {
        setOpenDropdown(false);
      },
      onError: (error) => {
        if (error) {
          toast.error(error.response.data.message);
        }
      },
      onSuccess: ({ data }) => {
        if (data) {
          queryClient.invalidateQueries(["starred", user?._id]);
          queryClient.invalidateQueries(["messages", chatId]);
          toast.success("Message added to Starred");
        }
      },
    }
  );
  const removedFromStarredMutation = useMutation(
    () => updateData(`message/unstar/${messageId}/${user?._id}`, {}),
    {
      onMutate: () => {
        setOpenDropdown(false);
      },
      onSuccess: ({ data }) => {
        if (data) {
          toast.success("Message removed from starred", {
            position: "bottom-left",
          });
          setSelectedStarred(null);
          queryClient.invalidateQueries(["messages", chatId]);
          queryClient.invalidateQueries(["starred", user?._id]);
        }
      },
    }
  );
  const editMessageMutation = useMutation(
    async (data) =>
      await updateData(`message/edit/${messageId}/${chatId}`, data),
    {
      onMutate: () => {
        setOpenDialog(false);
      },
      onSuccess: ({ data }) => {
        if (data) {
          queryClient.invalidateQueries(["messages", chatId]);
          toast.success("Message edited");
        }
      },
    }
  );
  // handlers
  const starMessage = async () => {
    await starMessageMutation.mutateAsync();
  };
  const removedFromStarred = async () => {
    await removedFromStarredMutation.mutateAsync();
  };
  const editMessage = async (data) => {
    if (data.text.trim() === message.trim()) {
      return toast.error("Nothing to update", {
        position: "bottom-center",
      });
    }
    await editMessageMutation.mutateAsync(data);
  };
  //  socket effects
  useEffect(() => {
    socket?.on("updated-message", (users) => {
      queryClient.invalidateQueries(["messages", chatId]);
    });
    return () => {
      socket?.off("updated-message");
    };
  }, [socket, queryClient, chatId]);
  return (
    <div
      ref={lastMessageRef}
      id={
        selectedStarred?.toString() === messageId.toString()
          ? "starred"
          : undefined
      }
      className={`w-full flex   ${isLoggedUserMessage}   ${shouldShake} `}
    >
      <div
        className={` w-[90%] sm:w-1/2 ${isLoggedUserMessage} flex space-x-2  `}
      >
        <img
          src={picture}
          className="w-8 h-8 object-cover rounded-full"
          alt={name}
        />
        <div className="">
          <p className="text-sm text-slate-300">{name}</p>
          <div
            className={`${bgColor} ${
              selectedStarred &&
              selectedStarred === messageId &&
              ` animate-pulse ${
                user?._id === id ? "bg-[#17463d]" : " bg-[#091216]"
              }   `
            } px-3 flex flex-col space-y-1 py-2 rounded-md`}
          >
            <div className="flex w-full justify-between space-x-3 ">
              <p className="text-wrap  break-normal">{message}</p>
              <DropdownMenu open={openDropdown}>
                <DropdownMenuTrigger asChild>
                  <i
                    onClick={() => setOpenDropdown(true)}
                    className="fa-solid fa-angle-down text-sm cursor-pointer text-slate-300 hover:text-white "
                  ></i>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[10rem] flex flex-col divide-y-2 divide-slate-500/50 mr-3 sm:mr-16  bg-slate-600 border-none text-white ">
                  {starredBy?.includes(user?._id) ? (
                    <p
                      onClick={removedFromStarred}
                      className="text-start text-sm font-semibold p-2 hover:bg-slate-800 cursor-pointer"
                    >
                      Unstar
                    </p>
                  ) : (
                    <p
                      onClick={starMessage}
                      className="text-start text-sm font-semibold p-2 hover:bg-slate-800 cursor-pointer"
                    >
                      Star
                    </p>
                  )}
                  {id == user?._id && (
                    <p
                      onClick={() => setOpenDialog(true)}
                      className="text-start text-sm font-semibold p-2 hover:bg-slate-800 cursor-pointer"
                    >
                      Edit
                    </p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-1 pl-7 w-full justify-end ">
              {starredBy?.includes(user?._id) && (
                <i className="fa-solid fa-star text-[7px]"></i>
              )}
              {isEdited && (
                <p className="text-[10px] text-slate-300">Edited,</p>
              )}
              <p className="text-[10px]  ">{formatTimestamp(date)}</p>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openDialog}>
        <DialogContent
          setOpenModal={setOpenDialog}
          className="w-[500px]   gap-0 h-[40%] bg-[#202C33] text-white border-none p-3"
        >
          <div className="flex flex-1 flex-col space-y-2">
            <p className="text-xl text-center w-full font-semibold">
              Edit Message
            </p>
            <div className="flex flex-1  bg-slate-900 justify-center items-center px-3">
              <div className="flex items-start space-x-1">
                <img
                  src={picture}
                  className="w-10 h-10 object-cover rounded-full"
                  alt={name}
                />
                <div className="flex flex-col flex-1 space-y-1 ">
                  <p>{name}</p>
                  <div className="bg-[#005C4B] rounded-md px-2 py-1 flex flex-col space-y-2">
                    <p className="">{message}</p>
                    <p className="text-[10px] w-full text-end pl-7">
                      {formatTimestamp(date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(editMessage)}
              noValidate
              className="flex w-full m-0 p-0  items-center space-x-2"
            >
              <Input
                className="flex-flex-1 bg-slate-700 border-slate-900 "
                type="text"
                placeholder="Type a message "
                name="message"
                id="message"
                {...register("text")}
              />
              <Button type="submit">
                <i className="fa-solid fa-check"></i>
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Message;
