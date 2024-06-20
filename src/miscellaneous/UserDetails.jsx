import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSocketContext } from "@/context/SocketContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "@/api/fetchData";
import { postData } from "@/api/postData";
import toast from "react-hot-toast";
import { updateData } from "@/api/updateData";
import SelectedItem from "@/components/ui/SelectedItem";

const UserDetails = () => {
  const { selectedUser } = useGlobalContext();
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const { data: user, isLoading: detailsLoading } = useQuery(
    ["user-details", selectedUser?._id],
    () => fetchData(`user/user/${selectedUser?._id}`)
  );

  const sendRequestMutation = useMutation(() =>
    postData(`chat/request/${selectedUser?._id}`, null)
  );
  const sendRequest = async () => {
    const data = await sendRequestMutation.mutateAsync();
    if (data) {
      toast.success("Request sent successfully");
      queryClient.invalidateQueries(["user-details", selectedUser?._id]);
    }
  };
  const updateChatStatusMutation = useMutation(() =>
    updateData(`chat/update-status/${user?.chat._id}`, null)
  );
  const handleAcceptRequest = async () => {
    const data = await updateChatStatusMutation.mutateAsync();
    if (data) {
      queryClient.invalidateQueries(["user-details", selectedUser?._id]);
    }
  };
  useEffect(() => {
    socket?.on("request-sended", (data) => {
      if (data)
        queryClient.invalidateQueries(["user-details", selectedUser?._id]);
    });

    return () => {
      socket?.off("request-sended");
    };
  }, [socket, queryClient, selectedUser]);
  return (
    <SelectedItem
      isUserDetails={true}
      displayItem={user && user}
      isGroupChat={false}
      sendFriendRequest={sendRequest}
      acceptFriendRequest={handleAcceptRequest}
      detailsLoading={detailsLoading}
    />
  );
};

export default UserDetails;
