import { createContext, useState, useEffect, useContext } from "react";
import { useGlobalContext } from "./GlobalContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useGlobalContext();
  const socketDevURL = import.meta.env.VITE_DEV_SOCKET_URL;
  const socketProdURL = import.meta.env.VITE_PRODUCTION_SOCKET_URL;
  const BASE_SOCKET_URL =
    import.meta.env.MODE === "production" ? socketProdURL : socketDevURL;
  useEffect(() => {
    if (user) {
      const socket = io(BASE_SOCKET_URL, {
        query: {
          userId: user._id,
        },
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      setSocket(socket);
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, BASE_SOCKET_URL]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
