import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSocketContext } from "@/context/SocketContext";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { postData } from "@/api/postData";
import { fetchData } from "@/api/fetchData";
import SelectedItem from "@/components/ui/SelectedItem";
import notification from "../assets/sounds/notification.mp3";
import sendMessageAudio from "../assets/sounds/sentMessage.mp3";

const SelectedChat = () => {
  const { selectedChat, user, setSelectedStarred } = useGlobalContext();
  const { onlineUsers, socket } = useSocketContext();

  const [isTyping, setIsTyping] = useState(null);

  const queryClient = useQueryClient();
  const selectedChatId = selectedChat?._id;
  const receiverId = selectedChat?.user?._id;

  const isOnline = useMemo(
    () => onlineUsers?.some((u) => u === receiverId),
    [onlineUsers, receiverId]
  );

  const form = useForm({
    defaultValues: { message: "" },
  });
  const { handleSubmit, register, reset, setValue, watch } = form;
  const messageValue = watch("message");

  // Queries
  const fetchMessages = useCallback(
    () => fetchData(`message/${selectedChatId}`),
    [selectedChatId]
  );
  const {
    data: messages,
    isLoading: isMessagesLoading,
    isError,
  } = useQuery(["messages", selectedChatId], fetchMessages, {
    // enabled: !!selectedChatId,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  // Mutations
  const sendMessageMutation = useMutation(
    (message) => postData(`message/${selectedChatId}`, { message, receiverId }),
    {
      onMutate: () => {
        reset();
        new Audio(sendMessageAudio).play();
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["archives", user?._id]);
        queryClient.invalidateQueries(["messages", selectedChatId]);
      },
    }
  );

  const sendMessage = useCallback(
    async ({ message }) => {
      setSelectedStarred(null);
      if (message.trim() === "") return;
      await sendMessageMutation.mutateAsync(message);
      queryClient.invalidateQueries(["chats", user?._id]);
    },
    [sendMessageMutation, setSelectedStarred, queryClient, user?._id]
  );

  // Effects
  useEffect(() => {
    const handleTyping = () => {
      socket?.emit("typing", { receiver: selectedChat?.user, sender: user });
    };
    const typingTimer = setTimeout(handleTyping, 1000);

    return () => clearTimeout(typingTimer);
  }, [socket, user, selectedChat, messageValue]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setSelectedStarred(null);
      message.shouldShake = true;
      if (user?._id !== message?.sender._id) {
        new Audio(notification).play();
      }
      queryClient.setQueryData(
        ["messages", selectedChatId],
        (prevMessages = []) => [...prevMessages, message]
      );
    };

    const handleTyping = ({ name }) => setIsTyping(name);

    socket?.on("newMessage", handleNewMessage);
    socket?.on("typing", handleTyping);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("typing", handleTyping);
    };
  }, [socket, queryClient, selectedChatId, setSelectedStarred, user]);

  // Styles
  const IndicatorStyles = useMemo(
    () =>
      isOnline ? "bg-green-500 animate-pulse" : "bg-red-500 animate-bounce",
    [isOnline]
  );

  // Function Return
  return (
    <FormProvider {...form}>
      <SelectedItem
        isGroupChat={false}
        isUserDetails={false}
        IndicatorStyles={IndicatorStyles}
        messages={messages}
        isOnline={isOnline}
        displayItem={selectedChat}
        onMessageSent={handleSubmit(sendMessage)}
        isMessagesLoading={isMessagesLoading || isError}
        onGroupMessageChange={useCallback(
          (e) => setValue("message", e.target.value),
          [setValue]
        )}
        {...register("message")}
      />
    </FormProvider>
  );
};

export default SelectedChat;
