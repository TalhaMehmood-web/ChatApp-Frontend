import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMutation, useQueryClient } from "react-query";
import { deleteData } from "@/api/deleteData";
import toast from "react-hot-toast";
const DeleteGroup = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { selectedGroup, setSelectedGroup, user } = useGlobalContext();
  const queryClient = useQueryClient();
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDialog) {
        setOpenDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDialog]);
  const deletedGroupMutation = useMutation(
    () => deleteData(`chat/group/${selectedGroup?._id}`),
    {
      onMutate: () => {
        setOpenDialog(false);
        setSelectedGroup(null);
      },
      onSuccess: (data) => {
        if (data) {
          toast.success("Group Deleted Successfully");
          queryClient.invalidateQueries("groups");
          queryClient.invalidateQueries(["starred", user?._id]);
        }
      },
    }
  );
  const deletedGroup = async () => {
    await deletedGroupMutation.mutateAsync();
  };
  return (
    <>
      <Dialog open={openDialog}>
        <DialogContent
          setOpenModal={setOpenDialog}
          className="w-[500px]   gap-0 h-fit bg-slate-800 text-white border-none px-5 py-8"
        >
          <div className="flex flex-1 flex-col justify-center space-y-5">
            <p>
              If you delete the group then all the messages of this chat will be
              deleted Permanently. <br />
              Press Confirm when you are done.
            </p>
            <div className="flex items-center w-full justify-between">
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                onClick={deletedGroup}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => setOpenDialog(true)}
        className="flex  justify-start items-center  bg-red-700/40  space-x-4 text-lg w-full py-7 cursor-pointer hover:bg-red-700/70 duration-300 px-5 ml-3 rounded-md"
      >
        <div className="w-10 h-10 rounded-full flex justify-center items-center bg-red-600  ">
          <i className="fa-regular fa-trash-can "></i>
        </div>
        <p>Delete Group</p>
      </Button>
    </>
  );
};

export default DeleteGroup;
