import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notificationsLength, setNotificationsLength] = useState(0);
  const [selectedStarred, setSelectedStarred] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [OTP, setOTP] = useState("");
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        selectedUser,
        setSelectedUser,
        selectedGroup,
        setSelectedGroup,
        notificationsLength,
        setNotificationsLength,
        selectedStarred,
        setSelectedStarred,
        openSidebar,
        setOpenSidebar,
        OTP,
        setOTP,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
