import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { GlobalContextProvider } from "./context/GlobalContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </GlobalContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
