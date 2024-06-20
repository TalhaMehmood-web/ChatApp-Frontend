import React, { useState, useEffect } from "react";
import { Button } from "./button";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMutation, useQueryClient } from "react-query";
import { updateData } from "@/api/updateData";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const LeaveGroup = () => {
  const queryClient = useQueryClient();
  const { selectedGroup, setSelectedGroup } = useGlobalContext();
  const [openDialog, setOpenDialog] = useState(false);
  const leaveGroupMutation = useMutation(
    () => updateData(`chat/leave-group/${selectedGroup?._id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
        setOpenDialog(false);
        setSelectedGroup(null);
      },
    }
  );
  const handleLeaveGroup = async () => {
    await leaveGroupMutation.mutateAsync();
  };
  // refetch singleGroup
  // refetch groups
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
  return (
    <>
      <Dialog open={openDialog}>
        <DialogContent
          setOpenModal={setOpenDialog}
          className="w-[500px]   gap-0 h-fit bg-slate-800 text-white border-none px-5 py-8"
        >
          <div className="flex flex-1 flex-col justify-center space-y-5">
            <p>
              If you leave the group you will be removed from{" "}
              {selectedGroup?.chatName} permanently.
            </p>
            <div className="flex items-center w-full justify-between">
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                onClick={handleLeaveGroup}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        type="button"
        onClick={() => setOpenDialog(true)}
        className="flex items-center bg-red-600 text-lg cursor-pointer py-7 hover:bg-red-700 duration-200 justify-start px-4 space-x-3 ml-2 "
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <p>Leave Group</p>
      </Button>
    </>
  );
};

export default LeaveGroup;
