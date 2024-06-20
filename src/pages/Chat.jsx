import React, { useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import { Outlet } from "react-router-dom";
import Details from "./Details";
import { useQuery, useQueryClient } from "react-query";
import { fetchData } from "@/api/fetchData";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSocketContext } from "@/context/SocketContext";
import notificationTone from "@/assets/sounds/notification.mp3";
import toast from "react-hot-toast";
const Chat = () => {
  const { socket } = useSocketContext();
  const { user, setNotificationsLength } = useGlobalContext();
  const queryClient = useQueryClient();
  const sound = new Audio(notificationTone);
  const { data: notifications } = useQuery(["notifications", user?._id], () =>
    fetchData("notifications")
  );
  useEffect(() => {
    setNotificationsLength(notifications?.length);
  }, [setNotificationsLength, notifications?.length]);
  const handleGroupNotifications = (notification) => {
    if (notification) {
      sound.play();
      setNotificationsLength((prev) => prev + 1);
      toast.success(notification.message);
      queryClient.invalidateQueries(["notifications", user?._id]);
    }
  };
  const handleRequestReceived = (notification) => {
    if (notification) {
      sound.play();
      setNotificationsLength((prev) => prev + 1);
      toast.success(notification.message);
      queryClient.setQueryData(
        ["notifications", user?._id],
        (notifications) => {
          if (!notifications) {
            return [notification];
          } else {
            return [notification, ...notifications];
          }
        }
      );
    }
  };
  const handleAcceptRequest = (notification) => {
    if (notification) {
      sound.play();
      setNotificationsLength((prev) => prev + 1);
      toast.success(notification.message);
      queryClient.invalidateQueries(["user-details", user?._id]);
      queryClient.setQueryData(
        ["notifications", user?._id],
        (notifications) => {
          if (!notifications) {
            return [notification];
          } else {
            return [notification, ...notifications];
          }
        }
      );
    }
  };
  const handleLeaveGroup = ({ notification, chatId }) => {
    if (notification) {
      toast.success(notification.message);
      setNotificationsLength((prev) => prev + 1);
      queryClient.invalidateQueries(["notifications", notification?.to]);
      queryClient.invalidateQueries(["single-group", chatId]);
      queryClient.invalidateQueries("groups");
    }
  };
  const handleNewParticipantsToGroup = ({ notification, chatId }) => {
    if (notification) {
      setNotificationsLength((prev) => prev + 1);
      toast.success(notification.message);
      queryClient.invalidateQueries(["notifications", notification.to]);
      queryClient.invalidateQueries("groups");
      queryClient.invalidateQueries(["single-group", chatId]);
    }
  };
  useEffect(() => {
    socket?.on("groupRequest", handleGroupNotifications);
    socket?.on("request-notification", handleRequestReceived);
    socket?.on("request-accepted", handleAcceptRequest);
    socket?.on("leave-group-notification", handleLeaveGroup);
    socket?.on("new-participants-to-group", handleNewParticipantsToGroup);
    return () => {
      socket?.off("groupRequest", handleGroupNotifications);
      socket?.off("request-accepted", handleAcceptRequest);
      socket?.off("request-notification", handleRequestReceived);
      socket?.off("leave-group-notification", handleLeaveGroup);
      socket?.off("new-participants-to-group", handleNewParticipantsToGroup);
    };
  }, [
    socket,
    toast,
    queryClient,
    user,
    handleAcceptRequest,
    handleGroupNotifications,
    handleRequestReceived,
    handleLeaveGroup,
    setNotificationsLength,
    handleNewParticipantsToGroup,
  ]);
  return (
    <div className="flex flex-1 lg:p-2 p-1 overflow-hidden text-white ">
      <div className=" hidden lg:flex  ">
        <Sidebar />
      </div>
      <div className="lg:flex lg:flex-[0.5]  hidden bg-[#111B21]  ">
        {<Outlet />}
      </div>
      <div className="flex flex-1  space-x-3 ">
        <Details />
      </div>
    </div>
  );
};

export default Chat;
