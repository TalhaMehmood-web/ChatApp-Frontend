import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { useNavigate } from "react-router-dom";
const ViewUser = ({ member }) => {
  const navigate = useNavigate();
  const { setSelectedGroup, setSelectedUser } = useGlobalContext();
  const navigateToUser = () => {
    setSelectedGroup(null);
    navigate("/chats/users");
    setSelectedUser(member);
  };
  return (
    <p
      onClick={navigateToUser}
      className="text-start hover:bg-slate-800 p-2 text-sm font-light cursor-pointer"
    >
      {`View ${member.fullname}`}
    </p>
  );
};

export default ViewUser;
