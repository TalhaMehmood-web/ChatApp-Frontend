import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useForm, FormProvider } from "react-hook-form";
import { postData } from "@/api/postData";
import { useMutation, useQuery, useQueryClient } from "react-query";
import notification from "../assets/sounds/notification.mp3";
import sendMessageAudio from "../assets/sounds/sentMessage.mp3";
import toast from "react-hot-toast";
import { updateData } from "@/api/updateData";
import { fetchData } from "@/api/fetchData";
import { useSocketContext } from "@/context/SocketContext";
import SelectedItem from "@/components/ui/SelectedItem";

const SelectedGroup = () => {
  const queryClient = useQueryClient();
  const { selectedGroup, user, setSelectedStarred } = useGlobalContext();
  const { socket } = useSocketContext();

  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUsers, setFilterUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitText, setSubmitText] = useState("Submit");

  const form = useForm({ defaultValues: { message: "" } });
  const { handleSubmit, register, reset, setValue, watch } = form;
  const messageValue = watch("message");

  const selectedGroupId = selectedGroup?._id;
  const isGroupAdmin = selectedGroup?.groupAdmin._id === user?._id;

  // Queries
  const fetchNewParticipants = useCallback(
    () => fetchData(`chat/participants/${selectedGroupId}`),
    [selectedGroupId]
  );
  const fetchSingleGroup = useCallback(
    () => fetchData(`chat/group/${selectedGroupId}`),
    [selectedGroupId]
  );
  const fetchMessages = useCallback(
    () => fetchData(`message/${selectedGroupId}`),
    [selectedGroupId]
  );

  const { data: newParticipants } = useQuery(
    ["newParticipants", selectedGroupId],
    fetchNewParticipants,
    { enabled: !!selectedGroupId }
  );
  const { data: singleGroup } = useQuery(
    ["single-group", selectedGroupId],
    fetchSingleGroup,
    { enabled: !!selectedGroupId }
  );
  const { data: messages, isLoading: isMessagesLoading } = useQuery(
    ["messages", selectedGroupId],
    fetchMessages,
    { enabled: !!selectedGroupId }
  );

  // Mutations
  const sendMessageMutation = useMutation(
    async (message) => {
      const userIds = singleGroup?.users?.map((user) => user._id);
      return await postData(`message/group/${selectedGroupId}`, {
        message,
        receivers: JSON.stringify(userIds),
      });
    },
    {
      onMutate: () => {
        reset();
        new Audio(sendMessageAudio).play();
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", selectedGroupId]);
        queryClient.invalidateQueries(["archives", user?._id]);
      },
    }
  );

  const removeFromGroupMutation = useMutation(
    async (userId) =>
      updateData(`chat/group/${selectedGroupId}`, {
        userToBeRemovedId: userId,
      }),
    {
      onSuccess: () => {
        toast.success("User removed from group");
        queryClient.invalidateQueries(["newParticipants", selectedGroupId]);
        queryClient.invalidateQueries("groups");
        queryClient.invalidateQueries(["single-group", selectedGroupId]);
      },
    }
  );

  const handleAddNewParticipantsMutation = useMutation(
    async () => {
      const userIds = selectedUsers?.map((user) => user._id);
      return await updateData(`chat/group-add/${selectedGroupId}`, {
        users: JSON.stringify(userIds),
      });
    },
    {
      onMutate: () => setSubmitText("Submitting.."),
      onSuccess: () => {
        setSubmitText("Submitted");
        queryClient.invalidateQueries(["newParticipants", selectedGroupId]);
        queryClient.invalidateQueries(["single-group", selectedGroupId]);
        toast.success(
          `${selectedUsers?.length} New ${
            selectedUsers.length > 0 ? "users" : "user"
          } added to ${selectedGroup?.chatName}`
        );
        setSelectedUsers([]);
        setTimeout(() => setSubmitText("Submit"), 2000);
      },
    }
  );

  // Handlers
  const sendMessage = useCallback(
    async ({ message }) => {
      setSelectedStarred(null);
      if (!message) return null;
      await sendMessageMutation.mutateAsync(message);
      queryClient.invalidateQueries("groups");
    },
    [sendMessageMutation, setSelectedStarred, queryClient]
  );

  const handleRemoveFromGroup = useCallback(
    async (userId) => {
      await removeFromGroupMutation.mutateAsync(userId);
    },
    [removeFromGroupMutation]
  );

  const selectUsers = useCallback(
    (user) => {
      const isUserSelected = selectedUsers.some((u) => u._id === user._id);
      if (!isUserSelected) {
        setSelectedUsers((prevUsers) => [...prevUsers, user]);
      }
    },
    [selectedUsers]
  );

  const excludeFromDisplay = useCallback((user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((u) => u._id !== user._id)
    );
  }, []);

  const addNewParticipants = useCallback(async () => {
    if (selectedUsers?.length === 0) {
      return toast.error("No user to be added");
    }
    await handleAddNewParticipantsMutation.mutateAsync();
  }, [selectedUsers, handleAddNewParticipantsMutation]);

  // Effects
  useEffect(() => {
    if (newParticipants?.length > 0) {
      setFilterUsers(() =>
        newParticipants.filter((user) =>
          user.fullname.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilterUsers([]);
    }
  }, [newParticipants, search]);

  useEffect(() => {
    const handleGroupMessage = (message) => {
      message.shouldShake = true;
      if (user?._id !== message?.sender._id) {
        new Audio(notification).play();
      }
      if (message.chatId === selectedGroupId) {
        queryClient.setQueryData(
          ["messages", selectedGroupId],
          (prevMessages = []) => [...prevMessages, message]
        );
      }
    };

    socket?.on("groupMessage", handleGroupMessage);
    return () => {
      socket?.off("groupMessage", handleGroupMessage);
    };
  }, [socket, queryClient, selectedGroupId, user]);

  return (
    <FormProvider {...form}>
      <SelectedItem
        isGroupChat={true}
        isUserDetails={false}
        messages={messages}
        displayItem={selectedGroup}
        groupMembers={singleGroup}
        isGroupAdmin={isGroupAdmin}
        setOpenModal={setOpenModal}
        search={search}
        setSearch={setSearch}
        selectedUsers={selectedUsers}
        filterUsers={filterUsers}
        selectUsers={selectUsers}
        excludeFromDisplay={excludeFromDisplay}
        addNewParticipants={addNewParticipants}
        submitText={submitText}
        handleRemoveFromGroup={handleRemoveFromGroup}
        onGroupMessageSend={handleSubmit(sendMessage)}
        isMessagesLoading={isMessagesLoading}
        onGroupMessageChange={useCallback(
          (e) => setValue("message", e.target.value),
          [setValue]
        )}
        {...register("message")}
      />
    </FormProvider>
  );
};

export default SelectedGroup;
